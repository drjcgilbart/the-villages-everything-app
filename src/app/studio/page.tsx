import { AdminStudio } from "@/components/AdminStudio";

export const metadata = {
  title: "Creator Studio",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

/** Content publishing (blog, photos, videos). Site ops: /admin */
export default function StudioPage() {
  return <AdminStudio />;
}
