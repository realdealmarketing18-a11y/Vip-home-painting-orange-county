# TOOL EVALUATION — DataForSEO MCP

Tested **2026-07-31**, the day Fabian connected it, against the acceptance test in
`TOOLS.md`.

## VERDICT

**Adopted in principle, blocked on authentication.** Every endpoint returns **HTTP 403**.

This is the right tool for the job and the report pack is already built for it. But no
number has come out of it yet, so nothing in the pipeline may depend on it and the
acceptance test remains **unrun**.

---

## WHAT WAS TESTED

| Endpoint | Family | Result |
|---|---|---|
| `kw_data_google_ads_search_volume` | Keyword Data | ❌ 403 |
| `dataforseo_labs_google_keyword_overview` | Labs | ❌ 403 |
| `ai_optimization_llm_models` | AI Optimization | ❌ 403 |

Three different families, including one utility endpoint taking a single argument. Not a
parameter problem — **account level**.

## LIKELY CAUSE

1. The OAuth prompt was never approved — re-add the connector at
   `https://mcp.dataforseo.com/mcp` and approve it, or
2. The DataForSEO account has no balance. It is pay-as-you-go.

**Re-test with one call before trusting anything:**

> *"Using DataForSEO, get Google Ads search volume for 'irvine house painters' in United
> States, English."*

A number means live. A 403 means still blocked.

---

## WHY IT IS THE RIGHT TOOL ANYWAY

| Criterion (from `TOOLS.md`) | DataForSEO |
|---|---|
| Community-term test | **Unrun** — the whole reason to get this working |
| Geo test | ✅ accepts `Irvine,California,United States` — city-level, which is what we need |
| AI-citation test | ✅ has an AI Optimization family covering LLM mentions, top pages, top domains |
| Decision test | Pending |
| **Free test** | ⚠️ not free, but **cents per call rather than $129/mo** — no subscription |

The geo capability alone puts it ahead of everything we have tried. City-level SERP data is
the thing Semrush and Ahrefs could not give us at a price we would pay.

## COST MODEL — the part to watch

~$0.01 per task + $0.0001 per row. The whole five-prompt pack costs cents.

**But it bills per call.** Do not put it in an unattended routine without a spend ceiling —
a loop that retries on failure could run up a bill with nobody watching.

---

## WHAT HAPPENS WHEN IT AUTHENTICATES

1. Run **`prompts/02-keyword-research.md`** first. It is built to settle the community-term
   question and reports Tier A results separately and explicitly.
2. **Record the answer in `MEMORY.md` either way.** A third independent tool confirming the
   measurement floor is a finding worth keeping — it closes the question rather than leaving
   it open forever.
3. Then prompt 5 (AI visibility baseline), 3 (content gap), 4 (technical audit).
4. Prompt 1 (site explorer) **last, and not yet** — the 13 Irvine pages are days old and
   there is nothing to measure.
5. Come back and fill in the acceptance-test table above with real results.

## THE BLOCKER BEHIND THE BLOCKER

Prompts 1 and 3 are hobbled regardless of authentication, because the live site is a
**subpath on `github.io`**. Domain-level analysis returns GitHub's data, not VIP's.

That is now the **third** tool blocked by the same thing — Search Console, Bing Webmaster
Tools, and DataForSEO's domain endpoints all need a domain we control. **Migrating to
viphomepainting.com has stopped being a preference and become the bottleneck for
measurement.**
