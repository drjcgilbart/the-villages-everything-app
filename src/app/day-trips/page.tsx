import { DayTripsGuide } from "@/components/DayTripsGuide";
import { PageHeroMascot } from "@/components/PageHeroMascot";

export const metadata = {
  title: "Day Trips & Fun Stuff",
  description:
    "Springs, beaches, animals, space, and small towns within a day’s drive of The Villages, Florida — for residents, their grown kids, and the grandkids.",
};

export default function DayTripsPage() {
  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">Home by bedtime</span>
            <h1>Day Trips &amp; Fun Stuff</h1>
            <p>
              Places a Villages neighbor can reach in a day — with the grown
              kids, the grandkids, or just the passenger who picks the music.
              Drive times start from the middle of town. Tickets, shows, and
              tides change. Check before you put the cart on the charger and
              steal the car.
            </p>
          </div>
          <PageHeroMascot
            src="/graphics/day-trips/mascot.jpg"
            alt="Golf-ball mascot with a sun hat, a map, and a cooler"
          />
        </div>
      </div>
      <DayTripsGuide />
    </>
  );
}
