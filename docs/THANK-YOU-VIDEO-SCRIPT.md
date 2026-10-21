# Thank-You Page Video — Script

**Where it plays:** the video player at the top of `/thank-you/`, right under Fabian's note.
**Who's watching:** a homeowner who has *just* sent a photo of their home — interior, exterior or
both. They're already in. The job is not to sell them; it's to **make them excited for what's
coming and make sure they recognise Fabian's text when it arrives.**
**Built from:** the three page sections taken down on 2026-10-21 (What happens next · What your
renders will look like · The paint-chip gamble vs the VIP way). Language from
`generator/research/orange-county/07-VOICE.md`. Headline rules from
`generator/agents/copywriter/HEADLINE-FORMULAS.md` (Part 0 + Part F).

---

## How the page plays it — this shapes the whole script

1. **First, silently, on a loop.** The video autoplays **muted** the moment the page opens.
   Most people will only ever see it this way. → **Every beat carries its point in on-screen
   text.** The voiceover adds warmth; it never carries a point the text doesn't.
2. **Then with sound** when they tap the gold button. It restarts from 0:00 with Fabian's voice.

| Spec | Value |
|---|---|
| Length | **~70 seconds** (longer than a 15–30s reel on purpose — this viewer has already converted and wants to know what happens) |
| Shape | **16:9**, to fill the player on the page. A 9:16 cut can come later for reels. |
| Text | Burned-in captions on every beat, large enough to read on an iPhone at half-screen width |
| Voice | Fabian, first person — matches his note directly above the player |
| File | `thank-you/assets/project-steps.mp4`, under ~8 MB so it starts fast on 5G. Then set `VSL.src` (see `docs/HANDOFF.md` §0b) |

---

## 1 · Headline candidates for the opening text (0:00–0:04)

Ten drafts, nine killed. Every one is sourced from `07-VOICE.md`.

| # | Candidate | Formula | Sourced from (verbatim) |
|---|---|---|---|
| 1 | **A 2×2 swatch can't tell you what 3,000 sq ft will look like. You just skipped the guess.** | F5 (common belief is wrong) | "now I know I should have painted even bigger swatches?" |
| 2 | She did everything right. The house still came out wrong. You won't. | F8 (story) | "I really determined not to make a rookie mistake on this, and yet here I am." |
| 3 | Why paint chips are the worst way to choose a color — and what happens to yours instead | F5 | "Weeks of research, paint swatches, samples…" |
| 4 | 3 steps between your photo and a color you'll never second-guess | F1-shape (number + outcome) | "it is so permanent and I tried so hard to get this right" |
| 5 | How to know your color is right without repainting to find out | F3 | "is there any way it can be salvaged or minimized?" |
| 6 | The truth about why a swatch looks perfect and the house looks yellow | F7 | "I'm afraid it does look QUITE yellow." |
| 7 | What you should never do before 3,000 square feet of paint goes up | F6 (loss) | "it is so permanent" |
| 8 | Nobody has to sneak out and repaint one panel at a time | F7-shape | "Do I just sneak out when nobody's looking and repaint the entire thing…" |
| 9 | Your home, in every palette, before a single can is opened | — (no formula — fails Rule 1) | — |
| 10 | Here's exactly what happens to the photo you just sent | — (signpost, not a headline) | — |

**The one to run: #1.**
- It's the strongest finding in the research, in her own words: the careful method — swatches
  — is the one that fails. Nobody else in this market says it.
- It flips straight into relief: *you just skipped the guess.* Right for someone who has already
  sent a photo.
- **Kill test:** a competitor can't put their logo on it. They all sell swatches.
- Runner-up: #2 for a story-led cut. #9 and #10 fail the formula rule.

---

## 2 · The script, beat by beat

`ON SCREEN` = burned-in text (this is what the muted viewer gets).
`VO` = Fabian's voiceover (the sound version).
`PICTURE` = what's on screen. `[ASSET NEEDED]` = we don't have it yet. `[VERIFY]` = can't go live
until confirmed.

### BEAT 1 · HOOK — 0:00–0:04

| | |
|---|---|
| PICTURE | A small 2×2 ft paint swatch on a big stucco wall. Hold, then pull back so the swatch shrinks to nothing against the whole house. `[ASSET NEEDED — shoot or render]` |
| ON SCREEN | **A 2×2 swatch can't tell you what 3,000 sq ft will look like.** |
| VO | "A two-foot swatch can't tell you what three thousand square feet will look like." |

### BEAT 2 · THE GAMBLE YOU SKIPPED — 0:04–0:14

| | |
|---|---|
| PICTURE | Quick cuts, desaturated: chips taped to a wall · harsh midday sun on a facade · a crew truck pulling away. |
| ON SCREEN | Four lines, one per cut: **Tiny swatches taped to the wall** · **Guessing how it looks in full sun** · **Finding out after the crew leaves** · **Paying to repaint** |
| VO | "Most people tape up chips, guess how it'll look in full sun, and find out after the crew leaves. And if it's wrong, the second paint job costs what the first one did." |

*Optional, real quote, on screen for 2 seconds:* "Frankly I've been feeling sick about it,
because it is so permanent." *— a homeowner, Houzz.* Use it as text only. No dramatisation, and
never present it as a VIP client.

