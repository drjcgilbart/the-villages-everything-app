package expo.modules.alarmsound

import android.app.KeyguardManager
import android.content.Context
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.util.TypedValue
import android.widget.Button
import android.widget.LinearLayout

/**
 * Alarm buttons on the big card.
 * Done logs the press and leaves the phone where it was.
 * Skip turns the sound off, logs nothing, and leaves the next alarm on its clock.
 * Silence only turns the sound off and leaves the card up.
 * Open unlocks, when needed, and shows that item.
 */
object AlarmActions {
  @Volatile var soundOff: Boolean = false

  fun done(context: Context) {
    val app = context.applicationContext
    val marks = AlarmClock.marksForDone()
    AlarmRinger.stop(app)
    soundOff = false
    if (marks.length() > 0) AlarmClock.queueDone(app, marks, System.currentTimeMillis())
    AlarmClock.clearCard()
    AlarmOverlay.hide()
    AlarmAlertActivity.close()
    AlarmClock.noteDone()
  }

  /** Stop the tone and leave the card up. Nothing is logged. */
  fun silence() {
    AlarmRinger.quiet()
    soundOff = true
    AlarmOverlay.markQuiet()
    AlarmAlertActivity.markQuiet()
  }

  /** Stop this ring, close the card, and log nothing. Later alarms stay scheduled. */
  fun skip(context: Context) {
    leave(context)
  }

  fun open(context: Context) {
    val activity = AlarmAlertActivity.foreground()
    if (activity != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val guard = activity.getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager
      if (guard.isKeyguardLocked) {
        guard.requestDismissKeyguard(
          activity,
          object : KeyguardManager.KeyguardDismissCallback() {
            override fun onDismissSucceeded() {
              activity.runOnUiThread { finishOpen(activity) }
            }

            override fun onDismissError() {
              activity.runOnUiThread { finishOpen(activity) }
            }
          }
        )
        return
      }
    }
    if (activity != null && Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
      @Suppress("DEPRECATION")
      activity.window.addFlags(android.view.WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD)
    }
    finishOpen(activity ?: context)
  }

  /** Back closes the card without logging and without opening the app. */
  fun leave(context: Context) {
    val app = context.applicationContext
    AlarmRinger.stop(app)
    soundOff = false
    AlarmClock.clearCard()
    AlarmOverlay.hide()
    AlarmAlertActivity.close()
  }

  fun addChoices(context: Context, card: LinearLayout, host: Context): Button {
    val done = button(context, "Done — log this time", filled = true) { done(host) }
    val skipButton = button(context, "Skip this alarm", filled = false) { skip(host) }
    val silence = button(context, if (soundOff) "Sound is off" else "Silence", filled = false) { silence() }
    if (soundOff) silence.isEnabled = false
    val open = button(context, "Open to add details", filled = false) { open(host) }
    card.addView(done, gap(context, 22))
    card.addView(skipButton, gap(context, 12))
    card.addView(silence, gap(context, 12))
    card.addView(open, gap(context, 12))
    return silence
  }

  private fun finishOpen(context: Context) {
    val app = context.applicationContext
    val path = AlarmClock.pathForOpen()
    AlarmRinger.stop(app)
    soundOff = false
    if (path.isNotBlank()) {
      AlarmClock.rememberPath(app, path)
      AlarmClock.noteOpen(path)
    }
    AlarmClock.clearCard()
    if (path.isNotBlank()) AlarmClock.openPage(context, path)
    AlarmOverlay.hide()
    AlarmAlertActivity.close()
  }

  private fun button(context: Context, label: String, filled: Boolean, onClick: () -> Unit): Button {
    return Button(context).apply {
      text = label
      isAllCaps = false
      setTextSize(TypedValue.COMPLEX_UNIT_SP, 20f)
      setTypeface(typeface, Typeface.BOLD)
      minimumHeight = dp(context, 64)
      setTextColor(if (filled) Color.WHITE else Color.parseColor("#0c4a6e"))
      background = GradientDrawable().apply {
        setColor(if (filled) Color.parseColor("#0c4a6e") else Color.TRANSPARENT)
        setStroke(dp(context, 2), Color.parseColor("#0c4a6e"))
        cornerRadius = dp(context, 16).toFloat()
      }
      setPadding(dp(context, 18), dp(context, 16), dp(context, 18), dp(context, 16))
      setOnClickListener { onClick() }
    }
  }

  private fun gap(context: Context, top: Int): LinearLayout.LayoutParams {
    return LinearLayout.LayoutParams(
      LinearLayout.LayoutParams.MATCH_PARENT,
      LinearLayout.LayoutParams.WRAP_CONTENT
    ).apply { topMargin = dp(context, top) }
  }

  private fun dp(context: Context, value: Int): Int {
    return (value * context.resources.displayMetrics.density).toInt()
  }
}
