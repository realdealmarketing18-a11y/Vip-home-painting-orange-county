# THE WORKFLOW — every step, every tool, every command

**The single reference for how a city goes from nothing to eight live pages.**

This is a living document. When we find a better way, **update it here** — see
[Improving this system](#improving-this-system) at the bottom.

Last updated: 2026-07-30 · Irvine cluster live · Ahrefs actor evaluated (step 1d)

---

## AT A GLANCE

| Step | Who | Tools | Produces |
|---|---|---|---|
| 0 | scheduler | cron / Hermes | wakes an agent |
| 1 | **Marcus** | Firecrawl · Apify Maps · Apify Ahrefs · Semrush | the research half of the brief |
| 2 | gate | `validate-brief.js --stage research` | pass / refuse |
| 3 | **Vivienne** | `slots.js` (no web tools) | the copy half of the brief |
| 4 | gate | `validate-brief.js` | pass / refuse |
| 5 | **Seraphina** | `generate.js` · git | 8 live pages |
| 6 | audit | `auditOutput()` inside the build | fails the build on bad copy |
| 7 | **feedback** | Firecrawl · `rank-check.js` | memory rules for the next city |

---

## STEP 0 · THE SCHEDULE

| | |
|---|---|
| **Tool** | cron, Hermes, or any scheduler |
| **Command** | `node generator/pipeline.js next <agent>` |
| **Output** | the job, or `NOTHING TO DO` |

Staggered so each morning's research becomes that afternoon's copy:
**08:00 Marcus · 13:00 Vivienne · 16:00 Seraphina.**

If there's no work the agent exits immediately — no tokens, no credits.

---

## STEP 1 · MARCUS RESEARCHES

**Every external tool in the system lives in this step.** Everything is verified once, here,
so no later agent needs to look anything up.

### 1a · Firecrawl — ~40 credits per city

| What he runs | What comes back | Where it goes |
|---|---|---|
| `firecrawl_search` + `location` | Who ranks organically, as a local sees it | `seo.organic_competitors` |
| `firecrawl_map` on each rival | Their whole URL inventory, their gaps | `03-organic-competitors.md` |
| `firecrawl_scrape` + `jsonOptions` | Their headlines, pricing, FAQs | competitor weaknesses |
| HOA discovery recipe | Association names + management companies | `hoa.management_companies` |
| Real-estate listing scrapes | **Verified street names**, median values | `geography_delta.streets` |

⚠️ **Always pass `location`.** A non-localized SERP is misleading for local work.
⚠️ **Blocked on Reddit** — use an Apify Reddit actor instead.

### 1b · Apify — ~$1.43 per city

| Setting | Why it matters |
|---|---|
| `compass/crawler-google-places` | The Google Maps scraper |
| **`scrapePlaceDetailPage: true`** | **Without this you get nothing useful** — no reviewsTags, no Q&A |
| `maxReviews: 100`, `reviewsStartDate: "18 months"` | Recent language, not history |
| `scrapeReviewsPersonalData: false` | We need review text, not reviewer identities |
| `callOptions.maxTotalChargeUsd` | Hard spend ceiling, every run |

Extracts: competitor review counts, ratings, categories, photo counts, GBP posting cadence,
**review keyword tags** (what Google bolds under map results), and customer questions.

❌ Never enable leads/contacts/social enrichment — $0.10/record, more than the whole study.

### 1c · Semrush — city terms only

Search volume and difficulty. **Reads zero for village terms** — that's a measurement floor,
not absent demand. Never kill a community page on Semrush data.

### 1d · Apify Ahrefs actor — ~$0.10 per city

`pro100chok/ahrefs-seo-tools`, `searchType: "website_authority"` — competitor Domain Rating,
backlinks and referring domains. Established that DR is barely a ranking factor here
(see MEMORY M-05), which is why link building is not on the plan.

✅ `website_authority` works · ❌ `keyword_metrics` returns empty
🔬 Untested, promising: `ai_visibility`, `keyword_rank`, `serp_overview`

### Marcus's output

```
generator/briefs/{city}.json          the machine-readable half
generator/research/{city}/
  00-SUMMARY.md   ← Vivienne's entry point, written LAST
  01-market.md · 02-local-pack.md · 03-organic-competitors.md
  04-keywords.md · 05-communities.md · 06-hoa.md
  _raw/           dataset IDs, timestamps
```

---

## STEP 2 · THE RESEARCH GATE

```bash
node generator/validate-brief.js {city} --stage research
node generator/pipeline.js claim {city} researched
```

Checks streets are present, sources are cited, palettes are complete, module orders unique.
**Skips copy fields** — those aren't Marcus's job. `claim` refuses a failing gate.

---

## STEP 3 · VIVIENNE WRITES

**No web tools. Deliberately.** The facts are already verified; a writer with search access
fills gaps by inventing things.

| Tool | Purpose |
|---|---|
| `node generator/slots.js {city}` | **Run first.** Prints every page, its section order, and which slots are empty. |
| `HEADLINE-FORMULAS.md` | 6 hero + 5 HVCO formulas, tier selection matrix |
| `COPY-SLOTS.md` · `STORY-SLOTS.md` | Exact slot specs and character limits |
| `research/{city}/00-SUMMARY.md` | The positioning angles and real customer questions |

Writes: headline, meta title/description, answer capsule, visualizer lede, FAQs,
problem/solution pairs, module intros — for **all 8 pages**.

Writes to the **tier**: a $9.15M estate and a $1.82M home don't share a voice.

---

## STEP 4 · THE COPY GATE

```bash
node generator/validate-brief.js {city}
node generator/pipeline.js claim {city} copy_complete
```

Adds to the research checks: character limits, **cross-page uniqueness** (no shared sentence,
no repeated FAQ, no duplicate H1), banned words, NAP match, client-story truth.

---

## STEP 5 · SERAPHINA BUILDS

```bash
node generator/generate.js
```

| Reads | Writes |
|---|---|
| `cities.json` · `communities.json` | `{city}/index.html` |
| `page.css` · `city-page.css` · `hoa-page.css` · `film-player.css` | `{city}/{community}/index.html` |
| The OC page (visualizer extracted at build time) | `{city}/hoa-painting/index.html` |
| | `sitemap.xml` · `robots.txt` |

Then: interlink reconciliation across the whole cluster, **one commit**, push.
GitHub Pages deploys in ~60 seconds.

**Never hand-edit a generated page.** Data in, pages out.

---

## STEP 6 · THE OUTPUT AUDIT

Runs **inside** `generate.js` on every page as it's written. This is the gate the brief
validator cannot be: it scans the **rendered HTML**, which is the only thing a customer reads.

Fails the build on: `free` · `AI` · British `colour` · review or star claims ·
market-average pricing · any phone but (909) 312-5400.

> It caught "5-Star Rated" live on all six community pages on its first run.
> **Rule: validate the artifact, not the input that produced it.**

---

## STEP 7 · THE FEEDBACK LOOP

```bash
node generator/rank-check.js list      # geo-located queries to run
node generator/rank-check.js record '[...]'
node generator/rank-check.js report    # movement vs last check
```

Run Firecrawl on the printed queries, record positions, then write what you learned into
`research/_global/MEMORY.md`:

- **Part 1** — working preferences and corrections
- **Part 2** — market findings. A finding that holds in a **second city** is promoted from
  Candidate to Confirmed. One the ranking data contradicts is **Retired with the evidence**,
  never deleted.

Cadence: **~1 cluster every 2–3 days.**

---

## IMPROVING THIS SYSTEM

This workflow is not finished. When something better is found, change it here and note why.

### Known gaps, ranked

1. **Reddit questions are unreachable.** Two r/orangecounty threads rank page-one for Irvine
   and are the richest question source found. Firecrawl is blocked; needs an Apify Reddit actor.
2. **Semrush is out of credits.** No volume or difficulty data yet — though M-05 suggests
   volume is less decisive here than assumed.
2b. **`ai_visibility` untested.** The one endpoint that would measure whether VIP gets cited
   by ChatGPT or Perplexity. Nothing else we have does this.
3. **No real project totals.** Pricing ranges must come from job data, never computed.
4. **No blog.** Universal Coat runs city-specific guides; VIP has none.
5. **The films don't exist yet.** Every hero currently plays the same OC commercial.
6. **Aurora isn't active** — the media agent for renders and photography.

### How to change this workflow

- A new tool → add it to the right step's table, with what it extracts and where that lands
- A new page type → contract, module file, CSS, generator, validator, `slots.js`
- A new rule learned → `MEMORY.md`, and here if it changes the process
- A new gate → prefer auditing **output** over auditing input; that's where the misses were

**Whoever changes the workflow updates this file in the same commit.**
