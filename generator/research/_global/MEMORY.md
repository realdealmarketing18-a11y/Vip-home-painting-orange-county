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

### F-13 · The workflow lives in generator/WORKFLOW.md — keep it current
Every step, every tool, every command, and what each tool extracts. A diagram in chat
disappears; this does not. **Whoever changes the workflow updates that file in the same
commit.** It ends with a ranked list of known gaps — check it before proposing "new" work.
*Fabian, 2026-07-27 — "should this be saved within the folder of workflow so it can be
found and in memory so it can come back to it and optimize it."*

### F-14 · Shell heredocs keep eating backticks — this is the third time
F-05 said this already and I did it again writing the WORKFLOW blog-track table: every
`code span` came out empty. **For any file content with backticks, braces or quotes, use
the Write/Edit tool or a scratchpad .js file. Never a bash heredoc. No exceptions.**
*Own error, 2026-07-30 — repeat of F-05.*

### F-15 · `node -e "..."` eats backticks exactly like a heredoc does
Fourth occurrence. Writing M-10 through `node -e` with a template literal, bash expanded
the backticked `github.io` as a command substitution and left an empty gap in the file.
**The rule is not "avoid heredocs" — it is: any file content containing backticks goes
through the Write/Edit tool or a scratchpad `.js` file, never through a shell argument
of any shape.** Read the file back afterwards; the corruption is silent.
*Own error, 2026-07-31 — repeat of F-05 and F-14.*

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

### M-05 · Domain authority barely matters in these SERPs
Ahrefs DR for every painter competing here: CertaPro **71** (national franchise, 989k
backlinks) — and then a cliff. Universal Coat ranks **#3 in Anaheim at DR 0.2**. Stubbins
ranks #7 in Irvine at DR 0.3. Anaheim House Painters ranks #8 at DR 0.
**VIP is DR 0 — exactly level with businesses already on page one.**
*Evidence: apify pro100chok/ahrefs-seo-tools, website_authority, 2026-07-30.*
→ **Do not spend on link building.** It is not what wins these SERPs.
→ The gap to Universal Coat is not authority, it is page count: they have ~40 landing
pages, VIP has 9. Build pages, earn reviews, work the GBP.
→ Reinforces C-05: relevance and local specificity decide these results, not metrics.

### M-04 · Directories own half of page one
Yelp, Thumbtack, Houzz, HomeAdvisor take 4–5 of 8 organic slots in both cities. Only **3–4
real painting companies** rank per city.
→ The competitive set is far thinner than it looks. Do not be intimidated by result counts.

### M-06 · AI engines cite blog posts, not sales pages
CertaPro has **313 AI citations**. VIP and Universal Coat have **0**.
But every one of CertaPro's top-cited pages is an educational article — their
`/community/what-are-the-pros-and-cons-of-textured-paint/` post alone earns **55**.
Their hundreds of city landing pages earn essentially nothing.
*Evidence: apify pro100chok/ahrefs-seo-tools, ai_visibility, 2026-07-30.*
→ **AI engines cite answers, not offers.** Sales pages convert; blog posts get quoted.
→ **Copilot (155) + Google AI Mode (114) = 86% of citations.** ChatGPT (6) and Perplexity
(4) are almost irrelevant here. Copilot runs on Bing — **claim Bing Places.**
→ CertaPro's citation topics are almost all brand lookups. The generic homeowner questions
— cost, color choice, durability, HOA approval — are **uncontested**.

---

### M-07 · Google reviews answer the wrong question for copy
Sampled 17 reviews of a 53-review Anaheim painter (Horacio Guillermo Castellani) from the
Maps dataset. **Every single one is about the crew** — clean, on time, fair price,
attention to detail, "didn't skimp." **Not one mentions choosing a color, uncertainty, or
regret.**
*Evidence: apify dataset `pw6djQiOl1uh6hDsq`, review text, 2026-07-31.*
→ Reviews are written by the **3% who already bought**. They are excellent for
**Barriers** — *"Finding a contractor you can trust is not an easy task"*, and one buyer
who *"gave him a small job first, and if he met my expectations, the entire house"* — and
near-useless for **Pains & Fears**, which live entirely pre-purchase.
→ **Never source Theme 2 of the Halo worksheet from reviews.** Fears live in forums,
autocomplete, and Fabian's consult calls. Reddit is still blocked, so this theme is the
thinnest part of the research and the most valuable. See `HALO-WORKSHEET.md`.
→ Second confirmation of **M-02** from a different angle: the market's entire vocabulary
is about execution, not about the decision. Nobody is competing on certainty.

