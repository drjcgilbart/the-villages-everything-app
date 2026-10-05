package expo.modules.alarmsound

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/** Wakes a backgrounded app and rings the alarm that came due. */
class AlarmFireReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent?) {
    when (intent?.action) {
      ALARM_ACTION -> AlarmClock.fireDue(context)
      ALARM_STOP -> AlarmAlertActivity.silence(context)
    }
  }
}
