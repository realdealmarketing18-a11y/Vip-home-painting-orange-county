# READY TO FIRE — queued generations, blocked on the daily cap

Both are fully specified and verified against the asset library. Nothing here needs
re-deciding; these run as-is the moment the Higgsfield daily generation limit resets.

> **The constraint that splits these into two calls:** a trained Soul works only with
> `soul_2` / `soul_cinematic`, and those models do **not** accept reference elements.
> Elements work on Seedance 2.0 / Nano Banana / GPT Image, which do **not** accept a Soul.
> One Soul per generation, always. This is both the tool spec and Rule 2 of
> `vip-seedance-shotlist-director`. They can never be combined in a single call.

---

## GEN 1 — Solo host shot (Soul V2, maximum face fidelity)

| | |
|---|---|
| Model | `soul_2` |
| Soul | `f4c34e15-6b2e-4d65-a919-6f830811e4a7` — "Fabian New" |
| Elements | **none** — not supported alongside a Soul |
| Aspect | 16:9, count 2 |

**Prompt**

```
Photorealistic commercial portrait, live-action photographic realism, NOT CGI, NOT a 3D
render. Completely bald, fully shaved head. Clean-shaven, no facial hair. Powerfully built,
heavily muscular — broad shoulders, thick chest, large arms. Fitted white cotton polo tucked
in, white painter's pants, white belt with a polished gold buckle. He stands relaxed and
confident on the paved driveway of a large Mediterranean estate home, terracotta tile roof,
stone pillars and topiary softly out of focus behind him, warm late-afternoon sunlight from
camera-left. Medium shot, chest up, 85mm lens, shallow depth of field. Skin: anti-plastic,
pore-level realism, real matte skin texture, NOT glossy, NOT waxy, NOT smoothed. Calm
confident expression, arms relaxed at his sides. Fine film grain, crisp real shadows, natural
physics. No text, no watermarks.
```

**Why no face description:** the Soul owns the face. Describing bone structure, eyes or jaw
makes the model synthesise a generic plausible face instead of the trained identity — that is
Rule 1, and it is the single most common cause of drift. Hair, build and wardrobe are stated
explicitly because if they are left unpinned the model invents them.

---

## GEN 2 — Multi-character consultation (Elements, Seedance-family)

| | |
|---|---|
| Model | element-capable image model (`nano_banana_pro` or `gpt_image_2`) |
| Soul | **none** — not supported alongside elements |
| Aspect | 16:9, count 2 |

**Elements embedded as `<<<uuid>>>` placeholders in the prompt:**

| Element | id | Role |
|---|---|---|
| `fabian-5` | `358353f5-234e-4cb6-9bd5-940060b81e16` | Fabian — FINAL locked sheet, supersedes Fabian-4 / VIP-Canonical / Real-v2 |
| `Gallaghers-Canonical` | `17c21011-6c77-4d0e-b2c3-b5b5be79ca07` | Richard & Elizabeth Gallagher, always a couple |
| `kitchen` | `3d9d15fe-481b-4aaf-8d7a-fe20fe7bf2e3` | Real kitchen, 14 Pelican Hill Road. Its own description says: use as soft-focus backdrop behind talent, **not** a sharp wide hero |

**Prompt**

```
<<<358353f5-234e-4cb6-9bd5-940060b81e16>>> stands at the marble island in
<<<3d9d15fe-481b-4aaf-8d7a-fe20fe7bf2e3>>>, turning a tablet toward
<<<17c21011-6c77-4d0e-b2c3-b5b5be79ca07>>>, who are seated together on the stools beside him.
Photorealistic editorial commercial photography, live-action realism, NOT CGI, NOT a 3D
render. Bright natural daylight from the courtyard window, crisp real shadows. Everyone is
separated in the frame with clear space between them — nobody overlaps, nobody crosses in
front of anyone. Calm, warm, unhurried. Skin: anti-plastic, pore-level realism, real matte
skin texture, NOT glossy, NOT waxy. 35mm lens, shallow depth of field, the kitchen soft
behind the talent. Fine film grain. No text, no readable screen content, no watermarks.
```

**Why they are held apart in frame:** Higgsfield's own guidance is that identity blurring
appears *at intersection points* — where two faces overlap or physically interact. Staging
with clear separation is the difference between this working and smearing.

---

## GEN 3 — The before/after swipe (queued next, zero identity risk)

| Element | id |
|---|---|
| `villa_before` | `871c31ac-160a-4841-a262-ebc4ee199f5d` |
| `villa_after` | `0a0877cd-fe9e-4baf-80bf-106e3e3d3129` |

These two were built lighting-matched to each other specifically for a clean before/after
reveal — `villa_after`'s own description says so. No people in frame, so no identity risk at
all, which makes this the cheapest and most reliable shot in the whole commercial. It is the
swipe Fabian asked to bring back.

---

## Still outstanding

- **The real estimate document.** No template exists anywhere in the repo — searched. Needed
  as a screenshot or PDF with client details blanked. The model cannot render readable text
  (proved: Scene 4 came back as garbled pseudo-words), so the real document gets composited in
  post. That is also what makes it look exactly like what a client receives.
- **Which Fabian identity is current.** Three candidates are live at once: Soul `f4c34e15`
  ("Fabian New", named canonical in the skill doc), Soul `059bc269` ("Fabian"), and element
  `fabian-5` which claims to supersede three earlier Fabian elements. Worth settling before
  more assets are built on the wrong one.
- **The unverified-client flag.** `FUNNEL-3-STEP-ADS.md` and `STORY-SLOTS.md` still carry the
  Gallaghers as unverified and barred from ads. Fabian has since confirmed they are real
  clients who gave permission; those two documents should be updated to match, or the rule
  keeps re-tripping in later sessions.
