import { Suspense } from "react";
import { redirect } from "next/navigation";
import { PhoneViewStudio } from "@/components/PhoneViewStudio";
import { isAdminAuthenticated } from "@/lib/auth";

export const metadata = {
  title: "Phone view",
  robots: { index: false, follow: false },
};

export default async function PhoneViewPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  return (
    <Suspense fallback={<div className="phone-preview-loading">Loading phone view…</div>}>
      <PhoneViewStudio />
    </Suspense>
  );
}
