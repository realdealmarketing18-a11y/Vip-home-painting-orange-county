# MEMORY

Loaded into every session alongside `context/FABIAN.md`. **Short and high-signal.** Not a log
— the distilled set of things that change what happens next.

**Two halves. Don't mix them.**
- **PART 1 · WORKING WITH FABIAN** — lessons from corrections. How he likes things done.
- **PART 2 · RESEARCH FINDINGS** — what we've learned about the market.

---

# PART 1 · WORKING WITH FABIAN

**When Fabian corrects you, add the lesson here as a new rule.** Check before every task.
Newest at the bottom. Never delete — if a rule stops applying, strike it and say why.

### F-01 · Short answers. Bullets over paragraphs.
Lead with the answer. Cut every sentence that doesn't change a decision. Long is only
justified when he asked for a plan or strategy.
*Fabian, 2026-07-27.*

### F-02 · Plain English — he is not a developer
"Explain like you're talking to a smart friend, not a guru in code." Lead with what it means
for the business; mechanism second, if at all. Never hide behind vocabulary.
*Fabian, 2026-07-27 — "explain like your speaking to a 5th grader not a guru."*

### F-03 · Show drafts before anything is sent
Emails, outreach, posts, review requests, anything to a client or HOA. Draft → wait → send.
Publishing a page to the live site is the standing exception.
*Fabian, 2026-07-27.*

### F-04 · Read it back before saying it's done
Twice this session something was reported done that wasn't: a CLAUDE.md section written
through a shell heredoc that stripped its own content, and it was pushed live broken.
**Verify the artifact, then report.** Not the reverse.
*Own error, 2026-07-27.*

### F-05 · Never use shell heredocs for multi-line file content
Bash mangles backticks, parentheses and quotes inside heredocs. Use the Edit/Write tool, or a
script file in the scratchpad. This broke three separate times in one session.
*Own error, 2026-07-27.*

### F-06 · Check what you're staging — never blind `git add -A`
Swept 42MB of throwaway placeholder video into the repo. Git keeps blobs forever; removing
them later needs a force push. Stage deliberately.
*Own error, 2026-07-27.*

### F-07 · Verify a claim before building on it
The site asserted 120 reviews. It was 9. A whole strategy was being shaped around a number
nobody had checked. **Ask about numbers that sound convenient before they become the plan.**
*Fabian, 2026-07-27.*

### F-08 · Don't broaden scope
When he names six communities, research six. Not the neighbouring ones, not the interesting
adjacent ones. Ask before expanding.
*Fabian, 2026-07-27 — "lets focus on the specific communities we are targeting only."*

### F-09 · Firecrawl is the default for web search and Google
Prefer it over built-in search. It takes a `location` param, which is the only way to see
geo-personalized results. Apify is for Google Maps data specifically.
*Fabian, 2026-07-27 — "always use firecrawl when searching the web."*

### F-10 · The brief validator cannot see the generator
"Free Quote" and "5-Star Rated" reached live pages because both were hardcoded in
generate.js, not in the brief. The validator only reads the brief. Fixed by adding an
output audit that scans the RENDERED html — the only thing a customer actually reads —
and fails the build. Rule: validate the artifact, not the input that produced it.
*Own error, 2026-07-27.*

### F-11 · US spelling — this is an American business
Wrote "colour" throughout the first Irvine draft. Now caught by the output audit.
*Own error, 2026-07-27.*

### F-12 · Never guess character counts
Burned two rounds trying to hit a 150-160 char meta description by eye. Write three
candidates and let a script pick the one in range.
*Own error, 2026-07-27.*

---

# PART 2 · RESEARCH FINDINGS

**Promotion rule:** new findings go to *Candidate*. When a finding holds in a **second**
city, promote it to *Confirmed*. When ranking data contradicts a finding, move it to
*Retired* with the evidence — do not silently delete, or we will re-learn the same mistake.

---

## CONFIRMED — verified in 2+ markets, act on these

### M-01 · The review bar is ~60 — and VIP is at 9
The #1-ranked painter in Anaheim has **55 reviews**. Irvine's top local painter has **57**
(excluding College Works, a national student franchise, at 172). Median is 20–30.
**VIP has 9 reviews, and they were earned in Fontana** (~40 miles from Anaheim, ~50 from Irvine).
*Evidence: Apify datasets `pw6djQiOl1uh6hDsq`, `Jd1VPtysGNBzUztT1`, 2026-07-27; Fabian 2026-07-27.*
→ The review gap is VIP's single biggest competitive deficit — roughly 50 behind the leaders
in both markets. Review acquisition is not a nice-to-have, it is **the** priority.
→ The target is ~60, not hundreds. At 4–5/month that is a 12-month climb; at 8–10/month, 6.
→ **Fontana origin matters:** reviews earned at a former location. Confirm the GBP is now
verified at the Anaheim base — a profile still pinned to Fontana cannot rank in either market.

