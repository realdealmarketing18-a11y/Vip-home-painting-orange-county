# VIP Home Painting — repo guide

Auto-loaded every session. **Orientation and pointers only** — the detail lives in the files
below. Keep this short; a long CLAUDE.md gets skimmed.

---

## WHAT THIS IS

Programmatic SEO landing pages for **VIP Home Painting**, a luxury residential painting
company based in **Anaheim, CA**, targeting wealthy design-review communities across Orange
County.

**Live:** https://realdealmarketing18-a11y.github.io/Vip-home-painting-orange-county/
Six Irvine community pages + the Orange County sales page. Auto-deploys ~60s after push.

**The goal:** rank fast in Google organic and — where VIP has a physical pin — the Maps local
pack, ahead of competitors who have been there longer.

---

## READ FIRST (business context — the source of truth)

| File | What it settles |
|---|---|
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
| `queued` → `researched` | Marcus | `generator/research/_global/MARCUS.md` |
| `researched` → `copy_complete` | Copywriter | `generator/research/_global/COPY-SLOTS.md` |
| `copy_complete` → `published` | Seraphina | `generator/PIPELINE.md` |

**Key files:** `generator/RESEARCH-BRIEF-CONTRACT.md` (the handoff schema) ·
`generator/briefs/{city}.json` (the handoff file) · `generator/research/{city}/00-SUMMARY.md`
(the copywriter's entry point) · `generator/research/_global/MEMORY.md` (what we've learned).

---

## PAGE TYPES — three per city

1. **City** — `/irvine/` — the hub
2. **Community** — `/irvine/orchard-hills/` — homeowners (B2C)
3. **HOA** — `/irvine/hoa-painting/` — boards and property managers (B2B)

Every page carries a **unique `module_order`**; the generator fails the build if two pages
share a section sequence. That plus cross-page sentence checks is what keeps programmatic
pages from being filtered as doorway pages.

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

**Irvine:** researched, gate passes, waiting on copywriter (city page H1/meta/capsule/viz
intro/6 FAQs + the new HOA page).
**Anaheim:** queued — the *winnable* Maps pack, since the business pin is there.
**Newport Beach, Coto de Caza:** queued.

**Open with Fabian:** CSLB license number (never captured, competitors display theirs) · EPA
Lead Certified? · can the warranty go to 2 years (CertaPro advertises 2 against our 1) · real
project totals · actual Google rating · are the three on-page testimonials real.
