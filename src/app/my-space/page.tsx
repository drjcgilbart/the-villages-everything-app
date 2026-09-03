import { MySpaceDashboard } from "@/components/MySpaceDashboard";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "My Space",
  description:
    "My Space — Your Private Lanai. Villages weather, health, pets, investments, and more, behind Hub membership.",
};

export default function MySpacePage() {
  return <MySpaceDashboard />;
}
