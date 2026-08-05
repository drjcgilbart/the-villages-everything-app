import { TopicPage } from "@/components/TopicPage";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Health",
  description:
    "Health and wellness from a retirement reboot in The Villages, Florida — steps, routines, and honest check-ins.",
};

export default function HealthPage() {
  return <TopicPage slug="health" />;
}
