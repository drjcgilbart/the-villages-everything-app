"""Parse District Club-Contact PDF into data/club-listings.json."""
from __future__ import annotations

import json
import re
import hashlib
from datetime import datetime, timezone
from pathlib import Path

from pypdf import PdfReader

PDF = Path(
    r"C:\Users\Jonathan Gilbart\Desktop\The Villages Everything App\Club-Contact-7.10.26.pdf"
)
OUT = Path(__file__).resolve().parents[1] / "data" / "club-listings.json"

SKIP_LINE = re.compile(
    r"^(Resident Lifestyles|Club / Activity Name|Apple Computers|"
    r"Q = Every|To Search:|Search box will appear|"
    r"\d+\s+of\s+225|7/10/2026|===== PAGE)",
    re.I,
)
PHONE_RE = re.compile(r"\((\d{3})\)\s*(\d{3})-(\d{4})\s*$")
EMAIL_RE = re.compile(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}")
URL_RE = re.compile(r"https?://\S+", re.I)
SCHED_RE = re.compile(
    r"(?:Q|[1-5][\d,&xX\-]*)?[A-Z]{1,3}(?:even|odd)?"
    r"(?:x[\d,&]+)?"
    r"@[\d:]*(?:AM|PM)?(?:-[A-Z]{2})?",
    re.I,
)
LOC_TIME_PREFIX = re.compile(
    r"^(?:[\d:]+)?(?:AM|PM)-\s*[A-Z]{2}\s+",
    re.I,
)

CATEGORY_RULES: list[tuple[str, list[str]]] = [
    ("Golf", ["golf", "nine & dine", "nine and dine", "putting", "chip &"]),
    (
        "Sports & Recreation",
        [
            "pickleball",
            "tennis",
            "bocce",
            "shuffleboard",
            "softball",
            "baseball",
            "basketball",
            "bowling",
            "volleyball",
            "swimming",
            "swim ",
            "diving",
            "sailing",
            "kayak",
            "canoe",
            "fishing",
            "billiard",
            "pool league",
            "horseshoe",
            "cornhole",
            "bean bag",
            "beanbag",
            "air gun",
            "archery",
            "cycling",
            "bicycle",
            "biking",
            "table tennis",
            "ping pong",
            "badminton",
            "soccer",
            "football",
            "hockey",
            "lacrosse",
            "martial",
            "aikido",
            "karate",
            "taekwondo",
            "judo",
            "fencing",
            "darts",
            "disc golf",
        ],
    ),
    (
        "Walking & Running",
        ["walk away", "walking", "walker", "hiking", "hike ", "running", "runners", "5k"],
    ),
    (
        "Fitness & Wellness",
        [
            "exercise",
            "fitness",
            "yoga",
            "tai chi",
            "taichi",
            "qigong",
            "pilates",
            "zumba",
            "weight",
            "strength",
            "cardio",
            "aerobics",
            "aqua",
            "wellness",
            "meditation",
            "mindfulness",
            "health",
            "nutrition",
            "plant based",
        ],
    ),
    (
        "Dance",
        [
            "line danc",
            "ballroom",
            "salsa",
            "samba",
            "tango",
            "waltz",
            "tap danc",
            "belly danc",
            "square danc",
            "clogging",
            "dance",
            "dancing",
        ],
    ),
    (
        "Music & Performance",
        [
            "choir",
            "chorus",
            "barbershop",
            "ukulele",
            "karaoke",
            "theater",
            "theatre",
            "opera",
            "jazz",
            "band",
            "orchestra",
            "music",
            "singers",
            "singing",
            "piano",
            "guitar",
            "drum",
            "improv",
            "comedy",
            "players",
            "cabaret",
        ],
    ),
    (
        "Arts & Crafts",
        [
            "quilt",
            "paint",
            "craft",
            "pottery",
            "ceramic",
            "knitting",
            "crochet",
            "bead",
            "sewing",
            "needle",
            "woodwork",
            "wood carving",
            "photography",
            "camera club",
            "drawing",
            "watercolor",
            "art club",
            "artists",
            "scrapbook",
            "stained glass",
        ],
    ),
    (
        "Cards & Games",
        [
            "bridge",
            "poker",
            "mahjong",
            "mah jong",
            "bingo",
            "bunco",
            "canasta",
            "pinochle",
            "euchre",
            "chess",
            "scrabble",
            "domino",
            "mexican train",
            "rummikub",
            "hand and foot",
            "cards",
            "game night",
            "games",
            "cribbage",
            "backgammon",
        ],
    ),
    (
        "Books & Writing",
        ["book club", "book discussion", "writers", "writing", "poetry", "readers", "reading"],
    ),
    (
        "Technology",
        [
            "computer",
            "apple",
            "iphone",
            "ipad",
            "android",
            "tech",
            "amateur radio",
            "ham radio",
            "genealogy software",
        ],
    ),
    (
        "Pets & Animals",
        ["dog ", "dogs", "cat ", "cats", "pet ", "pets", "parrot", "bird", "horse", "dachshund"],
    ),
    (
        "Volunteering & Service",
        [
            "aarp",
            "lions",
            "rotary",
            "kiwanis",
            "volunteer",
            "tutor",
            "tax aide",
            "habitat",
            "red cross",
            "hospice",
            "service club",
        ],
    ),
    (
        "Regional & Heritage",
        [
            "alabama",
            "alaska",
            "arizona",
            "arkansas",
            "california",
            "canadian",
            "canada",
            "colorado",
            "connecticut",
            "delaware",
            "florida",
            "georgia",
            "illinois",
            "indiana",
            "iowa",
            "irish",
            "italian",
            "german",
            "jewish",
            "polish",
            "greek",
            "scottish",
            "celtic",
            "mexican",
            "filipino",
            "korean",
            "chinese",
            "indian",
            "african",
            "ohio",
            "jersey",
            "michigan",
            "wisconsin",
            "minnesota",
            "missouri",
            "massachusetts",
            "new york",
            "pennsylvania",
            "texas",
            "virginia",
            "carolina",
            "kentucky",
            "tennessee",
            "buckeye",
            "heritage",
        ],
    ),
]


