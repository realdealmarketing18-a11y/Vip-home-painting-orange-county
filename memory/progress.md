# Progress — what was done, errors hit, tests run, results

Layer: **Project memory** (B.L.A.S.T. Protocol 0). Append; don't rewrite history.

---

## Shipped

**19 pages live on viphomepainting.com**, published by `generator/publish-wp.js`.

| Cluster | Pages | State |
|---|---|---|
| Orange County | 1 — the front page (WP id **4046**, `index,follow`) | live, top of the silo |
| Irvine | 13 — hub · 6 villages · HOA · pillar guide · 4 cluster articles | live, `noindex` |
| Anaheim | 5 — hub · Peralta Hills · Summit Pointe · Belsomet · Crown Pointe | live, `noindex` |

**Supporting infrastructure**
- 146 asset files on the server and registered in the WordPress Media library
- 3 server-side plugins installed (`generator/wp-mu-plugins/` mirrors them)
- Output gate at **21 checks**, green (was 18; the hero work added three)
- Visualizer verified live: 11/11 colour schemes, 9/9 options, on both Irvine and Anaheim

---

## Verification currently passing

```bash
node generator/generate.js       # build all pages
node generator/verify-site.js    # 21 checks, must be green before any publish
```

Live spot-checks that have been run and passed: our CSS parses (`.page` present in
`document.styleSheets`), body font is Inter not the theme's Montserrat, one JSON-LD graph not
two, no horizontal scroll at 320/375/475/700/768/1024/1280/1366/1440/1920, hero fits the fold
at every breakpoint, all 23 front-page internal links resolve.

---

## Hero redesign — county page, 2026-09-13 → 09-16

**Why it started:** Fabian was blocked on launching because the Higgsfield commercials did
not look real. The hero's film block was replaced with something that needs no film.

**What the county hero is now.** A before/after plate where the before never moves.
`viz-photos/base.webp` — the Gallaghers' actual unpainted house — sits under every scheme
layer and is never clipped, so the left of the seam is always the real house and the right is
always a repaint of the same frame. That only reads as one house because base.webp and every
render share a camera position and dusk light.

- Four schemes, each with its **own** swipe: Riviera Tuxedo → Euro-Industrial Estate →
  Newport Admiral → **Coastal Organic Compound**, ending on the one that was chosen and
  painted. ~9.6s end to end, all timings derived from the plate's `data-dur`.
- Autoplay waits until the plate is **65% on screen** and re-arms when it leaves. At the
  old `.3` threshold the sweep ran at page load and was over before anyone looked — see F-18.
- The three steps light and pulse in order, 1 held across all four swipes.
- Gallagher chip opens the hero; their photo appears again beside the caption under the
  plate; the caption counts 4 of 11 and links into section two.

**Section two absorbed the "Why Get A Complimentary Consultation" section.** Two sections
were arguing the same case in different words, and that one's before/after frame was a stock
Unsplash photo of a house that is neither the Gallaghers' nor a VIP project. Its headline and
its three reasons now sit under the renders that prove them. The band carries its own seven
schemes plus the chosen one as the payoff card, every card a before/after on the real base
photo, and a lightbox that enlarges any of the eleven with one autoplayed sweep then a manual
drag.

**Copy grounded back in the research** after drifting into invented lines. The band's three
reasons now map one-to-one onto the ranked pains in `COPY-FRAMEWORK.md`: choice overload,
wrong colour, unclear estimates. The third is new and comes straight from
`research/irvine/00-SUMMARY.md` — nobody in the market publishes pricing, and cost queries
are the highest-intent searches in the industry.

**Built and removed in the same stretch:** a sticky CTA dock. It worked, but it covered
content as visitors scrolled, and the header is already sticky with the phone number and
Complimentary Quote.

**Verified rather than assumed.** Every change was measured in a real browser at up to nine
viewports, including short browser windows (1228×584, 1244×620), not just full-height device
presets. Traces held: the four-swipe sequence and step timing, all eleven schemes reachable
and hit-tested with `elementFromPoint`, lightbox drag under mouse and touch, the reel settling
at seam 50 on all five page types with no 404s and no script errors.

**This is on the build site only.** Nothing has been published since, so the WordPress live
count is unchanged. `publish-wp.js --live` has still never run for this work.

