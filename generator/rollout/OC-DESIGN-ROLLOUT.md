# OC Master → Every Sales Page — Design + SEO Rollout

Worked by the scheduled task **"VIP page rollout"** (weekdays, hourly, 8am–3pm PT).
One row per run, top to bottom. The task reads this file to know what to do next and
updates it before it pushes. Fabian can edit this file any time — reorder rows, set a
row back to `todo` to redo it, or set one to `skip`.

Status values: `todo` · `done` · `blocked` (reason in Notes) · `skip`

**The goal:** every community and city page carries the Orange County master page's
story-led sales process (the Gallaghers' story → visualized / loved / painted → the
package → proof → warranty → FAQ → P.S.) with its own localized copy, its own headline
from HEADLINE-FORMULAS.md, and its own section order so no two pages share a layout.

| # | Page | Staging URL | Status | Run date | Notes |
|---|---|---|---|---|---|
| 0 | GENERATOR PORT — OC story sections become reusable generator modules | — | done | 2026-09-29 | 11 modules in `generator/master-modules.js` + fixed story hero and P.S. close. Tested on a throwaway copy (Orchard Hills + Anaheim with test copy): gates green, 375px + 1440px checked, no sideways scroll. No live page changed. See decisions below. |
| 1 | irvine/orchard-hills | /irvine/orchard-hills/ | todo | | |
| 2 | irvine/altair | /irvine/altair/ | todo | | |
| 3 | irvine/portola-springs | /irvine/portola-springs/ | todo | | |
| 4 | irvine/hidden-canyon | /irvine/hidden-canyon/ | todo | | |
| 5 | irvine/woodbury | /irvine/woodbury/ | todo | | |
| 6 | irvine/stonegate | /irvine/stonegate/ | todo | | |
| 7 | anaheim/peralta-hills | /anaheim/peralta-hills/ | todo | | |
| 8 | anaheim/summit-pointe | /anaheim/summit-pointe/ | todo | | |
| 9 | anaheim/belsomet | /anaheim/belsomet/ | todo | | |
| 10 | anaheim/crown-pointe | /anaheim/crown-pointe/ | todo | | |
| 11 | irvine (city page) | /irvine/ | todo | | |
| 12 | anaheim (city page) | /anaheim/ | todo | | |
| 13 | FINAL SWEEP — cross-page duplicate check, internal links, sitemap | — | todo | | Runs after rows 1–12 |

Staging base: https://realdealmarketing18-a11y.github.io/Vip-home-painting-orange-county

## Decisions made by the rollout task (Fabian not present — change any of these)

- **Row 0 · where the placeholder family says they live.** Every page defaults to the OC page's family and says *Pelican Hill, Newport Beach* — because that is true. It never claims they live in the community the page is about. When you swap in the real homeowner, their location changes with them.
- **Row 0 · the visualizer stays the Gallaghers' house on every page.** It is the demonstration tool (136 pictures). A swapped family changes the hero, scheme cards, package and step pictures — not the visualizer.
- **Row 0 · testimonials are built but should stay OFF.** The module carries the master's three Google quotes with star icons, and ABOUT-VIP item 6 says they are unverified. Page rows leave `testimonials` out of the layout until you confirm them.
- **Row 0 · the warranty section drops "100% Satisfaction Guaranteed"** (on the master) — it is not in ABOUT-VIP. It says: 2-Year Warranty on labor & materials · Licensed, Bonded & Insured · Written into your itemized estimate.
- **Row 0 · schema type stays `HousePainter`**, not `HomeAndConstructionBusiness`. HousePainter is the more specific type of the same thing, and the build gate (check 8) fails the generic one.
- **Row 0 · section order.** Story hero, short answer and visualizer are fixed at the top; FAQ and the close with the P.S. are fixed at the bottom; everything between rotates per page. Beat numbers ("1 ·", "2 ·") come off the section labels because rotation would put them out of order.
- **Found, not fixed (master page is read-only to this task):** on the OC page the "3 things to settle" swipes still say *PLACEHOLDER — DEMO FOOTAGE PENDING*, and "$4.75" breaks onto its own line in the third one. Pages that use `settle` inherit both until the master is fixed.

## Run log
(newest first — one line per run: date · row · result · commit)
- 2026-09-29 · row 0 · done — master sales process ported into the generator as reusable modules; all 21 pages rebuild unchanged; verify-site 25/25 · c7b9855
