# WordPress-side fixes — required for generated pages to render

These two PHP files live **on the server**, not in this repo's build. They are kept
here so they are not lost if the site is rebuilt, migrated, or restored from a backup.

**Installed at:** `wp-content/novamira-sandbox/` on viphomepainting.com
*(Novamira restricts PHP writes to that directory; `mu-plugins` would work equally well
if you have file access.)*

| File | Fixes |
|---|---|
| `vip-rankmath-rest-meta.php` | Rank Math silently overriding the SEO head |
| `vip-generated-pages.php` | WordPress and the theme silently breaking the CSS |

**Without these, the pages publish and render — badly.** Both problems were invisible
to a status-code check and only showed up on the live page.

---

## 1 · `vip-rankmath-rest-meta.php`

Rank Math stores its SEO fields as post meta but **does not register them for REST**, so
values sent by `publish-wp.js` were dropped with no error.

What that looked like live, on the first published page:

- `" - VIP Home Painting"` appended to a title that was already complete
- A meta description auto-generated from page content, which grabbed a **CSS comment**
  out of our inline styles: `="/* badges relocated under viz heading */"`
- `index, follow` forced over our `noindex` — on a page whose internal links did not
  resolve yet
- A **second JSON-LD graph** competing with ours

Registering the keys lets the publisher set title, description, canonical, robots and
`rich_snippet = off` in the same call that creates the page.

## 2 · `vip-generated-pages.php`

Applies only to pages flagged with post meta `_vip_generated = 1`, which `publish-wp.js`
sets. Nothing else on the site is affected — home, about, contact and anything built in
Elementor keep the theme exactly as it is.

**`wpautop` was injecting `<p>` and `<br>` tags inside our `<style>` block.** The browser
stops parsing CSS at the first tag, so most of the stylesheet silently never applied.
Confirmed live: `.page` and `.topbar` were absent from `document.styleSheets` entirely
while still being present in the style element's text. The page rendered as unstyled
fragments — correct content, no design.

**The theme's stylesheet still loaded.** Elementor's Canvas template removes the theme's
header and footer *markup* but does not dequeue its CSS, and the theme sets
`body { font-family: var(--vip-fb) !important }`, so it won overall. Body type came out
as Montserrat instead of Inter, `.page` lost its 1440px max-width, and `.topbar` fell
back from grid to block.

The plugin removes `wpautop`/`wptexturize` from `the_content` and dequeues **only** the
active theme's own stylesheets — Elementor and other plugins are left alone.

---

## Verifying they are working

On any generated page:

```
node -e "fetch('https://viphomepainting.com/anaheim/').then(r=>r.text()).then(h=>{
  const css = h.slice(h.indexOf('<style>'), h.indexOf('</style>'));
  console.log('p-tags inside CSS :', (css.match(/<p>|<br/g)||[]).length, '(want 0)');
  console.log('theme stylesheet  :', /themes\/[^\"]*\.css/.test(h) ? 'LOADED — bad' : 'absent — good');
})"
```

In a browser console on the page — the decisive check, because the CSS can be present in
the DOM and still not parse:

```js
[...document.styleSheets].some(s => { try { return [...s.cssRules]
  .some(r => r.selectorText === '.page'); } catch(e) { return false; } })
// true = our stylesheet parsed
```

## If a page ever renders as unstyled text again

In order of likelihood:

1. `_vip_generated` meta missing on that page — the plugin skips it
2. A sandbox file got disabled or the sandbox was cleared
3. LiteSpeed served a cached copy from before a fix — purge, then re-check. Verifying
   before purging reports phantom bugs.
