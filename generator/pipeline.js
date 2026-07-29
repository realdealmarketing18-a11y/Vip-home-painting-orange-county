#!/usr/bin/env node
/* ============================================================
   PIPELINE CONTROLLER — the handoff between scheduled agents.

     node generator/pipeline.js status          what every cluster's stage is
     node generator/pipeline.js next            what to do next, and who does it
     node generator/pipeline.js next marcus     next job for one agent
     node generator/pipeline.js claim <slug> <stage>   move a cluster forward
     node generator/pipeline.js block <slug> "<reason>"

   Each agent's scheduled run starts with `next <agent>`. If it prints
   NOTHING TO DO, the agent exits without burning tokens or credits.
   ============================================================ */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DIR = __dirname;
const QPATH = path.join(DIR, 'queue.json');
const q = JSON.parse(fs.readFileSync(QPATH, 'utf8'));
const save = () => fs.writeFileSync(QPATH, JSON.stringify(q, null, 2));

const OWNER = q._stage_owner;
const cmd = process.argv[2] || 'status';
const arg1 = process.argv[3];
const arg2 = process.argv[4];

/* Which stage each agent picks up, and what it must produce. */
const JOBS = {
  marcus: {
    picks: ['queued'],
    moves_to: 'researched',
    task: 'Research the cluster: market, local_pack (Apify Maps), organic competitors (Firecrawl), keywords (Semrush), architecture, geography incl. VERIFIED street names, HOA per community, palette. Write generator/briefs/{slug}.json. Raw dumps go in generator/briefs/_raw/.',
    gate: 'node generator/validate-brief.js {slug} --stage research'
  },
  copywriter: {
    picks: ['researched'],
    moves_to: 'copy_complete',
    task: 'Read generator/agents/copywriter/COPYWRITER.md first. Fill every copy slot for the city, EVERY community, and the HOA page: seo.meta_title/meta_desc/h1/answer_capsule/viz_intro, faqs, problems. Headline formulas in HEADLINE-FORMULAS.md, slot specs in COPY-SLOTS.md. Positioning angles in research/{city}/00-SUMMARY.md.',
    gate: 'node generator/validate-brief.js {slug}'
  },
  seraphina: {
    picks: ['copy_complete'],
    moves_to: 'published',
    task: 'Merge the brief into cities.json / communities.json, run generate.js, run interlink reconciliation across the whole cluster, verify JSON-LD and assets, commit and push as ONE commit.',
    gate: 'node generator/validate-brief.js {slug}'
  }
};

const byPriority = (a, b) => (a.priority || 99) - (b.priority || 99);
const find = (slug) => q.clusters.find(c => c.slug === slug);

function briefExists(slug) {
  return fs.existsSync(path.join(DIR, 'briefs', `${slug}.json`));
}

function gateResult(slug, stage) {
  const flag = stage === 'research' ? ' --stage research' : '';
  try {
    execSync(`node "${path.join(DIR, 'validate-brief.js')}" ${slug}${flag}`, { stdio: 'pipe' });
    return { pass: true, errors: 0 };
  } catch (e) {
    const out = String(e.stdout || '') + String(e.stderr || '');
    const m = out.match(/(\d+) error/);
    return { pass: false, errors: m ? +m[1] : -1 };
  }
}

if (cmd === 'status') {
  console.log('\nCLUSTER PIPELINE\n');
  const w = Math.max(...q.clusters.map(c => c.name.length)) + 2;
  for (const c of [...q.clusters].sort(byPriority)) {
    const owner = OWNER[c.stage] || '?';
    const brief = briefExists(c.slug) ? 'brief ✓' : 'no brief';
    const pages = [c.city_page_live ? 'city live' : null,
                   c.communities_live ? `${c.communities.length} communities live` : null]
                   .filter(Boolean).join(' · ') || 'nothing live';
    console.log(`  ${String(c.priority).padEnd(3)}${c.name.padEnd(w)}${c.stage.padEnd(15)}→ ${owner.padEnd(12)}${brief.padEnd(10)}${pages}`);
    for (const b of (c.blockers || [])) console.log(`      ⚠ ${b}`);
  }
  console.log('');
  process.exit(0);
}

