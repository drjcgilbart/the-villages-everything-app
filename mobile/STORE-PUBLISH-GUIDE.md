# First-time guide: put The Villages Everything App on Apple + Google

You already have the **PC website**. This guide gets you the **iPhone** and **Android** store apps.

Estimated time (first launch): a few evenings + waiting for store review (1–7 days).

---

## Before you start

- [ ] Live site works: https://www.thevillageseverythingapp.com  
- [ ] You can log into Admin / test member features on the live site  
- [ ] Credit card ready for Apple ($99/year) and Google ($25 once)  
- [ ] Mobile folder tested with Expo Go (see [README.md](./README.md))

---

## Part 1 — Accounts (do once)

### A. Expo (free)

1. Create account: https://expo.dev/signup  
2. On your PC:

```bat
cd "C:\Users\Jonathan Gilbart\the-villages-idiot\mobile"
npm.cmd install -g eas-cli
eas.cmd login
eas.cmd init
```

3. Open `app.json` and confirm:
   - `extra.eas.projectId` is a real UUID (not `REPLACE_…`)
   - `owner` is your Expo username

### B. Google Play ($25 one-time)

1. https://play.google.com/console/signup  
2. Pay the registration fee  
3. Accept developer agreements  
4. Create app → name: **The Villages Everything App**  
5. Default language: English (US)  
6. App or game: **App**  
7. Free or paid: **Free**

### C. Apple Developer ($99 / year)

1. https://developer.apple.com/programs/enroll/  
2. Use the Apple ID you want as the publisher  
3. Enrollment can take **24–48 hours** (sometimes longer for new accounts)  
4. When active, open https://appstoreconnect.apple.com  
5. **My Apps → + → New App**  
   - Platform: iOS  
   - Name: The Villages Everything App  
   - Bundle ID: create/select `com.thevillageseverythingapp.app`  
   - SKU: `villages-everything-app` (internal only)  
   - User Access: Full Access  

---

## Part 2 — Build the store packages

On your Windows PC:

```bat
cd "C:\Users\Jonathan Gilbart\the-villages-idiot\mobile"
eas.cmd build --platform android --profile production
eas.cmd build --platform ios --profile production
```

- First Android build: EAS creates a keystore and stores it for you (keep that Expo account).  
- First iOS build: EAS walks you through Apple login and certificates.  
- Builds take ~10–30 minutes. EAS emails/links when done.

**Android output:** `.aab` (Android App Bundle)  
**iOS output:** `.ipa` uploaded to App Store Connect (or downloadable)

---

## Part 3 — Google Play listing checklist

In Play Console → your app:

### Store presence

| Field | Suggested text |
|-------|----------------|
| Short description | Everything app for The Villages, FL — villages, dining, golf, clubs, calendar & neighbors. |
| Full description | See “Store description” section below |
| App icon | 512×512 PNG (use `assets/icon.png`, export 512 if needed) |
| Feature graphic | 1024×500 image (sunset / mascot banner from your site graphics) |
| Screenshots | At least 2 phone screenshots (Home, Dining, My Village, etc.) |

### Required policies

- [ ] Privacy policy URL: `https://www.thevillageseverythingapp.com/privacy`  
- [ ] App access: if beta password is on, provide demo credentials for reviewers  
- [ ] Content rating questionnaire (likely Everyone / low maturity)  
- [ ] Target audience (not primarily children)  
- [ ] Data safety form: account login, photos uploaded by users, payment via Stripe web checkout if used  

### Release

1. **Testing → Internal testing** first (add your Gmail as a tester)  
2. Upload the `.aab` from EAS  
3. When happy → **Production** → Review → Start rollout to 100%

---

## Part 4 — Apple App Store listing checklist

In App Store Connect → your app → first version (1.0):

### Screenshots (required)

iPhone sizes change over time; App Store Connect shows exactly what’s required. Typical:

