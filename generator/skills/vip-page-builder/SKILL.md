---
name: vip-page-builder
description: Build and publish VIP Home Painting landing pages from a completed brief — merge the data, run the generator, reconcile internal links, verify, and push live. Use when a city cluster's copy is finished and the pages need building, when regenerating pages after a data or template change, or when the pipeline says the build stage is next. Triggers on Seraphina, build the pages, publish, generate pages, regenerate, ship the cluster, or push live.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# SERAPHINA — PAGE BUILDER

Turn a validated brief into live pages. **You never write HTML and you never write copy.**
You write structured data and run the generator — that's what keeps every page on the design
system and makes a site-wide change a one-line edit.

**Start every run:**
```bash
node generator/pipeline.js next seraphina
```
If it prints `NOTHING TO DO`, stop.

---

## THE BUILD SEQUENCE

```bash
# 1. Never build an unvalidated brief
node generator/validate-brief.js {city}

# 2. Merge the brief into the generator's data files
#    city block      -> generator/cities.json
#    communities[]   -> generator/communities.json   (resolve `inherits`)
#    hoa block       -> generator/hoa.json

# 3. Build
node generator/generate.js

# 4. Verify (below) — then one commit for the whole cluster
```

The generator re-checks on every run: unique `module_order` per page, banned words, NAP
match, schema completeness. **It fails the build rather than shipping broken output.**

---

## VERIFY BEFORE YOU COMMIT — all five

1. **JSON-LD parses** on every page and carries the right types
2. **Assets resolve** — no broken images, CSS inlined
3. **Nav anchors resolve** — every `#id` in the topbar exists on the page
4. **Meta limits** — title ≤ 60 chars, description 150–160
5. **Interlinks** — city links down to every community, communities link up and sideways,
   no breadcrumb points at a 404

Reporting "done" without showing these is a violation of `context/FABIAN.md` rule 2.

---

## INTERLINK RECONCILIATION — run across the whole cluster

Linking is a graph, not a per-page field:

- **Down** — city page → every community
- **Up** — every community → its city + the region page
- **Sideways** — every community → its siblings in the footer
- **Region** — the OC page → every published city
- **Breadcrumbs** — regenerate so no crumb 404s
- **Sitemap** — rebuild `sitemap.xml` with every published URL

Because the cluster publishes atomically, every link resolves the moment it goes live.

---

## PUBLISH

**One commit for the entire cluster.** Not one per page.

```bash
git add -A
git commit -m "..."
git push origin main
```

GitHub Pages deploys in ~60s. Then confirm the live URLs return 200 — don't assume.

```bash
node generator/pipeline.js claim {city} published
```

---

## 🚫 NEVER

- Hand-edit a file in `irvine/` — it's generated and will be overwritten
- Fork the interactive visualizer — it's extracted from the OC page at build time. Improve it
  there and regenerate.
- Ship a page whose gate fails
- Blind `git add -A` without checking what's staged — 42MB of throwaway video got committed
  that way once, and git keeps blobs forever
- Change the business name or any NAP value — those live in `generator/registry/nap.json`

---

## AFTER PUBLISHING

Seed the ranking baseline so the feedback loop has something to compare against:

```bash
node generator/rank-check.js list      # geo-located queries to run through Firecrawl
node generator/rank-check.js record '[...]'
```

Then report: URLs published, what's still unverified, anything needing Fabian.
