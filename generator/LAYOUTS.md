# Story Layouts — how a sales page tells its story

Code: `generator/story-layouts.js` · CSS: `generator/layout-page.css` ·
Gate: `generator/verify-layouts.js` · Placeholder list: `docs/SWAP-CHECKLIST.md`
(built by `generator/swap-checklist.js`).

Every city and community sales page tells one client story, forward in time:
**They Visualized It → They Loved It → We Painted It.** A layout is the order
the story is told in. There are five.

## Turning a layout on

In the page's record (`communities.json` or `cities.json`):

```json
"storyLayout": "D",
"layoutOptions": ["offer"]
```

A page **without** `storyLayout` renders exactly as it did before layouts existed.

`layoutOptions` switches on a layout's optional add-in sections (listed below).
Pages that share a layout **must** use different options: the build refuses
two community pages with the same section order (the doorway-page guard in
`generate.js → validate`). The guard compares the order a page actually
renders, so the story sequence stays the same and the add-ins make each page
distinct.

## The five layouts

Fixed on every layout: **hero → short answer** at the top, **FAQ → founder →
final CTA + P.S.** at the bottom. The beats in between:

| Layout | Beats (add-ins in *italics*) | Pages |
|---|---|---|
| **B · The Reveal** | flashback + cost of a wrong color → what they tried (`instead`) → the 30 minutes (`eliminated`) → painting days (`timeline`) → your turn (`viz`) → pick your village (`communities` + `hoa`) → priced + warranty (`pricing` + `warranty`) → more families (`proof` + `reviews_map`) | /irvine/ |
| **C · The Villain** | the local condition (`spotlight`) → what it does + cost (`cost_of_wrong`) → how they beat it (`eliminated`) → your turn (`viz`) → hometown edge (`reviews_map`) → communities → `pricing` → `hoa` → `palette` → `process` | /anaheim/ |
| **D · The Near-Miss** | 5 ways it goes wrong, their near-miss No. 1 (`problems`) *+ instead* → what caught it (`eliminated`) → your turn (`viz`) *+ offer* → what it buys you (`neighbors`) → `painted` + `warranty` → `beforeCommit` → `services` + `serviceArea` | /irvine/altair/ (instead, offer) · /anaheim/crown-pointe/ (offer) · /anaheim/summit-pointe/ (none) |
| **E · The Approval** | the approval trap (`instead`) → *eliminated* + what they submitted (`offer`) → approval → painting (`timeline`) → your turn, community field first (`viz`) → `warranty` *+ beforeCommit* → *services* + `serviceArea` → association questions lead the FAQ | /irvine/woodbury/ (eliminated, services) · /irvine/stonegate/ (beforeCommit, services) · /irvine/portola-springs/ (eliminated, beforeCommit) · /irvine/orchard-hills/ (services) |
| **F · The Dusk Walk** | noon vs dusk (`dusk`) → your turn, **Lighting step first** (`viz`) → `specs` → `palette` → `proof` *+ neighbors* → `problems` + `process` *+ warranty* → `serviceArea` | /anaheim/peralta-hills/ (none) · /irvine/hidden-canyon/ (neighbors, warranty) · /anaheim/belsomet/ (warranty) |

## Where the words live

All localized copy is in the page's `master` block, read through the same
`{tokens}` as the master modules (`{they}`, `{their}`, `{family}`, `{place}`,
`{chosen}`, `{schemes}`, `{community}`, `{city}`, `{phone}`, `{warranty}`,
`{rate}`). New blocks:

| Block | Used by | Shape |
|---|---|---|
| `master.hero.deck` | all | the layout's story line, shown under the H1 (the H1 itself is never rewritten by a layout) |
| `master.viz` | all | `{ h2, sub, lede, links }` — visualizer headline, the "four decisions" line, Step Five's lede, and (F) the between-step lines |
| `master.flashback` | B | `{ eyebrow, h2, lead, chipLine, body[] }` |
| `master.timeline` | B, E | `{ eyebrow, h2, lead, days[{label,title,body}], note }` |
| `master.nearMiss` | D | `{ label, story, fixLabel, fix? }` — card No. 1; the fix defaults to the first local problem's solution |
| `master.dusk` | F | `{ eyebrow, h2, lead, noonLabel, noon, duskLabel, dusk, chipLine, scale }` |
| `master.palette` | C, F | `{ eyebrow, h2, lead, foot, schemeName }` — colours come from `extraColors` + the core three (community) or `palette_baseline` (city), always as three paint cans |
| `master.proof` | B, F | `{ eyebrow, h2, lead, family{tag,headline,caption,story,reason,strategy,mood}, more[{name,location,initials,tag,headline,story}] }` |
| `master.faq` | all | `{ h2 }` |
| `master.specs`, `master.process`, `master.communities`, `master.costOfWrong`, `master.hoaBlock`, `master.pricingBlock`, `master.spotlightBlock`, `master.mapBlock` | reused sections | `{ eyebrow, h2, lead }` heading overrides |

Copy a layout replaced is **parked, not deleted**: `master._parked.<block>`.

## Things a layout never changes

- `<title>`, meta description, canonical, robots, the FAQ schema.
- The structured data. A page that already ran the master process keeps its
  extras, built from its original `moduleOrder` (kept in the record for that
  reason). A page marked `"schema": "legacy"` keeps the plain graph it had.
- Internal links: a section's links move with it. The old per-community map
  section's "Open Google Maps" link now lives in the service-area section.
- The visualizer script. Layout F moves the step blocks in the markup; the
  script finds every control by id and `data-cat`, never by position.

## The gates

```bash
node generator/generate.js        # build
node generator/verify-site.js     # site gate (unchanged)
node generator/verify-layouts.js  # unique H2s, none copied from the OC page,
                                  # photo form after a pain section,
                                  # Visualized before Painted, SWAP markers balanced
node generator/swap-checklist.js  # refresh docs/SWAP-CHECKLIST.md
```
