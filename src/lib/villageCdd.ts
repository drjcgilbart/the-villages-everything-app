/**
 * Official District Government links for CDD bonds and Architectural Review.
 * Amounts vary by unit/lot — we never invent a dollar figure.
 * Sources: districtgov.org (District pages, Finance, Community Standards).
 */

import type { Village } from "./villages";
import { cddLabel } from "./villages";

const DISTRICT_SLUG: Record<number, string> = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
  10: "ten",
  11: "eleven",
  12: "twelve",
  13: "thirteen",
  14: "fourteen",
  15: "fifteen",
};

export const DISTRICT_FINDER_URL = "https://www.districtgov.org/districts/finder/";
export const DISTRICT_FINANCE_URL =
  "https://www.districtgov.org/services/administration/finance/";
export const DISTRICT_FAQ_URL = "https://www.districtgov.org/how-to/faqs/";
/** Official online ARC / modification application (District Government). */
export const ARC_APPLICATION_URL = "https://villagecenterfl.govbuilt.com/";
export const ARC_COMMITTEE_URL =
  "https://www.districtgov.org/districts/committees/architectural-review/";
export const BOND_TEAM_PHONE = "352-751-3900";
export const ARC_PHONE = "352-751-3912";

export function districtPageUrl(cdd: Village["cdd"]): string {
  if (cdd === "lady-lake") {
    return "https://www.districtgov.org/districts/residential/lake-county-lady-lake/";
  }
  if (typeof cdd === "number" && DISTRICT_SLUG[cdd]) {
    return `https://www.districtgov.org/districts/residential/${DISTRICT_SLUG[cdd]}/`;
  }
  return DISTRICT_FINDER_URL;
}

export function arcManualUrl(cdd: Village["cdd"]): string | null {
  if (typeof cdd === "number" && cdd >= 1 && cdd <= 15) {
    return `https://www.districtgov.org/forms/district-${cdd}-arc-manual`;
  }
  return null;
}

export function arcMeetingHint(cdd: Village["cdd"]): string {
  if (cdd === "lady-lake") {
    return "Lady Lake / Lake County ARC typically meets Wednesdays at 8:30 a.m. at the District Office, 3571 Kiessel Road (Brownwood). Confirm on districtgov.org.";
  }
  if (typeof cdd === "number" && [1, 6, 11, 12, 13, 14, 15].includes(cdd)) {
    return "This district’s ARC (or hearing officer) typically meets Wednesdays at 1:00 p.m. at Ezell Recreation, 769 Marilee Place. Confirm on districtgov.org.";
  }
  if (typeof cdd === "number") {
    return "This district’s ARC typically meets Wednesdays at 8:30 a.m. at the District Office, 3571 Kiessel Road (Brownwood). Confirm on districtgov.org.";
  }
  return "Confirm your ARC meeting time on the Architectural Review Committee page at districtgov.org.";
}

export function villageDistrictLinks(village: Village) {
  const label = cddLabel(village.cdd);
  return {
    label,
    known: village.cdd != null,
    districtPage: districtPageUrl(village.cdd),
    finance: DISTRICT_FINANCE_URL,
    finder: DISTRICT_FINDER_URL,
    faq: DISTRICT_FAQ_URL,
    arcApply: ARC_APPLICATION_URL,
    arcCommittee: ARC_COMMITTEE_URL,
    arcManual: arcManualUrl(village.cdd),
    bondPhone: BOND_TEAM_PHONE,
    arcPhone: ARC_PHONE,
    meetingHint: arcMeetingHint(village.cdd),
  };
}
