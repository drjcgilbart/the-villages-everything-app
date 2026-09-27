import { CruiseCentral } from "@/components/CruiseCentral";
import { PageHeroMascot } from "@/components/PageHeroMascot";

export const metadata = {
  title: "Cruise Central",
  description:
    "Florida cruise ports from The Villages — Port Canaveral, Tampa, Jacksonville, Fort Lauderdale, and Miami, plus documents, packing, and getting home.",
};

export default function CruiseCentralPage() {
  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">Ships from Florida</span>
            <h1>Cruise Central</h1>
            <p>
              Five cruise ports you can drive to from The Villages, and the
              un-fun folder that keeps the fun one from going sideways.
              Port Canaveral is the neighborly choice. Miami is the one you
              plan a night around. Ships move. The paperwork does not.
            </p>
          </div>
          <PageHeroMascot
            src="/graphics/cruises/mascot.jpg"
            alt="Golf-ball mascot in a captain’s hat with a telescope and a life ring"
          />
        </div>
      </div>
      <CruiseCentral />
    </>
  );
}
