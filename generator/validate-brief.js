#!/usr/bin/env node
/* ============================================================
   Cluster brief validator — the executable validation gate.
   Usage:  node generator/validate-brief.js irvine

   Marcus runs this before handing off. Seraphina re-runs it
   before building. Exit 0 = pass, exit 1 = fail.

   Enforces RESEARCH-BRIEF-CONTRACT.md v3, including the
   cross-community uniqueness checks a per-page brief could
   not perform.
   ============================================================ */

const fs = require('fs');
const path = require('path');

const slug = process.argv[2];
if (!slug) {
  console.error('usage: node generator/validate-brief.js <cluster-slug>');
  process.exit(1);
}

const DIR = __dirname;
const briefPath = path.join(DIR, 'briefs', `${slug}.json`);
if (!fs.existsSync(briefPath)) {
  console.error(`✗ brief not found: ${briefPath}`);
  process.exit(1);
}

const brief = JSON.parse(fs.readFileSync(briefPath, 'utf8'));
const readReg = (f) => {
  const p = path.join(DIR, 'registry', f);
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
};
const NAP = readReg('nap.json');
const STORIES = readReg('client-stories.json');
const ORDERS = readReg('module-orders.json');

const errors = [];
const warns = [];
const fail = (m) => errors.push(m);
const warn = (m) => warns.push(m);

const words = (s) => String(s || '').trim().split(/\s+/).filter(Boolean).length;
const stripTags = (s) => String(s || '').replace(/<[^>]+>/g, '');
/* Split into sentences for the shared-sentence uniqueness check. */
const sentences = (s) => stripTags(s).split(/(?<=[.!?])\s+/).map(x => x.trim().toLowerCase()).filter(x => x.length > 25);

const city = brief.city;
const communities = brief.communities || [];
if (!city) { console.error('✗ brief has no `city` block'); process.exit(1); }

/* ---------------- meta ---------------- */
if (!brief.meta) fail('meta: missing');
else {
  if (!brief.meta.cluster_slug) fail('meta.cluster_slug: missing');
  if (brief.meta.cluster_slug !== slug) fail(`meta.cluster_slug "${brief.meta.cluster_slug}" != filename "${slug}"`);
  const src = brief.meta.sources || {};
  for (const k of ['market', 'local_pack', 'questions', 'keywords']) {
    if (!src[k]) fail(`meta.sources.${k}: missing — every scraped category needs a cited source`);
  }
}

/* ---------------- city required ---------------- */
const req = (obj, dotted, label) => {
  const v = dotted.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
  const empty = v == null || v === '' || (Array.isArray(v) && v.length === 0);
  if (empty) fail(`${label}: missing or empty`);
  return v;
};

req(city, 'slug', 'city.slug');
req(city, 'name', 'city.name');
req(city, 'county', 'city.county');
req(city, 'geo.lat', 'city.geo.lat');
req(city, 'geo.lng', 'city.geo.lng');
req(city, 'market.market_rate_range.low', 'city.market.market_rate_range.low');
req(city, 'market.market_rate_range.high', 'city.market.market_rate_range.high');
req(city, 'market.market_rate_range.source', 'city.market.market_rate_range.source');
req(city, 'pricing.cost_answer_sentence', 'city.pricing.cost_answer_sentence');
req(city, 'architecture.primary_style', 'city.architecture.primary_style');
req(city, 'architecture.typical_paintable_sqft', 'city.architecture.typical_paintable_sqft');
req(city, 'keywords.head_term.kw', 'city.keywords.head_term.kw');
req(city, 'layout.module_order', 'city.layout.module_order');

const cityStreets = city.geography && city.geography.streets;
if (!Array.isArray(cityStreets) || cityStreets.length < 2) fail('city.geography.streets: need 2+ verified streets');
const cityMarks = city.geography && city.geography.landmarks;
if (!Array.isArray(cityMarks) || cityMarks.length < 1) fail('city.geography.landmarks: need 1+');

const ROLES = ['main_body', 'trim', 'gable', 'front_door'];
const baseColors = (city.palette_baseline && city.palette_baseline.colors) || [];
if (baseColors.length !== 4) fail(`city.palette_baseline.colors: need exactly 4, got ${baseColors.length}`);
else {
  const got = baseColors.map(c => c.role).sort().join(',');
  if (got !== [...ROLES].sort().join(',')) fail(`city.palette_baseline.colors roles must be ${ROLES.join('/')} — got ${got}`);
}

