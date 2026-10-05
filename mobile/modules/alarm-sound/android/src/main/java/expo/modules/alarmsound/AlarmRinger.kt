package expo.modules.alarmsound

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioManager
import android.media.AudioTrack
import android.media.MediaPlayer
import android.media.RingtoneManager
import android.net.Uri
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.os.PowerManager
import android.os.SystemClock
import org.json.JSONArray
import org.json.JSONObject
import kotlin.math.max
import kotlin.math.sin

private const val CHANNEL_ID = "tvea-alarms"
private const val NOTIF_ID = 41021

/** Alarm-stream tone and heads-up. Safe to call from a background alarm broadcast. */
object AlarmRinger {
  private val mainHandler = Handler(Looper.getMainLooper())
  private val gate = Any()
  @Volatile private var generation = 0
  private var track: AudioTrack? = null
  private var player: MediaPlayer? = null
  private var focusListener: AudioManager.OnAudioFocusChangeListener? = null
  private var focusRequest: android.media.AudioFocusRequest? = null
  private var wakeLock: PowerManager.WakeLock? = null
  private var stopRunnable: Runnable? = null
  @Volatile private var lockContext: Context? = null

  fun prepare(context: Context) {
    ensureChannel(context.applicationContext)
  }

  fun phoneSoundsJson(context: Context): String {
    return try {
      collectPhoneSounds(context)
    } catch (_: Exception) {
      "[]"
    }
  }

  private fun collectPhoneSounds(context: Context): String {
    val array = JSONArray()
    val seen = HashSet<String>()
    fun add(title: String, uri: Uri?) {
      if (uri == null || array.length() >= 60) return
      val text = uri.toString()
      if (!text.startsWith("content:") && !text.startsWith("android.resource:")) return
      if (!seen.add(text)) return
      array.put(JSONObject().put("title", title.ifBlank { "Alarm sound" }).put("uri", text))
    }
    val manager = RingtoneManager(context.applicationContext)
    val fallback = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
    add("Phone default alarm", fallback)
    manager.setType(RingtoneManager.TYPE_ALARM)
    val cursor = manager.cursor
    if (cursor != null) {
      var index = 0
      while (index < cursor.count && array.length() < 60) {
        val title = if (cursor.moveToPosition(index)) {
          cursor.getString(RingtoneManager.TITLE_COLUMN_INDEX) ?: "Alarm sound"
        } else {
          "Alarm sound"
        }
        add(title, manager.getRingtoneUri(index))
        index += 1
      }
    }
    return array.toString()
  }

