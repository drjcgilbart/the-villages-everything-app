/**
 * One comic starter row per add-an-entry list.
 * IDs start with `ex-` so we can tell jokes from a neighbor’s real notes.
 * Sanitizers must apply these only when a list is missing — never when it is [].
 */
import type { BoardId } from "./mySpaceProduct";
import type { MemberBoards } from "./memberBoardModel";
import { VILLAGES_LAT, VILLAGES_LON, VILLAGES_TZ } from "./weather";

export function isoDaysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function isExampleId(id: string | undefined | null) {
  return String(id || "").startsWith("ex-");
}

export const SAMPLE_HINT =
  "The silly starter entries are examples, not your life. Delete any of them when you add the real thing — they will not sneak back.";

/** Glass-door preview lines for visitors and locked plans. */
export const SAMPLE_GLASS: Partial<Record<BoardId, string[]>> = {
  weather: [
    "The Villages, FL — 92° and ‘feels like a parking lot’",
    "Grandkids (colder than a cart seat in January) — example city",
  ],
  health: [
    "Meds: Vitamin D (and D for ‘Did I already take this?’) at 8:00",
    "Dinner: early-bird grouper at 4:17 p.m. — 4:30 is for amateurs",
    "Exercise: water aerobics, mostly gossip with a splash",
  ],
  gym: [
    "Rohan Fit Club — towel in the cart, opinions in the locker room",
    "Workout: leg day postponed due to pickleball diplomacy",
  ],
  pets: [
    "Biscuit — retired sniffer dog, still unionized at 7:30 a.m. walks",
    "Breakfast 8:00 · the look if you’re late is in the employee handbook",
  ],
  food: [
    "Favorite: City Fire — I clapped at the pianist and called it cardio",
    "Grocery: Boar’s Head turkey, the diplomatic sandwich of HOA night",
  ],
  entertainment: [
    "Tonight: Spanish Springs — chair, sweater, volume opinion",
    "Show: Jersey Boys at Sharon — confirmation is on a napkin",
  ],
  maintenance: [
    "Asset: The Cart (Almost Paid Off)",
    "Job: 12-volt battery — replace before it dies in the Publix lot",
  ],
  calendar: ["Grandkids Saturday — hide the good snacks, stock freezer pops"],
  memories: [
    "Spanish Springs at golden hour — I was there for the lighting, not the wrong roundabout",
  ],
  golfLog: [
    "Executive 9 I swore was a walk in the park",
    "Need a fourth who pretends not to notice my mulligan policy",
  ],
  pickleballLog: [
    "DUPR 3.0 — my knees filed a dissent",
    "Last match: 11–9, 5–11, 11–8 · Court 3 · I ‘let them have’ one",
  ],
  news: [
    "Following: The Villages",
    "Muted: HOA rumor mill (example — delete me)",
  ],
  investments: [
    "Rainy-Day Soft-Serve Fund · cash $1",
    "Watching KO — pickleball always wants a Coke after",
  ],
  favorites: ["Star a square, a rec center, a club — this is your fridge-magnet wall"],
};

export const SAMPLE_HEALTH = {
  medications: [
    {
      id: "ex-health-med",
      name: "Vitamin D (and D for “Did I already take this?”)",
      dosage: "1,000 IU",
      schedule: "With breakfast, after the cart keys are located",
      notes: "Example — delete me when you add your real bottles. Not medical advice.",
      timesPerDay: 1,
      doseTimes: [
        { id: "ex-health-med-t", time: "08:00", label: "Breakfast", enabled: true },
      ],
      alarmEnabled: true,
      active: true,
    },
  ],
  meals: [
    {
      id: "ex-health-meal",
      date: isoDaysFromNow(0),
      time: "16:17",
      mealType: "dinner",
      title: "Early-bird grouper — 4:30 is for amateurs",
      calories: 620,
      notes: "Shared a roll. Called it portion control. Example — delete me.",
      photoName: "",
    },
  ],
  exercises: [
    {
      id: "ex-health-ex",
      date: isoDaysFromNow(-1),
      time: "09:30",
      activity: "Swimming",
      durationMin: 45,
      distance: null,
      distanceUnit: "mi" as const,
      calories: 220,
      notes: "Water aerobics: 20% kicking, 80% neighborhood intelligence. Example — delete me.",
    },
  ],
  sleeps: [
    {
      id: "ex-health-sleep",
      date: isoDaysFromNow(-1),
      hours: 6.5,
      quality: "average",
      notes: "Interrupted by a golf cart that thinks 5:45 a.m. is a personality. Example — delete me.",
      bedtime: "22:40",
      waketime: "05:45",
      interruptions: 2,
    },
  ],
  journals: [
    {
      id: "ex-health-journal",
      date: isoDaysFromNow(0),
      title: "Wrong way on Morse, still made pickleball",
      mood: "Hopeful / slightly lost",
      body: "Went the scenic route, which is what we call ‘I missed the roundabout exit.’ Character building. Example — delete me when you write a real one.",
    },
  ],
  entries: [
    {
      date: isoDaysFromNow(0),
      weight: 182,
      notes: "Rec-center scale is more optimistic than mine. Example — delete me.",
    },
  ],
  progressPhotos: [
    {
      id: "ex-health-photo",
      date: isoDaysFromNow(0),
      caption: "Week 1 of “I’ll walk more” — still in talks with the cart. Example — delete me.",
      weight: 182,
      photoName: "",
    },
  ],
};

