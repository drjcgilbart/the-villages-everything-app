package expo.modules.alarmsound

import android.app.Activity
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.os.Bundle
import android.util.TypedValue
import android.view.Gravity
import android.view.WindowManager
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView

/**
 * Lock-screen alarm card. Done logs this press and returns to the lock screen.
 * Silence only stops the sound. Open asks to unlock and then shows the item.
 */
class AlarmAlertActivity : Activity() {
  private var silenceButton: Button? = null

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    showOverLockScreen()
    current = this
    setContentView(buildView(intent))
  }

  override fun onResume() {
    super.onResume()
    AlarmOverlay.hide()
  }

  @Deprecated("Back closes the card without logging.")
  override fun onBackPressed() {
    AlarmActions.leave(this)
  }

  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    setIntent(intent)
    setContentView(buildView(intent))
  }

  override fun onDestroy() {
    if (current === this) current = null
    super.onDestroy()
  }

  private fun showOverLockScreen() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
      setShowWhenLocked(true)
      setTurnScreenOn(true)
    } else {
      @Suppress("DEPRECATION")
      window.addFlags(
        WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
          WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
      )
    }
    window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
  }

  private fun buildView(source: Intent?): LinearLayout {
    val title = source?.getStringExtra(EXTRA_TITLE).orEmpty().ifBlank { "Alarm" }
    val detail = source?.getStringExtra(EXTRA_DETAIL).orEmpty()
    val path = source?.getStringExtra(EXTRA_PATH).orEmpty()
    val marks = source?.getStringExtra(EXTRA_MARKS).orEmpty().ifBlank { "[]" }
    if (AlarmClock.card == null) AlarmClock.beginCard(title, detail, path, marks)
    val root = LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      gravity = Gravity.CENTER
      setBackgroundColor(Color.parseColor("#E6121A24"))
      setPadding(dp(22), dp(28), dp(22), dp(28))
    }
    val card = LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      background = GradientDrawable().apply {
        setColor(Color.parseColor("#FFF8F1"))
        cornerRadius = dp(22).toFloat()
      }
      setPadding(dp(22), dp(22), dp(22), dp(22))
    }
    card.addView(label("Alarm", 13f, Color.parseColor("#0c4a6e"), true))
    card.addView(label(title, 28f, Color.parseColor("#102033"), true).apply {
      setPadding(0, dp(8), 0, 0)
    })
    if (detail.isNotBlank()) {
      card.addView(label(detail, 18f, Color.parseColor("#3d4a57"), false).apply {
        setPadding(0, dp(12), 0, 0)
      })
    }
    card.addView(label(AlarmClock.pageHint(path), 16f, Color.parseColor("#0c4a6e"), false).apply {
      setPadding(0, dp(14), 0, 0)
    })
    silenceButton = AlarmActions.addChoices(this, card, this)
    val scroll = ScrollView(this)
    scroll.isFocusableInTouchMode = true
    scroll.addView(card, LinearLayout.LayoutParams(
      LinearLayout.LayoutParams.MATCH_PARENT,
      LinearLayout.LayoutParams.WRAP_CONTENT
    ))
    root.addView(scroll, LinearLayout.LayoutParams(
      LinearLayout.LayoutParams.MATCH_PARENT,
      LinearLayout.LayoutParams.WRAP_CONTENT
    ))
    return root
  }

  private fun label(text: String, size: Float, color: Int, bold: Boolean): TextView {
    return TextView(this).apply {
      this.text = text
      setTextSize(TypedValue.COMPLEX_UNIT_SP, size)
      setTextColor(color)
      setTypeface(typeface, if (bold) Typeface.BOLD else Typeface.NORMAL)
    }
  }

  private fun dp(value: Int): Int {
    return (value * resources.displayMetrics.density).toInt()
  }

  companion object {
    const val EXTRA_TITLE = "tvea_alarm_title"
    const val EXTRA_DETAIL = "tvea_alarm_detail"
    const val EXTRA_PATH = "tvea_alarm_path"
    const val EXTRA_MARKS = "tvea_alarm_marks"
    private var current: AlarmAlertActivity? = null

    fun foreground(): AlarmAlertActivity? = current

    fun extraPath(): String = current?.intent?.getStringExtra(EXTRA_PATH).orEmpty()

    fun extraMarks(): String = current?.intent?.getStringExtra(EXTRA_MARKS).orEmpty().ifBlank { "[]" }

    fun markQuiet() {
      current?.silenceButton?.apply {
        text = "Sound is off"
        isEnabled = false
      }
    }

    fun open(context: Context, title: String, detail: String, path: String, marks: String) {
      val intent = intent(context, title, detail, path, marks).addFlags(
        Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
      )
      try {
        context.startActivity(intent)
      } catch (_: Exception) {
        /* The full-screen notification is the backup. */
      }
    }

    fun close() {
      current?.finish()
    }

    fun intent(context: Context, title: String, detail: String, path: String, marks: String): Intent {
      return Intent(context, AlarmAlertActivity::class.java)
        .putExtra(EXTRA_TITLE, title)
        .putExtra(EXTRA_DETAIL, detail)
        .putExtra(EXTRA_PATH, path)
        .putExtra(EXTRA_MARKS, marks)
    }

    fun pending(context: Context, title: String, detail: String, path: String, marks: String): PendingIntent {
      return PendingIntent.getActivity(
        context,
        71023,
        intent(context, title, detail, path, marks),
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
      )
    }
  }
}
