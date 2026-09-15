# Reference templates — alternate designs, not live pages

Moved here from `vip-lead-machine` on 2026-09-15, when the stale sales-page folders there
were removed. These five files existed nowhere else. Everything else in those folders was an
older copy of something this repo already has.

**Nothing here is built, published, or checked by the gates.** Pages are generated from data
(**D-01**). To use an idea from one of these, port it into the generator's modules. Don't copy
a file into a page folder.

**None of these pass the brand rules as written.** Each one lists what's outdated below.

All four HTML files were switched to `noindex, nofollow` and carry a banner comment, because
GitHub Pages serves this folder publicly and `index-verrone.html` was set to `index, follow`,
which would have competed with the real front page.

---

## `verrone-oc-design/index-verrone.html`

| | |
|---|---|
| **Origin** | `vip-lead-machine/SALES-PAGE-DESIGN/github-sales-page/index-verrone.html` · last changed 2026-08-26 |
| **What it is** | A complete alternate design of the Orange County front page, built around a different story: one crew does the color, the prep and the warranty, where most estates get "colored by a stranger, prepped by a subcontractor." Sections like "One crew…" and "Six disciplines…" |
| **Reusable** | The narrative angle and section layout. It's the strongest source here for giving pages a different feel. |
| **Outdated** | One "VIP Premier" brand mention. |
| **Changed on the move** | robots → `noindex`; 9 visualizer thumbnails repointed to `../../../orange-county-sales-page/viz-photos/` so it renders. A few images it referenced (`og-image.jpg`, `luxury_estate_front.png`, `vip-mark-icon-white.png`) aren't in this repo and show as broken. |

## `architectural-integrity/`

`VIP_SalesPage_Master_Template.html` · `newport-beach.html` · `irvine.html`

| | |
|---|---|
| **Origin** | `vip-lead-machine/sales-pages-oc/` · last changed 2026-08-26 |
| **What it is** | A short master template, "Architectural Integrity for High-End Estates," plus two city versions built from it ("Newport Beach Standards," "Irvine Standards"). |
| **Reusable** | The "standards" framing per city, which could make a useful module. |
| **Outdated** | Uses the old brand name **"VIP Premier Painting"** (4× per file) and "free" once per file. Images point at `vip-lead-machine/assets/`, so they don't resolve here. |

## `inland-empire/Sales-Page-Copy-Template-1.md`

| | |
|---|---|
| **Origin** | `vip-lead-machine/SALES-PAGE-DESIGN/Sales-Page-Copy-Template-1.md` |
| **What it is** | The 12-section structure and copy of the original **Inland Empire** sales page (Miguel & Karla, Fontana), extracted section by section. |
| **Reusable** | Section order and copy skeleton for a future Inland Empire cluster (Rancho Cucamonga, Fontana, Corona are already priced in vip-lead-machine's `CLAUDE.md`). |
| **Outdated** | "free" appears 19× (now "complimentary") and a **1-year warranty** 4× (now 2 years, `config.warranty`). |

---

## Recovering anything else from the removed folders

Every file from `SALES-PAGE-DESIGN/` and `sales-pages-oc/` is still in vip-lead-machine's git
history. The last commit that contains them is **`142f19a`**:

```bash
git -C C:/Users/Owner/VIP-Lead-Machine show 142f19a:sales-pages-oc/irvine/index.html
```
