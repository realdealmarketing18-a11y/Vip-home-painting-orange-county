#!/usr/bin/env node
/* ============================================================
   VIP Home Painting — Irvine community landing page generator
   Usage:  node generator/generate.js
   Reads:  generator/communities.json + generator/page.css
   Writes: irvine/<slug>/index.html  (one per community)
           sitemap.xml, robots.txt   (repo root)

   Each page shares the base sales page's design system and hero
   style, but rotates the order of its five body modules so no
   two community pages have the same sequential layout.
   ============================================================ */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, 'communities.json'), 'utf8'));
const CSS = fs.readFileSync(path.join(__dirname, 'page.css'), 'utf8');
const CFG = DATA.config;

/* ============================================================
   BUILD-TIME EXTRACTION from the base OC sales page.
   The interactive Custom Visualization section (No. 01), its CSS
   and its JS engine are lifted verbatim from
   orange-county-sales-page/index.html at every build, with asset
   paths rewritten — the OC page stays the single source of truth.
   ============================================================ */
const BASE_PAGE = fs.readFileSync(path.join(ROOT, 'orange-county-sales-page', 'index.html'), 'utf8');

function sliceBetween(src, startMarker, endMarker, label, includeEnd = false) {
  const s = src.indexOf(startMarker);
  if (s === -1) throw new Error(`extraction failed: start marker not found for ${label}`);
  const e = src.indexOf(endMarker, s + startMarker.length);
  if (e === -1) throw new Error(`extraction failed: end marker not found for ${label}`);
  return src.slice(s, includeEnd ? e + endMarker.length : e);
}

