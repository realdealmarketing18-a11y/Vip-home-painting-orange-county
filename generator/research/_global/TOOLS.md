# TOOLS — what is proven, what is not, and how a new one earns a place

Single source on research tooling. `MARCUS.md` and the skill point here.
**Update this the same day a tool proves or fails.**

Last revised **2026-07-31**.

---

## STANDING DECISION — free tools only (2026-07-31)

Fabian's call. No paid SEO subscriptions.

This costs us less than it sounds. Every finding that ever changed the plan came from
Firecrawl, Apify Maps, or a $0.10 Apify actor run — **not one came from a keyword
subscription.** And the one thing a paid tool would have bought us, community-term volume,
comes back zero from all of them anyway.

**The free tools that would move us furthest are not connected yet:** Google Search Console
and Bing Webmaster Tools. See "The real gap" below.

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

### Google & Bing autocomplete — free, and underrated
Real phrases real people type, straight from the source, no account needed.

```bash
curl "https://suggestqueries.google.com/complete/search?client=firefox&q=SEED"
curl "https://api.bing.com/osjson.aspx?query=SEED"
```

*Tested 2026-07-31 — returns lines like "why does my paint color look different on the
wall".* Seed phrasing matters: too-specific seeds return empty, which is the floor again,
not absence. Primary verbatim source for the Halo worksheet.

---

## TIER 2 — USEFUL, NOT LOAD-BEARING

### DataForSEO — the replacement, pending auth
**Connected 2026-07-31. Returns HTTP 403 on every endpoint** — tested across Keyword Data,
Labs and AI Optimization, so it is account-level, not a bad parameter. Either the OAuth
prompt was not approved or the account has no balance.

**Pay-as-you-go, ~$0.01/task + $0.0001/row** — cents per run, not a subscription, which is
why it survives the free-only decision. It is still real money per call: no unattended
loops without a ceiling.

This replaces both Ahrefs and Semrush the moment it authenticates. A five-prompt report
pack is already written and VIP-specific in **`prompts/`** — competitors, cities and open
questions filled in. **Run `prompts/02-keyword-research.md` first**: it is built to settle
the community-term question, and whatever it returns goes in `MEMORY.md`.

### Superseded
- **Semrush** — MCP disconnected. Never changed a decision here.
- **Ahrefs MCP** — connected then dropped; every paid endpoint needed a **$129/mo Lite
  plan**. Declined. See `TOOL-EVAL-AHREFS-MCP.md`. The **Apify Ahrefs actor** (Tier 1
  above) is unaffected and still works.

### The rule that outlives all of them
Community terms return **zero volume** from every keyword tool tested so far. That is a
measurement floor — clickstream panels do not resolve below a threshold — **not absent
demand**. Firecrawl proved the demand by showing those SERPs are *starved* (C-05).

**Never kill a community page on zero-volume data.** The single most expensive mistake
available with any of these tools.

### WebSearch / WebFetch
Fallback only, for when Firecrawl is blocked. **Not location-aware**, so never trust it
for anything geo-specific. Fine for reading a named document.

---

## THE REAL GAP — and why the free answer beats the paid one

**No keyword tool reports usable data at the level we operate.** Ahrefs and Semrush both
estimate from clickstream and both return zero for community terms. We build pages for
"orchard hills house painters" and have no demand data for the exact terms the strategy
rests on.

**Standing decision (2026-07-31): free tools only.** Paying $129/mo for Ahrefs Lite would,
on the evidence, buy us the same zero.

### The free tools that actually close it — and are not set up yet

| Tool | Cost | Why it beats a keyword tool | Status |
|---|---|---|---|
| **Google Search Console** | free | Reports **actual impressions for actual queries**, including the long tail below every tool's floor. The only thing that can measure a community term at all | ⬜ **not connected** |
| **Bing Webmaster Tools** | free | Copilot is **50% of AI citations** and runs on Bing (M-06). Cheapest unclaimed win we have | ⬜ **not connected** |
| **Google Business Profile** | free | Maps ranking, review engine, insights | ⚠️ pinned to Fontana |

MEMORY.md already states the rule: **judge community pages on Search Console impressions,
never on a keyword tool.** We just have not turned it on. That is the gap — not Ahrefs.

Both need domain verification. Once the site moves to viphomepainting.com that has to be
redone, so it is worth deciding the domain question first.

### Acceptance test for any new research tool

Do not adopt on a feature list. Run this, then write it up:

1. **The community-term test.** Query `orchard hills house painters` and
   `anaheim hills house painters`. Real number, modelled estimate, or zero? Zero means
   another clickstream panel — Tier 2, say so plainly.
2. **The geo test.** A SERP as seen *from* Anaheim, or a national one? A national SERP is
   the wrong answer to every question we ask.
3. **The AI-citation test.** Copilot and Google AI Mode specifically. ChatGPT-only
   visibility measures 6% of the problem.
4. **The decision test.** After one real city, write down what it changed. Nothing changed
   means Tier 2, however good the interface.
5. **The free test.** Standing rule now: is there a free tool that answers the same
   question? For keyword demand there is, and it is Search Console.

Write the result as `TOOL-EVAL-{NAME}.md`, add a row here, note it in `MEMORY.md`.
**A tool with no written evaluation does not get used in the pipeline.**

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
