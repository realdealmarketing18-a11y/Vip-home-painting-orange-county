/* ============================================================
   THE VISUALIZATION JOURNEY — editorial build of the visualizer

   The sales-page visualizer is one interactive widget: a pinned
   before/after beside a scroll-driven timeline. It needs ~1,180px
   to work. Dropped into a 680px editorial column it collapsed to a
   223px preview — the whole point of the section, unreadable.

   So on blog pages the same idea is told as a short sequence: the
   house as it stands, then a few finished directions, then the
   detail layer. A couple of examples, not the whole library — the
   catalogue lives on the sales page where it belongs, and eleven
   full renders would have put ~3MB into an article.

   Nothing here is a second copy of the tool. SCHEMES, STYLES and the
   option rows are read out of the live sales page at build time, so
   improving the visualizer there still updates this. That is the
   no-fork rule in CLAUDE.md.
   ============================================================ */

const fs = require('fs');
const path = require('path');

const PHOTO_DIR = path.join(__dirname, '..', 'orange-county-sales-page', 'viz-photos');

/* Real pixel dimensions, read from the file itself.

   Declaring width/height is what stops the page reflowing as each lazy image
   arrives, and a wrong number is worse than none — it reserves the wrong box
   and shifts anyway. Hand-written guesses were wrong on all three formats
   here (base.webp is 1024x683, not 1600x1200), so measure instead of guess.
   Cumulative Layout Shift is a ranking signal; this page exists to rank. */
const sizeCache = new Map();
function imageSize(file) {
  if (sizeCache.has(file)) return sizeCache.get(file);
  let out = null;
  try {
    const buf = fs.readFileSync(path.join(PHOTO_DIR, file));

    if (buf.length > 30 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
      const fmt = buf.toString('ascii', 12, 16);
      if (fmt === 'VP8 ') out = { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
      else if (fmt === 'VP8L') {
        const b = buf.readUInt32LE(21);
        out = { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 };
      } else if (fmt === 'VP8X') {
        out = { w: buf.readUIntLE(24, 3) + 1, h: buf.readUIntLE(27, 3) + 1 };
      }
    } else if (buf[0] === 0xFF && buf[1] === 0xD8) {          // JPEG: walk to the SOF marker
      let o = 2;
      while (o + 9 < buf.length) {
        if (buf[o] !== 0xFF) { o++; continue; }
        const m = buf[o + 1];
        if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC) {
          out = { h: buf.readUInt16BE(o + 5), w: buf.readUInt16BE(o + 7) };
          break;
        }
        if (m === 0xD8 || (m >= 0xD0 && m <= 0xD9)) { o += 2; continue; }
        o += 2 + buf.readUInt16BE(o + 2);
      }
    }
  } catch (e) { out = null; }
  if (!out || !out.w || !out.h) {
    throw new Error(`viz-journey: could not read dimensions of ${file} — a wrong or missing size causes layout shift`);
  }
  sizeCache.set(file, out);
  return out;
}

/* ---- read the live data out of the sales page ---- */
function extractVizData(basePage) {
  const arr = (name) => {
    const start = basePage.indexOf(`const ${name} = [`);
    if (start < 0) throw new Error(`viz-journey: could not find "const ${name} = [" in the sales page`);
    const open = basePage.indexOf('[', start);
    const close = basePage.indexOf('];', open);
    if (close < 0) throw new Error(`viz-journey: "${name}" array is not terminated`);
    let parsed;
    try { parsed = eval(basePage.slice(open, close + 1)); }   // build-time, our own file
    catch (e) { throw new Error(`viz-journey: "${name}" did not parse — ${e.message}`); }
    if (!Array.isArray(parsed) || !parsed.length) throw new Error(`viz-journey: "${name}" is empty`);
    return parsed;
  };

  const STYLES = arr('STYLES');
  const SCHEMES = arr('SCHEMES');

  /* the option rows live in markup, not a data table */
  const options = {};
  const catRe = /<div class="elevate-options" data-cat="([a-z]+)">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g;
  let m;
  while ((m = catRe.exec(basePage)) !== null) {
    const optRe = /viz-photos\/(thumb-[a-z0-9-]+\.jpg)[\s\S]*?<div class="elv-label">([^<]+)<\/div>/g;
    const list = [];
    let o;
    while ((o = optRe.exec(m[2])) !== null) list.push({ thumb: o[1], label: o[2].trim() });
    if (list.length) options[m[1]] = list;
  }
  if (!Object.keys(options).length) throw new Error('viz-journey: found no elevate-options rows in the sales page');

  return { STYLES, SCHEMES, options };
}

/* Three directions far enough apart that the point lands in one screen:
   near-black, warm white, and a colour that is neither. A page can override
   with viz_schemes[] when its argument calls for different examples. */
