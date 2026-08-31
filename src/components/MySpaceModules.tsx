"use client";

/** Re-export full boards (ported from My Retirement Reboot). */
export { MySpaceHealthBoard as MySpaceHealthLog } from "@/components/MySpaceHealthBoard";
export { MySpacePetBoard as MySpacePetSchedule } from "@/components/MySpacePetBoard";

export { MySpaceCalendarBoard } from "@/components/MySpaceCalendarBoard";

export function MySpaceRoyaltyLounge() {
  return (
    <div className="about-panel ms-module ms-lounge">
      <p className="ms-module-lead">
        Welcome to the metaphorical front row. Parking is still a contact sport;
        the badge is free (with your plan).
      </p>
      <ul className="ts-tips-list">
        <li>
          <strong>Early peeks</strong> — experimental Hub features land here
          first when we ship them.
        </li>
        <li>
          <strong>Parade energy</strong> — you’re on the short list for
          member-only notes and soft launches.
        </li>
        <li>
          <strong>Bragging rights</strong> — Square Royalty flair on your My
          Space header. Use responsibly at dinner.
        </li>
      </ul>
      <p className="mkt-disclaimer" style={{ marginBottom: 0 }}>
        This lounge is a living space — more exclusive content can be added from
        Studio as the Hub grows. Not affiliated with any official square, parade
        committee, or golf cart mafia.
      </p>
    </div>
  );
}
