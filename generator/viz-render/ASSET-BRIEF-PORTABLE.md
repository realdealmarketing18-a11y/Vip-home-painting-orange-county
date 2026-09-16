# PORTABLE ASSET BRIEF — the 9 step renders + the brand sweep

**Copy this whole file into Higgsfield, Midjourney, or whatever tool you're using.**
It is self-contained: it names the source image, the shot list, the brand rules and the
QA gate, so it needs no context from the repo.

Brand is **VIP Home Painting**. Tagline: **Visualize It. Love It. Paint It.**
Navy `#1A1F4E` · Gold `#C9A961` · Cream `#F5EFE2` · Deep navy `#14183A`

---

## THE ONE RULE THAT MATTERS MOST

Every render is **the same house, the same camera, the same light** as the source photo.
The entire page rests on the visitor believing these are one house photographed repeatedly.
A render that drifts on angle or time-of-day breaks that, and a broken render is worse than
no render.

**Source image:** `orange-county-sales-page/viz-photos/base.webp` — a Newport Beach /
Pelican Hill Mediterranean estate, shot square to the facade at **dusk**, warm interior
lights on, blue-hour sky.

**Do not regenerate the "before".** It already exists and is used everywhere. You are only
producing the **after** frames — 9 of them.

---

## SHOT LIST — 9 renders

### Group A · LIGHTING (3) — full facade, dusk
Same framing as `base.webp`. Only the fixtures change, and they must be **visibly lit**,
since the whole point is how the facade reads after dark.

| # | File | Fixture |
|---|---|---|
| A1 | `step-light-led-slot.jpg` | Minimalist LED slot sconces, warm white, clean vertical wash on the columns |
| A2 | `step-light-iron-lantern.jpg` | Wrought-iron scroll lanterns, warm amber, visible filament |
| A3 | `step-light-bronze-pendant.jpg` | Bronze coach pendants, warm, hung at the entry |

### Group B · TEXTURE (3) — tight on the facade
**Crop in.** A cedar-shake demo does not need the whole estate — the detail is the point and
a wide shot hides it. Keep enough of the architecture that it is recognisably the same house.

| # | File | Material |
|---|---|---|
| B1 | `step-texture-cedar-shake.jpg` | Cedar shake accent on the upper gable |
| B2 | `step-texture-board-batten.jpg` | Board & batten on the same plane |
| B3 | `step-texture-stacked-stone.jpg` | Stacked stone veneer on the columns and base |

### Group C · PREMIUM (3) — tight on the garage bay
Crop to the garage and its immediate surround.

| # | File | Addition |
|---|---|---|
| C1 | `step-premium-smoked-glass.jpg` | Smoked-glass panel garage door, dark aluminium frame |
| C2 | `step-premium-walnut.jpg` | Walnut / warm wood garage door, horizontal grain |
| C3 | `step-premium-limestone.jpg` | Limestone pillars flanking the drive |

**Output:** JPG, 16:9 for Group A, 4:3 acceptable for B and C. Longest edge ≥ 1600px.

---

## THE BRAND SWEEP — the one motion that ties everything together

Fabian's device, and it already exists as the website's before/after seam. Same gesture in
the commercial, on the page, and in every exported ad frame:

> **A thin gold line sweeping left to right, with the crowned brush logo centred directly on
> the sweep line.**

- Line: **1–2px, gold `#C9A961`**, full height of the frame
- Logo: the **navy-and-gold crowned brush**, centred vertically **on** the line — riding it,
  not beside it
- Motion: left → right, revealing the after
- Nothing else on the line. No text, no glow, no second colour.

**Generate this as transparent PNG only if you need it for video.** For the website it is
already built in CSS and needs no asset.

---

## OVERLAY CHROME — do NOT generate these

Built in CSS/SVG, crisp at any size, free to change:
gold plate frame · BEFORE / AFTER labels · the three-paint-can nameplate · the `04 / 11`
counter · "The direction they chose" stamp · the drag knob.

Generating them would cost credits, lock the resolution, and drift between batches.
**Spend credits on houses only.**

---

## QA GATE — reject before it reaches the page

A render fails if **any** of these is true:

- [ ] Camera angle differs from `base.webp`
- [ ] Time of day differs — Group A must stay dusk
- [ ] Overall brightness drifts from the source *(this already happened once:
      `scheme-spanish.jpg` reads noticeably brighter and breaks the one-house illusion)*
- [ ] Architecture changed — rooflines, window count or placement altered
- [ ] Landscaping moved or regrew
- [ ] The addition looks composited rather than built
- [ ] Any legible text, signage or watermark appears

Full gate: `generator/viz-render/VIZ-RENDER.md`.

---

## SUGGESTED ORDER — so credits are spent once

1. Generate **A1 only**.
2. Drop it on the page behind the existing chrome and look at it.
3. If the frame works, generate the remaining 8 in one batch.

Generating all nine before seeing one in place risks nine unusable images.

---

## WHAT THESE ARE FOR — so the renders serve the copy

Each step becomes a swipe demonstration with a headline and benefit bullets. **Benefits,
never features.** "IR-reflective pigment" is a feature; "you can have the dark scheme
without cooking the house in August" is a benefit.

The performance backing for those bullets is in
`generator/research/orange-county/08-MATERIALS-PERFORMANCE.md` — sourced, with the
unsourced claims marked and the Title 24 angle deliberately dropped.
