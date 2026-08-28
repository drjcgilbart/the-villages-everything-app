# Google Play — simple first-time walkthrough

**Goal:** Put **The Villages Everything App** on the Google Play Store.

Your mobile app is already an Expo / React Native shell that opens your live website:
`https://www.thevillageseverythingapp.com`

You **do not** need to rebuild the whole website for the phone. You only need to:

1. Build a store package (`.aab`)
2. Create the app listing in Play Console
3. Upload the package and submit for review

---

## What is already done for you

| Item | Status |
|------|--------|
| Live website | Working |
| Privacy policy | `https://www.thevillageseverythingapp.com/privacy` |
| Expo account | Logged in as `drjcgilart` / org `the-villages-everything-app` |
| App config | `app.json` package id `com.thevillageseverythingapp.app` |
| App icon | `assets/icon.png` (1024×1024) + `assets/play-icon-512.png` |
| Feature graphic draft | `assets/play-feature-graphic.jpg` (upload to Play Console) |
| Adaptive Android icon | Present |
| **Production .aab already built** | Ready to download (see below) |
| Store listing text | Copy/paste blocks below |

### Your ready-to-upload Android package

A **production** build already finished on Expo:

- Build page: https://expo.dev/accounts/the-villages-everything-app/projects/the-villages-everything-app/builds/ea575534-3d6f-45f1-a61b-b6b3af076962  
- Direct **.aab** download: https://expo.dev/artifacts/eas/cAVq2_DbGvSC_ZppkEjg1dm8g-5XRMg578UniouBaBE.aab  
- Version: **1.0.0** · versionCode **1**

You can skip rebuilding for the first upload unless you changed the app after Aug 9, 2026.

---

## Part A — Create the app in Google Play Console (you click)

Open: https://play.google.com/console

1. **Create app** (if you have not already)
   - App name: **The Villages Everything App**
   - Default language: **English (United States)**
   - App or game: **App**
   - Free or paid: **Free**
   - Accept declarations → **Create app**

2. Complete the **Dashboard checklist** items as they appear (you can finish listing details before or after upload).

---

## Part B — Get the Android package

### Option 1 (fastest) — use the package already built

1. Open this link and sign into Expo if asked:  
   https://expo.dev/accounts/the-villages-everything-app/projects/the-villages-everything-app/builds/ea575534-3d6f-45f1-a61b-b6b3af076962  
2. Click **Download** for the **.aab**  
3. Save it somewhere easy (e.g. Desktop)

### Option 2 — build a fresh package

Only needed if you change the mobile app shell:

```bat
cd "C:\Users\Jonathan Gilbart\the-villages-idiot\mobile"
npx.cmd eas-cli whoami
npx.cmd eas-cli build --platform android --profile production
```

| Prompt | Answer |
|--------|--------|
| Generate a new Android Keystore? | **Yes** only the first time ever |
| Wait for build? | **Yes** |

**Phone test APK (not for the store):**

```bat
npx.cmd eas-cli build --platform android --profile preview
```

---

## Part C — Play Console: store listing (copy/paste)

### App name
The Villages Everything App

### Short description (max 80 characters)
```
Everything app for The Villages, FL — dining, golf, calendar & neighbors.
```

### Full description
```
The Villages Everything App is a resident-built companion for life in The Villages, Florida.

Explore villages, rec centers, and town squares. Rate dining, check the calendar, follow local golf culture, browse clubs, submit Best of the Month photos, find neighbor services, and keep a private My Space dashboard.

Built for cart-path life — not corporate brochure voice.

Website: https://www.thevillageseverythingapp.com
Support: jonathan@thevillageseverythingapp.com

Not affiliated with The Villages® operators. Independent community project.
```

### Category
**Lifestyle** (secondary optional: Travel or Social)

### Contact email
Use your real support email (example: jonathan@thevillageseverythingapp.com)

### Privacy policy URL (required)
```
https://www.thevillageseverythingapp.com/privacy
```

### Graphics

| Asset | Spec | File on your PC |
|-------|------|-----------------|
| App icon | 512×512 PNG | `mobile/assets/play-icon-512.png` |
| Feature graphic | ~1024×500 | `mobile/assets/play-feature-graphic.jpg` (you can replace later) |
| Phone screenshots | At least **2** | You take these on your phone (Home, Dining, Calendar…) |

