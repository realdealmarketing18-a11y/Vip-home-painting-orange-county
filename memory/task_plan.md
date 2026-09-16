# Task plan — phases, goals, checklists

Layer: **Project memory** (B.L.A.S.T. Protocol 0).

**North Star:** rank in Google organic and — where VIP has a physical pin — the Maps local
pack, ahead of competitors who have been there longer.

A cluster is **Complete** only when the payload lands: pages live on viphomepainting.com,
both gates green, and the URLs handed over.

---

## Per-cluster checklist

Every city runs the same five gates. `pipeline.js status` is the board.

- [ ] **B — Blueprint** · Marcus research → `research/{city}/` · buyer research →
      `07-VOICE.md` from `HALO-WORKSHEET.md`
- [ ] **L — Link** · brief validates → `node generator/validate-brief.js {city}`
- [ ] **A — Architect** · copy written into `briefs/{city}.json` against
      `RESEARCH-BRIEF-CONTRACT.md`
- [ ] **S — Stylize** · `node generator/generate.js` → `node generator/verify-site.js` green
- [ ] **T — Trigger** · `node generator/publish-wp.js {city} --live` · verify live · commit

---

## Working rule — one cluster at a time

Fabian, 2026-09-16: **finish the page, review it, approve it, then start the next.**
No jumping to another sales page with one still open. `pipeline.js claim` refuses to
start a second cluster; `node generator/pipeline.js approve <slug>` is the sign-off, and
`pipeline.js status` flags any published cluster as `AWAITING APPROVAL` until it lands.

**Current focus: the Orange County master sales page.** It is not finished — open items
are action 0 (publish) and action 1 (the technical half of Finding 4). Nothing on
Newport Beach or Coto de Caza starts until OC is published, reviewed and approved.

### ⚠️ The queue has drifted from reality — reconcile before trusting it

`generator/queue.json` says **Irvine `copy_complete`** and **Anaheim `queued`**. This
file and `progress.md` both say Irvine (13 pages) and Anaheim (5 pages) are published
and live. The queue was not advanced when they shipped, so `pipeline.js next` will hand
an agent work that is already done.

Also: **`orange-county` is not in the queue at all.** The master page is hand-maintained
rather than brief-driven, so it has no cluster row — which means the one-at-a-time guard
cannot see the very page we are working on. Either add a row for it or accept that the
rule is enforced by the docs, not the tool, for this one page. **Fabian's call.**

---

## Cluster status

| City | Stage | Notes |
|---|---|---|
| Orange County | **published**, but the live copy is stale | front page, `index,follow`, top of the silo. The hero redesign (2026-09-13→16) is on the build site only — `publish-wp.js --live` has not run for it |
| Irvine | **published** | 13 pages, gate green |
| Anaheim | **published** | 5 pages; pillar guide + articles still to write |
| Newport Beach | queued | |
| Coto de Caza | queued | |

---

## Next actions, ranked

0. **Publish the hero redesign.** It is finished and gate-green on the build site, and
   viphomepainting.com still shows the old hero. Blocked on a local session only — the cloud
   has no `WP_URL` / `WP_USER` / `WP_APP_PASSWORD`. Order matters, and step 3 bites if it is
   skipped (F-16):

   1. Upload `orange-county-sales-page/viz-photos/` to WP media. The hero needs
      `scheme-riviera`, `-euro`, `-admiral`, `-organic` and `base.webp`; the band needs the
      other seven. A missing file degrades silently.
   2. Install `generator/wp-mu-plugins/vip-elevation-intake.php` into
      `wp-content/novamira-sandbox/` — this is what switches Step Five from the text-message
      handoff to a real upload.
   3. `node generator/publish-wp.js --only=county` (dry run), then `--live`.
   4. Turn Rank Math's Page schema off; point `ASSET_BASE` at the media library.

   Full runbook: `docs/LOCAL-SETUP.md`.

1. **The OC technical half — DO THIS LAST.** Fabian, 2026-09-16: the page is not finished,
   and the schema / FAQ / standalone Investment section wait until the rest of it is.
   They are additive and none of them changes what the page says, so they are the
   cheapest things to defer and the easiest to do once the copy stops moving.
   *(Alt text is done — 22 renders carry `role="img"` + `aria-label`; see progress.md.)*

   **Finish applying the OC research — the copy half is done, the technical half is not.**
   Hero and section-two copy were rewritten against `07-VOICE.md` on 2026-09-16. What
   `00-SUMMARY.md` Finding 4 still asks for, none of it written yet:

   - **Alt text on the before/after renders.** 4 of 11 images have none, on a page whose
     entire differentiator is imagery. Each should name its scheme and SW colors — *"Newport
     Beach estate exterior rendered in Riviera Tuxedo — Sherwin-Williams Snowbound with Black
     Magic trim."* Accessibility and an honest keyword surface in one edit.
   - **Schema.** `areaServed` as City entities, `Service` entities for Exterior/Interior/
     Cabinet each carrying an `Offer` with `unitText: "square foot of paintable surface"`,
     `ImageObject` on the before/after pairs, `BreadcrumbList`, `speakable` on the FAQ.
     **Do NOT add `AggregateRating`** — banned by the hard rules, and the brief's own first
     draft was corrected on this.
   - **Word count 2,258 is thin for cost authority**, against a commercial-investigation
     cluster (`exterior painting cost per square foot`, `how much to paint a house exterior in
     california`). The FAQ is the cheapest place to fix it.

   Two things must NOT go on a page yet: the `[VERIFY]` $12,000–$15,000 second-repaint figure
   (needs a real closed job), and any quote from the Houzz source — she is a forum poster, not
   a VIP client.

   Still owed for the other cities: `07-VOICE.md` exists for Orange County only.

