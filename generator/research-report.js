#!/usr/bin/env node
/* ============================================================
   RESEARCH-REPORT — the findings, as a page you can look at

     node generator/research-report.js irvine
     node generator/research-report.js --all

   Writes research/{city}/REPORT.html.

   Why this exists: the research lands as JSON and markdown, which is
   the right storage and the wrong reading surface. Nobody — Fabian or
   an agent picking the cluster up cold — should have to reconstruct
   "what did we learn about Irvine" from a 900-line brief.

   Two rules this file follows, because the alternative is a report
   that lies politely:

     1. Everything on the page comes from the brief. Nothing is
        invented, and no number is rounded into a nicer one.
     2. Missing data is rendered LOUDLY, not skipped. A gap that
        disappears from the report is a gap nobody closes. Sections
        with no data say so and name the file that would fill them.
   ============================================================ */

const fs = require('fs');
const path = require('path');
const { render } = require('./md-render.js');

const CFG = JSON.parse(fs.readFileSync(path.join(__dirname, 'communities.json'), 'utf8')).config;
const CITIES = JSON.parse(fs.readFileSync(path.join(__dirname, 'cities.json'), 'utf8'));

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const num = (n) => (n == null ? null : Number(n).toLocaleString('en-US'));
const money = (n) => (n == null ? null : '$' + Number(n).toLocaleString('en-US'));

/* Filenames are ordered for the filesystem, not for a reader. */
const DOC_LABELS = {
  '00-SUMMARY': 'Research summary',
  '01-market': 'Market',
  '02-local-pack': 'Local pack — Google Maps intel',
  '03-organic-competitors': 'Organic competitors',
  '04-keywords': 'Keywords',
  '05-communities': 'Communities',
  '06-hoa': 'HOA & property management',
  '07-VOICE': 'Buyer language',
};
const docLabel = (base) => DOC_LABELS[base]
  || base.replace(/^\d+[-_]?/, '').replace(/[-_]/g, ' ').replace(/^\w/, c => c.toUpperCase());

/* ---------- gather ---------- */
function load(city) {
  const briefPath = path.join(__dirname, 'briefs', `${city}.json`);
  const brief = fs.existsSync(briefPath)
    ? JSON.parse(fs.readFileSync(briefPath, 'utf8')) : null;
  const rec = (CITIES.cities || []).find(c => c.slug === city) || { slug: city, name: city };
  const dir = path.join(__dirname, 'research', city);
  const docs = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter(f => /\.md$/i.test(f)).sort().map(f => {
        const base = f.replace(/\.md$/i, '');
        return { file: f, base, label: docLabel(base),
                 text: fs.readFileSync(path.join(dir, f), 'utf8') };
      })
    : [];
  return { city, brief, rec, docs };
}

/* ---------- section helpers ---------- */
let SECTIONS = [];
const section = (title, body, opts = {}) => {
  const n = String(SECTIONS.length + 1).padStart(2, '0');
  const id = 's' + n;
  SECTIONS.push({ n, id, title, part: opts.part || 1, subs: opts.subs || [] });
  return `<section class="sec" id="${id}">
  <h2><span class="sn">${n}</span>${esc(title)}</h2>
  ${opts.lede ? `<p class="sec-lede">${opts.lede}</p>` : ''}
  ${opts.source ? `<p class="src-line">Source: <code>${esc(opts.source)}</code></p>` : ''}
  ${body}
</section>`;
};

/* A gap is a first-class citizen on this page, not an omission. */
const missing = (what, where) => `<div class="gap">
  <span class="gap-tag">Not researched yet</span>
  <p><b>${esc(what)}</b> is not in the brief. ${esc(where)}</p>
</div>`;

/* ---------- the review-count chart ----------
   The one visual that earns its place: it answers "can we compete"
   in about two seconds, which no table does. Pure CSS bars — no
   chart library, nothing to load, nothing to break. */
