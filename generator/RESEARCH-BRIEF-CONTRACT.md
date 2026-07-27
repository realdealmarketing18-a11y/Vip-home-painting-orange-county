# RESEARCH BRIEF CONTRACT — v3 (cluster-based)

The handoff file between **Marcus** (Research Agent) and **Seraphina** (Sales Page Agent).

**The unit of work is a CLUSTER, not a page.** One cluster = one city page + every
community page inside it. Marcus researches the whole cluster in a single pass; Seraphina
builds and interlinks the whole cluster in a single pass.

**Rule:** Marcus writes this file. Seraphina reads this file. Nothing else passes between them.

**File location:** `C:\Users\Owner\oc-site\generator\briefs\{city-slug}.json`

> ⚠️ **Never write briefs to `~/VIP-Lead-Machine/`.** That repo runs an automatic vault-backup
> process that deletes untracked files. It is why all work moved to `oc-site`.

**Validation:** `node generator/validate-brief.js irvine` — must pass before handoff.

---

## WHY CLUSTER-BASED (changed from v2)

v2 wrote one brief per page and published 1–2 pages a day. That was wrong in three ways:

1. **It repeated city-level research 7×.** Market data, HOA prevalence, local-pack
   competitors, pricing, and keyword landscape are city properties, not community
   properties. Researching them per-community burns Semrush units and Apify credits on
   identical answers.
2. **It made cross-page uniqueness unverifiable.** The generator fails on duplicate module
   orders, but nothing could check whether two community briefs written a day apart shared
   FAQ questions or opening sentences. In one file, that check is trivial.
3. **It left silos broken mid-flight.** Publishing a city page on Monday and its communities
   through Thursday means breadcrumbs point at pages that don't exist yet — exactly the
   `/irvine/` 404 that exists on the six live pages right now.

### Revising the "never publish more than 2 pages a day" guidance

v2 capped daily publishing to avoid looking like programmatic spam. That guidance applies to
*thin, templated, near-duplicate* pages at scale. It does not apply here: these pages carry
unique module orders, unique copy, unique FAQs, and genuinely different content.

**A complete silo should publish atomically.** Internal link equity flows immediately, no
breadcrumb points at a 404, and the topical cluster is coherent the moment Google crawls it.
The organic-growth guardrail moves up a level: **cap at roughly one cluster every 2–3 days**,
not one page a day.

---

## THE SCHEMA

One file. `city` holds everything researched once. `communities[]` holds only the deltas.

