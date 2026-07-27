# MARCUS MEMORY — what we've learned

Loaded into every Marcus run. **Keep it short and high-signal.** This is not a log; it is the
distilled set of things that change how the next cluster gets researched.

**Promotion rule:** new findings go to *Candidate*. When a finding holds in a **second**
city, promote it to *Confirmed*. When ranking data contradicts a finding, move it to
*Retired* with the evidence — do not silently delete, or we will re-learn the same mistake.

---

## CONFIRMED — verified in 2+ markets, act on these

### M-01 · The review bar is ~60 — and VIP is at 9
The #1-ranked painter in Anaheim has **55 reviews**. Irvine's top local painter has **57**
(excluding College Works, a national student franchise, at 172). Median is 20–30.
**VIP has 9 reviews, and they were earned in Fontana** (~40 miles from Anaheim, ~50 from Irvine).
*Evidence: Apify datasets `pw6djQiOl1uh6hDsq`, `Jd1VPtysGNBzUztT1`, 2026-07-27; Fabian 2026-07-27.*
→ The review gap is VIP's single biggest competitive deficit — roughly 50 behind the leaders
in both markets. Review acquisition is not a nice-to-have, it is **the** priority.
→ The target is ~60, not hundreds. At 4–5/month that is a 12-month climb; at 8–10/month, 6.
→ **Fontana origin matters:** reviews earned at a former location. Confirm the GBP is now
verified at the Anaheim base — a profile still pinned to Fontana cannot rank in either market.

### M-02 · Nobody in OC competes on color confidence
Across ~50 painters in two cities, **zero** carry a review tag about visualization, color
consultation, or seeing the result beforehand. Every tag is price, speed, tidiness, or
professionalism. CertaPro *claims* visualization but shows no tool.
*Evidence: reviewsTags across both datasets; certapro.com/oc/house-painters-irvine.*
→ This is the uncontested position. Every headline should ladder to it.

### M-03 · Nobody builds community-level pages
CertaPro lists 30 cities and zero neighborhoods. Universal Coat runs 2 services × 20 cities.
Stubbins does service × region. **Not one competitor has a neighborhood page.**
→ VIP's six community pages have almost no direct competition. Go deeper, not wider.

### M-04 · Directories own half of page one
Yelp, Thumbtack, Houzz, HomeAdvisor take 4–5 of 8 organic slots in both cities. Only **3–4
real painting companies** rank per city.
→ The competitive set is far thinner than it looks. Do not be intimidated by result counts.

---

## CANDIDATE — seen once, watch for confirmation

### C-01 · An Anaheim HQ does not block Irvine organic rankings
CertaPro ranks #1–2 organically for Irvine from 2905 E. Miraloma Ave, Anaheim.
→ Direct proof of the two-track model. Confirm by watching whether VIP's Irvine pages rank.

### C-02 · 80% of competitors never post to GBP
Only 5 of 25 Anaheim businesses post owner updates.
→ Weekly posts are a cheap, uncontested engagement signal. Confirm in Newport.

### C-03 · Cost content is the highest-intent gap
Stubbins ranks with "how much does it cost to paint a house" pages. CertaPro publishes no
pricing at all ("Less than you might expect!").
→ VIP's itemized transparency may be its strongest organic wedge.

### C-05 · Community-term SERPs are near-empty — Google is grasping
Baseline for "orchard hills house painters" (geo: Irvine, 2026-07-27): position 1 is CertaPro's
generic *Irvine city* page. Positions 3-5 are painters in **Michigan and Connecticut** named
"Orchard." Position 6 is Bakersfield. Position 10 is a YouTube video about **Denver**.
→ Google has almost nothing genuinely relevant for community terms and is filling the page
with wrong-state matches. This is stronger than "low competition" — the SERP is *starved*.
A real Orchard Hills page should rank quickly once indexed. **This is the thesis to watch.**

### C-04 · City-specific blog guides are cheap and effective
Universal Coat runs `/blog/irvine-exterior-painting-guide`, `/blog/anaheim-house-painting-guide`.
VIP has no blog at all.

---

## METHOD LEARNINGS — how to research, not what we found

- **Firecrawl is blocked on Reddit.** Use an Apify Reddit actor. Reddit threads rank page-one
  for Irvine and are the richest question source we've found.
- **Semrush returns zero volume for community terms.** Measurement floor, not absent demand.
  Never kill a community page on Semrush data. Pull the city long-tail and modify by name.
- **`scrapePlaceDetailPage: true` is the whole game** on Apify Maps. Without it there is no
  `reviewsTags`, no Q&A, no `peopleAlsoSearch`.
- **`reviewsTags` doesn't appear for every business** — it needs enough reviews. Expect gaps.
- **GBP Q&A is a thin question source for painters.** Most volume on the Irvine profiles was
  College Works' student-recruiting funnel. Reddit and social are richer.
- **Firecrawl `search` takes a `location` param.** Always use it — non-localized SERPs are
  misleading for local work.
- **Apify datasets are persistent.** Record IDs in `meta.sources` and re-mine free.
- **Pull Apify results with `fields=`.** A full 25-place dataset with reviews is ~630KB and
  will blow the context window.

---

## OPEN QUESTIONS — need Fabian, block on these if they matter

1. ~~Is the 120-review claim real?~~ **ANSWERED 2026-07-27: NO.** VIP has 9 Google reviews,
   earned in Fontana. The schema claimed 5.0 from 120 — removed from the OC page same day.
   **Still open:** are the three on-page testimonials (Linda Quarry, Carol Brown, Tony
   Minardi) real Google reviews? They carry a Google badge. And is "120+ Projects Done" a
   true project count? Both are unaudited claims still live.
2. **Is VIP EPA Lead Certified?** CertaPro displays it; we don't. Matters on pre-1978 homes.
3. **Can the warranty go to 2 years?** CertaPro advertises 2; VIP advertises 1. A shopper
   comparing pages sees a worse number next to our name.

---

## RETIRED — findings that ranking data disproved

*(none yet — add here rather than deleting, with the evidence that killed it)*
