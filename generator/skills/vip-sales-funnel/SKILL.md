---
name: vip-sales-funnel
description: Runs the end-to-end VIP Home Painting sales funnel for one city or community — research, the homeowner story, the sales page (The Reveal opening + a story layout), and the 3-step ad set that drives traffic to it — and says exactly which files to create at each stage. Use when building or rebuilding a city/community sales page, swapping a placeholder client for a real one, planning ads or reels for a page, or asking "what files do I need" / "what's the workflow" for a sales page or campaign. Triggers on sales page workflow, sales page agent, new community page, new city page, swap the client, story sheet, ad set, campaign for [community], reels for [community], funnel.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, WebSearch, WebFetch
---

# VIP Sales Funnel — one homeowner story, one page, one ad set

**The idea in one line:** every city and community gets ONE homeowner story. That story
opens the sales page (The Reveal), carries every section after it, and is the same story the
ads tell. The page and the ads are two views of one set of files — never written separately.

You are the director. You run the stages in order, create the files, and hand each stage to
the specialist skill that owns it. You never skip a gate, and you never invent a fact.

---

## 0 · READ FIRST (every run)

| File | Why |
|---|---|
| `CLAUDE.md` | Hard rules — never "free", never "AI", no ratings, no invented clients/HOA rules, phone and warranty from config |
| `context/FABIAN.md` | Owner's rules. Wins every conflict. Plain English. |
| `generator/LAYOUTS.md` | The page spine: The Reveal opening + layouts B–F, and the `story` block |
| `generator/agents/copywriter/HEADLINE-FORMULAS.md` | Part 0 rules, allowed numbers, Part F ad formulas, kill test |
| `generator/agents/copywriter/FUNNEL-3-STEP-ADS.md` | The 3 ad steps and what fails an ad |
| `context/OFFER.md` · `context/BRAND-VOICE.md` | What we sell and how we sound |

---

## 1 · THE WORKFLOW — 7 stages, one file set

| # | Stage | Owner skill | Creates / edits | Gate before moving on |
|---|---|---|---|---|
| 1 | **Market research** | `marcus-local-seo` | `generator/research/{city}/00-SUMMARY.md`, `05-communities.md`, `06-hoa.md` | Every fact has a source; gaps are listed, not filled |
| 2 | **Buyer language** | `vip-research-agent` | `generator/research/{city}/07-VOICE.md` | Verbatim quotes with URLs; top 3 fears ranked; questions people search |
| 3 | **The homeowner story** | *this skill* | `generator/research/{city}/stories/{slug}.STORY.md` (template: `references/STORY-SHEET-TEMPLATE.md`) | Real client, written permission, photos exist — or the page stays on the Gallagher placeholder |
| 4 | **Brief** | `marcus-local-seo` | `generator/briefs/{city}.json` | `node generator/validate-brief.js {city}` green |
| 5 | **Page copy + layout** | `vip-copywriter` | the page record in `generator/communities.json` (or `cities.json` for a city) — template: `references/PAGE-RECORD-TEMPLATE.json` | Every headline passes Part 0; every SWAP marker accounted for |
| 6 | **Build + verify** | `vip-page-builder` | regenerated `{city}/{slug}/index.html`, `docs/SWAP-CHECKLIST.md` | `generate.js` → `verify-site.js` → `verify-layouts.js` all green; 390px check |
| 7 | **Ad set** | `vip-copywriter-agent` (+ `vip-seedance-shotlist-director` for video) | `campaigns/{city}/{slug}/ADS.md` (template: `references/ADS-BRIEF-TEMPLATE.md`) | 10 drafts per step, 9 killed with reasons; nothing in an ad that is not on the page |

Stages 1–2 run once per **city**. Stages 3–7 run once per **page**. One cluster at a time
(`node generator/pipeline.js status`) — finish, review, get approval, then the next.

**Release:** `references/RELEASE-CHECKLIST.md`. Publishing to WordPress (`publish-wp.js --live`)
is Fabian's call — never run it unasked.

---

## 2 · THE FILE SET — what exists for every page

```
generator/research/{city}/
  00-SUMMARY.md          market: rates, competitors, the angle            (stage 1)
  05-communities.md      streets, architecture, palette, landmarks       (stage 1)
  06-hoa.md              associations, managers — named only if sourced   (stage 1)
  07-VOICE.md            her words: fears, tried-and-failed, questions    (stage 2)
  stories/{slug}.STORY.md   THE homeowner story for this page             (stage 3)
generator/briefs/{city}.json                      the handoff brief       (stage 4)
generator/communities.json | cities.json          the page record         (stage 5)
{city}/{slug}/index.html                          GENERATED — never edit  (stage 6)
docs/SWAP-CHECKLIST.md                            GENERATED placeholder list (stage 6)
campaigns/{city}/{slug}/ADS.md                    the 3-step ad set       (stage 7)
campaigns/{city}/{slug}/SHOTLIST.html             video prompts, if reels (stage 7)
orange-county-sales-page/stories/{slug}/          client photos, if real  (stage 3)
```

**The one rule about these files:** the STORY.md is the source of truth for the client.
The page record's `story` + `master.reveal` + `master.flashback` blocks and the ads are all
written FROM it. If the story changes, change STORY.md first, then both outputs.

