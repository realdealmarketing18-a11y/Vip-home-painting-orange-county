# Decisions — architectural choices and the reason behind each

Layer: **Project memory** (B.L.A.S.T. Protocol 0). One entry per decision that would be
expensive to reverse or easy to undo by accident. If a decision changes, edit the entry and
say what changed — never delete the reasoning.

---

## D-01 · Pages are generated, never hand-written
Edit data, run the generator. Hand-editing a page in `irvine/` or `anaheim/` is overwritten
on the next build and the edit is lost silently.
**Why:** 19 pages share one design system. A hand-edit is a fork, and forks drift — the
county page's nav and footer both drifted this way and shipped 18 dead links.

## D-02 · github.io is the build site; WordPress is the destination
`communities.json → config.staging: true` makes every generated page `noindex,nofollow`.
**Why:** a staging twin that Google indexes becomes a competitor to the real page. At launch:
`staging: false`, point `siteBase` at the real domain, rebuild. One edit.

## D-03 · One exception — the front page is indexable
`config.countyIndexable: true` publishes the Orange County page to WordPress as
`index,follow` while everything below stays dark.
**Why:** viphomepainting.com's home page was already live and indexed. Shipping it `noindex`
would have pulled a running business's home page out of Google.
**Subtlety:** the flag applies only to the *WordPress copy*. The github.io twin of that page
stays `noindex` — same page, two destinations, two answers.

## D-04 · Two gates, and the output gate matters more
`validate-brief.js` checks the input; `verify-site.js` checks rendered HTML.
**Why:** every miss that reached a live page was invisible to input validation — "5-Star
Rated" in a badge strip, `Irvine averages $4.75` in an FAQ, 18 dead footer links, a broken
badge path. Input can be perfect while output is wrong. Never publish with either red.

## D-05 · The gates run on the county page too
For a long time the copy rules ran only on the 18 generated pages. The front page — the most
visible page on the site — was exempt, which is how the banned rating claim and the banned
price claim survived. A rule that skips a page is not a rule.

## D-06 · Elementor Canvas for generated pages
`publish-wp.js` publishes onto `elementor_canvas`.
**Why:** no theme chrome, so generic class names (`.body`, `.page`, `.ttl`) cannot collide
with the theme. Elementor itself stays for the pages Fabian designs by hand — home, about,
contact, gallery. The generator never touches those.

## D-07 · Three server-side plugins are load-bearing
`wp-mu-plugins/` in this repo mirrors files that live on the server. Without them pages
publish and render *badly*: `wpautop` injects `<p>` inside the `<style>` block and kills the
CSS, the theme stylesheet overrides fonts and layout, Rank Math emits a competing JSON-LD
graph and drops `og:image`. All three were invisible to a status-code check.

## D-08 · File-based agent handoff, no agent-to-agent calls
Three agents share one queue and read/write the same files. `pipeline.js claim` refuses to
advance a cluster whose gate fails, so broken work cannot hand off.

## D-09 · Header logo is a brush image plus live text, not one image
Tested the full lockup as a single header image: at a 46px bar the wordmark rendered 9.6px
and the tagline 4.6px, because the brush is tall (aspect 0.40) and sets the scale.
**Why it stays split:** live text holds 21px / 10.5px, stays crisp at any DPI, resizes per
breakpoint, and is readable by crawlers. The brush is cropped from the real artwork, so its
form is the original pixels.

## D-10 · The brush size is `!important`, driven by a custom property
A theme rule carrying `!important` beat the plain version and blew the brush up to
460×1232, running it over the wordmark. `--brush-h` keeps the four responsive steps as
ordinary CSS instead of an `!important` arms race.

## D-11 · Asset override for the navy brush *(temporary)*
Everything under `wp-content/uploads/vip-assets/` was placed with the Novamira file
connector. It was offline when the navy brush was added, so that one file went in through
the WordPress media library and sits at `/uploads/2026/08/`. `publish-wp.js` carries a
one-entry override map.
**Undo:** copy the file into `vip-assets/assets/logos/`, delete the entry.
