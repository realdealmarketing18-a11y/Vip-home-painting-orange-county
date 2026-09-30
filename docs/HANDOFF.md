# HANDOFF — VIP Home Painting · Orange County Sales Page

Written for a developer with zero context. Everything below is real paths / real values.

---

## 0. LATEST — Story-layout restructure (2026-09-30, branch `layout-restructure`)

One-time unattended run. **Not merged, not published.** Nothing in WordPress was
touched; `publish-wp.js` was not run; `config.staging` and `countyIndexable` are
unchanged; no deployment settings or workflows were changed (the repo has none —
GitHub Pages serves `main`, so this branch has no staging URL of its own and the
pages below go live on github.io **only after the branch is merged to main**).

### What changed

- **Layout system in the generator** — `generator/story-layouts.js` (+ `layout-page.css`,
  `verify-layouts.js`, `swap-checklist.js`, SOP in `generator/LAYOUTS.md`). A page opts in
  with `"storyLayout": "B"…"F"` in its data record; pages without it build byte-for-byte as
  before (checked: HOA page, guide + 4 articles, 3 service pages and the OC page are
  identical to `main`).
- **All 13 city/community pages assigned** exactly as briefed:
  B /irvine/ · C /anaheim/ · D altair, crown-pointe, summit-pointe ·
  E woodbury, stonegate, portola-springs, orchard-hills · F peralta-hills, hidden-canyon, belsomet.
  One commit per page (Altair was the pilot).
- **The Gallaghers are the hero, visualizer and proof family on every page**; Ceasar & Julie
  moved from the Irvine hero into the "More Irvine Families" proof block.
- **SWAP markers** (`CLIENT`, `LOCAL`, `FAQ`, `VIZCOPY`) are emitted in the built HTML, each
  followed by a comment naming the data file and field. Full list with fields:
  `docs/SWAP-CHECKLIST.md` (regenerate with `node generator/swap-checklist.js`).
- Every page re-verified: `generate.js` + `verify-site.js` (26/26) + `verify-layouts.js`;
  headless Chromium at 390px and 1440px — no horizontal scroll, no JS errors, no local 404s,
  visualizer scheme + option clicks, both slider types and the photo form all work.
  Title, meta description, canonical, robots and JSON-LD compared against `main`: identical on
  all 13 pages. No internal link dropped on any page.

### Judgment calls (change any of them)

