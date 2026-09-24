"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { finishPlannerReturn, readPlannerReturn } from "@/lib/plannerReturn";

/** Stays under the site header while you scroll the page you opened from the planner. */
export function PlannerReturnBar() {
  const [on, setOn] = useState(false);
  const [top, setTop] = useState(8);

  useEffect(() => {
    setOn(!!readPlannerReturn());
  }, []);

  useEffect(() => {
    if (!on) return;
    function place() {
      const header = document.querySelector(".site-header");
      const bottom = header ? Math.round(header.getBoundingClientRect().bottom) : 0;
      setTop(Math.max(8, bottom + 8));
    }
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, { passive: true });
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place);
    };
  }, [on]);

  if (!on || typeof document === "undefined") return null;
  return createPortal(
    <div className="ms-cal-return" style={{ top }}>
      <span>You opened this from your calendar.</span>
      <button type="button" className="ms-cal-return-btn" onClick={finishPlannerReturn}>
        Back to your calendar
      </button>
    </div>,
    document.body
  );
}
