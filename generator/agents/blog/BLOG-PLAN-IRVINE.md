# IRVINE BLOG PLAN — the pillar + 9 articles

Every title uses a formula from `HEADLINE-FORMULAS.md`. Every topic answers a question
someone actually asked. Each entry ends with a **copy-paste prompt** — open a new window,
paste it, and it has everything needed.

**Read `BLOG.md` first.** Especially the cannibalization rule.

---

## STATUS — 2026-07-30

| | Article | State |
|---|---|---|
| — | `/irvine/guide/` (pillar) | ✅ **live** |
| 1 | `what-does-it-cost` | ✅ **live** — ~1,960 words |
| 2 | `hoa-color-approval` | ✅ **live** — ~1,630 words |
| 3 | `choosing-between-whites` | ✅ **live** — ~1,890 words |
| 6 | `what-goes-wrong` | ✅ **live** — ~1,840 words |
| 4 | `cabinet-refinishing-vs-replacing` | ⬜ prompt ready below |
| 5 | `how-long-paint-lasts` | ⬜ prompt ready below |
| 7 | `best-colors-by-architecture` | ⬜ prompt ready below |
| 8 | `how-to-vet-a-painter` | ⬜ prompt ready below |
| 9 | `when-to-paint` | ⬜ prompt ready below |

The four live articles were written to close the pillar's dead links — its cards pointed at
URLs that did not exist. **The remaining five are additive**, so they can be written one at a
time without breaking anything.

**To add one:** append an object to `pillars[0].cluster[]` in `generator/blog.json`, add a
matching card to `pillars[0].articles[]`, run `node generator/generate.js`. The gate
(`validate-brief.js irvine`) fails the build if a card points at an article that has no
cluster entry, so a 404 card cannot reach production again.

---

# 🏛 THE PILLAR

## `/irvine/guide/`

### Title *(formula B4 — The [Identity]'s Guide)*
> **The Irvine Homeowner's Guide to Choosing an Exterior Color Without the Regret**

### Subheadline
> Six villages. Six different lights. One way to be certain before you commit.

### Direction
A storytelling journey through Irvine's six villages — the pillar page, built for humans and
internal linking rather than citations. The reader travels from Orchard Hills' hillside light
down to Stonegate's tight streetscapes, and at each stop learns why that village's
architecture demands a different palette. The interactive visualizer sits in the middle so
they can try schemes as they read.

Not a sales page. A journey that ends with them understanding their own village better than
they did — and knowing exactly who to call.

### Section plan
- **Open in a scene** — the same white at 9am in Woodbury's paseos and 2pm on a Loma Ridge slope
- **Why Irvine isn't one market** — the 5× value spread, six design reviews, four architectural styles
- **THE VISUALIZER** — embedded, mid-page, with a lede telling them to try it on the villages below
- **The six villages** — one section each: architecture · light · palette · a real street · link to that page
- **What every Irvine repaint has in common** — prep, Emerald, airless, design review handled
- **What it costs** — $4.75/sqft of paintable surface, itemized, with the market range for context
- **Close** — the complimentary consultation, once, plainly

### Bullets to work in
- Orchard Hills sits against the ridge; afternoon sun pushes warm colors yellow by two
- Woodbury's garden paseos stay filtered and cool all day
- Hidden Canyon takes canyon mornings and hot open afternoons in the same day
- Altair's broad stucco planes show every lap mark a roller leaves
- Stonegate's streets are close enough that one repaint resets the standard for the block
- Portola Springs is still largely wearing the builder's original palette