### BEAT 3 · THE TURN — 0:14–0:18

| | |
|---|---|
| PICTURE | Color returns. A phone screen: a photo of a house being sent. |
| ON SCREEN | **You sent a photo instead. Here's what happens next.** |
| VO | "You did it the other way. You sent us a photo. Here's what happens next." |

### BEAT 4 · STEP 01 — YOUR RENDERS — 0:18–0:40 *(the heart of the video)*

| | |
|---|---|
| ON SCREEN (holds through the beat) | **01 · Your renders** — your home, inside, outside or both, in your three closest palettes |
| VO | "Our design team takes your photo and renders your actual home — inside, outside, or both — in the three palettes closest to your style. Color schemes, and the additions too: lighting, stone, the garage door." |

**Exterior demo (0:20–0:30)** — assets already exist in `orange-county-sales-page/viz-photos/`:

| Shot | File | On-screen label |
|---|---|---|
| The phone photo | `base.webp` | **The phone photo** |
| Palette A | `scheme-organic.jpg` | **Palette A — Coastal Organic Compound** · Alabaster SW 7008 · Urbane Bronze SW 7048 + 3 paint cans |
| Palette B | `scheme-pebblebeach.jpg` | **Palette B — Pebble Beach Manor** · Accessible Beige SW 7036 · Dover White SW 6385 + 3 paint cans |
| + an addition | `light-led-slot-sconce--organic.jpg` | **+ Lighting** |

Slow dissolves between them, so it feels like one house changing color, not a slideshow.

**Interior demo (0:30–0:40)** — `[ASSET NEEDED]`: one real room. Phone photo → Palette A →
Palette B, same treatment and labels (wall · trim · accent cans, SW names). **This is the one
missing piece that makes the video work for interior leads.** If it isn't ready, ship the
exterior-only cut first and add the room later.

> Rules: a colour on screen is **three paint cans** (body, trim, accent), never a flat chip.
> Colours are cited `Name SW 0000`.

### BEAT 5 · STEP 02 — A TEXT FROM FABIAN — 0:40–0:50

| | |
|---|---|
| PICTURE | An iPhone lock screen. A text arrives from **[QUO NUMBER]** with a render attached. Thumb taps it open. |
| ON SCREEN | **02 · A text from Fabian** — from [QUO NUMBER]. Save it so you know it's us. |
| VO | "When your renders are ready, I text them to you myself, from this number. Save it, so when it comes through, you know it's me." |

`[VERIFY]` the Quo number before this beat is rendered — it's baked into the picture.

### BEAT 6 · STEP 03 — YOUR CONSULTATION — 0:50–1:02

| | |
|---|---|
| PICTURE | A tablet on a kitchen table: two renders side by side. A family's hands pointing. Then an itemized estimate sheet, line by line. No faces needed. |
| ON SCREEN | **03 · Your 30-minute color consultation** — compare palettes side by side, get your itemized estimate |
| VO | "Then we sit down for thirty minutes. You compare your palettes side by side, with your family at the table, and you get an itemized estimate — every surface, line by line." |

`[VERIFY]` — the page used to add "with monthly payment options on approved credit." It's not in
`context/OFFER.md`. **Leave it out of the video unless Fabian confirms financing is offered.**

### BEAT 7 · THE PAYOFF — 1:02–1:08

| | |
|---|---|
| PICTURE | The finished, painted house in real daylight. `[ASSET NEEDED — a real photo of a finished job]`. **Never use a render here.** A render shown as "what we painted" is a false claim. Until a real photo exists, hold on the Palette A render labelled **Your render**, not "finished." |
| ON SCREEN | **Paint once. Love it forever.** |
| VO | "Paint once. Love it forever." |

### BEAT 8 · THE ASK — 1:08–1:12 *(one action only)*

| | |
|---|---|
| PICTURE | Fabian, or his name card on navy with gold, and the number large. |
| ON SCREEN | **Save our number: [QUO NUMBER]** · *Tap "Save Our Number" below* |
| VO | "Save our number. I'll talk to you soon." |

**The one action is: save the number.** Not "call us", not "book a time", not "follow us". The
gold *Save Our Number* button sits right under the player, and the text from Fabian is the next
real event. Two asks get neither.

---

## 3 · Before this goes into production

| Item | Status | Owner |
|---|---|---|
| Quo texting number (Beats 5 and 8) | `[VERIFY]` — needed before render | Fabian |
| Fabian approves the VO lines — they're his voice | `[VERIFY]` | Fabian |
| One real interior room: phone photo + 2 renders | `[ASSET NEEDED]` | Design team |
| One real finished-job photo (Beat 7) | `[ASSET NEEDED]` — until then, Beat 7 holds on a render labelled as a render | Fabian |
| Swatch-on-stucco opener + gamble cutaways (Beats 1–2) | `[ASSET NEEDED]` — shoot, or render with Higgsfield | Production |
| Financing line | Out unless confirmed | Fabian |
| `base.webp` carries a **"CRMLS"** watermark (likely a listing photo) | Crop it out or confirm the right to use it | Fabian |

**Never on screen or in the VO:** "free" (say *complimentary*) · "AI" (say *our design team*) ·
review counts or star ratings · any client story or name not cleared in
`generator/registry/client-stories.json` · "VIP Home Painting" as the opening words.
