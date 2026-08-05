# The Villages Hub

**Everything app for The Villages, Florida** — villages, dining, rec centers, town squares, real estate, calendar, and more. Built by a resident, for neighbors.

Personal blog, videos, and photos still live under **My Story** / media links; the main product is the Villages hub.

**Live domain target:** [https://www.thevillageseverythingapp.com](https://www.thevillageseverythingapp.com)

**Deploy steps:** see [DEPLOY-SIMPLE.md](./DEPLOY-SIMPLE.md)

---

## Features

| Area | What you get |
|------|----------------|
| **Home** | Hero, topic cards, latest posts & videos |
| **Blog** | Long-form posts |
| **Videos** | YouTube embeds, Studio uploads, and written video episodes (combined feed) |
| **Health** | Wellness topic hub (auto-fills from tagged content) |
| **Wealth** | Money & markets topic hub |
| **Meet Your Neighbors** | Community stories topic hub |
| **Golf Zone** | Golf & cart culture topic hub |
| **Club Zone** | Clubs & groups topic hub |
| **Arts & Crafts** | Creative projects & studios topic hub |
| **Calendar of Events** | Local events & happenings topic hub |
| **Dining** | Restaurant guide — live 1–5★ ratings, top 5 by cuisine, reviews, kitchen interviews |
| **Town Squares** | Spanish Springs, Lake Sumter, Brownwood & more — entertainment, shopping, dining |
| **Rec Centers** | Pools, pickleball, fitness, regional/village/neighborhood centers |
| **My Village** | Searchable directory of 100+ individual villages (e.g. Edenfield) with area filters |
| **Real Estate** | Featured homes, live market links, partner agents, buyer/seller lead form; hourly snapshot refresh |
| **Best of the Month Club** | Monthly highlights (featured + tagged items) |
| **Donate** | “Buy me a cup of Joe” tips via Stripe Checkout |
| **About** | Mission + disclaimer (not affiliated with The Villages® operators) |
| **Photo Journal** | Picture gallery with short captions (upload via Studio) |
| **Community Yard Sale** | Moderated marketplace for Villagers — members request approval, post items (up to 5 photos + 1 short video), admin approves listings before they go live |
| **Studio** (`/admin`) | Password-protected creator dashboard (includes Yard Sale moderation) |
| **Theme music** | Optional multi-mood audio (bottom-right 🎵) with track switcher — **real royalty-free instrumental MP3s** (Sunny Morning, Evening Jazz Cart Ride, etc.). See `public/music/CREDITS.md` |

---

## Run on your PC

### Option A — double-click

1. Open `start.bat`
2. Browser: [http://localhost:3000](http://localhost:3000)
3. Studio: [http://localhost:3000/admin](http://localhost:3000/admin)

### Option B — terminal

```bash
cd "C:\Users\Jonathan Gilbart\the-villages-idiot"
npm.cmd install
npm.cmd run dev
```

### Admin password

Edit `.env.local` (created for you):

```
ADMIN_PASSWORD=changeme
```

**Change this before the site goes live.**

### Donations (Buy me a cup of Joe)

Visitors can tip via `/donate` (mascot CTA on home, About, topics, and a floating button site-wide).

1. Create a [Stripe account](https://dashboard.stripe.com/register) if you don’t have one  
2. Copy **test** keys from [API keys](https://dashboard.stripe.com/apikeys) into `.env.local`:

```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Restart `npm.cmd run dev`  
4. Open `/donate`, pick an amount, and complete checkout with a [test card](https://docs.stripe.com/testing) (`4242 4242 4242 4242`)  
5. For production, switch to **live** keys and set `NEXT_PUBLIC_SITE_URL` to your real domain  

Optional: set `NEXT_PUBLIC_DONATION_PAYMENT_LINK` to a [Payment Link](https://dashboard.stripe.com/payment-links) URL as a simple fallback when Checkout isn’t configured.

### Real Estate & light monetization

`/real-estate` combines:

1. **Live market searches** — buttons that open current public results for The Villages (always fresh at the source)  
2. **Featured listings** — curated in Studio (great for partner agents; link each card to a full MLS URL)  
3. **Partner agents** — tiers: `listed` · `featured` · `preferred` (paid top placement)  
4. **Lead form** — buyer/seller inquiries stored in Studio → Real Estate → Leads  

**Hourly refresh:** `vercel.json` schedules `GET /api/real-estate/refresh` every hour. Set `CRON_SECRET` in Vercel if you want to lock hourly jobs; visitors can still use **Refresh market now** anytime.

**Recommendation (built in):** soft monetization — agent partnerships + optional tips — not a Patreon paywall. Hard member tiers tend to hurt a community/lifestyle site; preferred-agent placement and lead intros fit the content without walling neighbors out.

---

## Posting content (Studio)

1. Go to `/admin` and sign in  
2. **Blog & Video episodes** — title, body, tags, type (`blog` or written video episode)  
3. **Videos** (public `/videos` feed)  
   - **YouTube link** — paste a full URL or video ID  
   - **Direct upload** — choose a video file from your computer (stored under `data/uploads/`)  
   - Written **video episodes** from the posts tab also appear on `/videos`  
4. Content is saved in `data/content.json` on this PC  

---

## Deploy to thevillagesidiot.com (Vercel — recommended)

Same general path you used for other sites:

1. Create a GitHub repo and push this folder  
2. Import the repo in [Vercel](https://vercel.com)  
3. Set environment variables in Vercel:  
   - `ADMIN_PASSWORD` = a strong password  
   - `ADMIN_SECRET` = a long random string  
   - `NEXT_PUBLIC_SITE_URL` = `https://thevillagesidiot.com`  
   - `STRIPE_SECRET_KEY` = your Stripe secret key (live when ready)  
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = your Stripe publishable key  
4. Deploy  
5. In Vercel → Project → Domains, add `thevillagesidiot.com` and `www` if you use it  
6. At GoDaddy (or your DNS host), point DNS to Vercel (A / CNAME records Vercel shows you)

### Important note about posting *after* deploy

Vercel’s servers **don’t keep file uploads permanently** the way your PC does. Best workflows:

1. **Create posts locally** in Studio → they land in `data/content.json` → commit & push that file → redeploy, **or**  
2. Run Studio only on your PC, keep the live site as the public front, **or**  
3. Later we can wire cloud storage (e.g. Vercel Blob / S3) for live production uploads  

For launch day: seed a few posts and videos locally, commit `data/content.json` if you want them on the live site, deploy, then point the domain.

To **include** content in git for deploy, temporarily remove `data/content.json` from `.gitignore`, commit it, push, redeploy.

---

## Project folder

```
the-villages-idiot/
  src/app/          # pages + API
  src/components/   # UI
  src/lib/          # content store + auth
  data/             # content.json + uploads (created on first run)
  start.bat
  .env.local        # your local secrets (not committed)
```

Folder name on disk: `the-villages-idiot`  
Site name / brand: **The Villages Retirement Reboot**

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm.cmd run dev` | Local development |
| `npm.cmd run build` | Production build |
| `npm.cmd run start` | Run production build locally |

---

Not affiliated with The Villages® brand or its developers — independent personal project.
