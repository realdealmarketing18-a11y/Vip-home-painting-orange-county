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
  application, Sherwin-Williams Emerald/Duration, itemized estimates, 1-Year
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
