# VIZ-RENDER — turning a Step 5 upload into three renders and an estimate

The Custom Visualization Service, run as a pipeline instead of by hand.
A homeowner uploads their elevation at Step 5 of the visualizer; this
turns that into a Higgsfield job pack, three renders, and the estimate
that follows them.

**Nothing here submits on its own.** `build-jobs.js` is a dry run by
design — it writes prompts and a job pack and stops. Submitting is a
separate, deliberate step. That is the guard that keeps a bad template
from spending a hundred credits before anyone reads it.

---

## THE CHAIN

```
Step 5 upload            →  intake/{ref}/intake.json + elevation.jpg
build-jobs.js            →  packs/{ref}.json   (3 prompts, dry run)
Higgsfield, image-to-image →  renders/{ref}--{scheme}.jpg
QA gate (below)          →  pass or re-run
delivery                 →  the three renders, to the homeowner
estimate                 →  itemized, after the renders land
```

The order matters and is not negotiable: **renders first, estimate
second.** The renders are the thing they asked for; the estimate is the
thing we want. Leading with the estimate turns a service into a pitch
and spends the goodwill the renders just bought.

---

## 1 · INTAKE

Step 5 posts a photo, an address or community, one contact field, and
the selections the visitor was playing with. Land it as:

```
generator/viz-render/intake/{ref}/
  intake.json      { name, contact, address, community, photo,
                     scheme, lighting, siding, premium, submitted_at }
  elevation.jpg    what they uploaded
```

Only `photo` and `scheme` are required to build a pack. Everything else
improves the reply.

**Reject at intake, not after rendering:** no front elevation visible,
heavy obstruction (parked car, tree covering the facade), night shot, or
under ~1000px wide. A bad source photo cannot be rescued by a good
prompt, and a weak render is worse than a phone call asking for a better
picture.

## 2 · BUILD THE PACK

```bash
node generator/viz-render/build-jobs.js --intake=generator/viz-render/intake/{ref}/intake.json --print
```

`--print` writes every prompt in full to the terminal. Read them before
you spend anything.

**Which three they get:** their pick, then the two nearest palettes by
body colour, with the same style family favoured. Colour distance rather
than list order, because Santa Barbara Luxe is the only Spanish Revival
scheme and list order handed a client who chose chalk white the two
blackest palettes we sell.

## 3 · SUBMIT

Image-to-image off their elevation, one job per scheme, prompt and
negative prompt straight from the pack. Engine per `schemes.json`:
Higgsfield Nano Banana Pro / Nano Banana 2 — the same engine that
produced `viz-photos/`, so the house style already matches the site.

Submit the **first job alone** and look at it before releasing the other
two. One render tells you whether the source photo and the template got
along; three tell you the same thing at three times the cost.

## 4 · THE QA GATE

A render ships only if every line is true. This is the same standard the
site's own gates hold — if you cannot verify it, do not send it.

- [ ] It is unmistakably **their** house: roofline, windows, garage count
      and position, driveway, planting all unchanged
- [ ] Same camera position, framing and crop as the source
- [ ] Same time of day, sun angle and shadow direction as the source —
      **no drift to dusk or golden hour**
- [ ] Paint is continuous across every wall plane, returns and soffits
      included; no untouched patch
- [ ] Trim lines are clean and straight; no bleed, no warped edges
- [ ] Nothing invented: no added storey, no new landscaping, no people,
      no cars, no text
- [ ] The body colour reads as the named Sherwin-Williams colour in
      daylight, not a near-miss

Two failures on the same source photo means the photo is the problem.
Ask for a better one rather than burning a third attempt.

## 5 · DELIVER, THEN ESTIMATE

Send the three renders with the palette names and the Sherwin-Williams
pairings — the pairing is the proof that this is a specification and not
a filter. Then the itemized estimate: prep, primer, coating, trim,
accents, priced line by line, per `context/OFFER.md`.

**The turnaround stated on the Step 5 button is a promise.** A homeowner
who uploads their house and hears nothing is worse off than one who
never had the option, and the damage is to the one position no
competitor can copy. Only publish a number the pipeline hits every time.

---

## TESTING BEFORE ANY OF THIS GOES LIVE

Run in this order. Stop at the first failure.

**T1 · Control — does the template reproduce what we already have?**
Source `orange-county-sales-page/viz-photos/base.webp`, scheme
`spanish`. The correct output is something very close to the existing
`scheme-spanish.jpg`. If the template cannot re-make a render we already
own, it will not survive a stranger's phone photo.

**T2 · Daylight — the real risk.**
Every render in `viz-photos/` came off one professionally-shot dusk
photograph. Intake will be midday phone photos: flat light, harsh
shadows, blown sky. Run T1's scheme against a daylight photo of the same
kind of house and check the MATCH THE SOURCE block held. This is where
the template is most likely to break.

**T3 · Awkward source.**
Off-angle, partially obstructed, or narrow-lot photo. Confirms the
intake rejection rules in §1 are drawn in the right place.

**T4 · End to end, on a house we own.**
Fabian's own home or a completed job: upload through Step 5, build,
submit, QA, deliver, estimate. Time it. **That measured time is the
number that goes on the button** — not an aspiration.

Log each result in `generator/research/_global/MEMORY.md` under the
repair-loop convention: what failed, what changed, what rule was learned.

---

## WHEN THE TEMPLATE CHANGES

`orange-county-sales-page/COLOR-SCHEMES.md` is the master reference for
the eleven schemes. `schemes.json` is the machine-readable copy that
feeds the prompts. **Change both in the same commit** — a scheme that
drifts between them puts the wrong Sherwin-Williams number in front of a
client, and that is a number they may buy paint against.

## STILL TO BUILD

Submission is manual today. Headless submission needs a Higgsfield API
credential wired as an environment variable — never in the repo — plus a
poller for job completion. `build-jobs.js` already emits everything such
a runner would need, so it is an add-on and not a rewrite.
