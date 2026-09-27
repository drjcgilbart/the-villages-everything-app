import { PageHeroMascot } from "@/components/PageHeroMascot";
import { ThemeParksGuide } from "@/components/ThemeParksGuide";

export const metadata = {
  title: "Theme Parks",
  description:
    "Disney World, Universal, Epic Universe, SeaWorld, Discovery Cove, Busch Gardens, smaller Florida parks, and water parks within a day’s drive of The Villages.",
};

export default function ThemeParksPage() {
  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">One park is a day</span>
            <h1>Theme Parks</h1>
            <p>
              Disney, Universal, SeaWorld, Busch Gardens, the smaller gates,
              and the water parks, from the middle of The Villages. Tickets,
              parking, and which water park is open all change. The park’s own
              site is the one that knows about tomorrow.
            </p>
          </div>
          <PageHeroMascot
            src="/graphics/theme-parks/mascot.jpg"
            alt="Golf-ball mascot with a sun hat, a park map, and a pretzel"
          />
        </div>
      </div>
      <ThemeParksGuide />
    </>
  );
}