  fun start(context: Context, rawSeconds: Int, tone: String = "chime", uri: String = "") {
    val app = context.applicationContext
    lockContext = app
    val seconds = rawSeconds.coerceIn(1, 300)
    stopTone()
    ensureChannel(app)
    val sampleRate = 22050
    val minBuf = AudioTrack.getMinBufferSize(
      sampleRate,
      AudioFormat.CHANNEL_OUT_MONO,
      AudioFormat.ENCODING_PCM_16BIT
    )
    val attributes = AudioAttributes.Builder()
      .setUsage(AudioAttributes.USAGE_ALARM)
      .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
      .build()
    val format = AudioFormat.Builder()
      .setSampleRate(sampleRate)
      .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
      .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
      .build()
    val audio = try {
      AudioTrack.Builder()
        .setAudioAttributes(attributes)
        .setAudioFormat(format)
        .setBufferSizeInBytes(max(minBuf, sampleRate))
        .setTransferMode(AudioTrack.MODE_STREAM)
        .build()
    } catch (_: Exception) {
      return
    }
    val manager = app.getSystemService(Context.AUDIO_SERVICE) as AudioManager
    val listener = AudioManager.OnAudioFocusChangeListener { }
    focusListener = listener
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val request = android.media.AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT)
        .setAudioAttributes(attributes)
        .setOnAudioFocusChangeListener(listener)
        .build()
      focusRequest = request
      manager.requestAudioFocus(request)
    } else {
      @Suppress("DEPRECATION")
      manager.requestAudioFocus(listener, AudioManager.STREAM_ALARM, AudioManager.AUDIOFOCUS_GAIN_TRANSIENT)
    }
    val power = app.getSystemService(Context.POWER_SERVICE) as PowerManager
    val lock = power.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "tvea:alarm")
    lock.setReferenceCounted(false)
    lock.acquire(seconds * 1000L + 2000L)
    val gen = synchronized(gate) {
      generation += 1
      track = audio
      wakeLock = lock
      generation
    }
    val usePhone = tone == "phone" || uri.startsWith("content:") || uri.startsWith("android.resource:")
    if (usePhone) {
      try {
        audio.release()
      } catch (_: Exception) {
        /* unused track */
      }
      synchronized(gate) {
        if (track === audio) track = null
      }
      if (!startPhone(app, uri, gen)) {
        stopTone()
        return
      }
    } else {
      try {
        audio.play()
      } catch (_: Exception) {
        stopTone()
        return
      }
    }
    val deadline = SystemClock.elapsedRealtime() + seconds * 1000L
    if (!usePhone) Thread {
      val cycle = softCycle(sampleRate, tone)
      while (generation == gen && SystemClock.elapsedRealtime() < deadline) {
        var offset = 0
        while (generation == gen && offset < cycle.size) {
          val wrote = try {
            audio.write(cycle, offset, cycle.size - offset)
          } catch (_: Exception) {
            -1
          }
          if (wrote <= 0) break
          offset += wrote
        }
      }
      mainHandler.post {
        if (generation == gen) stopTone()
      }
    }.apply {
      name = "tvea-alarm"
      isDaemon = true
      start()
    }
    val task = Runnable {
      if (generation == gen) stopTone()
    }
    synchronized(gate) { stopRunnable = task }
    mainHandler.postDelayed(task, seconds * 1000L + 250L)
  }

  fun show(context: Context, title: String, detail: String) {
    val app = context.applicationContext
    ensureChannel(app)
    val launch = app.packageManager.getLaunchIntentForPackage(app.packageName)
    val pending = if (launch == null) {
      null
    } else {
      PendingIntent.getActivity(
        app,
        0,
        launch,
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
      )
    }
    val safeTitle = title.ifBlank { "Alarm" }
    val builder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      Notification.Builder(app, CHANNEL_ID)
    } else {
      @Suppress("DEPRECATION")
      Notification.Builder(app)
    }
    builder
      .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
      .setContentTitle(safeTitle)
      .setContentText(detail.ifBlank { safeTitle })
      .setStyle(Notification.BigTextStyle().bigText(detail.ifBlank { safeTitle }))
      .setCategory(Notification.CATEGORY_ALARM)
      .setVisibility(Notification.VISIBILITY_PUBLIC)
      .setOngoing(true)
      .setAutoCancel(false)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      builder.setTimeoutAfter(15 * 60 * 1000L)
    }
    if (pending != null) builder.setContentIntent(pending)
    try {
      notifier(app)?.notify(NOTIF_ID, builder.build())
    } catch (_: SecurityException) {
      /* The tone still plays when notifications are off. */
    }
  }

  fun stop(context: Context?) {
    stopTone()
    if (context == null) return
    try {
      notifier(context.applicationContext)?.cancel(NOTIF_ID)
    } catch (_: Exception) {
      /* already gone */
    }
  }

  private fun notifier(context: Context): NotificationManager? {
    return context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
  }

  private fun ensureChannel(context: Context) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
    val manager = notifier(context) ?: return
    val existing = manager.getNotificationChannel(CHANNEL_ID)
    if (existing != null && existing.canBypassDnd()) return
    if (existing != null) manager.deleteNotificationChannel(CHANNEL_ID)
    val channel = NotificationChannel(CHANNEL_ID, "Alarms", NotificationManager.IMPORTANCE_HIGH)
    channel.description = "Medicine, pet, and workout alarms"
    channel.enableVibration(true)
    channel.vibrationPattern = longArrayOf(0, 400, 200, 400)
    channel.lockscreenVisibility = Notification.VISIBILITY_PUBLIC
    channel.setShowBadge(false)
    channel.setBypassDnd(true)
    channel.setSound(null, null)
    manager.createNotificationChannel(channel)
  }

  private fun startPhone(app: Context, rawUri: String, gen: Int): Boolean {
    val parsed = when {
      rawUri.startsWith("content:") || rawUri.startsWith("android.resource:") -> Uri.parse(rawUri)
      else -> RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
    } ?: return false
    val media = MediaPlayer()
    return try {
      media.setAudioAttributes(
        AudioAttributes.Builder()
          .setUsage(AudioAttributes.USAGE_ALARM)
          .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
          .build()
      )
      media.setDataSource(app, parsed)
      media.isLooping = true
      media.setVolume(0.4f, 0.4f)
      media.prepare()
      val kept = synchronized(gate) {
        if (generation != gen) {
          false
        } else {
          player = media
          true
        }
      }
      if (!kept) {
        media.release()
        return false
      }
      media.start()
      true
    } catch (_: Exception) {
      try {
        media.release()
      } catch (_: Exception) {
        /* already released */
      }
      false
    }
  }

  private fun stopTone() {
    val audio: AudioTrack?
    val media: MediaPlayer?
    val lock: PowerManager.WakeLock?
    val task: Runnable?
    synchronized(gate) {
      generation += 1
      audio = track
      track = null
      media = player
      player = null
      lock = wakeLock
      wakeLock = null
      task = stopRunnable
      stopRunnable = null
    }
    try {
      media?.stop()
    } catch (_: Exception) {
      /* already stopped */
    }
    try {
      media?.release()
    } catch (_: Exception) {
      /* already released */
    }
    if (task != null) mainHandler.removeCallbacks(task)
    try {
      audio?.pause()
    } catch (_: Exception) {
      /* already stopped */
    }
    try {
      audio?.flush()
    } catch (_: Exception) {
      /* already stopped */
    }
    try {
      audio?.release()
    } catch (_: Exception) {
      /* already released */
    }
    if (lock?.isHeld == true) {
      try {
        lock.release()
      } catch (_: Exception) {
        /* already released */
      }
    }
    val listener = focusListener
    val request = focusRequest
    focusListener = null
    focusRequest = null
    abandonFocus(request, listener, lockContext)
  }

  private fun abandonFocus(
    request: android.media.AudioFocusRequest?,
    listener: AudioManager.OnAudioFocusChangeListener?,
    context: Context?
  ) {
    val app = context?.applicationContext ?: return
    val manager = app.getSystemService(Context.AUDIO_SERVICE) as AudioManager
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && request != null) {
      manager.abandonAudioFocusRequest(request)
    } else if (listener != null) {
      @Suppress("DEPRECATION")
      manager.abandonAudioFocus(listener)
    }
  }
}

