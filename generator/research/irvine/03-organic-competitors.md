# Competitor Intel — Anaheim & Irvine · July 2026

Source: Firecrawl geo-located search + site map + page extraction. ~11 credits total.
Organic (blue-link) results only — Maps pack intel comes from the Apify runs.

---

## THE HEADLINE FINDING

**CertaPro Painters ranks #1–2 organically for Irvine while being headquartered in Anaheim.**

Their address, printed on every page: `2905 E. Miraloma Avenue, Suite 6, Anaheim, CA 92806`.

That is VIP's exact situation — an Anaheim base competing for Irvine business — and it is
already working for them in organic search. This is direct proof the two-track strategy is
sound: **you do not need an Irvine address to win Irvine's blue links.**

---

## WHO ACTUALLY RANKS

### Anaheim — "house painters Anaheim CA"

| # | Result | Type |
|---|---|---|
| 1 | certapro.com/oc/house-painters-anaheim-ca | **Company** |
| 2 | Yelp | Directory |
| 3 | universalcoat.com | **Company** |
| 4 | Thumbtack | Directory |
| 5 | onewaypainting.com/locations/anaheim-ca-painters | **Company** |
| 6 | Houzz | Directory |
| 7 | HomeAdvisor | Directory |
| 8 | anaheimhousepainters.com | **Company** (exact-match domain) |

### Irvine — "house painters Irvine CA"

| # | Result | Type |
|---|---|---|
| 1 | Yelp | Directory |
| 2 | certapro.com/oc/house-painters-irvine | **Company** |
| 3 | reddit.com/r/orangecounty — "Exterior House Painter Recommendations" | **Forum** |
| 4 | reddit.com/r/orangecounty — "Home interior painters" | **Forum** |
| 5 | supremapainting.com/house-painter-irvine-ca | **Company** |
| 6 | Houzz | Directory |
| 7 | stubbinspainting.com/painter-irvine | **Company** |
| 8 | Thumbtack | Directory |

### What this means

**Directories occupy half of page one in both cities.** Only 3–4 actual painting companies
rank per city. The real competition for organic slots is far thinner than it looks — you are
not fighting 50 painters, you are fighting three or four plus Yelp.

**Two Reddit threads rank page-one for Irvine.** Real homeowners asking for painter
recommendations, ranking in Google. That is both a competitor (it takes a slot) and a
research goldmine — it is exactly the "real questions in real words" data we wanted from
social scraping. Firecrawl cannot scrape Reddit (blocked); needs another route.

---

## CERTAPRO — THE ONE TO BEAT

The only company ranking in **both** cities, and the structural blueprint.

### Their URL architecture

```
/oc/house-painters                          ← hub
/oc/house-painters-irvine                   ← city page
/oc/house-painters-anaheim-ca               ← city page
/oc/house-painters-yorba-linda-ca           ← city page
/oc/house-painters-villa-park-ca            ← city page
/oc/best-painting-contractors-westminster   ← city page (inconsistent slug)
/oc/portfolio/exterior-house-painting-tustin-ca-3     ← per-city project pages
/oc/residential-painting/residential-case-studies/newport-beach-...
/oc/community/tips-for-painting-stucco-homes-in-yorba-linda   ← city+topic blog
/oc/community/irvine-ca-3-best-city-in-us-to-raise-a-family   ← local-interest blog
/oc/our-team/{name}                         ← individual team pages (E-E-A-T)
/oc/frequently-asked-questions
/oc/before-and-after/stucco-house-painters/
```

**This is the same play we built, one level shallower.** They stop at city. Nobody goes to
community level.

### What's on their Irvine page

- **H1:** "Professional House Painting in Irvine, CA"
- **Warranty:** 2 years — *longer than VIP's 1 year*
- **Certifications:** EPA Lead Certified
- **Pricing:** "Less than you might expect!" — no numbers at all
- **Color consultation:** yes · **Visualization:** yes (claimed)
- **FAQ:** only 3 generic questions ("How much will it cost?")
- **CTA:** "Schedule a time to meet with a CertaPro representative"
- **Communities named:** none. They list 30 *cities*, zero neighborhoods.
- Page last modified **March 2025** — over a year stale

---

## THE GAPS — WHERE VIP WINS

| Gap | Evidence | VIP's move |
|---|---|---|
| **No community-level pages** | CertaPro lists 30 cities, zero neighborhoods. No competitor has an Orchard Hills or Woodbury page. | Our six live community pages have almost no direct competition. This is the biggest opening. |
| **No real pricing** | "Less than you might expect!" | Our itemized $4.75/sqft-of-paintable-surface transparency is a genuine differentiator. |
| **Thin FAQs** | 3 generic questions | Our 3–6 community-specific FAQs per page win the question queries and AI citations. |
| **Stale content** | Irvine page unchanged since March 2025 | Freshness is a ranking factor. |
| **Generic CTA** | "Schedule a time to meet" | "See your home in every color before we paint" is dramatically stronger. |
| **Visualization claimed, not shown** | They say they offer it; there's no tool on the page | **Ours is interactive and on every page.** Claiming beats nothing; *demonstrating* beats claiming. |

### Where they beat us — fix these

1. **2-year warranty vs. our 1-year.** They advertise double. Either match it or explain
   plainly why 1 year with our prep spec is the better deal.
2. **EPA Lead Certified badge.** A real trust signal we don't display. If VIP holds it, put
   it on every page; it matters for pre-1978 homes.
3. **Team member pages.** Individual bios are an experience/authority signal we lack.
4. **A blog.** Their `/community/` section mixes topics with cities
   ("Tips for Painting Stucco Homes in Yorba Linda"). Cheap, effective, and we have none.

---

## NEXT ACTIONS

1. Map `universalcoat.com`, `supremapainting.com`, `stubbinspainting.com` — same treatment
2. Get the two Reddit threads via a non-Firecrawl route (Apify has Reddit actors)
3. Run the Apify Maps scrapes for pack data (organic ≠ pack; different competitors)
4. Write findings into `briefs/irvine.json` → `seo.organic_competitors` + `local_pack`
5. Decide on the warranty and EPA-certification questions — those need Fabian's input
