---
agent: blog
role: Blog & Editorial — VIP Home Painting
loads: [../../../context/FABIAN.md, ../../../context/ABOUT-VIP.md, ../../../context/DREAM-CUSTOMER.md, ../../../context/OFFER.md, ../../../context/BRAND-VOICE.md, ../../research/_global/MEMORY.md, ../copywriter/HEADLINE-FORMULAS.md]
---

# THE BLOG — how VIP does it, and why it's a separate job

> **Full pipeline:** `generator/WORKFLOW.md`. This covers the blog specifically.

---

## WHY THE BLOG EXISTS AT ALL

Hard data, not theory. From the AI-citation scrape (MEMORY **M-06**):

- CertaPro has **313 AI citations**. VIP has **0**.
- Their single most-cited page is a blog post — *"pros and cons of textured paint"* — at
  **55 citations**.
- Their **hundreds of city landing pages earn essentially nothing.**

**AI engines cite answers, not offers.** A page that sells gets ignored. A page that explains
gets quoted. The sales pages convert; the blog gets cited. Two different jobs, and one cannot
do the other's work.

And the space is empty: CertaPro's citations are almost all brand lookups. **Nobody is
earning citations for the questions homeowners actually ask.**

---

## 🚫 THE CANNIBALIZATION RULE — read before writing a single title

A blog post titled *"Orchard Hills Paint Colors"* would compete with the Orchard Hills sales
page for the same query. Google picks one, usually the wrong one, and both lose.

| Sales pages | Blog |
|---|---|
| **Who to hire** in this village | **How to decide**, what it costs, what goes wrong |
| Commercial intent | Informational intent |
| "Orchard Hills House Painters" | "How do I get HOA approval for an exterior color change?" |
| Converts | Gets cited |

**Test every title:** would someone searching this be ready to hire, or still deciding?
If ready to hire → it belongs on a sales page. Don't write it.

---

## THE TWO SHAPES

### 1 · THE PILLAR — one per city
A rich storytelling journey with the interactive visualizer embedded and links down to every
community page. Built for **humans and internal linking**: dwell time, engagement, and
pushing authority into the community pages.

It will **not** earn AI citations, and that's fine. It isn't answering a question.

`/{city}/guide/`

### 2 · THE CLUSTER — 8–10 per city
Each answers exactly **one** question. Focused, useful, slightly boring. Links back to the
pillar. **This is the citation engine.**

`/{city}/guide/{topic}/`

---

## HOW VIP BLOGS DIFFERENTLY — the storytelling method

Every competitor article on painting is a listicle written by someone who has never stood on
the street. Ours are written from a specific place, in specific light, about specific
architecture.

**The four-part shape for every article:**

1. **Open in a scene, not a definition.** Not *"Exterior painting is an important
   investment."* Instead: *"By two in the afternoon, the same white that looked perfect in
   the showroom is reading yellow on your south-facing wall."*
2. **Answer the question in the first 100 words.** Directly, completely, before any
   throat-clearing. This is what gets extracted and quoted. Bury the answer and you lose the
   citation.
3. **Then earn it with specifics** — real streets, real SW codes, real light conditions, real
   numbers. Specificity is the proof no competitor can copy.
4. **Close on the offer, once, without pitching.** The visualization is the natural answer to
   almost every one of these questions. Say it plainly and stop.

**Embed the visualizer** in any article where seeing beats reading. It's the only interactive
tool in this market and it drives dwell time nothing else can.

---

## THE RULES

Everything in `BRAND-VOICE.md` applies, plus:

- **Answer first.** The extractable answer sits in the opening paragraph, always.
- **One question per article.** Two questions means two articles.
- **Name real places.** Streets and villages from `research/{city}/05-communities.md`.
- **No made-up statistics.** Every number cites a source or comes from `ABOUT-VIP.md`.
- **Never "free"** → complimentary · **never "AI"** → our design team.
- **No review counts, no star claims** — VIP has 9 reviews and the rating is unconfirmed.
- **Link once to the pillar, once to the most relevant community page.** No link stuffing.
- 900–1,400 words. Long enough to be complete, short enough to be read.

---

## WHERE THE TOPICS COME FROM

Never invent a topic. Every article answers a question someone actually asked:

1. `research/{city}/04-keywords.md` — harvested questions
2. The Google Business Profile Q&A in the Apify Maps dataset
3. Competitor FAQ pages found by Firecrawl
4. Reddit threads *(currently unreachable — Firecrawl is blocked, needs an Apify actor)*

---

## OPTIMIZE FOR THE ENGINES THAT ACTUALLY CITE

From M-06 — the split is not what people assume:

| Engine | Share of citations |
|---|---|
| **Copilot** | **50%** |
| **Google AI Mode** | **36%** |
| Grok · Gemini · ChatGPT · Perplexity | 14% combined |

**Copilot runs on Bing.** A Bing Places listing and Bing indexing matter more here than any
ChatGPT-specific tactic. Optimizing for ChatGPT alone would be chasing 2% of this market.

Practically: clear question-shaped H2s, a direct answer under each, `FAQPage` schema, and
submission to **Bing Webmaster Tools** as well as Search Console.

---

## OUTPUT

Same as every other agent: **structured data, never HTML.**
Blog entries go in `generator/blog.json`; the generator builds the pages.

Plan and prompts for the current city: `BLOG-PLAN-{CITY}.md`.