### M-02 · Nobody in OC competes on color confidence
Across ~50 painters in two cities, **zero** carry a review tag about visualization, color
consultation, or seeing the result beforehand. Every tag is price, speed, tidiness, or
professionalism. CertaPro *claims* visualization but shows no tool.
*Evidence: reviewsTags across both datasets; certapro.com/oc/house-painters-irvine.*
→ This is the uncontested position. Every headline should ladder to it.

### M-03 · Nobody builds community-level pages
CertaPro lists 30 cities and zero neighborhoods. Universal Coat runs 2 services × 20 cities.
Stubbins does service × region. **Not one competitor has a neighborhood page.**
→ VIP's six community pages have almost no direct competition. Go deeper, not wider.

### M-04 · Directories own half of page one
Yelp, Thumbtack, Houzz, HomeAdvisor take 4–5 of 8 organic slots in both cities. Only **3–4
real painting companies** rank per city.
→ The competitive set is far thinner than it looks. Do not be intimidated by result counts.

---

## CANDIDATE — seen once, watch for confirmation

### C-01 · An Anaheim HQ does not block Irvine organic rankings
CertaPro ranks #1–2 organically for Irvine from 2905 E. Miraloma Ave, Anaheim.
→ Direct proof of the two-track model. Confirm by watching whether VIP's Irvine pages rank.

### C-02 · 80% of competitors never post to GBP
Only 5 of 25 Anaheim businesses post owner updates.
→ Weekly posts are a cheap, uncontested engagement signal. Confirm in Newport.

### C-03 · Cost content is the highest-intent gap
Stubbins ranks with "how much does it cost to paint a house" pages. CertaPro publishes no
pricing at all ("Less than you might expect!").
→ VIP's itemized transparency may be its strongest organic wedge.

### C-05 · Community-term SERPs are near-empty — Google is grasping
Baseline for "orchard hills house painters" (geo: Irvine, 2026-07-27): position 1 is CertaPro's
generic *Irvine city* page. Positions 3-5 are painters in **Michigan and Connecticut** named
"Orchard." Position 6 is Bakersfield. Position 10 is a YouTube video about **Denver**.
→ Google has almost nothing genuinely relevant for community terms and is filling the page
with wrong-state matches. This is stronger than "low competition" — the SERP is *starved*.
A real Orchard Hills page should rank quickly once indexed. **This is the thesis to watch.**

### C-04 · City-specific blog guides are cheap and effective
Universal Coat runs `/blog/irvine-exterior-painting-guide`, `/blog/anaheim-house-painting-guide`.
VIP has no blog at all.

---

## METHOD LEARNINGS — how to research, not what we found

- **Firecrawl is blocked on Reddit.** Use an Apify Reddit actor. Reddit threads rank page-one
  for Irvine and are the richest question source we've found.
- **Semrush returns zero volume for community terms.** Measurement floor, not absent demand.
  Never kill a community page on Semrush data. Pull the city long-tail and modify by name.
- **`scrapePlaceDetailPage: true` is the whole game** on Apify Maps. Without it there is no
  `reviewsTags`, no Q&A, no `peopleAlsoSearch`.
- **`reviewsTags` doesn't appear for every business** — it needs enough reviews. Expect gaps.
- **GBP Q&A is a thin question source for painters.** Most volume on the Irvine profiles was
  College Works' student-recruiting funnel. Reddit and social are richer.
- **Firecrawl `search` takes a `location` param.** Always use it — non-localized SERPs are
  misleading for local work.
- **Apify datasets are persistent.** Record IDs in `meta.sources` and re-mine free.
- **Pull Apify results with `fields=`.** A full 25-place dataset with reviews is ~630KB and
  will blow the context window.

---

## OPEN QUESTIONS — need Fabian, block on these if they matter

1. ~~Is the 120-review claim real?~~ **ANSWERED 2026-07-27: NO.** VIP has 9 Google reviews,
   earned in Fontana. The schema claimed 5.0 from 120 — removed from the OC page same day.
   **Still open:** are the three on-page testimonials (Linda Quarry, Carol Brown, Tony
   Minardi) real Google reviews? They carry a Google badge. And is "120+ Projects Done" a
   true project count? Both are unaudited claims still live.
2. **Is VIP EPA Lead Certified?** CertaPro displays it; we don't. Matters on pre-1978 homes.
3. **Can the warranty go to 2 years?** CertaPro advertises 2; VIP advertises 1. A shopper
   comparing pages sees a worse number next to our name.

---

## RETIRED — findings that ranking data disproved

*(none yet — add here rather than deleting, with the evidence that killed it)*
