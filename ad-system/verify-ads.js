#!/usr/bin/env node
/**
 * VERIFY-ADS - the output gate for paid media.
 *
 *   node verify-ads.js            # check copy + the client gate
 *   node verify-ads.js --frames   # also check rendered files exist at the right size
 *
 * Same posture as verify-site.js: this checks what actually goes out, not what
 * we meant. Ad copy is where the HARD RULES get broken, because it is written
 * fast and it is the one surface nobody re-reads before it spends money.
 * Exit code 1 = do not run it.
 */
const fs = require('fs');
const path = require('path');

const HERE  = __dirname;
const ROOT  = path.resolve(HERE, '..');
const BRAND = JSON.parse(fs.readFileSync(path.join(HERE, 'brand.json'), 'utf8'));
const ADS   = JSON.parse(fs.readFileSync(path.join(HERE, 'ads.json'), 'utf8'));
const WITH_FRAMES = process.argv.includes('--frames');

let fails = [], warns = [], checks = 0;
const fail = (m) => fails.push(m);
const warn = (m) => warns.push(m);
const ok   = () => checks++;

/* ---------------------------------------------------------------- 1. copy */
// Every viewer-facing string in an ad definition, with a label for the report.
function copyStrings(adId, ad) {
  const out = [];
  const push = (where, v) => { if (typeof v === 'string' && v.trim()) out.push([where, v]); };
  for (const k of ['captionCopy', 'priceLine']) push(`${adId}.${k}`, ad[k]);
  (ad.altHooks || []).forEach((h, i) => push(`${adId}.altHooks[${i}]`, h));
  (ad.estimateLines || []).forEach((r, i) => {
    push(`${adId}.estimateLines[${i}].label`, r.label);
    push(`${adId}.estimateLines[${i}].note`, r.note);
  });
  (ad.scenes || []).forEach((s, i) => {
    for (const k of ['eyebrow','title','titleGold','caption','softCta',
                     'endTitle','endTitleGold','endCta','vo']) {
      push(`${adId}.scenes[${i}].${k}`, s[k]);
    }
  });
  return out;
}

// Word-boundary so "complimentary" never trips "free" and "AI" only matches the word.
function bannedHit(text, term) {
  const flags = term === 'AI' ? 'g' : 'gi';           // AI is case-sensitive
  const re = new RegExp(`(^|[^a-z0-9])${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`, flags);
  return re.test(text);
}

const adIds = Object.keys(ADS).filter(k => !k.startsWith('_'));
for (const id of adIds) {
  for (const [where, text] of copyStrings(id, ADS[id])) {
    for (const term of BRAND.bannedInAdCopy) {
      if (bannedHit(text, term)) fail(`banned word "${term}" in ${where}: "${text}"`);
    }
    ok();
  }
}

/* --------------------------------------------------- 2. the hard-rule facts */
const allCopy = adIds.flatMap(id => copyStrings(id, ADS[id])).map(([w, t]) => [w, t]);
const joined = allCopy.map(([, t]) => t).join('  ');

// Any phone number that appears must be THE phone number.
for (const [where, text] of allCopy) {
  const nums = text.match(/\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g) || [];
  for (const n of nums) {
    if (n.replace(/\D/g, '') !== BRAND.facts.phone.replace(/\D/g, ''))
      fail(`wrong phone "${n}" in ${where} - must be ${BRAND.facts.phone}`);
  }
}
ok();

// Warranty must never be stated as anything but 2 years, and never as "longer".
if (/\b1[\s-]?year\b/i.test(joined)) fail('copy states a 1-year warranty - it is 2 years');
if (/longer than the competition/i.test(joined)) fail('"longer than the competition" - CertaPro also advertises 2 years');
ok();

// No rating or review claims anywhere. VIP has 9 reviews and the rating is unconfirmed.
if (/\b\d+(\.\d+)?\s*[- ]?star/i.test(joined) || /aggregateRating/i.test(joined)
    || /\b\d+\+?\s+reviews?\b/i.test(joined))
  fail('a rating or review-count claim is present - VIP has 9 reviews, rating unconfirmed');
ok();

// Price must be framed as "starts at", never as an average.
if (/\$\d/.test(joined) && !/starts at/i.test(joined))
  fail('a dollar figure appears without "starts at" framing');
if (/averages?\s+\$/i.test(joined)) fail('price stated as an average - must be "VIP starts at $X"');
ok();

