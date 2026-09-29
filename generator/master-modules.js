/* ============================================================
   MASTER-PROCESS MODULES — the Orange County page's story-led
   sales process, as reusable generator modules.

   The OC page (orange-county-sales-page/index.html) is the single
   source of truth. Everything that is the same on every page — the
   hero reel, the scheme band, the "things you already tried" list,
   the package shot, the offer stack, the painted-it steps, the
   benefits list, the testimonials, the scope list — is EXTRACTED
   from it at build time, the same way the visualizer already is.
   Improve it there, re-run the build, every page picks it up.

   Only the localized words live in the data: a page's `master`
   block in communities.json (or cities.json for a city hub).

   Two rules this file enforces:

   1. A page with no `master.hero.h1` renders exactly as it did
      before — nothing here runs for it. Every module also renders
      nothing until its own block of copy exists.

   2. The homeowner is DATA, never text. The family, their photo,
      their house photos and their chosen scheme come from the page's
      `story` block (default: the OC page's own family, as a
      placeholder). Localized copy refers to them only through tokens
      — {they}, {their}, {family}, {place} — so swapping the family is
      an edit to one block, not a rewrite of every paragraph.
      See generator/README.md, "Swapping a page's homeowner".
   ============================================================ */

const fs = require('fs');
const path = require('path');

