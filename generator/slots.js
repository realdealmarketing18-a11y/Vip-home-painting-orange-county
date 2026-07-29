#!/usr/bin/env node
/* ============================================================
   SLOTS — tells Vivienne exactly what to write, page by page.

     node generator/slots.js irvine              every page, what's empty
     node generator/slots.js irvine orchard-hills   one page in detail

   Reads each page's layout.module_order and prints only the copy
   slots that module actually needs — so nothing gets written for a
   section the page doesn't have, and nothing gets missed.
   ============================================================ */

const fs = require('fs');
const path = require('path');

const slug = process.argv[2];
const only = process.argv[3];
if (!slug) { console.error('usage: node generator/slots.js <cluster> [page-slug]'); process.exit(1); }

const briefPath = path.join(__dirname, 'briefs', `${slug}.json`);
if (!fs.existsSync(briefPath)) { console.error(`no brief: ${briefPath}`); process.exit(1); }
const brief = JSON.parse(fs.readFileSync(briefPath, 'utf8'));

/* Which copy slots each module needs. This is the map Vivienne was missing. */
const MODULE_SLOTS = {
  /* community modules */
  portfolio:       ['portfolio.eyebrow', 'portfolio.title', 'portfolio.body', 'cabinetLine'],
  problemSolution: ['problems[] — 4+ pairs of {p: their words, s: ours}'],
  colorGuide:      ['palette_extras[].note — 2, one per color'],
  specs:           ['(no copy — generated from research data)'],
  process:         ['(no copy — generated from the standard 5 steps)'],
  /* city modules */
  cost_of_wrong:   ['cost_of_wrong.title', 'cost_of_wrong.body'],
  pricing:         ['pricing.intro', 'pricing.cost_answer_sentence'],
  communities:     ['communities_intro'],
  color_guide:     ['color_guide.intro'],
  hoa:             ['hoa_module.intro'],
  video:           ['media.hero_video.title', 'media.hero_video.description'],
  spotlight:       ['spotlight.eyebrow', 'spotlight.title', 'spotlight.body'],
  reviews_map:     ['(no copy — NAP + map render from registry)'],
  /* hoa page modules */
  scope:           ['scope_intro'],
  compliance:      ['compliance_block'],
  spec:            ['(no copy — generated from research data)'],
  references:      ['(no copy until real client stories exist)'],
  bid_cta:         ['bid_cta — must say "Request a Bid", never "book a consultation"']
};

/* Slots every page needs regardless of modules. */
const UNIVERSAL = [
  ['seo.meta_title',     '≤ 60 chars, contains the place name'],
  ['seo.meta_desc',      '150–160 chars — a hard range'],
  ['seo.h1',             'unique across the cluster; <span class="gold"> wraps the accent'],
  ['seo.answer_capsule', '60–110 words; who/where/what/price/warranty/phone'],
  ['seo.viz_intro',      '60–110 words; locally specific — sits above the shared visualizer']
];

const get = (o, dotted) => dotted.split('.').reduce((x, k) => (x == null ? x : x[k]), o);
const empty = (v) => v == null || v === '' || (Array.isArray(v) && v.length === 0);
const mark = (v) => empty(v) ? '○ EMPTY' : '● done';

/* Build the page list: city + communities + hoa */
const pages = [];
if (brief.city) pages.push({ ...brief.city, _slug: brief.city.slug, _type: 'CITY' });
for (const c of (brief.communities || [])) pages.push({ ...c, _slug: c.slug, _type: 'COMMUNITY' });
if (brief.hoa) pages.push({ ...brief.hoa, _slug: brief.hoa.slug, _type: 'HOA' });

const list = only ? pages.filter(p => p._slug === only) : pages;
if (!list.length) { console.error(`no page "${only}" in ${slug}`); process.exit(1); }

console.log(`\nCLUSTER: ${slug} — ${pages.length} pages\n`);

let totalEmpty = 0;
for (const p of list) {
  const order = (p.layout && p.layout.module_order) || [];
  console.log(`${'─'.repeat(66)}`);
  console.log(`${p._type}  ·  ${p.name || p._slug}`);
  if (p.tier) console.log(`tier ${p.tier}${p.market_delta && p.market_delta.median_home_value ? `  ·  $${p.market_delta.median_home_value.toLocaleString()} median` : ''}`);
  console.log('');

  console.log('  ALWAYS NEEDED');
  for (const [dotted, hint] of UNIVERSAL) {
    const v = get(p, dotted);
    if (empty(v)) totalEmpty++;
    console.log(`    ${mark(v).padEnd(9)} ${dotted.padEnd(20)} ${hint}`);
  }

  const faqMin = p._type === 'CITY' ? 6 : p._type === 'HOA' ? 4 : 3;
  const faqs = (p.faqs || []).filter(f => f && f.q && f.a);
  if (faqs.length < faqMin) totalEmpty++;
  console.log(`    ${(faqs.length >= faqMin ? '● done' : '○ EMPTY').padEnd(9)} ${'faqs[]'.padEnd(20)} need ${faqMin}+, have ${faqs.length}`);

  console.log('');
  console.log(`  THIS PAGE'S SECTIONS  (order: ${order.join(' → ') || 'none set'})`);
  if (!order.length) console.log('    ⚠ no module_order — Marcus must assign one');
  order.forEach((m, i) => {
    const slots = MODULE_SLOTS[m] || ['⚠ unknown module — not in the slot map'];
    console.log(`    ${i + 1}. ${m}`);
    for (const s of slots) console.log(`         ${s}`);
  });
  console.log('');
}

console.log('─'.repeat(66));
console.log(`\n${totalEmpty} slot group(s) still empty across ${list.length} page(s).`);
console.log(`Specs: generator/agents/copywriter/COPY-SLOTS.md`);
console.log(`Formulas: generator/agents/copywriter/HEADLINE-FORMULAS.md\n`);