### ✂️ PROMPT
```
Write the Irvine pillar guide for VIP Home Painting.

CONTEXT TO LOAD FIRST:
- context/BRAND-VOICE.md, context/OFFER.md, context/DREAM-CUSTOMER.md
- generator/agents/blog/BLOG.md  (the four-part storytelling shape + rules)
- generator/research/irvine/05-communities.md  (verified streets, values, palettes)

TITLE: The Irvine Homeowner's Guide to Choosing an Exterior Color Without the Regret
SUB:   Six villages. Six different lights. One way to be certain before you commit.
URL:   /irvine/guide/
LENGTH: 1,800–2,400 words (pillar — longer than the cluster articles)

STRUCTURE:
1. Open in a scene — the same white behaving differently across two villages
2. Why Irvine is not one market (5x value spread, six design reviews)
3. [VISUALIZER EMBED] with a 60–90 word lede inviting them to try it
4. Six village sections. Each: architecture, light condition, recommended palette with SW
   codes, one real street name, and a link to that community page:
     Orchard Hills /irvine/orchard-hills/ · Altair /irvine/altair/
     Portola Springs /irvine/portola-springs/ · Hidden Canyon /irvine/hidden-canyon/
     Woodbury /irvine/woodbury/ · Stonegate /irvine/stonegate/
5. What every Irvine repaint has in common (prep, Emerald, airless, design review)
6. What it costs — VIP starts at $4.75/sqft of PAINTABLE SURFACE. Market range is
   $2.74–$4.89. Never say "Irvine averages."
7. Close on the complimentary consultation. Once. No pitch.

HARD RULES:
- Never "free" → "complimentary". Never "AI" → "our design team".
- No review counts, no star ratings — VIP has 9 reviews, rating unconfirmed.
- Only streets that appear in 05-communities.md. Never invent one.
- Phone: (909) 312-5400
- Write to the tier: Hidden Canyon $9.15M and Stonegate $1.82M are different readers.
```

---

# 📄 THE CLUSTER — 9 articles

Ordered by likely citation value. Each answers one question, links back to the pillar.

---

## 1 · `/irvine/guide/what-does-it-cost/`

### Title *(B3 — X Things You Must Know Before)*
> **5 Things That Change What Painting Your Irvine Home Actually Costs**

**Sub:** *Why two identical-looking houses on the same street get quotes $8,000 apart.*

**Answers:** *"How much does it cost to paint a house in Irvine?"* — the highest-intent
question in the industry, and CertaPro answers it with *"Less than you might expect!"*

**Bullets:**
- Paintable surface is not home square footage — the number that actually gets measured
- Substrate condition: sound stucco vs. crack repair floated to match texture
- A color *change* costs more than a refresh — coverage, not labor
- Trim, iron and detail work scale independently of wall area
- Access: two-story, hillside lots, tight zero-setback streets

**✂️ PROMPT**
```
Write "5 Things That Change What Painting Your Irvine Home Actually Costs" for VIP Home
Painting. Load context/BRAND-VOICE.md, context/OFFER.md, generator/agents/blog/BLOG.md.

URL /irvine/guide/what-does-it-cost/ · 1,000–1,300 words
ANSWER FIRST: state the real answer in the opening 100 words — VIP starts at $4.75 per sq ft
of PAINTABLE SURFACE; local market runs $2.74–$4.89; most estimates come in itemized.
NEVER write "Irvine averages $4.75" — that is contradicted by public data.
Then the five factors as H2s. Close on the itemized estimate + complimentary consultation.
Link once to /irvine/guide/ and once to /irvine/.
No invented project totals — we have no verified job data yet.
```

---

## 2 · `/irvine/guide/hoa-color-approval/`

### Title *(B2 — How to [Solve] Without [Negative])*
> **How to Get Your Exterior Color Approved by an Irvine HOA Without Three Rounds of Revisions**

**Sub:** *What design review committees actually look at — and the submission that gets a yes first time.*

**Answers:** the question every Irvine homeowner has and no competitor writes about.

**Bullets:**
- Nearly every Irvine village runs its own design review
- Orchard Hills has **three** separate associations, not one
- What a submission package contains: swatches, SW product data, elevation callouts
- Why an approved-range color still gets rejected on the wrong elevation
- Rendering the color first makes the submission self-evident

