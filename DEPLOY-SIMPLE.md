# Put this site live at www.thevillageseverythingapp.com

**Simple path: host on Vercel (free tier works for starting), then point your domain at it.**

---

## What I already did on your PC

- Started a **git** repo in `the-villages-idiot` (needed for GitHub + Vercel).
- Your app already has a `vercel.json` (cron for real estate refresh).

**I cannot finish the last steps for you** — they need *your* Vercel login and *your* domain registrar password.

---

## Part A — One-time setup (about 15 minutes)

### 1) Create free accounts (if you don’t have them)

1. [GitHub.com](https://github.com/signup) — free  
2. [Vercel.com](https://vercel.com/signup) — free (sign up with GitHub is easiest)

### 2) Put the code on GitHub

In **PowerShell** (or Git Bash), from the project folder:

```bat
cd "C:\Users\Jonathan Gilbart\the-villages-idiot"
git add .
git commit -m "Ready to deploy The Villages Everything App"
```

Then on GitHub: **New repository** (name e.g. `the-villages-everything-app`) — **do not** add a README.

Then:

```bat
git remote add origin https://github.com/YOUR_USERNAME/the-villages-everything-app.git
git push -u origin main
```

(Replace `YOUR_USERNAME` with your GitHub username.)

### 3) Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)  
2. **Import** the GitHub repo you just created  
3. Leave framework as **Next.js**  
4. Click **Deploy**  
5. Wait until you get a URL like `https://something.vercel.app` — that means the code is live.

### 4) Add your real domain

In Vercel:

1. Open your project → **Settings** → **Domains**  
2. Add: `thevillageseverythingapp.com`  
3. Add: `www.thevillageseverythingapp.com`  
4. Vercel will show DNS instructions (usually one of these):

**Option A (easiest for most people)** — at your domain registrar (GoDaddy, Namecheap, Google Domains, etc.):

| Type | Name | Value |
|------|------|--------|
| **A** | `@` | `76.76.21.21` |
| **CNAME** | `www` | `cname.vercel-dns.com` |

**Or** Vercel may ask you to change **nameservers** to Vercel’s — follow exactly what the Domains page shows.

5. Wait 5–60 minutes (sometimes up to 24 hours).  
6. When Vercel shows the domain as **Valid**, open:

- https://www.thevillageseverythingapp.com  

### 5) Production environment variables

In Vercel → Project → **Settings** → **Environment Variables**, add at least:

| Name | Value |
|------|--------|
| `ADMIN_PASSWORD` | a strong new password (not `changeme`) |
| `ADMIN_SECRET` | a long random string |
| `NEXT_PUBLIC_SITE_URL` | `https://www.thevillageseverythingapp.com` |
| `CRON_SECRET` (optional) | Long random string — locks Vercel cron refresh routes |
| `UPSTASH_REDIS_REST_URL` | Free Upstash Redis REST URL — **recommended** while Blob Hobby is over quota |
| `UPSTASH_REDIS_REST_TOKEN` | Free Upstash Redis REST token |
| `BLOB_READ_WRITE_TOKEN` (optional if Redis is set) | Auto-added when you create/connect a **Blob** store |
| `SITE_PASSWORD` | shared beta unlock password (keep set even when public so Admin can re-enable the wall) |
| `STRIPE_SECRET_KEY` | your **live** Stripe secret key (if donations) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | your **live** publishable key |

Then **Redeploy** (Deployments → ⋮ → Redeploy) so they take effect.

### Durable storage (Admin → Members on the live site)

On Vercel there is **no permanent disk**. Member saves need durable storage.

#### Option A — Free Upstash Redis (use this when Blob Hobby is over quota)

If Storage says *“You have reached your usage limits… Hobby plan. Access resumes on 9/6/26”*, Blob writes will fail until that date (or until you upgrade to Pro).

1. Sign up at [upstash.com](https://upstash.com) (free tier is enough)  
2. **Create database** → Redis → pick a US region  
3. Open the database → **REST API**  
4. Copy **UPSTASH_REDIS_REST_URL** and **UPSTASH_REDIS_REST_TOKEN**  
5. Paste both into Vercel → **Settings** → **Environment Variables** → **Production**  
6. Deploy a build that includes Redis support (push latest code + redeploy)  
7. Retry Admin → Members  

The app **prefers Redis** when configured, so Blob lockouts no longer block members.

#### Option B — Vercel Blob

1. Project → **Storage** → create/connect **Blob** for Production  
2. Confirm `BLOB_READ_WRITE_TOKEN` / `BLOB_STORE_ID` exist  
3. Redeploy  

Hobby Blob has a monthly cap. When hit, use Option A or wait for the reset date.

### Private beta (site-wide password wall)

The wall is **off by default** (site is public). Control it from **Admin → Site access** without redeploying.

1. Set `SITE_PASSWORD` in Vercel → Environment Variables (Production) and redeploy once so the password exists.  
2. Leave the site public, **or** open **Admin Portal → Site access** and turn the password wall **ON**.  
3. While ON, visitors go to `/beta-gate` until they enter `SITE_PASSWORD`.  
4. Turn the wall **OFF** in Admin when you want the site fully public again — no need to delete the env var.

Optional emergency env (overrides the admin toggle): `SITE_GATE_ENABLED=off` or `=on`.

---

## Part B — After the first deploy (everyday updates)

Every time you change the site on your PC:

```bat
cd "C:\Users\Jonathan Gilbart\the-villages-idiot"
git add .
git commit -m "Update site"
git push
```

Vercel rebuilds automatically. Your real domain updates in a few minutes.

---

## Important note about Studio / members / yard sale data

This app currently stores a lot of data in the `data/` folder on disk (posts, forums, members, etc.).

On **Vercel’s free/serverless** plan, that disk is **not a permanent hard drive**. After deploys or between servers, some Studio uploads and member data can reset.

**For a serious live site you should later** move data to something permanent (Vercel Blob + a database, or host on Railway/Render with a disk).  
**For “get the public pages live”** today, Vercel + your domain is still the simplest start.

If Studio data must never disappear, tell me and we can plan that next (Blob storage or a small always-on server).

---

## Quick checklist

- [ ] GitHub account  
- [ ] Code pushed to GitHub  
- [ ] Vercel import + first deploy works (`.vercel.app` URL)  
- [ ] Domain added in Vercel  
- [ ] DNS A/CNAME (or nameservers) set at domain registrar  
- [ ] Env vars set + redeploy  
- [ ] https://www.thevillageseverythingapp.com loads  
- [ ] Admin password changed for production  

---

## If you want me to deploy from this machine later

1. Run: `npm.cmd exec -- vercel login` (browser login once)  
2. Tell me “I’m logged into Vercel”  
3. I can run `vercel --prod` and help attach the domain from the CLI  

I **cannot** log into GoDaddy/Namecheap/etc. for you — only you can change DNS for `thevillageseverythingapp.com`.
