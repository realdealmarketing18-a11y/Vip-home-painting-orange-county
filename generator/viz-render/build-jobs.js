#!/usr/bin/env node
/* =====================================================================
   build-jobs.js — turn one consultation intake into a Higgsfield job pack.

   Dry run by default. It never spends a credit on its own: it prints the
   exact prompts and writes a job pack, and submission is a separate,
   deliberate step (see VIZ-RENDER.md).

     node generator/viz-render/build-jobs.js --intake=<file.json>
     node generator/viz-render/build-jobs.js --demo          # sample intake
     node generator/viz-render/build-jobs.js --demo --print  # prompts in full

   The intake shape is whatever the Step 5 upload posts:
     { name, contact, address, community, photo, scheme, lighting,
       siding, premium, submitted_at }
   Only `photo` and `scheme` are required to build a pack.
   ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const DATA = require('./schemes.json');
const BY_ID = Object.fromEntries(DATA.schemes.map(s => [s.id, s]));

/* How many palettes each client gets back. Their pick, plus the closest
   neighbours from the same style family — a client who chose a dark
   scheme does not want three creams in the reply. */
const RENDERS_PER_CLIENT = 3;

/* ------------------------------------------------------------------ *
 * THE TEMPLATE
 *
 * Two rules earn their keep here and both are load-bearing:
 *
 * 1. ARCHITECTURE LOCK. The value is a repaint the client can trust,
 *    which means the render has to be their house — not a prettier one.
 *    Any drift in geometry, framing or landscaping and the render stops
 *    being evidence and becomes a mood board.
 *
 * 2. MATCH THE SOURCE LIGHT. Every render in viz-photos came off one
 *    professionally-shot dusk photograph. Client intake will be midday
 *    phone photos, flat and harsh. The prompt must inherit the source
 *    exposure rather than push everything to golden hour — a dusk render
 *    against a midday "before" is the exact dishonesty we flagged in the
 *    hero pair.
 * ------------------------------------------------------------------ */
function buildPrompt(scheme, intake) {
  const where = intake.community || intake.address || 'Orange County';
  return `Photorealistic exterior repaint of the SAME house shown in the source photograph.

ARCHITECTURE LOCK — reproduce exactly, do not alter:
building geometry and massing, rooflines and roof material, window and door
placement, size and mullion pattern, garage door count and position, driveway
and hardscape, landscaping and planting, camera position, focal length and
perspective, and the framing and crop of the source image.

MATCH THE SOURCE PHOTOGRAPH:
keep the same time of day, sun angle, shadow direction, sky, weather, exposure
and white balance as the source. Do not restyle to dusk, golden hour or night.
Do not add people, vehicles, signage, text or watermarks.

REPAINT SPECIFICATION — ${scheme.name}
Body, roughly 60 percent of the elevation: ${scheme.body}
Trim and fascia, roughly 30 percent: ${scheme.trim}
Accent, garage and stone, roughly 10 percent: ${scheme.accent}
Exterior light fixtures: ${scheme.lighting}
Stucco finish: ${scheme.texture}

EXECUTION:
architectural photography, photoreal, crisp cut lines where body meets trim,
paint applied evenly across every wall plane including returns and soffits,
consistent sheen. Where the source shows a surface the specification does not
mention, leave it untouched. Full elevation, same framing as the source.

Context for material realism only, not to be drawn: a residence in ${where}.`;
}

const NEGATIVE = [
  'different house', 'changed architecture', 'moved windows', 'added storey',
  'new landscaping', 'different camera angle', 'cropped differently',
  'time-of-day change', 'dusk', 'night', 'golden hour', 'people', 'cars',
  'text', 'watermark', 'signage', 'cartoon', 'illustration', 'over-saturated',
  'HDR halo', 'warped straight lines'
].join(', ');

/* Their pick first, then the nearest neighbours by body colour.
   Style family alone is not enough: Santa Barbara Luxe is the only
   Spanish Revival scheme, and falling through to array order handed a
   client who chose chalk white the two blackest palettes we sell. */
