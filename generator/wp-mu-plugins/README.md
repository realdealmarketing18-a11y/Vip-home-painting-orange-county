# WordPress-side files — required for generated pages to render and convert

These five PHP files live **on the server**, not in this repo's build. They are kept
here so they are not lost if the site is rebuilt, migrated, or restored from a backup.

**Installed at:** `wp-content/novamira-sandbox/` on viphomepainting.com
*(Novamira restricts PHP writes to that directory; `mu-plugins` would work equally well
if you have file access.)*

| File | Fixes |
|---|---|
| `vip-rankmath-rest-meta.php` | Rank Math silently overriding the SEO head |
| `vip-generated-pages.php` | WordPress and the theme silently breaking the CSS |
| `vip-rankmath-head.php` | Two competing JSON-LD graphs, and a missing `og:image` |
| `vip-fonts.php` | Fraunces and Inter not loading at all on WordPress |
| `vip-elevation-intake.php` | Step Five had nowhere to send a photo — **adds a feature, does not fix a bug** |

**Without these, the pages publish and render — badly.** Every one of these problems was
invisible to a status-code check and only showed up on the live page.

All of them apply **only** to pages carrying `_vip_generated = 1`. Anything Fabian builds
in Elementor — home, about, contact, gallery — is untouched.

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

## 3 · `vip-rankmath-head.php`

`publish-wp.js` sends the body, styles, scripts and JSON-LD — **not the source file's
`<head>`**. Title, description, canonical and robots survive because they travel as Rank
Math meta. Everything else in the head does not, and two things went wrong on the live
front page because of it:

- **Two JSON-LD graphs.** Our pages carry a page-specific graph in the content. Rank Math
  emits its own generic one into the head no matter what `rank_math_rich_snippet` says.
  The filter `rank_math/json_ld` returns an empty array for our pages, leaving one graph.
- **No `og:image`.** Rank Math filled in title/description/url and left the image empty,
  so every share of the home page was a bare text card. The plugin prints the image tags
  itself, and refuses to if the file is not on disk.

**Also fixed at the same time, and not by this plugin:** Rank Math was publishing
`twitter:data1 = realdealplanning@gmail.com` under "Written by", because WordPress user 1
had its **display name set to the email address**. It is now "VIP Home Painting". The
login is unchanged — `user_login` and the password were not touched. If a new admin user
is ever created, set its display name before publishing anything.

## 4 · `vip-fonts.php`

**`publish-wp.js` sends the body, styles, scripts and JSON-LD — never the source
file's `<head>`.** Anything that has to be in the head reaches github.io and not
WordPress, and nothing warns you.

The generated pages used to carry an `@import` for Fraunces and Inter inside their
`<style>` block, which travelled with the content and worked. That `@import` was
removed for a real reason — it is the slowest way to load a font, because the
browser cannot discover it until the sheet has downloaded and parsed — and replaced
with a `<link>` in the head. Which never arrived.

Result, confirmed live on all 19 pages: **zero requests for either family.** The CSS
still named them, so they fell back to the theme's Cormorant Garamond and a system
sans — close enough to the real thing to miss at a glance.

This enqueues them properly, in the head, with preconnect, on `_vip_generated`
pages only.

**The general lesson:** if a change belongs in `<head>`, it needs a WordPress hook.
Putting it in the source file's head only ships it to the build site.

```
node -e "fetch('https://viphomepainting.com/').then(r=>r.text()).then(h=>{
  const f=[...h.matchAll(/fonts\.googleapis\.com\/css2\?[^'\"]+/g)].map(m=>m[0]);
  console.log('Fraunces:', f.some(x=>/Fraunces/.test(x)));
  console.log('Inter   :', f.some(x=>/Inter:wght/.test(x)));
})"
```

## Re-registering the assets in the Media library

The 146 files under `wp-content/uploads/vip-assets/` are served as static files. They were
also registered as WordPress attachments so they appear in **Media**, but this must be done
with intermediate size generation **off**:

```php
add_filter( 'intermediate_image_sizes_advanced', '__return_empty_array', 99 );
add_filter( 'big_image_size_threshold', '__return_false', 99 );
```

**Why this is not optional.** `wp_generate_attachment_metadata()` writes resized copies into
the same folder. The visualizer probes that folder by filename (`scheme-obsidian.jpg`,
`premium-limestone-pillars--ibiza.jpg`), so extra files there are not harmless clutter — and
a scanner that re-reads the folder will register its own thumbnails and recurse. That
happened once: 146 files became 511 before it was caught.

To undo a bad run, delete the attachment rows with **direct SQL**, not
`wp_delete_attachment()` — that function deletes the file too and will take the originals.

## If a page ever renders as unstyled text again

In order of likelihood:

1. `_vip_generated` meta missing on that page — the plugin skips it
2. A sandbox file got disabled or the sandbox was cleared
3. LiteSpeed served a cached copy from before a fix — purge, then re-check. Verifying
   before purging reports phantom bugs.


---

## 5 · `vip-elevation-intake.php`

The only one here that adds something rather than repairing something.

Step Five asks a homeowner for a photo of their house. Without this file there
is nowhere on the server to put it, so the section falls back to pre-filling a
text message or an email and asking them to attach the photo themselves. That
works, and it is honest, but it loses people at the last step.

Installing this file is what turns the real upload on. Nothing to configure:
it prints `window.VIP_UPLOAD_ENDPOINT` into every page carrying
`_vip_generated = 1`, and Step Five switches over on its own. On the github.io
build there is no WordPress, the variable never appears, and the text-message
handoff keeps working — which is correct, because that copy is the build site
and not the destination (**D-02**).

**What it does with a submission**

1. Files the photo in the media library — `media_handle_sideload` picks the
   filename, never the visitor.
2. Creates a private `vip_elevation` post so leads are searchable in wp-admin
   six months later, with the photo as its featured image. An inbox alone is
   not a record.
3. Emails the admin address. Override the recipient with the
   `vip_intake_notify` filter.
4. Answers in JSON. The page reads it and shows the confirmation without
   navigating — a native form POST would drop the visitor onto raw JSON.

**Why the defences are what they are**

This is the one public unauthenticated endpoint on the site, and a cached
static page cannot carry a useful nonce. So instead:

- the file is validated **by its bytes** (`getimagesize`), not its name or the
  declared MIME — JPG, PNG, WEBP and HEIC only
- 12MB cap, which is a phone photo and not a RAW
- a honeypot field no human ever sees or fills
- five submissions per IP per hour
- every text field sanitised on the way in

**After installing, check three things**

1. `POST /wp-json/vip/v1/elevation` returns 400 with no photo attached — if it
   404s, the file is not loading.
2. A real submission appears under **Elevation Requests** in wp-admin with the
   photo attached.
3. The notification email arrives. If WordPress cannot send mail, the lead is
   still recorded — that is the reason step 2 exists.

**Do not turn this on and walk away.** The moment it works, a homeowner can
send you their house, and `generator/viz-render/VIZ-RENDER.md` is the promise
on the other end of it — including the turnaround, which test T4 still has not
measured.