```json
{
  "meta": {
    "cluster_slug": "irvine",
    "researched_at": "2026-07-26T14:22:00Z",
    "researched_by": "marcus",
    "confidence": "high",
    "gaps": [],
    "sources": {
      "market": "https://www.zillow.com/irvine-ca/home-values/",
      "local_pack": "apify/google-maps-scraper run 2026-07-26",
      "questions": "apify/youtube+instagram-comments run 2026-07-26",
      "keywords": "semrush keyword_overview + related, us database, 2026-07-26"
    }
  },

  "city": {
    "page_type": "city",
    "slug": "irvine",
    "name": "Irvine",
    "county": "Orange",
    "zips": ["92602", "92603", "92604", "92606", "92612", "92614", "92617", "92618", "92620"],
    "region_label": "Orange County",
    "tier": 1,
    "parent_url": "/orange-county-sales-page/",
    "geo": { "lat": 33.6846, "lng": -117.8265 },

    "market": {
      "home_value_low": 1200000,
      "home_value_high": 6500000,
      "median_home_value": 1650000,
      "median_household_income": 129000,
      "year_built_range": "1998-2020",
      "market_rate_range": { "low": 2.74, "high": 4.89, "source": "bestpaintingestimates.com 2026" },
      "hoa_prevalence": "near-universal — nearly every village has an association with design review"
    },

    "pricing": {
      "exterior_rate_per_paintable_sqft": 4.75,
      "interior_rate_per_paintable_sqft": 3.25,
      "typical_project_low": null,
      "typical_project_high": null,
      "rate_positioning": "premium",
      "source": "REQUIRED: real VIP job data. Never computed. Null + gap if unavailable.",
      "cost_answer_sentence": "VIP exterior work in Irvine starts at $4.75 per square foot of paintable surface — the premium end of the local range — and every estimate is itemized line by line."
    },

    "local_pack": {
      "scraped_at": "2026-07-26",
      "top_competitors": [
        {
          "name": "Example Painting Co",
          "rating": 4.8,
          "review_count": 214,
          "primary_category": "Painter",
          "photo_count": 87,
          "offers_visualization": false,
          "review_complaints": ["overspray on neighbor's car", "quote changed mid-project"],
          "review_praise": ["fast", "clean worksite"]
        }
      ],
      "review_count_to_compete": 150,
      "category_consensus": ["Painter", "Painting contractor"],
      "differentiator_gap": "No competitor in the Irvine pack offers pre-paint color visualization."
    },

    "keywords": {
      "head_term": { "kw": "irvine house painters", "volume": 0, "difficulty": 0 },
      "city_terms": [
        { "kw": "exterior painting irvine ca", "volume": 0, "difficulty": 0 }
      ],
      "question_terms": [
        { "kw": "how much does it cost to paint a house in irvine", "volume": 0, "source": "semrush phrase_questions" }
      ],
      "harvested_questions": [
        { "q": "how do I know they won't just slap one coat on and disappear", "source": "youtube comment", "maps_to": "faq" }
      ],
      "note": "Community-level terms return ZERO volume in Semrush. That is a measurement floor, not absent demand. Do not pull per-community volume — mine the city long-tail and modify by community name."
    },

    "architecture": {
      "primary_style": "Mediterranean",
      "secondary_styles": ["Santa Barbara", "Spanish Colonial", "Contemporary"],
      "common_materials": ["stucco", "clay tile roof", "wrought iron", "stone veneer"],
      "typical_home_sqft": 3200,
      "typical_paintable_sqft": 2900
    },

    "geography": {
      "streets": ["Culver Drive", "Jeffrey Road", "Sand Canyon Avenue"],
      "landmarks": ["Irvine Spectrum Center", "Great Park", "Jeffrey Open Space Trail"],
      "neighbor_cities": ["Tustin", "Newport Beach", "Lake Forest"],
      "drive_time_from_base": "42 minutes"
    },

    "palette_baseline": {
      "colors": [
        { "role": "main_body",  "sw_code": "SW 7008", "sw_name": "Alabaster",    "hex": "#EDEAE0" },
        { "role": "trim",       "sw_code": "SW 7005", "sw_name": "Pure White",   "hex": "#EDECE6" },
        { "role": "gable",      "sw_code": "SW 9169", "sw_name": "Chatura Gray", "hex": "#8A857D" },
        { "role": "front_door", "sw_code": "SW 7069", "sw_name": "Iron Ore",     "hex": "#434341" }
      ],
      "trend_note": "Flat all-gray schemes now read dated — position grays as warm and layered, always with contrast."
    },

    "layout": { "module_order": ["cost_of_wrong", "pricing", "communities", "color_guide", "hoa", "process", "video", "spotlight", "reviews_map"], "hero_variant": "youtube" },

    "media": {
      "hero_video": { "youtube_id": "", "title": "", "description": "", "duration_iso": "", "upload_date": "", "thumbnail_url": "" },
      "shorts": [{ "youtube_id": "", "question_answered": "", "duration_iso": "" }],
      "media_status": "pending"
    },

    "story": { "is_real_client": false, "story_id": null, "client_label": "Representative Irvine Project" },

    "seo": {
      "primary_keyword": "Irvine house painters",
      "secondary_keywords": ["exterior painting Irvine CA", "kitchen cabinet painting Irvine", "HOA approved painter Irvine"],
      "meta_title": "Irvine House Painters | Luxury Exterior & Cabinet Painting — VIP",
      "meta_desc": "Irvine's luxury house painters. See your home in every color before a single brushstroke — complimentary visualization + itemized estimate. 1-Year Warranty. (909) 312-5400.",
      "h1": "Irvine's <span class=\"gold\">Luxury House Painters</span> — See It Before We Paint It",
      "answer_capsule": "60-110 words. Who, where, what, price anchor, warranty, phone.",
      "viz_intro": "60-110 words, unique to this page."
    },

    "faqs": [{ "q": "", "a": "", "short_youtube_id": "" }],
    "urgency": { "hook": "", "season_note": "" }
  },

  "communities": [
    {
      "page_type": "community",
      "slug": "orchard-hills",
      "name": "Orchard Hills",
      "geo": { "lat": 33.7273, "lng": -117.7595 },
      "tier": 1,

      "inherits": ["market", "pricing", "local_pack", "keywords", "palette_baseline"],

      "architecture_delta": {
        "primary_style": "Tuscan",
        "notable_features": ["hillside lots", "stone wainscots", "clay tile roofs"],
        "note": "Overrides city architecture only where the community genuinely differs."
      },
      "geography_delta": {
        "streets": ["Orchard Hills Drive", "Trailblaze"],
        "landmarks": ["Orchard Hills Shopping Center", "Loma Ridge"]
      },
      "hoa": {
        "association_name": "Orchard Hills Community Association",
        "has_color_guidelines": true,
        "approval_required": true,
        "notes": "Exterior color changes require design review submission.",
        "source": "REQUIRED URL or set has_color_guidelines: null"
      },
      "palette_extras": [
        { "sw_code": "SW 7036", "sw_name": "Accessible Beige", "hex": "#D1C7B8", "note": "" },
        { "sw_code": "SW 7048", "sw_name": "Urbane Bronze",    "hex": "#54504A", "note": "" }
      ],
      "layout": { "module_order": ["portfolio", "colorGuide", "specs", "process", "problemSolution"] },
      "story": { "is_real_client": false, "story_id": null, "client_label": "Representative Orchard Hills Project" },
      "media": { "shorts": [], "media_status": "pending" },
      "seo": {
        "primary_keyword": "Orchard Hills luxury house painters",
        "meta_title": "", "meta_desc": "", "h1": "",
        "answer_capsule": "", "viz_intro": ""
      },
      "faqs": [{ "q": "", "a": "", "short_youtube_id": "" }],
      "problems": [{ "p": "", "s": "" }]
    }
  ]
}
```

