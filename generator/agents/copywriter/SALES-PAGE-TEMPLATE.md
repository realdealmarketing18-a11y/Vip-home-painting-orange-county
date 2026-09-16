# THE SALES PAGE TEMPLATE

**Locked structure, variable content.** Every VIP sales page runs this order — the master
Orange County page, every city hub, every community page. Sections may be *omitted* on
smaller pages; they may never be *reordered*, because the order is the argument.

Built from three sources, reconciled: the 11-block asset skeleton, the Sales Page Agent
spec, and the Orange County page as it actually stands today.

> Headlines in every section pass `HEADLINE-FORMULAS.md` **Part 0** — three rules, four
> essentials. `verify-site.js` check 12 enforces the provable half on `data-story` sections.

---

## THE THREE THINGS EVERY SECTION CARRIES

Each section below is specified on three axes at once. A section that does only one of
these is doing a third of its job.

| Axis | The question it answers |
|---|---|
| **Story** | Which beat of the narrative is this? Who is on stage? |
| **Conversion** | What does she believe *after* this that she did not believe before? |
| **Search** | What does this earn — a ranking, a citation, or a schema entity? |

**The story spine is one customer, carried the whole way down.** On the OC page that is
the Gallaghers: their house is the before/after, their schemes are the band, their
decisions are the interactive. The chip reappears with a *different sub-line* each time —
"Pelican Hill, Newport Beach" → "Their remaining seven schemes" → "Everything they chose
after the color". Same family, advancing sentence. That is what makes sections read as
one story instead of a stack of modules.

---

## THE ORDER

### 0 · PRE-HERO HOOK
**Story:** cold open. The fear, stated as something that happened to someone.
**Conversion:** she recognises herself in two sentences and keeps reading.
**Headline:** no headline. Two sentences maximum, plain.
**Rule:** it names a *documented* pain from `07-VOICE.md`. Never an invented anecdote.

**Search: this is one of the highest-value blocks on the page, not a warm-up.**

An earlier draft of this document said the hook carried no SEO weight. That was wrong, and
it would have cost us the thing we are actually optimising for. Three reasons it matters:

1. **It is crawled like any other body copy.** Sitting above the H1 does not exempt it.
   It is the first body text a crawler reaches, which makes it a strong topical signal for
   the whole page.
2. **It is the most citable block we have.** AI engines retrieve at *passage* level, and a
   self-contained narrative opening is the exact shape they quote. Copilot is 50% of
   citations and Google AI Mode 36% (**M-06**) — a hook that names the problem, the place
   and the company in plain sentences is built to be lifted whole.
3. **It often becomes the snippet**, when the engine prefers opening body text to the meta
   description.

**How to integrate search without killing the cold open — the resolution is that you do
not have to choose.** Her verbatim language *is* the long-tail. `07-VOICE.md`'s glossary
and `00-SUMMARY.md` Finding 5's informational cluster are the same words:

| She says | People search |
|---|---|
| "the color still **read** wrong" | `home exterior color mistakes` |
| "**swatches** on three walls" | `how to choose exterior paint colors for your house` |
| "**leaning** pink in **my lighting**" | `how to choose exterior paint color combinations` |
| "it is so **permanent**" | `how often to paint house exterior in california` |

So: write her sentence, and the search term arrives with it. What is banned is the
reverse — reaching for a term and bending a sentence around it.

**Requirements:**
- Name **the place** once, naturally (Orange County, or the community on a community page).
- Use **her documented phrasing**, not industry phrasing.
- One passage, self-contained — readable with no context above or below it.
- It lives inside the page's **main content**, never in a decorative wrapper a parser skips.
- Feeds `speakable` alongside the FAQ.
- **No service term jammed in**, no keyword stacking, no second sentence that exists only
  to carry a phrase. If it stops sounding like one person talking, it has failed both jobs.

> "Weeks of samples on three different walls, and the color still read wrong once it was
> up." — the shape to aim at. Specific, ordinary, true of a real person, and carrying
> `home exterior color mistakes` without having tried to.

