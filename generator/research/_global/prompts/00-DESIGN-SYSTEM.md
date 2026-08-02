# The shared design block

Every prompt in this pack ends with the same block. It is what makes five separate
prompts produce five reports that look like one product instead of five different
answers. **Do not edit the hex values** — they are a validated palette, checked for
colour-blind separation against this dark surface, and changing them by taste breaks that.

> **This palette is deliberately NOT the VIP brand palette.** These are internal analyst
> reports, not customer-facing pages. Navy/gold/cream belongs on the website; this dark
> analyst surface belongs here. Do not "fix" one to match the other.

Paste this at the end of any new prompt you write for the pack.

---

```
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
```

---

## Why these honesty rules are load-bearing here specifically

They are not boilerplate. This repo has a documented history of plausible-looking numbers
reaching live pages — a false 5-star rating and a "120+ projects" count that turned out to
be 9 reviews and no verified project data. `verify-site.js` exists because of it.

**A research report that guesses a search volume is the same failure one step earlier.**
Every page we build gets justified by these numbers. Do not delete these lines.
