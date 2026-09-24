/** Remember to come back to the personal planner after an edit on another page. */

export const PLANNER_RETURN_KEY = "tvea-planner-return";
export const PLANNER_EDIT_KEY = "tvea-planner-edit";
export const PLANNER_HREF = "/calendar#my-calendar";

export type PlannerEditTarget = { board: string; id: string; extra?: string };

export function rememberPlannerReturn(edit?: PlannerEditTarget) {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(PLANNER_RETURN_KEY, PLANNER_HREF);
  if (edit) sessionStorage.setItem(PLANNER_EDIT_KEY, JSON.stringify(edit));
}

export function readPlannerReturn(): string | null {
  if (typeof sessionStorage === "undefined") return null;
  return sessionStorage.getItem(PLANNER_RETURN_KEY);
}

export function takePlannerEdit(): PlannerEditTarget | null {
  if (typeof sessionStorage === "undefined") return null;
  const raw = sessionStorage.getItem(PLANNER_EDIT_KEY);
  if (!raw) return null;
  sessionStorage.removeItem(PLANNER_EDIT_KEY);
  try {
    const parsed = JSON.parse(raw) as PlannerEditTarget;
    if (!parsed?.board || !parsed?.id) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function finishPlannerReturn() {
  const href = readPlannerReturn();
  if (!href || typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(PLANNER_RETURN_KEY);
  sessionStorage.removeItem(PLANNER_EDIT_KEY);
  window.location.assign(href);
}