### 1 · HERO
**Story:** who this happened to, and that it ended well.
**Conversion:** the promise — she can see it before she commits to it.
**Search:** the H1, and it carries real weight — the primary transactional term goes
here (`exterior painting orange county`, `house painters orange county`). Finding 4
flagged the old H1 precisely for having no service term in it.
**Headline:** Part A formula + an approved number. ≤15 words.
**Carries:** subhead (transformation promise), one CTA, trust strip (licensed · bonded ·
insured — **never** a rating or review count).
**Schema:** `WebPage`, `HousePainter` with visible NAP, `BreadcrumbList`.

### 2 · THE PROBLEM
**Story:** why the careful way fails too.
**Conversion:** the category correction — this is not "painters vary in quality", it is
"the standard method cannot work". Convenience is a feature; a category correction is a
position.
**Search:** informational long-tail lives here in body copy, not in the heading.
**Headline:** B5 (`Avoid [Mistake] — Get [Outcome]`) or A6 (Cost of Wrong).
**Rule:** aim at the *careful* buyer. She did weeks of research and still got it wrong.
Copy aimed at the lazy buyer who grabbed a chip misses her entirely.

### 3 · THE VISUALIZATION — before / after
**Story:** her house, both ways, one frame.
**Conversion:** proof, not claim. The before never moves; only the after changes.
**Search:** `ImageObject` on every pair. Alt text names the scheme and its SW colors —
*"Newport Beach estate exterior rendered in Riviera Tuxedo, Snowbound SW 7004 with Black
Magic SW 6991 trim."* Accessibility and an honest keyword surface in one edit.
**Schema:** `ImageObject`, `Service` + `Offer`.
**Rule:** **real renders only.** Never a stock house standing in for a client's.

### 4 · THE PALETTE BAND
**Story:** everything she passed on, ending on the one that went on the house.
**Conversion:** range without overwhelm — the count is finite and named.
**Search:** SW color names are searched terms. Cite them `Name SW 0000`, always.
**Rule:** a colour is **three paint cans**, never a flat chip (`BRAND-VOICE.md`; check 11).

### 5 · HOW IT WORKS — the steps
**Story:** the decisions that came *after* the colour — lighting, texture, materials, doors.
**Conversion:** she sees the process is finite and that nothing is committed.
**Search:** `HowTo` schema is legitimate here and almost nobody in this market uses it.
**Headline:** B2 (`How to [Solve] in [Timeframe] Without [Negative]`) + the 30 minutes.
**Rule:** steps carry a number *and* a brand mark between them; the mark is the connector,
not decoration.

### 6 · THE STAKES BRIDGE
**Story:** one line, between sections, raising the cost of not deciding.
**Conversion:** converts cost into a deadline — the decision gets made either way.
**Search:** none. This is a persuasion beat.
**Rule:** it must **not** repeat the section above it. If the band already said what a
mistake costs, this says what it costs to *delay*, or how long she lives with it.

### 7 · COMMUNITY PROOF
**Story:** other families, same decision, same outcome.
**Conversion:** people like her, near her, already did this.
**Search:** the strongest local-SEO section on the page. Community and city names in
context.
**Schema:** `Review` / `Place` — **only for verified clients.**
**⚠️ Conflict resolved:** the agent spec says *"case studies with real addresses/streets."*
That is **overruled** by the hard rule against inventing street names, and by the fact that
VIP's on-page testimonials are still unverified. Use the community name, never a street
address, unless the client has confirmed it in writing.

### 8 · RISK REVERSAL — the warranty
**Story:** what happens if it still goes wrong.
**Conversion:** removes the last objection.
**Search:** `Offer` → `warranty`.
**Rule:** 2 years, from `communities.json → config.warranty`. **Never "longer than the
competition"** — CertaPro also advertises 2. Differentiate on it being *written into the
estimate*, not on its length.

