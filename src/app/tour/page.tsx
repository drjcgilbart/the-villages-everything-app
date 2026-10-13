import { LightTour } from "@/components/LightTour";
import { getSessionMember } from "@/lib/memberAuth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Holiday Lights Tour",
  description:
    "A self-guided driving tour of decorated houses in The Villages. The map follows the phone and speaks the turns.",
};

export default async function HolidayLightTourPage() {
  const member = await getSessionMember();
  return (
    <>
      <div className="page-hero">
        <div className="shell">
          <span className="kicker">Self-guided</span>
          <h1>Holiday Lights Tour</h1>
          <p>
            Pick a holiday, share where you are, and follow a driving route of decorated houses. On a phone, the map
            stays with you and the turns are spoken out loud. A card pops up when you get close, with the address,
            photo, and note.
          </p>
        </div>
      </div>
      <LightTour memberStatus={member?.status ?? null} />
    </>
  );
}
