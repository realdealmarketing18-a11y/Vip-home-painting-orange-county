# HIGGSFIELD SHOTS — the four plates the ads don't have yet

The ads render today without these. The eleven scheme renders are the real asset and they
carry the whole demonstration. These four fill gaps the existing library doesn't cover:
a vertical plate, and the one image that makes Stage 1's argument.

---

## ⚠️ THEY ARE IN YOUR HIGGSFIELD ACCOUNT, NOT IN THIS REPO

They generated fine. They could not be downloaded into the build environment — this
session's network policy blocks `d8j0ntlcm91z4.cloudfront.net` (and `higgsfield.ai`), so
the files stayed on Higgsfield's side. Nothing was lost; they're in the account under the
job IDs below.

**Two things to do before using them:**

1. **Regenerate at production quality.** These came back **752×1344** because the model
   defaulted to `quality: low`, `resolution: 1k`. For a 1080×1920 ad you want
   `quality: high`, `resolution: 2k`. The prompts below are the ones that produced the
   results — reuse them verbatim and change only those two settings.
2. **Download into `ad-system/assets/`** under the filenames below, then re-run
   `node render.js --all`. `brand.json → paths` already points at these names; the engine
   uses them when they exist and falls back to the framed 16:9 plate when they don't.

| Save as | Job ID | Used by |
|---|---|---|
| `assets/hf-estate-before-9x16.png` | `c4b3c666-21b9-43c6-b900-9978e0c50f07` | Stage 1 + 2 opening plate |
| `assets/hf-estate-after-9x16.png` | `c196d222-d5c2-47a2-b983-61798997d24c` | End card hero |
| `assets/hf-swatch-macro-9x16.png` | `79b0360c-7406-4b88-8044-09d1ab64eb8e` | **Stage 1 — the argument** |
| `assets/hf-clients-estate-9x16.png` | `f5241bfb-5da9-4bc2-9aa6-35f2029fdabf` | **GATED — see D-14** |

All four: model `gpt_image_2_5`, aspect `9:16`. References were uploaded from
`orange-county-sales-page/` — the real base photo, the chosen scheme render, and the
couple portrait — so the architecture stays locked to the actual house.

---

## 1 · ESTATE, BEFORE — vertical

Reference: `base.webp`. The dated beige facade, reframed tall.

```
Vertical 9:16 architectural photograph of the exact estate shown in the reference image.
Preserve the architecture exactly: same rooflines, same terracotta tile roof, same two
flanking garage wings, same central recessed entry with the double front door and steps,
same pair of stacked-stone driveway pillars with carved stone urns, same clipped boxwood
hedging and topiary, same wide concrete motor court. Reframe to a vertical composition —
the full facade occupying the upper two thirds, the motor court running out of the bottom
of the frame as clean quiet foreground. Keep the existing BEFORE finish: dated flat
beige-tan stucco body, matching beige trim and fascia, plain off-white flush-panel garage
doors, warm interior light glowing through the windows. Time: blue-hour dusk, deep cobalt
sky gradient, soft even ambient light, no dramatic sun. Full-frame camera, 35mm lens,
f/5.6, one-point perspective, verticals perfectly corrected, no barrel distortion.
Restrained editorial real-estate photography, photorealistic, fine stucco and stone
texture, natural physics. Absolutely no text, no captions, no logos, no watermarks, no MLS
marks, no people.
```

> "no MLS marks" is in there deliberately — the source photo carries a **CRMLS watermark**.
> See D-14 and D-15.

---

## 2 · ESTATE, AFTER — vertical, golden hour

Reference: `scheme-organic.jpg` (Coastal Organic Compound, the chosen scheme).

```
Vertical 9:16 architectural photograph of the exact estate shown in the reference image.
Preserve the architecture exactly: same rooflines, same terracotta tile roof, same two
flanking garage wings, same central recessed entry with double front door and steps, same
pair of stacked-stone driveway pillars with carved stone urns, same boxwood hedging and
topiary, same wide concrete motor court. Reframe to a vertical composition — the full
facade in the upper two thirds, the motor court sweeping out of the bottom of the frame as
clean quiet foreground. Finish: warm off-white lime-wash stucco body in Sherwin-Williams
Alabaster SW 7008, deep bronze fascia, eaves and window trim in Urbane Bronze SW 7048,
western red cedar vertical plank garage doors with visible grain, cream limestone
split-face pillars, oil-rubbed bronze geometric coach pendants glowing warm amber. Time:
late golden hour, low warm sun raking across the stucco, long soft shadows, deep gradient
sky above. Full-frame cinema camera, 35mm lens, f/5.6, one-point perspective, verticals
perfectly corrected. Architectural Digest cover quality, photorealistic, natural physics,
fine lime-wash and limestone texture, deep navy shadows and warm gold highlights.
Absolutely no text, no captions, no logos, no watermarks, no people.
```