### 9 · INVESTMENT
**Story:** the number, before she has to ask for it.
**Conversion:** the second uncontested wedge. Almost nobody in this market publishes
pricing, and cost queries are the highest-intent searches in the industry.
**Search:** the commercial-investigation cluster — `exterior painting cost per square
foot`, `how much to paint a house exterior in california`.
**Schema:** `Offer` with `unitText: "square foot of paintable surface"`. This fixes the
denominator, which is the single highest-value / lowest-effort SEO item in Finding 4.
**⚠️ Conflict resolved:** the agent spec says *"range framing, never a single number."*
VIP's actual position is stronger and is already published: **"starts at $4.75 per square
foot of paintable surface"** — a floor, itemised line by line. Never an average, never
"Irvine averages $4.75".
**Never:** the `[VERIFY]` $12,000–$15,000 second-repaint figure, until a real closed job
backs it.

### 10 · SERVICES
**Story:** the rest of what the same team does.
**Search:** secondary service terms, one `Service` entity each (exterior, interior,
cabinets).

### 11 · SERVICE AREAS
**Story:** none — this is a signpost.
**Search:** `areaServed` as City entities. Pure local SEO.
**Note:** exempt from the headline contract. Its job is to be found, not read.

### 12 · FAQ
**Story:** none — signpost.
**Conversion:** last objections, answered plainly.
**Search:** **this is the AI-citation engine.** M-06: AI engines cite editorial answers,
not sales copy, and the engines that matter are Copilot (50%) and Google AI Mode (36%).
**Schema:** `FAQPage` + `speakable`. 6 entries minimum; the cheapest place to fix a thin
word count.
**Rule:** each answer opens with a self-contained sentence naming **VIP Home Painting**, so
it survives being quoted out of context. Exempt from the headline contract.

### 13 · FINAL CTA
**Story:** the close, pointed at her.
**Conversion:** one action. The same offer as the hero, not a new one.
**Headline:** about *her* outcome, never "Let's…" or "We…".

---

## AI-SEO — what actually earns a citation

Ranking and being cited are different games (M-06):

- **Sales sections rank.** FAQ and editorial sections get **cited**.
- A citable answer is **self-contained** — it names the company, the city and the number in
  one sentence, because the engine quotes the sentence, not the page.
- **Bing before ChatGPT.** Copilot is 50% of citations and runs on Bing, so Bing Places
  and Bing Webmaster Tools beat any prompt-level tactic.
- Blog and pillar content feed this. Sales pages alone do not get cited.

## SCHEMA — the full set for a page running this template

```
WebPage · HousePainter (visible NAP, Anaheim address only)
BreadcrumbList
Service ×3 (exterior · interior · cabinets)
  └─ Offer  unitText: "square foot of paintable surface"
ImageObject (every before/after pair, alt text naming the SW colors)
FAQPage + speakable
areaServed: City entities
HowTo (the steps section)
```

**Never `AggregateRating`, never review counts, never "5-Star Rated".** VIP has 9 reviews
and the rating is unconfirmed. A false one has already reached a live page twice.
`verify-site.js` fails the build on it.

---

## HOW THIS PAGE CURRENTLY MEASURES UP

The Orange County page runs 14 sections and already matches most of this order. The gaps,
ranked:

| Gap | Where | Cost |
|---|---|---|
| **No pre-hero hook** | above §1 | the cold open is missing; the page opens on the promise instead of the pain |
| **No standalone INVESTMENT section** | pricing lives inside §4 and §5 | the highest-intent search cluster has no section to rank |
| **Alt text missing on 4 of 11 renders** | §3 | on a page whose entire differentiator is imagery |
| **Schema is thin** | throughout | `Service`, `Offer`, `ImageObject`, `BreadcrumbList`, `HowTo`, `speakable` all absent |
| **FAQ at 6 entries, 2,258 words** | §12 | thin for cost authority |

Items 3–5 are `00-SUMMARY.md` Finding 4, already ranked action 1 in `memory/task_plan.md`.
