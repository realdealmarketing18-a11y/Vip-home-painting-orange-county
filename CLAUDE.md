# VIP Home Painting — Project Constitution

Auto-loaded every session. Built on **B.L.A.S.T.** (Blueprint · Link · Architect · Stylize ·
Trigger) and the **A.N.T.** 3-layer build (Architecture · Navigation · Tools).

**Orientation and pointers only** — detail lives in the linked files. Keep this under 300
lines; a long constitution gets skimmed. Reliability over speed. Never guess at business logic.

---

## PROTOCOL 0 — INITIALIZATION ✅ complete

Project memory is live at `/memory/` — read it before planning anything:

| File | Holds |
|---|---|
| `memory/task_plan.md` | Phases, the per-cluster checklist, ranked next actions, what's blocked on Fabian |
| `memory/findings.md` | The findings that changed the plan (M-05, M-06, M-07) + constraints |
| `memory/progress.md` | What shipped, every error that reached a live page, what's still open |
| `memory/decisions.md` | D-01…D-11 — architectural choices and the reason behind each |

> ### ⚠️ `context/FABIAN.md` — read before any task. It wins when anything conflicts.
> **Short plan before building anything bigger than a quick fix · never say it's done without
> showing it works · if a fix feels hacky, redo it right · plain English, he's not a
> developer · every project in its own folder, nothing loose at root.** He runs on speed and
> momentum — ship real today over perfect next month, but never ship something false.

| File | What it settles |
|---|---|
| `context/ABOUT-VIP.md` | Who VIP is. **Facts only — an unverified claim does not go on a page.** Ends with 8 unverified items. |
| `context/DREAM-CUSTOMER.md` | Who we target. Every section ends with a "do differently" instruction. |
| `context/OFFER.md` | What we sell. Everything ladders to this. |
| `context/BRAND-VOICE.md` | How VIP sounds, with banned words. |

---

## PHASE B — BLUEPRINT

**North Star:** rank in Google organic and — where VIP has a physical pin — the Maps local
pack, ahead of competitors who have been there longer.

| Discovery | Answer |
|---|---|
| **Integrations** | WordPress REST (app password) · Novamira MCP (server files/PHP) · Apify (Maps scraping) · Higgsfield (media) · GSC + Bing Webmaster **— not yet connected, needs Fabian** |
| **Source of truth** | `generator/communities.json` (config + communities) · `generator/cities.json` · `generator/blog.json` · `generator/briefs/{city}.json` · `generator/research/{city}/` |
| **Delivery payload** | Live pages on **viphomepainting.com**, published by `publish-wp.js`. A cluster is Complete only when the payload lands. |
| **Behavioral rules** | The Hard Rules below + `context/BRAND-VOICE.md` + `context/FABIAN.md` |

### Data schema — defined before code runs

`generator/RESEARCH-BRIEF-CONTRACT.md` **is the schema.** The chain is:

```
research/{city}/*.md   →   briefs/{city}.json   →   generated HTML   →   WordPress page
   (Marcus + buyer)         (the handoff)          (generate.js)        (publish-wp.js)
```

Config that must never be typed into a template: `config.warranty`, `config.phone`,
`config.staging`, `config.countyIndexable`, `config.siteBase`.

### The one thing to understand

**Our buyer is regret-averse, not price-sensitive.** They can afford the repaint. What they
can't afford is five figures on a colour they end up hating, on a house the neighbours see
every day.

VIP's differentiator is the **Custom Visualization Service** — rendering the client's actual
home in every candidate palette before anything is scheduled. Across ~50 painters in Irvine
and Anaheim, *zero* carry a review tag about visualization. It is uncontested. Every page
leads with it.

**Two findings that changed the plan** (full set in `memory/findings.md`):
**M-05** — domain authority barely matters here; VIP at DR 0 is level with page one.
**Don't buy links**, the gap is page count. **M-06** — AI engines cite blog posts, not sales
pages, and the engines that matter are **Copilot (50%)** and **Google AI Mode (36%)**.
Copilot runs on Bing, so **Bing Places beats any ChatGPT tactic.**

---

## PHASE L — LINK

Broken link = halt. Do not write logic against an unverified connection.