function reviewChart(pack, cityName) {
  const comps = (pack.top_competitors || []).filter(c => c.review_count != null);
  if (!comps.length) return '';
  const bar = pack.review_count_to_compete;
  const own = CFG.ownReviewCount;
  const max = Math.max(...comps.map(c => c.review_count), bar || 0, own || 0);
  const pct = (v) => Math.max(1.5, (v / max) * 100);

  const rows = comps.map(c => `
    <div class="br">
      <div class="br-l">${esc(c.name)}</div>
      <div class="br-t"><div class="br-f" style="width:${pct(c.review_count).toFixed(1)}%"></div></div>
      <div class="br-v">${num(c.review_count)}</div>
    </div>`).join('');

  const ownRow = own == null ? '' : `
    <div class="br is-own">
      <div class="br-l">VIP Home Painting <em>— today</em></div>
      <div class="br-t"><div class="br-f" style="width:${pct(own).toFixed(1)}%"></div></div>
      <div class="br-v">${num(own)}</div>
    </div>`;

  const barLine = bar == null ? '' : `
    <p class="chart-note"><b>${num(bar)}</b> is the number to be credible in the ${esc(cityName)} pack.
    VIP is at <b>${num(own)}</b> — a gap of <b>${num(bar - own)}</b>, which is a review programme, not a rebuild.</p>`;

  return `<div class="chart">
    <div class="chart-head">Google reviews — the competitive set</div>
    ${rows}${ownRow}
    ${barLine}
  </div>`;
}

