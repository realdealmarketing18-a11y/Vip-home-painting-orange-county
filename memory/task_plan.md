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
| Orange County | **published** | front page, `index,follow`, top of the silo |
| Irvine | **published** | 13 pages, gate green |
| Anaheim | **published** | 5 pages; pillar guide + articles still to write |
| Newport Beach | queued | |
| Coto de Caza | queued | |

---

## Next actions, ranked

1. **Move the GBP from Fontana to Anaheim.** Nothing in the Maps playbook works until the pin
   moves. Guide: `research/_global/GBP-VERIFICATION.md`. **Fabian only — needs his login.**
2. **Start the review engine.** 9 reviews today, the bar is ~60 (M-01).
   `research/_global/GBP-DAILY-PLAYBOOK.md` + 30 days of post copy already written.
3. **Write the remaining 5 Irvine cluster articles.** Prompts ready in `BLOG-PLAN-IRVINE.md`.
   Purely additive now the page type exists — 1–2 a week, not all at once.
4. **Submit to Bing Webmaster Tools.** Copilot is 50% of AI citations and runs on Bing —
   the cheapest unclaimed win (M-06).
5. **Run Marcus on Anaheim's pillar guide + articles.** The winnable Maps pack.

---

## Open with Fabian — blocking, needs a human answer

- CSLB licence number *(Fabian working on it)*
- EPA Lead Certified? *(Fabian working on it)*
- Real project totals, so pricing ranges can be verified rather than estimated
- Actual Google rating — a directory shows 4.6, the site said 5, **9 reviews confirmed**
- Are the three on-page testimonials real?
- Is the Gallagher family a real client or a produced film subject? *(registry: unverified)*
- Migrate fully to viphomepainting.com and flip `config.staging`?
