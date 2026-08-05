import { TopicPage } from "@/components/TopicPage";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Calendar of Events",
  description:
    "What’s on this week in The Villages — events, concerts, markets, and local dates from the Retirement Reboot.",
};

export default function CalendarPage() {
  return <TopicPage slug="calendar" />;
}
