"use client";

import { useEffect, useState } from "react";
import {
  ALARM_TONE_OPTIONS,
  playAlarmTone,
  requestPhoneAlarmSounds,
  subscribePhoneAlarmSounds,
  type AlarmTone,
  type PhoneAlarmSound,
} from "@/lib/mySpaceStorage";

export function usePhoneAlarmSounds(): PhoneAlarmSound[] {
  const [sounds, setSounds] = useState<PhoneAlarmSound[]>([]);
  useEffect(() => {
    const stop = subscribePhoneAlarmSounds(setSounds);
    requestPhoneAlarmSounds();
    return stop;
  }, []);
  return sounds;
}

/** Built-in tones plus the alarm sounds already stored on this phone. */
export function AlarmSoundSelect({
  sound,
  uri,
  onChange,
}: {
  sound: AlarmTone;
  uri?: string;
  onChange: (sound: AlarmTone, uri: string) => void;
}) {
  const phones = usePhoneAlarmSounds();
  const selected = sound === "phone" && uri ? uri : sound === "phone" ? "chime" : sound;
  const knownPhone = phones.some((row) => row.uri === selected);
  return (
    <select
      value={selected}
      onChange={(e) => {
        const next = e.target.value;
        const phone = phones.find((row) => row.uri === next);
        if (phone) onChange("phone", phone.uri);
        else onChange(next as AlarmTone, "");
      }}
    >
      <optgroup label="Gentle built-in sounds">
        {ALARM_TONE_OPTIONS.map((tone) => (
          <option key={tone.id} value={tone.id}>
            {tone.label} — {tone.hint}
          </option>
        ))}
      </optgroup>
      {(phones.length > 0 || (sound === "phone" && uri && !knownPhone)) && (
        <optgroup label="Sounds on this phone">
          {sound === "phone" && uri && !knownPhone ? (
            <option value={uri}>Saved phone sound</option>
          ) : null}
          {phones.map((row) => (
            <option key={row.uri} value={row.uri}>
              {row.title}
            </option>
          ))}
        </optgroup>
      )}
    </select>
  );
}

export function PhoneAlarmSelect({
  uri,
  onChange,
}: {
  uri: string;
  onChange: (uri: string) => void;
}) {
  const phones = usePhoneAlarmSounds();
  if (!phones.length) return null;
  const known = phones.some((row) => row.uri === uri);
  return (
    <div className="field ms-phone-alarms">
      <label>A sound from this phone</label>
      <select value={uri} onChange={(e) => onChange(e.target.value)}>
        <option value="">Use the built-in sound above</option>
        {uri && !known ? <option value={uri}>Saved phone sound</option> : null}
        {phones.map((row) => (
          <option key={row.uri} value={row.uri}>
            {row.title}
          </option>
        ))}
      </select>
      {uri ? (
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => playAlarmTone("phone", 2, 0.06, uri)}
        >
          Hear it
        </button>
      ) : null}
    </div>
  );
}