const localComps = (city.local_pack && city.local_pack.top_competitors) || [];
if (localComps.length < 3) fail(`city.local_pack.top_competitors: need 3+ (Apify Maps), got ${localComps.length}`);

if (!Array.isArray(city.faqs) || city.faqs.length < 6) fail(`city.faqs: need 6+, got ${(city.faqs || []).length}`);

/* ---------------- pricing truth ---------------- */
const pr = city.pricing || {};
if (pr.typical_project_low == null || pr.typical_project_high == null) {
  const listed = (brief.meta.gaps || []).some(g => /project|pricing/i.test(String(g)));
  if (!listed) fail('pricing.typical_project_low/high are null but not listed in meta.gaps[] — real job data required, never computed');
  else warn('pricing: project range null and flagged in gaps — Fabian must supply real job data');
} else if (pr.typical_project_low >= pr.typical_project_high) {
  fail('pricing: typical_project_low >= typical_project_high');
}
const avgClaim = /\b(averages?|average)\b[^.]{0,40}\$/i;
if (avgClaim.test(pr.cost_answer_sentence || '')) {
  fail('pricing.cost_answer_sentence claims a market average — say "VIP ... starts at $X", never "<city> averages $X"');
}

/* ---------------- per-page checks ---------------- */
const pages = [{ ...city, _label: `city:${city.slug}`, _isCity: true },
               ...communities.map(c => ({ ...c, _label: `community:${c.slug}`, _isCity: false }))];

const BANNED = [
  { re: /\bfree\b/i, msg: 'contains "free" — brand standard is "complimentary"' },
  { re: /\bAI\b/, msg: 'contains "AI" — never in customer-facing copy' },
];
/* Only these fields render to customers. */
const COPY_FIELDS = ['seo.meta_title', 'seo.meta_desc', 'seo.h1', 'seo.answer_capsule', 'seo.viz_intro',
                     'pricing.cost_answer_sentence', 'urgency.hook', 'urgency.season_note'];

const seenOrders = new Map();
const seenSentences = new Map();
const seenFaqs = new Map();
const seenH1 = new Map();

for (const p of pages) {
  const L = p._label;
  const seo = p.seo || {};

  if (!seo.meta_title) fail(`${L}: seo.meta_title missing`);
  else if (seo.meta_title.length > 60) fail(`${L}: meta_title ${seo.meta_title.length} chars (max 60)`);

  if (!seo.meta_desc) fail(`${L}: seo.meta_desc missing`);
  else if (seo.meta_desc.length < 150 || seo.meta_desc.length > 160) {
    fail(`${L}: meta_desc ${seo.meta_desc.length} chars (need 150-160)`);
  }

  if (!seo.h1) fail(`${L}: seo.h1 missing`);
  else {
    const h1 = stripTags(seo.h1);
    if (!h1.toLowerCase().includes(city.name.toLowerCase()) &&
        !(p._isCity === false && h1.toLowerCase().includes(String(p.name).toLowerCase()))) {
      fail(`${L}: h1 must contain "${p._isCity ? city.name : p.name}"`);
    }
    const key = h1.toLowerCase();
    if (seenH1.has(key)) fail(`${L}: h1 duplicates ${seenH1.get(key)}`);
    seenH1.set(key, L);
  }

  for (const f of ['answer_capsule', 'viz_intro']) {
    const w = words(seo[f]);
    if (!seo[f]) fail(`${L}: seo.${f} missing`);
    else if (w < 60 || w > 110) fail(`${L}: seo.${f} is ${w} words (need 60-110)`);
    /* shared-sentence check across the cluster */
    for (const s of sentences(seo[f])) {
      if (seenSentences.has(s)) fail(`${L}: seo.${f} shares a sentence with ${seenSentences.get(s)}`);
      else seenSentences.set(s, `${L}.${f}`);
    }
  }

  /* banned words across customer-facing fields */
  for (const dotted of COPY_FIELDS) {
    const v = dotted.split('.').reduce((o, k) => (o == null ? o : o[k]), p);
    if (!v) continue;
    for (const b of BANNED) if (b.re.test(String(v))) fail(`${L}: ${dotted} ${b.msg}`);
  }
  for (const faq of (p.faqs || [])) {
    for (const b of BANNED) {
      if (b.re.test(String(faq.q)) || b.re.test(String(faq.a))) fail(`${L}: faq "${String(faq.q).slice(0, 40)}..." ${b.msg}`);
    }
    const key = String(faq.q || '').trim().toLowerCase();
    if (!key) { fail(`${L}: an FAQ has an empty question`); continue; }
    if (seenFaqs.has(key)) fail(`${L}: FAQ "${faq.q.slice(0, 45)}..." duplicates ${seenFaqs.get(key)}`);
    seenFaqs.set(key, L);
    const aw = words(faq.a);
    if (aw < 15) fail(`${L}: FAQ answer too thin (${aw} words) — "${String(faq.q).slice(0, 40)}"`);
  }

  /* module order uniqueness — within cluster and against the registry */
  const order = (p.layout && p.layout.module_order) || [];
  if (!order.length) fail(`${L}: layout.module_order missing`);
  else {
    const key = order.join('>');
    if (seenOrders.has(key)) fail(`${L}: module_order duplicates ${seenOrders.get(key)} (${key})`);
    seenOrders.set(key, L);
    const used = (ORDERS.used || {});
    for (const [url, ord] of Object.entries(used)) {
      const thisUrl = p._isCity ? `/${city.slug}/` : `/${city.slug}/${p.slug}/`;
      if (Array.isArray(ord) && ord.join('>') === key && url !== thisUrl) {
        fail(`${L}: module_order already used by ${url}`);
      }
    }
  }

  /* client story truth */
  const st = p.story || {};
  if (st.is_real_client === true) {
    const id = st.story_id;
    if (!id) fail(`${L}: story.is_real_client is true but story_id is missing`);
    else if (!STORIES[id]) fail(`${L}: story_id "${id}" not in registry/client-stories.json`);
    else {
      const rec = STORIES[id];
      const thisUrl = p._isCity ? `/${city.slug}/` : `/${city.slug}/${p.slug}/`;
      if (rec.used_on && rec.used_on !== thisUrl) fail(`${L}: story "${id}" is already used on ${rec.used_on} — one story, one page, forever`);
      if (rec.verified === false) fail(`${L}: story "${id}" is not verified as a real client`);
    }
  }
}

