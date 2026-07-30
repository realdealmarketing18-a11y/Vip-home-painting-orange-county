# VIP Home Painting — repo guide

Auto-loaded every session. **Orientation and pointers only** — the detail lives in the files
below. Keep this short; a long CLAUDE.md gets skimmed.

---

## WHAT THIS IS

Programmatic SEO landing pages for **VIP Home Painting**, a luxury residential painting
company based in **Anaheim, CA**, targeting wealthy design-review communities across Orange
County.

**Live:** https://realdealmarketing18-a11y.github.io/Vip-home-painting-orange-county/
**13 Irvine pages live** + the Orange County sales page. Auto-deploys ~60s after push.

**The goal:** rank fast in Google organic and — where VIP has a physical pin — the Maps local
pack, ahead of competitors who have been there longer.

---

## READ FIRST

> ### ⚠️ `context/FABIAN.md` — read this before any task.
> How Fabian works, and it wins when anything conflicts. In short: **short plan before
> building anything bigger than a quick fix · never say it's done without showing it works ·
> if a fix feels hacky, redo it right · plain English, he's not a developer · every project
> in its own folder, nothing loose at root.** He runs on speed and momentum — ship real today
> over perfect next month, but never ship something false.

| File | What it settles |
|---|---|
| **`context/FABIAN.md`** | **How to work. Read first.** |
| **`context/ABOUT-VIP.md`** | Who VIP is. **Facts only — if a claim isn't verified here, it does not go on a page.** Ends with 8 unverified items. |
| **`context/DREAM-CUSTOMER.md`** | Who we target and how it changes decisions. Every section ends with a "do differently" instruction. |
| **`context/OFFER.md`** | What we actually sell. Everything ladders to this. |
| **`context/BRAND-VOICE.md`** | How VIP sounds, with banned words and examples. |

---

## THE ONE THING TO UNDERSTAND

**Our buyer is regret-averse, not price-sensitive.** They can afford the repaint. What they
can't afford is spending five figures on a color they end up hating, on a house their
neighbors see every day.

VIP's differentiator is the **Custom Visualization Service** — rendering the client's actual
home in every candidate palette before anything is scheduled.

**Verified:** across ~50 painters in Irvine and Anaheim, *zero* carry a review tag about
visualization or seeing the result first. It is genuinely uncontested. Every page leads with it.

### Two findings that changed the plan

**Domain authority barely matters here (M-05).** Universal Coat ranks #3 in Anaheim at DR 0.2.
VIP is DR 0 — level with page-one competitors, not behind. **Don't buy links.** The gap is
page count, not authority.

**AI engines cite blog posts, not sales pages (M-06).** CertaPro has 313 AI citations; one
blog post earns 55 of them while their hundreds of landing pages earn nothing. And the engines
that matter are **Copilot (50%) and Google AI Mode (36%)** — not ChatGPT. Copilot runs on
Bing, so **Bing Places and Bing Webmaster Tools matter more than any ChatGPT tactic.**

---

## HARD RULES (build-enforced)

- **Never "free"** → "complimentary"
- **Never "AI"** in customer-facing copy → "our design team" / "Custom Visualization Service"
- **Never** "Irvine averages $4.75" → "VIP **starts at** $4.75 per square foot of paintable surface"
- **No `aggregateRating`, no review counts, no "5-Star Rated"** — VIP has **9** reviews and the
  rating is unconfirmed. A false one was live and removed.
- **Never invent** street names, HOA rules, client stories, or reviews
- **Never publish an address in a city VIP doesn't operate from** — base is Anaheim
- Phone in customer copy is **(909) 312-5400** and nothing else

---

## THE SYSTEM

> ### 📋 `generator/WORKFLOW.md` — the complete pipeline
> Every step, every tool, every command, and what data each tool extracts. **Update it in the
> same commit whenever the workflow changes.** It ends with a ranked list of known gaps.

Pages are **generated, never hand-written**. Edit data, run the generator.

```bash
node generator/generate.js                        # build all pages
node generator/pipeline.js status                 # the board
node generator/pipeline.js next marcus            # what's next, for whom
node generator/validate-brief.js irvine           # the gate
node generator/rank-check.js report               # ranking movement
```

**Three agents, one queue, file-based handoff.** No agent talks to another agent — they read
and write the same files. `pipeline.js claim` refuses to advance a cluster whose gate fails,
so broken work cannot hand off.

| Stage | Owner | Reads |
|---|---|---|
| `queued` → `researched` | Marcus | `generator/agents/marcus/MARCUS.md` |
| `researched` → `copy_complete` | Copywriter | `generator/agents/copywriter/COPYWRITER.md` |
| `copy_complete` → `published` | Seraphina | `generator/PIPELINE.md` |

