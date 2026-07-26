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

/* ---------------- MODULES ---------------- */

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
        ${ctaButton('Claim Free Color Consultation', `${c.name} estimates, itemized line by line`)}
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
      <p class="lead" style="font-family:var(--font-serif); font-style:italic; font-size:16.5px;">Every palette is test-rendered on <b>your own home</b> through our free Custom Visualization Service — you approve a color you've already seen, not a paper swatch.</p>
    </div>
  </section>`;
}

function modProcess(c, no, bg) {
  const steps = [
    ['Private Color Consultation', 'A 30-minute in-home consultation, then our design team renders your ' + c.name + ' home in each candidate palette through our free <em>Custom Visualization Service</em> — before anything is scheduled.'],
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
    address: { '@type': 'PostalAddress', addressLocality: 'Irvine', addressRegion: 'CA', addressCountry: 'US' },
    hasMap: CFG.gbpUrl,
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
    ['#quote', 'Free Quote']
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

<!-- Open Graph / AI crawlers -->
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
  <section class="hero hero-cinema" id="hero">
    <div class="hero-photo" style="background-image:url('${A}/video/hero-poster.jpg');"></div>
    <div class="hero-scrim"></div>
    <div class="hero-goldframe" aria-hidden="true"></div>

    <div class="hero-stack">
      <div class="hero-fleuron" aria-hidden="true">&#10087;</div>
      <div class="eyebrow-ruled">${c.heroEyebrow}</div>
      <h1 class="ttl-hero">${c.h1}</h1>
      <div class="hero-kicker eyebrow-ruled">${c.heroKicker}</div>

      <div class="hero-cta-wrap">
        ${ctaButton('Claim Free Color Consultation', 'Irresistible Painting Estimates Included')}
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
        <div class="lb">5-Star Rated</div>
        <div class="sb">Irvine's trusted crews</div></div>
      <div class="cell">
        ${SVG_CLOCK}
        <div class="lb">5-Day Transformations</div>
        <div class="sb">Concierge scheduling</div></div>
    </div>
  </section>

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
      ${ctaButton('Get My Free Quote Now', 'No Pressure · No Obligation · 100% Free')}
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

/* ---------------- VALIDATE + RUN ---------------- */

function validate() {
  const seen = new Set();
  for (const c of DATA.communities) {
    const order = c.moduleOrder;
    const sorted = [...order].sort().join(',');
    if (sorted !== [...MODULE_KEYS].sort().join(',')) {
      throw new Error(`${c.slug}: moduleOrder must be a permutation of [${MODULE_KEYS.join(', ')}], got [${order.join(', ')}]`);
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
    fs.writeFileSync(path.join(dir, 'index.html'), buildPage(c), 'utf8');
    console.log(`  ✓ ${CFG.outputDir}/${c.slug}/index.html  [${c.moduleOrder.join(' → ')}]`);
  }
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), buildSitemap(), 'utf8');
  console.log('  ✓ sitemap.xml');
  fs.writeFileSync(path.join(ROOT, 'robots.txt'), buildRobots(), 'utf8');
  console.log('  ✓ robots.txt');
  console.log(`\nGenerated ${DATA.communities.length} community pages. Preview: node orange-county-sales-page/serve-oc.js then open http://localhost:5460/../irvine/<slug>/ or open the files directly.`);
}

main();
