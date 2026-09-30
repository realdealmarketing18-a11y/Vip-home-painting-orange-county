#!/usr/bin/env node
/* ============================================================
   VERIFY-LAYOUTS — story-layout rules, checked on the BUILT pages.

   Runs over every page whose data record carries `storyLayout`
   (communities.json / cities.json). Pages without one are skipped.

     node generator/verify-layouts.js

   Checks, per page:
     1. every section H2 is unique on the page, and none repeats an
        Orange County master H2 (with or without the place name swapped)
     2. pain before the ask — the "Now Do It On Your House" photo form
        never appears before a problem/pain section
     3. the acts move forward — They Visualized It (the schemes band)
        comes before We Painted It (the painted steps / the painting days)
     4. SWAP markers are balanced, and the FAQ, visualizer copy and
        client story are all fenced
   Exits non-zero on any failure.
   ============================================================ */

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, 'communities.json'), 'utf8'));
const CITIES = JSON.parse(fs.readFileSync(path.join(__dirname, 'cities.json'), 'utf8'));
const OC = fs.readFileSync(path.join(ROOT, 'orange-county-sales-page', 'index.html'), 'utf8');

const text = (h) => h.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, ' ')
  .replace(/&mdash;/g, '—').replace(/&rsquo;|’/g, "'").replace(/&amp;/g, '&').replace(/&[a-z#0-9]+;/g, ' ')
  .replace(/\s+/g, ' ').trim();
const h2s = (h) => (h.match(/<h2[^>]*>[\s\S]*?<\/h2>/g) || []).map(text);
const norm = (t, place) => t.toLowerCase().split(place.toLowerCase()).join('§').replace(/[^a-z0-9§ ]/g, '').replace(/\s+/g, ' ').trim();
const ocH2 = h2s(OC).map(t => norm(t, 'Orange County'));

const pages = [
  ...DATA.communities.filter(c => c.storyLayout).map(c => ({ c, rel: `${c.city || DATA.config.outputDir}/${c.slug}` })),
  ...CITIES.cities.filter(c => c.storyLayout).map(c => ({ c, rel: c.slug }))
];

let fails = 0;
const bad = (m) => { console.log('   FAIL  ' + m); fails++; };
console.log(`\nVERIFY LAYOUTS — ${pages.length} page(s)\n`);

const PAIN = ['id="flashback"', 'id="cost-of-wrong"', 'id="spotlight"', 'id="fit"', 'id="instead"', 'id="dusk"'];

for (const { c, rel } of pages) {
  const file = path.join(ROOT, rel, 'index.html');
  if (!fs.existsSync(file)) { bad(`${rel}: not built`); continue; }
  const html = fs.readFileSync(file, 'utf8');
  const body = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  const probs = [];

  /* 1 · headings */
  const list = h2s(body);
  const seen = new Set();
  for (const t of list) {
    const k = norm(t, c.name);
    if (seen.has(k)) probs.push(`H2 repeats on the page: "${t.slice(0, 70)}"`);
    seen.add(k);
    if (ocH2.includes(k)) probs.push(`H2 copies the Orange County master: "${t.slice(0, 70)}"`);
  }

  /* 2 · pain before the ask */
  const form = body.indexOf('class="s5-block"');
  const firstPain = Math.min(...PAIN.map(p => body.indexOf(p)).filter(i => i >= 0));
  if (form < 0) probs.push('no photo form (s5-block) on the page');
  else if (!isFinite(firstPain) || firstPain > form) probs.push('the photo form appears before any pain/problem section');

  /* 3 · acts move forward */
  const vis = body.indexOf('id="candidates"');
  const painted = Math.max(body.indexOf('id="process" data-story'), body.indexOf('id="timeline"'));
  if (vis >= 0 && painted >= 0 && vis > painted) probs.push('"We Painted It" comes before "They Visualized It"');

  /* 4 · markers */
  for (const k of ['CLIENT', 'LOCAL', 'FAQ', 'VIZCOPY']) {
    const open = (html.match(new RegExp(`<!-- SWAP:${k} -->`, 'g')) || []).length;
    const shut = (html.match(new RegExp(`<!-- /SWAP:${k} -->`, 'g')) || []).length;
    if (open !== shut) probs.push(`SWAP:${k} opens ${open} times but closes ${shut}`);
    if (['CLIENT', 'FAQ', 'VIZCOPY'].includes(k) && !open) probs.push(`no SWAP:${k} marker`);
  }

  if (probs.length) probs.forEach(p => bad(`${rel} (layout ${c.storyLayout}): ${p}`));
  else console.log(`   ok    ${rel} (layout ${c.storyLayout}) — ${list.length} unique H2s, form after pain, acts in order, markers balanced`);
}

console.log('');
if (fails) { console.log(`✗ FAILED — ${fails} problem(s)\n`); process.exit(1); }
console.log(`✓ PASSED — ${pages.length} layout page(s)\n`);
