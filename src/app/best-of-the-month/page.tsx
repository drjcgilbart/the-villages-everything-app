import { TopicPage } from "@/components/TopicPage";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Best of the Month Club",
  description:
    "Monthly picks — best posts, videos, and photos from The Villages Hub.",
};

export default function BestOfTheMonthPage() {
  return <TopicPage slug="best-of-the-month" />;
}
