# VIP BRAND AD PACKAGE

The ad half of the brand. Same navy, gold and cream as the sales page, same Fraunces
and Inter, same before/after plate — rebuilt to run as paid social.

**One sentence:** the numbers and words live in two JSON files, the look lives in one
HTML file, and `render.js` turns them into finished MP4s. Change a word, re-run one
command, every ad updates.

---

## THE THREE ADS

The funnel is the Gallagher episode (`NB-002`) compressed. The episode is 8 scenes and
five minutes; nobody watches five minutes of a painting ad cold. So it is split by how
warm the viewer is, and each stage is a 15-second cut that also runs hook → demo → CTA
inside itself.

| Stage | Who sees it | From the episode | The job |
|---|---|---|---|
| **1 · Hook** | Cold | Scene 3, The Struggle | Name the fear. No offer. |
| **2 · Demonstration** | Watched 50%+ of Stage 1 | Scenes 5–7, the three steps | Prove the method. **This is the strongest thing VIP owns.** |
| **3 · CTA** | Site visitors, 30 days | Scene 8, Result + CTA | Remove the price objection, ask. |

**Stage 2 is the hero.** Every competitor *claims* visualization. CertaPro claims it on
their Irvine page with no tool on the page. VIP can put eleven renders of one real house
on screen in ten seconds. Claiming beats nothing; demonstrating beats claiming.

### Message match — the thing that makes or breaks it

Stage 1 ends on *"the only thing that predicts your house is your house."* That line is
also the lede of section two on the Orange County page. Keep it that way. If the ad and
the landing page open on the same sentence, the click feels like continuing. If they
don't, it feels like being sold to twice.

Point Stage 3 at the page **with the pricing band in view**, not at the top, so the
promise in the ad is the first thing on screen.

---

## RUN IT

```bash
cd ad-system
npm install                    # once

node render.js                 # the hero cut: Stage 2, 9:16
node render.js --all           # all 3 stages x 3 formats = 9 MP4s
node verify-ads.js             # THE GATE - run before anything spends money
node render.js --preview       # opens a scrubable URL in your browser
node render.js --still=8.9     # one frame, to check a look without a full render
```

Output lands in `ad-system/out/` as `vip-<stage>-<format>.mp4` plus a `-poster.jpg`
for Meta's thumbnail picker. Frames are deleted after muxing (they are 900 MB a render);
pass `--keep-frames` if you want them.

**Formats:** `reel` 1080×1920 (Reels, Stories, TikTok) · `square` 1080×1080 (feed) ·
`wide` 1920×1080 (YouTube, site loop).

---

## THE OVERLAY KIT

Thirteen pieces. All of them are already in the sales page's visual language — this is
that language sized for video, not a new one.

| Overlay | What it is | Where it comes from |
|---|---|---|
| **Gold frame** | Hairline gold border, second rule inside it, four corner ticks | the page's `hero-goldframe` |
| **Fleuron** | Gold diamond on a split rule | the page's `hero-fleuron` |
| **Ruled eyebrow** | Letterspaced caps between two gold rules | `eyebrow-ruled` |
| **Title** | Fraunces, with a gold italic line underneath | `ttl-hero` + `.gold` |
| **Plate** | The 16:9 before/after instrument | `hr-plate` |
| **Seam + knob** | Lit gold edge with the round grip, sweeping the repaint | `hr-seam` / `hr-knob` |
| **Nameplate** | Swatch chip + scheme name + the two SW colours | `hr-nameplate` |
| **Counter** | `04 / 11` | `hr-counter` |
| **Stamp** | "The direction they chose" | `hr-stamp` |
| **Palette strip** | All 11 schemes as chips, the live one lit | new — makes "eleven" visible |
| **Beats** | 1 They visualized it · 2 They loved it · 3 We painted it | `hero-beats` |
| **Estimate card** | Itemised lines + the starts-at price | new — Stage 3's whole argument |
| **End card** | Wordmark, CTA, phone, tagline, warranty, house dissolving up behind | new |

### Two details worth keeping

**The ornament is drawn, not typed.** `❧` (U+2767) renders as a bird-shaped blob at small
sizes and changes per machine on font fallback. It is CSS now.

**The plate is 16:9 and must stay 16:9.** `base.webp` is 3:2 and the eleven scheme renders
are 16:9 — they only line up when both are cropped to 16:9, which the sales page gets for
free from `background-size: cover`. Any other plate aspect and the house jumps between
before and after. `assets/base-16x9.jpg` bakes that crop in.

---

## HOW THE ENGINE WORKS

`ad.html` draws exactly one frame, for exactly one moment, from the URL:

```
ad.html?ad=stage2-demonstration&t=4.20&format=reel&mode=method
```

`t` is the only thing that moves anything. Every fade and every wipe is computed from it
by hand — no CSS transitions, no `requestAnimationFrame`. That is deliberate: per
`CLAUDE.md` GOTCHAS, rAF never fires in a headless pane and transitions never settle, so
anything animated screenshots as a phantom. Frame 104 looks the same whether you render
it first, last, or on its own.

`render.js` serves the repo over local HTTP (so the page can fetch its JSON), walks
`t` from 0 to the duration at 30fps, screenshots each frame, and hands them to ffmpeg.

