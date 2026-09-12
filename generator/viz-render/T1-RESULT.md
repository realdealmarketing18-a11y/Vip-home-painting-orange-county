# T1 control — result

**Ran 2026-09-12.** First live test of the templated prompt from
`build-jobs.js`, per the test plan in `VIZ-RENDER.md`.

| | |
|---|---|
| Source | `orange-county-sales-page/viz-photos/base.webp` (1024×683, 3:2) |
| Scheme | Santa Barbara Luxe (`spanish`) |
| Job | `4f7a4854-832a-487f-aa04-d3a02c83555e` |
| Model requested | `nano_banana_pro` |
| Model reported | `nano_banana_2` |
| Output | 2528×1696 PNG, 2k, aspect 1.491 |
| Cost | 2 credits (603.99 → 601.99) |
| Target to beat | the existing `viz-photos/scheme-spanish.jpg` |

## Status: SUBMITTED AND COMPLETED — NOT YET GRADED

The render finished. **It has not passed the QA gate, because nobody has
looked at it yet.** Do not treat this as a green light.

## Why it is ungraded

The build environment's egress policy blocks the Higgsfield result CDN
(`d8j0ntlcm91z4.cloudfront.net`) — `curl` gets a 403 at the proxy and a
headless browser gets `ERR_TUNNEL_CONNECTION_FAILED`. The bytes cannot
be pulled into this repo, so the gate could not be run here.

**Consequence for the pipeline, not just for this test:** automated QA
cannot live in this environment. Grading happens either in the
Higgsfield UI, or on a machine that can reach the CDN, or by routing
results through storage that is reachable. Worth settling before the
pipeline carries real client work, because an ungraded render reaching a
homeowner is exactly the failure mode `VIZ-RENDER.md` exists to prevent.

## Two observations that stand without seeing the image

**Aspect held.** Source 1.499, output 1.491 — the framing lock survived
a 2.5× upscale. That is the single most common way these renders drift,
and it did not.

**Model substitution.** `nano_banana_pro` was requested; the job reports
`nano_banana_2`. `COLOR-SCHEMES.md` records the originals as Nano Banana
Pro / Nano Banana 2, so both are in family — but if T1 is meant to
reproduce an existing render, the engine has to be pinned deliberately
rather than accepted from whatever the router returns. Confirm which
model the job actually ran before reading anything into a near-miss.

## The gate to run against it

From `VIZ-RENDER.md` §4. All seven, or it fails:

- [ ] Unmistakably the same house: roofline, windows, garage count and
      position, driveway, planting unchanged
- [ ] Same camera position, framing and crop as `base.webp`
- [ ] Same time of day, sun angle and shadow direction — the source is
      dusk, so the render must stay dusk
- [ ] Paint continuous across every wall plane, returns and soffits
      included
- [ ] Trim lines clean and straight
- [ ] Nothing invented — no added storey, landscaping, people, cars, text
- [ ] Body reads as SW Alabaster 7008; the clay-tile roof survived, which
      this scheme explicitly requires

## If it fails

The failure names the fix:

- **Architecture drifted** → the ARCHITECTURE LOCK block is not holding;
  move it after the repaint spec so it is the last instruction read.
- **Went daylight or brighter** → strengthen MATCH THE SOURCE, and say
  "dusk" only by reference to the source, never as a style word.
- **Roof changed** → scheme-level, not template-level: `schemes.json`
  already says "existing clay-tile roof kept exactly as-is" for
  `spanish`. Promote that phrasing into the lock block for every scheme.
- **Colour is a near-miss** → check the model question above before
  touching the prompt.

Log whichever applies in `generator/research/_global/MEMORY.md` under the
repair-loop convention, then re-run T1 once. Two failures on this source
means the template is wrong, not the render.
