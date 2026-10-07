package expo.modules.alarmsound

import android.app.AlarmManager
import android.app.KeyguardManager
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.provider.Settings
import org.json.JSONArray
import org.json.JSONObject

private const val PREFS = "tvea-alarm-clock"
private const val KEY_QUEUE = "queue"
private const val KEY_FIRED = "fired"
private const val KEY_PENDING = "pendingPath"
private const val KEY_DONE = "doneQueue"
private const val KEY_ASKED_OVERLAY = "askedOverlay"
private const val KEY_ASKED_FULL = "askedFullScreen"
const val ALARM_ACTION = "com.thevillageseverythingapp.app.ALARM_FIRE"
const val ALARM_STOP = "com.thevillageseverythingapp.app.ALARM_STOP"
private const val FIRE_CODE = 71021
private const val SHOW_CODE = 71022

private data class Planned(
  val id: String,
  val at: Long,
  val title: String,
  val detail: String,
  val seconds: Int,
  val source: String,
  val tone: String,
  val uri: String,
  val marks: String,
  val openPath: String,
)

data class RingingCard(
  val title: String,
  val detail: String,
  val path: String,
  val marks: String,
)

/** One phone-clock alarm for the soonest medicine, pet, or rest time. */
object AlarmClock {
  var onFired: ((Map<String, Any>) -> Unit)? = null
  var onSilenced: ((String) -> Unit)? = null
  var onDone: (() -> Unit)? = null
  var onOpen: ((String) -> Unit)? = null
  @Volatile var lastPath: String = ""
  @Volatile var card: RingingCard? = null
  private val mainHandler = Handler(Looper.getMainLooper())

  fun pageFor(source: String): String {
    return when (source) {
      "pet" -> "/my-space?tab=pets"
      "gym" -> "/health?section=gym#my-health"
      else -> "/health?section=meds#my-health"
    }
  }

  fun pageHint(@Suppress("UNUSED_PARAMETER") path: String): String {
    return "Done saves the time you press it, turns the sound off, and puts the phone back. Tomorrow's alarm stays at the same time."
  }

  fun beginCard(title: String, detail: String, path: String, marks: String) {
    card = RingingCard(title, detail, path, marks.ifBlank { "[]" })
    AlarmActions.soundOff = false
  }

  fun clearCard() {
    card = null
  }

  fun pathForOpen(): String {
    val fromCard = card?.path.orEmpty()
    if (fromCard.isNotBlank()) return fromCard
    val fromActivity = AlarmAlertActivity.extraPath()
    if (fromActivity.isNotBlank()) return fromActivity
    if (AlarmOverlay.currentPath.isNotBlank()) return AlarmOverlay.currentPath
    return lastPath
  }

  fun marksForDone(): JSONArray {
    val raw = card?.marks?.ifBlank { null } ?: AlarmAlertActivity.extraMarks()
    return try {
      JSONArray(raw.ifBlank { "[]" })
    } catch (_: Exception) {
      JSONArray()
    }
  }

  fun queueDone(context: Context, marks: JSONArray, at: Long) {
    if (marks.length() == 0 || at <= 0L) return
    val prefs = context.applicationContext.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
    val existing = try {
      JSONArray(prefs.getString(KEY_DONE, "[]") ?: "[]")
    } catch (_: Exception) {
      JSONArray()
    }
    val next = JSONArray()
    for (i in 0 until existing.length()) {
      val row = existing.optJSONObject(i) ?: continue
      if (row.optLong("at") == at) continue
      next.put(row)
    }
    next.put(JSONObject().put("marks", marks).put("at", at))
    val capped = JSONArray()
    val start = (next.length() - 30).coerceAtLeast(0)
    for (i in start until next.length()) {
      capped.put(next.opt(i))
    }
    prefs.edit().putString(KEY_DONE, capped.toString()).apply()
  }

  fun peekDone(context: Context): String {
    return context.applicationContext
      .getSharedPreferences(PREFS, Context.MODE_PRIVATE)
      .getString(KEY_DONE, "[]") ?: "[]"
  }

  fun ackDone(context: Context, at: Long) {
    if (at <= 0L) return
    val prefs = context.applicationContext.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
    val existing = try {
      JSONArray(prefs.getString(KEY_DONE, "[]") ?: "[]")
    } catch (_: Exception) {
      JSONArray()
    }
    val next = JSONArray()
    for (i in 0 until existing.length()) {
      val row = existing.optJSONObject(i) ?: continue
      if (row.optLong("at") == at) continue
      next.put(row)
    }
    prefs.edit().putString(KEY_DONE, next.toString()).apply()
  }

  fun noteDone() {
    val callback = onDone ?: return
    mainHandler.post { callback() }
  }

