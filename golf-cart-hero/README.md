# The Villages Golf Cart Hero

Mario Kart–style golf cart racing through a whimsical cartoon approximation of **The Villages, Florida**.

Sister project theming comes from **[The Villages Everything App](../the-villages-idiot)** — cream / palm / sunset / pool palette, Fraunces + DM Sans, and Florida critter drivers (alligator, turtle, manatee, armadillo, raccoon, pelican, ibis, otter).

## Play on PC (now)

```bash
cd villages-golf-cart-hero
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173` or `http://127.0.0.1:5173`).

### Optional: Stripe tips ($1 / $3 / $5)

Tips use **your Stripe account** (same keys as The Villages Everything App). Copy `.env.example` → `.env.local` and set:

```bash
STRIPE_SECRET_KEY=sk_test_...   # or sk_live_... for production
SITE_URL=http://127.0.0.1:5173  # must match the browser URL for success redirects
```

Restart `npm run dev`. From the main menu, open **Tip the Dev** — Checkout is handled by a Vite middleware at `/api/donate/*`. After a successful tip, this browser unlocks a **supporter flag** on the player cart:

| Tip | Flag |
|-----|------|
| $1 | Red + mascot |
| $3 | Blue + mascot |
| $5 | Gold + mascot |

Highest tip wins. Flag state is stored in `localStorage` on this device.

### Controls

| Action | Keys |
|--------|------|
| Gas | `W` / `↑` |
| Brake / reverse | `S` / `↓` |
| Steer | `A` `D` / `←` `→` |

On phones, tilt left/right to steer, tip forward to accelerate, and tip back to brake. WASD / arrows still work on PC.

## What’s in v0.2

- **Mario Kart–style chase camera** (behind the cart, looking down the road — Three.js 3D)
- **Dense cartoon world**: houses, palms, street lamps, ponds, golf fairways, sidewalks, town-square plazas, rec centers
- **Real Villages geography**: town squares & rec centers from OpenStreetMap Nominatim coordinates; race loop follows a compressed Morse / Buena Vista / southern corridor approximation
- **3 carts** · **8 Florida critter drivers**
- **Visible hazards** on the road ahead with labels, ground rings, HUD warnings, and collisions
- **Lanai Legends** local leaderboard  


## Art pipeline (v1)

Photoreal albedo textures live in `public/assets/textures/`:

| Pack | Files |
|------|--------|
| **Terrain** | asphalt, grass, fairway, sidewalk, water, curb |
| **Houses** | stucco, terracotta roof, wood door, glass |
| **Palms** | bark, frond |
| **Carts** | Yamaha / Evolution / Hot Rod paint |

Loaded at startup via `src/game/assets/loader.ts` into Three.js materials. See `public/assets/README.md` and `manifest.json`.

**Next pipeline steps:** normal/roughness maps, GLB models from Blender, LODs for mobile.

## Path to Android & iPhone

The Play Store shell lives in `mobile/` (Expo WebView, same pattern as The Villages Everything App).

1. Publish the web game onto the live site:

```bat
cd "C:\Users\Jonathan Gilbart\villages-golf-cart-hero"
npm.cmd run publish:web
```

That copies a production build to `the-villages-idiot/public/golf-cart-hero/` (URL `/golf-cart-hero/`).

2. Build the store package (cloud, no Android Studio required):

```bat
cd "C:\Users\Jonathan Gilbart\villages-golf-cart-hero\mobile"
npx.cmd eas-cli build --platform android --profile production
```

Full click-by-click Play Console steps: [`mobile/GOOGLE-PLAY-WALKTHROUGH.md`](mobile/GOOGLE-PLAY-WALKTHROUGH.md).

The Play app hides Stripe tips (Google Play Billing rules). Tips stay on the website.

## Project layout

```
src/
  main.ts              # boot, game loop
  style.css            # Everything App–aligned UI
  theme.ts             # brand + color tokens
  game/
    race.ts            # physics, AI, hazards, scoring
    render.ts          # world / cart / landmark drawing
    input.ts
    leaderboard.ts     # Lanai Legends
    ui.ts              # menus + HUD
    data/
      carts.ts
      drivers.ts
      track.ts
      landmarks.ts
      hazards.ts
```

## Accuracy notes

- **Town Squares (5)** and **regional rec centers** are placed with relative geographic intent (north historic → south Brownwood → east Eastport / Sawgrass).  
- Neighborhood fill, ponds, and golf fairways are **whimsical approximations**, not a survey map.  
- We can tighten landmark placement and add more villages as we refine.

## Race music (per Town Square)

Each of the five drive areas plays a **real-instrument / live-band** loop (not game synth) while you race. Files live in `public/assets/music/` with sources listed in `CREDITS.json`. Mute from the race HUD.

| Area | Vibe |
|------|------|
| Spanish Springs | Spanish / flamenco guitar |
| Sumter Landing | Lakeside big-band jazz |
| Brownwood | Old-time dance / paddock |
| Eastport | Mid-century blues |
| Sawgrass Grove | Easy bossa nova |

## Refine next (ideas)

- Item boxes / cart-path power-ups  
- Multiplayer or weekly Lanai Legends cloud board  
- More tracks (Historic Side loop, South side only, Eastport night race)  

Race SFX (countdown, fire, pickups, hazards, gates, finish) and a **Copy challenge** share line are in.  


---

*Not affiliated with The Villages® brand owners. Fan-made whimsical game.*
