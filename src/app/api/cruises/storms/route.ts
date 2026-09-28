import { NextResponse } from "next/server";

export const revalidate = 3600;

type Storm = {
  id?: string;
  name?: string;
  classification?: string;
  publicAdvisory?: { url?: string };
};

/** Atlantic systems only. The National Hurricane Center list, not a local forecast. */
export async function GET() {
  try {
    const res = await fetch("https://www.nhc.noaa.gov/CurrentStorms.json", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("nhc");
    const data = (await res.json()) as { activeStorms?: Storm[] };
    const storms = (data.activeStorms || [])
      .filter((storm) => String(storm.id || "").toLowerCase().startsWith("al"))
      .map((storm) => ({
        id: storm.id,
        name: storm.name || "Unnamed",
        classification: storm.classification || "",
        advisory: storm.publicAdvisory?.url || "https://www.nhc.noaa.gov/",
      }));
    return NextResponse.json({ storms });
  } catch {
    return NextResponse.json({ storms: null });
  }
}
