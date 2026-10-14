import { HOLIDAY_LIGHTS_TERMS } from "@/lib/holidayLightsTerms";

export function HolidayLightsTermsSection({
  id,
  className,
}: {
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={className}>
      <h2>Terms of Service</h2>
      <p>{HOLIDAY_LIGHTS_TERMS}</p>
    </section>
  );
}