**A fourth track runs alongside:** the blog. Marcus's research feeds it, a separate writer
produces articles 1–2 a week. See `generator/agents/blog/BLOG-WORKFLOW.md`.

**Key files:** `generator/RESEARCH-BRIEF-CONTRACT.md` (the handoff schema) ·
`generator/briefs/{city}.json` (the handoff file) · `generator/research/{city}/00-SUMMARY.md`
(the copywriter's entry point) · `generator/research/_global/MEMORY.md` (what we've learned).

---

## PAGE TYPES — five per city

1. **City** — `/irvine/` — the hub
2. **Community** — `/irvine/orchard-hills/` — homeowners (B2C)
3. **HOA** — `/irvine/hoa-painting/` — boards and property managers (B2B)
4. **Pillar guide** — `/irvine/guide/` — editorial, links down to everything
5. **Article** — `/irvine/guide/what-does-it-cost/` — the pages built to be **cited** (M-06)

Articles sit **three levels deep**, one deeper than everything else. Asset paths must go
through `deepen()` in `generate.js` or backgrounds 404 on GitHub Pages while looking fine
locally. Same trap applies to any future deep page type.

Every page carries a **unique `module_order`**; the generator fails the build if two pages
share a section sequence. That plus cross-page sentence checks is what keeps programmatic
pages from being filtered as doorway pages.

---

## REPO LAYOUT

```
CLAUDE.md                    auto-loads every session
context/                     who we are, who we serve, what we sell, how we sound
generator/                   build system, agents, research, briefs, registries
design-system/               brand tokens, components, the design SKILL.md
docs/                        HANDOFF.md and long-form docs
irvine/                      generated community pages — do not hand-edit
orange-county-sales-page/    the OC page + all shared assets
scroll-demo/                 scroll-world prototype
index.html robots.txt sitemap.xml    must sit at root
```

**Nothing loose at root.** Only files that technically must live there: `CLAUDE.md`,
`README.md`, `index.html` (the redirect), `robots.txt`, `sitemap.xml`. Everything else goes
in a folder — see `context/FABIAN.md`.

---

## GOTCHAS

- **Don't write to `~/VIP-Lead-Machine/`** — it runs a vault-backup process that deletes
  untracked files. That's why work lives here.
- **Browser-pane screenshots time out** in this environment. Verify with `javascript_tool`
  computed-style checks instead.
- The **interactive visualizer is extracted from the OC page at build time** — improve it
  there and regenerate; don't fork it.
- **viphomepainting.com is live but thin.** Migrating these pages onto that domain is an open
  decision — a github.io subdomain will never rank like a branded domain.

---

## CURRENT STATE

**Irvine — 13 pages live**, gate passes, output audit clean:
`/irvine/` · 6 villages · `/irvine/hoa-painting/` · `/irvine/guide/` · **4 cluster articles**
Storytelling heroes on all 7 sales pages, "Watch the Film" plays the existing OC commercial
until the Irvine films exist.

**Anaheim** — queued for Marcus. The *winnable* Maps pack, since the pin is there. Maps data
already scraped (dataset `pw6djQiOl1uh6hDsq`), review bar is 55.
**Newport Beach, Coto de Caza** — queued.

### Next actions, ranked

1. **Move the GBP from Fontana to Anaheim.** Nothing in the Maps playbook works until the pin
   moves. Guide: `research/_global/GBP-VERIFICATION.md`. **Fabian only — needs his login.**
2. **Start the review engine** — 9 reviews today, the bar is ~60.
   `research/_global/GBP-DAILY-PLAYBOOK.md` + 30 days of post copy already written.
3. **Write the remaining 5 cluster articles** — prompts ready in `BLOG-PLAN-IRVINE.md`.
   Purely additive now that the page type exists; 1–2 a week, not all at once.
4. **Submit to Bing Webmaster Tools.** Copilot (50% of citations) runs on Bing. Currently
   the single cheapest unclaimed win (M-06).
5. **Run Marcus on Anaheim** — the winnable Maps pack.

### Open with Fabian

CSLB license number (never captured, competitors display theirs) · EPA Lead Certified? ·
can the warranty go to 2 years (CertaPro advertises 2 against our 1) · real project totals for
pricing ranges · actual Google rating (a directory shows 4.6, the site said 5) · are the three
on-page testimonials real · is the Gallagher family a real client or a produced film subject
(registry says unverified) · migrate to viphomepainting.com?
