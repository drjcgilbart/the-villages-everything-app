import { AdminPortal } from "@/components/AdminPortal";

export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

/** Site-owner admin — members, moderation. Content: /studio */
export default function AdminPortalPage() {
  return <AdminPortal />;
}
