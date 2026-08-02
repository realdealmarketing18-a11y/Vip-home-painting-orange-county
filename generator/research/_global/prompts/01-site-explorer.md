# Prompt 1 — Site Explorer
# Replaces: Ahrefs Site Explorer ($249/mo)

> ### ⚠️ Read this before running — the domain problem
>
> The live site is a **subpath on a shared domain**:
> `realdealmarketing18-a11y.github.io/Vip-home-painting-orange-county/`
>
> Domain-level analysis of `github.io` returns **GitHub's** data — millions of unrelated
> pages — not ours. Any ranked-keyword or authority figure for that host is meaningless
> for VIP.
>
> So for this prompt:
> - Where the endpoint accepts a **URL prefix**, target the full path above.
> - Where it only accepts a **domain**, run it on **viphomepainting.com** (thin but ours)
>   and on the competitors, and say clearly in the report that VIP's own numbers are
>   unavailable and why.
> - **Never present a github.io figure as VIP's.**
>
> This is the same wall that blocks Search Console and Bing Webmaster Tools. **Migrating
> to viphomepainting.com is the unlock for all measurement** — flag it in the report if
> the data makes the case.

---

You are my SEO analyst. Use the DataForSEO connector for all data. Do not estimate
or guess any metric: if you do not have the data, pull it or say so.

**Domain:** viphomepainting.com — and the live pages at
`realdealmarketing18-a11y.github.io/Vip-home-painting-orange-county/` where the endpoint
accepts a URL prefix.
**Market:** United States, English. City-level where SERPs are involved:
`Irvine,California,United States` and `Anaheim,California,United States`.

1. Pull every keyword this domain currently ranks for, with position, monthly
   search volume, and the exact ranking URL.
2. Summarise: total ranking keywords, and how many sit in positions 1-3, 4-10,
   11-20, and 21-100.
3. List the top 20 pages by estimated organic traffic.
4. Then do the part a tool cannot: identify the THREE pages with the highest
   realistic upside in the next 90 days. For each one give me the keyword, its
   current position, its volume, why it is stuck, and the single specific change
   you would make first.

Rank the three by expected traffic gain, not by how easy they are. Show your working
for any traffic estimate. Flag anything you are uncertain about.

**Context you need:** 13 Irvine pages went live between 2026-07-27 and 2026-07-31 —
a city hub, six community pages, an HOA page, a pillar guide and four cluster articles.
They are days old. **Expect near-zero data, and say so plainly rather than dressing up
noise.** A report that says "too early to measure, re-run in 30 days" is the correct
answer if that is what the data shows.

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