/* ---------- build ---------- */
function build(city) {
  SECTIONS = [];
  const { brief, rec, docs } = load(city);
  const cityName = (brief && brief.city && brief.city.name) || rec.name || city;

  /* A city with research notes but no brief still gets Part II — that is
     exactly the state Anaheim is in, and hiding it helps nobody. */
  if (!brief && !docs.length) {
    return { html: null, reason: `no brief and no research/${city}/*.md` };
  }

  const C = (brief && brief.city) || {};
  const pack = C.local_pack || {};
  const market = C.market || {};
  const pricing = C.pricing || {};
  const kw = C.keywords || {};
  const meta = brief.meta || {};
  const comms = brief.communities || [];
  const comps = pack.top_competitors || [];

  /* --- headline numbers --- */
  const bar = pack.review_count_to_compete;
  const own = CFG.ownReviewCount;
  const topReviews = comps.length ? Math.max(...comps.map(c => c.review_count || 0)) : null;
  const anyViz = comps.some(c => c.offers_visualization);

  const stats = [
    comps.length ? [comps.length, 'competitors profiled'] : null,
    bar != null ? [bar, 'reviews to compete'] : null,
    own != null ? [own, 'VIP has today'] : null,
    comms.length ? [comms.length, 'communities mapped'] : null,
  ].filter(Boolean).map(([n, l]) =>
    `<div class="stat"><div class="sv">${esc(num(n))}</div><div class="sl">${esc(l)}</div></div>`).join('');

  /* --- 01 executive summary --- */
  const summaryBits = [];
  if (bar != null && topReviews != null) {
    summaryBits.push(`The bar in ${esc(cityName)} is <b>${num(bar)} reviews</b>, not the hundreds usually assumed —
      the strongest profiled competitor sits at <b>${num(topReviews)}</b>.`);
  }
  if (own != null && bar != null) {
    summaryBits.push(`VIP is at <b>${num(own)}</b>. That is a gap of <b>${num(bar - own)}</b>, closeable with a
      review programme rather than a rebuild.`);
  }
  if (pack.differentiator_gap) {
    summaryBits.push(`<b>The uncontested angle:</b> ${esc(pack.differentiator_gap)}`);
  }
  if (comps.length && !anyViz) {
    summaryBits.push(`Not one of the <b>${comps.length}</b> profiled competitors offers pre-paint
      visualization. That is measured, not assumed.`);
  }

  const s01 = section('Executive summary', `
    <div class="answer">
      <div class="answer-tag">The one-paragraph answer</div>
      ${summaryBits.map(b => `<p>${b}</p>`).join('')}
    </div>`);

  /* --- 02 the bar --- */
  const s02 = section('What it takes to compete',
    comps.length ? reviewChart(pack, cityName)
      : missing('The competitive review set', 'Run the Apify Maps discovery scrape — see COMPETITOR-RESEARCH-PLAYBOOK.md.'),
    { lede: 'Measure the bar before deciding it is out of reach. This is the number that decides whether the local pack is winnable at all.' });

  /* --- 03 the set --- */
  const table = comps.length ? `<div class="tw"><table>
    <thead><tr><th>Competitor</th><th class="r">Rating</th><th class="r">Reviews</th><th class="r">Photos</th><th>Visualization</th></tr></thead>
    <tbody>${comps.map(c => `<tr>
      <td><b>${esc(c.name)}</b>${c.primary_category ? `<span class="sub">${esc(c.primary_category)}</span>` : ''}</td>
      <td class="r">${c.rating != null ? esc(c.rating) : '—'}</td>
      <td class="r"><b>${c.review_count != null ? esc(num(c.review_count)) : '—'}</b></td>
      <td class="r">${c.photo_count != null ? esc(num(c.photo_count)) : '—'}</td>
      <td>${c.offers_visualization ? '<span class="yes">Yes</span>' : '<span class="no">None</span>'}</td>
    </tr>`).join('')}</tbody></table></div>` : missing('The competitive set', 'No profiled competitors in the brief.');

  const s03 = section('The competitive set', table + (pack.category_consensus ? `
    <p class="after">Category consensus — what the pack shares and VIP's GBP must carry:
      ${pack.category_consensus.map(c => `<code>${esc(c)}</code>`).join(' ')}</p>` : '') +
    (pack.gbp_posting_gap ? `<p class="after"><b>GBP posting gap:</b> ${esc(pack.gbp_posting_gap)}</p>` : ''));

  /* --- 04 the gap --- */
  const s04 = section('The uncontested gap', pack.differentiator_gap ? `
    <div class="pull">${esc(pack.differentiator_gap)}</div>
    <p class="after">This is the highest-value output of the study: a positioning claim with a
      count behind it. It is why every page in this cluster leads with visualization.</p>`
    : missing('The differentiator gap', 'Read the top 10 competitors\' categories and review tags and ask what is absent from all of them.'));

  /* --- 05 market --- */
  const mrows = [
    ['Median home value', money(market.median_home_value)],
    ['Home value range', market.home_value_low ? `${money(market.home_value_low)} – ${money(market.home_value_high)}` : null],
    ['Median household income', money(market.median_household_income)],
    ['Homes built', market.year_built_range],
    ['HOA prevalence', market.hoa_prevalence],
    ['Local market rate', market.market_rate_range ? `$${market.market_rate_range.low} – $${market.market_rate_range.high} / sq ft` : null],
    ['VIP exterior rate', pricing.exterior_rate_per_paintable_sqft ? `$${pricing.exterior_rate_per_paintable_sqft} / sq ft — ${esc(pricing.rate_positioning || '')}` : null],
  ].filter(r => r[1]);

  const s05 = section('Market and pricing', mrows.length ? `<dl class="kv">
    ${mrows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join('')}
    </dl>${pricing.typical_project_low == null ? `
    <div class="gap"><span class="gap-tag">Open</span><p>Typical project totals are
      <b>still null</b> — awaiting real VIP job data. Until they land, pricing copy says
      <em>starts at</em> and never quotes a project range.</p></div>` : ''}`
    : missing('Market data', 'Fill city.market in the brief.'));

  /* --- 06 communities, one card each ---
     The problem/solution pairs are the most reusable thing research
     produces, so they are shown in full rather than counted. */
  const commCards = comms.map(c => {
    const h = c.hoa || {};
    const probs = c.problems || [];
    const hoaLine = h.association_name
      ? `<span class="tag ok">${esc(h.association_name)}</span>`
      : `<span class="tag warn">Association unconfirmed</span>`;
    return `<article class="cc">
      <header>
        <h3>${esc(c.name)}</h3>
        ${hoaLine}
      </header>
      ${probs.length ? `<ol class="ps">${probs.map(p => `<li>
          <p class="p"><b>Problem</b> ${esc(p.p)}</p>
          <p class="s"><b>How we answer it</b> ${esc(p.s)}</p>
        </li>`).join('')}</ol>`
        : `<p class="after">No problem/solution pairs recorded yet.</p>`}
    </article>`;
  }).join('');

  const s06 = section('The communities', comms.length ? `
    <p class="after" style="margin-top:0">Community pages are the wedge because <b>no competitor has
      them</b>, and those SERPs are starved rather than merely competitive. Community terms report
      <b>zero volume</b> in every keyword tool — a measurement floor, not absent demand.
      <b>Never kill a community page on zero-volume data.</b></p>
    <div class="cards">${commCards}</div>`
    : missing('Communities', 'Fill the communities array in the brief.'),
    { lede: `${comms.length} communities researched. Each one's problem/solution pairs are what the page copy is built from — the problems are real failure modes in that community, not generic painting complaints.` });

  /* --- 07 HOA landscape --- */
  const H = brief.hoa || {};
  const mgmt = H.management_companies || [];
  const assoc = H.associations || [];
  const s07 = section('HOA landscape', (mgmt.length || assoc.length) ? `
    ${mgmt.map(m => `<div class="mgmt">
      <div class="mgmt-h"><b>${esc(m.name)}</b>${m.phone ? `<span class="mono">${esc(m.phone)}</span>` : ''}</div>
      ${m.manages && m.manages.length ? `<p class="after" style="margin-top:8px">Manages:
        ${m.manages.map(x => `<span class="chip sm">${esc(x)}</span>`).join(' ')}</p>` : ''}
      ${m.vendor_portal == null ? `<p class="after"><span class="tag warn">Vendor portal not located</span>
        — the route onto the approved-contractor list is still unknown.</p>` : ''}
    </div>`).join('')}
    ${assoc.length ? `<div class="tw"><table>
      <thead><tr><th>Association</th><th>Community</th><th class="r">Units</th><th>Manager</th></tr></thead>
      <tbody>${assoc.map(a => `<tr>
        <td><b>${esc(a.name || '—')}</b></td>
        <td>${esc(a.community || '—')}</td>
        <td class="r">${a.units != null ? esc(num(a.units)) : '—'}</td>
        <td>${esc(a.manager || '—')}</td>
      </tr>`).join('')}</tbody></table></div>` : ''}
    <p class="after">This is the B2B half. One management company holding five associations is a
      single relationship worth more than any individual homeowner page.</p>`
    : missing('HOA landscape', 'Run the HOA discovery recipe — research/_global/HOA-DISCOVERY-RECIPE.md.'));

  /* --- 08 harvested questions --- */
  const qs = kw.harvested_questions || [];
  const s08 = section('Questions real buyers asked', qs.length ? `
    <ul class="qs">${qs.map(q => `<li><span class="q">${esc(q.q)}</span><span class="src">${esc(q.source || '')}</span></li>`).join('')}</ul>
    <p class="after">Verbatim, from Google Business Q&amp;A and search. These go straight into the
      FAQ accordion and FAQPage schema — the visible text and the schema must match exactly,
      and the output gate checks that.</p>`
    : missing('Harvested questions', 'Pull GBP Q&A from the Apify detail-page scrape.'));

  /* --- 09 confidence and gaps --- */
  const gaps = meta.gaps || [];
  const s09 = section('Confidence and open gaps', `
    <p class="after">Brief confidence: <b class="conf conf-${esc(meta.confidence || 'unknown')}">${esc(meta.confidence || 'unknown')}</b>
      · researched ${esc((meta.researched_at || '').slice(0, 10))} by ${esc(meta.researched_by || '—')}</p>
    ${gaps.length ? `<ol class="gaps">${gaps.map(g => `<li>${esc(g)}</li>`).join('')}</ol>`
      : '<p class="after">No gaps recorded.</p>'}
    <p class="after"><b>Nothing above the line is published as fact unless it is verified.</b>
      A gap listed here is a reason to write around it, not to guess.</p>`);

  /* --- 10 sources --- */
  const src = meta.sources || {};
  const s10 = section('Sources and method', `
    <dl class="kv">${Object.entries(src).map(([k, v]) =>
      `<div><dt>${esc(k)}</dt><dd class="mono">${esc(v)}</dd></div>`).join('')}</dl>
    ${pack.dataset_id ? `<p class="after">Persistent Apify dataset — <b>re-pull free, do not re-scrape</b>:
      <code>${esc(pack.dataset_id)}</code>${pack.scraped_at ? ` · scraped ${esc(pack.scraped_at)}` : ''}</p>` : ''}
    ${hasResearchDir ? `<p class="after">Working notes: ${docs.map(d =>
      `<code>research/${esc(city)}/${esc(d)}</code>`).join(' ')}</p>` : ''}
    <p class="after">Method: <code>research/_global/COMPETITOR-RESEARCH-PLAYBOOK.md</code> ·
      Findings register: <code>research/_global/MEMORY.md</code></p>`);

  const body = [s01, s02, s03, s04, s05, s06, s07, s08, s09, s10].join('\n');
  const toc = SECTIONS.map(s =>
    `<li><a href="#${s.id}"><span>${s.n}</span>${esc(s.title)}</a></li>`).join('');

  const generated = new Date().toISOString().slice(0, 10);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${esc(cityName)} — Research Findings | VIP Home Painting</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Inter:wght@400;500;600;700&display=swap">
<style>
${STYLE}
</style>
</head>
<body>
<div class="wrap">

  <aside class="rail">
    <div class="rail-in">
      <div class="brand">
        <span class="bvip">VIP HOME PAINTING</span>
        <span class="btag">Visualize it. <b>See it.</b> Paint it.</span>
      </div>
      <p class="rail-k">Research report</p>
      <ol class="toc">${toc}</ol>
      <p class="rail-f">Generated ${esc(generated)}<br>from <code>briefs/${esc(city)}.json</code></p>
    </div>
  </aside>

  <main class="main">
    <header class="mast">
      <p class="eyebrow">Local SEO research · ${esc(cityName)}, ${esc(C.county || 'CA')}</p>
      <h1>What it takes to win <em>${esc(cityName)}</em>.</h1>
      <p class="lede">${bar != null && own != null
        ? `A measured read of the ${esc(cityName)} market: who is actually ranking, what it costs to be credible, and the one thing none of them offer. The bar is <b>${num(bar)} reviews</b>. VIP is at <b>${num(own)}</b>. The gap is a programme, not a rebuild.`
        : `A measured read of the ${esc(cityName)} market: who is actually ranking, and where the opening is.`}</p>
      <div class="stats">${stats}</div>
    </header>
    ${body}
    <footer class="foot">
      <p><b>How to read this.</b> Every number comes from the brief; nothing here is estimated.
      Where research has not been done, the section says so rather than going quiet — a gap that
      disappears from a report is a gap nobody closes.</p>
      <p class="mono">node generator/research-report.js ${esc(city)}</p>
    </footer>
  </main>

</div>
</body>
</html>`;

  return { html, cityName };
}

/* ---------- styling ---------- */
const STYLE = `
:root{
  --ink:#0D1130;--ink-2:#11163A;--surface:#161B40;--edge:#272D5C;
  --gold:#C9A961;--gold-bright:#E0C078;--gold-deep:#A88A47;
  --cream:#F5EFE2;--muted:#8B90B4;--ok:#5FBF8F;--warn:#D9A441;--stop:#D2715F;
  --serif:'Fraunces','Cormorant Garamond',Georgia,serif;
  --sans:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--ink);color:var(--cream);font-family:var(--sans);
  font-size:15.5px;line-height:1.62;-webkit-font-smoothing:antialiased}
