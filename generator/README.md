# Irvine Community Landing Page Generator

Programmatic, SEO-optimized landing pages for VIP Home Painting's luxury Irvine
communities, built on the Orange County sales page design system.

## Run it

```
node generator/generate.js
```

Outputs (all committed to the repo — GitHub Pages serves them as-is):

- `irvine/<slug>/index.html` — one page per community (orchard-hills, altair,
  portola-springs, hidden-canyon, woodbury, stonegate)
- `sitemap.xml` — root + OC page + all community pages
- `robots.txt` — points crawlers at the sitemap

## How it works

| File | Role |
|---|---|
| `communities.json` | All per-community content: SEO title/meta/H1, answer capsule, localized copy, extra SW colors, problem/solution items, and the module order. `config` holds site base URL, phone, and paths. |
| `page.css` | Design system extracted from `orange-county-sales-page/index.html` (tokens, topbar, hero, footer) plus the five module styles. Inlined into every page. |
| `generate.js` | Templates + build. Validates data, assembles pages, writes output. |

## Architecture rules

- **Interactive Custom Visualization is the highlight (No. 01)** — the full
  section 2 of the OC page (style tabs, 11 scheme cards, before/after slider,
  photo-swap engine) is **extracted from
  `orange-county-sales-page/index.html` at build time** with asset paths
  rewritten, and placed right after the answer capsule on every page with a
  localized headline ("See Your Orchard Hills Home In Every Color…"). Improve
  the visualizer on the OC page, re-run the generator, all pages update.
- **Modular layout rotation** — five body modules (`portfolio`, `specs`,
  `colorGuide`, `process`, `problemSolution`). Each community's `moduleOrder`
  must be a unique permutation; the generator **fails the build** if two pages
  share the same sequential order (duplicate-layout SEO guard).
- **Google Maps / local-pack layer** — every page ends with an embedded
  community map + consistent NAP block + Google-profile links, per-community
  `geo` coordinates and `hasMap` in the LocalBusiness schema, and a visible
  FAQ backed by matching `FAQPage` JSON-LD. The off-site signals (GBP
  categories, reviews, citations) live in `GOOGLE-MAPS-PLAYBOOK.md`.
- **Unified hero** — same cinematic hero style as the OC page (gold frame,
  scrim, ruled eyebrow) but a static poster image instead of video for fast
  LCP. Headline/eyebrow/kicker swap per community.
- **Structured data** — every page gets a JSON-LD `@graph` with
  `HomeAndConstructionBusiness`, `Service`, `WebPage` (speakable: `h1` +
  `.capsule-text`), and `BreadcrumbList`.
- **Answer capsule** — an AI-search-ready summary paragraph directly under the
  hero: who/where/what/price anchor/warranty/phone in one crawlable block.
- **Proof policy** — general, truthful proof points (Graco/Titan airless
  application, Sherwin-Williams Emerald/Duration, itemized estimates, 2-Year
  Warranty) framed around each community's real architecture. No fabricated
  testimonials or invented project claims.

## Adding a community

Add an object to `communities` in `communities.json` with a **new unique**
`moduleOrder` permutation, then re-run the generator. The other pages'
footers pick up the new cross-link automatically.

## Brand rules (inherited)

Never say "AI" in customer-facing copy — it's the "Custom Visualization
Service" / "our design team". Navy `#1A1F4E` · Gold `#C9A961` · Cream
`#F5EFE2` · Fraunces + Inter · (909) 312-5400.

## The master sales process on a community or city page (added 2026-09-29)

The Orange County page's story-led process — the family's story in the hero,
*they visualized it → they loved it → we painted it*, the package, the
warranty, the P.S. — is now a set of generator modules in
`generator/master-modules.js`. Everything that is the same on every page is
**lifted from `orange-county-sales-page/index.html` at build time**, so an
improvement there reaches every page on the next build. Only the local words
live in the data.

**How a page switches on:** give it a `master` block (in `communities.json`,
or on the city in `cities.json`) with at least `master.hero.h1`. A page
without one looks exactly as it did before.

**The fixed parts** (always in this place): the story hero → the short answer →
the visualizer → *(the rotating sections)* → the FAQ → the close with the P.S.

