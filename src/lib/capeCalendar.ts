import type { CalTask, CalendarBoard } from "@/lib/memberBoardModel";

export async function saveCapeReminder(task: Omit<CalTask, "id">): Promise<string> {
  const res = await fetch("/api/members/space/boards", { cache: "no-store", credentials: "include" });
  if (res.status === 401) {
    return "Sign in first. The personal planner is what keeps pickleball off a launch morning.";
  }
  const json = (await res.json()) as { boards?: { calendar?: CalendarBoard } };
  const tasks = json.boards?.calendar?.tasks || [];
  const row: CalTask = { ...task, id: `cal-cape-${Date.now().toString(36)}` };
  const saved = await fetch("/api/members/space/boards", {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ board: "calendar", data: { tasks: [row, ...tasks].slice(0, 80) } }),
  });
  if (!saved.ok) {
    return saved.status === 403
      ? "The personal planner is on Lanai Legend. The time is still on this page."
      : "The calendar did not take that reminder.";
  }
  return "On the personal planner. A scrub can still win. Check the morning you drive.";
}
