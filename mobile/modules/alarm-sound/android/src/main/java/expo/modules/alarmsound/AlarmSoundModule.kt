package expo.modules.alarmsound

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class AlarmSoundModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("AlarmSound")
    Events("onAlarmFired")

    OnCreate {
      val module = this@AlarmSoundModule
      AlarmClock.onFired = { payload ->
        module.sendEvent("onAlarmFired", payload)
      }
    }

    OnDestroy {
      AlarmClock.onFired = null
    }

    Function("prepare") {
      val context = appContext.reactContext?.applicationContext ?: return@Function null
      AlarmRinger.prepare(context)
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
      AlarmRinger.stop(appContext.reactContext?.applicationContext)
    }

    Function("replaceSchedule") { raw: String ->
      val context = appContext.reactContext?.applicationContext ?: return@Function null
      AlarmClock.replace(context, raw)
      null
    }
  }
}