**The rotating sections** — list them in the page's `moduleOrder` (city pages:
`layout.module_order`). Each one appears only once its words are written:

| Name | What it is on the master | Words it needs |
|---|---|---|
| `eliminated` | "They did not choose this color — they eliminated ten others" + the scheme cards | `h2`, `lead` |
| `instead` | "What usually happens instead" + the things-you-already-tried list | `h2`, `bridge`, `lede`, `turn` |
| `settle` | "3 things to settle before a gallon is opened" | `h2`, `lead` |
| `offer` | The package: the 11 renders, the $329 comparison, what you get | `h2`, `sub` |
| `painted` | "Then we painted it" — the 3 steps | `h2`, `sub` |
| `warranty` | The warranty (length read from config; the seal is drawn in type, never the master's badge image, which says 1-year) | `h2`, `body` |
| `beforeCommit` | "What you get before you commit" — the 4 pillars | `h2`, `lead` (optional) |
| `neighbors` | "The one thing your neighbors see every day" | `h2`, `sub` |
| `testimonials` | The three quotes from the master | `{}` — ⚠ unverified, see ABOUT-VIP item 6 |
| `services` | Exterior / interior / cabinets, linking to their pages | `h2`, `items` ×3 `{title, body}` |
| `serviceArea` | Links up to the city, across to neighbors, the map and contact card | `h2`, `lead` |

The close takes `master.close.h2` and `master.close.ps` (a list of paragraphs).

**Words in the copy never name the family.** Write tokens instead, and the
build fills them in from the story block: `{they}` / `{They}` (the Gallaghers),
`{their}` / `{Their}` (the Gallaghers’), `{family}` (The Gallagher Family),
`{place}` (Newport Beach), `{location}`, `{schemes}` (11), `{chosen}` (the scheme
they picked), plus `{community}`, `{city}`, `{warranty}`, `{rate}`, `{phone}`.
A typo in a token stops the build and says which one.

The same tokens work in the page's **title, meta description, short answer
(`capsule`), visualizer intro (`vizIntro`), FAQ and problem cards** once the
page has a `master` block — so the phone, warranty, starting rate and scheme
count are never typed into the data, and a swapped family reaches the FAQ too.
Optional extras: `master.beforeCommit.lead` (a paragraph under that heading)
and `master.problemSolution.h2` (a local heading for the problem cards, if the
page's `moduleOrder` includes `problemSolution`).

### Swapping a page's homeowner and photos

Every page starts with **the OC page's own family as a placeholder**. To put
the real homeowner on a page, add (or edit) one block on that page and re-run
`node generator/generate.js`:

```json
"story": {
  "family": "The Smith Family",          ← the name on the little photo chip
  "short": "the Smiths",                 ← how the copy says them mid-sentence
  "possessive": "the Smiths’",           ← "the Smiths’ home"
  "location": "Orchard Hills, Irvine",   ← under their name on the chip
  "place": "Irvine",                     ← "their Irvine home"
  "avatar": "assets/avatar-smith.jpg",   ← their photo
  "heroPhoto": "assets/hero-smith.jpg",  ← the big picture behind the headline
  "photoDir": "story-photos/smith",      ← the folder of their house pictures
  "before": "base.webp",                 ← their house before
  "after": "scheme-organic.jpg",         ← their house in the scheme they chose
  "chosen": { "name": "Coastal Organic Compound",
              "colors": "Alabaster SW 7008 &middot; Urbane Bronze SW 7048",
              "body": "#EDE8DC", "trim": "#54504A", "accent": "#9C7B53" },
  "schemeCount": 11,
  "placeholder": false
}
```

- All paths are inside `orange-county-sales-page/`.
- **The photo folder** must hold the same file names as `viz-photos/`:
  `base.webp` plus the eleven `scheme-….jpg` renders of *their* house. The hero,
  the scheme cards, the package and the step swipes all read from it.
- If a picture is missing, the build stops and lists exactly which ones.
- You only need the lines you change — anything left out stays as the placeholder.
- **The visualizer never changes.** It is the demonstration tool, and it always
  shows the Gallaghers' house with their name, which stays true.