h1,h2{font-family:var(--serif);font-weight:600;text-wrap:balance;margin:0}
p{margin:0}
code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12.5px;
  color:var(--gold-bright);background:rgba(201,169,97,.10);
  border:1px solid rgba(201,169,97,.24);border-radius:3px;padding:2px 7px}
.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12.5px}

.wrap{display:grid;grid-template-columns:274px 1fr;max-width:1280px;margin:0 auto;gap:0}

/* rail */
.rail{border-right:1px solid var(--edge);background:var(--ink-2)}
.rail-in{position:sticky;top:0;padding:30px 24px 40px}
.brand{display:flex;flex-direction:column;line-height:1;margin-bottom:34px}
.bvip{font-family:var(--serif);font-weight:700;font-size:15px;color:var(--gold-bright)}
.btag{font-size:9px;font-weight:600;color:var(--muted);margin-top:5px}
.btag b{color:var(--gold);font-weight:700}
.rail-k{font-size:10px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;
  color:var(--muted);margin-bottom:14px}
.toc{list-style:none;margin:0;padding:0;display:grid;gap:1px}
.toc a{display:grid;grid-template-columns:26px 1fr;gap:8px;align-items:baseline;
  text-decoration:none;color:var(--muted);font-size:13.5px;padding:6px 8px;
  border-radius:3px;border-left:2px solid transparent}
