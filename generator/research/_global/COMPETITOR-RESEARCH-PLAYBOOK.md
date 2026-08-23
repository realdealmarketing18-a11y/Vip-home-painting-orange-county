# COMPETITOR RESEARCH — how we actually do it

Best practices, city-agnostic. This is the **method**; the two deep references are:

| Doc | Covers |
|---|---|
| `RESEARCH-BLUEPRINT.md` | The Apify Maps scrape phase by phase, field by field, with the signal → copy-slot map |
| `TOOLS.md` | Per-tool verdicts, what is proven, what is blocked, the free-only standing decision |
| `MEMORY.md` | The findings (`M-xx`) and failures (`F-xx`) every rule below came from |

Written after Irvine and Anaheim. Every rule here cost something to learn.

---

## THE GOVERNING TEST

**A step earns its place by changing a decision, not by returning data.**

Most competitor research produces a slide of competitor names and changes nothing. Before
running anything, write down which decision the output could change. If you can't name one,
skip the step — you are collecting, not researching.

Two runs, about $0.10 each, rewrote this entire strategy (M-05 killed link-buying, M-06
created the blog track). A keyword subscription changed nothing.

---

## THE FIVE QUESTIONS

Competitor research answers these, in this order. Each has a *done* condition.

### 1 · Who is actually in the set?
**Done when:** the roster is filtered and every entry is verified as a real competitor.

> **The rule that matters most here: a scrape is a candidate list, not a competitor set.**
> In the Anaheim pull, **11 of 25 results were not painters** (M-08) — handymen, general
> contractors, a flooring company. Filter *before* you compute anything.

Skip this and every downstream number is wrong. The review bar, the rating average, the
category consensus — all of it inherits the contamination silently, and it looks fine.

### 2 · What does it take to be credible?
**Done when:** you have the median and top-3 review counts, written into
`local_pack.review_count_to_compete`.

The bar in our markets came back **~55**, not the hundreds we had assumed (M-01). That single
number turned "we can never compete on reviews" into a closeable gap with a date on it.
**Measure the bar before deciding it's out of reach.**

### 3 · What does nobody offer?
**Done when:** you can name a gap and show the count behind it.

Across **~50 painters** in Irvine and Anaheim, **zero** carried a single review tag about
colour visualization (M-02). That is the differentiator every page now leads with — and it is
a *measured* claim, not a positioning workshop.

This is the highest-value output of the whole study. Look for it deliberately: read the
category lists and `reviewsTags` of the top 10 and ask what is absent from all of them.

### 4 · Where is the SERP starved?
**Done when:** you have looked at the actual results page for your long-tail terms.

Baseline for a community term returned painters in **Michigan, Connecticut, Bakersfield**, and
a YouTube video about **Denver** (C-05). Google had nothing relevant to serve. That is not a
low-competition keyword — that is an empty shelf.

> **Never kill a page on zero-volume data.** Community terms return zero from every keyword
> tool tested. That is a *measurement floor* — clickstream panels don't resolve that low —
> **not absent demand.** This is the single most expensive mistake available with these tools.

### 5 · What gets cited by AI, and by which engine?
**Done when:** you have per-engine citation share, not an "AI visibility" average.
See the AI SEO section below.

---

## ORDER OF OPERATIONS

Cheap and broad first, deep on the few, then geography, then AI. **Never start deep** — you
don't yet know who deserves the spend.

```
1  Discovery scrape      broad, no detail pages     ~$1     → the roster + the bar
2  FILTER                                            free   → drop the non-competitors (M-08)
3  Deep profile          top ~20, detail pages on   ~$1.7   → the gap, the language, the Q&A
4  Geo-grid              one run per community      ~$0.6   → who owns which neighbourhood
5  Authority + AI        one actor, per city        ~$0.1   → M-05 and M-06 came from here
6  SERP eyeball          Firecrawl, location set    free    → is the shelf empty?
```

**Whole study: about $4.** Cost is not the constraint — sequencing is.

---

## APIFY PRACTICE

### `compass/crawler-google-places` — the competitive picture

**`scrapePlaceDetailPage: true` is not optional.** Without it you get names and star ratings.
With it you get `reviewsTags`, `questionsAndAnswers`, `ownerUpdates`, `peopleAlsoSearch` — the
fields that actually carry findings. Both M-01 and M-02 came from this flag.

**`reviewsTags` is the single most valuable field in the scrape.** It is Google's own keyword
clustering of a business's reviews, and it is what powers the bolded justifications in pack
results. Tags the top 3 carry that you don't are a concrete review-acquisition plan — not
"get more reviews" but *get reviews that mention these specific things.*

Traps, each of which has bitten:

- **`customGeolocation` is `[longitude, latitude]`** — reversed from how you write coordinates
  everywhere else. Getting it backwards silently scrapes the wrong hemisphere and returns
  plausible-looking nonsense.
- **`reviewsStartDate: "18 months"`.** Older reviews describe a business that may not exist
  any more, and recency is itself a ranking signal worth measuring separately.
- **`scrapeReviewsPersonalData: false`.** You need review *text*, not reviewer identities.
  Don't collect names and photo URLs you have no use for.
- **Never enable leads, contacts, or social enrichment.** $0.10 per record — more than the
  entire rest of the study. They are lead-gen features wearing a research costume.
