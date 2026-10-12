import { LightTour } from "@/components/LightTour";

export const metadata = {
  title: "Holiday Light Tour",
  description:
    "A self-guided driving tour of decorated houses in The Villages. Pick Halloween, Christmas, or another holiday, then follow the nearest stops.",
};

export default function HolidayLightTourPage() {
  return (
    <>
      <div className="page-hero">
        <div className="shell">
          <span className="kicker">Self-guided</span>
          <h1>Holiday Light Tour</h1>
          <p>
            Pick a holiday, share where you are, and follow a driving route of decorated houses. A card pops up when
            you get close, with the address, photo, and note.
          </p>
        </div>
      </div>
      <LightTour />
    </>
  );
}