---

## 3 · THE SWATCH MACRO — the most valuable of the four

This is Stage 1's entire argument in one frame, and nothing in the library does it.
Three paper chips held flat against an enormous sweep of stucco, with raking light showing
every tonal shift the chips can't predict. The scale is the point: the chips must read as
*tiny*.

```
Vertical 9:16 editorial photograph. A woman's hand, manicured, holding a small fan of three
paper paint swatch cards — one warm off-white, one greige, one deep bronze — up flat
against a very large expanse of warm off-white lime-wash stucco wall. The camera is pulled
back far enough that the swatch cards read as tiny rectangles against an overwhelming sweep
of wall: the wall fills roughly ninety percent of the frame, the hand and cards sit in the
lower left third, small. Late afternoon raking sunlight crosses the stucco from the left,
revealing every trowel mark, every subtle tonal shift and the soft shadow gradient down the
wall, so the flat swatch cards visibly fail to match the wall they are held against.
Full-frame camera, 50mm lens, f/4, shallow-but-not-extreme depth of field, sharp on the
cards. Restrained luxury editorial photography, muted natural palette, photorealistic skin
and paper texture, natural physics. Absolutely no text on the swatch cards, no brand names,
no captions, no logos, no watermarks, no faces.
```

> No face, and no brand name on the chips. A recognisable person would be a claim; a
> readable Sherwin-Williams fan deck would be someone else's trademark in paid media.
>
> Until this lands, Stage 1 makes the same argument with CSS — three chips drawn at true
> scale over the real facade (`swatchProof` in `ads.json`). It works. The photograph
> will work better.

---

## 4 · THE COUPLE AT THE ESTATE — ⚠️ GATED, DO NOT RUN

References: the couple portrait + the chosen scheme render.

**This one is generated but blocked.** `client-stories.json` marks `gallagher-family`
`verified: false`, and `verify-ads.js` fails the build if an ad tries to use client mode.
A rendered photograph of a named couple in front of "their" house, in paid media, is the
exact exposure D-14 exists to prevent. Read D-14 before touching it.

```
Vertical 9:16 editorial lifestyle photograph. The couple from the first reference image —
the same man in his fifties with greying hair and the same blonde woman in her fifties,
faces and likeness preserved exactly — stand together on the wide concrete motor court of
the estate from the second reference image, turned three-quarters toward the camera,
relaxed and quietly pleased, not posed or grinning. He wears an unstructured navy linen
blazer over a white shirt and cream trousers; she wears a soft cream silk blouse and cream
trousers. They are small in the frame, occupying the lower third, positioned left of
centre, with the full estate facade rising behind and above them: warm off-white lime-wash
stucco, deep bronze trim, cedar plank garage doors, stacked cream limestone pillars,
terracotta roof, bronze coach pendants glowing amber. Late golden hour, low warm backlight
rimming their shoulders and hair, long soft shadows across the motor court. Full-frame
camera, 50mm lens, f/4, verticals corrected. Architectural Digest editorial quality,
photorealistic skin texture, natural physics, deep navy shadows and warm gold highlights.
Absolutely no text, no captions, no logos, no watermarks.
```

---

## HOUSE RULES FOR EVERY AD GENERATION

Carried over from `render-queue.md` and the video-production skill, plus what this build
learned:

- **End every prompt with** *"no text, no captions, no logos, no watermarks."* All type in
  a VIP ad comes from the overlay kit, in Fraunces and Inter. Generated lettering is
  unreliable and off-brand, and it will not match the landing page.
- **Grade to navy shadows and gold highlights** so generated plates cut with the eleven
  existing renders.
- **Name the real SW colours with hex codes.** "Alabaster SW 7008 — #EDEAE0" holds; "warm
  white" drifts.
- **Lock the architecture in words**, not just by passing a reference — list the rooflines,
  the garage wings, the pillars. The model will otherwise redesign the house.
- **Never generate a face you intend to present as a client.** See D-14.

---

# CREW AT WORK — the masking and painting plates

Fabian's direction: **his estate, crew in front working, white painter's trousers and plain
white t-shirts.** These fill the two job-site slots in `funnel-3-build`.

**Status: written, not generated.** Higgsfield refused on 2026-09-16 with
*"You've reached the daily generation limit for your grace period"* — hit on `soul_2` and
`gpt_image_2_5` alike, so it is account-wide, not model-specific. Nothing was charged.
Fire these unchanged when the cap resets.