module.exports = function makeMasterModules(ctx) {
  const { BASE_PAGE, sliceBetween, rewriteAssetPaths, CFG, ctaButton, esc,
          ROOT, DATA, CITIES, BLOG, SERVICES, linker, cityOf } = ctx;
  const A = CFG.assetBase;
  const OC_DIR = path.join(ROOT, 'orange-county-sales-page');
  const noComments = (s) => s.replace(/[ \t]*<!--[\s\S]*?-->[ \t]*\n?/g, '');

  /* ---------------- EXTRACTED FROM THE MASTER ----------------
     Each slice throws if its marker disappears, so a restructure of
     the OC page fails the build loudly instead of silently dropping
     a section from every page. */
  const cut = (a, b, label, incl) => noComments(sliceBetween(BASE_PAGE, a, b, `master: ${label}`, incl));
  const X = {
    beats:    cut('<ol class="hero-beats">', '</ol>', 'hero beats', true),
    figure:   cut('<figure class="hr-inset">', '</figure>', 'hero reel', true),
    band:     cut('<template id="bandSchemes">', '</template>', 'band schemes', true),
    tried:    cut('<div class="fl-tried">', '<p class="fl-turn">', 'things already tried').trim(),
    reasons:  cut('<ul class="cand-reasons">', '</ul>', '3 things to settle', true),
    pkg:      cut('<div class="pkg" id="pkg">', '<!-- VALUE ANCHOR', 'package shot').trim(),
    anchor:   cut('<p class="os-anchor">', '</p>', 'value anchor', true),
    stack:    cut('<ul class="os-stack">', '</ul>', 'offer stack', true),
    osDo:     cut('<p class="os-do">', '</p>', 'offer action', true),
    steps:    cut('<div class="steps">', '\n  </section>', 'painted steps'),
    pillars:  cut('<div class="pillars">', '\n  </section>', 'before-you-commit pillars'),
    wbList:   cut('<ul class="wb-list">', '</ul>', 'neighbors benefits', true),
    testi:    cut('<div class="testi-grid">', '\n  </section>', 'testimonials'),
    services: cut('<div class="services-grid">', '\n  </section>', 'services grid'),
    scope:    cut('<div class="scope-block">', '<div class="byline">', 'scope of work').trim(),
    byline:   cut('<div class="byline">', '<div class="final-cta">', 'founder byline').trim(),
    heroChip: cut('<div class="pill-wrap pill-wrap-lede">', '<!-- Formula B2', 'hero chip')
  };
  const SERVICE_IMGS = [...X.services.matchAll(/service-img" style="background-image:url\('([^']+)'\)/g)].map(m => m[1]);
  if (SERVICE_IMGS.length < 3) throw new Error('master: services grid no longer carries 3 images');

  /* ---------------- THE DEFAULT STORY ----------------
     Read off the master's own hero, so the placeholder is always
     whoever the OC page currently features. */
  const chipName = (X.heroChip.match(/<div class="name">([^<]+)<\/div>/) || [])[1];
  const chipLoc  = (X.heroChip.match(/<div class="sub-line">([^<]+)<\/div>/) || [])[1];
  const chipImg  = (X.heroChip.match(/<img src="([^"]+)"/) || [])[1];
  const finalLayer = (X.figure.match(/<div class="hr-cand final"[^>]*>/) || [])[0];
  if (!chipName || !chipLoc || !chipImg || !finalLayer) throw new Error('master: hero chip or chosen reel layer not found');
  const attr = (tag, a) => (tag.match(new RegExp(`${a}="([^"]*)"`)) || [])[1] || '';
  const surname = chipName.replace(/^The\s+/i, '').replace(/\s+Family$/i, '');
  const DEFAULT_STORY = {
    family: chipName,                                    // "The Gallagher Family"
    short: `the ${surname}s`,                            // "the Gallaghers"
    possessive: `the ${surname}s’`,                      // "the Gallaghers’"
    location: chipLoc,                                   // "Pelican Hill, Newport Beach"
    place: chipLoc.split(',').pop().trim(),              // "Newport Beach"
    avatar: chipImg,                                     // assets/avatar-gallagher.jpg
    heroPhoto: (BASE_PAGE.match(/<div class="hero-photo" style="background-image:url\('([^']+)'\)/) || [])[1] || 'video/hero-poster.jpg',
    photoDir: 'viz-photos',
    before: 'base.webp',
    after: (attr(finalLayer, 'style').match(/viz-photos\/([^']+)'/) || [])[1] || 'scheme-organic.jpg',
    chosen: {
      name: attr(finalLayer, 'data-nm'), colors: attr(finalLayer, 'data-co'),
      body: attr(finalLayer, 'data-sw'), trim: attr(finalLayer, 'data-trim'), accent: attr(finalLayer, 'data-accent')
    },
    schemeCount: 11,
    placeholder: true
  };

  const storyOf = (c) => {
    const s = { ...DEFAULT_STORY, ...(c.story || {}) };
    s.chosen = { ...DEFAULT_STORY.chosen, ...((c.story || {}).chosen || {}) };
    return s;
  };

  const isMaster = (c) => !!(c && c.master && c.master.hero && c.master.hero.h1);
  const isCity = (c) => !c.city && (CITIES.cities || []).some(x => x.slug === c.slug);
  const where = (c) => isCity(c)
    ? { community: c.name, city: c.name, citySlug: c.slug, path: `/${c.slug}/` }
    : { community: c.name, city: cityOf(c).name, citySlug: cityOf(c).slug, path: `/${cityOf(c).slug}/${c.slug}/` };

  const cap = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1);
  const rate = () => `$${Number(CFG.startingRate).toFixed(2)}`;

  /* Tokens a localized string may use. Anything else in braces fails the
     build — a stray {token} would otherwise print on the page. */
  function tok(str, c) {
    if (str == null) return '';
    const s = storyOf(c), w = where(c);
    const map = {
      family: s.family, they: s.short, They: cap(s.short), their: s.possessive, Their: cap(s.possessive),
      location: s.location, place: s.place, schemes: String(s.schemeCount), chosen: s.chosen.name,
      community: w.community, city: w.city,
      phone: CFG.phone, warranty: CFG.warranty, rate: rate()
    };
    const out = String(str).replace(/\{([A-Za-z]+)\}/g, (m, k) => {
      if (!(k in map)) throw new Error(`${c.slug}: unknown token {${k}} in localized copy — allowed: ${Object.keys(map).join(', ')}`);
      return map[k];
    });
    return out;
  }

  /* Every picture of the family's house comes from story.photoDir, which
     defaults to the master's own folder. A new family = a new folder with
     the same file names. */
  function storyPhotos(html, c) {
    const s = storyOf(c);
    return html.replace(/(url\('|src="|data-src=")viz-photos\//g, `$1${A}/${s.photoDir}/`);
  }
  /* Alt text names the scheme AND its Sherwin-Williams colors — the render
     is the whole differentiator, so its description is the keyword surface. */
  function enrichAlt(html, c) {
    const s = storyOf(c);
    return html
      .replace(/(<button type="button" class="pkg-thumb"[\s\S]*?data-nm="([^"]+)" data-co="([^"]+)"[\s\S]*?alt=")[^"]*(")/g,
        (m, pre, nm, co, post) => `${pre}${s.place} home exterior rendered in the ${nm} scheme — Sherwin-Williams ${co.replace(/ &middot; /g, ' and ')}${post}`)
      .replace(/(<figure class="pkg-hero"[\s\S]*?data-nm="([^"]+)"\s*data-co="([^"]+)"[\s\S]*?alt=")[^"]*(")/,
        (m, pre, nm, co, post) => `${pre}${s.place} home exterior rendered in the ${nm} scheme — Sherwin-Williams ${co.replace(/ &middot; /g, ' and ')}${post}`);
  }

  const chip = (c, subLine) => {
    const s = storyOf(c);
    return `<div class="pill-wrap pill-wrap-lede">
        <div class="avatar-pill"><div class="ph"><img src="${A}/${s.avatar}" alt="" width="480" height="480" loading="lazy" decoding="async"/></div>
          <div><div class="name">${esc(s.family)}</div>
          <div class="sub-line">${subLine}</div></div></div>
      </div>`;
  };
  const M = (c, k) => (c.master || {})[k];

  /* ============================================================
     FIXED: the story hero — the master's own shape. The family's chip
     opens it, the H1 is localized, the three beats and the reel are
     the master's, the reel ends on the family's chosen scheme.
     ============================================================ */
  function hero(c) {
    const s = storyOf(c), h = M(c, 'hero');
    let fig = X.figure
      .replace(/viz-photos\/base\.webp/, `viz-photos/${s.before}`)
      .replace(/<div class="hr-cand final"[^>]*><\/div>/, () =>
        `<div class="hr-cand final" data-nm="${s.chosen.name}" data-co="${s.chosen.colors}" data-sw="${s.chosen.body}" data-trim="${s.chosen.trim}" data-accent="${s.chosen.accent}" data-chosen="1" style="background-image:url('viz-photos/${s.after}')" role="img" aria-label="${esc(s.place)} home exterior rendered in ${s.chosen.name} — ${s.chosen.colors.replace(/ &middot; /g, ' with ')}."></div>`)
      .replace(/aria-label="The Gallaghers’ Newport Beach home before repainting, unpainted\."/, `aria-label="${esc(cap(s.possessive))} ${esc(s.place)} home before repainting."`)
      .replace(/Newport Beach estate exterior rendered in/g, `${esc(s.place)} home exterior rendered in`)
      .replace(/<figcaption class="hr-caption">[\s\S]*?<\/figcaption>/, `<figcaption class="hr-caption">
          <img class="hr-cap-face" src="${A}/${s.avatar}" alt="${esc(s.family)}, ${esc(s.location)}" width="480" height="480" loading="lazy" decoding="async"/>
          <span class="hr-cap-line">${esc(cap(s.short))} saw their ${esc(s.place)} home
            in all <b>${s.schemeCount}</b> color schemes. These <b>4</b> are a quick preview.</span>
        </figcaption>`);
    fig = storyPhotos(fig, c);
    return `
  <section class="hero hero-cinema" id="hero" data-story>
    <div class="hero-photo" style="background-image:url('${A}/${s.heroPhoto}')"></div>
    <div class="hero-scrim"></div>
    <div class="hero-goldframe" aria-hidden="true"></div>

    <div class="hero-stack" id="heroStack">
      <div class="hero-fleuron" aria-hidden="true">&#10087;</div>
      <div class="eyebrow eyebrow-ruled">${tok(h.eyebrow || `${where(c).community} Luxury Home Painting`, c)}</div>
      ${chip(c, esc(s.location))}
      <h1 class="ttl-hero">${tok(h.h1, c)}</h1>
      ${X.beats}
      ${fig}
      <a class="hero-continue" href="#viz">
        <span class="hc-rule" aria-hidden="true"></span>
        <span class="hc-txt">${tok(h.continue || 'Continue their journey with home painting visualizations', c)}</span>
        <span class="hc-arrow" aria-hidden="true">&#8595;</span>
      </a>
    </div>
  </section>`;
  }

  /* ============================================================
     ROTATING MODULES — each renders '' until its copy exists.
     Signature matches MODULE_BUILDERS: (c, no, bg, H). The position
     background (bg) is deliberately ignored: each section keeps the ground
     it has on the master, so a navy slot can never land white type on cream.
     ============================================================ */

  /* 1 · They visualized it — the schemes they passed on, ending on the
     one that went on the house. Cards are built by the master's reel
     script from the extracted <template>. */
  function eliminated(c) {
    const b = M(c, 'eliminated'); if (!b || !b.h2) return '';
    const s = storyOf(c);
    return `
  <section class="cand-band" id="candidates" data-story>
    <span class="cand-ghost" aria-hidden="true">VISUALIZED</span>
    <div class="cand-head">
      ${chip(c, tok(b.chipLine || `Their remaining ${s.schemeCount - 4} schemes`, c))}
      <div class="eyebrow">${tok(b.eyebrow || 'They Visualized It', c)}</div>
      <h2>${tok(b.h2, c)}</h2>
      ${b.lead ? `<p class="cand-lead">${tok(b.lead, c)}</p>` : ''}
    </div>
    ${storyPhotos(X.band, c)}
    <div class="cand-track" id="candTrack"></div>
    <p class="cand-swipe">Swipe to see them all &rarr;</p>
  </section>`;
  }

  /* What usually happens instead — the floodlight on the problem, aimed
     at the CAREFUL buyer. The "already tried" list is the master's. */
  function instead(c) {
    const b = M(c, 'instead'); if (!b || !b.h2) return '';
    return `
  <section class="cand-band cand-band-solo" id="instead" data-story>
    <div class="fl-head">
      <div class="eyebrow">${tok(b.eyebrow || 'What Usually Happens Instead', c)}</div>
      <h2>${tok(b.h2, c)}</h2>
      ${b.bridge ? `<p class="fl-bridge">${tok(b.bridge, c)}</p>` : ''}
    </div>
    ${b.lede ? `<p class="fl-lede">${tok(b.lede, c)}</p>` : ''}
    ${X.tried}
    ${b.turn ? `<p class="fl-turn">${tok(b.turn, c)}</p>` : ''}
  </section>`;
  }

  /* 3 things to settle before a gallon is opened — the master's three
     demonstrations, each a swipe on the family's own house. */
  function settle(c) {
    const b = M(c, 'settle'); if (!b || !b.h2) return '';
    return `
  <section class="cand-band cand-band-solo" id="settle" data-story>
    <div class="reasons-head">
      <div class="eyebrow">${tok(b.eyebrow || 'Before You Choose', c)}</div>
      <h2>${tok(b.h2, c)}</h2>
      ${b.lead ? `<p class="reasons-lead">${tok(b.lead, c)}</p>` : ''}
    </div>
    ${rewriteAssetPaths(storyPhotos(X.reasons, c))}
  </section>`;
  }

  /* The package caption says whose house the eleven renders are. It must
     follow the story block, or a swapped family would sit under a line
     naming the old one. */
  if (!/<span class="pkg-yours">This one belongs to [^<]+?\./.test(X.pkg)) throw new Error('master: package caption "This one belongs to…" not found — update offer() in master-modules.js');
  const pkgFor = (c) => {
    const s = storyOf(c);
    return X.pkg.replace(/(<span class="pkg-yours">)This one belongs to [^<]+?\./,
      `$1This one belongs to ${esc(s.short)} in ${esc(s.place)}.`);
  };

  /* The offer, stated — Suby's Godfather step. The package shot, the
     $329 value anchor, the stack and the one action are the master's. */
  function offer(c) {
    const b = M(c, 'offer'); if (!b || !b.h2) return '';
    return `
  <section class="cand-band cand-band-solo" id="offer" data-story>
    <div class="cand-foot offer-stake">
      <div class="eyebrow">${tok(b.eyebrow || 'What You Get', c)}</div>
      <h2 class="os-ttl">${tok(b.h2, c)}</h2>
      ${b.sub ? `<p class="os-sub">${tok(b.sub, c)}</p>` : ''}
      ${enrichAlt(storyPhotos(pkgFor(c), c), c)}
      ${X.anchor}
      ${X.stack}
      ${X.osDo}
      <a href="#viz" class="btn-gold"><span class="col-2"><span>See Your Home In Every Color</span><span class="sub">Complimentary &middot; Itemized estimate included</span></span></a>
    </div>
  </section>`;
  }

  /* 3 · Then we painted it — the three steps, each a swipe. */
  function painted(c, no, bg) {
    const b = M(c, 'painted'); if (!b || !b.h2) return '';
    return `
  <section id="process" data-story>
    <div class="process-head">
      <div class="eyebrow">${tok(b.eyebrow || 'Then We Painted It', c)}</div>
      <h2 class="ttl">${tok(b.h2, c)}</h2>
      ${b.sub ? `<p class="sub">${tok(b.sub, c)}</p>` : ''}
    </div>
    ${rewriteAssetPaths(storyPhotos(X.steps, c))}
  </section>`;
  }

  /* The seal is drawn in type, not lifted from the master. The master's
     seal image (assets/badges/vip-warranty-laurel-web.png) has
     "OUR INSANE 1-YEAR WARRANTY" baked into the pixels: the wrong length
     (the warranty is 2 years, config.warranty) and a hype word. A length
     typed into a picture cannot follow config, so no generated page uses
     one; the words below come from config and change with it. */
  function warrantySeal() {
    const w = String(CFG.warranty || '').trim();
    const m = w.match(/^(.*?)\s*warranty$/i);
    const term = m ? m[1] : w;
    return `<div class="warranty-seal"><div class="seal-type" role="img" aria-label="VIP Home Painting ${esc(w)} seal">
        <span class="seal-term">${esc(term)}</span>
        <span class="seal-word">Warranty</span>
        <span class="seal-rule"></span>
        <span class="seal-sub">Labor &amp; Materials</span>
      </div></div>`;
  }

  /* Risk reversal. Built here rather than extracted: the warranty length
     must come from config, never from typed text. */
  function warranty(c, no, bg) {
    const b = M(c, 'warranty'); if (!b || !b.h2) return '';
    return `
  <section id="warranty" data-story>
    <div class="warranty-section">
      <div>
        <div class="eyebrow">${tok(b.eyebrow || 'Written, Not Promised', c)}</div>
        <h2 class="ttl">${tok(b.h2, c)}</h2>
        ${b.body ? `<p class="body">${tok(b.body, c)}</p>` : ''}
        <ul class="checks-row" style="margin-top: 20px;">
          <li>${CFG.warranty} on Labor &amp; Materials</li>
          <li>Licensed, Bonded &amp; Insured</li>
          <li>Written into your itemized estimate</li>
        </ul>
      </div>
      ${warrantySeal()}
    </div>
  </section>`;
  }

  /* What you get before you commit — the master's four pillars. */
  function beforeCommit(c, no, bg) {
    const b = M(c, 'beforeCommit'); if (!b || !b.h2) return '';
    return `
  <section class="cream-deep" id="before-you-commit">
    <div class="pillars-head">
      <div class="eyebrow">${tok(b.eyebrow || 'Before You Commit', c)}</div>
      <h2 class="ttl">${tok(b.h2, c)}</h2>
      ${b.lead ? `<p class="lead">${tok(b.lead, c)}</p>` : ''}
    </div>
    ${X.pillars}
  </section>`;
  }

  /* The one thing your neighbors see every day — benefits, not features.
     Each is a mechanism with its consequence (the master's list). */
  function neighbors(c, no, bg) {
    const b = M(c, 'neighbors'); if (!b || !b.h2) return '';
    return `
  <section id="benefits" data-story>
    <div class="wwd-benefits">
      <div class="wb-head">
        <div class="eyebrow">${tok(b.eyebrow || 'What It Buys You', c)}</div>
        <h2 class="ttl">${tok(b.h2, c)}</h2>
        ${b.sub ? `<p class="wb-sub">${tok(b.sub, c)}</p>` : ''}
      </div>
      ${X.wbList}
    </div>
  </section>`;
  }

  /* Testimonials — a signpost (no data-story), the master's own cards.
     Renders only when the page asks for it with a `testimonials` block. */
  function testimonials(c, no, bg) {
    const b = M(c, 'testimonials'); if (!b) return '';
    return `
  <section class="cream" id="reviews">
    <div class="testi-head">
      <div class="eyebrow">${tok(b.eyebrow || 'Testimonials', c)}</div>
      <h2 class="ttl">${tok(b.h2 || 'What Our <span class="accent">Clients</span> Are Saying', c)}</h2>
    </div>
    ${X.testi}
  </section>`;
  }

  /* Services — exterior, interior, cabinets, each linking to its own page. */
  function services(c, no, bg) {
    const b = M(c, 'services'); if (!b || !b.h2 || !Array.isArray(b.items) || b.items.length < 3) return '';
    const link = linker(where(c).path);
    const cards = SERVICES.slice(0, 3).map((svc, i) => {
      const it = b.items[i] || {};
      return `
      <div class="service">
        <div class="service-img" style="background-image:url('${SERVICE_IMGS[i]}')"></div>
        <div class="service-body"><h3>${tok(it.title || svc.name, c)}</h3><p>${tok(it.body || '', c)}</p><a class="svc-link" href="${link(`/${svc.slug}/`)}">${esc(svc.name)} details</a></div>
      </div>`;
    }).join('');
    return `
  <section class="cream-deep" id="services" data-story>
    <div class="services-head">
      <div class="eyebrow">${tok(b.eyebrow || `Our ${where(c).community} Residential Painting Services`, c)}</div>
      <h2 class="ttl">${tok(b.h2, c)}</h2>
    </div>
    <div class="services-grid">${cards}
    </div>
  </section>`;
  }

  /* Service area — a signpost. Up to the city, sideways to the siblings,
     out to the HOA page and the guide, plus the map and the NAP block. */
  function serviceArea(c, no, bg) {
    const b = M(c, 'serviceArea'); if (!b || !b.h2) return '';
    const w = where(c), link = linker(w.path);
    const city = (CITIES.cities || []).find(x => x.slug === w.citySlug) || {};
    const kids = (city.child_communities || []).filter(k => !String(k.url || '').endsWith(`/${c.slug}/`));
    const pillar = (BLOG.pillars || []).find(p => p.city_slug === w.citySlug);
    const q = encodeURIComponent(isCity(c) ? `${w.city}, CA` : `${w.community}, ${w.city}, CA`);
    return `
  <section class="cream" id="service-areas">
    <div class="areas-head">
      <div class="eyebrow">${tok(b.eyebrow || 'Where We Work', c)}</div>
      <h2 class="ttl">${tok(b.h2, c)}</h2>
      ${b.lead ? `<p class="lead">${tok(b.lead, c)}</p>` : ''}
    </div>
    <div class="city-hubs city-hubs-single">
      <div class="city-hub">
        <a class="ch-head" href="${link(`/${w.citySlug}/`)}">
          <span class="ch-name">${esc(w.city)}</span>
          <span class="ch-go">View ${esc(w.city)} painting &rarr;</span>
        </a>
        <div class="ch-label">${isCity(c) ? 'Communities we paint' : 'Neighboring communities we paint'}</div>
        <div class="ch-links">
          ${kids.map(k => `<a href="${link(k.url)}">${esc(k.name)}</a>`).join('\n          ')}
        </div>
        <div class="ch-foot">
          ${city.hoa_page ? `<a href="${link(`/${w.citySlug}/${city.hoa_page.slug}/`)}">HOA &amp; Common-Area Painting</a>` : ''}
          ${pillar ? `<a href="${link(`/${w.citySlug}/${pillar.slug}/`)}">The ${esc(w.city)} Color Guide</a>` : ''}
          ${SERVICES.map(svc => `<a href="${link(`/${svc.slug}/`)}">${esc(svc.name)}</a>`).join('\n          ')}
        </div>
      </div>
    </div>
    <div class="map-grid" style="margin-top:40px;">
      <div class="map-embed">
        <iframe title="Map of ${esc(isCity(c) ? w.city : `${w.community}, ${w.city}`)}, CA — VIP Home Painting service area" src="https://www.google.com/maps?q=${q}&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
      </div>
      <div class="nap-card">
        <div class="nap-name">${esc(CFG.businessName)}</div>
        <div class="nap-line" style="font-family:var(--font-serif); font-style:italic; color:var(--gold-deep);">Service-area painting company · based in Anaheim, CA</div>
        <div class="nap-line"><b>Phone:</b> <a href="${CFG.phoneHref}">${CFG.phone}</a></div>
        <div class="nap-line"><b>Email:</b> <a href="mailto:${CFG.email}">${CFG.email}</a></div>
        <div class="nap-line"><b>Hours:</b> Mon–Fri 8am–6pm · Sat 9am–3pm</div>
        <div class="nap-btns">
          <a class="btn-gold" href="${CFG.gbpUrl}" target="_blank" rel="noopener">See Us On Google</a>
        </div>
      </div>
    </div>
  </section>`;
  }

  /* ============================================================
     FIXED: the close — scope, founder byline, final CTA, then the
     P.S., which shuts the story frame on the family.
     ============================================================ */
  function close(c) {
    const b = M(c, 'close') || {};
    const w = where(c);
    if (!X.byline.includes('every Orange County homeowner')) throw new Error('master: byline wording changed — update close() in master-modules.js');
    const byline = rewriteAssetPaths(X.byline.replace('every Orange County homeowner', `every ${esc(w.community)} homeowner`));
    const ps = (b.ps || []).filter(Boolean);
    return `
  <section id="quote" data-story>
    ${X.scope}

    ${byline}

    <div class="final-cta">
      <div class="ck">${tok(b.kicker || `Ready To See Your ${w.community} Home First?`, c)}</div>
      ${b.h2 ? `<h2 class="ttl">${tok(b.h2, c)}</h2>` : ''}
      ${ctaButton('Get My Complimentary Quote Now', 'No Pressure · No Obligation · Always Complimentary')}
    </div>
    ${ps.length ? `
    <div class="ps-close">
      ${ps.map((p, i) => `<p>${i === 0 ? '<b>P.S.</b> &mdash; ' : ''}${tok(p, c)}</p>`).join('\n      ')}
      <p class="ps-cta"><a href="${CFG.phoneHref}">${CFG.phone}</a></p>
    </div>` : ''}
  </section>`;
  }

  /* The visualizer is the shared demonstration tool — always the master's
     own house. On a master-process page it sits right under the capsule,
     so the "2 ·" beat number (which only makes sense in the OC page's
     fixed order) comes off. */
  function vizAdjust(html) {
    return html.replace('<div class="eyebrow">2 &middot; Now It Is Your Turn</div>', '<div class="eyebrow">Now It Is Your Turn</div>');
  }

  /* The reel/package script writes some alt text at runtime. On a page
     whose family has been swapped, point it at their town. Soft replace on
     purpose: this is alt text for images the script swaps in, and a master
     rewording should not break the build. */
  function reelJs(js, c) {
    const s = storyOf(c);
    return js
      .split('The Gallaghers’ Newport Beach home before repainting, unpainted.').join(`${cap(s.possessive)} ${s.place} home before repainting.`)
      .split("'Newport Beach estate exterior rendered in '").join(`'${s.place} home exterior rendered in '`)
      .split("'A Newport Beach home rendered in the '").join(`'A ${s.place} home rendered in the '`)
      .split("'The same Newport Beach home in the '").join(`'The same ${s.place} home in the '`);
  }

  /* Structured data a master-process page adds to its @graph. */
  function jsonLdExtras(c, url, rendered, rateOffer) {
    const s = storyOf(c), w = where(c);
    const photo = (f) => `${CFG.siteBase}/orange-county-sales-page/${s.photoDir}/${f}`;
    const place = { '@type': 'Place', name: isCity(c) ? `${w.city}, CA` : `${w.community}, ${w.city}, CA` };
    const svc = (slug, name, extra) => ({
      '@type': 'Service', '@id': `${url}#service-${slug}`, name: `${name} in ${isCity(c) ? w.city : `${w.community}, ${w.city}`}`,
      serviceType: name, provider: { '@id': `${CFG.siteBase}/#business` }, areaServed: place,
      url: `${CFG.siteBase}/${slug}/`, ...(extra || {})
    });
    const nodes = [
      svc('exterior-painting', 'Exterior House Painting', { offers: rateOffer() }),
      svc('interior-painting', 'Interior House Painting'),
      svc('kitchen-cabinet-painting', 'Kitchen Cabinet Painting'),
      { '@type': 'ImageObject', '@id': `${url}#before`, contentUrl: photo(s.before),
        caption: `${cap(s.possessive)} ${s.place} home before repainting` },
      { '@type': 'ImageObject', '@id': `${url}#after`, contentUrl: photo(s.after),
        caption: `${cap(s.possessive)} ${s.place} home rendered in ${s.chosen.name} — Sherwin-Williams ${String(s.chosen.colors).replace(/ &middot; /g, ' and ')}` }
    ];
    if (rendered.includes('painted')) {
      const steps = [...X.steps.matchAll(/<div class="step-title">([\s\S]*?)<\/div><div class="step-desc">([\s\S]*?)<\/div>/g)];
      const clean = (t) => t.replace(/<[^>]+>/g, '').replace(/&mdash;/g, '—').replace(/&amp;/g, '&').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
      if (steps.length) nodes.push({
        '@type': 'HowTo', '@id': `${url}#howto`,
        name: `How ${w.community} homeowners see every exterior painting decision before it is permanent`,
        step: steps.map((m, i) => ({ '@type': 'HowToStep', position: i + 1, name: clean(m[1]), text: clean(m[2]) }))
      });
    }
    return nodes;
  }

  /* Every picture a master-process page points at must exist — a swapped
     family whose folder is missing a file fails here, in plain English,
     instead of shipping a grey box. */
  function assertAssets(html, label) {
    const missing = new Set();
    const markup = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<!--[\s\S]*?-->/g, '');
    const re = new RegExp(`(?:url\\('|src="|data-src=")${A.replace(/[.]/g, '\\.')}/([^'"?#)]+)`, 'g');
    for (const m of markup.matchAll(re)) {
      if (!fs.existsSync(path.join(OC_DIR, m[1]))) missing.add(m[1]);
    }
    if (missing.size) throw new Error(`${label}: these pictures do not exist in orange-county-sales-page/ — ${[...missing].slice(0, 6).join(', ')}${missing.size > 6 ? ` (+${missing.size - 6} more)` : ''}. If you swapped the family's photos, check the story block's photoDir, before and after.`);
  }

  /* The page-level copy on a master-process page — title, meta, the short
     answer, the visualizer lede, the FAQ and the problem cards — may use the
     same tokens as the modules. So the phone, warranty, rate and scheme count
     are read from config and the story block instead of being typed into the
     data, and a swapped family flows into the FAQ as well. Pages without a
     master block are returned untouched. */
  function resolve(c) {
    if (!isMaster(c)) return c;
    const t = (s) => (s == null ? s : tok(s, c));
    return {
      ...c,
      title: t(c.title), metaDescription: t(c.metaDescription),
      capsule: t(c.capsule), vizIntro: t(c.vizIntro),
      faqs: (c.faqs || []).map(f => ({ ...f, q: t(f.q), a: t(f.a) })),
      problems: (c.problems || []).map(p => ({ p: t(p.p || p.problem), s: t(p.s || p.solution) }))
    };
  }

  const MODULES = { eliminated, instead, settle, offer, painted, warranty, beforeCommit, neighbors, testimonials, services, serviceArea };

  return { MODULES, hero, close, vizAdjust, reelJs, jsonLdExtras, assertAssets, isMaster, storyOf, tok, resolve, DEFAULT_STORY };
};
