# THE PIPELINE — where data lives and how agents hand off

Three scheduled agents, one queue, file-based handoff. No agent talks to another agent —
they all read and write the same files.


> **Full pipeline:** `generator/WORKFLOW.md` — every step, every tool, every command.

---

## WHERE EVERYTHING LIVES

```
generator/
├── queue.json                  ← THE CONTROLLER. Which cluster, what stage, who owns it.
├── pipeline.js                 ← the handoff tool every agent runs first
├── validate-brief.js           ← the gate. Nothing advances without passing.
│
├── briefs/
│   ├── irvine.json             ← THE HANDOFF FILE. Research + copy for a whole cluster.
│   ├── anaheim.json
│   └── _raw/                   ← raw scrape dumps, kept for re-mining
│
├── research/
│   ├── _global/                ← transfers between cities
│   │   ├── MARCUS.md · MEMORY.md · GBP playbooks
│   │   └── RESEARCH-BLUEPRINT.md · HOA-DISCOVERY-RECIPE.md
│   └── {city}/                 ← 00-SUMMARY.md is the copywriter's entry point
│       └── 01-market · 02-local-pack · 03-organic · 05-communities · 06-hoa
│
├── registry/                   ← global state no single brief owns
│   ├── client-stories.json     ← one real story, one page, forever
│   ├── module-orders.json      ← no two pages share a layout
│   └── nap.json                ← the one true name/phone/email/hours
│
├── agents/
│   └── copywriter/             ← COPYWRITER.md · HEADLINE-FORMULAS.md · slots specs
├── cities.json · communities.json   ← what the generator builds from
├── slots.js                    ← tells Vivienne which sections each page has
├── rank-check.js               ← the feedback loop
└── generate.js
```

**The one file that matters for handoff is `briefs/{cluster}.json`.** Marcus fills the
research half. The copywriter fills the copy half. Seraphina reads the whole thing and
builds. Nothing else passes between them.

Raw Apify datasets stay on Apify and are **persistent** — re-pull anytime without paying to
re-scrape. IDs are recorded in each brief's `meta.sources`.

---

## THE THREE STAGES

| Stage | Owner | Produces | Gate |
|---|---|---|---|
| `queued` → `researched` | **Marcus** | market, local_pack, competitors, keywords, geography incl. **verified street names**, HOA, palette, module orders | `validate-brief.js {slug} --stage research` |
| `researched` → `copy_complete` | **Vivienne** | copy for the city, every community **and the HOA page** | `validate-brief.js {slug}` |
| `copy_complete` → `published` | **Seraphina** | merged data, generated pages, interlinks, sitemap, one commit | `validate-brief.js {slug}` |

The gate is **stage-aware**: Marcus isn't blocked by copy fields that aren't his job, and the
copywriter can't hand off with a missing meta description.

---

## HOW AN AGENT'S SCHEDULED RUN WORKS

Every agent starts the same way:

```bash
node generator/pipeline.js next marcus
```

It prints the cluster, the task, the gate command, and the completion command — or
`NOTHING TO DO`, in which case the agent exits immediately without burning tokens or credits.

On completion:

```bash
node generator/pipeline.js claim irvine researched
```

**`claim` refuses to advance a cluster whose gate is failing.** An agent cannot hand off
broken work — the pipeline physically won't let it. If something can't be resolved:

```bash
node generator/pipeline.js block irvine "HOA site is down, cannot verify Stonegate rules"
```

Blocked clusters surface in `status` and wait for Fabian.

### Seeing the whole board

```bash
node generator/pipeline.js status
```

---

## THE SCHEDULE

Marcus and the copywriter should **not** run at the same time — the copywriter needs
Marcus's output. Stagger them so each morning's research is written up that afternoon.

| Time | Agent | Command |
|---|---|---|
| 08:00 | Marcus | `node generator/pipeline.js next marcus` then do the work |
| 13:00 | Copywriter | `node generator/pipeline.js next copywriter` |
| 16:00 | Seraphina | `node generator/pipeline.js next seraphina` |

A cluster researched Monday morning gets copy Monday afternoon and publishes Monday evening.
If Marcus needs two days for a big cluster, the copywriter simply finds `NOTHING TO DO` and
exits — no wasted spend, no half-built pages.

**Pace: about one cluster every 2–3 days.** The queue enforces this naturally, since only one
cluster occupies each stage at a time.

---

## CURRENT BOARD

| # | Cluster | Stage | Owner | Notes |
|---|---|---|---|---|
| 1 | **Irvine** | `copy_complete` | seraphina | **8 pages live.** City + 6 villages + HOA page. |
| 2 | **Anaheim** | `queued` | marcus | Home market — the winnable pack. Maps data already scraped. |
| 3 | Newport Beach | `queued` | marcus | + Pelican Hill, Crystal Cove, Pelican Crest |
| 4 | Coto de Caza | `queued` | marcus | |

---

## WHAT THE COPYWRITER READS

For Irvine, everything needed is already on disk:

- **`research/{city}/00-SUMMARY.md`** — the entry point; may be all that's needed
- **`research/{city}/05-communities.md`** — verified streets, values, palettes, landmarks
- **`research/{city}/06-hoa.md`** — associations and management companies
- **`briefs/{city}.json`** — the file being filled
- `node generator/slots.js {city}` — which sections each page actually carries

The three positioning angles the data supports, which every headline should ladder to:

1. **Nobody in this market competes on color confidence.** Zero painters in either city carry
   a review tag about visualization or seeing the result first. It is entirely uncontested.
2. **A wrong color costs the whole project again** ($4,000–$7,000), and almost nobody who
   regrets a color ever saw it on their own house first.
3. **Competitors publish no real pricing.** CertaPro's Irvine page says "Less than you might
   expect!" — itemized transparency is a genuine differentiator.