---

## SHARED vs PER-COMMUNITY — the split that saves the budget

| Researched ONCE at city level | Researched PER community |
|---|---|
| Market values, income, year built | Architecture deltas (where genuinely different) |
| `market_rate_range` + VIP pricing | Streets and landmarks |
| Local pack competitors + review text | HOA association name, rules, source URL |
| Keyword universe + harvested questions | Palette extras (2 per community) |
| Palette baseline (4 roles) | Module order (unique, registry-checked) |
| City architecture and geography | `viz_intro`, `answer_capsule`, `h1`, `meta_*` |
| Season and urgency framing | FAQs (min 3, none shared with siblings) |
| | Problem/solution pairs |

**Never re-scrape a city-level field per community.** If a community genuinely differs
(Altair is contemporary in a Mediterranean city), express it in `architecture_delta` — the
delta, not a full re-research.

---

## FIELD RULES

### Required — cluster fails validation without these

**City:** `page_type`, `slug`, `name`, `county`, `geo`, `market.*` incl. `market_rate_range`,
`pricing.cost_answer_sentence`, `local_pack.top_competitors` (min 3), `keywords.head_term`,
`architecture.primary_style`, `architecture.typical_paintable_sqft`, `geography.streets` (min 2),
`geography.landmarks` (min 1), `palette_baseline.colors` (all 4 roles), `layout.module_order`,
`seo.*` incl. `answer_capsule` and `viz_intro`, `faqs` (min 6)

**Each community:** `slug`, `name`, `geo`, `geography_delta.streets` (min 2), `hoa` (or explicit
null with a gap), `palette_extras` (exactly 2), `layout.module_order`, `seo.*` incl.
`answer_capsule` and `viz_intro`, `faqs` (min 3), `problems` (min 4)

### Never invent

- **Street names** — verified on Google Maps or omitted
- **HOA rules** — from the association's own site, or `has_color_guidelines: null` + gap
- **Client names or stories** — see the registry; one real story, one page, forever
- **Review quotes** — real Google reviews only
- **Home values, income, sqft** — cited in `meta.sources` or omitted
- **VIP's own review count or rating** — must match the live Google Business Profile
- **`typical_project_low/high`** — real job data or `null`. Never computed from a rate.

### The pricing honesty rule

`market_rate_range` is what the market charges. VIP sits above it — correct for a luxury
positioning, but the copy must never present VIP's rate as the market average.

> ✅ "VIP exterior work in Irvine starts at $4.75 per square foot of paintable surface."
> ❌ "Exterior painting in Irvine averages $4.75 per square foot."

The second is contradicted by public data ($2.74–$4.89) and is a claim a competitor could
screenshot.

---

## THE THREE REGISTRIES

Global state no single brief owns. Marcus reads and updates all three.

- **`registry/client-stories.json`** — one real client story, one page, forever. Never move a
  real client to a city they don't live in.
- **`registry/module-orders.json`** — city and community pools are separate. Every page's
  order must be unused.
- **`registry/nap.json`** — name, phone, email, hours. Inconsistent NAP suppresses local pack
  rankings.

---

## VALIDATION GATE

Run `node generator/validate-brief.js {cluster-slug}`. It enforces:

```
STRUCTURE
□ All required city fields present; all required fields on every community
□ meta.sources has a URL for every scraped category
□ palette_baseline.colors has exactly 4 roles; palette_extras exactly 2 per community

CROSS-COMMUNITY UNIQUENESS  (the check v2 could not do)
□ No two pages in the cluster share a module_order
□ No module_order collides with registry/module-orders.json
□ No two viz_intro fields share a sentence
□ No two answer_capsule fields share a sentence
□ No FAQ question appears on two pages in the cluster
□ Every h1 is distinct

COPY STANDARD
□ Zero occurrences of "free" in customer-facing strings — use "complimentary"
□ Zero occurrences of "AI" in customer-facing strings
□ Phone and email match registry/nap.json exactly

LIMITS
□ Every meta_title ≤ 60 characters
□ Every meta_desc 150-160 characters
□ Every answer_capsule and viz_intro is 60-110 words
□ Every h1 contains its city name (and community name on community pages)

TRUTH
□ story.is_real_client === true only if the story exists and is unused in the registry
□ typical_project_low/high are real job data or null + listed in gaps[]
□ cost_answer_sentence does not claim VIP's rate is the market average
□ Every hoa block has a source URL or has_color_guidelines === null
```