**The sweep alternates direction.** Scheme 1 wipes left-to-right, scheme 2 right-to-left,
and so on. A repeated one-way wipe has to snap back to the start between schemes, which
reads as a glitch; alternating reads as a roller going back and forth over the same wall.
Each wipe starts from whatever the house was last painted, not from the original.

---

## EDITING

**To change what an ad says** — `ads.json`. Each scene owns a slice of the timeline and
carries its own `eyebrow`, `title`, `titleGold`, `caption`. Scene times must be
contiguous and add up to `duration`; the gate checks this.

**To change a fact** — `brand.json` → `facts`. Phone, warranty, tagline, the starts-at
price, the scheme count. Nothing is typed into the template.

**To change the house** — `brand.json` → `schemes` and `paths.viz`. Point it at another
city's renders and all three ads rebuild around that house.

**To change the look** — `ad.html`, sections 1–11 of the stylesheet, which are labelled.

---

## THE GATE

```bash
node verify-ads.js
```

Ad copy is where the hard rules get broken, because it is written fast and it is the one
surface nobody re-reads before it spends money. The gate is `verify-site.js` for paid
media. It exits 1 and prints exactly what is wrong. It checks:

- **Banned words** — never *free* (→ complimentary), never *AI* (→ our design team /
  Custom Visualization Service), never *cheap / discount / budget / stress-free*, never
  *stunning* or *jaw-dropping*, which read downmarket to this buyer.
- **No rating or review claims.** VIP has 9 reviews and the rating is unconfirmed. A false
  one has already reached a live page twice.
- **Phone** — any number that appears must be (909) 312-5400.
- **Warranty** — 2 years, and never "longer than the competition" (CertaPro also has 2).
- **Price** — must be *"VIP starts at $4.75 per square foot of paintable surface"*, never
  an average.
- **The client gate** — below.
- **The plate source** — refuses the raw watermarked `base.webp`.
- **Timelines** — no gaps or overlaps.

It was tested against nine deliberate violations and caught all nine.

---

## ⚠️ THE CLIENT GATE — READ BEFORE SPENDING A DOLLAR

**The ads ship in `method` mode, and that is the only mode cleared to run today.**

`generator/registry/client-stories.json` marks `gallagher-family` as **`verified: false`**
— *"Higgsfield-rendered imagery — confirm real-client status before reuse."* And the
source photograph of the property carries a **CRMLS watermark**, which means it came from
an MLS listing, not a VIP job file.

The sales page can carry the Gallaghers because it is VIP's own page. **A paid ad naming a
family as a VIP client is a different exposure**, and so is putting their portrait in it.

| Mode | What it shows | Status |
|---|---|---|
| **`method`** *(default)* | "A Newport Beach estate · Custom Visualization Service session". No name, no portrait. | **Cleared.** Every claim it makes is provable — eleven renders of one house exist. |
| **`client`** | "The Gallagher Family · Pelican Hill, Newport Beach" + portrait | **Blocked.** The gate fails the build. |

To open it, both must be true:
1. `client-stories.json` sets `gallagher-family.verified: true`
2. A signed likeness and testimonial release is on file

Then set `brand.json` → `clientGate.client.verified: true` and render with `--mode=client`.
Nothing else changes — the same overlay slot fills with the pill instead of the
location line.

**Also worth knowing:** the watermarked `base.webp` is the "before" side of the reel on
the live Orange County page too. The ad system crops around it; the page does not. Worth
a look separately.

---

## WHAT THESE ADS DO NOT SAY

Three things from the research that are off-limits, and why:

- **The $12,000–$15,000 repaint figure.** `07-VOICE.md` marks it `[VERIFY]` and says to
  replace it with a real closed job first. *"Costs the whole job twice"* is the safe
  version — it needs no citation and holds at any price.
- **The Houzz homeowner's words.** They are the source of these angles, not testimony VIP
  owns. Quoting her would present a stranger as a VIP client.
- **Anything about ratings.** See the gate.

---

## MEDIA PLAN

| | Stage 1 | Stage 2 | Stage 3 |
|---|---|---|---|
| Objective | ThruPlay | Landing page views | Leads |
| Audience | Cold — OC, $2M+ home value, Architectural Digest / interior design interests | Watched 50%+ of Stage 1 | Site visitors 30d + Stage 2 engagers |
| Budget split | 50% | 30% | 20% |
| Destination | — | `/` | `/` at the pricing band |
| Primary metric | 50% view rate | CTR + time on page | Cost per consultation booked |

Run Stage 1 alone for the first week to build the retargeting pool. Stages 2 and 3 have
nobody to talk to until it exists.

**Post copy for each ad is in `ads.json` → `captionCopy`.** Stage 1 also carries
`altHooks` — three variants to test against each other.

---

## FILES

```
ad-system/
  BRAND-AD-PACKAGE.md   this file
  brand.json            tokens, facts, banned words, the 11 schemes, the client gate
  ads.json              the three timelines + post copy
  ad.html               the overlay kit and the engine
  render.js             frames -> MP4
  verify-ads.js         the gate
  fonts/                Fraunces + Inter, vendored so renders never depend on the network
  assets/base-16x9.jpg  the registered, un-watermarked before plate
  out/                  rendered MP4s and posters (gitignored)
```

The eleven scheme renders are **not** copied here — they are read from
`../orange-county-sales-page/viz-photos/`. One house, one set of renders, used by both
the page and the ads.
