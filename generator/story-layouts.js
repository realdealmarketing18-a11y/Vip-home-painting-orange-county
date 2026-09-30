/* ============================================================
   STORY LAYOUTS — five ways to tell the same client story.

   A page opts in with one field in its data record:

       "storyLayout": "D"          (communities.json or cities.json)

   and, optionally, which of the layout's optional add-in modules it
   carries:

       "layoutOptions": ["offer"]

   Everything else about the page — title, meta, canonical, schema,
   robots, the H1, the FAQ — is read from the same record as before.
   A page WITHOUT storyLayout renders exactly as it did before this
   file existed; nothing here runs for it.

   Each layout is a fixed SEQUENCE of story beats (slots). A slot holds
   one or more section modules; a module flagged `opt` renders only on
   pages that list it in layoutOptions. That is how several pages share
   one story sequence and still carry different section orders, which
   the doorway-page guard in generate.js (validate) insists on.

   Localized words live in the page's `master` block (the same block the
   master-process modules read). New blocks this file reads:
     master.hero.deck      the layout's story line under the H1
     master.viz            { h2, sub, lede }   visualizer intro overrides
     master.flashback      Layout B · years in the same color
     master.timeline       Layouts B/E · the days, dated as placeholders
     master.nearMiss       Layout D · near-miss No. 1 in the "5 ways" list
     master.dusk           Layout F · noon vs dusk, the scale of the grounds
     master.palette        Layouts C/F · the designer palette as paint cans
     master.proof          Layouts B/F · the family's before/after + more families
     master.faq            { h2 }       FAQ heading override
     master.specs / master.process / master.communities / master.costOfWrong /
     master.hoaBlock / master.pricingBlock / master.spotlightBlock / master.mapBlock
                           heading overrides for reused sections

   Every placeholder is fenced in the built HTML so Fabian can find it:
     <!-- SWAP:CLIENT -->  client-specific story      <!-- /SWAP:CLIENT -->
     <!-- SWAP:LOCAL -->   local-problem copy          <!-- /SWAP:LOCAL -->
     <!-- SWAP:FAQ -->     the FAQ block               <!-- /SWAP:FAQ -->
     <!-- SWAP:VIZCOPY --> shared visualizer copy      <!-- /SWAP:VIZCOPY -->
   Directly after each opening marker sits a second comment naming the
   data file and field to edit. SWAP-CHECKLIST.md is built from those.
   ============================================================ */

