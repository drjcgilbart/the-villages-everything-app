package expo.modules.alarmsound

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Handler
import android.os.Looper
import org.json.JSONArray
import org.json.JSONObject

private const val PREFS = "tvea-alarm-clock"
private const val KEY_QUEUE = "queue"
private const val KEY_FIRED = "fired"
const val ALARM_ACTION = "com.thevillageseverythingapp.app.ALARM_FIRE"
private const val FIRE_CODE = 71021
private const val SHOW_CODE = 71022

private data class Planned(
  val id: String,
  val at: Long,
  val title: String,
  val detail: String,
  val seconds: Int,
  val source: String,
)

/** One phone-clock alarm for the soonest medicine, pet, or rest time. */
object AlarmClock {
  var onFired: ((Map<String, Any>) -> Unit)? = null
  private val mainHandler = Handler(Looper.getMainLooper())

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
    val title = if (due.size == 1) due[0].title else "Alarm"
    val detail = due.joinToString("\n\n") { it.detail.ifBlank { it.title } }
    val source = due[0].source
    val endsAt = now + seconds * 1000L
    AlarmRinger.prepare(app)
    AlarmRinger.start(app, seconds)
    AlarmRinger.show(app, title, detail)
    val payload = mapOf(
      "title" to title,
      "detail" to detail,
      "source" to source,
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
              source = row.optString("source").ifBlank { "health" }
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
