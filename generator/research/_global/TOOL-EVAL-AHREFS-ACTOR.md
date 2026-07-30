# TOOL EVALUATION — Ahrefs SEO Actor vs Semrush

`pro100chok/ahrefs-seo-tools` · tested live 2026-07-30 · ~$0.05 spent

**Verdict: adopt it for domain authority and AI visibility. It does NOT replace Semrush for
keyword volume — but that turns out to matter less than expected.**

---

## WHAT I TESTED

| Endpoint | Result |
|---|---|
| `website_authority` | ✅ **Works.** Real DR, backlinks, referring domains. |
| `ai_visibility` | ✅ **Works — and it is the best endpoint.** See the update at the bottom. |
| `keyword_metrics` | ❌ **Returned empty.** No volume, no difficulty, no SERP. |

Three of sixteen endpoints. Still untested: keyword_ideas, keyword_rank, serp_overview,
backlinks_list, traffic_overview.

---

## 🚨 THE FINDING THAT CHANGES THE STRATEGY

Domain Rating for every painter competing in this market:

| Domain | DR | Backlinks | Ref. domains | Ranks? |
|---|---|---|---|---|
| **certapro.com** | **71** | 989,174 | 4,086 | #1–2 both cities |
| supremapainting.com | 11 | 404 | 375 | #5 Irvine |
| stubbinspainting.com | 0.3 | 452 | 402 | #7 Irvine |
| **universalcoat.com** | **0.2** | 443 | 390 | **#3 Anaheim** |
| anaheimhousepainters.com | 0 | 339 | 337 | #8 Anaheim |
| **viphomepainting.com** | **0** | 425 | 376 | not yet |

### What this means

**Universal Coat ranks #3 organically in Anaheim with a Domain Rating of 0.2.**
Stubbins ranks #7 in Irvine at DR 0.3. Anaheim House Painters ranks #8 at DR 0.

**Domain authority is barely a factor in these SERPs.** Only CertaPro has real authority, and
they earned it as a national franchise across hundreds of locations — not something a local
painter competes with or needs to.

→ **VIP at DR 0 is not behind.** It is exactly level with businesses currently ranking on
page one. The gap between VIP and Universal Coat is not authority — it's that Universal Coat
has 40 landing pages and VIP has 9.

→ **Do not spend money on link building.** The data says it isn't what wins here. Spend it on
pages, reviews and GBP.

→ This also **confirms C-05**: these SERPs are decided by relevance and local specificity,
not authority. A genuinely local page should rank fast.

⚠️ VIP's 425 backlinks from 376 referring domains with only **6 dofollow** looks like typical
directory/scraper noise, not earned links. Same shape as every other local competitor. Not a
problem, just not an asset.

---

## WHERE IT BEATS SEMRUSH

| Capability | Semrush | This actor |
|---|---|---|
| Domain Rating + backlinks | subscription | ✅ ~$0.015/domain, no subscription |
| **AI visibility** — citations in ChatGPT, Gemini, Perplexity, Copilot, Grok | ✗ | ✅ `ai_visibility`, `ai_mode_tracker`, `ai_overviews_tracker` |
| Keyword ideas from **AI engines** | ✗ | ✅ 20 engines incl. ChatGPT/Gemini/Perplexity |
| Exact rank check (domain + keyword + country) | ✓ | ✅ `keyword_rank` — could automate our rank-check loop |
| Pricing | subscription + API units, **currently exhausted** | pay per result, no subscription |

**The AI-visibility endpoints are the real prize — now confirmed.** See the update at the
bottom: it produced the single most actionable finding of the evaluation.

---

## WHERE IT DOESN'T HELP

**`keyword_metrics` came back empty for "irvine house painters."** Either the endpoint is
broken or the free-tool tier has no data at that specificity.

Either way, **it does not solve the zero-volume problem for community terms.** Both Ahrefs and
Semrush estimate from clickstream data; "orchard hills house painters" sits below the
measurement floor of every keyword tool that exists. That's not a tool choice — it's physics.

Keep judging community pages on Search Console impressions after indexing, not on any
keyword tool.

---

## PRACTICAL CAVEATS