function rgb(hex) {
  const h = hex.replace('#', '');
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
}
function distance(a, b) {
  const [r1, g1, b1] = rgb(a), [r2, g2, b2] = rgb(b);
  /* weighted to track perceived lightness, which is what a homeowner
     actually reads as "near mine" */
  return Math.sqrt(2 * (r1 - r2) ** 2 + 4 * (g1 - g2) ** 2 + 3 * (b1 - b2) ** 2);
}
function pickSchemes(chosenId, n = RENDERS_PER_CLIENT) {
  const chosen = BY_ID[chosenId];
  if (!chosen) throw new Error(`unknown scheme id: ${chosenId}`);
  const others = DATA.schemes
    .filter(s => s.id !== chosen.id)
    .map(s => ({
      s,
      /* same family wins ties, colour distance decides the rest */
      rank: distance(chosen.swatch, s.swatch) - (s.style === chosen.style ? 60 : 0)
    }))
    .sort((a, b) => a.rank - b.rank)
    .map(x => x.s);
  return [chosen, ...others].slice(0, n);
}

function buildPack(intake) {
  if (!intake.photo)  throw new Error('intake is missing `photo`');
  if (!intake.scheme) throw new Error('intake is missing `scheme`');

  const picks = pickSchemes(intake.scheme);
  const ref = (intake.name || 'client').toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return {
    intake_ref: ref,
    submitted_at: intake.submitted_at || null,
    source_photo: intake.photo,
    client: {
      name: intake.name || null,
      contact: intake.contact || null,
      address: intake.address || null,
      community: intake.community || null
    },
    chose: intake.scheme,
    engine: DATA._engine,
    negative_prompt: NEGATIVE,
    jobs: picks.map((s, i) => ({
      seq: i + 1,
      scheme_id: s.id,
      scheme_name: s.name,
      output: `${ref}--${s.id}.jpg`,
      mode: 'image-to-image',
      source: intake.photo,
      prompt: buildPrompt(s, intake)
    }))
  };
}

/* ------------------------------ CLI ------------------------------ */
function main() {
  const args = process.argv.slice(2);
  const has = f => args.includes(f);
  const val = k => (args.find(a => a.startsWith(`--${k}=`)) || '').split('=')[1];

  let intake;
  if (has('--demo')) {
    intake = {
      name: 'Sample Client',
      contact: 'sample@example.com',
      address: '—',
      community: 'Pelican Hill, Newport Beach',
      photo: 'intake/sample-client/elevation.jpg',
      scheme: 'spanish',
      submitted_at: new Date().toISOString()
    };
  } else {
    const file = val('intake');
    if (!file) {
      console.error('usage: build-jobs.js --intake=<file.json>  |  --demo  [--print]');
      process.exit(1);
    }
    intake = JSON.parse(fs.readFileSync(file, 'utf8'));
  }

  const pack = buildPack(intake);

  const outDir = path.join(__dirname, 'packs');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${pack.intake_ref}.json`);
  fs.writeFileSync(outFile, JSON.stringify(pack, null, 2));

  console.log(`\n  DRY RUN — nothing submitted, no credits spent.\n`);
  console.log(`  intake      ${pack.intake_ref}`);
  console.log(`  source      ${pack.source_photo}`);
  console.log(`  they chose  ${BY_ID[pack.chose].name}`);
  console.log(`  renders     ${pack.jobs.length}\n`);
  pack.jobs.forEach(j => {
    console.log(`   ${j.seq}. ${j.scheme_name.padEnd(28)} → ${j.output}`);
  });
  if (has('--print')) {
    pack.jobs.forEach(j => {
      console.log(`\n${'─'.repeat(72)}\n  JOB ${j.seq} — ${j.scheme_name}\n${'─'.repeat(72)}\n`);
      console.log(j.prompt);
    });
    console.log(`\n${'─'.repeat(72)}\n  NEGATIVE (all jobs)\n${'─'.repeat(72)}\n\n${pack.negative_prompt}\n`);
  }
  console.log(`\n  job pack written to ${path.relative(process.cwd(), outFile)}`);
  console.log(`  to submit, follow generator/viz-render/VIZ-RENDER.md — submission is deliberate, never automatic.\n`);
}

if (require.main === module) main();
module.exports = { buildPack, buildPrompt, pickSchemes, NEGATIVE };