const DEFAULT_SCHEMES = ['obsidian', 'organic', 'pacificsage'];
const DEFAULT_OPTIONS = 'light';

const OPT_META = {
  light:   { heading: 'Then the details',        lead: 'Fixtures change an elevation after dark as much as color changes it at noon.' },
  siding:  { heading: 'Then the material',       lead: 'Cedar shake, board and batten, or stacked stone, layered onto the same facade.' },
  premium: { heading: 'Then the finishing work', lead: 'Garage doors and natural stone, where a repaint becomes a transformation.' }
};

function vizJourney(p, H, DATA) {
  const { SCHEMES, STYLES, options } = DATA;
  const esc = H.esc;
  const photo = (f) => `${H.A}/viz-photos/${f}`;
  const styleLabel = (id) => (STYLES.find(s => s.id === id) || {}).label || '';

  const wanted = (p.viz_schemes && p.viz_schemes.length) ? p.viz_schemes : DEFAULT_SCHEMES;
  const picked = wanted.map(id => SCHEMES.find(s => s.id === id)).filter(Boolean);
  if (!picked.length) throw new Error(`viz-journey: none of [${wanted.join(', ')}] matched a scheme id`);

  const optCat = p.viz_options || DEFAULT_OPTIONS;
  const optList = (options[optCat] || []).slice(0, 3);
  const optMeta = OPT_META[optCat] || OPT_META.light;

  /* every <img> carries its real measured size — see imageSize() */
  const img = (file, alt, cls) => {
    const d = imageSize(file);
    return `<img${cls ? ` class="${cls}"` : ''} src="${photo(file)}" alt="${esc(alt)}"
                 loading="lazy" decoding="async" width="${d.w}" height="${d.h}"/>`;
  };

  const card = (s) => `
        <figure class="vj-card">
          <div class="vj-shot">
            ${img(`scheme-${s.id}.jpg`, `The same home rendered in ${s.name} — ${s.sw}`)}
          </div>
          <figcaption>
            <div class="vj-chips" aria-hidden="true">
              <i style="background:${s.main}"></i><i style="background:${s.trim}"></i><i style="background:${s.accent}"></i>
            </div>
            <b>${esc(s.name)}</b>
            <span>${esc(s.sw)}</span>
            ${styleLabel(s.style) ? `<em>${esc(styleLabel(s.style))}</em>` : ''}
          </figcaption>
        </figure>`;

  return `
  <div class="vj" id="viz">
    <div class="vj-intro">
      <div class="vj-eyebrow">The Custom Visualization Service</div>
      <h2 class="pl-h2">${esc(p.viz_heading || 'One House, Three Directions')}</h2>
      ${p.viz_intro ? `<p class="pl-lead">${p.viz_intro}</p>` : ''}
    </div>

    <section class="vj-step">
      <div class="vj-step-head">
        <div class="vj-step-n">01</div>
        <h3 class="vj-step-t">Where it starts</h3>
        <p class="vj-step-d">One real home, photographed as it stands. Everything below is this same house — same walls, same roof, same light.</p>
      </div>
      <div class="vj-before">
        ${img('base.webp', 'The home before any work, as photographed')}
        <span class="vj-tag">Before</span>
      </div>
    </section>

    <section class="vj-step">
      <div class="vj-step-head">
        <div class="vj-step-n">02</div>
        <h3 class="vj-step-t">The same house, decided differently</h3>
        <p class="vj-step-d">Not swatches held against a wall — the finished result, rendered before anything is scheduled. This is a few of the directions; the full library sits on the main page.</p>
      </div>
      <div class="vj-grid">${picked.map(card).join('')}
      </div>
    </section>
${optList.length ? `
    <section class="vj-step">
      <div class="vj-step-head">
        <div class="vj-step-n">03</div>
        <h3 class="vj-step-t">${esc(optMeta.heading)}</h3>
        <p class="vj-step-d">${esc(optMeta.lead)}</p>
      </div>
      <div class="vj-opts">${optList.map(o => `
        <figure class="vj-opt">
          ${img(o.thumb, o.label)}
          <figcaption>${esc(o.label)}</figcaption>
        </figure>`).join('')}
      </div>
    </section>` : ''}

    <div class="vj-close">
      <p>Every image above is a rendering of one real home. <b>The next one is yours.</b> Our design team renders your actual elevation in every palette you are considering, at no cost, before anything is scheduled.</p>
      ${H.ctaButton('Claim Complimentary Color Consultation', 'See your home in every color before a single gallon is tinted')}
    </div>
  </div>`;
}

module.exports = { extractVizData, vizJourney, DEFAULT_SCHEMES };