| Service | State | Probe |
|---|---|---|
| WordPress REST | ✅ verified | `node generator/publish-wp.js --only=county` (dry run) |
| Novamira MCP | ⚠️ drops mid-session | see **D-11** — one asset is on an override path |
| Apify | ✅ verified | Maps dataset `pw6djQiOl1uh6hDsq` |
| Ahrefs / DataForSEO | ❌ blocked | paid endpoints refuse; **free tools only** (M-09/M-10) |
| GSC + Bing | ❌ not connected | **Fabian's login required** |

Three server-side plugins are load-bearing — without them pages publish and render *badly*.
`generator/wp-mu-plugins/README.md` explains each and how to verify it.

---

## PHASE A — ARCHITECT (A.N.T.)

LLMs are probabilistic; business logic must be deterministic. This repo predates the protocol,
so the three layers map onto existing folders rather than new ones:

### A — Architecture · the SOPs *(the "how-to")*
`generator/WORKFLOW.md` — **the complete pipeline.** Every step, tool, command, and what each
tool extracts. Ends with a ranked list of known gaps.
`generator/PIPELINE.md` · `generator/agents/*/[AGENT].md` · `context/*`
**Golden rule: if logic changes, update the SOP in the same commit as the code.**

### N — Navigation · routing and decisions
`generator/pipeline.js` is the router — one queue, three agents, **file-based handoff, no
agent talks to another agent.** `pipeline.js claim` refuses to advance a cluster whose gate
fails, so broken work cannot hand off.

| Stage | Owner | Reads |
|---|---|---|
| `queued` → `researched` | Marcus | `generator/agents/marcus/MARCUS.md` |
| `researched` → `copy_complete` | Copywriter | `generator/agents/copywriter/COPYWRITER.md` |
| `copy_complete` → `published` | Seraphina | `generator/PIPELINE.md` |

**A fourth track runs alongside:** the blog — `generator/agents/blog/BLOG-WORKFLOW.md`.

**Research has two halves.** Marcus answers *where can we win*. The **vip-research-agent**
skill runs the buyer half — Halo Strategy, verbatim language — into `research/{city}/07-VOICE.md`
from `research/_global/HALO-WORKSHEET.md`. That answers *what do we say*, and both copywriters
pull headlines from its language bank instead of inventing them. Only ~3% of homeowners are
ready to buy; **the copy targets the 97% who are stalling** (M-07).

**Two copywriters, two surfaces — don't cross the rules.**

| | `vip-copywriter` (Vivienne) | `vip-copywriter-agent` |
|---|---|---|
| Writes | city / community / HOA page copy | reels, ads, hooks, captions, VSLs, DMs |
| Company name | **required** in answer capsules — they must survive being quoted (M-06) | **banned** from the opening — open with her |
| Goal | rank and get cited | stop the scroll, drive one call or DM |

Shared: `HEADLINE-FORMULAS.md` — Part F is the campaign set, plus the **kill test**
(*could a competitor put their logo on this unchanged?*).

### T — Tools · deterministic, atomic, testable
`generator/*.js`. Credentials in env vars, never in the repo. Scratch work in `/.tmp/`.

```bash
node generator/generate.js                # build all pages
node generator/pipeline.js status         # the board
node generator/validate-brief.js irvine   # gate — checks the INPUT
node generator/verify-site.js             # gate — checks the OUTPUT
node generator/publish-wp.js irvine       # dry run; add --live to publish
node generator/rank-check.js report       # ranking movement
```

### Page types — five per city

1. **City** `/irvine/` — the hub · 2. **Community** `/irvine/orchard-hills/` — B2C ·
3. **HOA** `/irvine/hoa-painting/` — B2B · 4. **Pillar guide** `/irvine/guide/` — editorial ·
5. **Article** `/irvine/guide/what-does-it-cost/` — built to be **cited** (M-06)

Articles sit **three levels deep**. Asset paths must go through `deepen()` in `generate.js`
or backgrounds 404 on GitHub Pages while looking fine locally.

Every page carries a **unique `module_order`** — the build fails if two pages share a section
sequence. That, plus cross-page sentence checks, is what keeps programmatic pages from being
filtered as doorway pages.

---

## PHASE S — STYLIZE

Design tokens and components: `design-system/`. Brand is navy `#1A1F4E`, gold `#C9A961`,
cream `#F5EFE2`; Fraunces for display, Inter for text.

**Two gates, and the output gate matters more.** `validate-brief.js` checks the brief;
`verify-site.js` checks rendered HTML — dead and absolute links, banned copy, schema, FAQ
parity, the silo rule, warranty length, indexation posture, doorway guard. Every miss that
reached a live page was invisible to input validation (**D-04**). The gates run on the county
page too (**D-05**). **Never publish with either red.**