module.exports = function makeStoryLayouts(ctx) {
  const { CFG, esc, MASTER, MODULE_BUILDERS, CITY_MODULES, CITIES, cityOf,
          vizSection, ctaButton, CORE_COLORS } = ctx;
  const A = CFG.assetBase;

  /* ---------------- THE FIVE LAYOUTS ----------------
     Slot = one story beat. { m: module, swap: marker kind, opt: add-in }.
     Hero, capsule, FAQ and the close (founder + CTA + P.S.) are fixed
     around the slots on every layout. */
  const LAYOUTS = {
    B: {
      name: 'The Reveal', hint: 'starts at the ending, then flashes back',
      slots: [
        [{ m: 'flashback', swap: 'CLIENT' }, { m: 'cost_of_wrong', swap: 'LOCAL' }],
        [{ m: 'instead', swap: 'LOCAL' }],
        [{ m: 'eliminated', swap: 'CLIENT' }],
        [{ m: 'timeline', swap: 'CLIENT' }],
        [{ m: 'viz' }],
        [{ m: 'communities' }, { m: 'hoa' }],
        [{ m: 'pricing' }, { m: 'warranty' }],
        [{ m: 'proof', swap: 'CLIENT' }, { m: 'reviews_map' }]
      ]
    },
    C: {
      name: 'The Villain', hint: 'the local condition is the enemy',
      slots: [
        [{ m: 'spotlight', swap: 'LOCAL' }],
        [{ m: 'cost_of_wrong', swap: 'LOCAL' }],
        [{ m: 'eliminated', swap: 'CLIENT' }],
        [{ m: 'viz' }],
        [{ m: 'reviews_map' }],
        [{ m: 'communities' }],
        [{ m: 'pricing' }, { m: 'hoa' }, { m: 'palette' }, { m: 'process' }]
      ]
    },
    D: {
      name: 'The Near-Miss', hint: 'one signature away from painting twice',
      slots: [
        [{ m: 'problems', swap: 'LOCAL' }, { m: 'instead', swap: 'LOCAL', opt: 'instead' }],
        [{ m: 'eliminated', swap: 'CLIENT' }],
        [{ m: 'viz' }, { m: 'offer', swap: 'CLIENT', opt: 'offer' }],
        [{ m: 'neighbors', swap: 'LOCAL' }],
        [{ m: 'painted', swap: 'CLIENT' }, { m: 'warranty' }],
        [{ m: 'beforeCommit' }],
        [{ m: 'services' }, { m: 'serviceArea' }]
      ]
    },
    E: {
      name: 'The Approval', hint: 'approved on the first submission',
      faqWeight: 'hoa',
      slots: [
        [{ m: 'instead', swap: 'LOCAL' }],
        [{ m: 'offer', swap: 'CLIENT' }, { m: 'eliminated', swap: 'CLIENT', opt: 'eliminated' }],
        [{ m: 'timeline', swap: 'CLIENT' }],
        [{ m: 'viz' }],
        [{ m: 'warranty' }, { m: 'beforeCommit', opt: 'beforeCommit' }],
        [{ m: 'services', opt: 'services' }, { m: 'serviceArea' }]
      ]
    },
    F: {
      name: 'The Dusk Walk', hint: 'the property at noon, then at dusk',
      vizOrder: ['light', 'color', 'siding', 'premium'],
      slots: [
        [{ m: 'dusk', swap: 'LOCAL' }],
        [{ m: 'viz' }],
        [{ m: 'specs' }],
        [{ m: 'palette' }],
        [{ m: 'proof', swap: 'CLIENT' }, { m: 'neighbors', swap: 'LOCAL', opt: 'neighbors' }],
        [{ m: 'problems', swap: 'LOCAL' }, { m: 'process' }, { m: 'warranty', opt: 'warranty' }],
        [{ m: 'serviceArea' }]
      ]
    }
  };

  const isLayout = (c) => !!(c && c.storyLayout);
  const isCity = (c) => !c.city && (CITIES.cities || []).some(x => x.slug === c.slug);
  const M = (c, k) => ((c.master || {})[k]) || null;
  const tok = (s, c) => MASTER.tok(s, c);
  const where = (c) => isCity(c)
    ? { community: c.name, city: c.name }
    : { community: c.name, city: cityOf(c).name };

  function layoutOf(c) {
    const L = LAYOUTS[c.storyLayout];
    if (!L) throw new Error(`${c.slug}: storyLayout "${c.storyLayout}" is not one of ${Object.keys(LAYOUTS).join(', ')}`);
    return L;
  }

  /* The page's resolved section list, slot by slot. */
  function resolveSlots(c) {
    const L = layoutOf(c);
    const opts = new Set(c.layoutOptions || []);
    for (const o of opts) {
      if (!L.slots.some(s => s.some(e => e.opt === o))) {
        throw new Error(`${c.slug}: layoutOptions has "${o}", which layout ${c.storyLayout} does not offer`);
      }
    }
    return L.slots.map(s => s.filter(e => !e.opt || opts.has(e.opt)));
  }
  const resolveOrder = (c) => resolveSlots(c).flat().map(e => e.m);

  /* ---------------- SWAP MARKERS ---------------- */
  const fileOf = (c) => isCity(c)
    ? `generator/cities.json › cities[slug=${c.slug}]`
    : `generator/communities.json › communities[slug=${c.slug}]`;
  function swap(kind, c, fields, html) {
    if (!html || !String(html).trim()) return '';
    return `\n  <!-- SWAP:${kind} --><!-- edit: ${fileOf(c)} › ${fields} -->${html}\n  <!-- /SWAP:${kind} -->`;
  }

  /* Which data fields feed each module — printed into the marker. */
  const FIELDS = {
    flashback: 'master.flashback (+ story block for the family)',
    cost_of_wrong: 'cost_of_wrong.title / cost_of_wrong.body (+ master.costOfWrong heading overrides)',
    instead: 'master.instead',
    eliminated: 'master.eliminated (+ story block: family, chosen scheme, photos)',
    timeline: 'master.timeline',
    proof: 'master.proof (+ story block: family, before/after photos)',
    spotlight: 'spotlight.title / spotlight.body (+ master.spotlightBlock)',
    problems: 'problems[] (local problems) · master.problemSolution.h2',
    offer: 'master.offer (+ story block)',
    neighbors: 'master.neighbors',
    painted: 'master.painted (+ story block)',
    dusk: 'master.dusk'
  };

  /* ---------------- SECTION BACKGROUNDS ----------------
     Reused legacy and city modules take a background class. Pick one
     that differs from the section just above, so two same-colour
     sections never sit back to back. */
  const BGS = ['', 'cream', 'cream-deep'];
  const bgOf = (html) => {
    const m = String(html).match(/<section class="([^"]*)"/g);
    if (!m) return '';
    const cls = m[m.length - 1].replace(/<section class="|"/g, '');
    return (cls.match(/\b(cream-deep|cream|navy-deep|navy)\b/) || [])[1] || '';
  };
  const nextBg = (prev) => BGS.find(b => b !== prev) || '';

  /* A reused section's heading can be localized from the data without
     touching the module: swap its first <h2 class="ttl">…</h2> (and,
     optionally, its eyebrow and lead). */
  function retitle(html, o) {
    if (!o || !html) return html;
    let out = html;
    if (o.h2) out = out.replace(/(<h2 class="ttl">)[\s\S]*?(<\/h2>)/, (m, a, b) => `${a}${o.h2}${b}`);
    if (o.eyebrow) out = out.replace(/(<div class="eyebrow[^"]*">)[\s\S]*?(<\/div>)/, (m, a, b) => `${a}${o.eyebrow}${b}`);
    if (o.lead) out = out.replace(/(<p class="lead"[^>]*>)[\s\S]*?(<\/p>)/, (m, a, b) => `${a}${o.lead}${b}`);
    if (o.story && !/data-story/.test(out.slice(0, out.indexOf('>') + 1))) out = out.replace(/<section /, '<section data-story ');
    return out;
  }
  const tokAll = (o, c) => o ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, typeof v === 'string' ? tok(v, c) : v])) : o;

  /* ============================================================
     NEW MODULES
     ============================================================ */

  /* Visualizer — movable, with its shared copy fenced and overridable. */
  function viz(c) {
    const L = layoutOf(c), w = where(c), v = M(c, 'viz') || {};
    const vizIntro = isCity(c) ? (c.seo && c.seo.viz_intro) : c.vizIntro;
    let html = MASTER.vizAdjust(vizSection({ slug: c.slug, name: c.name, vizIntro: tok(vizIntro, c) }));

    /* The shared intro: headline, localized lede and the four-decisions line. */
    const headRe = /(<div class="eyebrow">Now It Is Your Turn<\/div>)([\s\S]*?)(\n    <\/div>\n\n    <div class="viz-flow">)/;
    if (!headRe.test(html)) throw new Error(`${c.slug}: visualizer head markers not found — did the OC page change?`);
    html = html.replace(headRe, (m, eb, body, tail) => {
      let b = body;
      if (v.h2) b = b.replace(/(<h2 class="ttl">)[\s\S]*?(<\/h2>)/, (x, a, z) => `${a}${tok(v.h2, c)}${z}`);
      if (v.sub) b = b.replace(/(<p class="viz-lede-cta">)[\s\S]*?(<\/p>)/, (x, a, z) => `${a}${tok(v.sub, c)}${z}`);
      return `${eb}${swap('VIZCOPY', c, 'master.viz.h2 · ' + (isCity(c) ? 'seo.viz_intro' : 'vizIntro') + ' · master.viz.sub', b)}${tail}`;
    });

    /* Step Five's lede ("You have just repainted a Newport Beach estate…"). */
    html = html.replace(/(<p class="s5-lede">)([\s\S]*?)(<\/p>)/, (m, a, body, z) =>
      swap('VIZCOPY', c, 'master.viz.lede', `${a}${v.lede ? tok(v.lede, c) : body}${z}`));

    /* The form's first field is the community. Show this page's own. */
    const placeHint = isCity(c)
      ? `${((c.child_communities || [])[0] || {}).name || w.city}, ${w.city}`
      : `${w.community}, ${w.city}`;
    html = html.replace(/(<input id="s5Place"[^>]*placeholder=")[^"]*(")/, `$1${esc(placeHint)}$2`);
    if (L.faqWeight === 'hoa') {
      html = html.replace(/<label for="s5Place">Address or community<\/label>/, '<label for="s5Place">Your community (or address)</label>');
    }

    if (L.vizOrder) html = reorderSteps(html, L.vizOrder, c);
    return html;
  }

  /* Layout F: the steps run Lighting → Color → Texture → Finishing.
     The visualizer script finds every control by id and data-cat, never
     by position, so moving the blocks is enough; only the coins, the
     "Step One…" labels and the opening highlight are renumbered. */
  const WORD = ['One', 'Two', 'Three', 'Four'];
  function reorderSteps(html, order, c) {
    const start = html.indexOf('<!-- STEP 1');
    const endMark = '\n\n    <!-- ============ STEP FIVE';
    const end = html.indexOf(endMark);
    if (start < 0 || end < 0) throw new Error(`${c.slug}: visualizer step markers not found — cannot reorder steps`);
    const region = html.slice(start, end);
    const closeAt = region.lastIndexOf('\n      </div>\n    </div>');
    if (closeAt < 0) throw new Error(`${c.slug}: visualizer timeline close not found`);
    const inner = region.slice(0, closeAt), rest = region.slice(closeAt);
    /* blocks: step1, (link+step2), (link+step3), (link+step4) */
    const parts = inner.split(/(?=\n\n\n        <!-- Between the steps:)/);
    if (parts.length !== 4) throw new Error(`${c.slug}: expected 4 visualizer steps, found ${parts.length}`);
    const steps = parts.map(p => {
      const s = p.indexOf('<!-- STEP') >= 0 ? p.slice(p.indexOf('        <!-- STEP') >= 0 ? p.indexOf('        <!-- STEP') : p.indexOf('<!-- STEP')) : p;
      const cat = (s.match(/data-cat="([a-z]+)"/) || [])[1] || 'color';
      return { cat, html: s.replace(/^\s+/, '') };
    });
    const links = (M(c, 'viz') || {}).links || {};
    const LINK = {
      color: ['Light decided first. Now the color has to hold up under it.', 'A color that glows under your fixtures can go flat by day, which is why the palette is chosen after the lighting, not before.'],
      siding: ['Texture decides how the color behaves.', 'The same pigment on smooth stucco and on cedar shake is not the same color in your light.'],
      premium: ['The last decisions are the ones the road sees first.', 'A garage door faces the drive more squarely than any wall does, and it is the piece most owners leave to chance.']
    };
    const mark = `<img class="tl-link-mark" src="${A}/assets/logos/logo-brush-navy.png" alt=""
               width="128" height="294" loading="lazy" decoding="async"/>`;
    const out = order.map((cat, i) => {
      const st = steps.find(s => s.cat === cat);
      if (!st) throw new Error(`${c.slug}: visualizer has no step for "${cat}"`);
      let h = st.html
        .replace(/<div class="tl-step( active)?" data-step="\d">/, `<div class="tl-step${i === 0 ? ' active' : ''}" data-step="${i + 1}">`)
        .replace(/<div class="tl-dot">\d<\/div>/, `<div class="tl-dot">${i + 1}</div>`)
        .replace(/<div class="tl-num-label">Step (One|Two|Three|Four)/, `<div class="tl-num-label">Step ${WORD[i]}`);
      if (i === 0) return `        ${h}`;
      const [lead, sub] = links[cat] ? [tok(links[cat][0], c), tok(links[cat][1], c)] : LINK[cat];
      return `\n\n        <div class="tl-link">
          ${mark}
          <p class="tl-link-lead">${lead}</p>
          <p class="tl-link-sub">${sub}</p>
        </div>
        ${h}`;
    }).join('');
    return html.slice(0, start) + out + rest + html.slice(end);
  }

  /* B · Flashback — years in the same color, and why they waited. */
  function flashback(c) {
    const b = M(c, 'flashback'); if (!b || !b.h2) return '';
    const s = MASTER.storyOf(c);
    return `
  <section class="cream" id="flashback" data-story>
    <div class="sec-head">
      <div class="eyebrow">${tok(b.eyebrow || 'Before the Color', c)}</div>
      <h2 class="ttl">${tok(b.h2, c)}</h2>
      ${b.lead ? `<p class="lead">${tok(b.lead, c)}</p>` : ''}
    </div>
    <div class="lx-story">
      <div class="pill-wrap pill-wrap-lede">
        <div class="avatar-pill"><div class="ph"><img src="${A}/${s.avatar}" alt="" width="480" height="480" loading="lazy" decoding="async"/></div>
          <div><div class="name">${esc(s.family)}</div>
          <div class="sub-line">${tok(b.chipLine || 'Before anything changed', c)}</div></div></div>
      </div>
      ${(b.body || []).map(p => `<p class="body">${tok(p, c)}</p>`).join('\n      ')}
    </div>
  </section>`;
  }

  /* B/E · Timeline — the days, from the first day to the walkthrough. */
  function timeline(c) {
    const b = M(c, 'timeline'); if (!b || !b.h2 || !(b.days || []).length) return '';
    const rows = b.days.map((d, i) => `
      <div class="glove-step">
        <div class="glove-num">${i + 1}</div>
        <div>
          <div class="lx-day">${tok(d.label || `Day ${i + 1}`, c)}</div>
          <h3 class="glove-title">${tok(d.title, c)}</h3>
          <p class="glove-desc">${tok(d.body, c)}</p>
        </div>
      </div>`).join('');
    return `
  <section id="timeline" data-story>
    <div class="sec-head">
      <div class="eyebrow">${tok(b.eyebrow || 'The Days, In Order', c)}</div>
      <h2 class="ttl">${tok(b.h2, c)}</h2>
      ${b.lead ? `<p class="lead">${tok(b.lead, c)}</p>` : ''}
    </div>
    <div class="glove-steps">${rows}
    </div>
    ${b.note ? `<p class="lx-note">${tok(b.note, c)}</p>` : ''}
  </section>`;
  }

  /* D/F · Problems — "5 ways it goes wrong here". On a near-miss page the
     family's near-miss is No. 1, paired with the fix from the first local
     problem; the local problems follow, up to five cards in all. */
  function problems(c, bg) {
    const list = (c.problems || [])
      .map(ps => ({ p: ps.p || ps.problem, s: ps.s || ps.solution }))
      .filter(ps => ps.p && ps.s);
    const nm = M(c, 'nearMiss');
    const head = M(c, 'problemSolution') || {};
    const card = (lbl, p, sLbl, s, extra) => `
      <div class="ps-card${extra || ''}">
        <div class="ps-lbl problem">${lbl}</div>
        <p class="ps-p">${p}</p>
        <div class="ps-divider"></div>
        <div class="ps-lbl solution">${sLbl}</div>
        <p class="ps-s">${s}</p>
      </div>`;
    let cards = '';
    let rest = list;
    if (nm && nm.story) {
      const first = list[0] || { s: '' };
      cards += swap('CLIENT', c, 'master.nearMiss', card(tok(nm.label || 'No. 1 · The Near-Miss', c), tok(nm.story, c), tok(nm.fixLabel || 'What Caught It', c), tok(nm.fix || first.s, c), ' lx-near'));
      rest = list.slice(1);
    }
    const max = nm && nm.story ? 4 : 5;
    cards += rest.slice(0, max).map(ps => card('The Problem', tok(ps.p, c), 'The VIP Solution', tok(ps.s, c))).join('');
    if (!cards) return '';
    return `
  <section class="${bg}" id="fit" data-story>
    <div class="sec-head">
      <div class="eyebrow">${tok(head.eyebrow || `Made For ${c.name}`, c)}</div>
      <h2 class="ttl">${tok(head.h2 || `What Goes Wrong in ${c.name} — <span class="accent">and the Fix for Each</span>`, c)}</h2>
      ${head.lead ? `<p class="lead">${tok(head.lead, c)}</p>` : ''}
    </div>
    <div class="ps-grid">${cards}
    </div>
  </section>`;
  }

  /* F · The dusk walk — the property at noon, then after dark. */
  function dusk(c) {
    const b = M(c, 'dusk'); if (!b || !b.h2) return '';
    const s = MASTER.storyOf(c);
    const pane = (lbl, txt) => txt ? `
      <div class="ps-card">
        <div class="ps-lbl solution">${tok(lbl, c)}</div>
        <p class="ps-p">${tok(txt, c)}</p>
      </div>` : '';
    return `
  <section class="cream" id="dusk" data-story>
    <div class="sec-head">
      <div class="eyebrow">${tok(b.eyebrow || `Walk ${c.name} With ${MASTER.storyOf(c).short}`, c)}</div>
      <h2 class="ttl">${tok(b.h2, c)}</h2>
      ${b.lead ? `<p class="lead">${tok(b.lead, c)}</p>` : ''}
    </div>
    <div class="ps-grid">${pane(b.noonLabel || 'At Noon', b.noon)}${pane(b.duskLabel || 'At Dusk', b.dusk)}
    </div>
    ${b.scale ? swap('CLIENT', c, 'master.dusk.scale', `
    <div class="lx-story" style="margin-top:36px;">
      <div class="pill-wrap pill-wrap-lede">
        <div class="avatar-pill"><div class="ph"><img src="${A}/${s.avatar}" alt="" width="480" height="480" loading="lazy" decoding="async"/></div>
          <div><div class="name">${esc(s.family)}</div>
          <div class="sub-line">${tok(b.chipLine || 'Walking the property', c)}</div></div></div>
      </div>
      <p class="body">${tok(b.scale, c)}</p>
    </div>`) : ''}
  </section>`;
  }

  /* C/F · The designer palette — every colour as a three-can set (body,
     trim, accent), never a flat chip. The featured colour is the body can;
     the trim and accent cans are named beside it. */
  const TRIM = { name: 'Alabaster', code: 'SW 7008', hex: '#EDEAE0' };
  const TRIM_ALT = { name: 'Pure White', code: 'SW 7005', hex: '#EDECE6' };
  const ACC = { name: 'Iron Ore', code: 'SW 7069', hex: '#434341' };
  const ACC_ALT = { name: 'Urbane Bronze', code: 'SW 7048', hex: '#54504A' };
  const can = (hex) => `<span class="paint-can" style="--c:${hex}"></span>`;
  function palette(c, bg) {
    const b = M(c, 'palette') || {};
    let cards = '';
    if (isCity(c)) {
      const cols = (c.palette_baseline && c.palette_baseline.colors) || [];
      const role = (r) => cols.find(x => x.role === r);
      const body = role('main_body'), trim = role('trim'), acc = role('gable') || role('front_door'), door = role('front_door');
      if (!body || !trim || !acc) return '';
      const nm = (x) => `${esc(x.sw_name)} ${esc(x.sw_code)}`;
      cards = `
      <div class="swatch-card lx-can-card">
        <div class="paint-cans lx-cans">${can(body.hex)}${can(trim.hex)}${can(acc.hex)}</div>
        <div class="swatch-body">
          <div class="swatch-name">${tok(b.schemeName || `The ${c.name} Baseline`, c)}</div>
          <div class="swatch-code">Body ${nm(body)} · Trim ${nm(trim)} · Accent ${nm(acc)}</div>
          ${door && door !== acc ? `<p class="swatch-note">Door and iron: ${nm(door)}.</p>` : ''}
          ${c.palette_baseline.trend_note ? `<p class="swatch-note">${c.palette_baseline.trend_note}</p>` : ''}
        </div>
      </div>`;
    } else {
      const all = [...CORE_COLORS, ...(c.extraColors || [])]
        .filter((x, i, a) => a.findIndex(y => y.code === x.code) === i);
      cards = all.map(col => {
        const trim = col.code === TRIM.code ? TRIM_ALT : TRIM;
        const acc = col.code === ACC.code ? ACC_ALT : ACC;
        return `
      <div class="swatch-card lx-can-card">
        <div class="paint-cans lx-cans">${can(col.hex)}${can(trim.hex)}${can(acc.hex)}</div>
        <div class="swatch-body">
          <div class="swatch-name">${esc(col.name)}</div>
          <div class="swatch-code">Sherwin-Williams · ${esc(col.code)}</div>
          <p class="swatch-note">${col.note}</p>
          <p class="swatch-note lx-with">Shown as the body, with ${trim.name} ${trim.code} trim and ${acc.name} ${acc.code} accent.</p>
        </div>
      </div>`;
      }).join('');
    }
    const lead = b.lead || (isCity(c) ? c.color_guide_intro : (c.context && c.context.archNote)) || '';
    return `
  <section class="${bg}" id="colors">
    <div class="sec-head">
      <div class="eyebrow">${tok(b.eyebrow || 'The Designer Palette', c)}</div>
      <h2 class="ttl">${tok(b.h2 || `The ${c.name} Palette`, c)}</h2>
      ${lead ? `<p class="lead">${tok(lead, c)}</p>` : ''}
    </div>
    <div class="swatch-grid">${cards}
    </div>
    <div class="sec-head" style="margin:44px auto 0;">
      <p class="lead" style="font-family:var(--font-serif); font-style:italic; font-size:16.5px;">${tok(b.foot || 'Every palette here is rendered on <b>your own home</b> before you choose it — you approve a color you have already seen on the house, not a sample.', c)}</p>
    </div>
  </section>`;
  }

  /* B/F · Proof — the family's house before and in the scheme they chose,
     then any other families (a displaced hero client moves here). */
  function proof(c) {
    const b = M(c, 'proof'); if (!b || !b.h2) return '';
    const s = MASTER.storyOf(c);
    const photo = (f) => `${A}/${s.photoDir}/${f}`;
    const knob = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/><polyline points="9 18 15 12 9 6" transform="translate(12 0)"/></svg>';
    const g = b.family || {};
    const main = swap('CLIENT', c, 'master.proof.family (+ story block photos)', `
      <article class="case-card">
        <div class="pill-wrap"><div class="avatar-pill"><div class="ph"><img src="${A}/${s.avatar}" alt="" width="480" height="480" loading="lazy" decoding="async"/></div>
          <div><div class="name">${esc(s.family)}</div><div class="sub-line">${esc(s.location)}</div></div></div></div>
        <div style="text-align:center;"><div class="case-tag">${tok(g.tag || 'Home Exterior Painting', c)}</div></div>
        <h3 class="case-head">${tok(g.headline || `${MASTER.storyOf(c).short.replace(/^the /, 'The ')}: before, and in the scheme they chose`, c)}</h3>
        <div class="ba-frame">
          <div class="ba-cap">${tok(g.caption || '{chosen}', c)}</div>
          <div class="ba-img before" style="background-image: url('${photo(s.before)}')"></div>
          <div class="ba-img after"  style="background-image: url('${photo(s.after)}')"></div>
          <div class="ba-rail"><div class="ba-handle"><span class="pin top"></span><span class="pin bot"></span><div class="knob">${knob}</div></div></div>
          <div class="ba-label l">Before</div>
          <div class="ba-label r">Chosen</div>
        </div>
        ${g.story ? `<p class="drop">${tok(g.story, c)}</p>` : ''}
        ${(g.reason || g.strategy || g.mood) ? `<ul class="case-detail-list">
          ${g.reason ? `<li><div class="lbl">Reason</div><div class="val">${tok(g.reason, c)}</div></li>` : ''}
          ${g.strategy ? `<li><div class="lbl">Strategy</div><div class="val">${tok(g.strategy, c)}</div></li>` : ''}
          ${g.mood ? `<li><div class="lbl">Mood</div><div class="val">${tok(g.mood, c)}</div></li>` : ''}
        </ul>` : ''}
      </article>`);
    const more = (b.more || []).map((x, i) => swap('CLIENT', c, `master.proof.more[${i}]`, `
      <article class="case-card">
        <div class="pill-wrap"><div class="avatar-pill"><div class="ph">${esc(x.initials || '')}</div>
          <div><div class="name">${esc(x.name)}</div><div class="sub-line">${esc(x.location || '')}</div></div></div></div>
        <div style="text-align:center;"><div class="case-tag">${tok(x.tag || 'Home Exterior Painting', c)}</div></div>
        <h3 class="case-head">${tok(x.headline || '', c)}</h3>
        ${x.story ? `<p class="drop">${tok(x.story, c)}</p>` : ''}
      </article>`)).join('');
    return `
  <section class="navy" id="work" data-story>
    <div class="cases-head">
      <div class="eyebrow">${tok(b.eyebrow || `More ${where(c).city} Families`, c)}</div>
      <h2 class="ttl">${tok(b.h2, c)}</h2>
      ${b.lead ? `<p class="sub lx-proof-lead">${tok(b.lead, c)}</p>` : ''}
    </div>
    <div class="cases-grid${(b.more || []).length ? '' : ' lx-single'}">${main}${more}
    </div>
  </section>`;
  }

  const NEW = { viz, flashback, timeline, problems, dusk, palette, proof };

  /* Reused legacy / city modules, with optional heading overrides. */
  const OVERRIDE = {
    specs: 'specs', process: 'process', communities: 'communities', cost_of_wrong: 'costOfWrong',
    hoa: 'hoaBlock', pricing: 'pricingBlock', spotlight: 'spotlightBlock', reviews_map: 'mapBlock'
  };

  function renderModule(key, c, prevBg, H, cWithRel) {
    if (NEW[key]) return NEW[key](c, nextBg(prevBg));
    const city = isCity(c);
    const fn = (city && CITY_MODULES[key]) || MODULE_BUILDERS[key];
    if (!fn) throw new Error(`${c.slug}: layout ${c.storyLayout} uses module "${key}", which has no builder`);
    let html = fn(city ? cWithRel : c, 0, nextBg(prevBg), H);
    if (OVERRIDE[key]) html = retitle(html, tokAll(M(c, OVERRIDE[key]), c));
    return html;
  }

  /* The whole middle of the page: every slot, in order, fenced. */
  function render(c, H, cWithRel) {
    const slots = resolveSlots(c);
    const rendered = [];
    let prev = '';
    const out = slots.map((slot, i) => {
      const parts = slot.map(e => {
        const html = renderModule(e.m, c, prev, H, cWithRel);
        if (!html) return '';
        rendered.push(e.m);
        prev = bgOf(html);
        return e.swap ? swap(e.swap, c, FIELDS[e.m] || `master.${e.m}`, html) : html;
      }).join('\n');
      return parts ? `\n  <!-- ============ LAYOUT ${c.storyLayout} · BEAT ${i + 2} ============ -->${parts}` : '';
    }).join('\n');
    return { html: `\n  <div id="story" aria-hidden="true"></div>${out}`, rendered };
  }

  /* FAQ fence (and, on the approval layout, association questions first —
     visible order only; the FAQPage schema keeps the data order). */
  function faq(c, html) {
    const L = layoutOf(c);
    let out = html;
    const f = M(c, 'faq') || {};
    if (f.h2) out = out.replace(/(<h2 class="ttl">)[\s\S]*?(<\/h2>)/, (m, a, b) => `${a}${tok(f.h2, c)}${b}`);
    if (L.faqWeight === 'hoa') {
      const items = out.match(/\n      <details class="faq-item"[\s\S]*?<\/details>/g) || [];
      const hoa = (t) => /\b(HOA|association|approval|approved|design review|submission|submit)\b/i.test(t.replace(/<[^>]+>/g, ''));
      const sorted = [...items.filter(hoa), ...items.filter(t => !hoa(t))]
        .map((t, i) => t.replace(/<details class="faq-item"( open)?>/, `<details class="faq-item"${i === 0 ? ' open' : ''}>`));
      let k = 0;
      out = out.replace(/\n      <details class="faq-item"[\s\S]*?<\/details>/g, () => sorted[k++]);
    }
    return swap('FAQ', c, isCity(c) ? 'faqs[] (q, a) · master.faq.h2' : 'faqs[] (q, a) · master.faq.h2', out);
  }

  /* The close: the P.S. is the family's, so it is fenced. */
  function close(c, html) {
    return html.replace(/\n    <div class="ps-close">[\s\S]*?\n    <\/div>/, (m) => swap('CLIENT', c, 'master.close.ps[]', m));
  }

  /* The hero: the family chip and the layout's story line are fenced. */
  function hero(c, html) {
    const h = M(c, 'hero') || {};
    let out = html.replace(/(<div class="pill-wrap pill-wrap-lede">[\s\S]*?\n      <\/div>)/, (m) => swap('CLIENT', c, 'story (family, avatar, location)', m));
    /* The layout's story line sits under the H1 — the H1 itself (the
       page's keyword) is never rewritten by a layout. */
    if (h.deck) out = out.replace(/(<h1 class="ttl-hero">[\s\S]*?<\/h1>)/, (m) => `${m}${swap('CLIENT', c, 'master.hero.deck', `\n      <p class="hero-deck">${tok(h.deck, c)}</p>`)}`);
    return out.replace(/href="#viz"/, 'href="#story"');
  }

  return { LAYOUTS, isLayout, resolveOrder, render, faq, close, hero, swap };
};