**✂️ PROMPT**
```
Write "How to Get Your Exterior Color Approved by an Irvine HOA Without Three Rounds of
Revisions". Load context/BRAND-VOICE.md, generator/agents/blog/BLOG.md, and
generator/research/irvine/06-hoa.md.

URL /irvine/guide/hoa-color-approval/ · 1,000–1,300 words
ANSWER FIRST: submit swatches + Sherwin-Williams product data sheets + elevation callouts,
and have the color rendered on your own elevation before submitting.
Use ONLY HOA facts from 06-hoa.md — Keystone Pacific manages several Irvine villages, and
Orchard Hills has three separate associations. NEVER invent an HOA rule.
Where an association is unverified, write "your community association's design review."
Link once to /irvine/guide/ and once to /irvine/hoa-painting/.
```

---

## 3 · `/irvine/guide/choosing-between-whites/`

### Title *(B1 — X Ways Without [Pain])*
> **3 Ways to Choose Between Three Identical-Looking Whites Without Guessing**

**Sub:** *Alabaster, Shoji, Greek Villa. On a paper card they're the same. On your house they aren't.*

**Answers:** the single most common paralysis point, straight from the DREAM-CUSTOMER fear.

**Bullets:**
- Why paper swatches fail: size, backing, and showroom lighting
- LRV explained without jargon — the one number that predicts behavior
- Undertone against your fixed elements: tile roof, stone, hardscape
- Irvine's inland light vs. coastal light and what it does to warm whites
- Seeing it rendered on your own elevation ends the debate in minutes

**✂️ PROMPT**
```
Write "3 Ways to Choose Between Three Identical-Looking Whites Without Guessing" for VIP.
Load context/BRAND-VOICE.md, context/OFFER.md, generator/agents/blog/BLOG.md.

URL /irvine/guide/choosing-between-whites/ · 900–1,200 words
ANSWER FIRST: judge whites by LRV and undertone against your fixed elements, at full scale,
in your own light — never from a paper card.
Use real SW colors: Alabaster SW 7008, Shoji White SW 7042, Greek Villa SW 7551,
Snowbound SW 7004, Pure White SW 7005.
Reference Irvine's inland light specifically. Embed the visualizer — this is the article
where seeing beats reading. Link once to /irvine/guide/.
```

---

## 4 · `/irvine/guide/cabinet-refinishing-vs-replacing/`

### Title *(B3 — Shocking/Costly)*
> **Cabinet Refinishing vs Replacing: 4 Costly Assumptions Irvine Homeowners Make**

**Sub:** *Solid boxes and a dated finish is the best-case scenario — and most Woodbury kitchens are exactly that.*

**Answers:** two harvested GBP questions at once (cost-effectiveness, finish quality).

**Bullets:**
- When refinishing wins: solid boxes, sound frames, a layout that works
- When it doesn't: particleboard, water damage, a layout you hate
- Why sprayed urethane enamel is a factory finish and brushwork isn't
- Doors sprayed off-site, boxes sprayed in place, hardware re-hung square
- Woodbury's 2005-era kitchens are the archetype

**✂️ PROMPT**
```
Write "Cabinet Refinishing vs Replacing: 4 Costly Assumptions Irvine Homeowners Make".
Load context/BRAND-VOICE.md, context/ABOUT-VIP.md, generator/agents/blog/BLOG.md.

URL /irvine/guide/cabinet-refinishing-vs-replacing/ · 1,000–1,300 words
ANSWER FIRST: if the boxes are solid and the layout works, refinishing gives a factory finish
at a fraction of replacement cost. If the boxes are failing or you hate the layout, it won't.
Describe VIP's actual process: doors and drawers sprayed OFF-SITE in urethane enamel, boxes
sprayed in place, proper degrease-sand-prime, cure time before re-hanging.
No invented prices — we have no verified job data. Speak in relative terms.
Link once to /irvine/guide/ and once to /irvine/woodbury/.
```

---

## 5 · `/irvine/guide/how-long-paint-lasts/`