private data class SoftNote(val freq: Double, val seconds: Double, val gap: Double, val amp: Double)

private fun softCycle(sampleRate: Int, tone: String): ShortArray {
  val notes = when (tone) {
    "classic" -> listOf(
      SoftNote(523.25, 0.16, 0.16, 0.15),
      SoftNote(659.25, 0.22, 0.42, 0.13)
    )
    "urgent" -> listOf(
      SoftNote(698.46, 0.07, 0.08, 0.2),
      SoftNote(698.46, 0.07, 0.08, 0.2),
      SoftNote(783.99, 0.09, 0.28, 0.18)
    )
    "digital" -> listOf(
      SoftNote(440.0, 0.09, 0.07, 0.13),
      SoftNote(554.37, 0.09, 0.07, 0.14),
      SoftNote(659.25, 0.16, 0.36, 0.15)
    )
    else -> listOf(
      SoftNote(523.25, 0.18, 0.09, 0.11),
      SoftNote(659.25, 0.18, 0.09, 0.12),
      SoftNote(783.99, 0.28, 0.4, 0.13)
    )
  }
  val parts = ArrayList<ShortArray>()
  for (note in notes) {
    parts.add(sine(sampleRate, note.freq, note.seconds, note.amp))
    parts.add(ShortArray(max(1, (sampleRate * note.gap).toInt())))
  }
  val total = parts.sumOf { it.size }
  val out = ShortArray(total)
  var cursor = 0
  for (part in parts) {
    part.copyInto(out, cursor)
    cursor += part.size
  }
  return out
}

private fun sine(sampleRate: Int, freq: Double, seconds: Double, amp: Double): ShortArray {
  val count = max(1, (sampleRate * seconds).toInt())
  val out = ShortArray(count)
  val peak = amp.coerceIn(0.05, 0.25) * Short.MAX_VALUE
  val fadeN = max(1, (sampleRate * 0.012).toInt())
  for (i in 0 until count) {
    val wave = sin(2.0 * Math.PI * freq * i / sampleRate)
    val edge = minOf(i, count - 1 - i, fadeN).toDouble() / fadeN
    out[i] = (wave * peak * edge).toInt().toShort()
  }
  return out
}