.toc a span{font-variant-numeric:tabular-nums;font-size:11px;color:var(--gold-deep);font-weight:700}
.toc a:hover{color:var(--cream);background:rgba(201,169,97,.07);border-left-color:var(--gold)}
.rail-f{margin-top:28px;font-size:11.5px;color:var(--muted);line-height:1.5}
.rail-f code{font-size:11px;padding:1px 5px}

/* main */
.main{padding:30px 44px 70px;min-width:0}
.mast{padding-bottom:34px;border-bottom:1px solid var(--edge);margin-bottom:12px}
.eyebrow{font-size:10.5px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;
  color:var(--gold);margin-bottom:16px}
.mast h1{font-size:clamp(32px,4.6vw,52px);line-height:1.05;letter-spacing:-.02em;margin-bottom:16px}
.mast h1 em{font-style:italic;color:var(--gold-bright)}
.lede{color:var(--muted);font-size:16px;max-width:66ch}
.lede b{color:var(--cream);font-weight:600}
.stats{display:flex;flex-wrap:wrap;gap:34px;margin-top:26px}
.sv{font-family:var(--serif);font-weight:700;font-size:29px;color:var(--gold-bright);
  line-height:1;font-variant-numeric:tabular-nums}
.sl{font-size:10.5px;font-weight:600;letter-spacing:.13em;text-transform:uppercase;
  color:var(--muted);margin-top:7px}

