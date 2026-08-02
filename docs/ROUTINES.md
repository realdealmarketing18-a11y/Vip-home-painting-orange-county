# Routines — Anaheim cluster, start to finish

Four routines. Paste each into **Routines → New local routine**.

**Folder for all four:** `C:\Users\Owner\oc-site`
**Worktree:** leave unchecked.

They are **state-aware**. Each one asks `pipeline.js` what stage the cluster is at
and stops immediately if it is not its turn. So all four can be created now and the
chain advances itself — roughly one stage a day, unsupervised. Nothing publishes
unless both gates pass.

| # | Name | Schedule | Moves Anaheim |
|---|---|---|---|
| 1 | `anaheim-research` | Daily 8:00 AM | `queued` → `researched` |
| 1b | `anaheim-voice` | Daily 10:00 AM | writes `07-VOICE.md` — the language bank |
| 2 | `anaheim-copy` | Daily 11:30 AM | `researched` → `copy_complete` |
| 3 | `anaheim-publish` | Daily 2:00 PM | `copy_complete` → `published` |
| 4 | `vip-blog` | Weekly, Tue 9:00 AM | writes the guide + one article |

Local routines only run while the computer is awake and online.

---

## 1 · anaheim-research

**Name**
```
anaheim-research
```

**Description**
```
Deep local + AI-search research for Anaheim, until the handoff gate passes
```

**Instructions**
```
Read CLAUDE.md and context/FABIAN.md before anything else. Use the marcus-local-seo skill.

FIRST — check whether there is work to do:
  node generator/pipeline.js status
  node generator/pipeline.js next marcus
If Anaheim is already past `researched`, stop and report "nothing to do". Do not redo it.

Otherwise do exactly the task pipeline.js prints for Marcus. Follow
generator/agents/marcus/MARCUS.md and generator/research/_global/RESEARCH-BLUEPRINT.md.

Produce, under generator/research/anaheim/:
  00-SUMMARY.md  02-local-pack.md  03-organic-competitors.md  05-communities.md  06-hoa.md
and the handoff brief generator/briefs/anaheim.json, matching
generator/RESEARCH-BRIEF-CONTRACT.md exactly. Raw dumps go in generator/briefs/_raw/.

WHAT MATTERS ABOUT ANAHEIM SPECIFICALLY
- It is VIP's home base and the one market where the Google Maps local pack is
  actually winnable. Note in 00-SUMMARY.md that the Business Profile is still
  pinned to Fontana, so every Maps tactic stays blocked until Fabian moves it.
- Maps data is already scraped — Apify dataset pw6djQiOl1uh6hDsq. Use it before
  paying to scrape again.
- The review bar in Anaheim is about 55. VIP has 9.
- Find the genuinely HIGH-END communities only — the neighborhoods a five-figure
  repaint buyer actually lives in (Anaheim Hills and its named tracts are the
  obvious start, but verify). Target 4-6. Do not pad the list to hit a number;
  a thin community page is worse than no page.
- For every community record, from a primary source, with the source URL in the
  brief: real street names, architecture style, HOA / management company, price band.

TOOLS — read generator/research/_global/TOOLS.md first. It rates every tool on
whether it ever changed a decision, and says which are load-bearing.
- Tier 1, use these: Firecrawl (all web search and anything on google.com — always
  pass the location so you see the SERP a local buyer sees), Apify Google Maps
  (scrapePlaceDetailPage: true or the useful fields are missing), Apify Ahrefs
  (website_authority and ai_visibility).
- Tier 2, optional: Semrush for city and service terms only. Never pull community
  terms — zero volume there is a measurement floor, not absent demand — and never
  kill a community page on it. This run must complete without it.
- Prefer government and city primary sources (City of Anaheim, county HOA lookups)
  over listing sites and blogs.
- If a new research tool has been connected, run the acceptance test in TOOLS.md
  before trusting it, and write up the result as TOOL-EVAL-{NAME}.md.

HARD RULES — a violation is a failed run, not a small problem
- Never invent street names, HOA rules, client stories, reviews or ratings.
- Anything unverified goes in meta.gaps[] and lowers meta.confidence. Leave the
  slot empty rather than guessing. An empty slot is fixable; a false claim is live.
- No review counts, no star ratings.

FINISH
  node generator/validate-brief.js anaheim --stage research
Fix what it reports, re-run until it passes, then:
  node generator/pipeline.js claim anaheim researched

Do not commit or push — this stage only writes research files.

REPORT: which communities you chose and why, what you verified against what is
still a gap, and the exact gate output.
```

