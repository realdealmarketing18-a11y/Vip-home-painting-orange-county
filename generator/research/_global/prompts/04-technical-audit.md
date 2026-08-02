# Prompt 4 — Technical Audit
# Replaces: Ahrefs Site Audit / Semrush Site Audit
#
# NOTE: OnPage crawls are asynchronous. Start this one and give it a few minutes,
# or run the crawl once beforehand so the results are already cached.

Use the DataForSEO connector to crawl the site.

**Target:** `https://realdealmarketing18-a11y.github.io/Vip-home-painting-orange-county/`
Crawl the Irvine tree specifically — the 13 live pages under `/irvine/` plus the
Orange County page. This prompt is the one that works fine on a subpath.

1. Crawl the site and pull every technical issue you can detect.
2. Now filter hard. Ignore cosmetic warnings that do not affect rankings or users. I
   do not want a list of 400 items.
3. Return ONLY issues that could realistically cost this site rankings or
   conversions, ranked by impact. For each one:
   - what the issue is, in plain English
   - which specific URLs are affected (list them)
   - why it costs rankings
   - the exact change to make
   - how long it takes to fix
4. Separate them into: fix this week, fix this month, fix eventually.
5. At the end, name the single highest-impact fix on the whole site and what you
   expect it to do.

If something looks like an issue but probably is not, say so and say why. I would
rather have 6 real problems than 400 warnings.

## What we already check ourselves — do not re-report these

`node generator/verify-site.js` runs on every build and already fails on: dead links,
absolute links, banned copy, broken JSON-LD, FAQ-schema mismatch, wrong canonical, silo
breaches, wrong warranty length. **Assume those are clean and spend the report on what
we cannot see:**

- **Core Web Vitals and real render performance** — LCP, CLS, INP. The pages inline all
  CSS and lazy-load ~1MB of scheme renders on the article pages; is that actually costing us?
- **Crawlability and indexation** on a github.io subpath specifically
- **Mobile rendering** problems a computed-style check would miss
- **Duplicate or near-duplicate content across the 13 pages** — these are programmatic
  pages built from one generator, and doorway-page filtering is the live risk. Every page
  carries a unique section order by design; tell me whether that is actually enough.

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