/* ------------------------------------------------- 3. the client-name gate */
const gate = BRAND.clientGate;
const regPath = path.join(ROOT, 'generator/registry/client-stories.json');
let registryVerified = null;
if (fs.existsSync(regPath)) {
  const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));
  registryVerified = !!(reg['gallagher-family'] && reg['gallagher-family'].verified);
} else {
  warn('generator/registry/client-stories.json not found - cannot confirm the client gate');
}

if (gate.client.verified !== registryVerified && registryVerified !== null) {
  fail(`clientGate.client.verified (${gate.client.verified}) disagrees with ` +
       `client-stories.json gallagher-family.verified (${registryVerified}) - make them match`);
}
if (gate.mode === 'client' && !gate.client.verified) {
  fail('clientGate.mode is "client" but the client is not verified - ' +
       'a paid ad may not name a family as a VIP client until the registry says verified:true ' +
       'and a signed likeness release is on file');
}
// No ad copy may name the family while the gate is shut.
if (!gate.client.verified && /gallagher/i.test(joined))
  fail('ad copy names the Gallaghers while the client gate is shut');
ok();

/* ------------------------------------------- 4. the plate must not be the raw MLS photo */
if (BRAND.paths.base.includes('viz-photos/base.webp'))
  fail('paths.base points at the raw base.webp - it carries a CRMLS listing watermark ' +
       'and is the wrong aspect to register with the scheme renders. Use assets/base-16x9.jpg.');
const basePath = path.join(HERE, BRAND.paths.base);
if (!fs.existsSync(basePath)) fail(`paths.base missing on disk: ${BRAND.paths.base}`);
ok();

/* ------------------------------------------------ 5. every referenced render exists */
for (const s of BRAND.schemes) {
  const p = path.join(HERE, BRAND.paths.viz, s.file);
  if (!fs.existsSync(p)) fail(`scheme render missing: ${s.file}`);
}
if (BRAND.schemes.filter(s => s.chosen).length !== 1)
  fail('exactly one scheme must be marked chosen:true');
if (BRAND.schemes.length !== BRAND.facts.schemeCount)
  fail(`schemes list has ${BRAND.schemes.length} entries but facts.schemeCount says ${BRAND.facts.schemeCount}`);
ok();

/* ------------------------------------------------- 6. timelines are contiguous */
for (const id of adIds) {
  const ad = ADS[id];
  let prev = 0;
  ad.scenes.forEach((s, i) => {
    if (Math.abs(s.at - prev) > 1e-6) fail(`${id}.scenes[${i}] starts at ${s.at}, expected ${prev} - gap or overlap`);
    if (s.until <= s.at) fail(`${id}.scenes[${i}] has until <= at`);
    prev = s.until;
  });
  if (Math.abs(prev - ad.duration) > 1e-6)
    fail(`${id} scenes end at ${prev} but duration is ${ad.duration}`);
  ok();
}

/* ------------------------------------------------------- 7. rendered output */
if (WITH_FRAMES) {
  const OUT = path.join(HERE, 'out');
  const mp4s = fs.existsSync(OUT) ? fs.readdirSync(OUT).filter(f => f.endsWith('.mp4')) : [];
  if (!mp4s.length) fail('--frames given but out/ has no .mp4 - run `node render.js --all` first');
  for (const f of mp4s) {
    const size = fs.statSync(path.join(OUT, f)).size;
    if (size < 50 * 1024) fail(`${f} is only ${Math.round(size / 1024)} KB - render probably failed`);
    // Meta rejects video over 4 GB; ours are tiny, but flag anything odd.
    if (size > 500 * 1024 * 1024) warn(`${f} is large (${Math.round(size / 1048576)} MB)`);
  }
  console.log(`  rendered videos found: ${mp4s.length}`);
  ok();
}

/* ------------------------------------------------------------- report */
const G = '\x1b[32m', R = '\x1b[31m', Y = '\x1b[33m', D = '\x1b[0m';
console.log('\nVIP ad gate');
console.log(`  mode: ${gate.mode}   client verified: ${gate.client.verified}` +
            (registryVerified === null ? '' : `   registry: ${registryVerified}`));
warns.forEach(w => console.log(`  ${Y}warn${D}  ${w}`));
if (fails.length) {
  fails.forEach(f => console.log(`  ${R}FAIL${D}  ${f}`));
  console.log(`\n${R}${fails.length} failure(s). Do not run these ads.${D}\n`);
  process.exit(1);
}
console.log(`\n${G}green${D} - ${checks} checks passed${warns.length ? `, ${warns.length} warning(s)` : ''}\n`);