/* sections */
.sec{padding:36px 0;border-bottom:1px solid var(--edge)}
.sec:last-of-type{border-bottom:none}
.sec h2{font-size:25px;display:flex;align-items:baseline;gap:14px;margin-bottom:6px}
.sn{font-family:var(--sans);font-size:12px;font-weight:700;color:var(--gold-deep);
  font-variant-numeric:tabular-nums}
.sec-lede{color:var(--muted);font-size:15px;max-width:66ch;margin:8px 0 20px}
.after{color:var(--muted);font-size:14.5px;margin-top:16px;max-width:70ch}
.after b{color:var(--cream);font-weight:600}

.answer{background:var(--surface);border:1px solid var(--edge);border-left:3px solid var(--gold);
  border-radius:4px;padding:20px 22px;display:grid;gap:12px}
.answer-tag{font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--gold)}
.answer p{color:var(--muted);font-size:15px}
.answer b{color:var(--cream);font-weight:600}

.pull{font-family:var(--serif);font-size:20px;line-height:1.44;color:var(--cream);
  border-left:3px solid var(--gold);padding:4px 0 4px 20px}

/* chart */
.chart{background:var(--surface);border:1px solid var(--edge);border-radius:4px;padding:20px 22px}
.chart-head{font-size:10.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;
  color:var(--muted);margin-bottom:16px}
.br{display:grid;grid-template-columns:1fr 2.1fr 52px;gap:14px;align-items:center;padding:5px 0}
.br-l{font-size:13.5px;color:var(--cream);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.br-l em{color:var(--muted);font-style:normal}
.br-t{height:9px;background:rgba(139,144,180,.14);border-radius:2px;overflow:hidden}
.br-f{height:100%;background:linear-gradient(90deg,var(--gold-deep),var(--gold-bright));border-radius:2px}
.br-v{font-size:13px;font-variant-numeric:tabular-nums;color:var(--muted);text-align:right}
.br.is-own{margin-top:8px;padding-top:12px;border-top:1px dashed rgba(201,169,97,.34)}
.br.is-own .br-l{color:var(--gold-bright);font-weight:600}
.br.is-own .br-f{background:var(--stop)}
.br.is-own .br-v{color:var(--stop);font-weight:700}
.chart-note{margin-top:16px;font-size:14px;color:var(--muted)}
.chart-note b{color:var(--cream)}

/* table */
.tw{overflow-x:auto}
table{width:100%;border-collapse:collapse;min-width:560px}
th{text-align:left;font-size:10.5px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;
  color:var(--muted);padding:0 12px 10px;border-bottom:1px solid var(--edge)}
td{padding:12px;border-bottom:1px solid rgba(39,45,92,.6);font-size:14px;color:var(--muted)}
td b{color:var(--cream);font-weight:600}
th.r,td.r{text-align:right;font-variant-numeric:tabular-nums}
.sub{display:block;font-size:11.5px;color:var(--muted);margin-top:2px}
.yes{color:var(--ok);font-weight:600}
.no{color:var(--muted)}

/* kv */
.kv{display:grid;gap:1px;background:var(--edge);border:1px solid var(--edge);border-radius:4px;
  overflow:hidden;margin:0}
.kv>div{display:grid;grid-template-columns:210px 1fr;gap:16px;background:var(--surface);padding:11px 16px}
.kv dt{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold)}
.kv dd{margin:0;font-size:14px;color:var(--muted);word-break:break-word}

