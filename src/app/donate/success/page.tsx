import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Thanks for the Joe",
  description: "Thank you for supporting The Villages Hub.",
};

export default function DonateSuccessPage() {
  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">Transaction complete · vibe elevated</span>
            <h1>You kept the lights on!</h1>
            <p>
              Thank you for the cup of Joe (or the early-bird brunch upgrade).
              Your tip helps this retirement reboot stay online, weird, and
              caffeinated.
            </p>
            <div className="hero-actions" style={{ marginTop: "1.25rem" }}>
              <Link href="/" className="btn btn-primary">
                Back home
              </Link>
              <Link href="/videos" className="btn btn-ghost">
                Watch something
              </Link>
              <Link href="/blog" className="btn btn-ghost">
                Read the blog
              </Link>
            </div>
          </div>
          <div className="page-hero-art">
            <Image
              src="/graphics/mascot-logo.jpg"
              alt="Grateful golf-ball mascot"
              width={260}
              height={260}
              className="page-hero-img donate-hero-mascot"
              priority
            />
          </div>
        </div>
      </div>
    </>
  );
}