**Settings for all three:** `gpt_image_2_5` · `aspect_ratio: 9:16` · `quality: high` ·
`resolution: 2k` · reference `media_id eda7664a-a47d-425c-aeee-f52d72b18437` (the estate).

**Wardrobe, every shot:** clean white painter's trousers, plain white t-shirt. No logos on
the clothing — a generated logo never matches the real one, and a wrong crest on a crew
shirt is worse than none.

**Faces turned away or in profile, every shot.** These are not portraits, and a
recognisable generated face implies a specific employee who does not exist.

---

## CREW 1 · MASKING — `assets/masking.mp4` slot

```text
Vertical 9:16 documentary photograph of a professional painting crew at work on the exact
estate in the reference image. Preserve the architecture exactly: same rooflines, same
terracotta tile roof, same two flanking garage wings, same central recessed entry with
columns and double front door, same stacked-stone driveway pillars with carved stone urns,
same clipped boxwood hedging, same wide concrete motor court. Two painters in clean white
painter's trousers and plain white t-shirts are masking the house: one kneels at the base of
an entry column running blue painter's tape along a crisp trim edge, the other stands on a
low ladder taping the edge of a window casing. Rolls of tape and folded drop cloths sit
neatly on the motor court beside them. Their work is precise and unhurried, no mess, no
clutter, no spilled paint. Bright clear midday sun, deep blue California sky, hard clean
shadows, the beige stucco facade brightly lit. Full-frame camera, 35mm lens, f/5.6,
verticals perfectly corrected. Editorial documentary photography, photorealistic skin and
fabric texture, natural physics, no motion blur. Absolutely no text, no captions, no logos,
no brand marks, no watermarks, no MLS marks, faces turned away from camera or in profile.
```

## CREW 2 · PAINTING — `assets/painting.mp4` slot

```text
Vertical 9:16 documentary photograph of a painter laying the first coat on the exact estate
in the reference image. Preserve the architecture exactly: same rooflines, terracotta tile
roof, flanking garage wings, recessed columned entry, stacked-stone driveway pillars,
boxwood hedging, wide concrete motor court. A single painter in clean white painter's
trousers and a plain white t-shirt works a wide roller on an extension pole across a broad
stucco wall, seen from behind and slightly to one side. Behind him the wall divides cleanly:
the section he has covered is a warm off-white lime-wash, the section ahead of him is still
the old flat beige, with a crisp wet edge between them. Blue tape lines the trim; a folded
drop cloth and a roller tray sit neatly at his feet. Bright clear midday sun, deep blue sky,
hard clean shadows. Full-frame camera, 50mm lens, f/4, verticals corrected. Editorial
documentary photography, photorealistic fabric and wet-paint sheen, natural physics.
Absolutely no text, no captions, no logos, no brand marks, no watermarks, face turned away
from camera.
```

> The divided wall is the shot. It is the same before/after argument the whole funnel makes,
> happening in one frame, in real life. If only one of these three gets made, make this one.

## CREW 3 · WIDE ESTABLISHING — optional

```text
Vertical 9:16 documentary photograph of a painting crew working on the exact estate in the
reference image. Preserve the architecture exactly: same rooflines, terracotta tile roof,
two flanking garage wings, central recessed columned entry with double front door,
stacked-stone driveway pillars with carved stone urns, clipped boxwood hedging, wide
concrete motor court. Three painters in clean white painter's trousers and plain white
t-shirts work across the facade: one on an extension ladder at the eave line, one masking a
window casing, one carrying a folded drop cloth across the motor court. Equipment is staged
neatly — no clutter, no scaffolding towers, no vans in frame. The full facade fills the
upper two thirds, the motor court runs out of the bottom of the frame. Bright clear midday
sun, deep blue California sky, hard clean shadows. Full-frame camera, 35mm lens, f/5.6,
one-point perspective, verticals perfectly corrected. Editorial documentary photography,
photorealistic, natural physics. Absolutely no text, no captions, no logos, no brand marks,
no watermarks, no MLS marks, faces turned away or in profile.
```

---

## THE UNBLOCKED PATH

Every one of these is a thing **VIP crews do every working day**. Ten seconds of a real crew
taping a real trim line is free, needs no cap to reset, carries no likeness question, and is
the single thing a competitor cannot fake. It also sidesteps the other constraint entirely:
this session's network policy blocks Higgsfield's CDN, so generated assets cannot be pulled
into the repo from here — they have to be downloaded by hand either way.

Generated crew shots are the fallback for when there is no job on the calendar, not the
first choice.
