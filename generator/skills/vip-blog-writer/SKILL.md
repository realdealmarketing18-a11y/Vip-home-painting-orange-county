---
name: vip-blog-writer
description: Write VIP Home Painting blog articles and city pillar guides — educational content built to earn AI citations from Copilot, Google AI Mode, ChatGPT and Perplexity. Use when writing a blog post, pillar guide, editorial article, or answering a homeowner question as content; when planning a content calendar; or when asked what to write about. Triggers on blog, article, pillar, guide, content plan, editorial, AI citations, what should we write, or a named city needing content.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---
## 📚 READ THESE FIRST — the copy contract

| Document | What it settles |
|---|---|
| `agents/copywriter/GODFATHER-STRATEGY.md` | Suby's Phase 4, pp.152–196: the offer framework, the 17 sections, the 7 parts, the power guarantee. **The offer outranks the copy** — a strong offer survives weak copy, never the reverse. |
| `agents/copywriter/HEADLINE-FORMULAS.md` | **Part 0** — three rules (timeless formula · burning issue · keep it simple) and four essentials (force the read · use a number · create intrigue · what's in it for **her**). **Part G** is Suby's own machinery. `verify-site.js` check 12 enforces the provable half. |
| `agents/copywriter/DETAIL-SHEET.md` | Every feature → the benefit it buys her, each mechanism sourced. **Check the ⛔ NOT AVAILABLE list before writing any bullet.** |
| `research/orange-county/08-MATERIALS-PERFORMANCE.md` | The sourced education — coastal elastomeric (7–10 yrs → 15–20), IR pigment, LRV. This is Suby §9's "research statistics from credible sources" route, **usable where reviews are not**. |

**The complimentary Custom Visualization Service IS the HVCO** — not a feature of the
strategy, the strategy itself. Never dilute it, bury it, or soften it to avoid the word.
"Complimentary", never "free" (**D-13**) is vocabulary; the offer underneath is untouched.

---


# VIP BLOG WRITER

Educational content that earns AI citations. **A different job from the sales pages** — those
convert, these get quoted.

---

## READ FIRST

1. **`generator/agents/blog/BLOG.md`** — the method, the rules, the cannibalization guard.
   **This is the authority.**
2. `generator/agents/blog/BLOG-PLAN-{CITY}.md` — titles, directions and a ready prompt per article
3. `context/` — BRAND-VOICE · OFFER · DREAM-CUSTOMER · ABOUT-VIP
4. `generator/research/{city}/05-communities.md` — verified streets and palettes
5. `generator/research/{city}/06-hoa.md` — associations, if the topic touches HOA

---

## WHY THIS EXISTS — the evidence

From the AI-citation scrape (MEMORY **M-06**):

- CertaPro: **313 AI citations.** VIP: **0.**
- Their top-cited page is a **blog post** at 55 citations.
- Their **hundreds of city landing pages earn essentially nothing.**

**AI engines cite answers, not offers.** That's the whole thesis.

And the engines aren't the ones people assume:
**Copilot 50% · Google AI Mode 36% · everything else 14%.**
Copilot runs on Bing — index there, not just Google.

---

## 🚫 THE CANNIBALIZATION RULE

Never write a title that competes with a sales page.

> *"Orchard Hills Paint Colors"* ❌ — that's the Orchard Hills page's job
> *"How do I get HOA approval for an exterior color change?"* ✅

**Test:** would someone searching this be ready to hire, or still deciding?
Ready to hire → sales page. Still deciding → blog.

---

## THE SHAPE OF EVERY ARTICLE

1. **Open in a scene**, not a definition
2. **Answer the question in the first 100 words** — this is what gets extracted and quoted
3. **Earn it with specifics** — real streets, real SW codes, real light conditions
4. **Close on the offer once**, plainly, no pitch

900–1,400 words for cluster articles. 1,800–2,400 for a pillar.

---

## HARD STOPS

- **"free"** → complimentary · **"AI"** → our design team
- No review counts, star ratings, or project counts — VIP has **9** reviews, rating unconfirmed
- No invented statistics, HOA rules, street names, or project totals
- No fake urgency — no "spots left", no deadlines
- Never *"Irvine averages $4.75"* → *"VIP starts at $4.75 per sq ft of paintable surface"*
- Phone: **(909) 312-5400**
- Only streets that appear in `05-communities.md`

---

## LINKING

- Once to the city pillar `/{city}/guide/`
- Once to the most relevant community or HOA page
- That's it. No link stuffing.

---

## EMBED THE VISUALIZER

Any article where **seeing beats reading** — color choice, before/after, palette comparison.
It's the only interactive tool in this market and it drives dwell time nothing else can.

---

## WHERE TOPICS COME FROM

Never invent one. Every article answers a question someone actually asked:
`research/{city}/04-keywords.md` · the GBP Q&A in the Apify dataset · competitor FAQ pages.

---

## AFTER PUBLISHING

Submit to **Bing Webmaster Tools** as well as Google Search Console, then re-run
`ai_visibility` monthly to watch VIP move off zero:

```
apify pro100chok/ahrefs-seo-tools · searchType: "ai_visibility"
```

Record what moves in `generator/research/_global/MEMORY.md`.
