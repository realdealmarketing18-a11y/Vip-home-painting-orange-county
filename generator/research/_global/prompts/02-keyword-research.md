# Prompt 2 — Keyword Research  ⭐ RUN THIS ONE FIRST

**This is the prompt that settles our oldest open question.** Every keyword tool we have
tried returns **zero volume** for community terms — "orchard hills house painters" — and we
have never been able to tell whether that is a measurement floor or genuinely absent demand
(see `MEMORY.md` M-05, and `TOOLS.md` → "The real gap").

The entire community-page strategy rests on the answer. Run this before the other four.

---

Use the DataForSEO connector. All volumes and difficulty scores must come from the
API, never from your own estimates.

**Business:** VIP Home Painting — luxury residential exterior/interior painting and
cabinet refinishing, based in Anaheim CA, serving wealthy design-review communities across
Orange County. The differentiator is the Custom Visualization Service: the client's actual
home rendered in every candidate palette before anything is scheduled.

**Market:** United States, English. For anything SERP-based, use city-level locations —
`Irvine,California,United States` and `Anaheim,California,United States`. A national SERP
is the wrong answer to every question we ask.

### Seeds — run all three tiers, and report them separately

**Tier A — the open question. Community-level terms.**
```
orchard hills house painters
altair irvine painters
portola springs house painters
hidden canyon painters irvine
woodbury irvine house painters
stonegate irvine painters
anaheim hills house painters
anaheim hills exterior painting
```

**Tier B — city and service terms** (these we know return data)
```
irvine house painters
anaheim house painters
exterior painting irvine
cabinet painting irvine
hoa painting orange county
```

**Tier C — the stalling buyer** (the ~97% who are not ready to hire; these feed the blog)
```
exterior paint looks different than the sample
regret my paint color
how to choose exterior paint color
hoa paint color approval
how much does it cost to paint a house irvine
```

---

## Tasks

1. Expand each seed into the full relevant keyword set, with monthly volume and difficulty.
2. **Answer the Tier A question explicitly and first.** For every community term, report the
   exact figure returned: a real number, `0`, or omitted-from-database. State plainly which
   it is. If DataForSEO omits a keyword entirely, say so — that is different from zero and
   it matters.
3. Group by SEARCH INTENT: informational, commercial investigation, transactional,
   navigational. Every keyword in exactly one group.
4. Inside each group, cluster the keywords that should live on the SAME page. Give each
   cluster a working page title and a URL slug.
5. Flag every cluster where the current top 10 looks weak — thin pages, forums, irrelevant
   results, nothing targeting the term directly. **Check the actual SERP before claiming a
   SERP is weak.** Our own prior finding (C-05) is that community SERPs return painters in
   Michigan and Connecticut; confirm or contradict it with fresh data.
6. Output a build order: what to write first, second, third, and why.

Exclude keywords this business cannot credibly serve, and say which you cut and why.

## What to do with the Tier A answer

- **Real volume returned** → this contradicts M-05. Say so loudly. It changes how we
  prioritise community pages and it goes in `MEMORY.md` as a new finding.
- **Zero or omitted** → the measurement floor is confirmed across a third independent
  tool. Then the correct conclusion is *not* "no demand" — it is that no keyword tool can
  measure this tier, and we judge community pages on Search Console impressions instead.
  Say that explicitly so nobody kills a community page on this data later.

---

=== OUTPUT FORMAT ===

Produce the result as a SINGLE SELF-CONTAINED HTML ARTIFACT. Not markdown, not a
chat message. One HTML document with all CSS inline in a <style> block. No external
fonts, no CDN links, no images fetched from the web.

This report will be shown on a screen recording, so design it to be read at a
distance: generous type, generous spacing, nothing smaller than 14px.

COLOURS — use exactly these, as CSS custom properties:
  --surface:#1a1a19    page background
  --card:#232322       card and table-row background
  --ink:#ffffff        primary text
  --ink-2:#c3c2b7      secondary text
  --ink-3:#83827a      labels, captions, axis text
  --rule:#33332f       borders and dividers
  --accent:#3987e5     primary accent, positive, "this is the opportunity"
  --warn:#e0a03c       needs attention
  --bad:#e66767        problems, losses, costs
  --good:#199e70       wins, already ranking well

TYPE: system font stack (-apple-system, BlinkMacSystemFont, "Segoe UI", Inter,
Helvetica, Arial, sans-serif). Page title 40px/700. Section headings 26px/700.
Body 16px/1.55. Table text 15px. Labels 13px uppercase with 0.1em letter-spacing.
All numbers use font-variant-numeric: tabular-nums.

STRUCTURE, in this order:
1. A header: report name, the domain analysed, the market, and the date.
2. A row of 3 to 5 hero stat tiles — the numbers that matter most, each with a big
   value and a small uppercase label underneath.
3. The main body, as specified in the task above.
4. A "The 3 things I'd do first" section near the end: numbered, specific, each one
   naming the exact page or keyword and the exact change.
5. A footer headed "Data sources & method" listing which DataForSEO endpoints were
   called, how many rows came back, and the date the data was pulled.

TABLES: numbers right-aligned and tabular. Row background --card, 1px --rule
dividers, no vertical gridlines. Never more than 25 rows in a table — if there are
more, show the top 25 and state the total count.

STATUS AND SEVERITY: never communicate severity with colour alone. Every coloured
item also carries a written word ("Critical", "High", "Low", "Winning", "Losing").
A reader who cannot distinguish the colours must lose no information.

BARS AND CHARTS: only if they genuinely help. If used, keep them simple horizontal
bars with the value written at the end of each bar. One measure per chart, one axis,
never two y-scales. No pie charts, no donuts, no 3D, no gradients on data marks.

HONESTY RULES — these matter more than the design:
- Every number in the report must come from the API. Never estimate, never round a
  figure you did not receive, never fill a gap with a plausible-looking value.
- If a metric was unavailable, print "not available" in that cell and say why in the
  footer. Do not leave it blank and do not guess.
- If your confidence in a recommendation is low, label it "Low confidence" and say
  what would raise it.
- Do not pad the report to look thorough. A short accurate report beats a long one.
