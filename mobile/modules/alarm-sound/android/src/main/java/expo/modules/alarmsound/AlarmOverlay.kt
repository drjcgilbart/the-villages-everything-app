package expo.modules.alarmsound

import android.content.Context
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.provider.Settings
import android.util.TypedValue
import android.view.Gravity
import android.view.KeyEvent
import android.view.WindowManager
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView

/**
 * Alarm card drawn over other apps. Android only allows this after the user
 * turns on "Appear on top" for this app. The lock screen uses AlarmAlertActivity.
 */
object AlarmOverlay {
  @Volatile var currentPath: String = ""
  private var view: ScrollView? = null
  private var windowManager: WindowManager? = null

  fun show(context: Context, title: String, detail: String, path: String): Boolean {
    val app = context.applicationContext
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(app)) return false
    hide()
    val wm = app.getSystemService(Context.WINDOW_SERVICE) as WindowManager
    val type = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
    } else {
      @Suppress("DEPRECATION")
      WindowManager.LayoutParams.TYPE_PHONE
    }
    val params = WindowManager.LayoutParams(
      WindowManager.LayoutParams.MATCH_PARENT,
      WindowManager.LayoutParams.MATCH_PARENT,
      type,
      WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON,
      PixelFormat.TRANSLUCENT
    )
    params.gravity = Gravity.CENTER
    val card = build(app, title, detail, path)
    card.isFocusableInTouchMode = true
    card.setOnKeyListener { _, keyCode, event ->
      if (keyCode == KeyEvent.KEYCODE_BACK && event.action == KeyEvent.ACTION_UP) {
        AlarmAlertActivity.silence(app)
        true
      } else {
        false
      }
    }
    return try {
      wm.addView(card, params)
      view = card
      windowManager = wm
      currentPath = path
      card.requestFocus()
      true
    } catch (_: Exception) {
      currentPath = ""
      false
    }
  }

  fun hide() {
    val wm = windowManager
    val card = view
    view = null
    windowManager = null
    currentPath = ""
    if (wm == null || card == null) return
    try {
      wm.removeView(card)
    } catch (_: Exception) {
      /* already gone */
    }
  }

  private fun build(context: Context, title: String, detail: String, path: String): ScrollView {
    val safeTitle = title.ifBlank { "Alarm" }
    val root = LinearLayout(context).apply {
      orientation = LinearLayout.VERTICAL
      gravity = Gravity.CENTER
      setBackgroundColor(Color.parseColor("#E6121A24"))
      setPadding(dp(context, 22), dp(context, 28), dp(context, 22), dp(context, 28))
      isFocusableInTouchMode = true
      setOnKeyListener { _, keyCode, event ->
        if (keyCode == KeyEvent.KEYCODE_BACK && event.action == KeyEvent.ACTION_UP) {
          AlarmAlertActivity.silence(context)
          true
        } else {
          false
        }
      }
    }
    val card = LinearLayout(context).apply {
      orientation = LinearLayout.VERTICAL
      background = GradientDrawable().apply {
        setColor(Color.parseColor("#FFF8F1"))
        cornerRadius = dp(context, 22).toFloat()
      }
      setPadding(dp(context, 22), dp(context, 22), dp(context, 22), dp(context, 22))
    }
    card.addView(text(context, "Alarm", 13f, Color.parseColor("#0c4a6e"), true))
    card.addView(text(context, safeTitle, 28f, Color.parseColor("#102033"), true).apply {
      setPadding(0, dp(context, 8), 0, 0)
    })
    if (detail.isNotBlank()) {
      card.addView(text(context, detail, 18f, Color.parseColor("#3d4a57"), false).apply {
        setPadding(0, dp(context, 12), 0, 0)
      })
    }
    card.addView(text(context, AlarmClock.pageHint(path), 16f, Color.parseColor("#0c4a6e"), false).apply {
      setPadding(0, dp(context, 14), 0, 0)
    })
    val silence = Button(context).apply {
      text = "Silence"
      isAllCaps = false
      setTextSize(TypedValue.COMPLEX_UNIT_SP, 20f)
      setTextColor(Color.WHITE)
      setTypeface(typeface, Typeface.BOLD)
      minimumHeight = dp(context, 56)
      background = GradientDrawable().apply {
        setColor(Color.parseColor("#0c4a6e"))
        cornerRadius = dp(context, 16).toFloat()
      }
      setOnClickListener { AlarmAlertActivity.silence(context) }
    }
    card.addView(silence, LinearLayout.LayoutParams(
      LinearLayout.LayoutParams.MATCH_PARENT,
      LinearLayout.LayoutParams.WRAP_CONTENT
    ).apply { topMargin = dp(context, 22) })
    root.addView(card, LinearLayout.LayoutParams(
      LinearLayout.LayoutParams.MATCH_PARENT,
      LinearLayout.LayoutParams.WRAP_CONTENT
    ))
    val scroll = ScrollView(context)
    scroll.addView(root, WindowManager.LayoutParams(
      WindowManager.LayoutParams.MATCH_PARENT,
      WindowManager.LayoutParams.MATCH_PARENT
    ))
    return scroll
  }

  private fun text(context: Context, value: String, size: Float, color: Int, bold: Boolean): TextView {
    return TextView(context).apply {
      text = value
      setTextSize(TypedValue.COMPLEX_UNIT_SP, size)
      setTextColor(color)
      setTypeface(typeface, if (bold) Typeface.BOLD else Typeface.NORMAL)
    }
  }

  private fun dp(context: Context, value: Int): Int {
    return (value * context.resources.displayMetrics.density).toInt()
  }
}