---

## 1b · anaheim-voice

**Name**
```
anaheim-voice
```

**Description**
```
Halo Strategy buyer research — the verbatim language bank the copy is written from
```

**Instructions**
```
Read CLAUDE.md and context/FABIAN.md first. Use the vip-research-agent skill.

This is the BUYER half of research. Marcus answers "where can we win"; you answer
"what do we say". Both run before copy.

FIRST:
  Check whether generator/research/anaheim/07-VOICE.md already exists and is filled.
  If it is, stop and report "already done" unless it is more than a quarter old.

Copy generator/research/_global/HALO-WORKSHEET.md to
generator/research/anaheim/07-VOICE.md and fill every section.

WHO YOU ARE RESEARCHING
Only ~3% of homeowners are ready to hire today. Competitors fight over them with
"FREE ESTIMATE". The money is in the ~97% who are problem-aware and stalling.
Research the stallers. The standing avatar is Diane, the Reluctant Repainter —
45-65, Anaheim Hills, $1.5M-$5M home, decides aesthetics, spouse approves spend.
Her core fear is picking a color, living with it ten years, and hating it. She is
buying certainty; paint is the delivery mechanism.

SOURCES THAT ACTUALLY WORK — the skill has the full table
- Google autocomplete: curl "https://suggestqueries.google.com/complete/search?client=firefox&q=SEED"
- Bing autocomplete:   curl "https://api.bing.com/osjson.aspx?query=SEED"
- Apify Maps review text, Anaheim dataset pw6djQiOl1uh6hDsq — already paid for.
  FILTER TO PAINTERS: the scrape also pulled windows, flooring, gutters and cabinets (M-08).
- Firecrawl for Houzz threads and Sherwin-Williams color forums. Always pass location.
- Reddit is BLOCKED for Firecrawl. Nextdoor is login-walled. Record both as not checked.

THE TRAP — read M-07 in research/_global/MEMORY.md
Google reviews are written by the 3% who ALREADY BOUGHT. Verified on real Anaheim
data: 17 reviews of a 53-review local painter, every one about the crew — clean, on
time, fair price — and not one about choosing a color or regretting it. So reviews
are good for Theme 3 (Barriers) and near-useless for Theme 2 (Pains & Fears), which
is the highest-value theme and lives entirely pre-purchase.
Do not fill Theme 2 from reviews. If forums are unreachable, mark it
"[THIN — source blocked]" and say so. A thin honest theme is usable; a padded one
poisons every headline downstream.

HARD RULES
- NO INVENTED QUOTES. Ever. Every line carries a source URL. Unsourced lines are
  marked [VERIFY] and may not be used in copy.
- Capture verbatim. Never paraphrase into marketing voice. If a line in the language
  bank reads like a brochure, you wrote it instead of finding it — go back to the source.
- Fear outweighs aspiration. Interior and exterior are different fears; separate them.
- Do not pad a section to hit a minimum count.

REPORT: the top 3 hair-on-fire concerns with quotes, the gap statement, three hook
candidates traced to real lines, and explicitly which sources you could not reach.
Then remind Fabian that his own consult notes would outperform every source here —
three questions after each call: what made you finally call, what stopped you last
time, what were you afraid would happen.
```

---

## 2 · anaheim-copy

**Name**
```
anaheim-copy
```

**Description**
```
Write the Anaheim city, community and HOA page copy from the research brief
```