- **Third-party scraper, not an official API.** The readme describes Cloudflare Turnstile
  solving and captcha handling. That means it can break without warning when Ahrefs changes
  their front end — fine for periodic research, risky as a scheduled dependency.
- **Small track record:** 172 monthly users, 3 ratings, 96% success rate. The Maps scraper we
  rely on has thousands of users.
- **Free-tool data is less precise** than paid Ahrefs. Treat DR as directional.
- Cost: **$0.015 per result** on the free tier, $0.005 on Bronze+. A full competitor authority
  sweep for one city is roughly **$0.10**.

---

## RECOMMENDATION

**Add it to Marcus's toolkit for three specific jobs. Don't drop Semrush entirely.**

1. **`website_authority`** — competitor DR benchmarking, once per city. ~$0.10. Already
   produced the most strategically useful finding of the week.
2. **`ai_visibility`** — ✅ tested, adopted. Run monthly. Produced M-06.
3. **`keyword_rank`** — evaluate as a replacement for the manual Firecrawl rank-check loop.

**Keep Semrush** for city-level volume and difficulty when credits are topped up — the one
thing this actor failed at. But given the DR finding, volume data is less decisive than we
assumed: these SERPs are won on relevance and local specificity, not on metrics.


---

# UPDATE · `ai_visibility` TESTED 2026-07-30 — ✅ WORKS, AND IT'S THE BEST ENDPOINT

Returns total AI citations, a per-model breakdown, the exact pages being cited, competing
cited domains, the topics triggering citations, and a monthly timeline. ~$0.05 for 3 domains.

## The numbers

| Domain | AI citations |
|---|---|
| **certapro.com** | **313** |
| universalcoat.com | **0** |
| **viphomepainting.com** | **0** |

## Which engines actually cite in this industry

| Model | CertaPro citations |
|---|---|
| **Copilot** | **155** |
| **Google AI Mode (keywords)** | **114** |
| Google AI Overviews (keywords) | 13 |
| Grok | 12 |
| ChatGPT | 6 |
| Gemini | 6 |
| Perplexity | 4 |
| Google AI Mode | 2 |
| Google AI Overviews | 1 |

**Copilot and Google AI Mode are 269 of 313 citations — 86%.** ChatGPT and Perplexity, the
two everyone optimizes for, account for **ten between them**.

→ Copilot runs on Bing. **A Bing Places listing matters far more than assumed.**
→ Optimizing for ChatGPT specifically would be aiming at 2% of the citations in this market.

## 🚨 WHAT ACTUALLY GETS CITED — this is the finding

CertaPro's most-cited pages:

| Page | Mentions |
|---|---|
| `/community/what-are-the-pros-and-cons-of-textured-paint/` | **55** |
| greenyplace.com — *disadvantages of textured paint* | 37 |
| `/york/learning-hub/paint-brands/` | 15 |
| njpaintingservices.com — *pros and cons of paint texture* | 15 |
| `/national-reviews/` | 11 |

**Every top-cited page is an educational article. Not one is a sales page, a service page, or
a location page.**

CertaPro has hundreds of city landing pages. They earn essentially zero AI citations. One
blog post about textured paint earns 55.

→ **AI engines cite answers, not offers.** A page that sells gets ignored; a page that
explains gets quoted.
→ This promotes **C-04** (city-specific blog guides) from a nice-to-have to the single
highest-leverage content gap VIP has.

## And the space is wide open

CertaPro's citation topics are almost entirely **brand lookups** — "certapro painters",
"certapro reviews", "certapro coupon". Only *textured paint* is a generic question.

Nobody in this market is earning citations for the questions homeowners actually ask:
what does painting cost, how do I choose a color, how long does it last, do I need HOA
approval. **That space is empty.**

## What to do

1. **Start a blog.** Educational articles answering real questions — the ones already
   harvested in `04-keywords.md` and the GBP Q&A.
2. **Write answers, not pitches.** The sales pages convert; the blog earns citations. Two
   different jobs.
3. **Claim Bing Places.** Copilot is 50% of citations in this industry and runs on Bing.
4. **Re-run `ai_visibility` monthly** to track VIP moving off zero.

## Verdict on the actor, revised

**Adopt it.** `website_authority` and `ai_visibility` both work and both produced findings
that changed the plan. `keyword_metrics` is the only tested failure — and Semrush covers that.