function rewriteAssetPaths(text) {
  return text
    .replace(/url\('assets\//g, `url('${CFG.assetBase}/assets/`)
    .replace(/url\('video\//g, `url('${CFG.assetBase}/video/`)
    .replace(/url\('viz-photos\//g, `url('${CFG.assetBase}/viz-photos/`)
    .replace(/const DIR = 'viz-photos\/';/, `const DIR = '${CFG.assetBase}/viz-photos/';`)
    .replace(/bImg\.src = 'viz-photos\//, `bImg.src = '${CFG.assetBase}/viz-photos/`);
}

/* Main design-system + viz CSS (2nd <style> block of the base page) */
const firstStyleClose = BASE_PAGE.indexOf('</style>');
const BASE_CSS = rewriteAssetPaths(
  sliceBetween(BASE_PAGE.slice(firstStyleClose), '<style>', '</style>', 'base main CSS')
    .replace('<style>', '')
);
/* FAQ + service-area CSS (3rd <style> block, inside <body>) */
const FAQ_CSS = rewriteAssetPaths(
  sliceBetween(BASE_PAGE, '    .areas-head {', '  </style>', 'FAQ CSS')
);
/* The interactive viz section markup */
const VIZ_HTML = rewriteAssetPaths(
  sliceBetween(BASE_PAGE, '<section class="viz" id="viz">', '</section>', 'viz section HTML', true)
);
/* The full page script (viz engine + sliders; hero-video code is
   internally guarded and no-ops on pages without #heroVideo) */
const VIZ_JS = (() => {
  const anchor = BASE_PAGE.indexOf('/* ============ B/A SLIDER ============ */');
  if (anchor === -1) throw new Error('extraction failed: viz JS anchor not found');
  const s = BASE_PAGE.lastIndexOf('<script>', anchor);
  const e = BASE_PAGE.indexOf('</script>', anchor);
  if (s === -1 || e === -1) throw new Error('extraction failed: viz JS script tags not found');
  return rewriteAssetPaths(BASE_PAGE.slice(s, e + '</script>'.length));
})();

const MODULE_KEYS = ['portfolio', 'specs', 'colorGuide', 'process', 'problemSolution'];

/* Core Sherwin-Williams palette shown on every page (swatch hexes are
   on-screen approximations of the official colors). */
const CORE_COLORS = [
  { name: 'Alabaster', code: 'SW 7008', hex: '#EDEAE0',
    note: 'The definitive luxury white — soft, warm, and the most-requested estate body color across Irvine’s villages.' },
  { name: 'Chatura Gray', code: 'SW 9169', hex: '#8A857D',
    note: 'A grounded warm gray for bodies and garage doors that holds its color in bright Irvine light.' },
  { name: 'Iron Ore', code: 'SW 7069', hex: '#434341',
    note: 'The modern deep charcoal — front doors, shutters, ironwork, and full accent volumes.' }
];

/* Portfolio imagery — same royalty-free set the base sales page uses. */
const PORTFOLIO_IMGS = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&auto=format&fit=crop&q=80'
];

const SVG_PHONE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
const SVG_STAR = '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
const SVG_CLOCK = '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';

const MODULE_META = {
  portfolio:       { id: 'portfolio', nav: 'Portfolio' },
  specs:           { id: 'specs', nav: 'Specifications' },
  colorGuide:      { id: 'colors', nav: 'Color Guide' },
  process:         { id: 'process', nav: 'Process' },
  problemSolution: { id: 'fit', nav: 'Why VIP' }
};

/* Section background per position (1-based), so alternation stays
   editorial regardless of which module lands where. The capsule above
   is cream; the quote section below is white; footer is deep navy. */
const POSITION_BG = ['cream-deep', '', 'cream', '', 'navy'];

const secNo = (i) => `No. ${String(i).padStart(2, '0')}`;

function ctaButton(label, sub) {
  return `<a href="${CFG.phoneHref}" class="btn-gold"><span class="col-2"><span>${label}</span><span class="sub">${sub}</span></span></a>`;
}

/* ---------------- STORY HERO ----------------
   The cinematic hero from the OC page: film background, storytelling
   headline, avatar pill, play gate. Renders only when a story AND a
   YouTube id both exist — otherwise the page falls back to the static
   poster hero. Drop in the Irvine film and this activates itself.

   Uses the YouTube facade rather than a raw iframe: the poster shows
   instantly, the player only loads on click, so an unwatched film costs
   nothing in page weight. */

function heroStory(story, name, A) {
  /* The STORY is what makes this hero — the film is an upgrade, not a
     requirement. Renders on a headline alone; the play gate appears later
     when a youtube_id is added. */
  if (!story || !story.headline) return null;
  const poster = story.thumbnail_url
    || (story.youtube_id ? `https://i.ytimg.com/vi/${story.youtube_id}/maxresdefault.jpg` : `${A}/video/hero-poster.jpg`);
  const avatar = story.avatar_photo
    ? `<img src="${A}/${story.avatar_photo}" alt="${esc(story.client_name || '')}"/>`
    : esc(story.initials || '');
  return `
  <section class="hero hero-cinema hero-story" id="hero">
    <div class="hero-photo" style="background-image:url('${poster}');"></div>
    <div class="hero-scrim"></div>
    <div class="hero-goldframe" aria-hidden="true"></div>

    <div class="hero-stack">
      <div class="hero-fleuron" aria-hidden="true">&#10087;</div>
      <div class="eyebrow eyebrow-ruled">${esc(story.eyebrow || `${name} Luxury Home Painting`)}</div>
      <h1 class="ttl-hero">${story.headline}</h1>
      <div class="hero-kicker eyebrow-ruled">${esc(story.kicker || 'With Custom Color Consultation')}</div>

      ${story.client_name ? `<div class="pill-wrap">
        <div class="avatar-pill"><div class="ph">${avatar}</div>
          <div><div class="name">${esc(story.client_name)}</div>
          <div class="sub-line">${esc(story.client_location || '')}</div></div></div>
      </div>` : ''}

      <div class="play-wrap">
        <button class="play-btn film-play"
                ${story.youtube_id ? `data-yt="${story.youtube_id}"` : `data-film="${A}/video/gallagher-ambient.mp4"`}
                aria-label="Watch the film: ${esc(story.headline.replace(/<[^>]+>/g, ''))}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
        </button>
        <div class="play-label">${esc(story.play_label || 'Watch the Film')}</div>
      </div>

      <div class="hero-cta-wrap">
        ${ctaButton('Claim Complimentary Color Consultation', 'Irresistible Painting Estimates Included')}
        ${story.note ? `<p class="hero-note">${esc(story.note)}</p>` : ''}
      </div>
    </div>

    <div class="hero-strip">
      <div class="cell">
        <img class="strip-badge" src="${A}/assets/badges/badge-color-schemes.png" alt="Custom Color Schemes badge"/>
        <div class="lb">Custom Visualization</div><div class="sb">See it before we paint</div></div>
      <div class="cell">
        <img class="strip-badge" src="${A}/assets/badges/badge-warranty.png" alt="1-Year Warranty badge"/>
        <div class="lb">1-Year Warranty</div><div class="sb">No questions asked</div></div>
      <div class="cell">${SVG_STAR}<div class="lb">Licensed &amp; Insured</div><div class="sb">Bonded in California</div></div>
      <div class="cell">${SVG_CLOCK}<div class="lb">${esc(story.days ? `${story.days}-Day Transformations` : '5-Day Transformations')}</div>
        <div class="sb">Concierge scheduling</div></div>
    </div>
  </section>`;
}

/* ---------------- MODULES ---------------- */

/* CASE STUDY — the OC page's storytelling shape: avatar pill, tag,
   headline, before/after slider, drop-cap story, Reason/Strategy/Mood.
   Renders only when a real story exists. Never invent one. */
function modCaseStudy(c, no, bg) {
  const cs = (c.case_studies || []).filter(s => s && s.headline && s.story);
  if (!cs.length) return '';
  const cards = cs.map(s => `
      <article class="case-card">
        ${s.client_name ? `<div class="pill-wrap"><div class="avatar-pill"><div class="ph">${esc(s.initials || '')}</div>
          <div><div class="name">${esc(s.client_name)}</div><div class="sub-line">${esc(s.client_location || '')}</div></div></div></div>` : ''}
        <div style="text-align:center;"><div class="case-tag">${esc(s.tag || 'Home Exterior Painting')}</div></div>
        <h3 class="case-head">${esc(s.headline)}</h3>
        <div class="ba-frame">
          ${s.caption ? `<div class="ba-cap">${esc(s.caption)}</div>` : ''}
          <div class="ba-img before" style="background-image: url('${s.before_photo}')"></div>
          <div class="ba-img after"  style="background-image: url('${s.after_photo}')"></div>
          <div class="ba-rail"><div class="ba-handle"><span class="pin top"></span><span class="pin bot"></span>
            <div class="knob"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/><polyline points="9 18 15 12 9 6" transform="translate(12 0)"/></svg></div></div></div>
          <div class="ba-label l">Before</div>
          <div class="ba-label r">After</div>
        </div>
        <p class="drop">${esc(s.story)}</p>
        ${(s.reason || s.strategy || s.mood) ? `<ul class="case-detail-list">
          ${s.reason ? `<li><div class="lbl">Reason</div><div class="val">${esc(s.reason)}</div></li>` : ''}
          ${s.strategy ? `<li><div class="lbl">Strategy</div><div class="val">${esc(s.strategy)}</div></li>` : ''}
          ${s.mood ? `<li><div class="lbl">Mood</div><div class="val">${esc(s.mood)}</div></li>` : ''}
        </ul>` : ''}
        ${s.is_representative ? '<p class="sp-note">Representative project.</p>' : ''}
        ${ctaButton('Claim Complimentary Color Consultation', 'Irresistible Estimates Included')}
      </article>`).join('');
  return `
  <section class="navy" id="work">
    <div class="sec-head">
      <div class="sec-no">${secNo(no)}</div>
      <div class="eyebrow">${esc(c.name)} Home Painting Projects</div>
      <h2 class="ttl">Transforming ${esc(c.name)} Homes With <span class="accent">Precision &amp; Care</span></h2>
    </div>
    <div class="cases-grid">${cards}
    </div>
  </section>`;
}


function modPortfolio(c, no, bg) {
  const imgs = PORTFOLIO_IMGS.map(u => `<div style="background-image:url('${u}')"></div>`).join('\n          ');
  return `
  <section class="${bg}" id="portfolio">
    <div class="split-grid">
      <div>
        <div class="sec-no" style="text-align:left;">${secNo(no)}</div>
        <div class="eyebrow">${c.portfolio.eyebrow}</div>
        <h2 class="ttl">${c.portfolio.title}</h2>
        <p class="body">${c.portfolio.body}</p>
        <ul class="checks-row">
          <li>Graco &amp; Titan professional airless spray application</li>
          <li>Sherwin-Williams Emerald &amp; Duration coating systems</li>
          <li>${c.cabinetLine}</li>
          <li>1-Year Warranty · Licensed, Bonded &amp; Insured</li>
        </ul>
        ${ctaButton('Claim Complimentary Color Consultation', `${c.name} estimates, itemized line by line`)}
      </div>
      <div class="photo-grid">
          ${imgs}
      </div>
    </div>
  </section>`;
}

function modSpecs(c, no, bg) {
  return `
  <section class="${bg}" id="specs">
    <div class="sec-head">
      <div class="sec-no">${secNo(no)}</div>
      <div class="eyebrow">Materials &amp; Method</div>
      <h2 class="ttl">The ${c.name} <span class="accent">Specification</span></h2>
      <p class="lead">No mystery products, no shortcuts. This is the exact system we bring to every ${c.name} project — in writing, on every itemized estimate.</p>
    </div>
    <div class="spec-table">
      <div class="st-head"><span class="t">Estate Painting Specification</span><span class="n">Prepared for ${c.name}, Irvine</span></div>
      <div class="st-row"><span class="st-k">Surface Preparation</span><span class="st-v">Pressure wash, scrape and sand failing edges, <b>stucco crack and patch repair floated to match the existing texture</b>, and spot-priming with bonding primer — the finish is only as good as what's under it.</span></div>
      <div class="st-row"><span class="st-k">Coating System</span><span class="st-v"><b>Sherwin-Williams Emerald and Duration</b> exterior acrylics for bodies and fascias; Emerald urethane trim enamel for doors, trim, and cabinetry. Two coats at full wet-mil thickness, never over-thinned.</span></div>
      <div class="st-row"><span class="st-k">Application</span><span class="st-v"><b>Graco and Titan professional airless spray rigs</b>, back-rolled on stucco to drive coating into the texture, with hand-cut lines at every color transition.</span></div>
      <div class="st-row"><span class="st-k">Site Protection</span><span class="st-v">Full masking and containment for ${c.context.settingNote} — landscaping wrapped, hardscape covered, wind-checked spray scheduling, clean site every evening.</span></div>
      <div class="st-row"><span class="st-k">Transparency</span><span class="st-v">Every proposal is <b>itemized line by line</b> — prep, primer, coating, trim, and accents priced separately. No lump sums, no hidden charges.</span></div>
      <div class="st-row"><span class="st-k">Warranty</span><span class="st-v"><b>1-Year Warranty on labor and materials</b>, no questions asked. Licensed, Bonded &amp; Insured in the State of California.</span></div>
    </div>
  </section>`;
}

function modColorGuide(c, no, bg) {
  const cards = [...CORE_COLORS, ...c.extraColors].map(col => `
      <div class="swatch-card">
        <div class="swatch-chip" style="background:${col.hex};"></div>
        <div class="swatch-body">
          <div class="swatch-name">${col.name}</div>
          <div class="swatch-code">Sherwin-Williams · ${col.code}</div>
          <p class="swatch-note">${col.note}</p>
        </div>
      </div>`).join('');
  return `
  <section class="${bg}" id="colors">
    <div class="sec-head">
      <div class="sec-no">${secNo(no)}</div>
      <div class="eyebrow">The Designer Color Guide</div>
      <h2 class="ttl">A Palette Built For <span class="accent">${c.name}</span></h2>
      <p class="lead">${c.context.archNote}</p>
    </div>
    <div class="swatch-grid">${cards}
    </div>
    <div class="sec-head" style="margin:44px auto 0;">
      <p class="lead" style="font-family:var(--font-serif); font-style:italic; font-size:16.5px;">Every palette is test-rendered on <b>your own home</b> through our complimentary Custom Visualization Service — you approve a color you've already seen, not a paper swatch.</p>
    </div>
  </section>`;
}

function modProcess(c, no, bg) {
  const steps = [
    ['Private Color Consultation', 'A 30-minute in-home consultation, then our design team renders your ' + c.name + ' home in each candidate palette through our complimentary <em>Custom Visualization Service</em> — before anything is scheduled.'],
    ['Design Review, Handled', 'We prepare the complete color submission package for ' + c.context.hoaNote + ' — swatches, product data sheets, and elevation callouts — so approval never stalls your project.'],
    ['Estate-Grade Preparation', 'Pressure wash, stucco repair floated to match texture, sanding, and bonding primer. Landscaping and hardscape are masked and wrapped before a single gallon is opened.'],
    ['Precision Spray Application', 'Sherwin-Williams Emerald applied with Graco and Titan airless equipment at full wet-mil, back-rolled on stucco, with hand-cut lines at every transition.'],
    ['Founder’s Walkthrough &amp; Warranty', 'Raking-light inspection of every elevation, touch-ups before you ask, and a signed walkthrough — backed by our 1-Year Warranty, no questions asked.']
  ];
  const rows = steps.map((s, i) => `
      <div class="glove-step">
        <div class="glove-num">${i + 1}</div>
        <div>
          <h3 class="glove-title">${s[0]}</h3>
          <p class="glove-desc">${s[1]}</p>
        </div>
      </div>`).join('');
  return `
  <section class="${bg}" id="process">
    <div class="sec-head">
      <div class="sec-no">${secNo(no)}</div>
      <div class="eyebrow">The White-Glove Process</div>
      <h2 class="ttl">How a ${c.name} Project <span class="accent">Actually Runs</span></h2>
    </div>
    <div class="glove-steps">${rows}
    </div>
  </section>`;
}

function modProblemSolution(c, no, bg) {
  const cards = c.problems.map(ps => `
      <div class="ps-card">
        <div class="ps-lbl problem">The Problem</div>
        <p class="ps-p">${ps.p}</p>
        <div class="ps-divider"></div>
        <div class="ps-lbl solution">The VIP Solution</div>
        <p class="ps-s">${ps.s}</p>
      </div>`).join('');
  return `
  <section class="${bg}" id="fit">
    <div class="sec-head">
      <div class="sec-no">${secNo(no)}</div>
      <div class="eyebrow">Made For ${c.name}</div>
      <h2 class="ttl">What Goes Wrong — And How <span class="accent">We Solve It</span></h2>
    </div>
    <div class="ps-grid">${cards}
    </div>
  </section>`;
}

/* ---------------- FIXED SECTIONS (every page) ---------------- */

/* Interactive Custom Visualization — the highlight, lifted from the OC
   page and localized: same copy, community name in the headline. */
function vizSection(c) {
  const BASE_SUB = 'Choose a style direction, then tap any palette. Watch your home transform in real time — exactly what we deliver in our 30-minute consultation.';
  let html = VIZ_HTML.replace(
    'See Your Orange County Home In <span class="accent">Every Color</span> Before A Single Brushstroke',
    `See Your ${c.name} Home In <span class="accent">Every Color</span> Before A Single Brushstroke`
  );
  /* Unique localized lede above the shared tool, so even the boilerplate
     component sits inside text no other page has. */
  if (!html.includes(BASE_SUB)) throw new Error(`${c.slug}: viz sub-headline marker not found — did the OC page copy change?`);
  html = html.replace(BASE_SUB, `${c.vizIntro}</p>\n      <p class="viz-lede-cta">${BASE_SUB}`);
  return html;
}

/* Google Maps / local-pack section: embedded community map + NAP block
   + links to the Google Business Profile. */
function mapSection(c, no) {
  const q = encodeURIComponent(`${c.name}, Irvine, CA`);
  const allNames = DATA.communities.map(o => o.name).join(' · ');
  return `
  <section id="map">
    <div class="sec-head">
      <div class="sec-no">${secNo(no)}</div>
      <div class="eyebrow">Service Area · Find Us On Google</div>
      <h2 class="ttl">Proudly Serving <span class="accent">${c.name}</span>, Irvine</h2>
      <p class="lead">VIP Home Painting is a service-area painting company covering every village of Irvine. Save our Google profile, read our reviews, and see recent project photos before your consultation.</p>
    </div>
    <div class="map-grid">
      <div class="map-embed">
        <iframe title="Map of ${c.name}, Irvine, CA — VIP Home Painting service area" src="https://www.google.com/maps?q=${q}&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
      </div>
      <div class="nap-card">
        <div class="nap-name">VIP Home Painting</div>
        <div class="nap-line" style="font-family:var(--font-serif); font-style:italic; color:var(--gold-deep);">Luxury Residential Painting · ${c.name}, Irvine, CA</div>
        <div class="nap-line"><b>Phone:</b> <a href="${CFG.phoneHref}">${CFG.phone}</a></div>
        <div class="nap-line"><b>Email:</b> <a href="mailto:${CFG.email}">${CFG.email}</a></div>
        <div class="nap-line"><b>Hours:</b> Mon–Fri 8am–6pm · Sat 9am–3pm</div>
        <div class="nap-line"><b>Service Area:</b> ${allNames} &amp; all Irvine villages</div>
        <div class="nap-btns">
          <a class="btn-gold" href="${CFG.gbpUrl}" target="_blank" rel="noopener">See Us On Google</a>
          <a class="nap-ghost" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent('VIP Home Painting Irvine CA')}" target="_blank" rel="noopener">Open Google Maps</a>
        </div>
      </div>
    </div>
  </section>`;
}

/* Community FAQ — visible content matches the FAQPage JSON-LD exactly. */
function faqSection(c, no) {
  const items = c.faqs.map((f, i) => `
      <details class="faq-item"${i === 0 ? ' open' : ''}>
        <summary class="faq-q">${f.q}<span class="pm">+</span></summary>
        <div class="faq-a">${f.a.replace('(909) 312-5400', `<a href="${CFG.phoneHref}">(909) 312-5400</a>`)}</div>
      </details>`).join('');
  return `
  <section class="cream" id="faq">
    <div class="faq-head">
      <div class="sec-no">${secNo(no)}</div>
      <div class="eyebrow sec-head-eyebrow">Frequently Asked Questions</div>
      <h2 class="ttl">${c.name} Home Painting — <span class="accent">Your Questions Answered</span></h2>
    </div>
    <div class="faq-list">${items}
    </div>
  </section>`;
}

const MODULE_BUILDERS = {
  caseStudy: modCaseStudy,
  portfolio: modPortfolio,
  specs: modSpecs,
  colorGuide: modColorGuide,
  process: modProcess,
  problemSolution: modProblemSolution
};

/* ---------------- STRUCTURED DATA ---------------- */

function jsonLd(c, url) {
  const business = {
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${CFG.siteBase}/#business`,
    name: CFG.businessName,
    alternateName: 'VIP Premier Painting',
    description: `VIP Home Painting is the luxury residential painting company serving ${c.name} and the villages of Irvine, CA — exterior painting, interior painting, and factory-finish kitchen cabinet refinishing using Sherwin-Williams coating systems and professional Graco and Titan airless spray application, backed by a 1-Year Warranty.`,
    url: `${CFG.siteBase}/`,
    telephone: CFG.phoneE164,
    email: CFG.email,
    priceRange: '$$$',
    /* Service-area business. `address` must be the city VIP actually operates
       from — never the city being marketed to. Claiming an address in a city
       you don't operate from is a fabricated location: a GBP suspension risk
       and a trust problem. The marketed area belongs in `areaServed`.
       Google requires an address on LocalBusiness even for SABs, so we publish
       the real base locality with no street address. */
    address: { '@type': 'PostalAddress', addressLocality: 'Anaheim', addressRegion: 'CA', addressCountry: 'US' },
    hasMap: CFG.gbpUrl,
    /* GeoCircle is the schema.org-sanctioned way to express a service radius
       for a business without a storefront in the area it serves. */
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: { '@type': 'GeoCoordinates', latitude: c.geo.lat, longitude: c.geo.lng },
      geoRadius: 16000
    },
    areaServed: [
      {
        '@type': 'Place',
        name: `${c.name}, Irvine, CA`,
        geo: { '@type': 'GeoCoordinates', latitude: c.geo.lat, longitude: c.geo.lng },
        containedInPlace: { '@type': 'City', name: 'Irvine', sameAs: 'https://en.wikipedia.org/wiki/Irvine,_California' }
      },
      { '@type': 'City', name: 'Irvine', sameAs: 'https://en.wikipedia.org/wiki/Irvine,_California' }
    ],
    serviceType: ['Exterior House Painting', 'Interior House Painting', 'Luxury Home Painting', 'Kitchen Cabinet Painting', 'Custom Color Consultation'],
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '09:00', closes: '15:00' }
    ],
    sameAs: ['https://www.facebook.com/viphomepainting', 'https://www.instagram.com/viphomepainting', 'https://g.page/viphomepainting']
  };
  const service = {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: `Luxury House Painting in ${c.name}, Irvine CA`,
    serviceType: 'Residential Painting',
    description: c.metaDescription,
    provider: { '@id': `${CFG.siteBase}/#business` },
    areaServed: { '@type': 'Place', name: `${c.name}, Irvine, CA` }
  };
  const webPage = {
    '@type': 'WebPage',
    '@id': url,
    name: c.title,
    url,
    inLanguage: 'en-US',
    about: { '@id': `${CFG.siteBase}/#business` },
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.capsule-text'] }
  };
  const faqPage = {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: c.faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };
  const breadcrumbs = {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumbs`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'VIP Home Painting — Orange County', item: `${CFG.siteBase}/orange-county-sales-page/` },
      { '@type': 'ListItem', position: 2, name: 'Irvine', item: `${CFG.siteBase}/irvine/` },
      { '@type': 'ListItem', position: 3, name: c.name, item: url }
    ]
  };
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': [business, service, faqPage, webPage, breadcrumbs] }, null, 2);
}

/* ---------------- PAGE ---------------- */

function buildPage(c) {
  const url = `${CFG.siteBase}/${CFG.outputDir}/${c.slug}/`;
  const A = CFG.assetBase;

  /* Fixed, funnel-ordered nav — identical on every community page,
     independent of the body-module rotation. */
  const navLinks = [
    ['#viz', 'Visualize'],
    ['#colors', 'Colors'],
    ['#process', 'Process'],
    ['#portfolio', 'Portfolio'],
    ['#faq', 'FAQ'],
    ['#quote', 'Complimentary Quote']
  ].map(([href, label]) => `<a href="${href}">${label}</a>`).join('\n      ');

  const modules = c.moduleOrder
    .map((k, i) => MODULE_BUILDERS[k](c, i + 2, POSITION_BG[i]))
    .join('\n');

  const otherCommunities = DATA.communities
    .filter(o => o.slug !== c.slug)
    .map(o => `<li><a href="../${o.slug}/">${o.name} Home Painting</a></li>`)
    .join('\n            ');

  const capsuleText = c.capsule.replace(
    'Call (909) 312-5400.',
    `Call <a href="${CFG.phoneHref}" style="color:var(--gold-deep); font-weight:700; text-decoration:none;">${CFG.phone}</a>.`
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- ============ PRIMARY SEO META — ${c.name}, Irvine ============ -->
<title>${c.title}</title>
<meta name="description" content="${c.metaDescription}">
<link rel="canonical" href="${url}">

<!-- Open Graph / answer-engine crawlers -->
<meta property="og:type" content="website">
<meta property="og:title" content="${c.title}">
<meta property="og:description" content="${c.metaDescription}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="VIP Home Painting">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${c.title}">
<meta name="twitter:description" content="${c.metaDescription}">

<!-- Geo / Local -->
<meta name="geo.region" content="US-CA">
<meta name="geo.placename" content="${c.name}, Irvine, California">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">

<!-- ============ STRUCTURED DATA — LocalBusiness + Service + WebPage ============ -->
<script type="application/ld+json">
${jsonLd(c, url)}
</script>

<style>
/* === Base design system + visualization engine (extracted from the OC page) === */
${BASE_CSS}
/* === FAQ styles (extracted from the OC page) === */
${FAQ_CSS}
/* === Community-page overrides + modules (generator/page.css) === */
${CSS}
${FILM_CSS}
</style>
</head>
<body>
<div class="page">

  <!-- ============ TOP BAR ============ -->
  <header class="topbar">
    <a class="top-logo" href="#hero">
      <img class="logo-img" src="${A}/assets/logos/logo-tagline.png" alt="VIP Home Painting — See it. Love it. Paint it."/>
    </a>
    <nav class="top-nav">
      ${navLinks}
    </nav>
    <a href="${CFG.phoneHref}" class="top-phone">
      ${SVG_PHONE}
      ${CFG.phone}
    </a>
  </header>

  <!-- ============ HERO — unified cinematic style, static image ============ -->
  ${heroStory(c.hero_story, c.name, A) || `<section class="hero hero-cinema" id="hero">
    <div class="hero-photo" style="background-image:url('${A}/video/hero-poster.jpg');"></div>
    <div class="hero-scrim"></div>
    <div class="hero-goldframe" aria-hidden="true"></div>

    <div class="hero-stack">
      <div class="hero-fleuron" aria-hidden="true">&#10087;</div>
      <div class="eyebrow-ruled">${c.heroEyebrow}</div>
      <h1 class="ttl-hero">${c.h1}</h1>
      <div class="hero-kicker eyebrow-ruled">${c.heroKicker}</div>

      <div class="hero-cta-wrap">
        ${ctaButton('Claim Complimentary Color Consultation', 'Irresistible Painting Estimates Included')}
        <p class="hero-note">See your ${c.name} home in its new palette before a single brushstroke.</p>
      </div>
    </div>

    <div class="hero-strip">
      <div class="cell">
        <img class="strip-badge" src="${A}/assets/badges/badge-color-schemes.png" alt="Custom Color Schemes badge"/>
        <div class="lb">Custom Visualization</div>
        <div class="sb">See it before we paint</div></div>
      <div class="cell">
        <img class="strip-badge" src="${A}/assets/badges/badge-warranty.png" alt="Insane 1-Year Warranty badge"/>
        <div class="lb">1-Year Warranty</div>
        <div class="sb">No questions asked</div></div>
      <div class="cell">
        ${SVG_STAR}
        <div class="lb">Licensed &amp; Insured</div>
        <div class="sb">Bonded in California</div></div>
      <div class="cell">
        ${SVG_CLOCK}
        <div class="lb">5-Day Transformations</div>
        <div class="sb">Concierge scheduling</div></div>
    </div>
  </section>`}

  <!-- ============ ANSWER CAPSULE — the short answer, up top ============ -->
  <section class="capsule" id="capsule">
    <div class="capsule-card">
      <div class="capsule-kicker">The Short Answer · ${c.name} Home Painting</div>
      <p class="capsule-text">${capsuleText}</p>
    </div>
  </section>

  <!-- ============ No. 01 — INTERACTIVE CUSTOM VISUALIZATION (the highlight) ============ -->
  ${vizSection(c)}
${modules}
${mapSection(c, c.moduleOrder.length + 2)}
${faqSection(c, c.moduleOrder.length + 3)}

  <!-- ============ BYLINE + FINAL CTA ============ -->
  <section id="quote">
    <div class="byline">
      <img class="byline-ph" src="${A}/assets/fabian.jpg" alt="Fabian — Founder, VIP Home Painting"/>
      <div class="byline-txt">
        <div class="byline-kicker">From the Desk of the Founder</div>
        <p class="byline-quote">"Every estate deserves to be seen before a single brushstroke. That's my promise to every ${c.name} homeowner we serve."</p>
        <div class="byline-sig">Fabian</div>
        <div class="byline-role">Founder · VIP Home Painting</div>
      </div>
    </div>

    <div class="final-cta">
      <div class="sec-no">${secNo(c.moduleOrder.length + 4)}</div>
      <div class="ck">Ready To Transform Your ${c.name} Home?</div>
      <h2 class="ttl">Let's Make Your Home the <em>Envy of ${c.name}</em></h2>
      ${ctaButton('Get My Complimentary Quote Now', 'No Pressure · No Obligation · Always Complimentary')}
    </div>
  </section>

  <!-- ============ FOOTER ============ -->
  <footer>
    <div class="f-shell">
      <div class="f-mast">
        <div class="f-logo">
          <img class="f-mark" src="${A}/assets/logos/logo-mark.png" alt="VIP Home Painting"/>
          <div class="wm"><div class="vip">VIP</div><div class="sub">HOME PAINTING</div></div>
        </div>
        <div class="f-tag"><b>We don't just paint homes,</b><br/>we transform lives.</div>
      </div>

      <div class="f-cols">
        <nav class="f-col" aria-label="Irvine communities we serve">
          <div class="f-col-label">Irvine Communities</div>
          <ul class="f-links">
            <li><a href="../"><b>All Irvine Home Painting</b></a></li>
            ${otherCommunities}
            <li><a href="${A}/">Orange County Home Painting</a></li>
          </ul>
        </nav>
        <nav class="f-col" aria-label="Premium services">
          <div class="f-col-label">Premium Services</div>
          <ul class="f-links">
            <li><a href="${A}/#services">Residential Exterior Painting</a></li>
            <li><a href="${A}/#services">Premium Interior Painting</a></li>
            <li><a href="${A}/#services">Kitchen Cabinet Painting</a></li>
            <li><a href="${A}/#viz">Custom Color Visualization</a></li>
          </ul>
        </nav>
        <div class="f-col">
          <div class="f-col-label">VIP Concierge</div>
          <ul class="f-links">
            <li><a href="${CFG.phoneHref}">${CFG.phone}</a></li>
            <li><a href="mailto:${CFG.email}">${CFG.email}</a></li>
            <li><span style="font-size:13.5px; color:rgba(255,255,255,0.78);">Mon–Fri 8am–6pm · Sat 9am–3pm</span></li>
          </ul>
        </div>
      </div>

      <div class="f-bottom">
        <div class="f-contact">
          <span>Serving ${c.name} &amp; every village of Irvine, CA</span>
          <a href="${CFG.phoneHref}">${CFG.phone}</a>
        </div>
        <div class="f-copy">© ${new Date().getFullYear()} VIP Home Painting. Licensed, Bonded &amp; Insured · 1-Year Warranty on Labor &amp; Materials.</div>
      </div>
    </div>
  </footer>

</div>
${VIZ_JS}
<script>
/* "Watch the Film" — opens a lightbox over the page. Nothing loads until
   the button is clicked, so an unwatched film costs nothing. Handles both a
   YouTube id (once the Irvine commercials exist) and a local mp4 (today). */
(function () {
  var btns = document.querySelectorAll(".film-play, .yt-facade, .yt-short");
  if (!btns.length) return;
  var modal, stage;
  function build() {
    modal = document.createElement("div");
    modal.className = "film-modal";
    modal.innerHTML = '<div class="film-stage"><button class="film-close" aria-label="Close film">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">' +
      '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Close</button></div>';
    document.body.appendChild(modal);
    stage = modal.querySelector(".film-stage");
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest(".film-close")) close();
    });
  }
  function close() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
    var m = stage.querySelector("video, iframe");
    if (m) m.remove();
  }
  function open(el) {
    if (!modal) build();
    var yt = el.getAttribute("data-yt");
    var film = el.getAttribute("data-film");
    var media;
    if (yt) {
      media = document.createElement("iframe");
      media.src = "https://www.youtube-nocookie.com/embed/" + yt + "?autoplay=1&rel=0";
      media.title = "VIP Home Painting film";
      media.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture";
      media.allowFullscreen = true;
    } else if (film) {
      media = document.createElement("video");
      media.src = film;
      media.controls = true; media.autoplay = true; media.playsInline = true;
    } else { return; }
    stage.appendChild(media);
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  btns.forEach(function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); open(b); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && modal.classList.contains("open")) close();
  });
})();
</script>
</body>
</html>
`;
}

/* ============================================================
   CITY PAGES — the hub. Different job, different modules.
   ============================================================ */

const CITY_MODULES = require('./city-modules.js');
const CITY_CSS = fs.readFileSync(path.join(__dirname, 'city-page.css'), 'utf8');
const FILM_CSS = fs.readFileSync(path.join(__dirname, 'film-player.css'), 'utf8');
const CITIES_PATH = path.join(__dirname, 'cities.json');
const CITIES = fs.existsSync(CITIES_PATH) ? JSON.parse(fs.readFileSync(CITIES_PATH, 'utf8')) : { cities: [] };

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* A city page sits one level deep (/irvine/), a community page two
   (/irvine/orchard-hills/). The extracted OC assets are path-rewritten
   for the two-level case, so shift them up one for the city. */
const cityAssets = (html) => html.split('../../orange-county-sales-page').join('../orange-county-sales-page');

function cityJsonLd(c, url) {
  const base = CFG.siteBase;
  const business = {
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${base}/#business`,
    name: CFG.businessName,
    description: `VIP Home Painting is the luxury residential painting company serving ${c.name}, CA — exterior painting, interior painting, and factory-finish kitchen cabinet refinishing, backed by a 1-Year Warranty.`,
    url: `${base}/`,
    telephone: CFG.phoneE164,
    email: CFG.email,
    priceRange: '$$$',
    address: { '@type': 'PostalAddress', addressLocality: 'Anaheim', addressRegion: 'CA', addressCountry: 'US' },
    hasMap: CFG.gbpUrl,
    serviceArea: { '@type': 'GeoCircle',
      geoMidpoint: { '@type': 'GeoCoordinates', latitude: c.geo.lat, longitude: c.geo.lng },
      geoRadius: 20000 },
    areaServed: [{ '@type': 'City', name: c.name, sameAs: c.wikipedia || undefined }],
    serviceType: ['Exterior House Painting', 'Interior House Painting', 'Kitchen Cabinet Painting', 'Custom Color Consultation'],
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '08:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '09:00', closes: '15:00' }
    ]
  };
  const graph = [business, {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: `Luxury House Painting in ${c.name}, CA`,
    serviceType: 'Residential Painting',
    description: c.seo.meta_desc,
    provider: { '@id': `${base}/#business` },
    areaServed: { '@type': 'City', name: c.name }
  }];

  /* ItemList — tells Google this hub owns the villages below it */
  if ((c.child_communities || []).length) {
    graph.push({
      '@type': 'ItemList',
      '@id': `${url}#communities`,
      name: `${c.name} communities served by VIP Home Painting`,
      itemListElement: c.child_communities.map((x, i) => ({
        '@type': 'ListItem', position: i + 1, name: x.name, url: `${base}${x.url}`
      }))
    });
  }
  /* VideoObject — without this a YouTube embed earns no rich result */
  const v = (c.media && c.media.hero_video) || {};
  if (v.youtube_id && v.title && v.description && v.upload_date) {
    graph.push({
      '@type': 'VideoObject',
      '@id': `${url}#video`,
      name: v.title,
      description: v.description,
      thumbnailUrl: v.thumbnail_url || `https://i.ytimg.com/vi/${v.youtube_id}/maxresdefault.jpg`,
      uploadDate: v.upload_date,
      duration: v.duration_iso || undefined,
      embedUrl: `https://www.youtube-nocookie.com/embed/${v.youtube_id}`,
      contentUrl: `https://www.youtube.com/watch?v=${v.youtube_id}`
    });
  }
  if ((c.faqs || []).length) {
    graph.push({
      '@type': 'FAQPage', '@id': `${url}#faq`,
      mainEntity: c.faqs.filter(f => f.q && f.a).map(f => ({
        '@type': 'Question', name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      }))
    });
  }
  graph.push({
    '@type': 'WebPage', '@id': url, name: c.seo.meta_title, url, inLanguage: 'en-US',
    about: { '@id': `${base}/#business` },
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.capsule-text'] }
  }, {
    '@type': 'BreadcrumbList', '@id': `${url}#breadcrumbs`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'VIP Home Painting — Orange County', item: `${base}/orange-county-sales-page/` },
      { '@type': 'ListItem', position: 2, name: c.name, item: url }
    ]
  });
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
}

