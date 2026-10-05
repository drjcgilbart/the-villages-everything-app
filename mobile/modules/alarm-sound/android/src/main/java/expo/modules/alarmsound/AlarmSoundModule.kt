package expo.modules.alarmsound

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class AlarmSoundModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("AlarmSound")
    Events("onAlarmFired", "onAlarmSilenced")

    OnCreate {
      val module = this@AlarmSoundModule
      AlarmClock.onFired = { payload ->
        module.sendEvent("onAlarmFired", payload)
      }
      AlarmClock.onSilenced = { path ->
        module.sendEvent("onAlarmSilenced", mapOf("path" to path))
      }
    }

    OnDestroy {
      AlarmClock.onFired = null
      AlarmClock.onSilenced = null
    }

    Function("prepare") {
      val context = appContext.reactContext?.applicationContext ?: return@Function null
      AlarmRinger.prepare(context)
      AlarmClock.ensureCoverPermission(context)
      null
    }

    Function("start") { seconds: Double, tone: String, uri: String ->
      val context = appContext.reactContext?.applicationContext ?: return@Function null
      AlarmRinger.start(context, seconds.toInt(), tone, uri)
      null
    }

    Function("phoneSounds") {
      val context = appContext.reactContext?.applicationContext ?: return@Function "[]"
      AlarmRinger.phoneSoundsJson(context)
    }

    Function("show") { title: String, detail: String ->
      val context = appContext.reactContext?.applicationContext ?: return@Function null
      AlarmRinger.show(context, title, detail)
      null
    }

    Function("stop") {
      val context = appContext.reactContext?.applicationContext
      AlarmRinger.stop(context)
      AlarmOverlay.hide()
      AlarmAlertActivity.close()
      null
    }

    Function("takePendingPath") {
      val context = appContext.reactContext?.applicationContext ?: return@Function ""
      AlarmClock.consumePendingPath(context)
    }

    Function("replaceSchedule") { raw: String ->
      val context = appContext.reactContext?.applicationContext ?: return@Function null
      AlarmClock.replace(context, raw)
      null
    }
  }
}
