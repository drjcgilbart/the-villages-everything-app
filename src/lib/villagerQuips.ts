/**
 * PG-rated jokes, sarcastic comments, and witty advice for Villagers.
 * Golf-ball mascot pulls from this bank on a timer (see MascotQuipPopup).
 */

export type QuipKind = "joke" | "sarcasm" | "advice";

export type VillagerQuip = {
  id: string;
  kind: QuipKind;
  text: string;
};

export const VILLAGER_QUIPS: VillagerQuip[] = [
  // —— Jokes ——
  {
    id: "j1",
    kind: "joke",
    text: "I told my GPS “take me home.” It drove me to three wrong gates and a rec center I forgot I belonged to.",
  },
  {
    id: "j2",
    kind: "joke",
    text: "What’s a Villager’s favorite cardio? Speed-walking to the early-bird special before the good tables fill up.",
  },
  {
    id: "j3",
    kind: "joke",
    text: "My golf cart has more personality than my last three cars. Also better parking karma.",
  },
  {
    id: "j4",
    kind: "joke",
    text: "I came here for peace and quiet. I found free outdoor bands, pickleball diplomacy, and a full social calendar. Close enough.",
  },
  {
    id: "j5",
    kind: "joke",
    text: "How many Villagers does it take to change a light bulb? One to change it, four to discuss which rec center has the better ladder club.",
  },
  {
    id: "j6",
    kind: "joke",
    text: "I used to get lost in cities. Now I get lost between villages that all have the same pastel color scheme. Growth.",
  },
  {
    id: "j7",
    kind: "joke",
    text: "My doctor said walk more. The cart path said “hold my beverage holder.”",
  },
  {
    id: "j8",
    kind: "joke",
    text: "Retirement goal: own fewer opinions about national news and more opinions about which square has the better soft-serve line.",
  },
  {
    id: "j9",
    kind: "joke",
    text: "If roundabouts were an Olympic sport, half this town would podium. The other half would still be stuck in the middle circle.",
  },
  {
    id: "j10",
    kind: "joke",
    text: "I joined one club “just to look.” Now my fridge magnets have a denser schedule than my kids ever did.",
  },
  {
    id: "j11",
    kind: "joke",
    text: "Weather report: 92° and humid — perfect conditions for blaming the cart battery instead of your legs.",
  },
  {
    id: "j12",
    kind: "joke",
    text: "Nothing says “active adult” like arguing about court times with the energy of a Supreme Court brief.",
  },

  // —— Sarcasm ——
  {
    id: "s1",
    kind: "sarcasm",
    text: "Oh sure, “just one more hole.” That’s how cart batteries and marriages both get tested.",
  },
  {
    id: "s2",
    kind: "sarcasm",
    text: "Love how “I’ll only stop for coffee” turns into a three-square evening and a mysterious receipt.",
  },
  {
    id: "s3",
    kind: "sarcasm",
    text: "Nothing builds community faster than twelve people explaining the same gate code in twelve different accents.",
  },
  {
    id: "s4",
    kind: "sarcasm",
    text: "Yes, the band is free. Your spine the next morning after dancing on bricks? Slightly less free.",
  },
  {
    id: "s5",
    kind: "sarcasm",
    text: "I love when someone says “traffic’s bad.” Buddy, we’re in golf carts. The emergency is a parade of visors.",
  },
  {
    id: "s6",
    kind: "sarcasm",
    text: "“I’ll just check the live cam.” Famous last words before you’re dressed, charged, and cart-path bound.",
  },
  {
    id: "s7",
    kind: "sarcasm",
    text: "Sure, explain compound interest at dinner. I’ll be over here explaining why the pickleball wait is “basically a war crime.”",
  },
  {
    id: "s8",
    kind: "sarcasm",
    text: "We left the rat race… and immediately joined a cart race to the square at 4:55 p.m.",
  },
  {
    id: "s9",
    kind: "sarcasm",
    text: "Ah yes, the Florida special: sunny, gorgeous, and somehow your phone still says “feels like 104.”",
  },
  {
    id: "s10",
    kind: "sarcasm",
    text: "I moved here to simplify. Now I have three calendars, two clubs, and one strongly held opinion about restaurant bread.",
  },
  {
    id: "s11",
    kind: "sarcasm",
    text: "Nothing says romance like sharing an umbrella at the square while debating whether the band is “too country” or “not country enough.”",
  },
  {
    id: "s12",
    kind: "sarcasm",
    text: "“We’re just looking at houses.” Narrator: they were not just looking at houses.",
  },

  // —— Advice ——
  {
    id: "a1",
    kind: "advice",
    text: "Pro tip: charge the cart at night. Future-you at 6 p.m. band o’clock will send a thank-you note.",
  },
  {
    id: "a2",
    kind: "advice",
    text: "If you’re new: learn your village name, your nearest square, and which gate actually opens for you. Everything else is extracurricular.",
  },
  {
    id: "a3",
    kind: "advice",
    text: "Hydrate like it’s a competitive sport. Florida does not grade on a curve.",
  },
  {
    id: "a4",
    kind: "advice",
    text: "Join one club that scares you a little. That’s usually the one that becomes your people.",
  },
  {
    id: "a5",
    kind: "advice",
    text: "Leave early for the square. Parking is a social experiment and you are the control group.",
  },
  {
    id: "a6",
    kind: "advice",
    text: "Wave at other carts. It’s free, it’s local law (spiritually), and it keeps the porch-waver economy strong.",
  },
  {
    id: "a7",
    kind: "advice",
    text: "Keep a “spare plan B” restaurant. When your first choice has a 40-minute wait, Plan B is marriage counseling.",
  },
  {
    id: "a8",
    kind: "advice",
    text: "Sunscreen is not optional. Neither is reapplying after you “just ran into the store.”",
  },
  {
    id: "a9",
    kind: "advice",
    text: "If the rec center calendar looks full, start with one activity. Momentum beats overwhelm every time.",
  },
  {
    id: "a10",
    kind: "advice",
    text: "Talk to your neighbors. The best Villages amenity isn’t listed on the brochure — it’s the person two doors down who knows a guy.",
  },
  {
    id: "a11",
    kind: "advice",
    text: "When in doubt, check the entertainment schedule before you dress up. Nothing humbles a visor like an empty stage.",
  },
  {
    id: "a12",
    kind: "advice",
    text: "Protect your mornings. Early bird isn’t just a menu — it’s a lifestyle and a parking strategy.",
  },
  {
    id: "a13",
    kind: "advice",
    text: "Say yes to the invitation. You can always leave early. You can’t un-miss the story.",
  },
  {
    id: "a14",
    kind: "advice",
    text: "Label your pickleball paddle. In this economy of identical gear, namesake tape is self-care.",
  },
  {
    id: "a15",
    kind: "advice",
    text: "Keep a light jacket in the cart. Evening square weather has commitment issues.",
  },
  {
    id: "a16",
    kind: "joke",
    text: "My fitness tracker thinks square dancing counts. I choose to believe my fitness tracker.",
  },
  {
    id: "a17",
    kind: "sarcasm",
    text: "“We’ll keep it low-key tonight.” — every Villager right before three clubs and a dessert run.",
  },
  {
    id: "a18",
    kind: "advice",
    text: "Bookmark your village page and your favorite square. Navigation is half the battle; snacks are the other half.",
  },
  {
    id: "a19",
    kind: "joke",
    text: "I asked for a quiet retirement. The universe sent me line dancing and a full inbox of club emails. Message received.",
  },
  {
    id: "a20",
    kind: "sarcasm",
    text: "Love that “no traffic” vibe — until the cart parade discovers a single stop sign and holds a convention.",
  },
];

export function quipKindLabel(kind: QuipKind): string {
  switch (kind) {
    case "joke":
      return "Joke";
    case "sarcasm":
      return "Sarcasm";
    case "advice":
      return "Advice";
  }
}

/** Pick a quip, avoiding recent ids when possible. */
export function pickVillagerQuip(excludeIds: string[] = []): VillagerQuip {
  const pool = VILLAGER_QUIPS.filter((q) => !excludeIds.includes(q.id));
  const list = pool.length > 0 ? pool : VILLAGER_QUIPS;
  return list[Math.floor(Math.random() * list.length)]!;
}