export const SAMPLE_PET = {
  id: "ex-pet-biscuit",
  name: "Biscuit",
  species: "dog",
  breed: "Retired sniffer (unionized)",
  color: "Butterscotch",
  sex: "unknown",
  birthday: "2018-03-12",
  weight: 18,
  notes: "Knows every cart path and zero recall. Example pet — delete Biscuit when you add your own pack.",
  vetName: "The Villages Animal Hospital (example)",
  vetPhone: "",
  photoName: "",
  alarmSound: "classic" as const,
  alarmDurationSec: 30,
  walkAlarmEnabled: true,
  feedAlarmEnabled: true,
  walks: [
    { id: "ex-pet-walk-am", time: "07:30", label: "Morning walk (non-negotiable)", enabled: true },
    { id: "ex-pet-walk-pm", time: "17:30", label: "Evening walk / neighborhood audit", enabled: true },
  ],
  feeds: [
    { id: "ex-pet-feed-am", time: "08:00", label: "Breakfast — do not be late", enabled: true },
    { id: "ex-pet-feed-pm", time: "18:00", label: "Dinner / HOA snack tax", enabled: true },
  ],
};

export const SAMPLE_WEATHER_EXTRA = {
  id: "ex-wx-grandkids",
  label: "Grandkids (colder than a cart seat in January)",
  query: "Cleveland, OH",
  zip: "",
  name: "Cleveland",
  admin1: "Ohio",
  country: "United States",
  countryCode: "US",
  latitude: 41.4993,
  longitude: -81.6944,
  timezone: "America/New_York",
};

