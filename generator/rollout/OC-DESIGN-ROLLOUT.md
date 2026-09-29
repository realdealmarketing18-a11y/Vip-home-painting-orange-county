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
| 1 | irvine/orchard-hills | /irvine/orchard-hills/ | done | 2026-09-29 | H1 = **B4** identity guide ("The Orchard Hills Homeowner’s Guide to Exterior House Painting Without Living With the Wrong Color"). moduleOrder: instead → eliminated → settle → painted → offer → neighbors → warranty → beforeCommit → problemSolution → services → serviceArea. 8 FAQs, ~2,520 local words. Left out (not in research): HOA rules, dues, project totals, job length. |
| 2 | irvine/altair | /irvine/altair/ | done | 2026-09-29 | H1 = **B3** costly things ("3 Costly Things to Settle Before Exterior House Painting in Altair") — the `settle` section right under it pays it off. moduleOrder: settle → instead → eliminated → painted → warranty → offer → neighbors → problemSolution → beforeCommit → services → serviceArea. 8 FAQs, ~2,640 local words. Left out (not in research): association rules, management company, job length, glass/roof details. |
| 3 | irvine/portola-springs | /irvine/portola-springs/ | done | 2026-09-29 | H1 = **B5** avoid/get ("Avoid Paying for Exterior House Painting Twice in Portola Springs — See Every Color on Your House First, Complimentary"). moduleOrder: eliminated → offer → instead → painted → problemSolution → settle → neighbors → warranty → beforeCommit → services → serviceArea. 8 FAQs, ~2,830 local words. Left out (not in research): home values, build years, association rules/dues, job length, roof and window details beyond "tile roofs". |
| 4 | irvine/hidden-canyon | /irvine/hidden-canyon/ | done | 2026-09-29 | H1 = **A2** status play ("The Hidden Canyon Standard for Exterior House Painting Begins With Every Color Seen on Your Estate") — HEADLINE-FORMULAS Part D allows only B4 or A2 for Hidden Canyon, and B4 is taken by Orchard Hills. moduleOrder: neighbors → instead → eliminated → painted → offer → beforeCommit → settle → warranty → problemSolution → services → serviceArea. 8 FAQs, ~2,780 local words. Left out (not in research): association name, management company, rules, home values, job length, "Santa Barbara" style. |
| 5 | irvine/woodbury | /irvine/woodbury/ | done | 2026-09-29 | H1 = **B2** how-to ("How to Choose Exterior Colors for Your Woodbury Home in 30 Minutes Without Paying to Paint It Twice") — Part D allows B1/B2/B5 for Woodbury; B5 is Portola Springs'. The `offer` section right under it pays off the 30 minutes. moduleOrder: offer → eliminated → instead → painted → problemSolution → settle → warranty → beforeCommit → neighbors → services → serviceArea. 8 FAQs, ~2,610 local words. Left out (not in research): home values, association rules/dues, job length, roof details, a cabinet price. |
| 6 | irvine/stonegate | /irvine/stonegate/ | done | 2026-09-29 | H1 = **B1** ways/without ("3 Ways to Get Exterior House Painting Right in Stonegate Without Guessing From a Swatch") — Part D allows B1/B2/B5 for Stonegate; B2 is Woodbury's, B5 Portola Springs'. The `settle` section (second body section) pays off the 3 ways. moduleOrder: eliminated → settle → problemSolution → instead → offer → painted → neighbors → warranty → beforeCommit → services → serviceArea. 8 FAQs, ~2,740 local words. Left out (not in research): home values, association rules/dues, job length, roof and window details, shutters. |
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

- **Row 1 · colorGuide, portfolio, specs and process are off the Orchard Hills layout.** colorGuide still draws flat colour chips (`.swatch-chip`) — the paint-can rule forbids them, but check 11 does not look for that class, so the other nine community pages still show them. portfolio claimed Orchard Hills work ("our crews finish Orchard Hills exteriors") that is not verified. specs and process repeat what the master's steps and benefits already say. **Found, not fixed:** the chips on the other pages go when each row reaches them.
- **Row 1 · the Orchard Hills associations are named** (The Groves, The Reserve, The Summit; several managed by Keystone Pacific) because `research/irvine/06-hoa.md` sources them. No rules, dues or approval steps are stated — the copy says those come from the association.
- **Row 1 · two small generator additions, both no-ops for other pages:** page copy (title, meta, short answer, FAQ, problem cards) now takes the same `{tokens}` as the story sections, so phone, warranty, rate and scheme count are read from config; and `beforeCommit` takes an optional `lead`, `problemSolution` an optional local heading.
- **Row 1 · fixed on every page:** at phone width the phone number in the top bar ran 14px off the right edge on all generated pages (the generator's stylesheet was cancelling the master's phone-width spacing). Now matches the OC page. CSS only; no copy changed on other pages.

