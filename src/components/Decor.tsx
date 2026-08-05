/* Decorative non-copyrighted graphics helpers */

export function PalmFloat({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/graphics/palm-deco.svg"
      alt=""
      aria-hidden="true"
      className={`deco-palm ${className}`}
    />
  );
}

export function SunBurst({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/graphics/sun-burst.svg"
      alt=""
      aria-hidden="true"
      className={`deco-sun ${className}`}
    />
  );
}

export function WaveDivider() {
  return (
    <div className="wave-divider" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/graphics/divider-waves.svg" alt="" />
    </div>
  );
}

export function GraphicBanner({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`graphic-banner ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} />
      <div className="graphic-banner-fade" />
    </div>
  );
}
