import { Suspense } from "react";
import { DonateSuccessClient } from "@/components/DonateSuccessClient";

export const metadata = {
  title: "Thanks for the Joe",
  description: "Thank you for supporting The Villages Everything App.",
};

export default function DonateSuccessPage() {
  return (
    <>
      <div className="page-hero page-hero-graphic">
        <Suspense
          fallback={
            <div className="shell">
              <p>Confirming your tip…</p>
            </div>
          }
        >
          <DonateSuccessClient />
        </Suspense>
      </div>
    </>
  );
}
