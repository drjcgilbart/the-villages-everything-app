import Image from "next/image";

/** Circular golf-ball mascot for a Hub page hero — same lockup as My Space / About. */
export function PageHeroMascot({
  src,
  alt,
  priority = true,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <div className="page-hero-art">
      <Image
        src={src}
        alt={alt}
        width={280}
        height={280}
        className="about-mascot about-mascot-round"
        priority={priority}
      />
    </div>
  );
}