- 6.7" display (large modern iPhone)  
- Optional iPad if you keep tablet support  

Tip: open the live site on your phone, screenshot Home, Dining, Golf, Calendar, My Space.

### App information

| Field | Suggestion |
|-------|------------|
| Subtitle | Villages FL community companion |
| Category | Lifestyle (secondary: Travel or News) |
| Age rating | Complete questionnaire honestly |
| Copyright | © 2026 Jonathan Gilbart (or your LLC) |

### Privacy

Apple’s privacy labels — answer based on what the **website** actually does:

- Contact info / account if members sign up  
- Photos if users upload  
- Purchases if Stripe tips are available  
- Usage data if Vercel Analytics is on  

### Review notes (important)

Because the app loads your website, write clear notes for the reviewer:

```
This app is the official mobile client for The Villages Everything App
(https://www.thevillageseverythingapp.com), a community lifestyle product
for residents of The Villages, Florida.

Core features: village directory, dining ratings, rec centers, town squares,
calendar, golf club tools, member My Space, moderated Best of the Month
photo submissions, and Support Local directory.

Native shell provides splash branding, offline error recovery, safe-area
layout, Android back navigation, and system handling of tel/mailto/external links.

Demo:
URL: https://www.thevillageseverythingapp.com
[If SITE_PASSWORD is set, give the beta password here]
Admin is not required for review.
```

If the site is behind `SITE_PASSWORD`, **you must give reviewers that password** or the app will be rejected.

### Submit

1. Select the build EAS uploaded  
2. Add export compliance: encryption = standard HTTPS only (we set `ITSAppUsesNonExemptEncryption` false)  
3. **Submit for Review**

---

## Part 5 — Store description (copy/paste)

**Name:** The Villages Everything App  

**Short:**  
Everything app for The Villages, Florida — find your village, rate restaurants, chase square entertainment, and connect with neighbors.

**Long:**  
The Villages Everything App is a resident-built companion for life in The Villages, Florida.

Explore 100+ villages, rec centers, and town squares. Rate dining, check the calendar, follow local golf culture, browse clubs, submit Best of the Month photos, find neighbor services, and keep a private My Space dashboard for weather, health notes, and more.

Built for cart-path life — not corporate brochure voice.

Not affiliated with The Villages® operators. Independent community project.

Support: jonathan@thevillageseverythingapp.com  
Web: https://www.thevillageseverythingapp.com

---

## Part 6 — After you’re live

| When you change… | What to do |
|------------------|------------|
| Website content / features | Deploy Vercel only — phones update automatically |
| App icon, splash, permissions, native shell | Bump version in `app.json`, `eas build`, submit new store version |
| Privacy practices | Update privacy policy page + store privacy forms |

Version tips:

- `app.json` → `"version": "1.0.1"` for user-facing version  
- iOS `buildNumber` / Android `versionCode` auto-increment with EAS `production` profile  

---

## Common first-time problems

| Problem | Fix |
|---------|-----|
| Apple: “app is just a website” | Emphasize community features + native offline/back/external-link handling in review notes; we can add push notifications next if needed |
| Reviewer can’t log in | Turn off beta gate **or** put password in review notes |
| Android upload rejected | Use **production** AAB profile, not debug APK |
| Photos don’t upload in app | Camera/photos permissions are already declared; rebuild after permission changes |
| Wrong icon | Replace `assets/icon.png` (1024×1024), rebuild |

---

## What I (your AI helper) can and cannot do

**Can:** maintain the mobile shell, rebuild configs, fix bugs, prepare listing text, walk you through clicks.  

**Cannot:** create Apple/Google accounts under your identity, pay fees, or click final “Submit” without your logins. Those must be you (legal publisher).

When you’re ready for the next step, say which you want:

1. Help creating screenshots / privacy text on the website  
2. Walk through `eas build` on this PC  
3. Add push notifications or a native home tab bar for stronger App Store review  