**How to get screenshots quickly**

1. Open https://www.thevillageseverythingapp.com on your Android phone (or Chrome phone mode)
2. Capture Home, Dining, Town Squares, Calendar (2–8 screenshots)
3. Upload under **Store listing → Phone screenshots**

---

## Part D — Required questionnaires (simple answers)

### Content rating
- Complete the questionnaire honestly  
- This is a lifestyle / community app, **not** primarily for children  
- Typical result: **Everyone** or low maturity  

### Target audience
- Not designed for children under 13  

### Data safety (high level — match your privacy policy)

| Topic | Typical answer for this app |
|-------|-----------------------------|
| Does the app collect data? | **Yes** (accounts, content users post) |
| Location | Optional / not required for core use unless you enable it |
| Photos | **Yes** if users upload Best of the Month / services photos |
| Financial | Stripe tips/checkout happen on your **website** (declare if applicable) |
| Encryption in transit | **Yes** (HTTPS) |
| Account deletion | Point to how users can request deletion / contact support |

### App access
If the website has a **beta password / site gate**:

- Either turn the gate **off** for launch, **or**
- In Play Console “App access”, provide the password for Google reviewers  

If reviewers cannot open the app content, the listing gets rejected.

---

## Part E — Upload the .aab and release

Recommended path for first time:

### 1) Internal testing (smart first step)

1. Play Console → **Test and release** → **Testing** → **Internal testing**  
2. Create a new release  
3. Upload your **.aab**  
4. Add yourself as a tester (your Gmail)  
5. Save → Review → **Start rollout to Internal testing**  
6. Open the tester link on your phone and install  

Fix anything broken.

### 2) Closed testing (optional middle step)

Same upload pattern as Internal:

1. **Test and release** → **Closed testing** → create/open a track → **Create new release**  
2. Under **App bundles**, you **must** see your `.aab` listed (version code **2+** for the permission-fixed build).  
3. If the page says “no app bundles”, click **Upload** or **Add from library** and pick the new build.  
4. Save → Review → Start rollout to Closed testing.

### 3) Production (public Play Store)

1. **Test and release** → **Production**  
2. Create new release → upload same (or newer) **.aab**  
3. Release notes example:

```
First public release of The Villages Everything App for Android.
Community hub for The Villages, Florida — dining, calendar, villages, and more.
```

4. **Send for review** / **Start rollout to Production**  

Google review often takes **hours to a few days** the first time.

---

## Troubleshooting — release errors you may see

### Error: “This release does not add or remove any app bundles”

**Meaning:** The draft release is empty. Play has nothing new to ship.

**Fix:**

1. On **Create release**, scroll to **App bundles**.  
2. Click **Upload** (or **Add from library** if you already uploaded once).  
3. Choose the **.aab** file (versionCode **must** be higher than any code already on this track).  
4. Confirm the table shows something like `1.0.1 (2)` — not “No app bundles”.  
5. Discard empty drafts: three-dot menu on the release → **Discard draft** if you created a blank one by mistake.

### Error: “doesn’t allow any existing users to upgrade to the newly added app bundles”

**Meaning:** Usually the same empty-release problem, **or** the new bundle’s **versionCode is lower** than what testers already have on this track (or a higher track).

**Fix:**

1. Fix the empty-bundle problem first (above).  
2. Check version codes:  
   - Old first build: **versionCode 1** (`1.0.0`)  
   - Permission-fixed build: **versionCode 2** (`1.0.1`) in `mobile/app.json`  
3. Always upload a **higher** versionCode than the last one on that track.  
4. Never create a release with no bundles and try to roll it out.

### Error: “photo and video permissions… tell Google Play about the core functionality”

**Meaning:** The `.aab` declares `READ_MEDIA_IMAGES` / `READ_MEDIA_VIDEO` (and similar). Google requires a **Photo and video permissions** declaration, and often rejects generic WebView apps for broad gallery access.

**What we did for this project:**  
Removed those permissions from the Android shell. Uploads still work via the **system file picker** inside the website WebView. You do **not** need permanent “read all photos” access.