if (cmd === 'next') {
  const agents = arg1 ? [arg1] : Object.keys(JOBS);
  let found = false;
  for (const agent of agents) {
    const job = JOBS[agent];
    if (!job) { console.error(`unknown agent "${agent}" — one of: ${Object.keys(JOBS).join(', ')}`); process.exit(1); }
    const c = [...q.clusters].sort(byPriority).find(x => job.picks.includes(x.stage));
    if (!c) { if (arg1) console.log(`NOTHING TO DO for ${agent}.`); continue; }
    found = true;
    console.log(`\n=== ${agent.toUpperCase()} → ${c.name} (${c.slug}) ===`);
    console.log(`stage:      ${c.stage} → ${job.moves_to}`);
    console.log(`brief:      generator/briefs/${c.slug}.json ${briefExists(c.slug) ? '(exists)' : '(CREATE IT)'}`);
    if (c.communities && c.communities.length) console.log(`communities: ${c.communities.join(', ')}`);
    if (c.notes) console.log(`notes:      ${c.notes}`);
    for (const b of (c.blockers || [])) console.log(`BLOCKER:    ${b}`);
    console.log(`\nTASK\n  ${job.task}`);
    console.log(`\nGATE (must pass before handoff)\n  ${job.gate.replace('{slug}', c.slug)}`);
    if (briefExists(c.slug)) {
      const g = gateResult(c.slug, agent === 'marcus' ? 'research' : 'full');
      console.log(`  current: ${g.pass ? 'PASSING ✓' : `FAILING — ${g.errors} error(s)`}`);
    }
    console.log(`\nON COMPLETION\n  node generator/pipeline.js claim ${c.slug} ${job.moves_to}\n`);
  }
  if (!found && !arg1) console.log('\nNOTHING TO DO — every cluster is published or blocked.\n');
  process.exit(0);
}

if (cmd === 'claim') {
  const c = find(arg1);
  if (!c) { console.error(`no cluster "${arg1}"`); process.exit(1); }
  if (!q._stages.includes(arg2)) { console.error(`invalid stage "${arg2}" — one of: ${q._stages.join(', ')}`); process.exit(1); }
  /* Never advance past a failing gate. */
  if (['researched', 'copy_complete', 'published'].includes(arg2)) {
    const g = gateResult(arg1, arg2 === 'researched' ? 'research' : 'full');
    if (!g.pass) {
      console.error(`\n✗ REFUSED — validation gate fails (${g.errors} errors).`);
      console.error(`  Run: node generator/validate-brief.js ${arg1}${arg2 === 'researched' ? ' --stage research' : ''}`);
      console.error(`  Fix them, or: node generator/pipeline.js block ${arg1} "<reason>"\n`);
      process.exit(1);
    }
  }
  const prev = c.stage;
  c.stage = arg2;
  c.blockers = [];
  if (arg2 === 'researched') c.research_completed = new Date().toISOString().slice(0, 10);
  if (arg2 === 'published') { c.published = new Date().toISOString().slice(0, 10); c.city_page_live = true; }
  save();
  console.log(`✓ ${c.name}: ${prev} → ${arg2}   (next owner: ${OWNER[arg2] || '-'})`);
  process.exit(0);
}

if (cmd === 'block') {
  const c = find(arg1);
  if (!c) { console.error(`no cluster "${arg1}"`); process.exit(1); }
  c.blockers = c.blockers || [];
  c.blockers.push(arg2 || 'unspecified');
  c.stage = 'blocked';
  save();
  console.log(`⚠ ${c.name} blocked: ${arg2}`);
  process.exit(0);
}

console.error(`unknown command "${cmd}" — use: status | next [agent] | claim <slug> <stage> | block <slug> "<reason>"`);
process.exit(1);