- **Row 2 · removed from the old Altair copy because nothing backs them:** "laser-checked masking", "3 to 5 working days", "fade-resistant colorants rated for dark exterior use" and "metal-and-glass details". Research confirms modern/contemporary, broad stucco planes and metal accents — that is all the page claims about the architecture.
- **Row 2 · the Altair Irvine Master Association is named** (confirmed in `research/irvine/06-hoa.md`); its management company and rules are not, so the copy says the package is built to whatever the association asks for.
- **Row 2 · the dark-color FAQ** uses the sourced light-reflectance explanation and names Sherwin-Williams Loxon XP IR Reflective as a manufacturer product (`research/orange-county/08-MATERIALS-PERFORMANCE.md`). It does not say VIP stocks or prices it — tell me if it should.
- **Still inherited from the master (unchanged):** the "3 things to settle" swipes show *PLACEHOLDER — DEMO FOOTAGE PENDING*; Altair uses that section, so it shows it too until the OC page is fixed.

- **Row 3 · Portola Springs is written to Tier 2** (BRAND-VOICE rule 5): value certainty and "paying for it twice", not gate protocol. It is not gated, so the neighbors section talks about the park and Hicks Canyon Trail, not a gate.
- **Row 3 · the Portola Springs Association and Keystone Pacific are named** — `research/irvine/06-hoa.md` and `cities.json` source both to portolasprings.org. No rules or approval steps are stated. The brief's `hoa.association_name` was blank and is now filled from that source.
- **Row 3 · "builder palette" is written as a possibility, not a fact.** Research calls it the angle for this village but does not show how many houses still wear their original colors, so the copy says "the palette it was built in" without claiming most do.
- **Row 3 · the old copy's "1-Yr Warranty" meta description, "builder-grade paint chalks and fades years early" and "most forgiving greige in the deck" are gone** — the first was wrong, the other two unbacked.
- **Row 3 · new FAQ answers the searched question "what happens if you paint your house without HOA approval"** (`research/orange-county/07-VOICE.md`) by pointing to the association's own documents — it does not state any penalty.
- **Still inherited:** the "3 things to settle" placeholder footage (Portola Springs uses that section too).

- **Row 4 · Hidden Canyon is written to Tier 1** (BRAND-VOICE rule 5): discretion, the gate, and a reader who may already have a designer or property manager. One FAQ says the renders and estimate can be forwarded to them — true of any image and written estimate; no new service is promised.
- **Row 4 · removed from the old Hidden Canyon copy because nothing backs them:** "completed in five working days", "crews badged and briefed", "gate clearance arranged in advance", "household staff", "elastomeric patching", "founder-signed", "lanterns", and the "Santa Barbara and transitional" style (research confirms **Mediterranean / contemporary**, smooth-troweled stucco, limestone, canyon-edge lots). The gate is handled as the earlier gated pages do it: work planned around the gate and the household, access arranged with the owner or whoever runs the property.
- **Row 4 · no association is named.** Research only confirms Hidden Canyon calls itself "an exclusive 24/7 guard-gated community" (livinghiddencanyon.com); the association and its management company are unverified, so the copy says "Hidden Canyon’s community design review". If you know the association or manager, tell me and it goes in.
- **Row 4 · streets and landmarks are only the research ones:** Panorama, Shady Arbor; Lake Forest Drive, Bommer Canyon, Shady Canyon as nearby landmarks. The page does not quote the $9.15M median.
- **Still inherited:** the "3 things to settle" placeholder footage from the OC page (Hidden Canyon uses that section too).

