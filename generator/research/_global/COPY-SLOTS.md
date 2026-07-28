# COPY SLOTS — what the Copywriter fills, and how uniqueness is enforced

Marcus supplies data. The Copywriter fills these slots. The generator handles layout.
**Headline formulas plug into the slots below** — the formulas are yours; this is the shape
they land in.

---

## HOW DUPLICATE-PAGE RISK IS ALREADY HANDLED

Three mechanisms, all automatic. The Copywriter does **not** need to manage them:

**1. Layout rotation (structural).** Every page carries a unique `module_order`. The generator
**fails the build** if two pages share a sequence, and `module-orders.json` tracks what's used.
Six live community pages, six different section orders.

**2. Cross-page sentence check (textual).** `validate-brief.js` fails if any two pages in a
cluster share a sentence in `viz_intro` or `answer_capsule`, share an FAQ question, or share
an H1. You cannot ship near-duplicate copy through the gate.

**3. Genuinely different source data.** Each community has its own streets, landmarks,
architecture, palette, value tier, and HOA. The uniqueness is real, not paraphrased.

> ⚠️ **The one thing that still breaks this:** writing six pages from one template and
> swapping the community name. The gate catches identical sentences, not lazy ones. Vary
> *what you talk about*, not just the nouns — Hidden Canyon at $9.15M and Stonegate at $1.82M
> should not discuss the same concerns.

---

## THE SLOTS

### Per page — every type

| Slot | Limit | Notes |
|---|---|---|
| `seo.meta_title` | **≤ 60 chars** | Gate-enforced. Must contain the place name. |
| `seo.meta_desc` | **150–160 chars** | Gate-enforced — a hard range, not a target. |
| `seo.h1` | — | Must contain the place name. Unique across the cluster. `<span class="gold">` wraps the accent phrase. |
| `seo.answer_capsule` | **60–110 words** | Who / where / what / price anchor / warranty / phone. Written for AI extraction — lead with the direct answer. |
| `seo.viz_intro` | **60–110 words** | Sits above the shared visualizer. Must be locally specific — this is what keeps a shared component inside unique text. |
| `faqs[]` | 3+ community · 6+ city · 4+ HOA | Answers 2–4 sentences. No question may repeat anywhere in the cluster. |
| `urgency.hook` / `season_note` | — | Optional. |

### Community pages additionally

| Slot | Count |
|---|---|
| `problems[]` — `{p, s}` | 4+ · problem in the customer's words, solution in ours |
| `portfolio.eyebrow / title / body` | 1 |
| `cabinetLine` | 1 |

### HOA page additionally

| Slot | Notes |
|---|---|
| `scope_intro` | Common areas, not houses |
| `compliance_block` | Insurance, licensing, itemized bids, resident notification |
| `bid_cta` | **"Request a bid"** — never "book a consultation" |

---

## HARD COPY RULES (gate-enforced)

- **Never "free"** → "complimentary"
- **Never "AI"** → "our design team" / "Custom Visualization Service"
- **Never** "Irvine averages $4.75" → "VIP exterior work in Irvine **starts at** $4.75 per
  square foot of paintable surface"
- Phone in customer-facing copy must be **(909) 312-5400** and nothing else
- No `aggregateRating`, no review counts, no "5-Star Rated" — **VIP has 9 reviews** and the
  rating is unconfirmed
- Never name HOA rules that aren't in the brief with a source

---

## THE ANGLE EVERY HEADLINE SHOULD LADDER TO

**Nobody in this market competes on color confidence.** Zero of ~50 painters across two
cities carry a review tag about visualization or seeing the result first. Competitors compete
on price, speed, and tidiness.

Supporting math: a wrong-color repaint costs the whole project again — $4,000–$7,000 — and
almost nobody who regrets a color saw it on their own house first.

### Write to the tier, not the template

| Tier | Communities | Register |
|---|---|---|
| 1 — gated | Hidden Canyon $9.15M · Altair $4.59M · Orchard Hills $3.51M | Discretion, concierge scheduling, gate protocol, founder's walkthrough. Price isn't the objection; being judged is. |
| 2 | Stonegate $1.82M · Portola Springs · Woodbury | Value transparency, itemized pricing, the cost of doing it twice. |
| HOA | boards + managers | Compliance, documentation, governance. Visualization de-risks the vote. |

---

## WHERE TO READ BEFORE WRITING

0. **`ABOUT-VIP.md`** and **`DREAM-CUSTOMER.md`** — who we are, who we serve. Every headline
   formula plugs into the psychology in DREAM-CUSTOMER. Never state a business fact that
   ABOUT-VIP has not verified.
1. `research/{city}/00-SUMMARY.md` — the entry point; may be all you need
2. `research/{city}/05-communities.md` — streets, values, palettes, landmarks
3. `research/{city}/06-hoa.md` — associations and management companies
4. `briefs/{city}.json` — the file you actually fill

## WHEN DONE

```bash
node generator/validate-brief.js {slug}
node generator/pipeline.js claim {slug} copy_complete
```

`claim` refuses a failing gate.
