# Moving off the cloud — running this project locally

Written 2026-09-13, at the end of the session that built the hero selection
reel and Step Five. Everything in it is pushed to `main`.

---

## WHY

Four things failed in the cloud session, and every one of them was the
environment rather than the work:

| What | What happened |
|---|---|
| **Novamira** | Never connected. No tools for it at all, so the server-side PHP could not be installed. |
| **WordPress** | `WP_URL` / `WP_USER` / `WP_APP_PASSWORD` are not set there, so `publish-wp.js` could only ever dry-run. |
| **Higgsfield results** | The T1 render finished, but the result CDN is blocked by the egress proxy — `curl` got a 403 and a headless browser got a tunnel failure. The image could not be pulled back to grade it. |
| **CodePen** | Blocked, so a design reference could not be read. |

All four work normally on your own machine. Nothing about the repo needs to
change — the work is on `main`, and a local clone picks it up.

---

## GETTING RUNNING

You already have a clone at `C:\Users\Owner\oc-site\`. In a terminal:

```
cd C:\Users\Owner\oc-site
git pull origin main
```

If Claude Code is not installed yet:

```
npm install -g @anthropic-ai/claude-code
```

Then, from inside `C:\Users\Owner\oc-site`:

```
claude
```

It reads `CLAUDE.md` on start, so the constitution, the hard rules and the
memory files load automatically — same as the cloud session.

**Preview the site locally:**

```
node orange-county-sales-page\serve-oc.js
```
→ http://localhost:5460/

**The two gates, which must both be green before anything publishes:**

```
node generator\generate.js        rebuild all 21 pages
node generator\verify-site.js     the output gate
```

---

## WHAT TO SET UP THAT THE CLOUD COULD NOT

### 1 · WordPress credentials

`publish-wp.js` reads these from the environment. **Never put them in the
repo** — an Application Password is revocable, which is exactly why we use
one instead of the real login.

Create it at **WP Admin → Users → Profile → Application Passwords**, then in
PowerShell:

```
setx WP_URL "https://viphomepainting.com"
setx WP_USER "<your wp username>"
setx WP_APP_PASSWORD "<the generated password>"
setx ASSET_BASE "https://viphomepainting.com/wp-content/uploads/vip-assets"
```

`setx` writes them permanently but does **not** affect the terminal you typed
it in — open a new one. Check with `echo %WP_URL%`.

### 2 · The MCP servers

Connect these locally with `claude mcp add`, or put the non-secret ones in a
project `.mcp.json` so the list travels with the repo. I have deliberately not
written that file: I never saw Novamira's actual connection details in this
session, and guessing them would be worse than leaving it to you.

| Server | What it unblocks |
|---|---|
| **Novamira** | Writing PHP into `wp-content/novamira-sandbox/` — which is how `vip-elevation-intake.php` gets installed and Step Five goes live |
| **Higgsfield** | The render pipeline, and pulling T1's result back to grade it |

`claude mcp list` shows what is connected once you are running.

---

## THE WORK QUEUE, IN ORDER

Everything below is blocked on something only a local session can do.

**1 · Install the intake plugin** — `generator/wp-mu-plugins/vip-elevation-intake.php`
into `wp-content/novamira-sandbox/`, the same way the other four went in.
Nothing to configure; it prints `window.VIP_UPLOAD_ENDPOINT` into generated
pages and Step Five switches from the text-message handoff to a real upload on
its own. The README in that folder has the three post-install checks.

**2 · Grade T1** — job `4f7a4854-832a-487f-aa04-d3a02c83555e`, sitting in your
Higgsfield account. `generator/viz-render/T1-RESULT.md` carries the seven-point
gate and maps each kind of failure to its specific fix. It is **not** a pass
yet; nobody has looked at the image.

**3 · Upload `viz-photos/` to WP media** — and this one bites if it is
skipped. The hero reel needs five specific files at `ASSET_BASE`:
`scheme-pebblebeach`, `-ibiza`, `-pacificsage`, `-obsidian`, `-spanish`.
This is **F-16 in the repair log** happening again — the time only 3 of 11
scheme photos were uploaded and clicking a palette silently fell back. The
plate degrades to the finished render rather than to nothing, but the image
still has to exist.

**4 · Publish to WordPress** — dry run first, always:

```
node generator\publish-wp.js --only=county
node generator\publish-wp.js --only=county --live
```

Two standing items from the publisher's own pre-flight: turn Rank Math's Page
schema off (ours is richer and page-specific; two competing graphs is worse
than one), and point `ASSET_BASE` at the media library.

**5 · Run T4 and fill in the promise** — one house end to end, timed. That
measured number is what goes on the Step Five button. It is a promise printed
on a button, and the day it slips it damages the one position no competitor
can copy. Do not guess it.

---

## WHAT IS ALREADY DONE AND VERIFIED

- Hero selection reel on all 21 pages: dissolves through four candidate
  palettes, wipes to the fifth, then hands over the drag handle
- The candidate carousel band on the county page, on the pale ground with the
  VISUALIZED ghost word
- Step Five, full width, collecting address/community + full name + cell
- Both submit paths tested against a stubbed endpoint: a good submission POSTs
  multipart and reaches the done state; a server error surfaces its own message
  and offers the text fallback
- `generate.js` + `verify-site.js` green at 21 checks across 21 pages
- Live on the build site:
  https://realdealmarketing18-a11y.github.io/Vip-home-painting-orange-county/orange-county-sales-page/

**viphomepainting.com has not changed.** That is WordPress, and it only moves
when `publish-wp.js --live` runs — step 4 above.
