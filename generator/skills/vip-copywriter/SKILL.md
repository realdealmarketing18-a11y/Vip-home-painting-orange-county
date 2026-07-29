---
name: vip-copywriter
description: Write sales page copy for VIP Home Painting city, community and HOA landing pages from a completed research brief. Use when writing or revising page copy, headlines, meta descriptions, answer capsules, FAQs, or problem/solution content for a city cluster — or when the pipeline says the copywriter stage is next. Triggers on copywriter, sales page copy, write the copy, headlines, page copy, meta description, answer capsule, FAQ copy, or a named OC city needing copy (Irvine, Anaheim, Newport Beach, Coto de Caza).
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# VIP COPYWRITER

Turn a validated research brief into finished page copy. You do not research and you do not
build pages — the facts are already gathered and checked, and the generator handles layout.

**Start every run:**
```bash
node generator/pipeline.js next copywriter
```
If it prints `NOTHING TO DO`, stop. Do not invent work.

---

## READ IN THIS ORDER

1. **`generator/agents/copywriter/COPYWRITER.md`** — your full brief: identity, the 7 rules,
   the hard stops, page structure. **This is the authority; everything below is a summary.**
2. `generator/agents/copywriter/HEADLINE-FORMULAS.md` — 6 hero + 5 HVCO formulas, bullet
   bank, and the tier selection matrix
3. `generator/agents/copywriter/COPY-SLOTS.md` — exact slot specs and character limits
4. `generator/research/{city}/00-SUMMARY.md` — the positioning angles, competitor gaps, real
   customer questions, and what contradicts our assumptions
5. `generator/research/{city}/05-communities.md` — streets, values, palettes, landmarks
6. `generator/research/{city}/06-hoa.md` — associations and management companies
7. `context/` — FABIAN.md, ABOUT-VIP.md, DREAM-CUSTOMER.md, OFFER.md, BRAND-VOICE.md

---

## WHAT YOU PRODUCE

**You fill copy slots inside `generator/briefs/{city}.json`.**
Not a markdown page. A `.md` page bypasses the generator and loses the layout rotation that
keeps pages from being flagged as duplicates.

Per cluster: 1 city page + 1 per community + 1 HOA page. Irvine = 8 pages.

Per page: `seo.meta_title` · `seo.meta_desc` · `seo.h1` · `seo.answer_capsule` ·
`seo.viz_intro` · `faqs[]` · `problems[]` (communities) · `portfolio` · `urgency`

---

## THE ANGLE EVERYTHING LADDERS TO

**Nobody in this market competes on color confidence.** Zero of ~50 painters across two
cities carry a review tag about visualization or seeing the result first. They compete on
price, speed, tidiness.

Supporting math: a wrong-color repaint costs the whole project again — **$4,000–$7,000** —
and almost nobody who regrets a color saw it on their own house first.

Every headline is a different door into that same room.

---

## WRITE TO THE TIER, NOT THE TEMPLATE

| Tier | Communities | Register |
|---|---|---|
| $9M+ | Hidden Canyon | Understated, expert-to-expert. Never salesy. |
| $3–5M | Orchard Hills, Altair | Sophisticated. Status + mistake-avoidance. |
| $1.5–2M | Stonegate, Portola Springs, Woodbury | Educational. Value + certainty. |
| HOA | boards, managers | Governance. Documentation. De-risking the vote. |

Hidden Canyon at $9.15M and Stonegate at $1.82M do not share a voice.

---

## 🚫 HARD STOPS — the gate fails the build on these

- `[First name] [Last initial]` testimonial templates — fabricated reviews
- Any project count ("500+ estates", "47 homeowners") — **unverified**
- Review counts, star ratings, `aggregateRating` — VIP has **9**, rating unconfirmed
- Fake scarcity ("7 spots left")
- Uncited statistics
- **"free"** → *complimentary*
- **"AI"** → *our design team* / *Custom Visualization Service*
- "Irvine averages $4.75" → "VIP **starts at** $4.75 per sq ft of paintable surface"
- HOA rules not sourced in the brief
- Any phone but **(909) 312-5400**

**The visualization is:** our design team renders the client's actual home in candidate
palettes during a complimentary 30-minute consultation. **Not** twilight renders, 48-hour
delivery, "18 photorealistic visualizations", or SW codes with quantities — those aren't live.

---

## WHEN DONE

```bash
node generator/validate-brief.js {city}
node generator/pipeline.js claim {city} copy_complete
```

`claim` refuses a failing gate. Blocked instead:
```bash
node generator/pipeline.js block {city} "reason"
```

Then record any lesson in `generator/research/_global/MEMORY.md` (Part 1 for working
preferences, Part 2 for market findings).