- **Filters are not free** — +$0.001 per place each. Apply them deliberately.
- **Set `callOptions.maxTotalChargeUsd` on every run.** The actor bills per event, so a
  mis-set parameter is a cost event, not an error message.

**Reuse before you re-pay.** Anaheim is already scraped: dataset **`pw6djQiOl1uh6hDsq`**.
Check for an existing dataset before every run. Re-scrape cadence is **60–90 days**.

Configs live in `apify-gmaps-configs.json`.

### `pro100chok/ahrefs-seo-tools` — authority and AI citations

About **$0.10 per city**, and it settled two strategy questions:

- **`website_authority` → M-05.** Universal Coat ranks #3 in Anaheim at **DR 0.2**. VIP at
  DR 0 is level with page-one businesses, not behind them. **This killed link-buying as a
  line item.** Always check the authority of who is *actually ranking* before assuming you
  need to catch up — the answer is often that there is nothing to catch.
- **`ai_visibility` → M-06.** The finding that created the blog track. Details below.
- **`keyword_metrics` returns empty.** Don't build on it.

### Choosing an actor

Prefer one that returns **Google's own derived data** — `reviewsTags`, `peopleAlsoSearch`,
`questionsAndAnswers` — over one that returns raw text you have to interpret. Google has
already done the clustering, and its clustering is what ranks.

---

## THE AI SEO HALF

Traditional and AI research are not the same study, and the AI half is where the fast wins are.

**Measure per engine, never in aggregate.** "AI visibility: 47" is not actionable. The split
that mattered (M-06):

| Engine | Share of citations | So what |
|---|---|---|
| **Copilot** | **50%** | Runs on **Bing**. Bing Webmaster Tools and Bing Places outrank every ChatGPT tactic available. |
| **Google AI Mode** | **36%** | Follows organic — the pages already built serve it. |
| ChatGPT | the remainder | The one everybody optimises for, and the smallest slice here. |

**Citations concentrate in editorial, not sales pages.** CertaPro has **313 AI citations**;
**one blog post earns 55 of them** while their *hundreds* of landing pages earn nothing.

That is why the **article page type** exists and why the blog track runs in parallel. If the
goal is citation, a landing page is the wrong instrument no matter how well optimised.

**Three practices that follow from it:**

1. **Answer capsules must name the company.** They get quoted out of context — a capsule
   that says "we" is a citation for nobody.
2. **Structure for extraction:** one question per heading, the answer immediately under it,
   FAQPage schema matching the visible text exactly. Our gate checks that parity because
   a mismatch is worse than no schema.
3. **Check the citing engine's index, not just Google's.** A page Bing hasn't crawled cannot
   be cited by half the market.

---

## WHERE REVIEWS ARE THE WRONG SOURCE

Google reviews are written by **the 3% who already bought** (M-07). They are excellent for:

- **Barriers** — what nearly stopped a buyer who went ahead anyway
- **Praise themes** — your proof points, in customer language
- **Competitor complaints** — the problem/solution matrix, written by their unhappy customers

They are useless for the **97% who are still stalling**, and that is who the copy targets.
For their language, go to sources where people who *haven't* bought talk:

```bash
curl "https://suggestqueries.google.com/complete/search?client=firefox&q=SEED"
curl "https://api.bing.com/osjson.aspx?query=SEED"
```

Free, no account, real phrases. Returns things like *"why does my paint colour look different
on the wall"* — a fear, stated plainly, that appears in no review anywhere. Seed phrasing
matters: too-specific seeds return empty, and empty is the floor again, not absence.

That material feeds `HALO-WORKSHEET.md` → `research/{city}/07-VOICE.md`, and both copywriters
pull headlines from the language bank instead of inventing them.

---

## WHAT "DONE" LOOKS LIKE

Research is finished when the brief fields are filled and the input gate is green:

```bash
node generator/validate-brief.js {city}
```

The fields this study exists to fill — full map in `RESEARCH-BLUEPRINT.md`:

`local_pack.review_count_to_compete` · `local_pack.category_consensus` ·
`local_pack.review_keyword_gaps` · `local_pack.differentiator_gap` ·
`communities[].problems[]` · `city.faqs` · `seo.organic_competitors`

**Write every finding into `MEMORY.md`** with its ID, and follow the promotion rule: a finding
is *Candidate* until it holds in a **second city**. When ranking data contradicts one, move it
to *Retired* with the evidence — never delete it, or the same wrong conclusion gets re-derived.

---

## THE MISTAKES, RANKED BY WHAT THEY COST

1. **Trusting an unfiltered scrape.** 11 of 25 weren't painters (M-08). Everything computed
   downstream was wrong and looked right.
2. **Killing a page on zero volume.** The tools' floor, not the market's demand (C-05).
3. **Starting with the deep, expensive scrape** before knowing who is worth profiling.
4. **Optimising for ChatGPT** because it is the famous one, when Copilot is half the citations
   and runs on an index you may not have submitted to (M-06).
5. **Mining reviews for fears.** Wrong population — they already bought (M-07).
6. **Assuming an authority gap.** Check DR of who actually ranks first; here there was none
   to close (M-05).
7. **Re-scraping a city you already have.** Check for the dataset first.