### Title *(B3)*
> **7 Reasons Exterior Paint Fails Early in Irvine — and What Actually Prevents It**

**Sub:** *Inland sun is harder on a west elevation than most homeowners expect.*

**Bullets:**
- Chalking, fading, and why south and west elevations go first
- Film thickness: what "full wet-mil" means and why over-thinning is the usual culprit
- Prep failures that show up in year two, not year one
- Why dark colors fail fastest without fade-resistant colorants
- Emerald and Duration vs. builder-grade, in plain terms
- Stucco needs back-rolling, not just spraying
- What a 2-Year Warranty does and doesn't cover

**✂️ PROMPT**
```
Write "7 Reasons Exterior Paint Fails Early in Irvine — and What Actually Prevents It".
Load context/BRAND-VOICE.md, context/ABOUT-VIP.md, generator/agents/blog/BLOG.md.

URL /irvine/guide/how-long-paint-lasts/ · 1,100–1,400 words
ANSWER FIRST: most early failure is preparation and film thickness, not the paint itself.
Cover Irvine's inland sun on south/west elevations specifically. Explain full wet-mil and
back-rolling on stucco in plain English. Name Sherwin-Williams Emerald and Duration.
Mention the 2-Year Warranty accurately — labor and materials.
No invented longevity statistics. Link once to /irvine/guide/.
```

---

## 6 · `/irvine/guide/what-goes-wrong/`

### Title *(B5 — Avoid [Mistake], Get [Outcome])*
> **Avoid the $7,000 Repaint: What Goes Wrong When You Choose a Color From a Swatch**

**Sub:** *Almost nobody who regrets their color ever saw it on their own house first.*

**Answers:** the emotional core of the whole offer, as an article.

**Bullets:**
- A repaint costs the entire project again — $4,000–$7,000 for a typical exterior
- Scale: a two-inch chip cannot predict a twenty-foot elevation
- Light: showroom fluorescent vs. Irvine afternoon sun
- Context: your tile roof, stone, and neighbor's facade are all in the frame
- Living with it: eight years of pulling into that driveway

**✂️ PROMPT**
```
Write "Avoid the $7,000 Repaint: What Goes Wrong When You Choose a Color From a Swatch".
Load context/BRAND-VOICE.md, context/OFFER.md, context/DREAM-CUSTOMER.md,
generator/agents/blog/BLOG.md.

URL /irvine/guide/what-goes-wrong/ · 1,000–1,300 words
ANSWER FIRST: a wrong-color repaint costs the whole project again, $4,000–$7,000 for a
typical exterior, and almost nobody who regrets a color saw it on their own facade first.
This is the emotional heart of the offer — write to regret-aversion, never to price.
Embed the visualizer. Close on the complimentary consultation, once.
Link once to /irvine/guide/ and once to /irvine/.
```

---

## 7 · `/irvine/guide/best-colors-by-architecture/`

### Title *(B4)*
> **The Mediterranean Homeowner's Guide to Colors That Don't Fight the Roof**

**Sub:** *Clay tile, stone veneer and wrought iron are already choosing half your palette.*

**Bullets:**
- Start with what you can't change: roof, stone, hardscape
- Mediterranean and Santa Barbara: warm whites and greiges that don't go yellow
- Contemporary (Altair): why flat planes need different thinking
- Why all-gray now reads dated — warm it or contrast it
- Body, trim, gable and door as one system, not four decisions

**✂️ PROMPT**
```
Write "The Mediterranean Homeowner's Guide to Colors That Don't Fight the Roof" for VIP.
Load context/BRAND-VOICE.md, generator/agents/blog/BLOG.md, and
generator/research/irvine/05-communities.md.

URL /irvine/guide/best-colors-by-architecture/ · 1,100–1,400 words
ANSWER FIRST: start with the elements you cannot change — roof tile, stone, hardscape — and
choose the body color to sit with them, not against them.
Cover Mediterranean/Santa Barbara (most of Irvine) and Contemporary (Altair) separately.
Real SW codes only: Alabaster 7008, Accessible Beige 7036, Chatura Gray 9169,
Urbane Bronze 7048, Iron Ore 7069, Shoji White 7042.
Note that flat all-gray schemes now read dated — warm and layered, always with contrast.
Link once to /irvine/guide/ and once to /irvine/altair/.
```

