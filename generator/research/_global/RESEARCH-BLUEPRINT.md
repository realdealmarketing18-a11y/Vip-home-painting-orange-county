# RESEARCH BLUEPRINT — Irvine Local Pack Takeover

**City-agnostic method and the rules behind it: `COMPETITOR-RESEARCH-PLAYBOOK.md`.**
This file is the Irvine execution detail.

How the Research Agent turns an Apify Google Maps scrape into copy inputs for the
Sales Page Agent. Configs: `apify-gmaps-configs.json`. Actor:
[`compass/crawler-google-places`](https://apify.com/compass/crawler-google-places) (`nwua9Gu5YrADL7ZDj`).

---

## FIRST: what actually ranks the local pack

Google ranks the 3-pack on **Relevance · Distance · Prominence**.

| Lever | What moves it | Can VIP move it? |
|---|---|---|
| **Relevance** | GBP primary/secondary categories, services list, business name, landing page content | **Yes — fastest lever** |
| **Distance** | Straight-line proximity from the searcher to the business location | **Barely.** VIP is ~42 min from Irvine. This is the structural constraint. |
| **Prominence** | Review count, rating, review velocity, review *keywords*, citations, links, GBP engagement | **Yes — biggest long-term lever** |

**Be honest about distance.** A service-area business without an Irvine address is fighting
uphill in the pack against painters physically located there. That does not make the pack
unwinnable — it means the play is to dominate Relevance and Prominence so hard that proximity
gets outweighed, *and* to win the organic results and long-tail community terms in parallel,
where distance is not a ranking factor at all. Your six community pages already do the second
part. This scrape is how you win the first.

---

## THE FOUR PHASES

Total estimated cost: **~$4** at FREE-tier pricing. This is the cheapest competitive
intelligence you will ever buy.

### Phase 1 — Discovery (~$0.96)

Four search terms across Irvine, 60 places each, no detail pages. Cheap and broad.

**Produces:** the competitive roster, every competitor's review count and rating, and
the **review-count bar** — the number you must beat to be credible in the pack.

**Extract:** median and top-3 review counts. That number goes straight into
`local_pack.review_count_to_compete`.

### Phase 2 — Deep profile (~$1.72) ← the important one

Top ~20 place IDs from Phase 1, with `scrapePlaceDetailPage: true` and 150 reviews each.

**This flag is the whole game.** Without it you get names and ratings. With it you get:

| Field | Why it matters |
|---|---|
| **`reviewsTags`** | **The single most valuable field in the scrape.** Google's own extracted keyword clusters from a business's reviews — these are literally what power the bolded "justifications" in local pack results. If the top 3 all carry a tag you don't, that's a review-keyword gap you can close deliberately. |
| `peopleAlsoSearch` | Google's own competitive graph. Tells you who Google thinks is in your set — often names you'd never have searched for. |
| `questionsAndAnswers` | Real customer questions, verbatim. Straight into FAQ + FAQPage schema. |
| `ownerUpdates` | GBP posting cadence. Shows whether the top 3 post weekly or never — usually never, which is an easy edge. |
| `reviewsDistribution` | The 1–2★ tail is where competitor weaknesses live. |
| `categories` | The relevance lever. Whatever the top 3 share, you must carry. |
| `imageCategories` | Photo strategy and volume. |
| Review text (150 ea.) | Praise → your proof points. Complaints → your problem/solution matrix. |

Set `reviewsStartDate: "18 months"` — old reviews describe a business that may no longer
exist, and review *recency* is itself a ranking signal worth measuring.

Set `scrapeReviewsPersonalData: false`. You need the review *text*, not reviewer identities.
Collecting names and photo URLs you have no use for is unnecessary personal-data exposure.

### Phase 3 — Geo-grid (~$0.60) ← the one everybody skips

**Local pack results change depending on where the searcher is standing.** A single scrape
from the Irvine centroid tells you nothing about who wins in Orchard Hills versus Woodbury.

Seven runs, one per community centroid plus the city center, each with a ~1.3 km
`customGeolocation` box and only the top 10 results. Then compare the ordered lists.

**Produces the competitive map:**
- Which competitor owns which villages
- Where the top 3 are *absent* — your entry points
- How tightly ranking tracks proximity (it will, and that quantifies your distance handicap)

⚠️ `customGeolocation` coordinate order is **`[longitude, latitude]`** — reversed from how
you normally write coordinates. Getting this backwards silently scrapes the wrong hemisphere.

### Phase 4 — AI competitor report (~$0.75, optional)

`enableCompetitorAnalysis: true` produces a ranked strengths/weaknesses report in a
`competitorAnalysis` dataset. Useful as a **cross-check** on your own read of the data —
not a replacement for it. Run it after you've formed your own conclusions.

---

## SIGNAL → COPY SLOT

This is the handoff. Every extracted signal maps to a specific field in the cluster brief,
which the Sales Page Agent already knows how to consume.

| Scraped signal | Brief field | Copy slot it feeds |
|---|---|---|
| Top-3 review counts | `local_pack.review_count_to_compete` | Internal target; not published |
| Shared categories of top 3 | `local_pack.category_consensus` | GBP setup + Services module |
| `reviewsTags` gap vs. top 3 | `local_pack.review_keyword_gaps` | **Review-request script** — coach clients to mention these naturally |
| Review complaints | `communities[].problems[].p` | Problem/Solution matrix — *their* failures, your fix |
| Review praise | `city.faqs`, proof points | Trust module, checks-row bullets |
| `questionsAndAnswers` | `faqs[]` | FAQ accordion + FAQPage schema + one Short per question |
| No competitor offers visualization | `local_pack.differentiator_gap` | **The headline angle** — the thing only you have |
| `ownerUpdates` cadence | Internal | GBP posting schedule |
| Grid position by village | `communities[].pack_position` | Prioritizes which community pages to push first |
| `peopleAlsoSearch` | `seo.organic_competitors` | Competitor gap analysis |

### The three highest-value outputs, ranked

1. **`differentiator_gap`.** If no Irvine competitor offers pre-paint color visualization,
   that is your entire headline strategy, validated by data rather than assumed.
2. **Review keyword gaps.** The tags the top 3 carry and you don't are a concrete,
   actionable review-acquisition plan — not "get more reviews," but *get reviews that say
   these specific things.*
3. **Competitor complaints.** Your competitors' unhappy customers wrote your problem/solution
   copy for you, in the exact language Irvine homeowners use.

---

## WHAT THE COPYWRITER RECEIVES

The Sales Page Agent has its headline formulas. This blueprint's job is to fill their variables
with real data instead of assumptions:

- **Headline** ← `differentiator_gap` (what only you offer)
- **Subheadline** ← the top review-praise theme in the market
- **Answer capsule** ← highest-frequency `questionsAndAnswers` entry, answered directly
- **Problem/Solution** ← competitor complaints, one per card
- **FAQ** ← `questionsAndAnswers`, verbatim questions with your answers
- **Proof points** ← praise themes the top 3 earn, that you also deliver
- **Trust bar** ← review count target and rating

---

## RUN ORDER & CADENCE

1. Phase 1 → pull top 20 `placeId`s → paste into Phase 2 input
2. Phase 2 → the payload
3. Phase 3 → seven runs, compare orderings
4. Phase 4 → optional cross-check
5. Write findings into `briefs/irvine.json` → `city.local_pack` + `city.keywords.harvested_questions`
6. `node generator/validate-brief.js irvine`

**Re-scrape cadence: every 60–90 days.** Review counts and pack positions drift; the
`reviewsStartDate: "18 months"` window keeps each pull current without re-paying for
history you already have.

---

## COST CONTROL

The actor bills **per event**, not per run — so cost scales with what you enable:

- Places: $0.004 each · Detail page: +$0.002 · Each review: +$0.0005 · Each image: +$0.0005
- Each filter applied: +$0.001 per place — **filters are not free**, use them deliberately
- AI competitor analysis: $0.025 per competitor

**Do not** enable `maxImages`, `scrapeContacts`, `maximumLeadsEnrichmentRecords`, or
`scrapeSocialMediaProfiles` for this study. They are lead-generation features, not SEO
research, and leads enrichment is $0.10 per record on the free tier — it would cost more
than the entire rest of the study.

Set `callOptions.maxTotalChargeUsd` on every run as a hard ceiling.