export function sampleBoards(): MemberBoards {
  const today = isoDaysFromNow(0);
  const yday = isoDaysFromNow(-1);
  const sat = isoDaysFromNow(3);
  const thu = isoDaysFromNow(2);

  return {
    news: {
      topics: ["villages"],
      customTopics: [],
      youtube: [],
      saved: [],
      people: [
        {
          id: "me",
          name: "Me",
          topics: [
            {
              id: "ex-news-top-villages",
              presetId: "villages",
              label: "The Villages",
              query: "The Villages Florida news",
              ticker: "",
              emoji: "🏡",
            },
          ],
          creators: [],
          muteWords: ["HOA rumor mill"],
          saved: [
            {
              id: "ex-news-saved",
              title: "Local roundabout declared “fine actually” by people who live here (example)",
              url: "https://www.villages-news.com/",
            },
          ],
          hidden: [],
        },
      ],
      activePersonId: "me",
    },
    entertainment: {
      tonightSquare: "spanish-springs",
      tonightNotes: "Chair, sweater, and a prepared opinion about the volume. Example — clear this when you pick a real night.",
      tonightDate: today,
      watchLater: [
        {
          id: "ex-ent-watch",
          title: "The Netflix thing the grandkids swore I’d love",
          type: "movie",
          where: "Lanai TV",
          date: "",
          time: "",
          days: [],
          notes: "Lasted 11 minutes. Fell asleep during the opening logo. Example — delete me.",
          done: false,
        },
      ],
      shows: [
        {
          id: "ex-ent-show",
          title: "Jersey Boys (I already know every word, I’m still going)",
          when: "Saturday",
          venue: "The Sharon Performing Arts Center",
          date: sat,
          time: "19:30",
          confirmation: "On a napkin in the cup holder",
          notes: "Park at the rec center, dinner at 4:17 like a professional. Example — delete me.",
        },
      ],
      clubs: [
        {
          id: "ex-ent-club",
          name: "Mahjong — we do not discuss last Thursday’s tile",
          when: "Thursdays",
          rec: "Eisenhower Recreation",
          location: "Eisenhower Recreation",
          kind: "weekly",
          days: ["Thu"],
          interval: 1,
          time: "13:00",
          extraDates: [],
          notes: "Bring a card and a sense of humor. Example — delete me.",
        },
      ],
      golfFavs: ["Executive 9 I can finish before early-bird"],
      pickleFavs: ["Rohan — where friendships go to get a good workout"],
    },
    food: {
      favorites: [
        {
          id: "ex-food-fav",
          name: "City Fire",
          square: "spanish-springs",
          cuisine: "American / live music",
          notes: "I clapped at the pianist and counted it as cardio. Example — delete me.",
        },
      ],
      happyHours: [
        {
          id: "ex-food-hh",
          place: "Lake Sumter Landing (pick a patio)",
          square: "lake-sumter",
          days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          startTime: "15:00",
          endTime: "18:00",
          specials: "$3 drafts and a sudden interest in sunsets. Example — delete me.",
        },
      ],
      grocery: [
        {
          id: "ex-food-groc",
          name: "Boar’s Head turkey",
          store: "Publix",
          aisle: "Deli",
          done: false,
        },
      ],
      groceryStores: ["Publix"],
      cellar: [
        {
          id: "ex-food-wine",
          name: "Whatever was on sale at Total Wine and reminded me of a cruise",
          kind: "wine",
          notes: "Pairs with grouper and denial about tomorrow’s pickleball. Example — delete me.",
        },
      ],
      meals: {
        [today]: {
          breakfast: "Coffee + the good yogurt I hide from guests",
          lunch: "Leftover early-bird (it’s a lifestyle)",
          dinner: "Something grilled, unless the square has a band",
        },
      },
      recipes: [
        {
          id: "ex-food-rcp",
          name: "Crockpot chicken that has saved three potlucks and one friendship",
          category: "dinner",
          source: "A neighbor who will not give exact amounts",
          ingredients: "Chicken\nA can of something creamy\nHope\nA rec-center serving spoon",
          steps: "Dump. Cook on low while you play nine. Pretend it was a process.",
          notes: "Example — delete me when you add Grandma’s actual card.",
          photoName: "",
        },
      ],
      tipPct: 18,
    },
    gym: {
      homeGymId: "ex-gym-rohan",
      gyms: [
        {
          id: "ex-gym-rohan",
          name: "Rohan Fit Club",
          kind: "district",
          chain: "Fit Club",
          location: "Rohan Recreation",
          address: "850 Kristine Way, The Villages, FL 32163",
          phone: "352-674-8400",
          hours: "Confirm at the rec desk",
          membership: "Fit Club — separate from the amenity fee",
          notes: "Towel in the cart. Opinions in the locker room. Example — delete me.",
        },
      ],
      workouts: [
        {
          id: "ex-gym-wo",
          date: yday,
          time: "08:00",
          gymId: "ex-gym-rohan",
          gymName: "Rohan Fit Club",
          durationMin: 40,
          felt: "fine",
          notes: "Leg day postponed due to pickleball diplomacy. Example — delete me.",
          exercises: [
            {
              name: "Recumbent bike (the thinking person’s cardio)",
              kind: "cardio",
              equipment: "Bike",
              sets: [{ weight: "", reps: "", seconds: 600 }],
            },
          ],
        },
      ],
      supplements: [
        {
          id: "ex-gym-sup",
          name: "Magnesium",
          dose: "the amount on the bottle I squint at",
          when: "Evening",
          days: "Daily",
          notes: "For calves that forgot they were retired. Example — delete me. Not medical advice.",
        },
      ],
      supplementLogs: [],
    },
    maintenance: {
      assets: [
        {
          id: "ex-maint-cart",
          name: "The Cart (Almost Paid Off)",
          kind: "golf-cart",
          year: "2019",
          make: "Club Car",
          model: "Onward-ish",
          meter: 1840,
          vendor: "The usual cart shop",
          notes: "Named after the payment plan. Example — delete me when you add your real cart/house.",
        },
      ],
      tasks: [
        {
          id: "ex-maint-job",
          assetId: "ex-maint-cart",
          title: "12-volt battery — replace before it dies in the Publix lot",
          notes: "It always picks the parking space farthest from shade. Example — delete me.",
          dueDate: isoDaysFromNow(10),
          dueMeter: 1900,
          repeatEvery: 12,
          repeatUnit: "months",
          repeatEnabled: true,
          autoRepeat: true,
          alarmEnabled: true,
          alarmTime: "08:00",
          remindDays: 7,
          done: false,
          doneDate: "",
          doneMeter: null,
          cost: "",
          doneNotes: "",
        },
      ],
      activeAssetId: "ex-maint-cart",
    },
    memories: {
      photos: [
        {
          id: "ex-photo-1",
          kind: "photo",
          name: "",
          url: "",
          caption:
            "Spanish Springs at golden hour — I was there for the lighting, not the wrong roundabout. Example — delete me.",
          place: "Spanish Springs Town Square",
          date: yday,
          section: "private",
          addedAt: today,
        },
      ],
    },
    golfLog: {
      rounds: [
        {
          id: "ex-golf-rd",
          date: yday,
          course: "Turtle Mound",
          courseId: "turtle-mound",
          holes: 9,
          scores: [4, 5, 4, 6, 4, 5, 3, 8, 4],
          par: [3, 3, 3, 3, 3, 3, 3, 3, 3],
          notes: "Lost two balls and one argument about winter rules. Example — delete me.",
          players: [
            {
              name: "Me",
              hdcp: "18",
              scores: [4, 5, 4, 6, 4, 5, 3, 8, 4],
            },
          ],
        },
      ],
      teeTimes: [
        {
          id: "ex-golf-tt",
          date: thu,
          time: "08:06",
          course: "Whatever the starter still has",
          notes: "Need a cart with a working beverage holder. Example — delete me.",
        },
      ],
      looking: [
        {
          id: "ex-golf-look",
          name: "Me",
          phone: "",
          date: thu,
          time: "08:00",
          need: "1 more",
          hdcp: "18",
          notes: "Need a fourth who pretends not to notice my mulligan policy. Example — delete me.",
        },
      ],
      regulars: [
        {
          id: "ex-golf-reg",
          name: "The neighbor who always has extra tees",
          hdcp: "16",
          phone: "",
        },
      ],
      favoriteCourseIds: ["turtle-mound"],
      myName: "Me",
      myHdcp: "18",
    },
    pickleballLog: {
      profile: {
        name: "I Play Down (Allegedly)",
        duprSingles: "2.8",
        duprDoubles: "3.0",
        notes: "DUPR is a suggestion. My knees have veto power. Example — clear this when you add yours.",
        phone: "",
        pcvg: "3.0 rec",
      },
      matches: [
        {
          id: "ex-pb-match",
          date: yday,
          time: "08:30",
          format: "doubles",
          partner: "The neighbor with the good drop shot",
          opponent: "Two people who ‘just started last month’",
          opp1: "Two people who ‘just started last month’",
          opp2: "",
          score: "11-9, 5-11, 11-8",
          court: "Rohan Recreation",
          courtId: "rohan",
          win: true,
          postedDupr: false,
          notes: "Example — delete me.",
        },
      ],
      people: [
        {
          id: "ex-pb-pal",
          name: "Pat from open play",
          notes: "Always has a spare paddle and a rumor. Example — delete me.",
          dupr: "3.2",
          kind: "both",
          phone: "",
        },
      ],
      looking: [
        {
          id: "ex-pb-look",
          name: "Me",
          need: "1",
          format: "doubles",
          court: "rohan",
          courtName: "Rohan Recreation",
          date: thu,
          time: "09:00",
          contact: "",
          notes: "Beginner-friendly until game three, then it’s a documentary. Example — delete me.",
        },
      ],
      favoriteCourtIds: ["rohan"],
      leagues: [
        {
          id: "ex-pb-lg",
          name: "Rohan morning social (example)",
          when: "Weekdays 7–10 a.m.",
          notes: "Paddle stack. Heat index 104° shuts it down. Example — delete me.",
        },
      ],
    },
    health: { ...SAMPLE_HEALTH },
    pets: { activePetId: SAMPLE_PET.id, pets: [{ ...SAMPLE_PET }], completions: {} },
    calendar: {
      tasks: [
        {
          id: "ex-cal-1",
          title: "Grandkids Saturday — hide the good snacks",
          notes: "Stock freezer pops. Hide the Cashews of Diplomacy. Example — delete me.",
          startDate: sat,
          startTime: "11:00",
          endDate: sat,
          endTime: "16:00",
          timerMinutes: null,
          timerEndsAt: null,
          timerPausedMs: null,
          alarmEnabled: false,
          done: false,
        },
      ],
    },
    portfolio: {
      holdings: [],
      accounts: [
        {
          id: "ex-fin-acct",
          name: "Rainy-Day Soft-Serve Fund",
          included: true,
          holdings: [
            {
              id: "ex-fin-cash",
              kind: "cash",
              symbol: "CASH",
              shares: 1,
              avgCost: 1,
              divShare: 0,
              divFreq: "none",
              exDiv: "",
              payDate: "",
              divGot: 0,
            },
          ],
        },
      ],
      watchlist: ["KO"],
    },
    weather: {
      activeId: "loc-home",
      locations: [
        {
          id: "loc-home",
          label: "The Villages, FL",
          query: "34762",
          zip: "34762",
          name: "The Villages",
          admin1: "Florida",
          country: "United States",
          countryCode: "US",
          latitude: VILLAGES_LAT,
          longitude: VILLAGES_LON,
          timezone: VILLAGES_TZ,
        },
        { ...SAMPLE_WEATHER_EXTRA },
      ],
    },
  };
}
