# TOOL EVALUATION — Ahrefs MCP Server

Tested **2026-07-31**, the day Fabian connected it, against the acceptance test in
`TOOLS.md`.

## VERDICT

**Connected, and returning nothing. Do not adopt yet — and do not remove Semrush.**

Every endpoint that matters returns `{"error": "Insufficient plan"}`. The MCP server works;
the account behind it does not have API access.

---

## WHAT WAS ACTUALLY TESTED

| Endpoint | Result |
|---|---|
| `public-domain-rating-free` | ✅ **works** — returned CertaPro **DR 71** |
| `subscription-info-limits-and-usage` | ❌ Insufficient plan *(and this one is documented as free)* |
| `keywords-explorer-overview` | ❌ Insufficient plan |
| `keywords-explorer-search-suggestions` | ❌ Insufficient plan |
| `site-explorer-metrics` | ❌ Insufficient plan |
| `brand-radar-cited-pages` | ❌ Insufficient plan |

The one success is worth noting: **DR 71 for CertaPro matches what the Apify Ahrefs actor
told us in M-05.** Our existing authority data is corroborated by the source itself.

## WHY

From Ahrefs' own help centre (`help.ahrefs.com/en/articles/6559232-about-api-v3`):

> "Using **API v3** from any of the above methods is possible for **Lite** and higher
> subscription plans" — and the MCP Server is explicitly one of those methods.

Fabian's account is below Lite. Nothing is misconfigured; the plan simply does not include
API or MCP access.

**Also time-sensitive:** the free DR endpoint warns that unauthenticated access is removed
**2026-08-10**. Even the one working call needs a free API key after that date.

---

## WHAT IT WOULD COST, AND WHAT IT WOULD ACTUALLY BUY

| Plan | /mo | Rows per API request | API units/mo | Brand Radar prompts |
|---|---|---|---|---|
| Starter | $29 | **no API / MCP** | — | — |
| **Lite** | **$129** | 100 | 100,000 | 5 prompts · 150 checks |
| Standard | $249 | 250 | 400,000 | 10 prompts · 300 checks |
| Advanced | $449 | 500 | 1,000,000 | 20 prompts · 600 checks |

Lite is the cheapest tier that turns this MCP on.

### The honest part: keywords are probably not the reason to buy

The acceptance test's first question is the community-term test — does it return real data
for `orchard hills house painters`, or another measurement floor?

**I could not run it, but we already have strong evidence of the answer.** M-05 was produced
from the Apify Ahrefs actor, and `keyword_metrics` came back empty; MEMORY.md records that
community terms sit below the measurement floor of *every* tool tested. Ahrefs' own index is
the same clickstream-derived data. **Expect zero.**

So buying Lite to fix the keyword gap would most likely reproduce the gap at $129/mo.

### What would actually be worth paying for

| Feature | Why it matters here |
|---|---|
| **Brand Radar** | AI-citation tracking — directly M-06, the finding the whole blog track rests on. We currently measure this with a $0.10 Apify actor and thin data. Included on Lite |
| **Rank Tracker** | 750 tracked keywords, weekly. `rank-check.js` exists with no real data source behind it |
| **GBP Monitor** *(beta)* | Included on Lite. Relevant to the Fontana → Anaheim pin and the Maps play |
| **Site Audit** | Partly redundant — `verify-site.js` already checks our own output |

---

## DECISION — 2026-07-31: free tools only

**Fabian's call: no paid plan.** So the Ahrefs MCP stays connected but unused, except for
the one free endpoint.

**The only action from this evaluation:** get the free Ahrefs API key before **2026-08-10**,
or `public-domain-rating-free` stops working too. Five minutes, no cost —
`docs.ahrefs.com/en/api/reference/public/get-domain-rating-free`.

Nothing in the pipeline may depend on this MCP. Marcus's tools are unchanged.

### This is a smaller loss than it looks

The thing we would have been buying is keyword volume for community terms, and the evidence
says we would have paid $129/mo to be told **zero** — the same measurement floor every tool
has. See `TOOLS.md` → "The real gap."

**The free replacement is better than the paid one.** Google Search Console reports *actual
impressions for the actual queries* that reached our pages, including the long-tail terms
that sit below every keyword tool's floor. It is the only source that can measure a
community term at all, and it costs nothing. MEMORY.md already says it: *judge community
pages on Search Console impressions, never on a keyword tool.*

**We are not using it yet.** That is the gap worth closing, not the Ahrefs one.

## WHAT WOULD CHANGE THE VERDICT

Re-run this file's test table after any plan change. If `keywords-explorer-overview` returns
a real volume for a community term, that is a genuine finding — record it in `MEMORY.md`,
because it would contradict the current understanding of the measurement floor.
