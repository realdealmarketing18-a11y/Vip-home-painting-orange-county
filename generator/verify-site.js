#!/usr/bin/env node
/* ============================================================
   VERIFY-SITE — the checks that run against RENDERED output

   validate-brief.js checks the input. This checks the artifact,
   which is where every miss has actually happened: "Free Quote"
   and a fake 5-star rating reached live pages from hardcoded
   generator strings, an absolute /irvine/... link 404'd on the
   GitHub Pages subpath twice, and a whole page type once bypassed
   every check because nothing knew it existed.

   Discovers pages from cities.json + blog.json, so a new city is
   covered the moment it is generated. No page list to update.

     node generator/verify-site.js            all cities
     node generator/verify-site.js anaheim    one city

   Exits non-zero on any failure — safe to gate a publish on.
   ============================================================ */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CITIES = JSON.parse(fs.readFileSync(path.join(__dirname, 'cities.json'), 'utf8'));
const BLOGP = path.join(__dirname, 'blog.json');
const BLOG = fs.existsSync(BLOGP) ? JSON.parse(fs.readFileSync(BLOGP, 'utf8')) : { pillars: [] };
const CFG = JSON.parse(fs.readFileSync(path.join(__dirname, 'communities.json'), 'utf8')).config;

const only = process.argv[2];
let fails = 0, checks = 0;
const bad = m => { console.log('   FAIL  ' + m); fails++; };
const ok  = m => { console.log('   ok    ' + m); checks++; };

/* ---------- what exists ---------- */
const pages = [];   // { file, url, type, city }
for (const c of CITIES.cities) {
  if (only && c.slug !== only) continue;
  const add = (rel, type) => {
    const f = path.join(ROOT, rel, 'index.html');
    if (fs.existsSync(f)) pages.push({ file: f, rel, type, city: c.slug });
  };
  add(c.slug, 'city');
  for (const k of (c.child_communities || [])) {
    const slug = String(k.url || '').split('/').filter(Boolean).pop();
    if (slug) add(`${c.slug}/${slug}`, 'community');
  }
  if (c.hoa_page) add(`${c.slug}/${c.hoa_page.slug}`, 'hoa');
  for (const p of (BLOG.pillars || []).filter(p => p.city_slug === c.slug)) {
    add(`${c.slug}/${p.slug}`, 'pillar');
    for (const a of (p.cluster || [])) add(`${c.slug}/${p.slug}/${a.slug}`, 'article');
  }
}

if (!pages.length) {
  console.log(`\nnothing generated${only ? ` for "${only}"` : ''} yet — run node generator/generate.js first\n`);
  process.exit(1);
}

const read = p => fs.readFileSync(p.file, 'utf8');
const bodyOf = h => h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');

console.log(`\nVERIFY SITE — ${pages.length} page(s)${only ? `, city "${only}"` : ''}\n`);