function buildCityPage(c) {
  const url = `${CFG.siteBase}/${c.slug}/`;
  const A = '../orange-county-sales-page';
  const H = { CFG, ctaButton, secNo, esc };

  /* Child URLs are stored absolute (/irvine/orchard-hills/) but GitHub Pages
     serves this site from a repo subpath, where a leading slash resolves to
     the domain root and 404s. From the city page every child is one level
     down, so use a plain relative path. */
  const rel = (u) => String(u).replace(/^\/[^/]+\//, '');
  const kids = (c.child_communities || []).map(x => ({ ...x, href: rel(x.url) }));
  const cWithRel = { ...c, child_communities: kids };

  const order = (c.layout && c.layout.module_order) || [];
  const rendered = [];
  const modules = order.map((key, i) => {
    const fn = CITY_MODULES[key] || MODULE_BUILDERS[key];
    if (!fn) throw new Error(`city ${c.slug}: no builder for module "${key}"`);
    const html = fn(cWithRel, i + 3, POSITION_BG[i % POSITION_BG.length], H);
    if (html) rendered.push(key);
    return html;
  }).filter(Boolean).join('\n');

  /* Only link to sections that actually rendered — a nav anchor pointing at
     a module whose copy isn't written yet is a dead link. */
  const NAV = { pricing: 'Pricing', communities: 'Communities', color_guide: 'Colors',
                process: 'Process', hoa: 'HOA', video: 'Video', spotlight: 'Projects' };
  const NAV_ID = { color_guide: 'colors' };
  const hasFaqs = (c.faqs || []).filter(f => f.q && f.a).length > 0;
  const navLinks = ['<a href="#viz">Visualize</a>']
    .concat(rendered.filter(k => NAV[k]).map(k => `<a href="#${NAV_ID[k] || k}">${NAV[k]}</a>`))
    .concat(hasFaqs ? ['<a href="#faq">FAQ</a>'] : [])
    .concat(['<a href="#quote">Get a Quote</a>'])
    .join('\n      ');

  const footerCommunities = kids
    .map(x => `<li><a href="${x.href}">${x.name} Home Painting</a></li>`).join('\n            ');

  const capsule = (c.seo.answer_capsule || '').replace(
    CFG.phone, `<a href="${CFG.phoneHref}" style="color:var(--gold-deep); font-weight:700; text-decoration:none;">${CFG.phone}</a>`);

  const faqSec = (c.faqs || []).filter(f => f.q && f.a).length ? `
  <section class="cream" id="faq">
    <div class="faq-head">
      <div class="sec-no">${secNo(order.length + 3)}</div>
      <div class="eyebrow">Frequently Asked Questions</div>
      <h2 class="ttl">${c.name} Painting — <span class="accent">Your Questions Answered</span></h2>
    </div>
    <div class="faq-list">${c.faqs.filter(f => f.q && f.a).map((f, i) => `
      <details class="faq-item"${i === 0 ? ' open' : ''}>
        <summary class="faq-q">${f.q}<span class="pm">+</span></summary>
        <div class="faq-a">${f.a.replace(CFG.phone, `<a href="${CFG.phoneHref}">${CFG.phone}</a>`)}</div>
      </details>`).join('')}
    </div>
  </section>` : '';

  const heroMedia = (c.layout && c.layout.hero_variant) === 'youtube' && c.media
    && c.media.hero_video && c.media.hero_video.youtube_id
    ? `<div class="hero-photo" style="background-image:url('https://i.ytimg.com/vi/${c.media.hero_video.youtube_id}/maxresdefault.jpg');"></div>`
    : `<div class="hero-photo" style="background-image:url('${A}/video/hero-poster.jpg');"></div>`;

  return cityAssets(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>${esc(c.seo.meta_title)}</title>
<meta name="description" content="${esc(c.seo.meta_desc)}">
<link rel="canonical" href="${url}">

<!-- Open Graph / answer-engine crawlers -->
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(c.seo.meta_title)}">
<meta property="og:description" content="${esc(c.seo.meta_desc)}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="VIP Home Painting">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">

<meta name="geo.region" content="US-CA">
<meta name="geo.placename" content="${esc(c.name)}, California">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">

<script type="application/ld+json">
${cityJsonLd(c, url)}
</script>

<style>
${BASE_CSS}
${FAQ_CSS}
${CSS}
${CITY_CSS}
${FILM_CSS}
</style>
</head>
<body>
<div class="page">

  <header class="topbar">
    <a class="top-logo" href="#hero">
      <img class="logo-img" src="${A}/assets/logos/logo-tagline.png" alt="VIP Home Painting — See it. Love it. Paint it."/>
    </a>
    <nav class="top-nav">
      ${navLinks}
    </nav>
    <a href="${CFG.phoneHref}" class="top-phone">
      ${SVG_PHONE}
      ${CFG.phone}
    </a>
  </header>

  ${heroStory(c.hero_story, c.name, A) || `<section class="hero hero-cinema" id="hero">
    ${heroMedia}
    <div class="hero-scrim"></div>
    <div class="hero-goldframe" aria-hidden="true"></div>
    <div class="hero-stack">
      <div class="hero-fleuron" aria-hidden="true">&#10087;</div>
      <div class="eyebrow-ruled">${esc(c.seo.hero_eyebrow || `${c.name} Luxury Home Painting`)}</div>
      <h1 class="ttl-hero">${c.seo.h1}</h1>
      <div class="hero-kicker eyebrow-ruled">Complimentary Custom Color Visualization Included</div>
      <div class="hero-cta-wrap">
        ${ctaButton('Claim Complimentary Color Consultation', 'Irresistible Painting Estimates Included')}
        <p class="hero-note">See your ${esc(c.name)} home in its new palette before a single brushstroke.</p>
      </div>
    </div>
    <div class="hero-strip">
      <div class="cell"><img class="strip-badge" src="${A}/assets/badges/badge-color-schemes.png" alt="Custom Color Schemes badge"/>
        <div class="lb">Custom Visualization</div><div class="sb">See it before we paint</div></div>
      <div class="cell"><img class="strip-badge" src="${A}/assets/badges/badge-warranty.png" alt="1-Year Warranty badge"/>
        <div class="lb">1-Year Warranty</div><div class="sb">No questions asked</div></div>
      <div class="cell">${SVG_STAR}<div class="lb">Licensed &amp; Insured</div><div class="sb">Bonded in California</div></div>
      <div class="cell">${SVG_CLOCK}<div class="lb">5-Day Transformations</div><div class="sb">Concierge scheduling</div></div>
    </div>
  </section>`}

  <section class="capsule" id="capsule">
    <div class="capsule-card">
      <div class="capsule-kicker">The Short Answer · ${esc(c.name)} Home Painting</div>
      <p class="capsule-text">${capsule}</p>
    </div>
  </section>

  ${vizSection({ name: c.name, vizIntro: c.seo.viz_intro })}
${modules}
${faqSec}

  <section id="quote">
    <div class="byline">
      <img class="byline-ph" src="${A}/assets/fabian.jpg" alt="Fabian — Founder, VIP Home Painting"/>
      <div class="byline-txt">
        <div class="byline-kicker">From the Desk of the Founder</div>
        <p class="byline-quote">"Every home deserves to be seen before a single brushstroke. That's my promise to every ${esc(c.name)} homeowner we serve."</p>
        <div class="byline-sig">Fabian</div>
        <div class="byline-role">Founder · VIP Home Painting</div>
      </div>
    </div>
    <div class="final-cta">
      <div class="sec-no">${secNo(order.length + 4)}</div>
      <div class="ck">Ready To Transform Your ${esc(c.name)} Home?</div>
      <h2 class="ttl">Let's Make Your Home the <em>Envy of ${esc(c.name)}</em></h2>
      ${ctaButton('Get My Complimentary Quote Now', 'No Pressure · No Obligation · Always Complimentary')}
    </div>
  </section>

  <footer>
    <div class="f-shell">
      <div class="f-mast">
        <div class="f-logo">
          <img class="f-mark" src="${A}/assets/logos/logo-mark.png" alt="VIP Home Painting"/>
          <div class="wm"><div class="vip">VIP</div><div class="sub">HOME PAINTING</div></div>
        </div>
        <div class="f-tag"><b>We don't just paint homes,</b><br/>we transform lives.</div>
      </div>
      <div class="f-cols">
        <nav class="f-col" aria-label="${esc(c.name)} communities we serve">
          <div class="f-col-label">${esc(c.name)} Communities</div>
          <ul class="f-links">
            ${footerCommunities}
            <li><a href="${A}/">Orange County Home Painting</a></li>
          </ul>
        </nav>
        <nav class="f-col" aria-label="Premium services">
          <div class="f-col-label">Premium Services</div>
          <ul class="f-links">
            <li><a href="${A}/#services">Residential Exterior Painting</a></li>
            <li><a href="${A}/#services">Premium Interior Painting</a></li>
            <li><a href="${A}/#services">Kitchen Cabinet Painting</a></li>
            <li><a href="${A}/#viz">Custom Color Visualization</a></li>
          </ul>
        </nav>
        <div class="f-col">
          <div class="f-col-label">VIP Concierge</div>
          <ul class="f-links">
            <li><a href="${CFG.phoneHref}">${CFG.phone}</a></li>
            <li><a href="mailto:${CFG.email}">${CFG.email}</a></li>
            <li><span style="font-size:13.5px; color:rgba(255,255,255,0.78);">Mon–Fri 8am–6pm · Sat 9am–3pm</span></li>
          </ul>
        </div>
      </div>
      <div class="f-bottom">
        <div class="f-contact">
          <span>Serving every village of ${esc(c.name)}, CA</span>
          <a href="${CFG.phoneHref}">${CFG.phone}</a>
        </div>
        <div class="f-copy">© ${new Date().getFullYear()} VIP Home Painting. Licensed, Bonded &amp; Insured · 1-Year Warranty on Labor &amp; Materials.</div>
      </div>
    </div>
  </footer>

</div>
${VIZ_JS}
<script>
/* "Watch the Film" — opens a lightbox over the page. Nothing loads until
   the button is clicked, so an unwatched film costs nothing. Handles both a
   YouTube id (once the Irvine commercials exist) and a local mp4 (today). */
(function () {
  var btns = document.querySelectorAll(".film-play, .yt-facade, .yt-short");
  if (!btns.length) return;
  var modal, stage;
  function build() {
    modal = document.createElement("div");
    modal.className = "film-modal";
    modal.innerHTML = '<div class="film-stage"><button class="film-close" aria-label="Close film">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">' +
      '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Close</button></div>';
    document.body.appendChild(modal);
    stage = modal.querySelector(".film-stage");
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest(".film-close")) close();
    });
  }
  function close() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
    var m = stage.querySelector("video, iframe");
    if (m) m.remove();
  }
  function open(el) {
    if (!modal) build();
    var yt = el.getAttribute("data-yt");
    var film = el.getAttribute("data-film");
    var media;
    if (yt) {
      media = document.createElement("iframe");
      media.src = "https://www.youtube-nocookie.com/embed/" + yt + "?autoplay=1&rel=0";
      media.title = "VIP Home Painting film";
      media.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture";
      media.allowFullscreen = true;
    } else if (film) {
      media = document.createElement("video");
      media.src = film;
      media.controls = true; media.autoplay = true; media.playsInline = true;
    } else { return; }
    stage.appendChild(media);
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  btns.forEach(function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); open(b); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && modal.classList.contains("open")) close();
  });
})();
</script>
</body>
</html>
`);
}

/* ============================================================
   HOA PAGE — the B2B page. Boards and property managers.
   Lives at /{city}/hoa-painting/, so it shares the community
   pages' two-level asset depth.
   ============================================================ */

const HOA_MODULES = require('./hoa-modules.js');
const HOA_CSS = fs.readFileSync(path.join(__dirname, 'hoa-page.css'), 'utf8');

function hoaJsonLd(h, city, url) {
  const base = CFG.siteBase;
  const graph = [{
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${base}/#business`,
    name: CFG.businessName,
    description: `VIP Home Painting provides common-area painting for homeowners associations and property managers in ${city.name}, CA — clubhouses, pool buildings, perimeter walls, monuments and guard structures.`,
    url: `${base}/`,
    telephone: CFG.phoneE164,
    email: CFG.email,
    priceRange: '$$$',
    address: { '@type': 'PostalAddress', addressLocality: 'Anaheim', addressRegion: 'CA', addressCountry: 'US' },
    hasMap: CFG.gbpUrl,
    areaServed: [{ '@type': 'City', name: city.name }]
  }, {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: `HOA & Common-Area Painting in ${city.name}, CA`,
    serviceType: 'Commercial and Common-Area Painting',
    description: h.seo.meta_desc,
    provider: { '@id': `${base}/#business` },
    areaServed: { '@type': 'City', name: city.name },
    /* The buyer is an organization, not a household — say so. */
    audience: { '@type': 'Audience', audienceType: 'Homeowners associations and property management companies' }
  }];
  if ((h.faqs || []).filter(f => f.q && f.a).length) {
    graph.push({ '@type': 'FAQPage', '@id': `${url}#faq`,
      mainEntity: h.faqs.filter(f => f.q && f.a).map(f => ({
        '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
  }
  graph.push({
    '@type': 'WebPage', '@id': url, name: h.seo.meta_title, url, inLanguage: 'en-US',
    about: { '@id': `${base}/#business` },
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.capsule-text'] }
  }, {
    '@type': 'BreadcrumbList', '@id': `${url}#breadcrumbs`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'VIP Home Painting — Orange County', item: `${base}/orange-county-sales-page/` },
      { '@type': 'ListItem', position: 2, name: city.name, item: `${base}/${city.slug}/` },
      { '@type': 'ListItem', position: 3, name: 'HOA & Common-Area Painting', item: url }
    ]
  });
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
}

function buildHoaPage(h, city) {
  const url = `${CFG.siteBase}/${city.slug}/${h.slug}/`;
  const A = CFG.assetBase;
  const H = { CFG, ctaButton, secNo, esc };
  const ctx = { ...h, city_name: city.name };

  const order = (h.layout && h.layout.module_order) || [];
  const rendered = [];
  const modules = order.map((key, i) => {
    const fn = HOA_MODULES[key];
    if (!fn) throw new Error(`hoa ${h.slug}: no builder for module "${key}"`);
    const out = fn(ctx, i + 3, POSITION_BG[i % POSITION_BG.length], H);
    if (out) rendered.push(key);
    return out;
  }).filter(Boolean).join('\n');

  const NAV = { scope: 'Scope', process: 'Process', compliance: 'Documentation',
                spec: 'Specification', references: 'Communities', bid_cta: 'Request a Bid' };
  const hasFaqs = (h.faqs || []).filter(f => f.q && f.a).length > 0;
  const navLinks = rendered.filter(k => NAV[k])
    .map(k => `<a href="#${k === 'bid_cta' ? 'bid' : k}">${NAV[k]}</a>`)
    .concat(hasFaqs ? ['<a href="#faq">FAQ</a>'] : [])
    .join('\n      ');

  const capsule = (h.seo.answer_capsule || '').replace(
    CFG.phone, `<a href="${CFG.phoneHref}" style="color:var(--gold-deep); font-weight:700; text-decoration:none;">${CFG.phone}</a>`);

  const faqSec = hasFaqs ? `
  <section class="cream" id="faq">
    <div class="faq-head">
      <div class="sec-no">${secNo(order.length + 3)}</div>
      <div class="eyebrow">Board &amp; Manager Questions</div>
      <h2 class="ttl">HOA Painting — <span class="accent">Answered</span></h2>
    </div>
    <div class="faq-list">${h.faqs.filter(f => f.q && f.a).map((f, i) => `
      <details class="faq-item"${i === 0 ? ' open' : ''}>
        <summary class="faq-q">${f.q}<span class="pm">+</span></summary>
        <div class="faq-a">${f.a.replace(CFG.phone, `<a href="${CFG.phoneHref}">${CFG.phone}</a>`)}</div>
      </details>`).join('')}
    </div>
  </section>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>${esc(h.seo.meta_title)}</title>
<meta name="description" content="${esc(h.seo.meta_desc)}">
<link rel="canonical" href="${url}">

<!-- Open Graph / answer-engine crawlers -->
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(h.seo.meta_title)}">
<meta property="og:description" content="${esc(h.seo.meta_desc)}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="VIP Home Painting">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">

<meta name="geo.region" content="US-CA">
<meta name="geo.placename" content="${esc(city.name)}, California">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">

<script type="application/ld+json">
${hoaJsonLd(h, city, url)}
</script>

<style>
${BASE_CSS}
${FAQ_CSS}
${CSS}
${CITY_CSS}
${HOA_CSS}
${FILM_CSS}
</style>
</head>
<body>
<div class="page">

  <header class="topbar">
    <a class="top-logo" href="#hero">
      <img class="logo-img" src="${A}/assets/logos/logo-tagline.png" alt="VIP Home Painting — See it. Love it. Paint it."/>
    </a>
    <nav class="top-nav">
      ${navLinks}
    </nav>
    <a href="${CFG.phoneHref}" class="top-phone">
      ${SVG_PHONE}
      ${CFG.phone}
    </a>
  </header>

  <section class="hero hero-cinema" id="hero">
    <div class="hero-photo" style="background-image:url('${A}/video/hero-poster.jpg');"></div>
    <div class="hero-scrim"></div>
    <div class="hero-goldframe" aria-hidden="true"></div>
    <div class="hero-stack">
      <div class="hero-fleuron" aria-hidden="true">&#10087;</div>
      <div class="eyebrow-ruled">${esc(city.name)} · HOA &amp; Common-Area Painting</div>
      <h1 class="ttl-hero">${h.seo.h1}</h1>
      <div class="hero-kicker eyebrow-ruled">Itemized Bids · Certificates On File · 1-Year Warranty</div>
      <div class="hero-cta-wrap">
        <a href="${CFG.phoneHref}" class="btn-gold">
          <span class="col-2"><span>Request a Bid</span><span class="sub">Itemized by structure · no obligation</span></span>
        </a>
        <p class="hero-note">We can walk the property and return an itemized bid without a meeting.</p>
      </div>
    </div>
    <div class="hero-strip">
      <div class="cell">${SVG_STAR}<div class="lb">Licensed &amp; Insured</div><div class="sb">COI naming your association</div></div>
      <div class="cell"><img class="strip-badge" src="${A}/assets/badges/badge-warranty.png" alt="1-Year Warranty badge"/>
        <div class="lb">1-Year Warranty</div><div class="sb">Labor &amp; materials</div></div>
      <div class="cell"><img class="strip-badge" src="${A}/assets/badges/badge-color-schemes.png" alt="Color rendering badge"/>
        <div class="lb">Rendered Before the Vote</div><div class="sb">Residents see it first</div></div>
      <div class="cell">${SVG_CLOCK}<div class="lb">Phased Scheduling</div><div class="sb">Amenities stay open</div></div>
    </div>
  </section>

  <section class="capsule" id="capsule">
    <div class="capsule-card">
      <div class="capsule-kicker">The Short Answer · ${esc(city.name)} HOA Painting</div>
      <p class="capsule-text">${capsule}</p>
    </div>
  </section>
${modules}
${faqSec}

  <footer>
    <div class="f-shell">
      <div class="f-mast">
        <div class="f-logo">
          <img class="f-mark" src="${A}/assets/logos/logo-mark.png" alt="VIP Home Painting"/>
          <div class="wm"><div class="vip">VIP</div><div class="sub">HOME PAINTING</div></div>
        </div>
        <div class="f-tag"><b>We don't just paint homes,</b><br/>we transform lives.</div>
      </div>
      <div class="f-cols">
        <nav class="f-col" aria-label="${esc(city.name)} pages">
          <div class="f-col-label">${esc(city.name)}</div>
          <ul class="f-links">
            <li><a href="../"><b>All ${esc(city.name)} Home Painting</b></a></li>
            ${(city.child_communities || []).map(x => `<li><a href="../${String(x.url).replace(/^\/[^/]+\//, '')}">${x.name} Home Painting</a></li>`).join('\n            ')}
            <li><a href="${A}/">Orange County Home Painting</a></li>
          </ul>
        </nav>
        <nav class="f-col" aria-label="Association services">
          <div class="f-col-label">For Associations</div>
          <ul class="f-links">
            <li><a href="#scope">Common-Area Scope</a></li>
            <li><a href="#compliance">Insurance &amp; Documentation</a></li>
            <li><a href="#spec">Materials Specification</a></li>
            <li><a href="#bid">Request a Bid</a></li>
          </ul>
        </nav>
        <div class="f-col">
          <div class="f-col-label">VIP Concierge</div>
          <ul class="f-links">
            <li><a href="${CFG.phoneHref}">${CFG.phone}</a></li>
            <li><a href="mailto:${CFG.email}">${CFG.email}</a></li>
            <li><span style="font-size:13.5px; color:rgba(255,255,255,0.78);">Mon–Fri 8am–6pm · Sat 9am–3pm</span></li>
          </ul>
        </div>
      </div>
      <div class="f-bottom">
        <div class="f-contact">
          <span>Common-area painting for ${esc(city.name)} associations</span>
          <a href="${CFG.phoneHref}">${CFG.phone}</a>
        </div>
        <div class="f-copy">© ${new Date().getFullYear()} VIP Home Painting. Licensed, Bonded &amp; Insured · 1-Year Warranty on Labor &amp; Materials.</div>
      </div>
    </div>
  </footer>

</div>
<script>
/* "Watch the Film" — opens a lightbox over the page. Nothing loads until
   the button is clicked, so an unwatched film costs nothing. Handles both a
   YouTube id (once the Irvine commercials exist) and a local mp4 (today). */
(function () {
  var btns = document.querySelectorAll(".film-play, .yt-facade, .yt-short");
  if (!btns.length) return;
  var modal, stage;
  function build() {
    modal = document.createElement("div");
    modal.className = "film-modal";
    modal.innerHTML = '<div class="film-stage"><button class="film-close" aria-label="Close film">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">' +
      '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Close</button></div>';
    document.body.appendChild(modal);
    stage = modal.querySelector(".film-stage");
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest(".film-close")) close();
    });
  }
  function close() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
    var m = stage.querySelector("video, iframe");
    if (m) m.remove();
  }
  function open(el) {
    if (!modal) build();
    var yt = el.getAttribute("data-yt");
    var film = el.getAttribute("data-film");
    var media;
    if (yt) {
      media = document.createElement("iframe");
      media.src = "https://www.youtube-nocookie.com/embed/" + yt + "?autoplay=1&rel=0";
      media.title = "VIP Home Painting film";
      media.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture";
      media.allowFullscreen = true;
    } else if (film) {
      media = document.createElement("video");
      media.src = film;
      media.controls = true; media.autoplay = true; media.playsInline = true;
    } else { return; }
    stage.appendChild(media);
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  btns.forEach(function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); open(b); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && modal.classList.contains("open")) close();
  });
})();
</script>
</body>
</html>
`;
}

/* ---------------- SITEMAP + ROBOTS ---------------- */

function buildSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: `${CFG.siteBase}/`, priority: '0.8' },
    { loc: `${CFG.siteBase}/orange-county-sales-page/`, priority: '1.0' },
    ...CITIES.cities.map(c => ({ loc: `${CFG.siteBase}/${c.slug}/`, priority: '0.95' })),
    ...CITIES.cities.flatMap(c => c.hoa_page ? [{ loc: `${CFG.siteBase}/${c.slug}/${c.hoa_page.slug}/`, priority: '0.85' }] : []),
    ...DATA.communities.map(c => ({ loc: `${CFG.siteBase}/${CFG.outputDir}/${c.slug}/`, priority: '0.9' }))
  ];
  const entries = urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

function buildRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${CFG.siteBase}/sitemap.xml
`;
}

/* ---------------- OUTPUT AUDIT ----------------
   The brief validator checks the brief. It cannot see strings hardcoded in
   this generator — which is exactly how "Free Quote" reached a live page.
   This scans the RENDERED output, which is the only thing customers read. */

function auditOutput(html, label) {
  const body = html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  const problems = [];
  const hits = (re) => (body.match(re) || []).length;
  if (hits(/\bfree\b/gi)) problems.push('"free" — use "complimentary"');
  if (hits(/\bAI\b/g)) problems.push('"AI" — use "our design team"');
  if (hits(/\bcolour/gi)) problems.push('British "colour" — US spelling');
  if (hits(/aggregateRating|5-Star Rated/gi)) problems.push('review/rating claim — VIP has 9 reviews, unconfirmed');
  if (/\b(averages?)\b[^.]{0,40}\$/i.test(body)) problems.push('market-average price claim');
  const phones = [...new Set(body.match(/\(\d{3}\) \d{3}-\d{4}/g) || [])];
  for (const p of phones) if (p !== CFG.phone) problems.push(`wrong phone "${p}"`);
  if (problems.length) throw new Error(`${label} failed the output audit:\n     - ${problems.join('\n     - ')}`);
}

/* ---------------- VALIDATE + RUN ---------------- */

function validate() {
  const seen = new Set();
  for (const c of DATA.communities) {
    const order = c.moduleOrder;
    const known = Object.keys(MODULE_BUILDERS);
    const unknown = order.filter(k => !known.includes(k));
    if (unknown.length) {
      throw new Error(`${c.slug}: unknown module(s) [${unknown.join(', ')}] — known: ${known.join(', ')}`);
    }
    if (new Set(order).size !== order.length) {
      throw new Error(`${c.slug}: moduleOrder repeats a module`);
    }
    const key = order.join('>');
    if (seen.has(key)) {
      throw new Error(`${c.slug}: moduleOrder duplicates another community's layout (${key}) — every page must have a unique sequential order`);
    }
    seen.add(key);
  }
}