### The copy rewrite, 2026-09-16

`research/orange-county/00-SUMMARY.md` and `07-VOICE.md` landed from a parallel session while
the hero work was in flight — the same day this file recorded them as missing. The hero and
section-two copy was rewritten against them.

**The research named the previous lede as the thing to replace**, which makes this a
correction rather than a polish. Its criticism, verbatim: *"a paint chip in a store tells you
almost nothing" aims at the **lazy** buyer — the one who grabbed a chip at the store. The real
customer is the opposite of lazy.* The documented case did weeks of research, samples on three
exposures, and asked Sherwin-Williams staff — and still ended up with a house she felt sick
about.

| | Before | After |
|---|---|---|
| H1 | "…Visualized Their Dream Home in 30 Minutes" | "…**Get Exterior House Painting Right the First Time**" |
| Band lede | "A paint chip in a store tells you almost nothing…" | "Weeks of samples on three different walls, and the color still **read** wrong once it was up… the only thing that predicts your whole house is your whole house." |
| Reason 1 | "No sample jars, no squinting at a card in the driveway" | "Not swatches on three walls — the whole facade, in **your light**…" |

**Two findings drove the H1.** Theme 1 of the voice research: the aspiration is **competence,
not beauty** — *"I really determined not to make a rookie mistake on this."* She is not
dreaming about the house, she is dreaming about not having failed at it, which is a target no
competitor is aiming at; "Dream Home" was selling the beauty she is not shopping for. And
`00-SUMMARY.md`'s on-page audit flagged the old H1 as carrying **no service term** against a
transactional cluster of `house painters orange county` / `exterior painting orange county`.

**The claim moved from "shortcuts fail" to "doing it carefully fails too."** That is the
research's "most valuable single finding" — it turns the visualizer from a convenience into a
category correction, which is a position rather than a feature.

**Her vocabulary is on the page; her words are not.** "reads", "swatches", "your light",
"permanent" all come from the glossary. No quote is reproduced: the source is a homeowner on a
public forum, not a VIP client, and attributing her sentences on a sales page would read as a
testimonial she never gave.

**Found while measuring, not by reading:** the hero tray had grown to 179px. Thumbs flex to
fill, and with four of them under a 790px plate instead of five under a 430px one, each had
ballooned to ~150px. Capped at 88px — 72px back.

**Still not applied from the research:** the `[VERIFY]`-marked $12,000–$15,000 second-repaint
figure (needs a real closed job first, per the worksheet's own instruction), the schema
additions in Finding 4 (`areaServed` city entities, `Service` + `Offer` with
`unitText: "square foot of paintable surface"`, `ImageObject`, `BreadcrumbList`), and alt text
on the before/after renders naming their SW colors.

### The ad funnel, 2026-09-16

`generator/agents/copywriter/FUNNEL-3-STEP-ADS.md` — new, the first campaign SOP in the repo.
Part F of `HEADLINE-FORMULAS.md` had the formulas but nothing said in what **order** they run,
so every ad started from a blank page.

Three steps: **name the problem** (cold — the method she was going to use is broken), **prove
the fix** (warm — the hero reel, one house, four schemes, the chosen one), **ask for the 30
minutes** (hot — B5/B2, the itemized estimate, the phone). Step 3 never runs to cold traffic:
until she agrees her method is broken, an offer to fix it reads as an ad for a painter, and
there are fifty of those.

**The hook is arithmetic, not opinion.** A 2×2 swatch is 4 square feet; an OC exterior is
about 3,000 — 750× larger, in a light the swatch never sat in. Nobody can argue with it and no
citation is needed, which makes it the strongest line the research produced. Part F's "draft
10, kill 9" is done inside the document rather than left as an instruction, with the verdict
on each of the ten written down.

**Ads have no gate.** `verify-site.js` checks pages; nothing checks a Facebook ad, so the
document carries the check itself as a pre-flight list — the banned words, and four traps
specific to this surface: the `[VERIFY]` $12k–$15k figure stays out until a closed job backs
it, the Houzz poster's sentences are never quoted or attributed (her vocabulary is fair, her
words are not), the **Gallagher family is unverified** and must not be called clients in an
ad, and no invented homeowner stands in for one.