2. **Audit the eleven scheme renders against the QA gate in `VIZ-RENDER.md`.** At least one
   (`scheme-spanish.jpg`) has drifted off the source's dusk light, which breaks the one-house
   illusion the whole before/after depends on. Same pass can grade T1, job
   `4f7a4854-832a-487f-aa04-d3a02c83555e`, which is still **ungraded** — the cloud egress
   proxy blocks the Higgsfield CDN.

3. **Move the GBP from Fontana to Anaheim.** Nothing in the Maps playbook works until the pin
   moves. Guide: `research/_global/GBP-VERIFICATION.md`. **Fabian only — needs his login.**
4. **Start the review engine.** 9 reviews today, the bar is ~60 (M-01).
   `research/_global/GBP-DAILY-PLAYBOOK.md` + 30 days of post copy already written.
5. **Write the remaining 5 Irvine cluster articles.** Prompts ready in `BLOG-PLAN-IRVINE.md`.
   Purely additive now the page type exists — 1–2 a week, not all at once.
6. **Submit to Bing Webmaster Tools.** Copilot is 50% of AI citations and runs on Bing —
   the cheapest unclaimed win (M-06).
7. **Run Marcus on Anaheim's pillar guide + articles.** The winnable Maps pack.
8. **Run the 3-step ad funnel — written, cannot launch.**
   `generator/agents/copywriter/FUNNEL-3-STEP-ADS.md` holds the sequence, the scripts and the
   pre-flight check. Step 2's creative already exists: the hero reel is the ad, filmed or
   exported, no re-staging. What is missing is an ad account — none is connected, so nothing
   here is measurable yet. Ranked last for that reason, not on merit.
   Two blockers carried in the document: the `[VERIFY]` $12,000–$15,000 figure stays out of
   every ad until a closed job backs it, and the **Gallagher family is unverified** — they
   cannot be described as clients in an ad until that is confirmed.
   Not written yet: the **Sherwin-Williams store-staff referral play.** `07-VOICE.md` confirms
   it by primary evidence — she went to them first and they could not answer her question, and
   their staff field that question daily with no answer to give. That is a relationship rather
   than an ad, and it needs its own document.

---

## Open with Fabian — blocking, needs a human answer

- CSLB licence number *(Fabian working on it)*
- **Which ad account do we run on, and who owns it?** Meta, Google, or both. Nothing in
  `FUNNEL-3-STEP-ADS.md` can launch or be measured until one exists.
- EPA Lead Certified? *(Fabian working on it)*
- Real project totals, so pricing ranges can be verified rather than estimated
- Actual Google rating — a directory shows 4.6, the site said 5, **9 reviews confirmed**
- Are the three on-page testimonials real?
- Is the Gallagher family a real client or a produced film subject? *(registry: unverified)*
  — now load-bearing: the county hero and section two are built entirely around their story,
  name, photo and chosen scheme.
- **Which scheme did they actually choose?** The repo had Santa Barbara Luxe flagged from the
  original markup; Fabian said on 2026-09-15 it was **Coastal Organic Compound** — "the one
  chosen and then masked and painted" — and the page was changed on his word. Worth one
  confirmation, because nothing in the repo can catch it if it is wrong.
- **A verified quote from the Gallaghers.** Their chip opens both the hero and section two and
  carries no words of theirs, because inventing one is forbidden. One real sentence would be
  the strongest thing on the page.
- **A clean original of the base photo**, without the CRMLS watermark.
- **Which bronze is Beverly Hills Resort's accent?** The scheme data said "SW City Loft ·
  Bronze", but Sherwin-Williams has no color called plain "Bronze" — the candidates are
  **Status Bronze SW 7034**, **Brainstorm Bronze SW 7033** and **Enduring Bronze SW 7055**,
  and the row's accent hex is `#8C6E4C`. Rather than invent a code, that scheme now reads
  "City Loft SW 7631, monochrome", matching what its band card already said. It is the one
  scheme of eleven without a full `Name SW 0000` citation.
- Migrate fully to viphomepainting.com and flip `config.staging`?