function main() {
  validate();
  for (const c of DATA.communities) {
    const dir = path.join(ROOT, CFG.outputDir, c.slug);
    fs.mkdirSync(dir, { recursive: true });
    const html = buildPage(c);
    auditOutput(html, `irvine/${c.slug}`);
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
    console.log(`  ✓ ${CFG.outputDir}/${c.slug}/index.html  [${c.moduleOrder.join(' → ')}]`);
  }
  for (const city of CITIES.cities) {
    const dir = path.join(ROOT, city.slug);
    fs.mkdirSync(dir, { recursive: true });
    const chtml = buildCityPage(city);
    auditOutput(chtml, `${city.slug} (city)`);
    fs.writeFileSync(path.join(dir, 'index.html'), chtml, 'utf8');
    console.log(`  ✓ ${city.slug}/index.html  [CITY: ${(city.layout.module_order||[]).length} modules]`);
    if (city.hoa_page) {
      const hdir = path.join(ROOT, city.slug, city.hoa_page.slug);
      fs.mkdirSync(hdir, { recursive: true });
      const hhtml = buildHoaPage(city.hoa_page, city);
      auditOutput(hhtml, `${city.slug}/${city.hoa_page.slug} (hoa)`);
      fs.writeFileSync(path.join(hdir, 'index.html'), hhtml, 'utf8');
      console.log(`  ✓ ${city.slug}/${city.hoa_page.slug}/index.html  [HOA: ${(city.hoa_page.layout.module_order||[]).length} modules]`);
    }
  }
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), buildSitemap(), 'utf8');
  console.log('  ✓ sitemap.xml');
  fs.writeFileSync(path.join(ROOT, 'robots.txt'), buildRobots(), 'utf8');
  console.log('  ✓ robots.txt');
  console.log(`\nGenerated ${DATA.communities.length} community pages. Preview: node orange-county-sales-page/serve-oc.js then open http://localhost:5460/../irvine/<slug>/ or open the files directly.`);
}

main();
