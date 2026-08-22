# WORDPRESS MIGRATION — start here

**Written as a thread-starter.** Everything below is verified, in the repo, and pushed.
Nothing needs rebuilding from scratch.

Last updated **2026-08-22**.

---

## 1 · WHERE EVERYTHING IS

| | |
|---|---|
| **GitHub** | `github.com/realdealmarketing18-a11y/Vip-home-painting-orange-county` (`main`) |
| **Local clone** | `C:\Users\Owner\oc-site\` |
| **Build site** *(staging)* | `realdealmarketing18-a11y.github.io/Vip-home-painting-orange-county/` |
| **Real site** *(destination)* | `viphomepainting.com` — WordPress + Elementor on Hostinger |

Working tree is clean, everything is pushed. **`CLAUDE.md` auto-loads in every session** and
points at everything else.

---

## 2 · WHAT EXISTS — 18 pages, all generated

**None of these are hand-written.** They are built from data by `generator/generate.js`.

**Irvine — 13 pages**
`/irvine/` · orchard-hills · altair · portola-springs · hidden-canyon · woodbury · stonegate ·
`/irvine/hoa-painting/` · `/irvine/guide/` · and four cluster articles
(what-does-it-cost · what-goes-wrong · hoa-color-approval · choosing-between-whites)

**Anaheim — 5 pages**
`/anaheim/` · peralta-hills · summit-pointe · belsomet · crown-pointe

**Plus** `/orange-county-sales-page/` — the county page. Hand-maintained, but its nav and
robots meta are now written by the generator so they cannot drift.

### Five page types
1. **City hub** — `/irvine/`
2. **Community** — `/irvine/orchard-hills/` (homeowners, B2C)
3. **HOA** — `/irvine/hoa-painting/` (boards and property managers, B2B)
4. **Pillar guide** — `/irvine/guide/` (editorial, links down to everything)
5. **Article** — `/irvine/guide/what-does-it-cost/` (built to be **cited** by AI engines)

---

## 3 · THE MIGRATION — decided, built, not yet run

**Decision: the pages stay GENERATED.** WordPress becomes where they are *served*, not where
they are edited. Elementor keeps doing what Fabian wants it for — home, about, contact,
gallery — and never touches these.

**Why this and not hand-building in Elementor:** the warranty change from 1 year to 2 touched
**116 places across 14 pages**. By hand across the ~65 pages this becomes at four cities, that
is a day's work and a guaranteed miss. And `verify-site.js` cannot check a page it did not
generate, so the dead-link, schema and banned-copy gates would all disappear.

### The publisher — `generator/publish-wp.js`

```bash
node generator/publish-wp.js              # dry run, all pages
node generator/publish-wp.js irvine       # dry run, one city
node generator/publish-wp.js --live       # actually write
```

Dry run verified on all 13 Irvine pages: correct parent-first ordering, titles, canonicals,
all 6 schema types per page, 2.0MB total.

**It publishes onto the Elementor `elementor_canvas` template — deliberately.** Our CSS uses
`.body`, `.page`, `.sub`, `.ttl` plus bare `section {}`, `body {}`, `img {}` rules. Under any
normal theme template those collide **in both directions**. Canvas loads zero theme chrome, so
the collision cannot happen. Our pages already ship their own header, nav and footer.

> ⚠️ Do **not** use the theme's `vip-landing-page.php` template — it renders a footer, and our
> pages have their own. You would get two.

**Two safeties, both tested:**
- Refuses `--live` while `config.staging` is true
- Idempotent by slug+parent — re-running updates, never duplicates

### What was verified about the WordPress target
- WordPress + **Elementor 4.1.4**, REST API open (`wp-json` 200, `wp/v2/pages` 200)
- **7 existing pages**, all top-level: home, about, activities, testimonials, contact-us,
  the-bridges, luxury-home-painting-southern-california
- `/irvine/` returns **404** — no slug collisions
- **Rank Math** installed, emits its own JSON-LD
- **Site Kit by Google** installed — Search Console may already be verified on the real domain
- Homepage uses a custom `vip-landing-page.php` on a custom `vip-premier` theme

---

## 4 · THE THREE THINGS TO DO BEFORE `--live`

1. **Create a WP Application Password** — WP Admin → Users → Profile. Revocable without
   changing the account password. Then set, in the shell and **never in the repo**:
   ```
   WP_URL=https://viphomepainting.com
   WP_USER=<username>
   WP_APP_PASSWORD=<the generated password>
   ```
2. **Turn off Rank Math's schema for Pages** — Rank Math → Titles & Meta → Pages →
   Schema Type: **None**. Ours is richer and page-specific; two competing graphs is worse
   than one.
3. **Move the visualizer photos** — 30MB, 136 files in
   `orange-county-sales-page/viz-photos/`. Upload to WP media or they will still be served
   from the old host.

### Then launch is one edit

In `generator/communities.json` → `config`:
```json
"staging": false,
"siteBase": "https://viphomepainting.com"
```
Then `node generator/generate.js && node generator/verify-site.js` and all pages flip from
`noindex` to indexable. `verify-site.js` **fails the build in both directions** — a staging
build with an indexable page, and a live build with a stray noindex.

---

## 5 · WHY THE BUILD SITE IS `noindex` RIGHT NOW

github.io is **staging, not the destination.** It was originally wide open to Google —
`Allow: /`, a published sitemap of 15 URLs, canonicals pointing at github.io.

If Google indexed the staging copy first, the WordPress launch would compete with its own
twin, with the canonical telling Google **github.io is the original** — and GitHub Pages
cannot issue a 301 to undo it.

**Checked before acting: a `site:` query returned zero. Nothing was indexed.** All 18 pages
now carry `noindex, nofollow`, driven by `config.staging`.

---

## 6 · THE TWO GATES — never publish with either red

```bash
node generator/validate-brief.js irvine    # the INPUT — the brief
node generator/verify-site.js              # the OUTPUT — rendered HTML
```

`verify-site.js` runs 11 checks over all 18 pages: dead links, absolute links, banned copy,
warranty length vs config, schema parsing, FAQ-schema/visible parity, canonicals, the silo
rule, nav consistency, pillar→article integrity, module-order uniqueness, and indexation
posture.

**Every mistake that ever reached a live page was invisible to input validation** — "Free
Quote" and a fake 5-star rating came from hardcoded generator strings, and absolute links
404'd on GitHub Pages twice. That is why the second gate exists.

---

## 7 · HARD RULES THAT MUST SURVIVE THE MOVE

- Never **"free"** → "complimentary" · Never **"AI"** in customer copy → "our design team"
- **US spelling** — the build fails on "colour" (it caught me twice)
- **No `aggregateRating`, no review counts, no star ratings.** VIP has **9** reviews and the
  rating is unconfirmed. A false one was live and was removed.
- **Never invent** street names, HOA rules, client stories or reviews
- Phone is **(909) 312-5400** and nothing else
- Pricing: **"VIP starts at $4.75 per square foot of paintable surface"** — never
  "Irvine averages". No project totals; Fabian has not supplied job data
- **Warranty is 2 years**, and it lives in `communities.json → config.warranty`. Never type
  the length into a template. CertaPro also advertises 2, so **never write "longer than the
  competition"**
- Every page needs a **unique `module_order`** — the build fails on duplicates. This is the
  doorway-page guard

---

## 8 · OPEN BLOCKERS

| What | Status | Who |
|---|---|---|
| **Google Business Profile still pinned to Fontana** | Blocks every Maps tactic. Anaheim is the only winnable local pack and it cannot be competed for until the pin moves | **Fabian — needs his login** |
| **DataForSEO returns 403** | Connector registered, not authenticated or unfunded. A VIP-specific 5-prompt report pack is ready in `generator/research/_global/prompts/` | Fabian |
| **Search Console / Bing not connected** | Waiting on the domain move — verification has to be redone after migrating, so do it once, after | After migration |
| **Keystone Pacific question** | An MLS listing gives Summit Pointe's manager as (949) 833-2600 = Keystone Pacific, who run 4 of 6 Irvine villages. Other listings conflict. **One phone call settles it** — and it unlocks the Anaheim HOA page | Fabian |
| CSLB licence number · EPA Lead cert | In progress | Fabian |
| Real project totals · actual Google rating · are the 3 testimonials real | Unanswered | Fabian |

---

## 9 · THE SYSTEM, IF YOU NEED TO GO DEEPER

- **`docs/PIPELINE-MAP.md`** — the whole system on one page with a diagram, every box linked
  to the file that governs it
- **`docs/ROUTINES.md`** — five prompts that run a city cluster unattended
- **`generator/WORKFLOW.md`** — every step, every tool, every command
- **`generator/research/_global/MEMORY.md`** — 30 findings. **Read M-01 through M-10 before
  making strategy decisions**; several of them reversed earlier assumptions
- **`generator/research/_global/TOOLS.md`** — which tools are proven, which are not, and the
  acceptance test a new one has to pass
- **`context/FABIAN.md`** — how to work. Wins when anything conflicts

**Six skills**, mirrored in `generator/skills/`: `marcus-local-seo` (market research) ·
`vip-research-agent` (buyer language / Halo) · `vip-copywriter` (page copy) ·
`vip-copywriter-agent` (reels, ads, hooks) · `vip-blog-writer` · `vip-page-builder`

---

## 10 · SUGGESTED FIRST MOVE IN THE NEW THREAD

```bash
node generator/generate.js && node generator/verify-site.js
node generator/publish-wp.js irvine
```

That rebuilds everything, proves both gates are green, and shows exactly what would go into
WordPress — without writing anything. Then work through §4.
