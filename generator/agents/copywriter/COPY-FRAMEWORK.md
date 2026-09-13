# VIP COPYWRITING FRAMEWORK — HALO · Fascination Bullets · HVCO

Fabian's master framework. This is the **strategic default** that applies before any
city research exists.

**How it relates to the other two files, because all three get confused:**

| File | Job |
|---|---|
| **This file** | The master HALO. What the buyer hopes, fears and hesitates over, ranked. Applies everywhere. |
| `generator/research/_global/HALO-WORKSHEET.md` | The **per-city** version. Demands verbatim quotes with source URLs — no invented quotes, ever. Fills `research/{city}/07-VOICE.md`. |
| `HEADLINE-FORMULAS.md` | The formulas themselves — Part A heroes, Part B HVCO, the bullet bank, the kill test. |

Order of precedence: a real verbatim quote from a city's `07-VOICE.md` **always beats**
the generic driver below. This file is the floor, not the ceiling.

---

## ⚠️ READ THIS BEFORE USING THE NUMBERS BELOW

This framework was written for the **Inland Empire** market. Orange County is a
different buyer, and `context/DREAM-CUSTOMER.md` is emphatic about it:

> "Our buyer is **not price-sensitive**. They are **regret-averse**."
> "Never lead with price or discounts. Lead with certainty."
> "Price is not the objection."
> Price shoppers and three-bids-lowest-wins are on the **disqualify** list.

So two things below do not transfer:

| Written as | On an Orange County page |
|---|---|
| Claire, 42, **Inland Empire** | Same psychology, different tier. OC communities run $3.51M (Orchard Hills) to $9.15M (Hidden Canyon); projects are **$25K–$1M**, not $5K–$10K. |
| Barrier 2: *"Is this the right time to spend $5K–$10K?"* | **Drops to last, or out.** Budget hesitation is a real Inland Empire barrier and a weak OC one. On OC pages the #1 barrier is choice overload, and #2 is trust — not money. |

**Keep the structure. Re-rank the drivers per market.** The hopes and the fears transfer
almost unchanged; only the money barrier moves.

---

## 1 · HALO — the emotional drivers

### Hopes & dreams

| Rank | Core desire | Emotional trigger |
|---|---|---|
| 🥇 | "I want my home to look elegant and feel like me." | Pride, personal expression |
| 🥈 | "I want to increase my home's value and curb appeal." | Confidence, ROI mindset |
| 🥉 | "I want it to feel clean, updated and timeless." | Fresh start, peace, harmony |

### Pains & fears

| Rank | Main frustration | Emotional trigger |
|---|---|---|
| 🥇 | **"What if I pick the wrong color and regret it?"** | Anxiety, perfectionism |
| 🥈 | "I don't trust most painters to show up or do it right." | Skepticism, past bad experiences |
| 🥉 | "I hate hidden fees or unclear estimates." | Financial stress, distrust |

> The 🥇 fear **is the offer**. Everything VIP sells exists to remove it. If a headline
> is not touching that fear, ask what it is doing on the page.

### Barriers & uncertainties

| Rank (OC) | What stops them | Emotional trigger |
|---|---|---|
| 🥇 | "I'm overwhelmed by too many color choices." | Indecision, visual doubt |
| 🥈 | "I don't know who to trust with this big of a job." | Risk aversion, fear of mistakes |
| 🥉 | *(Inland Empire only)* "Is this the right time to spend $5K–$10K?" | Budget hesitation |

---

## 2 · FASCINATION BULLETS

For funnels, ads, reels, CTA copy. **Never for a page H1** — these are hooks, not
headlines.

- The one image that gave them total color confidence — and ended the debate.
- Why swatches and sample jars are a trap, and what our design team uses instead.
- The mistake that costs the whole job twice — and the 30 minutes that prevents it.
- The simple 3-step system that eliminates color regret.
- What the paint brands will not show you on a two-inch card — but we will, on your house.
- Nine of ten homeowners choose a color they have never seen on their own facade.

### What was changed from the original list, and why

Three bullets in the source list cannot run as written. Not style notes — these are
build-enforced rules in `CLAUDE.md` and the gate fails on them:

| Original | Problem | Replacement |
|---|---|---|
| "Visualize Your Perfect Home for **FREE**" | **"Free" is banned.** Always "complimentary". | "…with a complimentary 30-minute consultation" |
| "How **Miguel & Karla** made their decision in 30 minutes" | **Never invent a client story.** If they are real and consented, it runs; if it is a composite, it cannot. | Use a real one from `registry/client-stories.json`, or drop the names |
| "The **$1,000** mistake most homeowners make" | Unverifiable as stated, and it undersells — a wrong color on an OC estate costs far more than $1,000. | "The mistake that costs the whole job twice" |

---

## 3 · HVCO HEADLINE TEMPLATES

These are Part B in `HEADLINE-FORMULAS.md`. Repeated here so the framework reads whole.

| | Template | Example |
|---|---|---|
| **B1** | X Ways to [Outcome] Without [Pain] | "3 Ways to See Your Home's Perfect Color Scheme Without Buying 10 Paint Samples" |
| **B2** | How to [Solve] in [Timeframe] Without [Negative] | "How to Visualize Your Home's New Look in 30 Minutes Without Guessing" |
| **B3** | X Costly Mistakes Before [Action] | "5 Mistakes to Avoid Before Choosing a House Color" |
| **B4** | The [Identity]'s Guide to [Desire] Without [Fear] | "The HOA Board's Guide to a Repaint Vote Nobody Regrets" |
| **B5** | Avoid [Risk] — Get [Outcome] With This Complimentary [Service] | "Avoid a Costly Repaint — See Your Home in Every Palette First" |

Where each one goes, and which community tier gets which, is Part D of
`HEADLINE-FORMULAS.md`.

---

## 4 · THE NUMBER RULE

**The gap Fabian identified: the hero formulas had no numbers in them.**

A number does three things no adjective does — it forces attention, it implies precision,
and it is checkable. Which is also the catch.

**Every headline should carry a number where one is true.**

Numbers we can use, because they are verifiable:

| Number | Source |
|---|---|
| **30 minutes** | the consultation length, `context/OFFER.md` |
| **2 years** | the warranty, `communities.json → config.warranty` |
| **11** | color schemes in the visualizer |
| **3** | renders returned per consultation |
| **5 days** | the Gallagher project, where the story is real |
| **60 / 30 / 10** | the palette ratio |
| **twice** | what a wrong color costs — true at any price |

Numbers we may **not** use: project counts, review counts, star ratings, or any
percentage without a citation. `CLAUDE.md` bans all of them and `verify-site.js` fails
the build.

> **"Twice" is the strongest number in the set.** It needs no citation, it holds whether
> the job is $25,000 or $250,000, and no competitor can argue with it.

---

## 5 · THE KILL TEST

Applies to everything in this file.

> **Could a competitor put their logo on this unchanged?**
> If yes, rewrite it.

"Quality workmanship." "Affordable prices." "Experienced and professional." All fail.
"You will see your own home in every candidate color before a single brushstroke" passes,
because across ~50 painters in Irvine and Anaheim, **zero** carry a review tag about
visualization (`context/OFFER.md`, verified 2026-07-27).
