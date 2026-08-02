# DataForSEO report pack — VIP Home Painting

Five prompts that do the work we would otherwise pay Ahrefs or Semrush a subscription for.
Each returns a designed HTML report, not a wall of text. Adapted from the Opus 5 SEO Report
Pack with VIP's domains, competitors, cities and open questions already filled in — no
`[SQUARE BRACKETS]` left to replace.

---

## ⚠️ STATUS 2026-07-31 — connected, returning 403

The connector is registered but **every endpoint returns HTTP 403**. Tested across three
different families — Keyword Data, Labs, and AI Optimization — so it is account-level, not
a bad parameter.

**Almost certainly one of two things:**
1. The OAuth prompt was never approved. Re-add it: Claude desktop →
   Customize → Connectors → Add custom connector → `https://mcp.dataforseo.com/mcp`
   → **approve the OAuth prompt.**
2. The DataForSEO account has no funds. It is pay-as-you-go and needs a balance.

**Nothing in this pack works until that clears.** Re-run the check below before trusting
any output.

```
Ask Claude: "Using DataForSEO, get Google Ads search volume for
'irvine house painters' in United States, English."
```
A number means it is live. A 403 means it is not.

---

## COST — this is not free, but it is cents

Roughly **$0.01 per task plus $0.0001 per row**. Running the whole pack costs cents, not a
subscription. That is consistent with the standing "no paid subscriptions" decision, but it
**is** real money per call — do not loop these unattended without a spend ceiling.

---

## RUN ORDER

| # | Prompt | What it settles | Run when |
|---|---|---|---|
| **2** | [Keyword Research](02-keyword-research.md) | **⭐ The community-term question.** Our oldest open question | **First. Before the others.** |
| 5 | [AI Visibility](05-ai-visibility.md) | The M-06 thesis, and VIP's baseline (expect 0) | Second — baseline now, re-run in 30 days |
| 3 | [Content Gap](03-content-gap.md) | What CertaPro ranks for that we don't | Third |
| 4 | [Technical Audit](04-technical-audit.md) | Core Web Vitals, crawlability, duplicate risk | Fourth |
| 1 | [Site Explorer](01-site-explorer.md) | Our own rankings | **Last, and not yet** — pages are days old |

**Set effort to high or max.** These are analysis tasks; you want the model verifying its
own work, not racing.

### Why prompt 2 first

Every keyword tool we have tested returns **zero** for "orchard hills house painters", and
we have never known whether that is a measurement floor or absent demand. The entire
community-page strategy rests on the answer. See `MEMORY.md` M-05 and `TOOLS.md`.

Whatever comes back, **record it in `MEMORY.md`** — a third independent tool confirming the
floor is itself a finding worth keeping.

---

## ⚠️ THE DOMAIN PROBLEM — read before prompts 1 and 3

The live site is a **subpath on a shared domain**:
`realdealmarketing18-a11y.github.io/Vip-home-painting-orange-county/`

Domain-level analysis of `github.io` returns **GitHub's** data, not ours. Any ranked-keyword
or authority number for that host is meaningless for VIP.

- Endpoints taking a **URL prefix** → target the full path.
- Endpoints taking a **domain** → run on `viphomepainting.com` and the competitors, and say
  in the report that VIP's own figures are unavailable and why.
- **Never present a github.io figure as VIP's.**

This is the same wall blocking Google Search Console and Bing Webmaster Tools. **Migrating
to viphomepainting.com is the unlock for all measurement** — and it is now blocking three
separate tools, which makes it the highest-value open decision on the board.

---

## Verified inputs, already in the prompts

**Competitors** *(from `research/irvine/03-organic-competitors.md`)*
`certapro.com` DR 71 · `universalcoat.com` DR 0.2, ranks #3 Anaheim ·
`stubbinspainting.com` DR 0.3

**Locations** — always city-level for SERPs:
`Irvine,California,United States` · `Anaheim,California,United States`

**Business line** — luxury residential exterior/interior and cabinet refinishing, Anaheim
base, design-review communities, differentiator is the Custom Visualization Service.

---

## The honesty rules are the point

Every prompt ends with instructions forbidding estimated numbers and requiring
"not available" rather than a plausible-looking gap-filler.

**This repo has a documented history of exactly that failure** — a false 5-star rating and
a "120+ projects" claim reached live pages; the truth was 9 reviews and no verified project
data. `verify-site.js` exists because of it. A research report that invents a search volume
is the same failure one step earlier, and every page we build gets justified by these
numbers.

**Do not delete those lines to make the output look tidier.**

## What this does not replace

- A deep backlink index
- Years of stored history to look back through
- Scheduled daily rank tracking
- **Google Search Console** — still the only thing that can measure a community term, still
  free, still not connected. This pack does not change that.
