# Google Maps Intel — Anaheim & Irvine · July 2026

Apify `compass/crawler-google-places`, 25 places per city, detail pages on, 100 reviews each
(18-month window). Cost ~$2.86.

**Persistent datasets — re-pull anytime, no re-scrape cost:**
- Anaheim: `pw6djQiOl1uh6hDsq`
- Irvine: `Jd1VPtysGNBzUztT1`

---

## 🚨 THE HEADLINE: THE BAR IS FAR LOWER THAN ANYONE ASSUMES

### Anaheim — actual painting companies

| Business | Rating | **Reviews** | Photos |
|---|---|---|---|
| **Superior Painting** ← ranked #1 | 5.0 | **55** | 53 |
| Horacio Guillermo Castellani | 5.0 | 53 | 126 |
| Luis Custom Painting | 5.0 | 44 | 149 |
| P.D.J Painting | 5.0 | 32 | 13 |
| Universal Painting & Coatings | 5.0 | 27 | 74 |
| Joe's Anaheim Painters | 5.0 | 16 | 25 |
| Sharp Painting | 5.0 | 15 | 35 |
| Oswald Finish Paint | 5.0 | 13 | 86 |
| Anaheim House Painters | 4.6 | 9 | 1 |
| A1 Painting Concepts | 5.0 | 4 | 2 |

### Irvine — actual painting companies

| Business | Rating | **Reviews** | Photos |
|---|---|---|---|
| College Works Painting* | 4.7 | 172 | 56 |
| Ron Romero & Son | 4.6 | 57 | 622 |
| OC Integrity Painting | 5.0 | 53 | 12 |
| Ultimate Home Painters | 4.8 | 51 | 128 |
| Right Choice Painting | 4.9 | 29 | 119 |
| The Painting Guys | 4.9 | 29 | 21 |
| Xenak Painting | 5.0 | 21 | 33 |
| Prime Plus Painters | 5.0 | 18 | 16 |
| Karma House Painting | 5.0 | 13 | 86 |
| L & J Pro Painters | 5.0 | 12 | 72 |

\* national student-run franchise, not a local competitor

### What this means

**The #1-ranked painter in Anaheim has 55 reviews.** In Irvine, excluding the national
franchise, the top local painter has 57. **The median is roughly 20–30 reviews.**

This is not a market where you need hundreds of reviews. **Sixty genuine five-star reviews
would put VIP at or above the top of both cities.**

> ⚠️ **Urgent open question.** The OC sales page's schema claims `aggregateRating` of
> **5.0 from 120 reviews**. If that is real and visible on the Google Business Profile, VIP
> already out-reviews every painter in both markets and is simply not leveraging it. If it
> is not backed by real reviews, it is a schema liability that should come off the page
> today. **This single fact changes the entire strategy — verify it first.**

Note: only ~14 of 25 Anaheim results and ~19 of 25 Irvine results are actually painting
companies. The rest are flooring, fencing, windows, and kitchen remodelers that Google
loosely matched. **Real competition is thinner still.**

---

## CATEGORY CONSENSUS

Overwhelmingly **`Painter`**, with a minority on `Painting`.

**Action:** GBP primary category = **Painter**. Secondary = Painting contractor.
Anything else dilutes relevance.

---

## REVIEW KEYWORD TAGS — the local-pack justification engine

These are Google's own extracted clusters from each business's reviews. They power the
bolded justification text in pack results. Recurring themes across Anaheim painters:

| Theme | Appears as |
|---|---|
| **Pricing** | "reasonable pricing" (13), "competitive pricing" (5), "fair pricing" (6), "affordability" |
| **Professionalism** | "professional team" (18), "professional crew" (7), "professional work" (7) |
| **Detail** | "attention to detail" (13, 7, 4), "meticulousness", "thoroughness" |
| **Cleanliness** | "clean paint job", "tidy", "cleanliness", "clean work environment" |
| **Speed** | "quick work", "early completion", "on time", "punctuality" |
| **Communication** | "communication" (4), "responsive owner", "quick reply" |
| **Services** | "stucco repair" (4), "cabinet painting/refinishing", "wood repair", "trim painting", "popcorn ceiling removal", "crown molding" |
| **Trust** | "trustworthy", "written contract", "detailed quote", "going above and beyond" |

### The gap that matters most

**Not one painter in either city carries a review tag about color visualization,
color consultation, or seeing the result beforehand.** The tags are entirely about
price, speed, tidiness, and professionalism — table stakes.

Nobody in this market competes on *helping you choose the color*. That is VIP's
uncontested position, now confirmed by data rather than assumed.

### Review-request script (the actionable output)

Coach every client to mention, naturally: **the community or city**, **the service**, and
**the visualization**. Example: *"They painted our Orchard Hills exterior and showed us the
color on our actual house before starting."* That one sentence seeds three ranking-relevant
tag clusters, including one no competitor has.

---

## GBP POSTING — an open goal

**Only 5 of 25 businesses (20%) post owner updates at all.**

Four out of five competitors never post. Weekly Google Posts — visualization before/afters,
color-of-the-month, project spotlights — put VIP in the top fifth of the market on an
engagement signal almost nobody is contesting. Cost: minutes per week.

---

## PHOTOS

Painters range from **1 photo** (Anaheim House Painters) to **622** (Ron Romero). Median for
real painters is ~30–90. The businesses with 600+ are fence and plaster contractors.

**Target: 80–120 quality photos**, weighted toward before/after pairs — which doubles as
visualization-service proof.

---

## CUSTOMER QUESTIONS (36 harvested from Irvine profiles)

Most Q&A volume belongs to College Works Painting's recruiting funnel (student-program
questions — ignore). The genuinely useful homeowner questions:

- *"How do you ensure a high-quality finish on my cabinets?"*
- *"Is cabinet refinishing a cost-effective way to update my kitchen?"*
- *"Do you repaint the ceilings?"*
- *"How do your prices compare to other contractors?"*
- *"Why should I not hire a 'professional' painter or someone who has been painting longer?"*
- *"What's your policy for unhappy customers and negative reviews?"*

**Note:** thin harvest. Painter GBP profiles simply don't accumulate many questions. The
richer question source is the two r/orangecounty threads ranking page-one for Irvine —
Firecrawl is blocked on Reddit, so that needs an Apify Reddit actor.

---

## WHAT GOES INTO THE BRIEF

```
local_pack.review_count_to_compete   = 60          (both cities)
local_pack.category_consensus        = ["Painter", "Painting contractor"]
local_pack.differentiator_gap        = "No painter in either market carries a
                                        review tag about color visualization or
                                        pre-paint color confidence."
local_pack.photo_target              = 100
local_pack.gbp_posting_gap           = "80% of competitors never post"
```

---

## NEXT ACTIONS

1. **Verify the 120-review claim.** Highest priority — it changes everything.
2. Set GBP primary category to **Painter**.
3. Start the review engine — 60 is the number, and the script above is the method.
4. Weekly Google Posts (80% of competitors don't).
5. Get the Reddit threads via an Apify Reddit actor for a real question corpus.
6. Mine the two datasets for review *text* — the complaint/praise language for
   problem-solution copy. Datasets are persistent; no re-scrape needed.