---

## 3 · STAGE 3 — THE HOMEOWNER STORY (the heart of it)

Fill `references/STORY-SHEET-TEMPLATE.md`. It answers, in this order:

1. **Who** — name as they agreed to be named, community, permission on file (date).
2. **Before** — how long they lived with the old color, and *why they waited* (in their words
   if possible; map each reason to a ranked fear in 07-VOICE.md).
3. **What they tried** — chips, sample patches, palette books, asking around, HOA review.
4. **The local condition** — the thing about THIS place that made it hard (light, gate,
   design review, close-set street, no streetlights…). From 05-communities.md, sourced.
5. **The visualizer, step by step — always in this order:**
   Color scheme → Lighting → Texture & Material → Finishing Touches → Their Home.
   What they chose at each step, and the one-line reason it matched their **goal, style and
   mood**. Scheme and options must be ones the visualizer has — the full list is in
   `references/STORY-SHEET-TEMPLATE.md`, and the build fails with the valid names if one is
   misspelled. The steps never reorder; only the choices change.
6. **The schemes they ruled out** and why.
7. **The painting days** — real dates and durations, or leave the illustrative timeline.
8. **After** — a quote, the before/after photos, what the neighbors said (only if they said it).

**No real client yet?** The page runs on the Gallagher placeholder (default), with a
community-fit scheme and additions in its `story` block, every client line fenced
`SWAP:CLIENT`. Never write a placeholder as if it were a real local client.

---

## 4 · STAGE 5 — THE PAGE: The Reveal first, then the page's own story

Every page, every layout, opens the same way:

1. **Hero** — the result first. The reel lands on the scheme they chose. The H1 carries the
   page keyword (never rewritten by a layout); the story line sits under it (`master.hero.deck`).
2. **The Reveal** (`master.reveal`) — finished house beside the before photo, and what they
   chose at each step with a reason, plus goal / style / mood.
3. **Flashback** (`master.flashback`) — the years in the old color and why they waited.

Then pick the layout by the page's **local condition** — what is the enemy here?

| If the local condition is… | Layout | Middle of the story |
|---|---|---|
| a hub with many villages | **B · The Reveal** | what they tried → the 30 minutes → painting days → pick your village → pricing → more families |
| the light / climate itself | **C · The Villain** | the villain → what it does on their street → how they beat it → hometown edge |
| high stakes, a costly near-miss | **D · The Near-Miss** | 5 ways it goes wrong (their near-miss No. 1) → what caught it → what it buys you |
| HOA / design review | **E · The Approval** | the approval trap → what they submitted → approval-to-paint timeline |
| estate grounds, dusk, scale | **F · The Dusk Walk** | noon vs dusk → specification → designer palette → proof |

Then for every story section: Part A/B formula + an allowed number where it fits + the page
keyword or a question from 07-VOICE / the brief + one burning fear. Draft several, keep one,
run the kill test (*could a competitor put their logo on it?*).

**Allowed headline numbers only:** 30 · 2 · 11 · 3 · 5 · 60/30/10 · 8 · 15 · 4.75 (and the
word "twice"). Anything else fails the build.

---

## 5 · STAGE 7 — THE ADS: the same story, cut three ways

The ad set is the page, re-cut for the feed. Each ad step pulls from a specific page section:

| Ad step | Audience | Pulls from the page's… | Asset |
|---|---|---|---|
| **1 · Name the problem** | cold | Flashback + the local condition (villain / trap / near-miss) | 15–30s reel or static; no company name in the first 3 seconds |
| **2 · Prove the fix** | warm (watched 50%+, visited) | The Reveal + "they visualized it" band | before/after sweep of THEIR house in the scheme they chose |
| **3 · Ask for the 30 minutes** | hot (page, 75% viewers, opened the visualizer) | Your Turn (visualizer + photo form) + warranty | one CTA, phone visible: **(909) 312-5400** |

Rules that hold for every ad:
- Same client, same scheme, same additions, same keyword as the page. Never a different story.
- Every claim in an ad already appears on the page. If it is not on the page, it is not in the ad.
- Never run Step 3 to cold traffic.
- Draft 10, kill 9 per step, write the reason for each kill (FUNNEL-3-STEP-ADS.md shows how).
- Video: hand the Step 1 and Step 2 scripts to `vip-seedance-shotlist-director` → `SHOTLIST.html`.
- No invented people, no star ratings, no review counts, no "free", no "AI".

---

## 6 · COMMANDS

```bash
node generator/pipeline.js status          # where the cluster is
node generator/validate-brief.js {city}    # stage 4 gate
node generator/generate.js                 # build every page
node generator/verify-site.js              # site gate (26 checks)
node generator/verify-layouts.js           # Reveal first, steps in order, unique H2s, markers
node generator/swap-checklist.js           # refresh docs/SWAP-CHECKLIST.md
```

## 7 · WHAT THIS SKILL NEVER DOES

- Edit a generated `index.html` (the next build erases it — edit the data).
- Invent a client, a quote, a review, a rating, an HOA rule, a street, or a project count.
- Put a number in a headline that is not on the allowed list.
- Reorder the visualizer steps.
- Publish to WordPress, change `config.staging`, or push to `main` without Fabian.