1. **The H1 is never rewritten by a layout.** Each layout's story headline ("The Gallaghers Were
   One Signature Away From Painting Twice", "…Approved on the First Submission", etc.) is a
   `hero.deck` line under the H1, fenced as SWAP:CLIENT. Three H1s *did* change, each to the
   page's own stored `h1` field, and each noted in its commit:
   - **/irvine/** — the old H1 named Ceasar & Julie (the brief moves them out of the hero). Now
     `seo.h1`: "Every Other Irvine Painter Guesses. We Render It First."
   - **/anaheim/** — the old H1 opened with "We", which fails the headline gate (check 12) once it
     sits in a story hero. Now `seo.h1`: "Anaheim House Painters Who Show You the Color on Your
     Own Home First". The old line lives on as the hometown-edge section's lead.
   - **/anaheim/summit-pointe/** — "Built in 1991…" fails the headline gate (1991 is not an
     approved headline number). Now the record's `h1`: "Summit Pointe Painting — See the Color
     Before the Crew Arrives". "Built in 1991" moved into the hero story line.
2. **Doorway guard kept as-is.** Pages sharing a layout keep the same story sequence and differ
   by `layoutOptions` add-in sections (e.g. Altair adds `instead` + `offer`). The guard still
   compares the order each page actually renders. Choices per page: `generator/LAYOUTS.md`.
3. **Schema frozen.** Pages that were already on the master process keep their schema extras
   (read from their original `moduleOrder`, kept in the record for that reason). The six pages
   newly given master copy (4 Anaheim communities + both cities) carry `"schema": "legacy"` so
   their JSON-LD stays byte-identical.
4. **Copy a layout replaced is parked, not deleted** — `master._parked.instead` on the four E
   pages (their old "what owners try first" copy; beat 2 is now the approval trap). Master blocks
   a layout does not use (e.g. `settle` on Altair) stay in the data untouched.
5. **Layout F's visualizer**: step blocks are reordered in the markup only (Lighting, Color,
   Texture, Finishing, Your Home). The visualizer script was not touched — it finds controls by
   id/`data-cat`, never position. New between-step lines were written for the new order.
6. **Layout E "community field first"**: the form already asked for the community first; its
   label now reads "Your community (or address)". Every layout page's placeholder now shows its
   own community instead of "Orchard Hills, Irvine".
7. **"HOA-weighted FAQ" (E)** reorders the *visible* FAQ so association questions come first; the
   FAQPage schema keeps the data order (the schema is not to be touched).
8. **Designer palettes (C, F)** render every colour as a three-can set (body, trim, accent), never
   a flat chip. The trim/accent cans beside each colour are named on the card (Alabaster SW 7008
   trim / Iron Ore SW 7069 accent by default) — a display choice, not a claim about any house.
9. **Placeholders are honest about being illustrative.** The painting-days and approval timelines
   use "First / Next / Then…" or "Step One…" (no promised day counts — earlier rollout rows
   removed "5 working days" claims as unbacked) and carry a visible note that the order is
   illustrative. The near-miss, flashback and "approved on the first submission" beats are
   Gallagher placeholder story, fenced SWAP:CLIENT, as briefed.
10. **Layout D needs five cards**: Crown Pointe and Summit Pointe had three local problems; two
    general preparation problems (crack repair, back-rolling / itemized estimate) were added to
    their `problems[]`. They are true of any stucco repaint and fenced SWAP:LOCAL.
11. **Links moved, not dropped**: the old per-community map section's "Open Google Maps" link now
    sits in the service-area section on every layout page.
12. **OC-DESIGN-ROLLOUT.md rows 7–12 set to `done (layout run)`** with a note, so the paused hourly
    task will not rewrite those pages against the old `moduleOrder` model if it is re-enabled.
    Set any row back to `todo` to have it rewrite that page's copy on top of the layout.

### Found, not fixed

- Layout F reuses the legacy **specification** and **white-glove process** sections (the brief asks
  for them). Their copy predates the rollout's clean-up and still says "no questions asked" and "a
  signed walkthrough" — worth a look before publishing.
- The city `pricing` and `cost_of_wrong` sections still quote a local market range ($2.74–$4.89) and
  a "$4,000–$7,000" second-repaint figure. Existing copy, unchanged; neither is in `context/ABOUT-VIP.md`.
- Push from this run was blocked: the session's git credentials did not include this repository, so
  `layout-restructure` exists only as a git bundle delivered in the conversation (see below).

### What is left

1. **Get the branch onto GitHub**: from a clone of the repo, `git fetch <path-to>/layout-restructure.bundle
   layout-restructure:layout-restructure && git push origin layout-restructure` (or re-run with the
   repo attached with push access).
2. Review the branch, merge to `main`, then check the pages on github.io.
3. Swap the placeholders page by page using `docs/SWAP-CHECKLIST.md`.
4. Re-enable the "VIP page rollout" scheduled task only if still wanted (read its note first).

---

## 1. GOAL

Build and refine a **luxury-magazine-style sales landing page** for VIP Home Painting's
Orange County market (Newport Beach · Irvine · Coto de Caza). Target customer is an
UHNW homeowner ("Claire Robertson" persona, $25K–$1M projects). The page is optimized
for SEO / AI search / Google Maps and centers on an interactive **Custom Color
Visualization** section: visitors pick a color scheme + additions and see photorealistic
renders of a real estate transform live.

- **Repo (single source of truth):** https://github.com/realdealmarketing18-a11y/Vip-home-painting-orange-county (`main`)
- **Local working clone:** `C:\Users\Owner\oc-site\` — the page lives in `orange-county-sales-page/`
- **Permanent public URL (GitHub Pages, main/root, auto-deploys ~1 min after push):**
  https://realdealmarketing18-a11y.github.io/Vip-home-painting-orange-county/orange-county-sales-page/
  (repo root `index.html` is a meta-redirect to that folder)
- **Local preview:** `node C:\Users\Owner\oc-site\orange-county-sales-page\serve-oc.js` → http://localhost:5460/
- **BRAND RULE (hard):** never say "AI" in customer-facing copy — always "Custom Visualization
  Service" / "our design team". Brand: Orange #E8833A · Navy #1A1F4E · Gold #C9A961 ·
  Cream #F5EFE2 · Fonts Fraunces (serif) + Inter (sans) · Phone (909) 312-5400 ·
  Tagline "Visualize It. Love It. Paint It."
- There is an OLDER repo `realdealmarketing18-a11y/vip-lead-machine` (private, the whole
  business system, local at `C:\Users\Owner\VIP-Lead-Machine\`). The sales page was
  migrated OUT of it. Its `SALES-PAGE-DESIGN\github-sales-page\` and
  `section2-visualizer-assets\` folders are stale snapshots — do not edit them.
  That repo also has a stray `gh-pages` branch (harmless, can be deleted).

## 2. CURRENT STATE

**Working now (all committed & pushed through `b1ce71a`):**
- Full page `orange-county-sales-page/index.html` (~2,300 lines, ONE file: inlined design-token
  CSS + markup + JS). SEO head: OC-targeted title/meta/OG, JSON-LD `@graph`
  (HomeAndConstructionBusiness + FAQPage + WebPage w/ speakable).
- **Cinematic video hero** (`section.hero.hero-cinema#hero`): full-viewport ambient loop
  (muted/looped `video/gallagher-ambient.webm` 327KB → mp4 fallback 7.5MB), scrim, inset
  gold frame, "Watch the Film" sound-gate (unmutes, restarts, fades in player bar with
  scrub/mute/Back-to-Page), poster = true first frame (`video/hero-poster.jpg`, extracted
  via canvas). Trust strip: transparent laurel badge images + star/clock SVGs.
- **Section 2 visualizer**: 11 full-look schemes in 5 style tabs (Bold & Modern, Warm &
  Earthy, Subtle & Elegant, Spanish Revival, Ultra-Luxury Resort) + 3 lighting / 3 siding /
  3 premium options with product-photo thumbnails. Photo engine in the page JS resolves
  `viz-photos/<cat>-<opt>--<scheme>.jpg` (99 combo renders exist) so a chosen scheme
  NEVER reverts when an addition is tapped; falls back combo → scheme → original → tint.
- **Photoreal can swatches**: every palette card swatch is a real top-down gallon-can photo
  (`assets/can-top.jpg`) tinted per scheme via CSS `mix-blend-mode: multiply` (.92) +
  `soft-light` (.55) on `--c` custom property set inline by `renderSchemes()`.
- **Brand flat-lay banners**: `viz-photos/banner-{bold,earthy,subtle,spanish,resort}.jpg`
  (navy cans / gold rims / cream linen, gold script titles) shown above the palette grid
  when a style tab is active (hidden on "All Options").
- Editorial magazine layer: ruled gold eyebrows on all section heads, serial kickers
  `No. 01`–`No. 10` (`.sec-no`), founder byline block (Fabian portrait + quote) before the
  final CTA, transparent logo w/ tagline in topbar, transparent brush mark in footer,
  Gallagher couple photo in the hero avatar pill.
- Deleted per client: the old "Exclusive Offers / $750 OFF / FREE consult / FREE pressure
  wash" block, and the old standalone sales pages that used to sit at repo root.
- Repo root still keeps the design-system reference: `design-system/colors_and_type.css`,
  `design-system/components.css`, `design-system/SKILL.md`, `README.md` (client chose to keep these).

**Half-finished / soft spots:** see OPEN ISSUES.

## 3. FILES TOUCHED (this session, all under `C:\Users\Owner\oc-site\` unless noted)

- `orange-county-sales-page/index.html` — the big one. This session: replaced old
  slider-hero with magazine cover, then replaced THAT with the cinematic video hero
  (spec from client); added `.hero-cinema` CSS + hero JS (ambient/sound-gate/player, all
  ID-guarded); moved trust badges into hero strip as images; removed viz-head badges;
  deleted offers block; palette dots v2→v3→v4 (now `assets/can-top.jpg` + blend tint);
  `--c` var in `renderSchemes()` dot template (was `background:`); style-banner slot
  (`#styleBanner`/`#styleBannerImg`) + wiring inside `renderTabs()`; `.sec-no` serials ×10;
  founder `.byline` block; ruled-eyebrow CSS; topbar/footer logo swaps; webm `<source>`
  listed before mp4.
- `orange-county-sales-page/serve-oc.js` — local preview server; serves this folder at
  :5460, mp4/webm MIME types added, `Cache-Control: no-store`.
- `orange-county-sales-page/video/` — `gallagher-ambient.mp4` (client's film),
  `gallagher-ambient.webm` (encoded this session via `ffmpeg-static`, crf 40, 5.04s),
  `hero-poster.jpg` (canvas-captured first frame), `.gitkeep`.
- `orange-county-sales-page/assets/` — `can-top.jpg` (photoreal can template, 420px);
  `avatar-gallagher.jpg` (couple crop); `fabian.jpg` (founder crop from poster frame);
  `logos/logo-tagline.png` + `logos/logo-mark.png` (white-removed + tight-cropped from
  `C:\Users\Owner\VIP-Lead-Machine\assets\logos\vip-logo-primary.png` / `vip-mark-icon-white.png`);
  `badges/badge-color-schemes.png` + `badges/badge-warranty.png` (transparent laurels;
  originals `vip-*-web.png` restored from vip-lead-machine git history, still present).
- `orange-county-sales-page/viz-photos/` — added `banner-*.jpg` ×5 (regenerated once:
  first set was black-marble/copper = OFF-BRAND, replaced with navy/gold/cream set).
  Pre-existing here: base.webp, 11 `scheme-*.jpg`, 99 `<cat>-<opt>--<scheme>.jpg` combos,
  9 addition renders + 9 `thumb-*.jpg` product shots, `combo-manifest.txt`.
- Repo root: `index.html` (redirect page), `.nojekyll`, `.gitignore` (+`*.log`),
  deleted `VIP Home Painting Sales Page (standalone).html` + `VIP-Sales-Page-Desktop-standalone.html`.
- `docs/HANDOFF.md` (this file).

## 4. DECISIONS (easy to accidentally undo — don't)

- **One repo, one file.** `orange-county-sales-page/index.html` is canonical; CSS is
  INLINED on purpose (portability + Pages). Don't re-split into external stylesheets.
- **Brand palette is law.** The first flat-lay banner set (black marble + copper) was
  rejected by the client for being off-brand. Anything generated must use navy `#1A1F4E`
  / gold `#C9A961`/`#FFB200` / cream `#F5EFE2`. Keep gold rims, not copper.
- **Swatches = photo + blend, not CSS art and not per-color renders.** One template photo
  (`assets/can-top.jpg`, white paint) tinted by `--c` via multiply+soft-light keeps colors
  hex-exact to the SW palette and costs zero credits per color. Two earlier pure-CSS can
  attempts were rejected as unrealistic. Tint ellipse insets are calibrated to this exact
  image: `left 9.5%; right 10.5%; top 10%; bottom 9%` — if you regenerate can-top.jpg you
  MUST recalibrate.
- **Photo-resolution ladder in the visualizer JS:** combo (`<cat>-<opt>--<scheme>`) →
  scheme → original-home option render → CSS tint. A selected scheme must never flip back
  to the original house colors (this was an explicit client bug report; the guard lives in
  `resolveAndShow()`).
- **Hero video sources:** webm FIRST, mp4 second (webm is 96% smaller). Poster must be the
  film's real first frame. Hero JS is wrapped in `if (!hero || !video) return;` so the page
  survives section removal. Old `#heroAfter` / `.hero .ba-img` refs are if-guarded no-ops —
  leave them.
- **Section 2's `.vp-before/.vp-after` slider is separate from the old hero slider** —
  the hero's `.ba-frame` was deleted; the 3 remaining `.ba-frame`s (consult video + 2 case
  studies) must keep working.
- **Naming conventions matter:** option labels are slugified to filenames
  (`slugify('LED Slot Sconce')` → `light-led-slot-sconce.jpg`); banner files must be
  `viz-photos/banner-<styleId>.jpg` where styleId ∈ bold/earthy/subtle/spanish/resort.
- **Legal caution:** `viz-photos/base.webp` derives from an MLS/agent listing photo of a
  real Newport Beach home; the "Gallagher family" and Fabian imagery are Higgsfield
  renders. Fine for demo/iteration; replace or license before paid-media launch.
- Client repeatedly asked to "reset the link" — that means restart `serve-oc.js` (and
  historically a cloudflared tunnel; superseded by GitHub Pages).

## 4b. IRVINE COMMUNITY PAGE GENERATOR (added 2026-07-23)

`generator/` produces programmatic SEO landing pages for six luxury Irvine
communities (Orchard Hills, Altair, Portola Springs, Hidden Canyon, Woodbury,
Stonegate) at `irvine/<slug>/index.html`, plus root `sitemap.xml` + `robots.txt`.
Run `node generator/generate.js` after editing `generator/communities.json`
(all copy/SEO data) or `generator/page.css` (module styles/overrides). Five
body modules rotate in a unique order per page (build fails on duplicate
orders); hero is the OC cinematic style with a static poster image. The
**interactive Custom Visualization section is extracted verbatim from the OC
page at build time** (CSS + HTML + JS, asset paths rewritten) — edit it once
on the OC page and regenerate. Every page carries JSON-LD (Business w/ geo +
hasMap, Service, FAQPage, WebPage, Breadcrumbs), an "answer capsule" under
the hero, and a Google Maps embed + NAP section for local-pack signals
(off-site checklist: `generator/GOOGLE-MAPS-PLAYBOOK.md`). Full docs:
`generator/README.md`. Generated pages are committed artifacts — GitHub
Pages serves them as-is.

## 5. OPEN ISSUES

- **Browser-pane screenshots time out** in this dev environment (renderer chokes, even on
  video-free pages) — visual QA this session was done via computed-style checks and
  pixel-math composites. A human should eyeball: can-swatch sizing/spacing (66px desktop,
  44px in `.viz-timeline`), tint-ellipse edges on the lightest (Snowbound `#EDEAE0`) and
  darkest (Tricorn Black) colors, banner aspect (21/8 crop) on mobile.
- **The film is only 5.04s** — fine as ambient loop; the "Watch the Film" gate plays 5s of
  unmuted video then returns. Client plans a longer episode cut (script + storyboard exist;
  a `video-production` skill and Higgsfield Soul ID assets for "Fabian" are staged in the
  vip-lead-machine repo / Higgsfield canvas https://higgsfield.ai/s/7A2A62IcAGA).
- **`assets/badges/vip-*-web.png`** (white-background originals) are still committed
  alongside the transparent versions — harmless dupes, could be pruned.
- **Old vip-lead-machine repo** has an auto "vault backup" process that deletes untracked
  files — that's why work moved to `C:\Users\Owner\oc-site\`. Don't relocate work back.
- Steps 2–4 option photos show additions on the ORIGINAL house color unless a
  scheme is active (by design); per-scheme combos exist for all 9 options × 11 schemes.

## 6. NEXT STEPS (in order)

> **Work continues locally, not in the cloud.** Novamira, the WordPress
> credentials and the Higgsfield result CDN are all unreachable from a Claude
> Code web session — every remaining step below needs at least one of them.
> **`docs/LOCAL-SETUP.md` is the runbook**: how to get running in your clone at
> `C:\Users\Owner\oc-site\`, what to configure, and this queue in full.

1. **Install `generator/wp-mu-plugins/vip-elevation-intake.php`** into
   `wp-content/novamira-sandbox/`, the same way the other four went in. That is
   what switches Step Five from the text-message handoff to a real upload —
   there is nothing else to configure.
2. **Grade the T1 control render** — job `4f7a4854-832a-487f-aa04-d3a02c83555e`
   in the Higgsfield account. `generator/viz-render/T1-RESULT.md` has the gate
   and maps each failure to its fix. It is not a pass yet; nobody has seen it.
3. **Upload `viz-photos/` to WP media before publishing.** The hero reel needs
   `scheme-pebblebeach`, `-ibiza`, `-pacificsage`, `-obsidian` and `-spanish`
   at `ASSET_BASE`. This is F-16 waiting to happen again.
4. **Publish to WordPress** — `publish-wp.js --only=county`, then `--live`.
   Rank Math Page schema off first.
5. **Run T4** — one house end to end, timed. That number is the turnaround on
   the Step Five button, and it must be measured rather than guessed.
6. **Human visual QA + mobile pass** on the build site, hero at 1440 and 390.

### Retired from this list

- ~~Produce the full hero film (the 8-scene Gallagher episode).~~ The hero no
  longer depends on it. The play gate is gone and a selection reel of five
  candidate palettes stands in its place, which is a bar we can clear today:
  a film needs a hundred consistent frames, this needs five stills that
  already exist. When the footage is usable the reel window becomes its poster
  frame and nothing else on the page has to move. Prompts and storyboard are
  still staged in `commercial-prompts.md`.

