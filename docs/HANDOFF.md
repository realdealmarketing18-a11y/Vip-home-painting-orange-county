# HANDOFF — VIP Home Painting · Orange County Sales Page

Written for a developer with zero context. Everything below is real paths / real values.

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
  Tagline "See It. Love It. Paint It."
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

1. **Human visual QA + mobile pass** on
   https://realdealmarketing18-a11y.github.io/Vip-home-painting-orange-county/orange-county-sales-page/
   — hero (desktop 1440 + 390px), palette cans, style banners, byline. Fix any spacing
   nits directly in `orange-county-sales-page/index.html` (search anchors: `.scheme .dot`,
   `.style-banner`, `.byline`, `.hero-strip`), commit to `main`, Pages auto-deploys.
2. **Produce the full hero film** (the 8-scene Douglas & Sheri / Gallagher episode).
   Assets + prompts staged: `orange-county-sales-page/commercial-prompts.md` (8K scheme +
   addition prompts), storyboard HTML at `C:\Users\Owner\Downloads\visual-storyboard-episode1.html`,
   Higgsfield skill library at `C:\Users\Owner\VIP-Lead-Machine\.claude\skills\higgsfield\`
   (Soul ID "Fabian-Hero-Locked" + "Gallaghers-Newport-Beach" elements already exist in the
   user's Higgsfield account). Deliver as `video/gallagher-ambient.{webm,mp4}` (replace) —
   markup/JS need no changes; re-extract `video/hero-poster.jpg` from the new first frame.
3. **Pre-launch hygiene:** swap `viz-photos/base.webp` + derived renders to an owned/licensed
   home photo (or a real completed VIP project), prune duplicate badge PNGs, run a Lighthouse
   pass (30MB of combo images are lazy-loaded on demand by the photo engine, but confirm),
   and re-verify the JSON-LD with Google's Rich Results test.
