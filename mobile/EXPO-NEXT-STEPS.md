# Expo: connect project + production build

Do these in **PowerShell** (or the terminal Expo opened).  
Always start in the **mobile** folder:

```bat
cd "C:\Users\Jonathan Gilbart\the-villages-idiot\mobile"
```

---

## Step 1 — Log the CLI into your Expo account

```bat
npx.cmd eas-cli login
```

- Browser or email/password prompt will appear  
- Use the **same Expo account** you just created  
- Confirm with:

```bat
npx.cmd eas-cli whoami
```

You should see your Expo username (not “Not logged in”).

---

## Step 2 — Connect this folder to Expo (creates the project)

```bat
npx.cmd eas-cli init
```

When asked:

| Prompt | What to choose |
|--------|----------------|
| Create a new project / link existing? | **Create a new project** (first time) |
| Project name | **The Villages Everything App** or accept `the-villages-everything-app` |
| Account / owner | Your Expo username |

This writes a `projectId` into `app.json` under `extra.eas`. **That is normal and good.**

If Expo’s website already gave you a project and a command like `eas init --id …`, run **that** command instead, still from the `mobile` folder.

---

## Step 3 — Production build (start with Android)

**Android first** (no Apple fee required for the build itself):

```bat
npx.cmd eas-cli build --platform android --profile production
```

When asked:

| Prompt | What to choose |
|--------|----------------|
| Generate a new Android Keystore? | **Yes** (first time — Expo stores it safely) |
| Wait for build? | **Yes** (or open the link they give you) |

Build runs **in the cloud** (~15–30 minutes). When done, Expo gives a download link for the **.aab** (Google Play package).

### Optional: test APK on your phone sooner

```bat
npx.cmd eas-cli build --platform android --profile preview
```

That makes an **.apk** you can install directly (not for Play Store).

---

## Step 4 — iPhone production build (needs Apple Developer)

Only after you have an active **Apple Developer** membership ($99/year):

```bat
npx.cmd eas-cli build --platform ios --profile production
```

EAS will ask you to sign in with your **Apple ID** and set up certificates. Follow the prompts.

If Apple enrollment is still pending, **skip iOS** and finish Android first.

---

## Commands Expo often shows (mapped to this PC)

| Expo says | You run (from `mobile` folder) |
|-----------|--------------------------------|
| `eas init` | `npx.cmd eas-cli init` |
| `eas build -p android --profile production` | `npx.cmd eas-cli build --platform android --profile production` |
| `eas build -p ios --profile production` | `npx.cmd eas-cli build --platform ios --profile production` |
| `eas build -p all --profile production` | `npx.cmd eas-cli build --platform all --profile production` |

(`npx.cmd eas-cli` avoids PowerShell script-blocking issues on this machine.)

---

## After the Android build finishes

1. Open the build page on [expo.dev](https://expo.dev)  
2. Download the **.aab**  
3. Upload it in [Google Play Console](https://play.google.com/console) (after the $25 signup)  
4. Full store checklist: [STORE-PUBLISH-GUIDE.md](./STORE-PUBLISH-GUIDE.md)

---

## If something fails

| Message | Fix |
|---------|-----|
| Not logged in | `npx.cmd eas-cli login` again |
| No project ID | `npx.cmd eas-cli init` from `mobile` |
| Wrong folder | Must be `the-villages-idiot\mobile`, not the parent site folder |
| iOS credentials error | Finish Apple Developer enrollment first |
| Build failed — paste the Expo build log URL and we’ll fix it |

---

## Suggested order today

1. `login`  
2. `init`  
3. Android **production** (or **preview** if you only want to install on your phone tonight)  
4. iOS later, after Apple Developer is active  
