import { LightTourAdmin } from "@/components/LightTourAdmin";

export const metadata = {
  title: "Holiday Lights Tour pins",
  robots: { index: false, follow: false },
};

export default function HolidayLightTourAdminPage() {
  return (
    <>
      <div className="page-hero">
        <div className="shell">
          <span className="kicker">Site owner</span>
          <h1>Drop light-tour pins</h1>
          <p>Save the house you are parked at, then tag it Halloween, Christmas, or Other.</p>
        </div>
      </div>
      <LightTourAdmin />
    </>
  );
}