**Instructions**
```
Read CLAUDE.md and context/FABIAN.md first. Use the vip-copywriter skill.

FIRST:
  node generator/pipeline.js next copywriter
If it says nothing to do, stop and report that — the research stage has not
finished yet. Do not start writing without a brief; do not write research yourself.

Otherwise do the task it prints. Your inputs are
generator/research/anaheim/00-SUMMARY.md, generator/briefs/anaheim.json, and
generator/research/anaheim/07-VOICE.md — the verbatim language bank.
Follow generator/agents/copywriter/COPYWRITER.md, HEADLINE-FORMULAS.md,
COPY-SLOTS.md and STORY-SLOTS.md.

PULL HEADLINES FROM 07-VOICE.md, NOT FROM YOUR OWN HEAD. That file is what real
homeowners said, with a source on every line. Lead from Theme 2 (Pains & Fears) —
fear outweighs aspiration. Prefer her words over ours every time.
If 07-VOICE.md does not exist, say so in your report and fall back to
context/DREAM-CUSTOMER.md. Never invent a quote to fill the gap.

Write copy for: the Anaheim city page, one page per community in the brief, and
the Anaheim HOA / common-area page.

WHAT THE COPY HAS TO DO
- Lead with the Custom Visualization Service. Across ~50 painters in Irvine and
  Anaheim, zero carry a single review tag about seeing the color first. It is the
  one uncontested angle we have.
- The buyer is regret-averse, not price-sensitive. The fear is spending five
  figures on a color they end up hating, on a house their neighbors see daily.
- Every page needs a unique module_order — the build fails if two match.
- Hero and case studies are storytelling, matching the Irvine pages.

HARD RULES — build-enforced
- Never "free" → "complimentary". Never "AI" in customer copy → "our design team"
  or "Custom Visualization Service". US spelling, never "colour".
- No ratings, no review counts, no aggregateRating. VIP has 9 reviews and the
  rating is unconfirmed.
- Pricing is "VIP starts at $4.75 per square foot of paintable surface" — never
  "Anaheim averages". Do not compute project totals; Fabian has not supplied real
  job data, so leave those slots out.
- Phone is (909) 312-5400 and nothing else. Address is Anaheim.
- Never invent street names, HOA rules, client stories or testimonials. If the
  brief does not verify it, it does not go on the page.

FINISH
  node generator/validate-brief.js anaheim
Fix and re-run until it passes, then:
  node generator/pipeline.js claim anaheim copy_complete

Do not run the generator and do not push — the next stage does that.

REPORT: the module_order you gave each page, anything you left out for lack of a
verified fact, and the gate output.
```

---

## 3 · anaheim-publish

**Name**
```
anaheim-publish
```

**Description**
```
Build, verify and publish the Anaheim pages — only if every gate passes
```

**Instructions**
```
Read CLAUDE.md and context/FABIAN.md first. Use the vip-page-builder skill.

FIRST:
  node generator/pipeline.js next seraphina
If Anaheim is not at copy_complete, stop and report that. Do not publish a stage
that has not been written.

Otherwise:
1. Merge the brief into generator/cities.json and generator/communities.json.
   Anaheim needs its own entry with child_communities, hoa_page, and its own
   geo/market/pricing — copy the shape of Irvine, never its facts.
2. node generator/generate.js
3. node generator/validate-brief.js anaheim
4. node generator/verify-site.js anaheim

BOTH GATES MUST PASS. If either exits non-zero, STOP. Fix what it reports and
re-run. Never publish red, and never edit generated HTML by hand to make a check
pass — fix the data or the generator and rebuild.

verify-site.js checks the rendered output: dead and absolute links, banned copy,
schema parsing, FAQ-schema parity, canonicals, the silo rule, nav consistency.
Absolute links like /anaheim/... 404 on GitHub Pages and have shipped twice, so
take that check seriously if it fires.

WHEN BOTH ARE GREEN
  git add <the files you changed>      (never git add -A — it once swept 42MB of
                                        video into history)
  commit as ONE commit, then push to main.
  node generator/pipeline.js claim anaheim published

Wait ~60s, then confirm every new URL returns 200 with curl before reporting.

REPORT: every page published as a clickable live link, the gate output, and
anything still missing a verified fact. If you stopped, say exactly what failed
and what you changed — never report success you did not verify.
```

