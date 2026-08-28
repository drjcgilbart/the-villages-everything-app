import Link from "next/link";

type Variant = "float" | "card" | "inline" | "hero";

export function DonateMascot({
  variant = "card",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link
      href="/donate"
      className={`donate-mascot donate-mascot-${variant} hide-in-native-app ${className}`.trim()}
      aria-label="Buy me a cup of Joe — donate to keep the lights on"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/graphics/mascot-logo.jpg"
        alt=""
        className="donate-mascot-img"
        width={variant === "float" ? 64 : 120}
        height={variant === "float" ? 64 : 120}
      />
      <span className="donate-mascot-copy">
        <span className="donate-mascot-tag">Buy me a cup of Joe!</span>
        <span className="donate-mascot-sub">
          Keep the lights on (and the jokes caffeinated)…
        </span>
      </span>
    </Link>
  );
}