- **Row 5 · Woodbury is written to Tier 2** (value certainty, paying once) **with cabinets as the second thread.** Research says "cabinets first, whole-home second", but the master process is about exterior color, so the H1, title and keyword are exterior; cabinets get their own FAQ pair, a problem card and the lead services card. The old primary keyword ("factory finish kitchen cabinet painting Irvine") is now the exterior one; the cabinet service page still owns that search.
- **Row 5 · the Woodbury Community Association and Keystone Pacific are named** (`research/irvine/06-hoa.md`, kppm.com press release). No rules or approval steps are stated. The brief's `hoa.association_name` was blank and is now filled.
- **Row 5 · removed from the old Woodbury copy because nothing backs them:** "4 days", "catalyzed-hardness urethane", "degrease-sand-prime", "a fraction of the cost of replacement", "shutters", and the promise to render the kitchen (the offer renders the front of the house). No cabinet price is published; the FAQ says it is counted door by door at the consultation.
- **Row 5 · FIXED ON EVERY PAGE — the warranty badge said "OUR INSANE 1-YEAR WARRANTY".** Both badge pictures (`vip-warranty-laurel-web.png` and `badge-warranty.png`) have that text in the image itself: wrong length and a hype word. It was showing on all 20 generated pages (the big seal on the four rolled-out pages, the small hero-strip badge on the rest). Generated pages now draw the seal in type from config ("2-Year / Warranty / Labor & Materials") and use a shield icon in the strip. `verify-site.js` now fails the build if a generated page uses either picture. **Found, not fixed (read-only to this task): the Orange County page — your live front page — still shows both badges.** It needs a 2-year badge image, or the same type seal.

- **Row 6 · Stonegate is written to Tier 2** (BRAND-VOICE rule 5): value certainty, the itemized estimate, and a close-set street where everyone sees the color. It is not gated, so the neighbors section talks about Stonegate Elementary, Stonegate Park and the Jeffrey Open Space Trail.
- **Row 6 · the Stonegate Village Owners Association and Keystone Pacific are named** (`research/irvine/06-hoa.md`, socalhomefix.com). Research warns of a different, smaller "Stonegate Homeowners Association, Inc."; the page names only the village association and states no rules or approval steps. The brief's `hoa.association_name` was blank and is now filled.
- **Row 6 · removed from the old Stonegate copy because nothing backs them:** "in Just 4 Days", "estate-grade", "we've formatted these packages many times", "shutters", "zero-setback walls", "white-kitchen floor plans", "self-priming and UV-stable", and "sun-washed exposure that ages builder paint". The page does not quote the $1.82M median.
- **Row 6 · FIXED ON EVERY PAGE: on Woodbury the Kitchen Cabinet card linked to the Interior Painting page (with the interior picture) and the Interior card to the Cabinet page.** The generator paired cards by position and Woodbury listed them in a different order. Cards are now matched to their service by name, so order no longer matters. Woodbury's copy is unchanged; its links and pictures are now right.
- **Still inherited:** the "3 things to settle" placeholder footage from the OC page. Stonegate uses that section too, as its second body section.

## Run log
(newest first — one line per run: date · row · result · commit)
- 2026-09-29 · row 6 · done — Stonegate on the master sales process; Woodbury service-card links fixed in the generator; generate + verify-site 26/26 + validate-brief green; 375px/1440px checked, no sideways scroll · see git log
- 2026-09-29 · row 5 · done — Woodbury on the master sales process; 1-YEAR warranty badge replaced on every generated page and gated; generate + verify-site 26/26 + validate-brief green; 375px/1440px checked, no sideways scroll · see git log
- 2026-09-29 · row 4 · done — Hidden Canyon on the master sales process; generate + verify-site 25/25 + validate-brief green; 375px/1440px checked, no sideways scroll · see git log
- 2026-09-29 · row 3 · done — Portola Springs on the master sales process; generate + verify-site 25/25 + validate-brief green; 375px/1440px checked, no sideways scroll · see git log
- 2026-09-29 · row 2 · done — Altair on the master sales process; generate + verify-site 25/25 + validate-brief green; 375px/1440px checked, no sideways scroll · see git log
- 2026-09-29 · row 1 · done — Orchard Hills on the master sales process; generate + verify-site 25/25 + validate-brief green; 375px/1440px checked · see git log
- 2026-09-29 · row 0 · done — master sales process ported into the generator as reusable modules; all 21 pages rebuild unchanged; verify-site 25/25 · c7b9855
