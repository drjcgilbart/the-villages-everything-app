import { AdminPortal } from "@/components/AdminPortal";

export const metadata = {
  title: "Admin Portal",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

/** Site-owner admin — members, moderation. Content: /studio */
export default function AdminPortalPage() {
  return <AdminPortal />;
}
