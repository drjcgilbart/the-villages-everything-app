"use client";

import { useEffect, useState } from "react";
import { finishPlannerReturn, readPlannerReturn } from "@/lib/plannerReturn";

/** Shown on the page you opened from a planner chip, with a way back. */
export function PlannerReturnBar() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(!!readPlannerReturn());
  }, []);

  if (!on) return null;
  return (
    <div className="ms-cal-return">
      <span>You opened this from your calendar.</span>
      <button type="button" className="btn btn-primary btn-sm" onClick={finishPlannerReturn}>
        Back to your calendar
      </button>
    </div>
  );
}