/* chips + questions */
.chips{display:flex;flex-wrap:wrap;gap:7px}
.chip{font-size:13px;color:var(--cream);background:rgba(201,169,97,.09);
  border:1px solid rgba(201,169,97,.26);border-radius:999px;padding:5px 13px}
.qs{list-style:none;margin:0;padding:0;display:grid;gap:1px;background:var(--edge);
  border:1px solid var(--edge);border-radius:4px;overflow:hidden}
.qs li{background:var(--surface);padding:11px 16px;display:flex;justify-content:space-between;
  gap:16px;align-items:baseline}
.qs .q{font-size:14.5px;color:var(--cream)}
.qs .src{font-size:11px;color:var(--muted);white-space:nowrap;letter-spacing:.06em;text-transform:uppercase}

/* gaps */
.gap{background:rgba(210,113,95,.08);border:1px solid rgba(210,113,95,.32);
  border-radius:4px;padding:15px 18px;margin-top:14px}
.gap-tag{display:inline-block;font-size:10px;font-weight:700;letter-spacing:.14em;
  text-transform:uppercase;color:var(--stop);margin-bottom:6px}
.gap p{font-size:14.5px;color:var(--muted)}
.gap b{color:var(--cream);font-weight:600}
.gaps{margin:14px 0 0;padding-left:20px;display:grid;gap:8px}
.gaps li{font-size:14.5px;color:var(--muted)}
.gaps li::marker{color:var(--stop);font-weight:700}
.conf{text-transform:capitalize}
.conf-high{color:var(--ok)}.conf-medium{color:var(--warn)}.conf-low{color:var(--stop)}

.foot{margin-top:36px;padding-top:22px;border-top:1px solid var(--edge);color:var(--muted);
  font-size:13.5px;display:grid;gap:10px}
.foot b{color:var(--cream)}

a:focus-visible,.toc a:focus-visible{outline:2px solid var(--gold-bright);outline-offset:2px}

@media (max-width:940px){
  .wrap{grid-template-columns:1fr}
  .rail{border-right:none;border-bottom:1px solid var(--edge)}
  .rail-in{position:static;padding:22px}
  .toc{grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:2px}
  .main{padding:26px 22px 56px}
  .kv>div{grid-template-columns:1fr;gap:3px}
}
@media print{
  body{background:#fff;color:#111}
  .rail{display:none}
  .wrap{grid-template-columns:1fr}
}
`;

/* ---------- cli ---------- */
const args = process.argv.slice(2);
const all = args.includes('--all');
const targets = all
  ? (CITIES.cities || []).map(c => c.slug)
  : args.filter(a => !a.startsWith('--'));

if (!targets.length) {
  console.log('\nusage: node generator/research-report.js <city> [city…]');
  console.log('       node generator/research-report.js --all\n');
  process.exit(1);
}

let wrote = 0, skipped = 0;
for (const city of targets) {
  const out = build(city);
  if (!out.html) {
    console.log(`  skip  ${city.padEnd(14)} ${out.reason}`);
    skipped++;
    continue;
  }
  const dir = path.join(__dirname, 'research', city);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'REPORT.html');
  fs.writeFileSync(file, out.html, 'utf8');
  console.log(`  ✓     ${city.padEnd(14)} research/${city}/REPORT.html  (${(out.html.length / 1024).toFixed(0)}KB)`);
  wrote++;
}
console.log(`\n${wrote} report(s) written${skipped ? `, ${skipped} skipped` : ''}.\n`);
