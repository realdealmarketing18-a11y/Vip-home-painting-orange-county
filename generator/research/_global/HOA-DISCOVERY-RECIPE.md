# HOA DISCOVERY RECIPE

How Marcus finds association names and management companies in any city.
**Tool: Firecrawl.** (Apify Google Maps is the wrong tool — HOAs aren't local-pack businesses
for painting queries and the scraper returns nothing useful.)

Run this for **every city cluster**, right after the local-pack scrape.

---

## STEP 1 — The city's official HOA lookup (always try first)

Many California cities publish a government registry mapping parcels to **HOA name and
management company**. This is a primary source and outranks everything below.

```
firecrawl_search
  query:    "{city} homeowners associations official lookup site:gov"
  location: "{city}, California, United States"
```

Known: Irvine → `cityofirvine.gov/community-development/irvine-homeowners-associations`

If the city has one, use it as the spine and treat everything else as corroboration.
If nothing exists, note that in `meta.gaps` and continue.

---

## STEP 2 — Name the communities in the query ← the trick that works

Do **not** search "{city} HOA management companies." That returns directory spam.

**Put the actual community names in the query.** Management companies publish press releases
announcing every account they win, and those releases name several associations at once.

```
firecrawl_search
  query:    "{city} CA HOA management companies village community associations
             {community1} {community2} {community3} {community4}"
  location: "{city}, California, United States"
  limit:    8
```

This is what surfaced Keystone Pacific managing Woodbury, Groves at Orchard Hills, Orchard
Hills Village II, Portola Springs, and Stonegate — **four target villages from one result.**

---

## STEP 3 — Sweep the remainder

Any community without a management company after step 2 gets a targeted pass:

```
firecrawl_search
  query:    "{community} Community Association {city} HOA management company"
  location: "{city}, California, United States"
```

Watch for communities that run their **own** site (`portolasprings.org`,
`livinghiddencanyon.com`) — those name the manager directly and often list the board.

---

## STEP 4 — Profile the management company

```
firecrawl_map    url: "{manager}.com"          → find /communities, /vendors, /news
firecrawl_scrape url: "{manager}.com/vendors"  → the vendor onboarding path (business development gold)
```

Their newsroom or press page is usually the densest list of associations they manage.

---

## WHAT TO CAPTURE

| Field | Why |
|---|---|
| Association legal name | Exact name for the page; boards search their own name |
| Management company + phone | The actual gatekeeper — one relationship, many communities |
| Unit count | Sizes the contract (Woodbury: 4,067) |
| Amenities | The literal common-area scope to quote |
| Dues range | Signals maintenance budget |
| Gate type | 24-hour guard vs. card gate changes the site protocol |
| Vendor portal | The direct business-development path |
| **Source URL for every claim** | Contract forbids inventing HOA rules |

---

## TWO TRAPS

**Similarly-named associations.** Irvine has "Stonegate Village Owners Association" (a
2000s-era Irvine village) *and* "Stonegate Homeowners Association, Inc." (126 units,
registered 1973). Different entities. Confusing them puts false information on a page.
Always check unit count and registration year when a name looks generic.

**One community ≠ one HOA.** Orchard Hills has **three** separate associations — The Groves,
The Reserve, The Summit — each with its own board, gate, and dues tier. Never assume a single
association per community; check before writing "your community association" as if singular.

---

## COST

Roughly **6–10 Firecrawl credits per city** (2 per search, 5 per scrape). Negligible against
the value: one management-company relationship can reach thousands of units.