**If you can't verify it, don't ship it.** Every output ships with a test, a measurement, or a
one-line verify command.

### HARD RULES — build-enforced

- **Never "free"** → "complimentary"
- **Never "AI"** in customer-facing copy → "our design team" / "Custom Visualization Service"
- **Never** "Irvine averages $4.75" → "VIP **starts at** $4.75 per square foot of paintable surface"
- **No `aggregateRating`, no review counts, no "5-Star Rated"** — VIP has **9** reviews and the
  rating is unconfirmed. A false one was live and removed; a second one reached the front page.
- **Never invent** street names, HOA rules, client stories, or reviews
- **Never publish an address in a city VIP doesn't operate from** — base is Anaheim
- Phone in customer copy is **(909) 312-5400** and nothing else
- Warranty is **2 years**, and it lives in `communities.json → config.warranty`. CertaPro also
  advertises 2, so **never write "longer than the competition."**

---

## PHASE T — TRIGGER

**Deploy:** `publish-wp.js` pushes onto an Elementor **Canvas** template (**D-06**). GitHub
Pages auto-deploys the build site ~60s after push.

**github.io is the BUILD site, not the destination** (**D-02**). Every generated page carries
`noindex,nofollow` via `config.staging`. At launch: `staging: false`, point `siteBase` at the
real domain, rebuild. One edit.
**One exception:** `config.countyIndexable` publishes the front page `index,follow` — and only
the WordPress copy, never the github.io twin (**D-03**).

### Self-annealing repair loop

When anything fails: **analyze** the actual error, never guess → **patch** the tool →
**test** → **write the lesson into the SOP** so it cannot repeat.

The repair log is `generator/research/_global/MEMORY.md` — failures **F-01…F-16**, each with
the rule learned. Read it before debugging something that feels familiar. Its promotion rule:
a finding is *Candidate* until it holds in a second city.

---

## OPERATING PRINCIPLES

1. **Data-first** — input/output shape defined before code runs
2. **Surgical changes** — touch only what was asked
3. **Simplicity first** — minimum logic, no speculative abstractions
4. **Goal-driven** — every change measured against the North Star and a verify step
5. **Per-task rhythm** — explore → plan → code → verify → commit. No skipping.

---

## REPO LAYOUT

```
CLAUDE.md                    this constitution — auto-loads every session
memory/                      Protocol 0 — task_plan · findings · progress · decisions
context/                     Blueprint — who we are, who we serve, what we sell, how we sound
generator/                   A + N + T — SOPs, router, tools, agents, research, briefs
design-system/               Stylize — brand tokens, components, design SKILL.md
docs/                        HANDOFF.md and long-form docs
irvine/ anaheim/             generated pages — DO NOT hand-edit (D-01)
orange-county-sales-page/    the front page + all shared assets
.tmp/                        ephemeral workbench — never a deliverable
index.html robots.txt sitemap.xml    must sit at root
```

**Nothing loose at root.** Only what technically must be there.

---

## GOTCHAS

- **Don't write to `~/VIP-Lead-Machine/`** — a vault-backup process deletes untracked files.
- **Browser-pane screenshots time out and `requestAnimationFrame` never fires** — the pane runs
  hidden. Shim rAF before measuring anything animated, or you will report phantom bugs.
- The **visualizer builds 99 image URLs at runtime** from two JS arrays. Scoping assets by
  scanning markup misses all of them (F-16).
- The **visualizer is extracted from the OC page at build time** — improve it there and
  regenerate; don't fork it.
- **`page.css` is appended after the base sheet.** A plain rule there beats a media-query rule
  of equal specificity, and will silently cancel responsive steps.
- **viphomepainting.com is live but thin.** Full migration is still an open decision.

---

## CURRENT STATE

**19 pages live.** The Orange County page is viphomepainting.com's front page (WP id **4046**,
`index,follow`), top of the silo, linking down to all 18 city pages. Nav and footer are both
generator-synced. Fabian's previous Elementor home page is **untouched** at
`/luxury-home-painting-southern-california/` — only detached. To undo: `page_on_front` → **3605**.

**Irvine 13** · **Anaheim 5** · both `noindex` pending launch. Gate green at 18 checks.
**Newport Beach, Coto de Caza** queued.

**Ranked next actions and everything blocked on Fabian: `memory/task_plan.md`.**
