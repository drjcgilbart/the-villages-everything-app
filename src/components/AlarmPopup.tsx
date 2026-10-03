"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { dismissAlarm, ensureAlarmStopListener, subscribeAlarm, type AlarmView } from "@/lib/alarmAlert";

/** Site-wide alarm window. Stays up until the sound is turned off. */
export function AlarmPopup() {
  const [alert, setAlert] = useState<AlarmView | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    ensureAlarmStopListener();
    return subscribeAlarm(setAlert);
  }, []);

  useLayoutEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (alert) {
      if (!el.open) {
        try {
          el.showModal();
        } catch {
          el.setAttribute("open", "");
          el.classList.add("alarm-popup-fallback");
        }
      }
      el.querySelector<HTMLButtonElement>(".alarm-popup-stop")?.focus();
      return;
    }
    if (el.open) el.close();
    el.classList.remove("alarm-popup-fallback");
  }, [alert]);

  return (
    <dialog
      ref={dialogRef}
      className="alarm-popup"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="alarm-popup-title"
      aria-describedby="alarm-popup-detail"
      onCancel={(event) => {
        event.preventDefault();
        dismissAlarm();
      }}
    >
      {alert ? (
        <div className="alarm-popup-card">
          <p className="alarm-popup-kicker">Alarm</p>
          <h2 id="alarm-popup-title">{alert.title}</h2>
          <p id="alarm-popup-detail" className="alarm-popup-detail">
            {alert.detail}
          </p>
          <button type="button" className="btn btn-primary alarm-popup-stop" onClick={() => dismissAlarm()}>
            Turn alarm off
          </button>
        </div>
      ) : null}
    </dialog>
  );
}

/** Asks once, from a click, so a later alarm can also appear over other programs. */
export function AlarmNotifyButton() {
  const [perm, setPerm] = useState<NotificationPermission | "missing">("missing");

  useEffect(() => {
    if (typeof Notification === "undefined") return;
    setPerm(Notification.permission);
  }, []);

  if (perm !== "default") return null;

  return (
    <button
      type="button"
      className="btn btn-ghost btn-sm"
      onClick={() => {
        if (typeof Notification === "undefined") return;
        void Notification.requestPermission()
          .then((next) => setPerm(next))
          .catch(() => {});
      }}
    >
      Allow alarm popups over other programs
    </button>
  );
}