def categorize(name: str) -> str:
    n = name.lower()
    for cat, keys in CATEGORY_RULES:
        if cat == "Pickleball":
            continue
        for k in keys:
            if k in n:
                return cat
    if "social" in n or "villas" in n or "neighborhood" in n or "coffee" in n:
        return "Social & Community"
    return "Social & Community"


def slug_id(name: str, location: str) -> str:
    raw = f"{name}|{location}".lower().encode("utf-8")
    h = hashlib.sha1(raw).hexdigest()[:10]
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")[:40]
    return f"club-pdf-{slug}-{h}"


def clean_space(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()


def strip_headers(text: str) -> str:
    lines = []
    for line in text.splitlines():
        t = line.strip()
        if not t or SKIP_LINE.search(t):
            continue
        if t in {"Club / Activity Name Location Leader Group Website Email Address Phone Number"}:
            continue
        lines.append(t)
    return "\n".join(lines)


def parse_chunk(chunk: str) -> dict | None:
    chunk = clean_space(chunk)
    if len(chunk) < 12:
        return None
    phone_m = PHONE_RE.search(chunk)
    if not phone_m:
        return None
    phone = f"({phone_m.group(1)}) {phone_m.group(2)}-{phone_m.group(3)}"
    rest = chunk[: phone_m.start()].strip()

    emails = EMAIL_RE.findall(rest)
    email = emails[-1] if emails else None
    if email:
        rest = rest[: rest.rfind(email)].strip()

    urls = URL_RE.findall(rest)
    website = urls[-1].rstrip(").,;") if urls else None
    if website:
        rest = rest[: rest.rfind(website)].strip()
        rest = rest.replace(website, " ").strip()

    matches = list(
        re.finditer(
            r"([A-Z0-9][A-Za-z0-9'./&\-]*(?:\s+[A-Z0-9][A-Za-z0-9'./&\-]*){0,6}\s+"
            r"(?:Recreation|Center|School|Gymnasium)(?:\s+\d+)?)\s+(.+)$",
            rest,
        )
    )
    if matches:
        loc_m = matches[-1]
        location = clean_space(loc_m.group(1))
        leader = clean_space(loc_m.group(2))
        name_part = clean_space(rest[: loc_m.start()])
    else:
        location = "The Villages"
        bits = rest.split()
        if len(bits) < 3:
            return None
        leader = " ".join(bits[-3:])
        name_part = " ".join(bits[:-3])

    loc_time = ""
    loc_pref = LOC_TIME_PREFIX.match(location)
    if loc_pref:
        loc_time = loc_pref.group(0).strip()
        location = clean_space(location[loc_pref.end() :])
    if not location:
        location = "The Villages"

    leader = re.sub(r"\s+", " ", leader).strip(" -")
    if not leader or len(leader) < 2:
        leader = "See District listing"
    if len(leader) > 80:
        leader = leader[:80]

    name = name_part
    schedule_bits = SCHED_RE.findall(name)
    if schedule_bits:
        name = SCHED_RE.sub(" ", name)
    if loc_time:
        schedule_bits.append(loc_time)
    schedule = clean_space(" ".join(schedule_bits)) or None
    name = clean_space(name).strip(" -:,")
    name = re.sub(r"\s+\d+[A-Z0-9,&x\-]*@?\s*$", "", name).strip(" -:,")
    location = re.sub(
        r"^(?:[\d:]+)?\s*(?:AM|PM)-?\s*[A-Z]{2}\s+",
        "",
        location,
        flags=re.I,
    )
    location = re.sub(r"^(?:[\d:]+)\s*(?:AM|PM)\s+", "", location, flags=re.I)
    location = re.sub(r"\bRecreation\s+Recreation\b", "Recreation", location)
    location = clean_space(location) or "The Villages"
    if len(name) < 2:
        return None
    if name.lower().startswith("q =") or "search box" in name.lower():
        return None

    category = categorize(name)
    desc_bits = [
        f"{name} is a resident lifestyle club listed in The Villages District Recreation Club Contacts (July 10, 2026)."
    ]
    if schedule:
        desc_bits.append(f"Published meeting code: {schedule}.")
    desc_bits.append(f"Typical meeting location: {location}.")
    desc_bits.append("Confirm times with the club leader before you go — listings change.")
    description = " ".join(desc_bits)[:800]

    if not email and not phone and not website:
        website = "https://www.districtgov.org/recreation/clubs/"

    return {
        "id": slug_id(name, location),
        "name": name[:100],
        "category": category,
        "location": location[:120],
        "leaderName": leader,
        "website": website[:200] if website else None,
        "email": email[:120] if email else None,
        "phone": phone,
        "description": description,
        "membershipStatus": "open",
        "submittedByName": "District Club Contacts PDF",
        "status": "approved",
        "createdAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "updatedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "approvedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    }


def main() -> None:
    reader = PdfReader(str(PDF))
    pages = []
    for p in reader.pages:
        pages.append(p.extract_text() or "")
    body = strip_headers("\n".join(pages))

    records = []
    buf: list[str] = []
    for line in body.splitlines():
        buf.append(line)
        joined = " ".join(buf)
        if PHONE_RE.search(clean_space(joined)):
            rec = parse_chunk(joined)
            if rec:
                records.append(rec)
            buf = []
    if buf:
        rec = parse_chunk(" ".join(buf))
        if rec:
            records.append(rec)

    # de-dupe by id, keep first
    seen = set()
    unique = []
    for r in records:
        if r["id"] in seen:
            continue
        seen.add(r["id"])
        unique.append(r)

    unique.sort(key=lambda r: (r["category"], r["name"].lower(), r["location"].lower()))
    cats: dict[str, int] = {}
    for r in unique:
        cats[r["category"]] = cats.get(r["category"], 0) + 1

    payload = {
        "listings": unique,
        "updatedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "source": "District Recreation Club Contacts PDF 7.10.26",
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote {len(unique)} clubs to {OUT}")
    for k, v in sorted(cats.items(), key=lambda kv: -kv[1]):
        print(f"  {k}: {v}")


if __name__ == "__main__":
    main()