**Your fix path:**

1. Rebuild with the updated `app.json` (version **1.0.1** / versionCode **2**).  
2. Upload the **new** `.aab` — do not keep shipping the old versionCode **1** package that still has media permissions.  
3. If Play still shows a Photo/Video declaration task for an **old** artifact, ignore that artifact and only use the new build.  
4. Only fill the Photo/Video declaration form if a future build truly needs full gallery access (this app should not).

---

## Part F — Is it *actually* public yet?

Play Console can say “publishing / available in about an hour” while the
**public** store page still returns **404**. That usually means one of:

| Situation | What you see | What neighbors can do |
|-----------|--------------|------------------------|
| **Internal testing only** | Testers install via invite link | **Nobody** finds it by search |
| **Production under review** | Status: In review / Pending | Not installable publicly yet |
| **Production rolling out** | Status: Rolling out / Processing | Link may 404 for a while |
| **Production available** | Status: Available on Google Play | Public link works |

### Check in this order (Play Console)

1. Open [play.google.com/console](https://play.google.com/console) → your app  
2. Left menu → **Test and release** → **Production**  
   - Do you have a release with status **Available on Google Play** (or similar)?  
   - If the only green release is under **Internal testing**, the public link will **not** work.  
3. Dashboard → look for unfinished **Policy** / **App content** tasks (red or “Needs attention”). Incomplete items block public availability.  
4. On this PC, open the public URL in a private/incognito window:

   **https://play.google.com/store/apps/details?id=com.thevillageseverythingapp.app**

   - **404 / Not found** → not public yet (do **not** share that link).  
   - Listing with Install → **live**. Tell me and we’ll flip the website **Get it on Google Play** button on.

### Share links once live

| Audience | Link |
|----------|------|
| Everyone (best) | `https://play.google.com/store/apps/details?id=com.thevillageseverythingapp.app` |
| Website (auto) | Homepage LaunchPromo + footer show Play after `SITE_BRAND.stores.android.live = true` in `src/lib/siteBrand.ts` |

### Website switch (after public listing works)

1. Edit `the-villages-idiot/src/lib/siteBrand.ts`  
2. Set `stores.android.live` to **`true`**  
3. Push / deploy the website  
4. Confirm the homepage shows **Get it on Google Play**

Until then the site keeps “store apps are rolling out” so nobody hits a dead link.

---

## Part G — After you’re live

| You change… | What to do |
|-------------|------------|
| Website text/features | Deploy the website only (phones update automatically) |
| Icon, splash, permissions, native shell | Bump version in `app.json`, run another `eas build`, upload new .aab |
| Privacy practices | Update website privacy page + Play Data safety form |

Bump versions:

- User-facing: `app.json` → `"version": "1.0.1"`  
- Android `versionCode` auto-increments with EAS `production` + `autoIncrement`  

---

## Commands cheat sheet

```bat
cd "C:\Users\Jonathan Gilbart\the-villages-idiot\mobile"

:: Who am I on Expo?
npx.cmd eas-cli whoami

:: Production store package (.aab)
npx.cmd eas-cli build --platform android --profile production

:: List recent builds
npx.cmd eas-cli build:list --platform android --limit 5
```

---

## What only you can do (I cannot)

- Pay or finish Google Play account legal agreements  
- Click **Create app** / **Submit for review** in Play Console  
- Log into Google with your identity  
- Answer questionnaires that require your business choices  

## What I can keep doing with you

- Run / watch EAS builds  
- Fix build errors  
- Update listing text, privacy wording, icons  
- Help fill Data safety answers based on the real site  

---

## Suggested order (today)

1. [ ] Open Play Console → create/open **The Villages Everything App**  
2. [ ] Download the ready **.aab** (link above)  
3. [ ] Paste short + full description + privacy URL  
4. [ ] Upload `play-icon-512.png` + `play-feature-graphic.jpg` + 2 screenshots  
5. [ ] Complete content rating + data safety  
6. [ ] **Internal testing** → upload .aab → install on your phone  
7. [ ] When happy → **Production** → submit for review  

Stuck on any step? Tell me the screen name in Play Console (e.g. “Data safety”) and I’ll give exact click-by-click answers.
