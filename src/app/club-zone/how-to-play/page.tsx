import { PageHeroMascot } from "@/components/PageHeroMascot";
import { HowToPlayGames } from "@/components/HowToPlayGames";
import Link from "next/link";

export const metadata = {
  title: "How to play",
  description:
    "Rules, scoring, and how a turn works for the card games, mah jongg, shuffleboard, darts, table tennis, and other games neighbors play in The Villages.",
};

export default function HowToPlayPage() {
  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">Clubs</span>
            <h1>How to play</h1>
            <p>
              The games that fill rec-center tables and living rooms in The
              Villages. What the game is, how a turn goes, and how you score.
              House rules still win at the table you sat down at. Ask before
              you play a card.
            </p>
            <div className="hero-actions" style={{ marginTop: "1rem" }}>
              <Link href="/club-zone" className="btn btn-primary">
                Club directory
              </Link>
              <a href="#cards" className="btn btn-ghost">
                Cards
              </a>
              <a href="#rec" className="btn btn-ghost">
                Rec-center games
              </a>
            </div>
          </div>
          <PageHeroMascot
            src="/graphics/mascot-clubs.jpg"
            alt="Golf-ball mascot with a mah-jongg tile and a club pin"
          />
        </div>
      </div>
      <HowToPlayGames />
    </>
  );
}