Any failure → written to `gaps[]`, `confidence` lowered, handed off flagged.

---

## MARCUS'S CLUSTER WORKFLOW

### Phase 1 — City research (once per cluster, steps run in parallel)

| Step | Task | Tool | Time |
|---|---|---|---|
| 1 | Market + demographics | Firecrawl: Zillow, Redfin, Census | 10 min |
| 2 | City architecture + geography | Firecrawl: Maps, listings | 8 min |
| 3 | **Local pack scrape** | **Apify Google Maps** | 8 min |
| 4 | **Question harvest** | **Apify IG / Facebook / YouTube comments** | 10 min |
| 5 | **Keyword universe** | **Semrush — city + service terms only** | 10 min |
| 6 | Pricing (real job data) + palette baseline | — | 6 min |
| 7 | City copy: capsule, viz_intro, H1, meta, 6 FAQs | — | 15 min |

**~70 min, once.**

### Phase 2 — Per community (repeat per community)

| Step | Task | Time |
|---|---|---|
| 8 | Streets, landmarks, architecture delta | 8 min |
| 9 | HOA association + rules (source URL required) | 6 min |
| 10 | Palette extras (2) + module order from registry | 4 min |
| 11 | Copy: capsule, viz_intro, H1, meta, 3+ FAQs, 4 problems | 12 min |

**~30 min each.**

### Phase 3 — Cluster validation

| Step | Task | Time |
|---|---|---|
| 12 | `node generator/validate-brief.js {slug}` | 2 min |
| 13 | Fix failures, update registries, notify Seraphina | 8 min |

**Cluster totals:** Irvine (city only, 6 communities live) ≈ 80 min ·
Newport Beach (city + 3) ≈ 170 min · a full city + 6 ≈ 260 min.

### Research tool assignment

- **Semrush** — *what to target.* Volume, difficulty, organic gaps. **City and service terms
  only.** Community terms report zero volume; that is a measurement floor, not absent demand.
  Never kill a community page on Semrush data.
- **Apify Google Maps** — *who you're beating.* Categories, review counts, and review **text**.
  Competitor complaints become your problem/solution copy.
- **Apify social** — *how people actually phrase it.* Feeds FAQs, capsules, and Shorts scripts.
  Highest-value input for AI search, which doesn't rank on keyword volume.

---

## HOW SERAPHINA CONSUMES A CLUSTER

```
1.  Read generator/briefs/{cluster}.json
2.  Re-run validate-brief.js — never build an unvalidated brief
3.  Merge city block   → generator/cities.json
4.  Merge communities[] → generator/communities.json (resolving `inherits`)
5.  node generator/generate.js
6.  Generator re-checks: unique module orders, banned words, NAP, schema completeness
7.  Interlink reconciliation across the WHOLE cluster (below)
8.  Verify every built page: JSON-LD parses, assets resolve, nav anchors resolve
9.  ONE commit for the cluster, push. Pages deploys in ~60s.
10. Report: URLs published, gaps, anything needing Fabian
```

**Seraphina never writes HTML.** She writes structured data and runs the generator. That is
what keeps every page on the design system and makes a site-wide change a one-line edit.

---

## INTERLINK RECONCILIATION (atomic, per cluster)

Because the whole cluster publishes together, every link resolves the moment it goes live:

1. **Down** — city page links to every community in its Communities module
2. **Up** — every community links to its city page and the region page
3. **Sideways** — every community links to its siblings in the footer
4. **Region** — the OC page links to every published city page
5. **Breadcrumbs** — regenerate `BreadcrumbList` so no crumb points at a 404
6. **Sitemap** — rebuild `sitemap.xml` with every published URL

---

## BUILD ORDER

1. **Irvine** — city page only; the six communities are already live. Publishing it fixes the
   `/irvine/` breadcrumb 404 on all six.
2. **Newport Beach** — city + Pelican Hill, Crystal Cove, Pelican Crest
3. **Coto de Caza** — city + its gated communities
4. Newport Coast · Laguna Beach · Mission Viejo · Dana Point · Ladera Ranch

Finish each cluster before starting the next. One complete silo outranks eight orphaned
city pages.

**Cadence: roughly one cluster every 2–3 days.**
