# STORY SHEET — {Community}, {City}

Save as `generator/research/{city}/stories/{slug}.STORY.md`. One per page.
Every line is either **sourced** (client said it / photo exists / research file) or left
blank. Blank is fine. Invented is not.

---

## 1 · Who

| Field | Value | Source |
|---|---|---|
| Name as they agreed to be named | e.g. "The Alvarez Family" | consent form, date |
| Where they live (as they agreed) | e.g. "Woodbury, Irvine" | |
| Permission to use name, photos, quote | yes / no — date | |
| Avatar photo | `orange-county-sales-page/stories/{slug}/avatar.jpg` | |

## 2 · Before — the years in the old color

- How long they lived with it:
- Why they waited — their words if possible (map each to a fear in `07-VOICE.md`):
  1. … → fear #
  2. … → fear #
  3. … → fear #

## 3 · What they tried first

(chips · sample patches · palette book · paint-store staff · neighbors · a first HOA submission)

## 4 · The local condition — the setting

What about THIS place made the decision hard? Cite `05-communities.md`.
(e.g. afternoon light on open slopes · guard gate · design review · close-set street ·
no streetlights · broad modern planes)

## 5 · The visualizer, step by step — ALWAYS in this order

| Step | Their choice | Why it matched their goal / style / mood |
|---|---|---|
| 1 · Color scheme | | |
| 2 · Lighting | | |
| 3 · Texture & Material | | |
| 4 · Finishing Touches | | |
| 5 · Their home | photo sent on: | |

**Goal:** … **Style:** … **Mood:** …
**Signature addition** (the one the Reveal photo shows): light / siding / premium

### Valid choices (the visualizer's own — anything else fails the build)

| Scheme id (`story.scheme`) | Name | Sherwin-Williams |
|---|---|---|
| `obsidian` | Obsidian Monolith | Iron Ore SW 7069 · Tricorn Black SW 6258 |
| `riviera` | Riviera Tuxedo | Snowbound SW 7004 · Black Magic SW 6991 |
| `euro` | Euro-Industrial Estate | Peppercorn SW 7674 · Cityscape SW 7067 |
| `organic` | Coastal Organic Compound | Alabaster SW 7008 · Urbane Bronze SW 7048 |
| `pacificsage` | Pacific Sage Estate | Evergreen Fog SW 9130 · Shoji White SW 7042 |
| `ibiza` | Ibiza Luxury Villa | Balanced Beige SW 7037 · Aesthetic White SW 7035 |
| `admiral` | Newport Admiral | Repose Gray SW 7015 · Pure White SW 7005 |
| `marinelayer` | Marine Layer | Sea Salt SW 6204 · High Reflective White SW 7757 |
| `pebblebeach` | Pebble Beach Manor | Accessible Beige SW 7036 · Dover White SW 6385 |
| `spanish` | Santa Barbara Luxe | Alabaster SW 7008 · Tricorn Black SW 6258 |
| `resort` | Beverly Hills Resort | City Loft SW 7631, monochrome |

| Step | `story.additions` key | Option slugs |
|---|---|---|
| Lighting | `light` | `led-slot-sconce` · `iron-scroll-lantern` · `bronze-coach-pendant` |
| Texture & Material | `siding` | `cedar-shake` · `board-batten` · `stacked-stone-veneer` |
| Finishing Touches | `premium` | `smoked-glass-garage` · `walnut-wood-garage` · `limestone-pillars` |

## 6 · The schemes they ruled out — and why

| Scheme | Why it went |
|---|---|

## 7 · The painting days

Real dates/durations if known. Otherwise leave blank — the page keeps its illustrative order.

## 8 · After

- Quote (verbatim, with permission):
- Before photo: `orange-county-sales-page/stories/{slug}/before.jpg`
- After photo: `orange-county-sales-page/stories/{slug}/after.jpg`
- What the neighbors / association said (only if it was said):

---

## → Goes into the page record as

```json
"story": {
  "family": "The Alvarez Family", "short": "the Alvarezes", "possessive": "the Alvarezes’",
  "location": "Woodbury, Irvine", "place": "Woodbury",
  "avatar": "stories/woodbury/avatar.jpg",
  "scheme": "ibiza",
  "additions": { "light": "iron-scroll-lantern", "premium": "walnut-wood-garage" },
  "signature": "light",
  "goal": "…", "style": "…", "mood": "…",
  "placeholder": false
}
```
**Their own house photos:** `photoDir` must hold the same file names as `viz-photos/`
(base + every scheme render + combinations) — see `generator/README.md`, "Swapping a page's
homeowner". Until the client's renders exist, leave `photoDir` unset; the build fails loudly
if a picture is missing.

Then rewrite `master.hero.deck`, `master.reveal`, `master.flashback`, `master.nearMiss` /
`master.dusk` / `master.timeline` (whichever the layout uses) and `master.close.ps` from this
sheet. `docs/SWAP-CHECKLIST.md` lists every field on the page.
