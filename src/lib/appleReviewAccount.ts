/** App Store review sign-in. It must stay pending and on the free Porch Waver plan. */
const APPLE_REVIEW_EMAIL = "drgilbart+apple@gmail.com";

export function isAppleReviewEmail(email?: string | null): boolean {
  return String(email || "").trim().toLowerCase() === APPLE_REVIEW_EMAIL;
}
