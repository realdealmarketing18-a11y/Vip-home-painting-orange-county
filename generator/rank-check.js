#!/usr/bin/env node
/* ============================================================
   RANK CHECK — the feedback loop that lets Marcus learn.

     node generator/rank-check.js list            queries to run (with locations)
     node generator/rank-check.js record '<json>' log a batch of results
     node generator/rank-check.js report          current standings + movement

   Marcus runs the searches through Firecrawl (geo-located — always pass
   `location`), then pipes the results back in with `record`. This script
   owns the history and the deltas.

   `record` payload:
     [{"keyword":"irvine house painters","url":"https://.../irvine/","position":14},
      {"keyword":"orchard hills painters","position":null}]   ← null = not found
   ============================================================ */

const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const HIST = path.join(DIR, 'rankings', 'history.json');
const TARGETS = path.join(DIR, 'rankings', 'targets.json');
fs.mkdirSync(path.join(DIR, 'rankings'), { recursive: true });

const SITE = 'https://realdealmarketing18-a11y.github.io/Vip-home-painting-orange-county';

/* Seed targets from what's actually published. */
function defaultTargets() {
  const communities = ['orchard-hills', 'altair', 'portola-springs', 'hidden-canyon', 'woodbury', 'stonegate'];
  const names = { 'orchard-hills': 'Orchard Hills', altair: 'Altair', 'portola-springs': 'Portola Springs',
                  'hidden-canyon': 'Hidden Canyon', woodbury: 'Woodbury', stonegate: 'Stonegate' };
  const t = [
    { keyword: 'irvine house painters', url: `${SITE}/irvine/`, location: 'Irvine, California, United States', tier: 'city', live: false },
    { keyword: 'anaheim house painters', url: `${SITE}/anaheim/`, location: 'Anaheim, California, United States', tier: 'city', live: false },
    { keyword: 'orange county luxury house painters', url: `${SITE}/orange-county-sales-page/`, location: 'Irvine, California, United States', tier: 'region', live: true },
  ];
  for (const c of communities) {
    t.push({ keyword: `${names[c].toLowerCase()} house painters`, url: `${SITE}/irvine/${c}/`,
             location: 'Irvine, California, United States', tier: 'community', live: true });
  }
  t.push({ keyword: 'factory finish kitchen cabinet painting irvine', url: `${SITE}/irvine/woodbury/`,
           location: 'Irvine, California, United States', tier: 'community', live: true });
  return t;
}

const targets = fs.existsSync(TARGETS)
  ? JSON.parse(fs.readFileSync(TARGETS, 'utf8'))
  : (fs.writeFileSync(TARGETS, JSON.stringify(defaultTargets(), null, 2)), defaultTargets());

const history = fs.existsSync(HIST) ? JSON.parse(fs.readFileSync(HIST, 'utf8')) : [];

const cmd = process.argv[2] || 'report';

if (cmd === 'list') {
  const live = targets.filter(t => t.live);
  console.log(`\n${live.length} live targets — run each through Firecrawl search WITH the location param:\n`);
  for (const t of live) {
    console.log(`  query:    "${t.keyword}"`);
    console.log(`  location: "${t.location}"`);
    console.log(`  find:     ${t.url}\n`);
  }
  const pending = targets.filter(t => !t.live);
  if (pending.length) {
    console.log(`(${pending.length} target${pending.length > 1 ? 's' : ''} not yet live: ${pending.map(t => t.keyword).join(', ')})\n`);
  }
  process.exit(0);
}

if (cmd === 'record') {
  let batch;
  try { batch = JSON.parse(process.argv[3]); }
  catch (e) { console.error('record needs valid JSON array'); process.exit(1); }
  if (!Array.isArray(batch)) { console.error('payload must be an array'); process.exit(1); }
  const date = new Date().toISOString().slice(0, 10);
  const entry = { date, results: batch.map(r => ({ keyword: r.keyword, position: r.position === undefined ? null : r.position })) };
  history.push(entry);
  fs.writeFileSync(HIST, JSON.stringify(history, null, 2));
  console.log(`✓ recorded ${batch.length} result(s) for ${date}`);
  process.exit(0);
}

if (cmd === 'report') {
  if (!history.length) {
    console.log('\nNo ranking history yet.');
    console.log('  1. node generator/rank-check.js list        ← get the queries');
    console.log('  2. run them through Firecrawl (with location!)');
    console.log("  3. node generator/rank-check.js record '[...]'\n");
    process.exit(0);
  }
  const latest = history[history.length - 1];
  const prev = history.length > 1 ? history[history.length - 2] : null;
  const posOf = (snap, kw) => { const r = (snap.results || []).find(x => x.keyword === kw); return r ? r.position : undefined; };

  console.log(`\nRANKINGS — ${latest.date}${prev ? `  (vs ${prev.date})` : ''}\n`);
  const w = Math.max(...latest.results.map(r => r.keyword.length)) + 2;
  let wins = 0, losses = 0, top10 = 0;
  for (const r of latest.results) {
    const now = r.position;
    const was = prev ? posOf(prev, r.keyword) : undefined;
    let delta = '';
    if (was !== undefined && was !== null && now !== null) {
      const d = was - now;
      if (d > 0) { delta = `▲ ${d}`; wins++; }
      else if (d < 0) { delta = `▼ ${-d}`; losses++; }
      else delta = '—';
    } else if (was === null && now !== null) { delta = '★ entered'; wins++; }
    else if (was !== undefined && was !== null && now === null) { delta = '✗ dropped out'; losses++; }
    if (now !== null && now <= 10) top10++;
    console.log(`  ${r.keyword.padEnd(w)}${(now === null ? 'not found' : `#${now}`).padEnd(12)}${delta}`);
  }
  console.log(`\n  ${top10}/${latest.results.length} in the top 10` + (prev ? `  ·  ${wins} up, ${losses} down` : ''));
  console.log('\n  → Record what moved and why in research/_global/MEMORY.md.');
  console.log('    A finding that ranking data contradicts goes to RETIRED, not the bin.\n');
  process.exit(0);
}

console.error('usage: rank-check.js list | record \'<json>\' | report');
process.exit(1);
