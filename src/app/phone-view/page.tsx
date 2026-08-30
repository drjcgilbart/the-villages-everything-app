import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PhoneViewStudio } from "@/components/PhoneViewStudio";
import { isLocalPcHost } from "@/lib/localDevHost";

export const metadata = {
  title: "Phone view",
  robots: { index: false, follow: false },
};

export default async function PhoneViewPage() {
  const host = (await headers()).get("host");
  if (!isLocalPcHost(host)) {
    redirect("/");
  }

  return (
    <Suspense fallback={<div className="phone-preview-loading">Loading phone view…</div>}>
      <PhoneViewStudio />
    </Suspense>
  );
}