---

## 4 · vip-blog

**Name**
```
vip-blog
```

**Description**
```
Write the next pillar guide or cluster article, built to be cited by AI search
```

**Instructions**
```
Read CLAUDE.md and context/FABIAN.md first. Use the vip-blog-writer skill and
follow generator/agents/blog/BLOG-WORKFLOW.md and BLOG.md.

WHY THIS EXISTS — read before writing (M-06)
AI engines cite blog posts, not sales pages. CertaPro has 313 AI citations and a
single blog post earns 55 of them while their hundreds of landing pages earn
nothing. The engines that matter are Copilot (50%) and Google AI Mode (36%), not
ChatGPT. So the article is the citation unit and everything about it is shaped
for extraction.

PICK ONE JOB, in this order, then stop:
1. If a city has published pages but no pillar guide, write the pillar.
2. If it has a pillar, write the next unwritten article from its
   generator/agents/blog/BLOG-PLAN-{CITY}.md.
3. If no BLOG-PLAN exists for a city that has pages, create it first — pillar plus
   9 article specs with titles from HEADLINE-FORMULAS.md, subheads, bullets and a
   direction for each. Then stop; write the articles on later runs.

Anaheim is the priority once it is published. Irvine still has 5 unwritten
articles listed in BLOG-PLAN-IRVINE.md.

CADENCE — do not exceed. Check git log for the last 7 days first; if two or more
articles were published in that window, stop and report "cadence reached". Ten
articles appearing at once reads as manufactured and is a filtering risk.

HOW AN ARTICLE IS BUILT
Data goes in generator/blog.json under pillars[].cluster[]; a matching card goes
in pillars[].articles[]. Then node generator/generate.js. The gate fails the build
if a card has no article behind it, so a dead card cannot ship.

Every article needs:
- An answer block written to survive being quoted with no page around it — name
  the city and the company rather than saying "we". This is the block engines lift.
- 4+ FAQs whose visible text matches the FAQPage JSON-LD word for word.
- A table wherever data supports one; engines lift structured data first.
- A unique module_order, and related[] links to siblings and up to the pillar.
- Headings that read like questions a person would actually type.

HARD RULES
- Never "free" → "complimentary". Never "AI" in customer-facing copy → "our design
  team". US spelling.
- No ratings or review counts.
- Never invent street names, HOA rules, client stories or testimonials. Cite real
  sources. Manufacturer specs (Sherwin-Williams colors, LRV values) must be
  verified against the manufacturer, not a blog.
- Never write a title that competes with a sales page. Sales pages answer "who to
  hire"; the blog answers "how to decide".

FINISH
  node generator/generate.js
  node generator/verify-site.js
Both must pass. Then commit and push as one commit, wait ~60s, and confirm the new
URL returns 200.

REPORT: the live link, the word count, and which BLOG-PLAN item you used.
```

---

## Notes

**The chain is safe to leave alone.** Every stage gates on `validate-brief.js`, and
publishing also gates on `verify-site.js`, which exits non-zero on dead links,
absolute links, banned copy, broken schema or a mismatched FAQ. A routine that
cannot pass stops and reports instead of shipping.

**What routines cannot do.** Move the Google Business Profile from Fontana to
Anaheim — that needs Fabian's login, and every Maps tactic in the Anaheim playbook
is blocked until it happens. Organic and AI-search work is unaffected.

**Still open with Fabian**, and each one leaves a hole in the copy until answered:
CSLB license number *(in progress)* · EPA Lead certification *(in progress)* · real
project totals for pricing ranges · the actual Google rating · whether the three
on-page testimonials are real.

**Settled 2026-07-31:** the warranty is **2 years**, labor and materials. Every page
says so. Do not write "longer than the competition" — CertaPro also advertises 2,
so matching is not beating.

**To run one immediately** instead of waiting for its schedule, set Schedule to
Manual and trigger it, or just run the same instructions in a normal session.