---

## 8 · `/irvine/guide/how-to-vet-a-painter/`

### Title *(B3)*
> **8 Questions to Ask an Irvine Painting Contractor Before You Sign Anything**

**Sub:** *The answers separate a finish that lasts from one that looks fine for a year.*

**Answers:** the harvested question *"Why should I not hire someone who's been painting longer?"*

**Bullets:**
- What exactly does surface preparation include, in writing?
- Which product and how many coats, at what film thickness?
- Spray, roll, or spray-and-back-roll — and why for my substrate?
- Is the estimate itemized or a lump sum?
- Who handles the HOA submission?
- Licensed, bonded, insured — can I see the certificate?
- What does the warranty actually cover?
- Can I see the color on my own house before we start?

**✂️ PROMPT**
```
Write "8 Questions to Ask an Irvine Painting Contractor Before You Sign Anything".
Load context/BRAND-VOICE.md, context/ABOUT-VIP.md, generator/agents/blog/BLOG.md.

URL /irvine/guide/how-to-vet-a-painter/ · 1,100–1,400 words
ANSWER FIRST: the questions that predict quality are about preparation, film thickness, and
whether the estimate is itemized — not about years in business.
Write it genuinely useful even to someone who hires a competitor. That credibility IS the
persuasion. Give the answer a good contractor would give for each question.
Do not claim certifications VIP hasn't confirmed — no EPA Lead, no "SW Certified".
Link once to /irvine/guide/.
```

---

## 9 · `/irvine/guide/when-to-paint/`

### Title *(B2)*
> **How to Time an Exterior Repaint in Orange County Without Losing Weeks to Weather**

**Sub:** *Spring and early autumn are peak season — which is exactly why the color decision should happen now.*

**Bullets:**
- Temperature and humidity ranges coatings actually need
- Why marine-layer mornings matter more inland than people expect
- Peak season books out; the consultation is the part to do early
- Sequencing elevation by elevation keeps the house livable
- Typical exterior timeline: 3–5 working days

**✂️ PROMPT**
```
Write "How to Time an Exterior Repaint in Orange County Without Losing Weeks to Weather".
Load context/BRAND-VOICE.md, context/ABOUT-VIP.md, generator/agents/blog/BLOG.md.

URL /irvine/guide/when-to-paint/ · 900–1,200 words
ANSWER FIRST: spring and early autumn are ideal in Orange County; the constraint isn't the
calendar, it's booking — do the color consultation early even if painting later.
Most exteriors take 3–5 working days, sequenced so the house stays livable.
NO fake urgency — no "spots left", no deadlines. That is a banned pattern.
Link once to /irvine/guide/.
```

---

# PUBLISHING ORDER

| # | Article | Why this order |
|---|---|---|
| — | **Pillar** | Everything links to it; build first |
| 1 | What it costs | Highest intent, competitors publish nothing |
| 6 | What goes wrong | The offer's emotional core |
| 2 | HOA approval | Genuine differentiator, uncontested |
| 3 | Choosing between whites | Visualizer showcase |
| 4 | Cabinets vs replacing | Two harvested questions at once |
| 5 | How long paint lasts | Broad, evergreen |
| 8 | Vetting a contractor | Credibility play |
| 7 | Colors by architecture | Depth |
| 9 | When to paint | Seasonal |

**Cadence: one or two a week.** Ten articles at once looks manufactured; ten over six weeks
looks like a business that knows things.

**After publishing:** submit to **Bing Webmaster Tools** as well as Search Console — Copilot
is 50% of AI citations in this market and runs on Bing.
