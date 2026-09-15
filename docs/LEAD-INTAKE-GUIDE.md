# Turning On the Photo Upload — Launch Guide

**Use this when the new front page is finished and you're ready to publish it with forms.**
Until then, nothing here needs doing. The page works on the GitHub preview by opening a text
message or email instead, which is correct for a staging copy (**D-02**).

Plain-English steps. Technical detail for every step lives in
`generator/wp-mu-plugins/README.md`, section 5.

---

## What this turns on

Step Five of the page ("Now Do It On Your House") asks a homeowner for a photo of their house.

- **Without the plugin:** the form opens a pre-filled text or email and asks them to attach the
  photo themselves. Some people drop off right there.
- **With the plugin:** the photo uploads straight from the page. WordPress saves it as an
  **Elevation Request** (photo, name, community, contact, and the scheme / lighting / siding /
  premium they picked), emails you, and shows the homeowner a confirmation.

The plugin file is already written: `generator/wp-mu-plugins/vip-elevation-intake.php`.
**It is not on the server yet** — checked 2026-09-15, the site's route list has no `/elevation`.

---

## Before you start — do not skip these

- [ ] **Hero and all sections are finished.**
- [ ] **Fix the one known copy bug** — `orange-county-sales-page/index.html` says
      "2-Year Warranty & Stress-Complimentary Experience". Change it to
      **"2-Year Warranty & Concierge Experience"** (**D-13**).
- [ ] **Any `[VERIFY]` numbers are replaced with real job numbers** — see
      `generator/research/orange-county/00-SUMMARY.md`.
- [ ] **Both gates are green:** `node generator/verify-site.js`. Never publish on red.
- [ ] **You know your real turnaround.** Whatever the Step Five button promises, a homeowner
      will hold you to it. Run test **T4** in `generator/viz-render/VIZ-RENDER.md`: upload a
      house you own, render it, deliver it, and time it. **That measured time is the only number
      that goes on the button.**
- [ ] **Someone owns incoming requests** — who opens Elevation Requests every day, and renders them.

---

## Step 1 — Publish the new page

```bash
node generator/publish-wp.js --only=county          # dry run — read what it will do
node generator/publish-wp.js --only=county --live   # publish
```

Then **purge the LiteSpeed cache** in WordPress. If you skip this, you'll check the old cached
page and think the next steps failed.

## Step 2 — Put the plugin file on the server

**File:** `generator/wp-mu-plugins/vip-elevation-intake.php`

**Where it goes** (either works — use whichever access you have):

| Access | Folder |
|---|---|
| Novamira connector (same way the other four plugins went in) | `wp-content/novamira-sandbox/` |
| Your host's file manager or SFTP | `wp-content/mu-plugins/` |

Put the file **directly** in that folder, not inside a subfolder. There is no "Activate" button —
files in these folders turn on by themselves.

**Nothing to configure.** One thing to check: notifications go to the WordPress admin email, so
confirm **Settings → General → Administration Email Address** is an inbox you actually read.

## Step 3 — Prove it works (three checks)

1. **The route exists.** Open `https://viphomepainting.com/wp-json/vip/v1` in a browser.
   `/vip/v1/elevation` must appear in the list. If it doesn't, the file isn't loading.
2. **The page knows about it.** Open viphomepainting.com, view the page source, and search for
   `VIP_UPLOAD_ENDPOINT=`. It should be there.
3. **A real submission, from your phone.** Upload the front of a house you own, then confirm all three:
   - the page shows *"Your photo is with the design team"*
   - the request appears in **wp-admin → Elevation Requests**, with the photo attached
   - the notification email arrives

   If the email never comes but the request is in wp-admin, the lead is safe — WordPress just
   can't send mail yet. Fix that with an SMTP plugin; don't turn the upload off.

---

## Step 4 — Connect it to your agents *(not built yet)*

After Step 3, a request is **saved in WordPress and emailed to you**. It does **not** reach the
agents in vip-lead-machine yet. They listen for leads at `/wp-json/vip/v1/lead`, which is live
today, and nothing sends elevation requests there.

**Recommended:** have the intake plugin also hand each request to the existing `/lead` door. One
lead list, and the Response Handler doesn't need to learn anything new. It's a small addition to
the plugin, but check what fields `/lead` expects before building it, and test it with a real
upload before trusting it.

**Until that's built:** the email is your alert. Answer it by hand.

---

## If something goes wrong

| What you see | Most likely cause | Fix |
|---|---|---|
| `/elevation` isn't in the route list | File in the wrong folder, or inside a subfolder | Move it directly into the folder |
| The page still opens a text message | Cached page, or the page wasn't published by `publish-wp.js` | Purge LiteSpeed; republish with Step 1 |
| "Larger than 12MB" | Photo too big | Any normal phone photo works |
| "Not a photo we can render from" | File isn't JPG, PNG, WEBP or HEIC | Send a normal photo |
| Uploads stop working **while you're testing** | **Limit: 5 uploads per hour per internet connection** — a spam guard | Wait an hour. This will catch you if you test repeatedly. |
| Request saved, no email | WordPress can't send mail | SMTP plugin — the lead is still recorded |

## Turning it back off

Delete the file from the server folder. Step Five falls back to the text/email version
automatically and nothing else breaks. Requests already received stay in the database and
reappear if the file goes back in.
