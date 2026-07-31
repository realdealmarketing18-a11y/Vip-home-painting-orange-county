# TOOLS — what is proven, what is not, and how a new one earns a place

Single source on research tooling. `MARCUS.md` and the skill point here.
**Update this the same day a tool proves or fails.**

Last revised **2026-07-31**.

---

## THE TEST A TOOL HAS TO PASS

A tool earns a place by **changing a decision**, not by returning data.

Every tool below is rated on that alone. Two of them rewrote the strategy. One is
technically fine and has never changed anything, and it is rated accordingly.

---

## TIER 1 — LOAD-BEARING. Findings here changed the plan.

### Firecrawl — `search`, `map`, `scrape`
**Changed:** C-05. Community-term SERPs are *starved*, not merely uncompetitive. The
baseline for "orchard hills house painters" returned painters in **Michigan and
Connecticut**, one in Bakersfield, and a YouTube video about **Denver**. Google had
nothing relevant to serve.

That single result is why community pages are the whole strategy. No keyword tool
would have shown it — volume data says "zero" and stops. You had to look at the page.

- Always pass `location: "Anaheim, California, United States"`. Without it you see a
  generic SERP, which is not what a local buyer sees.
- `map` before `scrape` — one call reveals a competitor's whole URL architecture,
  which is how M-03 (no competitor has community pages) was established.
- **Blocked on Reddit.** Two r/orangecounty threads rank page-one and remain
  unreachable. Needs an Apify Reddit actor. Open gap.

### Apify — `compass/crawler-google-places`
**Changed:** M-01 and M-02. The review bar is ~55, not the hundreds we assumed — so the
gap is closeable. And across ~50 painters in Irvine and Anaheim, **zero** carry a single
review tag about color visualization. That is the uncontested angle every page now leads
with, and it came out of `reviewsTags`.

- **`scrapePlaceDetailPage: true` is not optional.** Without it there are no
  `reviewsTags`, no Q&A, no `ownerUpdates` — the fields that carry the finding.
- Never enable leads/contacts/social enrichment: $0.10/record, more than the whole study.
- `customGeolocation` is `[longitude, latitude]` — reversed from normal.
- Configs: `apify-gmaps-configs.json`. Anaheim is already scraped: dataset
  `pw6djQiOl1uh6hDsq` — use it before paying again.

### Apify — `pro100chok/ahrefs-seo-tools`
**Changed two decisions.**

`website_authority` → **M-05**: Universal Coat ranks #3 in Anaheim at **DR 0.2**. VIP at
DR 0 is level with page-one businesses, not behind them. **This killed link-buying as a
line item.** The gap is page count, not authority.

`ai_visibility` → **M-06**: CertaPro has 313 AI citations and a single blog post earns 55
of them while their hundreds of landing pages earn nothing. The engines that matter are
**Copilot 50%** and **Google AI Mode 36%** — not ChatGPT. Copilot runs on Bing, so Bing
Webmaster Tools outranks every ChatGPT tactic.

That finding created the entire blog track and the article page type.

- ~$0.10 per city. Cheap for what it settles.
- `keyword_metrics` returns empty. Do not build on it.
- Full evaluation: `TOOL-EVAL-AHREFS-ACTOR.md`.

---

## TIER 2 — USEFUL, NOT LOAD-BEARING

### Semrush
**Has never changed a decision here, and the reason is structural, not budgetary.**

Community terms return **zero volume**. That is a measurement floor — clickstream panels
do not resolve below a certain threshold — not absent demand. Firecrawl proved demand
exists at that level by showing the SERPs are starved.

So Semrush is usable for **city and service terms only**, and even there it has told us
nothing we acted on.

- **Never kill a community page on zero-volume data.** This is the single most expensive
  mistake available with this tool.
- Mine the city long-tail, then modify by community name.
- Credits come and go. Nothing in the pipeline may *depend* on it — the gate must pass
  without it, and it does.

### WebSearch / WebFetch
Fallback only, for when Firecrawl is blocked. **Not location-aware**, so never trust it
for anything geo-specific. Fine for reading a named document.

---

## THE REAL GAP — what to buy for

Read this before evaluating a new tool.

**No keyword tool we have tested reports usable data at the level we operate.** Ahrefs and
Semrush both estimate from clickstream and both return zero for community terms. We are
building pages for "orchard hills house painters" and flying blind on demand for exactly
the terms the strategy rests on.

We have worked around it — Firecrawl shows the SERP is starved, which is a stronger buy
signal than volume anyway. But it is a workaround.

### Acceptance test for a new research tool

Do not adopt on a feature list. Run this:

1. **The community-term test.** Query `orchard hills house painters` and
   `anaheim hills house painters`. Does it return a real number, a modelled estimate, or
   zero? If zero, it is another clickstream panel and it does not close the gap. Say so
   and keep it in Tier 2.
2. **The geo test.** Does it return a SERP as seen *from* Anaheim, or a national one?
   Non-negotiable — a national SERP is the wrong answer to every question we ask.
3. **The AI-citation test.** Can it show which pages get cited by Copilot and Google AI
   Mode specifically? ChatGPT-only visibility data is measuring 6% of the problem.
4. **The decision test.** After one real city, write down what it changed. If nothing, it
   is Tier 2 no matter how good the interface is.

**Then write the result up** as `TOOL-EVAL-{NAME}.md` next to
`TOOL-EVAL-AHREFS-ACTOR.md`, add a row here, and note it in `MEMORY.md`. A tool with no
written evaluation does not get used in the pipeline.

### Worth checking Irvine against, once a better tool is connected

The Irvine brief was built under the constraints above. Re-run these and see whether the
answer changes:

- Do community terms show real volume, or confirm the floor?
- Was the ~$2.74–$4.89 Irvine price range right? It rests on one source.
- Does the review bar still read ~55–60 in Irvine and Anaheim?
- Has any competitor added community-level pages since 2026-07-27?
- Is VIP showing any AI citations yet? Baseline was zero.

---

## WHAT NO TOOL WILL TELL US

The most valuable missing data is VIP's own, and it is not for sale:

- **Real project totals** by city and tier. Pricing ranges must come from job data, never
  computed from the rate. Every page currently leaves the slot out rather than guess.
- **Which leads actually closed**, and from which page.
- **The real Google rating** — a directory shows 4.6, the site claimed 5.

No amount of tooling substitutes. These come from Fabian.