/* ---------- 1. links resolve, and none are absolute ---------- */
console.log('1. internal links');
let deadTotal = 0, absTotal = 0;
for (const p of pages) {
  const html = read(p);
  const dir = path.dirname(p.file);
  const hrefs = [...new Set((html.match(/(?:href|src)="([^"]+)"/g) || [])
    .map(s => s.replace(/^(?:href|src)="/, '').replace(/"$/, ''))
    .filter(h => !/^(https?:|tel:|mailto:|data:|#)/.test(h)))];

  const abs = hrefs.filter(h => h.startsWith('/'));
  if (abs.length) { bad(`${p.rel}: ABSOLUTE link(s) — these 404 on the GitHub Pages subpath: ${abs.join(', ')}`); absTotal += abs.length; }

  const dead = hrefs.filter(h => {
    const t = path.resolve(dir, h.split('#')[0].split('?')[0]);
    return !fs.existsSync(t) && !fs.existsSync(path.join(t, 'index.html'));
  });
  if (dead.length) { bad(`${p.rel}: dead -> ${dead.slice(0, 4).join(', ')}`); deadTotal += dead.length; }
}
if (!deadTotal) ok(`no dead links across ${pages.length} pages`);
if (!absTotal) ok('no absolute links');

/* ---------- 2. banned copy, in rendered body text ---------- */
console.log('\n2. copy rules (rendered text, not source)');
let copyBad = 0;
for (const p of pages) {
  const body = bodyOf(read(p));
  const hit = (re) => (body.match(re) || []).length;
  const probs = [];
  if (hit(/\bfree\b/gi)) probs.push('"free" (use complimentary)');
  if (hit(/\bAI\b/g)) probs.push('"AI" (use "our design team")');
  if (hit(/\bcolour/gi)) probs.push('British "colour"');
  if (/aggregateRating|5-Star Rated|\b\d+(\.\d+)?\s*stars?\b/i.test(body)) probs.push('rating/review claim');
  if (/\baverages?\b[^.]{0,40}\$/i.test(body)) probs.push('market-average price claim');
  for (const ph of [...new Set(body.match(/\(\d{3}\)\s*\d{3}-\d{4}/g) || [])]) {
    if (ph !== CFG.phone) probs.push(`wrong phone "${ph}"`);
  }
  /* The warranty length was hardcoded in generator source in 14 places and went
     stale the moment Fabian changed it. It lives in config now; this asserts the
     pages actually agree, and that no ${CFG...} placeholder leaked out unrendered. */
  const wrongWarranty = (body.match(/\b\d+-Year Warranty\b/g) || []).filter(w => w !== CFG.warranty);
  if (wrongWarranty.length) probs.push(`warranty says "${[...new Set(wrongWarranty)].join('", "')}" but config says "${CFG.warranty}"`);
  if (/\$\{[A-Za-z.]+\}/.test(body)) probs.push('an unrendered ${...} placeholder is visible on the page');

  if (probs.length) { bad(`${p.rel}: ${probs.join(' · ')}`); copyBad++; }
}
if (!copyBad) ok(`no banned copy; warranty reads "${CFG.warranty}" on every page`);

/* ---------- 3. schema parses; FAQ matches what is visible ---------- */
console.log('\n3. structured data');
let schemaBad = 0;
for (const p of pages) {
  const html = read(p);
  const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!m) { bad(`${p.rel}: no JSON-LD`); schemaBad++; continue; }
  let graph;
  try { graph = JSON.parse(m[1])['@graph'] || []; }
  catch (e) { bad(`${p.rel}: JSON-LD does not parse — ${e.message}`); schemaBad++; continue; }

  const faqNode = graph.find(x => x['@type'] === 'FAQPage');
  const visible = (html.match(/<details class="faq-item"/g) || []).length;
  if (faqNode && faqNode.mainEntity.length !== visible) {
    bad(`${p.rel}: FAQ schema has ${faqNode.mainEntity.length} but ${visible} are visible — they must match`);
    schemaBad++;
  }
  if (faqNode && faqNode.mainEntity.some(q => /<[a-z/]/i.test(q.acceptedAnswer.text))) {
    bad(`${p.rel}: HTML tags left inside FAQ schema text`); schemaBad++;
  }
  if (JSON.stringify(graph).includes('aggregateRating')) { bad(`${p.rel}: aggregateRating in schema`); schemaBad++; }

  const canon = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  if (!canon || !canon.endsWith(`/${p.rel}/`)) { bad(`${p.rel}: canonical is "${canon}"`); schemaBad++; }
}
if (!schemaBad) ok('schema parses, FAQs match, canonicals self-reference');

/* ---------- 4. the silo rule ---------- */
console.log('\n4. silo rule');
const citySlugs = CITIES.cities.map(c => c.slug);
let siloBad = 0;
for (const p of pages) {
  const html = read(p);
  for (const other of citySlugs.filter(s => s !== p.city)) {
    const child = new RegExp(`href="[^"]*${other}/[a-z0-9-]+/`, 'g');
    const hits = (html.match(child) || []).filter(h => !/(guide|hoa-painting)\/"?$/.test(h));
    if (hits.length) { bad(`${p.rel} links into ${other}'s child pages — silos must not cross`); siloBad++; break; }
  }
}
if (!siloBad) ok('no page links into another city\'s child pages');

/* ---------- 5. nav + footer are the shared build ---------- */
console.log('\n5. navigation');
const WANT = ['Cities', 'Neighborhoods', 'Guides', 'Services'];
let navBad = 0;
for (const p of pages) {
  const html = read(p);
  const nav = (html.match(/<nav class="top-nav">([\s\S]*?)<\/nav>/) || [])[1] || '';
  const cats = (nav.match(/<summary>([^<]*)<\/summary>/g) || []).map(s => s.replace(/<[^>]*>/g, ''));
  if (JSON.stringify(cats) !== JSON.stringify(WANT)) { bad(`${p.rel}: nav is ${JSON.stringify(cats)}`); navBad++; }
  if (!/<div class="f-col-label">/.test(html)) { bad(`${p.rel}: no footer columns`); navBad++; }
}
if (!navBad) ok(`all ${pages.length} pages carry the same four nav categories and the shared footer`);

/* ---------- 6. every pillar card has a real article ---------- */
console.log('\n6. pillar → cluster');
let clusterBad = 0;
for (const p of (BLOG.pillars || [])) {
  if (only && p.city_slug !== only) continue;
  const built = new Set((p.cluster || []).map(a => a.slug));
  for (const card of (p.articles || [])) {
    const mm = String(card.url || '').match(new RegExp(`^/${p.city_slug}/${p.slug}/([^/]+)/$`));
    if (mm && !built.has(mm[1])) { bad(`${p.city_slug}/${p.slug}: card "${mm[1]}" has no article — it would 404`); clusterBad++; }
  }
}
if (!clusterBad) ok('every pillar card points at a real article');

/* ---------- 7. module_order uniqueness ---------- */
/* ---------- 7. indexation posture matches the config ---------- */
console.log('\n7. indexation posture');
const wantNoindex = !!CFG.staging;
let postureBad = 0;
for (const p of pages) {
  const html = read(p);
  const tag = (html.match(/<meta name="robots" content="([^"]*)">/) || [])[1] || '';
  const isNoindex = /noindex/i.test(tag);
  if (wantNoindex && !isNoindex) { bad(`${p.rel}: config.staging is true but this page says "${tag}"`); postureBad++; }
  if (!wantNoindex && isNoindex) { bad(`${p.rel}: LIVE build but this page is noindex — it will not rank`); postureBad++; }
}
if (!postureBad) {
  ok(wantNoindex
    ? `staging build — all ${pages.length} pages noindex, nothing will be indexed`
    : `live build — all ${pages.length} pages indexable`);
}
/* the county page is hand-maintained and was the one that drifted */
const ocFile = path.join(ROOT, 'orange-county-sales-page', 'index.html');
if (fs.existsSync(ocFile)) {
  const octag = (fs.readFileSync(ocFile, 'utf8').match(/<meta name="robots" content="([^"]*)">/) || [])[1] || '';
  /noindex/i.test(octag) === wantNoindex
    ? ok(`county page matches (${octag})`)
    : bad(`county page says "${octag}" but config.staging is ${CFG.staging}`);
}

console.log('\n8. doorway-page guard');
const seen = new Map();
let dupe = 0;
for (const c of CITIES.cities) {
  for (const p of (BLOG.pillars || []).filter(x => x.city_slug === c.slug)) {
    for (const a of (p.cluster || [])) {
      const key = c.slug + ':' + (a.layout && a.layout.module_order || []).join('>');
      if (seen.has(key)) { bad(`${a.slug} shares a section order with ${seen.get(key)}`); dupe++; }
      seen.set(key, a.slug);
    }
  }
}
if (!dupe) ok('no two pages in a city share a section order');

console.log('');
if (fails) {
  console.log(`✗ FAILED — ${fails} problem(s). Do not publish until these are clear.\n`);
  process.exit(1);
}
console.log(`✓ PASSED — ${checks} checks clean across ${pages.length} pages\n`);
process.exit(0);