Pointers added in `CLAUDE.md` and `COPYWRITER.md` in the same commit, per the golden rule.
**Nothing here has run.** No ad account is connected; every line is a hypothesis with a named
source.

### What broke during it

| What broke | Root cause | Rule now |
|---|---|---|
| Spacing changes that did nothing, three times | An override block placed above later equal-specificity rules, and `.a .b + .c` outranking `.a .c` | **F-17** — the hero override block lives last and every selector in it carries the `.hero-cinema` prefix |
| Plate looked small however it was sized, four rounds | A `vh` cap on its width. Every measurement was taken at full-height viewports, so the cap's worst case was invisible | **F-18** — test the window, not the screen; a `vh` cap is a silent ceiling |
| Hero rendered with a blank left half | A CSS range replaced by start/end markers took 9,637 characters of unrelated rules with it — before/after layers, step pulse, plate sizing, band sizing | Never delete CSS by marker range; assert the neighbours absent before writing. **The gate passed the whole time** — it checks links, copy, schema and indexation, not whether the hero renders |
| The drag handle did nothing in the lightbox | `.lb-knob`, the one element that looks draggable, sat above the grab layer and ate the mousedown. Dragging anywhere else worked, so the first test passed | Decorations over a drag surface need `pointer-events: none` |
| First band card unreachable | `justify-content: center` on a scrolling flex row splits the overflow both ways, and the left half cannot be scrolled to | Flexible spacers instead; verify reachability by hit-testing, not by looking |


## Errors hit, and what they cost

Full register with the rule learned from each: `generator/research/_global/MEMORY.md`
(`F-01…F-16`). The ones that reached a live page:

| What broke | Root cause | Fix |
|---|---|---|
| Page rendered unstyled | `wpautop` injected `<p>` inside the `<style>` block; CSS silently stopped parsing | `vip-generated-pages.php` |
| Wrong title, invented description, forced `index,follow`, second JSON-LD graph | Rank Math does not register its meta for REST, so our values were dropped without error | `vip-rankmath-rest-meta.php` + `vip-rankmath-head.php` |
| Colour schemes did nothing | Only 3 of 11 scheme images uploaded — the visualizer builds 99 URLs at runtime that a markup scan never sees | uploaded all 146 |
| Media registration ran away | Thumbnail generation wrote into the folder the scanner was reading; 146 files became 511 | intermediate sizes off; direct SQL cleanup |
| 18 dead links on the front page | Footer was hand-written; two links pointed outside Orange County | footer generated from `site-nav.js` |
| Banned rating + banned price claims live | Copy rules ran on the 18 generated pages but not the county page | gate extended to the county page |
| Header logo illegible | Wide lockup capped by bar height rendered at 11% scale | brush image + live text |
| Hero 197px past the fold at 1024×768 | Every hero rule keyed off *width*; wide-but-short screens were never covered | height-based breakpoints |

**Two environment traps that produced phantom bugs:** the browser pane runs hidden, so
`requestAnimationFrame` never fires and screenshots time out. Anything rAF-driven must be
shimmed before it can be measured.

---

## Not done yet

- Google Search Console + Bing Webmaster Tools — **needs Fabian's login**
- GBP pin still in Fontana, must move to Anaheim — **needs Fabian's login**
- 64 `images.unsplash.com` hotlinks still standing in for real VIP photography
- `config.staging` still `true` — the 18 city pages are deliberately dark
- Novamira file connector dropped mid-session; one asset is on an override path (D-11)
- **`viz-photos/base.webp` carries a CRMLS watermark.** Cropped out of the hero (16:9) and
  the band cards (background-size), but it is an MLS listing photo — a licensing question,
  not a cosmetic one. A clean original of that house would retire the problem.
- **Some scheme renders drifted off the source's dusk light** — `scheme-spanish.jpg` reads
  noticeably brighter than base.webp, which breaks the "same house, same moment" illusion the
  plate depends on. Exactly what the QA gate in `VIZ-RENDER.md` exists to catch. An audit pass
  over all eleven is owed.
- ~~The county copy has not been rewritten against the voice research.~~ **Done 2026-09-16.**
  See the copy-rewrite entry below.