/* ---------------- community-specific ---------------- */
for (const c of communities) {
  const L = `community:${c.slug}`;
  if (!c.slug) fail('a community is missing `slug`');
  if (!c.name) fail(`${L}: name missing`);
  if (!c.geo || c.geo.lat == null || c.geo.lng == null) fail(`${L}: geo.lat/lng missing`);

  const st = (c.geography_delta && c.geography_delta.streets) || [];
  if (st.length < 2) fail(`${L}: geography_delta.streets needs 2+ verified streets`);

  const extras = c.palette_extras || [];
  if (extras.length !== 2) fail(`${L}: palette_extras needs exactly 2, got ${extras.length}`);

  if (!Array.isArray(c.faqs) || c.faqs.length < 3) fail(`${L}: faqs needs 3+, got ${(c.faqs || []).length}`);
  if (!Array.isArray(c.problems) || c.problems.length < 4) fail(`${L}: problems needs 4+, got ${(c.problems || []).length}`);

  const hoa = c.hoa;
  if (!hoa) fail(`${L}: hoa block missing — set has_color_guidelines: null if unknown`);
  else if (hoa.has_color_guidelines !== null && !hoa.source) {
    fail(`${L}: hoa claims guidelines but has no source URL — never invent HOA rules`);
  }
}

/* ---------------- NAP consistency ---------------- */
const blob = JSON.stringify(brief);
if (NAP.phone && !blob.includes(NAP.phone)) warn(`NAP: phone ${NAP.phone} appears nowhere in the brief`);
const badPhone = blob.match(/\(\d{3}\) \d{3}-\d{4}/g) || [];
for (const ph of new Set(badPhone)) {
  if (NAP.phone && ph !== NAP.phone) fail(`NAP: phone "${ph}" does not match registry (${NAP.phone})`);
}

/* ---------------- report ---------------- */
const pageCount = pages.length;
console.log(`\nCluster: ${slug} — 1 city + ${communities.length} communities (${pageCount} pages)`);
console.log(`Confidence: ${brief.meta && brief.meta.confidence}`);

if (warns.length) {
  console.log(`\n⚠  ${warns.length} warning${warns.length > 1 ? 's' : ''}`);
  warns.forEach(w => console.log(`   · ${w}`));
}

if (errors.length) {
  console.log(`\n✗ FAILED — ${errors.length} error${errors.length > 1 ? 's' : ''}\n`);
  errors.forEach(e => console.log(`   · ${e}`));
  console.log('\nWrite these to meta.gaps[], lower meta.confidence, then re-run.\n');
  process.exit(1);
}

console.log(`\n✓ PASSED — ${pageCount} pages ready for Seraphina\n`);
process.exit(0);
