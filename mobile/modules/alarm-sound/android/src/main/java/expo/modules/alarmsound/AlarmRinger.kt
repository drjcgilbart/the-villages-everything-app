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
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.os.PowerManager
import android.os.SystemClock
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
  private var focusListener: AudioManager.OnAudioFocusChangeListener? = null
  private var focusRequest: android.media.AudioFocusRequest? = null
  private var wakeLock: PowerManager.WakeLock? = null
  private var stopRunnable: Runnable? = null
  @Volatile private var lockContext: Context? = null

  fun prepare(context: Context) {
    ensureChannel(context.applicationContext)
  }

  fun start(context: Context, rawSeconds: Int) {
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
    try {
      audio.play()
    } catch (_: Exception) {
      stopTone()
      return
    }
    val deadline = SystemClock.elapsedRealtime() + seconds * 1000L
    Thread {
      val cycle = classicBeep(sampleRate)
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

  private fun stopTone() {
    val audio: AudioTrack?
    val lock: PowerManager.WakeLock?
    val task: Runnable?
    synchronized(gate) {
      generation += 1
      audio = track
      track = null
      lock = wakeLock
      wakeLock = null
      task = stopRunnable
      stopRunnable = null
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

private fun classicBeep(sampleRate: Int): ShortArray {
  val tone = square(sampleRate, 880.0, 0.12)
  val gap = ShortArray((sampleRate * 0.2).toInt())
  val rest = ShortArray((sampleRate * 0.45).toInt())
  return tone + gap + tone + rest
}

private fun square(sampleRate: Int, freq: Double, seconds: Double): ShortArray {
  val count = max(1, (sampleRate * seconds).toInt())
  val out = ShortArray(count)
  val amp = 0.9 * Short.MAX_VALUE
  for (i in 0 until count) {
    val wave = sin(2.0 * Math.PI * freq * i / sampleRate)
    val shaped = if (wave >= 0) 1.0 else -1.0
    val edge = minOf(i, count - 1 - i, (sampleRate * 0.008).toInt()).toDouble()
    val fade = (edge / (sampleRate * 0.008)).coerceIn(0.0, 1.0)
    out[i] = (shaped * amp * fade).toInt().toShort()
  }
  return out
}
