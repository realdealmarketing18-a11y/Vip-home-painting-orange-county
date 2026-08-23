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
- Output gate at **18 checks**, green
- Visualizer verified live: 11/11 colour schemes, 9/9 options, on both Irvine and Anaheim

---

## Verification currently passing

```bash
node generator/generate.js       # build all pages
node generator/verify-site.js    # 18 checks, must be green before any publish
```

Live spot-checks that have been run and passed: our CSS parses (`.page` present in
`document.styleSheets`), body font is Inter not the theme's Montserrat, one JSON-LD graph not
two, no horizontal scroll at 320/375/475/700/768/1024/1280/1366/1440/1920, hero fits the fold
at every breakpoint, all 23 front-page internal links resolve.

---

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
