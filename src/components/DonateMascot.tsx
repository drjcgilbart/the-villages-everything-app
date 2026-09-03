import Link from "next/link";

type Variant = "float" | "card" | "inline" | "hero";

const BROKE_SRC = "/graphics/mascot-support.jpg";
const FED_SRC = "/graphics/mascot-logo.jpg";

export function DonateMascot({
  variant = "card",
  className = "",
  broke = false,
  href,
}: {
  variant?: Variant;
  className?: string;
  /** Empty-wallet art until they buy a plan or leave a tip. */
  broke?: boolean;
  href?: string;
}) {
  const dest = href || "/donate";
  const isFloat = variant === "float";
  return (
    <Link
      href={dest}
      className={`donate-mascot donate-mascot-${variant}${
        isFloat ? "" : " hide-in-native-app"
      } ${className}`.trim()}
      aria-label={
        broke
          ? "The Hub mascot is a little light in the wallet — see membership plans"
          : "Thanks for keeping the lights on — Buy me a cup of Joe"
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={broke ? BROKE_SRC : FED_SRC}
        alt=""
        className="donate-mascot-img"
        width={variant === "float" ? 64 : 120}
        height={variant === "float" ? 64 : 120}
      />
      <span className="donate-mascot-copy">
        <span className="donate-mascot-tag">
          {broke ? "A little light in the wallet…" : "Thanks, neighbor!"}
        </span>
        <span className="donate-mascot-sub">
          {broke
            ? "Plans (and tips) keep the Hub fed."
            : "You’re keeping the lights on (and the jokes caffeinated)."}
        </span>
      </span>
    </Link>
  );
}
