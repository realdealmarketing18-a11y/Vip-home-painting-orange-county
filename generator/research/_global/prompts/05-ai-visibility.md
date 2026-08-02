# Prompt 5 — AI Search Visibility
# Replaces: Semrush AI Visibility Toolkit ($99/mo add-on)
#
# This is the one that measures the thesis the whole blog track rests on.

Use the DataForSEO connector's AI Optimization data.

**Brand:** VIP Home Painting
**Domain:** viphomepainting.com + the live pages at
`realdealmarketing18-a11y.github.io/Vip-home-painting-orange-county/`
**Competitors:** `certapro.com`, `universalcoat.com`

1. For the questions a buyer in this market would actually ask an AI assistant, show
   me where this brand is cited and where it is not.
2. Show which competitors get cited instead, and which source pages the AI engines
   are pulling from.
3. Tell me what those cited pages have that mine do not.
4. Give me the three changes most likely to get this brand cited, in order.

Be explicit about coverage: say how many queries you checked and across which
engines. If an engine returned no data, say so rather than omitting it.

## The specific thesis to test — M-06

Our existing measurement (Apify, 2026-07-30) found:
- CertaPro **313 AI citations**; VIP and Universal Coat **0**
- One CertaPro blog post — `/community/what-are-the-pros-and-cons-of-textured-paint/` —
  earns **55** of them, while their hundreds of city landing pages earn essentially nothing
- **Copilot 155 + Google AI Mode 114 = 86%** of citations. ChatGPT 6, Perplexity 4

**Confirm or contradict all three with fresh data**, and weight your engine coverage
accordingly — a ChatGPT-only report measures 6% of our problem. If DataForSEO cannot
reach Copilot or Google AI Mode, say so explicitly; that is a coverage gap that changes
how much the report is worth, not a detail for the footnotes.

**Queries to check** — the ones our buyer actually asks:
```
how much does it cost to paint a house in Irvine
best house painters in Anaheim Hills
how do I choose an exterior paint color
how to get HOA approval for exterior paint color
why does paint look different on the wall than the sample
who are the best luxury painters in Orange County
```

We published four cluster articles on 2026-07-31 built specifically to be cited — answer
blocks written to survive being quoted, FAQPage schema, speakable. **They are days old, so
expect zero.** Establish the baseline honestly; the value of this run is the starting line,
not the score.

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
