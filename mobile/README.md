# The Villages Everything App — Phone apps (iPhone + Android)

This folder is the **store-ready mobile shell** for the same product you already run on PC:

| Version | What it is | Where people use it |
|---------|------------|---------------------|
| **1. PC / browser** | Your existing Next.js site | `www.thevillageseverythingapp.com` |
| **2. iPhone** | This Expo app (App Store) | Apple App Store |
| **3. Android** | This same Expo app (Play Store) | Google Play |

You do **not** maintain three separate codebases.  
The phones open your live website inside a real native app (splash screen, icons, offline screen, store packages). When you update the website and deploy to Vercel, **phones pick up the new content automatically** on the next visit.

---

## What you need (one-time money + accounts)

| Account | Cost | Why |
|---------|------|-----|
| [Expo](https://expo.dev) | Free | Builds the app in the cloud (works from your Windows PC) |
| [Apple Developer Program](https://developer.apple.com/programs/) | **$99 / year** | Required to publish on the App Store |
| [Google Play Console](https://play.google.com/console/signup) | **$25 one-time** | Required to publish on Google Play |
| A Mac | Optional | Not required if you use **Expo EAS Build** (cloud) for iPhone builds |

Apple and Google take days to review the first version. That is normal.

---

## Quick test on your phone (before stores)

1. Install **Expo Go** from the App Store or Play Store.
2. On your PC, in PowerShell:

```bat
cd "C:\Users\Jonathan Gilbart\the-villages-idiot\mobile"
npm.cmd start
```

3. Scan the QR code with your phone (Camera on iPhone; Expo Go on Android).
4. You should see **The Villages Everything App** load from the live site.

> Note: Expo Go is only for testing. Store users install the real app, not Expo Go.

---

## One-time setup for store builds

### 1) Create an Expo account

1. Sign up at [expo.dev](https://expo.dev)
2. Install EAS CLI and log in:

```bat
cd "C:\Users\Jonathan Gilbart\the-villages-idiot\mobile"
npm.cmd install -g eas-cli
eas.cmd login
eas.cmd init
```

`eas init` will fill in a real `projectId` in `app.json` (replace `REPLACE_AFTER_EAS_INIT`).

Also set `"owner"` in `app.json` to your Expo username.

### 2) Confirm brand IDs (already set)

- **iOS bundle ID:** `com.thevillageseverythingapp.app`
- **Android package:** `com.thevillageseverythingapp.app`
- **App name:** The Villages Everything App
- **Website loaded by the app:** `https://www.thevillageseverythingapp.com`

Do not change the bundle/package IDs after you publish — stores treat them as the app’s identity forever.

---

## Build installable apps (cloud)

### Android (easier first)

```bat
cd "C:\Users\Jonathan Gilbart\the-villages-idiot\mobile"
eas.cmd build --platform android --profile preview
```

- **preview** → APK you can sideload on a phone for testing  
- **production** → AAB file Google Play wants:

```bat
eas.cmd build --platform android --profile production
```

### iPhone

```bat
eas.cmd build --platform ios --profile production
```

Expo builds iOS **in the cloud** (no Mac required on your desk).  
You will link your Apple Developer account when EAS asks.

### Both platforms

```bat
eas.cmd build --platform all --profile production
```

---

## Publish to the stores

Full checklist (screenshots, privacy policy, age rating, etc.):

**→ [STORE-PUBLISH-GUIDE.md](./STORE-PUBLISH-GUIDE.md)**

Short version:

### Google Play

1. Pay the $25 Play Console fee and create the app listing  
2. Upload the **.aab** from EAS production build  
3. Complete store listing, content rating, privacy policy URL  
4. Start with **Internal testing**, then **Production**

### Apple App Store

1. Enroll in Apple Developer ($99/year)  
2. Create the app in [App Store Connect](https://appstoreconnect.apple.com) with the same bundle ID  
3. Upload the iOS build from EAS (or `eas submit`)  
4. Fill listing, screenshots, privacy nutrition labels  
5. Submit for review  

```bat
eas.cmd submit --platform android --profile production
eas.cmd submit --platform ios --profile production
```

(Fill the `REPLACE_…` fields in `eas.json` first, or answer the prompts.)

---

## How the three versions stay in sync

```
  You edit the website (Next.js in the parent folder)
              │
              ▼
     Deploy to Vercel (live site)
              │
     ┌────────┴────────┐
     ▼                 ▼
  PC browsers     iPhone / Android apps
  (Chrome, etc.)  (this mobile shell opens the same URL)
```

- Bug fix on dining? Deploy website → phones see it.  
- New Best of Month feature? Same.  
- Only rebuild the **mobile** app when you change icons, splash, permissions, or native shell code.

---

## Project files

| File | Purpose |
|------|---------|
| `App.tsx` | Native shell: WebView, offline screen, back button, external links |
| `app.json` | App name, icons, bundle IDs, permissions |
| `eas.json` | Cloud build + store submit profiles |
| `assets/` | App icon + splash (from your mascot) |
| `STORE-PUBLISH-GUIDE.md` | Step-by-step store walkthrough for first-timers |

---

## Privacy policy (required by both stores)

Point both store listings at:

`https://www.thevillageseverythingapp.com/privacy`

(That page ships with the website. Deploy the parent Next.js app to Vercel so the URL is live before you submit to Apple/Google.)

---

## Limits to know up front

1. **This is a hybrid app** (native shell + your website). That is how most “website → app” products ship. A full rewrite in pure native Swift/Kotlin would take months and duplicate every feature.  
2. **Apple sometimes rejects “just a website” apps.** This shell adds splash, offline handling, safe areas, and external-link behavior to look and feel like a real app. If review asks for more native value, we can add push notifications, home-screen widgets, or a native tab bar later.  
3. **You still need the developer accounts** — I cannot pay Apple/Google or click “Submit” under your legal name for you.  
4. **Windows PC is fine** for everything except optional local Xcode; EAS cloud covers iPhone builds.

---

## Commands cheat sheet

```bat
cd "C:\Users\Jonathan Gilbart\the-villages-idiot\mobile"

npm.cmd start
eas.cmd build --platform android --profile preview
eas.cmd build --platform android --profile production
eas.cmd build --platform ios --profile production
eas.cmd submit --platform all --profile production
```

Not affiliated with The Villages® brand operators — independent community project.
