# BLOG WORKFLOW — from research to a cited article

**Answering the ownership question directly:**

> **Marcus does the research — but he does not do a separate research pass for the blog.**
> The blog topics come out of the cluster research he already does. Then a writer turns them
> into articles.

The blog track runs **alongside** the page pipeline, not inside it. A cluster ships in 2–3
days; articles ship 1–2 a week. They share research and nothing else.

---

## WHO OWNS WHAT

| Stage | Owner | Runs |
|---|---|---|
| Harvest the questions | **Marcus** | Already part of cluster research — `04-keywords.md` |
| Check who gets cited | **Marcus** | `ai_visibility` on competitors, once per city |
| Turn it into a plan | **Marcus** | Writes `BLOG-PLAN-{CITY}.md` at the end of the cluster |
| Write the articles | **the blog writer** | skill `vip-blog-writer`, 1–2 a week |
| Build and publish | **Seraphina** | `generate.js`, same as every page |

### Why the blog writer isn't Vivienne

Same craft, opposite job. Vivienne writes to **convert** — a reader who is ready to hire.
The blog writes to **be quoted** — a reader who is still deciding, and an AI engine reading
over their shoulder. Answer-first, no pitch, useful even to someone who hires a competitor.

Keeping them separate also means they don't queue behind each other: a cluster and an article
can run the same day.

*(Unnamed for now. Marcus, Vivienne, Seraphina and Aurora have names — say the word and this
one gets one too.)*

---

## STEP 1 · MARCUS — the research already exists

Nothing new to run. The blog draws on what the cluster produced:

| Source | What the blog takes from it |
|---|---|
| `research/{city}/04-keywords.md` | **The harvested questions — these become the articles** |
| Apify Maps dataset | GBP Q&A, the exact wording customers use |
| `research/{city}/03-organic-competitors.md` | Competitor FAQ pages, what they never cover |
| `research/{city}/05-communities.md` | Real streets, palettes, light conditions |
| `research/{city}/06-hoa.md` | Association facts for HOA topics |

**One genuinely new call per city** — competitor AI citations:

```
apify pro100chok/ahrefs-seo-tools
  searchType: "ai_visibility"
  urls: [top 3 organic competitors + viphomepainting.com]
```

That tells you **which pages already earn citations in this market** — and it's how we learned
they're all blog posts, never landing pages (M-06).

---

## STEP 2 · MARCUS — write the plan

`generator/agents/blog/BLOG-PLAN-{CITY}.md`. One pillar plus 8–10 articles. Each entry:

- **Title** — built from a formula in `../copywriter/HEADLINE-FORMULAS.md`
- **Subheadline** — the promise in one line
- **Direction** — what the article is actually for
- **Bullets** — the specific points, drawn from research
- **A copy-paste prompt** — self-contained: context files, URL, word count, answer-first
  instruction, hard rules

The prompt matters. It should work pasted into a blank window with no other explanation.

### 🚫 The cannibalization check — do this before writing a single title

Every title must fail this test: *would someone searching this be ready to hire?*

| Ready to hire → sales page | Still deciding → blog |
|---|---|
| "Orchard Hills House Painters" | "How do I get HOA approval for a color change?" |
| "Irvine Painting Contractor" | "What does it cost to paint a house in Irvine?" |

Two pages competing for one query means Google picks one, usually the wrong one, and both
lose. **This is the single easiest way to damage the sales pages.**

---

## STEP 3 · THE WRITER — one article at a time

```bash
# 1. pick the next unwritten article from BLOG-PLAN-{CITY}.md
# 2. paste its prompt into a fresh window
# 3. the article gets written to generator/blog.json
```

**Read first:** `BLOG.md` (method + rules) · `context/` (voice, offer, customer) ·
the research files the prompt names.

**The shape, every time:**

1. **Open in a scene**, not a definition
2. **Answer the question in the first 100 words** — this is the part that gets extracted and
   quoted. Bury it and you lose the citation.
3. **Earn it with specifics** — real streets, real SW codes, real light
4. **Close on the offer once**, plainly

900–1,400 words. Pillar: 1,800–2,400.

**Embed the visualizer** wherever seeing beats reading.

---

## STEP 4 · SERAPHINA — build and publish

Same as every other page. Data in, pages out, never hand-written HTML.

```
/{city}/guide/              the pillar
/{city}/guide/{topic}/      each article
```

Every article: `Article` + `FAQPage` schema, one link to the pillar, one to the most relevant
community or HOA page. The pillar links down to all six villages.

---

## STEP 5 · INDEX WHERE IT COUNTS

**Submit to Bing Webmaster Tools, not just Google Search Console.**

The citation split in this market is not what people assume:

| Engine | Share |
|---|---|
| **Copilot** | **50%** |
| **Google AI Mode** | **36%** |
| Grok · Gemini · ChatGPT · Perplexity | 14% combined |

**Copilot runs on Bing.** Optimizing for ChatGPT specifically would be chasing 2% of the
citations here.

---

## STEP 6 · MEASURE, MONTHLY

```
apify pro100chok/ahrefs-seo-tools · searchType: "ai_visibility" · urls: [viphomepainting.com]
```

Today VIP is at **0 citations**. CertaPro is at 313 — and almost all of theirs come from one
blog post.

Record movement in `research/_global/MEMORY.md`. A finding that holds in a second city gets
promoted; one the data contradicts gets retired with the evidence.

---

## CADENCE

**1–2 articles a week.** Ten published at once looks manufactured. Ten over six weeks looks
like a business that knows things.

Publishing order is in `BLOG-PLAN-{CITY}.md`, ranked by likely citation value — cost first,
then the cost-of-getting-it-wrong piece, then HOA approval.