  fun noteOpen(path: String) {
    val callback = onOpen ?: return
    mainHandler.post { callback(path) }
  }

  fun openPage(context: Context, path: String) {
    val launch = context.packageManager.getLaunchIntentForPackage(context.packageName) ?: return
    launch.putExtra("tveaAlarmPath", path)
    launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_REORDER_TO_FRONT)
    try {
      context.startActivity(launch)
    } catch (_: Exception) {
      /* The popup still names the alarm. */
    }
  }

  fun noteSilenced(path: String) {
    val callback = onSilenced ?: return
    mainHandler.post { callback(path) }
  }

  fun rememberPath(context: Context, path: String) {
    lastPath = path
    context.applicationContext
      .getSharedPreferences(PREFS, Context.MODE_PRIVATE)
      .edit()
      .putString(KEY_PENDING, path)
      .apply()
  }

  fun consumePendingPath(context: Context): String {
    val prefs = context.applicationContext.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
    val path = prefs.getString(KEY_PENDING, "") ?: ""
    if (path.isNotBlank()) prefs.edit().remove(KEY_PENDING).apply()
    return path
  }

  /** One prompt so the card can cover other apps, then one for the lock screen. */
  fun ensureCoverPermission(context: Context) {
    val app = context.applicationContext
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) return
    val prefs = app.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
    if (!Settings.canDrawOverlays(app)) {
      if (prefs.getBoolean(KEY_ASKED_OVERLAY, false)) return
      prefs.edit().putBoolean(KEY_ASKED_OVERLAY, true).apply()
      val intent = Intent(
        Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
        Uri.parse("package:${app.packageName}")
      ).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      try {
        app.startActivity(intent)
      } catch (_: Exception) {
        /* The lock-screen card and the Silence notification still work. */
      }
      return
    }
    if (Build.VERSION.SDK_INT < 34) return
    val manager = app.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    if (manager.canUseFullScreenIntent()) return
    if (prefs.getBoolean(KEY_ASKED_FULL, false)) return
    prefs.edit().putBoolean(KEY_ASKED_FULL, true).apply()
    val intent = Intent(Settings.ACTION_MANAGE_APP_USE_FULL_SCREEN_INTENT)
      .setData(Uri.parse("package:${app.packageName}"))
      .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    try {
      app.startActivity(intent)
    } catch (_: Exception) {
      /* Heads-up Silence still works. */
    }
  }

  private fun screenLocked(context: Context): Boolean {
    return try {
      val guard = context.getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager
      guard.isKeyguardLocked
    } catch (_: Exception) {
      false
    }
  }

  private fun presentAlert(context: Context, title: String, detail: String, path: String, marks: String) {
    beginCard(title, detail, path, marks)
    val locked = screenLocked(context)
    val covered = !locked && AlarmOverlay.show(context, title, detail, path)
    if (!covered) AlarmAlertActivity.open(context, title, detail, path, marks)
    AlarmRinger.show(context, title, detail, path, marks, fullScreen = !covered)
  }

  fun replace(context: Context, raw: String) {
    val app = context.applicationContext
    val now = System.currentTimeMillis()
    val fired = readFired(app, now)
    val next = parse(raw).filter { it.at >= now - 15_000 && it.id !in fired }.sortedBy { it.at }
    writeQueue(app, next)
    scheduleNext(app, next)
  }

  fun fireDue(context: Context) {
    val app = context.applicationContext
    val now = System.currentTimeMillis()
    val fired = readFired(app, now).toMutableSet()
    val queue = readQueue(app)
    val due = queue.filter { it.at <= now + 20_000 && it.id !in fired }
    if (due.isEmpty()) {
      scheduleNext(app, queue.filter { it.at > now && it.id !in fired })
      return
    }
    due.forEach { fired.add(it.id) }
    writeFired(app, fired, queue + due)
    val rest = queue.filter { it.id !in fired && it.at > now + 20_000 }
    writeQueue(app, rest)
    val seconds = due.maxOf { it.seconds }.coerceIn(1, 300)
    val title = if (due.size == 1) {
      due[0].title
    } else {
      due.joinToString(" · ") { it.title }.take(90)
    }
    val detail = due.joinToString("\n\n") { it.detail.ifBlank { it.title } }
    val source = due[0].source
    val tone = due[0].tone.ifBlank { "chime" }
    val uri = due[0].uri
    val marks = JSONArray()
    for (item in due) {
      val part = try {
        JSONArray(item.marks.ifBlank { "[]" })
      } catch (_: Exception) {
        JSONArray()
      }
      for (i in 0 until part.length()) {
        part.opt(i)?.let { marks.put(it) }
      }
    }
    val path = due.firstOrNull { it.openPath.isNotBlank() }?.openPath ?: pageFor(source)
    val endsAt = now + seconds * 1000L
    AlarmRinger.prepare(app)
    AlarmRinger.start(app, seconds, tone, uri)
    presentAlert(app, title, detail, path, marks.toString())
    val payload = mapOf(
      "title" to title,
      "detail" to detail,
      "source" to source,
      "path" to path,
      "seconds" to seconds,
      "endsAt" to endsAt.toDouble()
    )
    mainHandler.post { onFired?.invoke(payload) }
    scheduleNext(app, rest)
  }

  private fun scheduleNext(context: Context, queue: List<Planned>) {
    val app = context.applicationContext
    val manager = app.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    val op = fireIntent(app)
    manager.cancel(op)
    val next = queue.minByOrNull { it.at } ?: return
    val show = showIntent(app) ?: op
    try {
      manager.setAlarmClock(AlarmManager.AlarmClockInfo(next.at, show), op)
    } catch (_: SecurityException) {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        manager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, next.at, op)
      } else {
        @Suppress("DEPRECATION")
        manager.setExact(AlarmManager.RTC_WAKEUP, next.at, op)
      }
    }
  }

  private fun fireIntent(context: Context): PendingIntent {
    val intent = Intent(context, AlarmFireReceiver::class.java).setAction(ALARM_ACTION)
    return PendingIntent.getBroadcast(
      context,
      FIRE_CODE,
      intent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )
  }

  private fun showIntent(context: Context): PendingIntent? {
    val launch = context.packageManager.getLaunchIntentForPackage(context.packageName) ?: return null
    launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP)
    return PendingIntent.getActivity(
      context,
      SHOW_CODE,
      launch,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )
  }

  private fun marksJson(row: JSONObject): String {
    val asArray = row.optJSONArray("marks")
    if (asArray != null) return asArray.toString()
    val asText = row.optString("marks")
    return if (asText.startsWith("[")) asText else "[]"
  }

  private fun marksArray(raw: String): JSONArray {
    return try {
      JSONArray(raw.ifBlank { "[]" })
    } catch (_: Exception) {
      JSONArray()
    }
  }

  private fun parse(raw: String): List<Planned> {
    return try {
      val array = JSONArray(raw)
      buildList {
        for (i in 0 until array.length()) {
          val row = array.optJSONObject(i) ?: continue
          val id = row.optString("id")
          val at = row.optLong("at")
          if (id.isBlank() || at <= 0L) continue
          add(
            Planned(
              id = id,
              at = at,
              title = row.optString("title").ifBlank { "Alarm" },
              detail = row.optString("detail"),
              seconds = row.optInt("seconds", 30).coerceIn(1, 300),
              source = row.optString("source").ifBlank { "health" },
              tone = row.optString("tone").ifBlank { "chime" },
              uri = row.optString("uri"),
              marks = marksJson(row),
              openPath = row.optString("openPath")
            )
          )
        }
      }
    } catch (_: Exception) {
      emptyList()
    }
  }

  private fun readQueue(context: Context): List<Planned> {
    val raw = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(KEY_QUEUE, "[]") ?: "[]"
    return parse(raw)
  }

  private fun writeQueue(context: Context, queue: List<Planned>) {
    val array = JSONArray()
    for (row in queue) {
      array.put(
        JSONObject()
          .put("id", row.id)
          .put("at", row.at)
          .put("title", row.title)
          .put("detail", row.detail)
          .put("seconds", row.seconds)
          .put("source", row.source)
          .put("tone", row.tone)
          .put("uri", row.uri)
          .put("marks", marksArray(row.marks))
          .put("openPath", row.openPath)
      )
    }
    context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putString(KEY_QUEUE, array.toString()).apply()
  }

  private fun readFired(context: Context, now: Long): Set<String> {
    val raw = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(KEY_FIRED, "[]") ?: "[]"
    val keep = mutableSetOf<String>()
    val fresh = JSONArray()
    try {
      val array = JSONArray(raw)
      for (i in 0 until array.length()) {
        val row = array.optJSONObject(i) ?: continue
        val at = row.optLong("at")
        val id = row.optString("id")
        if (id.isBlank() || at < now - 2L * 24L * 60L * 60L * 1000L) continue
        keep.add(id)
        fresh.put(row)
      }
    } catch (_: Exception) {
      /* start over */
    }
    context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putString(KEY_FIRED, fresh.toString()).apply()
    return keep
  }

  private fun writeFired(context: Context, ids: Set<String>, known: List<Planned>) {
    val atById = known.associate { it.id to it.at }
    val array = JSONArray()
    for (id in ids) {
      array.put(JSONObject().put("id", id).put("at", atById[id] ?: System.currentTimeMillis()))
    }
    context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putString(KEY_FIRED, array.toString()).apply()
  }
}