### M-10 · Three separate tools are now blocked by the same thing: the domain
The site lives on a github.io subpath. Domain-level analysis of `github.io` returns
GitHub's data, not ours — so DataForSEO's Site Explorer and Content Gap endpoints, Google
Search Console, and Bing Webmaster Tools are all unusable until VIP owns the domain being
measured.
*Evidence: DataForSEO connector review + GSC/Bing verification requirements, 2026-07-31.*
→ **Migrating to viphomepainting.com has stopped being a preference and become the
bottleneck for measurement.** Three tools, one blocker.
→ Do not verify GSC or Bing against github.io first — verification has to be redone after
a move, so the domain decision comes first.

### M-09 · The free tool we are missing beats the paid one we can't have
Ahrefs MCP connected 2026-07-31. Every paid endpoint returns `Insufficient plan`; API v3
needs a **Lite plan at $129/mo**. Only `public-domain-rating-free` works — it returned
CertaPro **DR 71**, which corroborates M-05 from the source itself.
*Evidence: direct endpoint tests + help.ahrefs.com/en/articles/6559232-about-api-v3, 2026-07-31.*
→ **Decision: free tools only.** Buying Lite would, on our own evidence, purchase the same
zero we already get for community terms.
→ **The gap is Google Search Console, not Ahrefs.** GSC reports *actual impressions for
actual queries*, including the long tail below every keyword tool's floor. It is the only
thing that can measure a community term, it is free, and **it is not connected.** Same for
Bing Webmaster Tools — Copilot is 50% of AI citations and runs on Bing (M-06).
→ Both need domain verification, which must be redone if the site moves to
viphomepainting.com. **Decide the domain question first.**
→ Deadline: the free DR endpoint loses unauthenticated access **2026-08-10**. A free API
key keeps it alive; five minutes, no cost.

### M-08 · The Maps scrape pulls adjacent trades, not just painters
The Anaheim dataset (`pw6djQiOl1uh6hDsq`, 25 records) contains window and door companies,
flooring, rain gutters, and cabinet showrooms alongside painters.
*Evidence: direct read, 2026-07-31.*
→ **Filter by category before counting anything.** Review-bar and competitor-count numbers
computed over the raw dataset are inflated by businesses we do not compete with.

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

### C-04 · ~~City-specific blog guides are cheap and effective~~ → **see M-06, now confirmed**
Universal Coat runs `/blog/irvine-exterior-painting-guide`. VIP has no blog at all.
AI-citation data promoted this from "cheap and effective" to **the highest-leverage content
gap we have** — educational posts are the only thing earning AI citations in this market.

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

- **Ahrefs actor (`pro100chok/ahrefs-seo-tools`) works for `website_authority`, not for
  `keyword_metrics`** — the latter returned empty for "irvine house painters". ~$0.015 per
  result, no subscription. Untested and promising: `ai_visibility` (citations in ChatGPT,
  Gemini, Perplexity) and `keyword_rank`. It is a third-party scraper solving captchas, so
  treat it as periodic research, not a scheduled dependency. Full eval:
  `_global/TOOL-EVAL-AHREFS-ACTOR.md`.
- **The blog plan lives in `generator/agents/blog/BLOG-PLAN-{CITY}.md`** — pillar + 9
  articles, each with a title, direction, bullets and a copy-paste prompt. Method and the
  cannibalization rule are in `agents/blog/BLOG.md`.
- **No keyword tool has volume for community terms.** Ahrefs and Semrush both estimate from
  clickstream; "orchard hills house painters" is below the measurement floor of every tool
  that exists. Judge community pages on Search Console impressions, never on a keyword tool.

## OPEN QUESTIONS — need Fabian, block on these if they matter

1. ~~Is the 120-review claim real?~~ **ANSWERED 2026-07-27: NO.** VIP has 9 Google reviews,
   earned in Fontana. The schema claimed 5.0 from 120 — removed from the OC page same day.
   **Still open:** are the three on-page testimonials (Linda Quarry, Carol Brown, Tony
   Minardi) real Google reviews? They carry a Google badge. And is "120+ Projects Done" a
   true project count? Both are unaudited claims still live.
2. **Is VIP EPA Lead Certified?** CertaPro displays it; we don't. Matters on pre-1978 homes.
3. ~~Can the warranty go to 2 years?~~ **ANSWERED 2026-07-31: YES.** Fabian raised it to 2,
   matching CertaPro. Every page updated; it now lives in `communities.json → config.warranty`.
   **Never write "longer than the competition"** — matching is not beating.

---

## RETIRED — findings that ranking data disproved

*(none yet — add here rather than deleting, with the evidence that killed it)*
