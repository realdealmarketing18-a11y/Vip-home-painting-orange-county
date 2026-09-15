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

## Cluster status

| City | Stage | Notes |
|---|---|---|
| Orange County | **published**, but the live copy is stale | front page, `index,follow`, top of the silo. The hero redesign (2026-09-13→15) is on the build site only — `publish-wp.js --live` has not run for it |
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

1. **Rewrite the county copy against the voice research, which now exists.**
   `research/orange-county/00-SUMMARY.md` and `07-VOICE.md` landed 2026-09-15 from a parallel
   session. The hero and section-two copy predates them and is invented rather than drawn
   from the language bank — it happens to agree with the research's central finding, which is
   luck, not method.

   What the copy is not yet using: the verbatim fear quotes (heat 10 and 9), and the reframe
   that the aspiration is **competence, not beauty** — "not having failed at the house". Note
   `07-VOICE.md` marks its $12,000–$15,000 figure `[VERIFY]` and says explicitly to replace it
   with a real closed job before any page or ad uses it. Do not put it on a page yet.

   Still owed for the other cities: `07-VOICE.md` exists for Orange County only, not for
   Irvine or Anaheim.

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

---

## Open with Fabian — blocking, needs a human answer

- CSLB licence number *(Fabian working on it)*
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
- Migrate fully to viphomepainting.com and flip `config.staging`?
