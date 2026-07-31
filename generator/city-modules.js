/* ============================================================
   CITY PAGE MODULES

   A city page is a HUB, not a seventh community page. Its job is
   different: send visitors down to the villages, carry the pricing
   story, hold the video, and own the map. So it gets its own module
   set rather than reusing the community modules.

   Every builder has the signature (c, no, bg, H) where:
     c  = the city object from cities.json
     no = section serial number (No. 03, No. 04 …)
     bg = section background class
     H  = helpers { CFG, ctaButton, secNo, esc }

   A module returns '' when its data is missing, so a half-filled
   brief renders a shorter page rather than a broken one. The
   validation gate is what enforces completeness.
   ============================================================ */

const M = {};

/* ---- 1 · THE COST OF GETTING IT WRONG — the emotional core ---- */
M.cost_of_wrong = (c, no, bg, H) => {
  const t = c.cost_of_wrong || {};
  if (!t.title && !t.body) return '';
  return `
  <section class="${bg}" id="cost-of-wrong">
    <div class="sec-head">
      <div class="sec-no">${H.secNo(no)}</div>
      <div class="eyebrow">The Real Cost of a Wrong Color</div>
      <h2 class="ttl">${t.title || ''}</h2>
    </div>
    <div class="cow-grid">
      <div class="cow-stat">
        <div class="cow-num">$4,000–$7,000</div>
        <div class="cow-lbl">what a typical exterior costs to paint <em>again</em></div>
      </div>
      <div class="cow-body">
        <p class="body">${t.body || ''}</p>
        <p class="cow-kicker">Almost nobody who regrets their color ever saw it on their own
        house first. That is the entire reason our visualization is complimentary.</p>
        ${H.ctaButton('Claim Complimentary Color Consultation', 'See it on your home before you commit')}
      </div>
    </div>
  </section>`;
};

/* ---- 2 · PRICING — itemized transparency, which competitors don't publish ---- */
M.pricing = (c, no, bg, H) => {
  const p = c.pricing || {};
  if (!p.cost_answer_sentence) return '';
  const mr = (c.market && c.market.market_rate_range) || null;
  const range = (p.typical_project_low && p.typical_project_high)
    ? `<div class="pr-range"><span class="pr-range-lbl">Most ${c.name} projects</span>
       <span class="pr-range-val">$${p.typical_project_low.toLocaleString()} – $${p.typical_project_high.toLocaleString()}</span></div>`
    : '';
  const included = [
    'Complimentary Custom Visualization',
    'Pressure wash &amp; stucco repair floated to match texture',
    'Sherwin-Williams Emerald &amp; Duration coating systems',
    'Graco &amp; Titan airless application, back-rolled on stucco',
    'HOA design-review submission package',
    '1-Year Warranty on labor &amp; materials'
  ].map(i => `<li>${i}</li>`).join('\n          ');

  return `
  <section class="${bg}" id="pricing">
    <div class="sec-head">
      <div class="sec-no">${H.secNo(no)}</div>
      <div class="eyebrow">What It Costs — In Writing</div>
      <h2 class="ttl">${c.name} Painting, <span class="accent">Priced Line by Line</span></h2>
      <p class="lead">${p.intro || p.cost_answer_sentence}</p>
    </div>
    <div class="pr-card">
      <div class="pr-head">
        <div class="pr-rate">$${p.exterior_rate_per_paintable_sqft}</div>
        <div class="pr-unit">per sq ft of paintable surface<br/><em>exterior, starting</em></div>
      </div>
      ${mr ? `<div class="pr-context">Local market runs $${mr.low}–$${mr.high}. We sit at the
        premium end, and we say so — the difference is prep, product, and seeing the color first.</div>` : ''}
      ${range}
      <div class="pr-inc-lbl">Every project includes</div>
      <ul class="pr-inc">
          ${included}
      </ul>
      <p class="pr-note"><b>Paintable surface is not home square footage.</b> We measure the
      actual surface being coated, and every estimate breaks out prep, primer, coating, trim
      and accents separately. No lump sums.</p>
    </div>
  </section>`;
};

/* ---- 3 · COMMUNITIES — the internal-link engine, city → villages ---- */
M.communities = (c, no, bg, H) => {
  const list = c.child_communities || [];
  if (!list.length) return '';
  const cards = list.map(x => `
      <a class="cm-card" href="${x.href || x.url}">
        <div class="cm-name">${x.name}</div>
        ${x.tagline ? `<div class="cm-tag">${x.tagline}</div>` : ''}
        <div class="cm-go">View ${x.name} →</div>
      </a>`).join('');
  return `
  <section class="${bg}" id="communities">
    <div class="sec-head">
      <div class="sec-no">${H.secNo(no)}</div>
      <div class="eyebrow">Where We Work in ${c.name}</div>
      <h2 class="ttl">Every Village Has Its <span class="accent">Own Light</span></h2>
      <p class="lead">${c.communities_intro || ''}</p>
    </div>
    <div class="cm-grid">${cards}
    </div>
  </section>`;
};

/* ---- 4 · COLOR GUIDE — city-level palette baseline ---- */
M.color_guide = (c, no, bg, H) => {
  const colors = (c.palette_baseline && c.palette_baseline.colors) || [];
  if (!colors.length) return '';
  const ROLE = { main_body: 'Body', trim: 'Trim', gable: 'Gable / Accent', front_door: 'Door &amp; Iron' };
  const cards = colors.map(col => `
      <div class="swatch-card">
        <div class="swatch-chip" style="background:${col.hex};"></div>
        <div class="swatch-body">
          <div class="swatch-role">${ROLE[col.role] || col.role}</div>
          <div class="swatch-name">${col.sw_name}</div>
          <div class="swatch-code">Sherwin-Williams · ${col.sw_code}</div>
        </div>
      </div>`).join('');
  const trend = c.palette_baseline.trend_note
    ? `<p class="lead" style="margin-top:32px;">${c.palette_baseline.trend_note}</p>` : '';
  return `
  <section class="${bg}" id="colors">
    <div class="sec-head">
      <div class="sec-no">${H.secNo(no)}</div>
      <div class="eyebrow">The ${c.name} Palette</div>
      <h2 class="ttl">Colors That Fit <span class="accent">${c.name}</span> Architecture</h2>
      <p class="lead">${c.color_guide_intro || ''}</p>
    </div>
    <div class="swatch-grid">${cards}
    </div>
    <div class="sec-head" style="margin:0 auto;">${trend}</div>
  </section>`;
};

/* ---- 5 · HOA — design review handled, and the door to the B2B page ---- */
M.hoa = (c, no, bg, H) => {
  const h = c.hoa_module || {};
  if (!h.intro) return '';
  const steps = [
    ['We pull your association\'s approved palette', 'Before anything is proposed.'],
    ['We prepare the submission package', 'Swatches, Sherwin-Williams product data, elevation callouts.'],
    ['You submit — or we submit for you', 'Formatted the way your board expects to receive it.']
  ].map(([t, d]) => `<li><b>${t}</b>${d}</li>`).join('\n          ');
  return `
  <section class="${bg}" id="hoa">
    <div class="split-grid">
      <div>
        <div class="sec-no" style="text-align:left;">${H.secNo(no)}</div>
        <div class="eyebrow">Design Review, Handled</div>
        <h2 class="ttl">We Do the <span class="accent">Paperwork</span></h2>
        <p class="body">${h.intro}</p>
        <ul class="checks">
          ${steps}
        </ul>
        ${h.hoa_page_url ? `<a class="hoa-link" href="${H.link ? H.link(h.hoa_page_url) : h.hoa_page_url}">Managing an association or property? See our HOA &amp; common-area page →</a>` : ''}
      </div>
      <div class="hoa-panel">
        <div class="hoa-panel-lbl">Nobody else writes about this</div>
        <p class="hoa-panel-txt">Across every painting company ranking in ${c.name}, not one
        publishes guidance on the design-review process. It is the step homeowners dread and
        the one we handle as part of the job.</p>
      </div>
    </div>
  </section>`;
};

/* ---- 6 · VIDEO — facade embed. A raw YouTube iframe wrecks LCP. ---- */
M.video = (c, no, bg, H) => {
  const v = (c.media && c.media.hero_video) || {};
  if (!v.youtube_id) return '';
  const thumb = v.thumbnail_url || `https://i.ytimg.com/vi/${v.youtube_id}/maxresdefault.jpg`;
  const shorts = ((c.media && c.media.shorts) || []).filter(s => s.youtube_id).map(s => `
        <button class="yt-short" data-yt="${s.youtube_id}" aria-label="Play: ${H.esc(s.question_answered || 'short video')}">
          <img loading="lazy" src="https://i.ytimg.com/vi/${s.youtube_id}/hqdefault.jpg" alt=""/>
          <span class="yt-short-q">${H.esc(s.question_answered || '')}</span>
        </button>`).join('');
  return `
  <section class="${bg}" id="video">
    <div class="sec-head">
      <div class="sec-no">${H.secNo(no)}</div>
      <div class="eyebrow">See the Work</div>
      <h2 class="ttl">${H.esc(v.title || `Painting in ${c.name}`)}</h2>
      ${v.description ? `<p class="lead">${H.esc(v.description)}</p>` : ''}
    </div>
    <div class="yt-wrap">
      <button class="yt-facade" data-yt="${v.youtube_id}" aria-label="Play video: ${H.esc(v.title || '')}">
        <img class="yt-poster" src="${thumb}" alt="${H.esc(v.title || '')}" loading="lazy"/>
        <span class="yt-play" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </span>
      </button>
    </div>
    ${shorts ? `<div class="yt-shorts">${shorts}\n    </div>` : ''}
  </section>`;
};

/* ---- 7 · SPOTLIGHT — a project feature ---- */
M.spotlight = (c, no, bg, H) => {
  const s = c.spotlight || {};
  if (!s.title && !s.body) return '';
  return `
  <section class="${bg}" id="spotlight">
    <div class="split-grid">
      <div class="sp-media" ${s.image ? `style="background-image:url('${s.image}')"` : ''}></div>
      <div>
        <div class="sec-no" style="text-align:left;">${H.secNo(no)}</div>
        <div class="eyebrow">${s.eyebrow || 'Project Spotlight'}</div>
        <h2 class="ttl">${s.title || ''}</h2>
        <p class="body">${s.body || ''}</p>
        ${s.is_representative ? '<p class="sp-note">Representative project — details composited from typical work in this area.</p>' : ''}
        ${H.ctaButton('Claim Complimentary Color Consultation', `${c.name} estimates, itemized line by line`)}
      </div>
    </div>
  </section>`;
};

/* ---- 8 · REVIEWS + MAP — local signals. NAP comes from the registry. ---- */
M.reviews_map = (c, no, bg, H) => {
  const q = encodeURIComponent(`${c.name}, California`);
  const kids = (c.child_communities || []).map(x => x.name).join(' · ');
  return `
  <section class="${bg}" id="map">
    <div class="sec-head">
      <div class="sec-no">${H.secNo(no)}</div>
      <div class="eyebrow">Find Us</div>
      <h2 class="ttl">Serving <span class="accent">${c.name}</span> from Anaheim</h2>
      <p class="lead">VIP Home Painting is a service-area company covering every village of
      ${c.name}. Save our Google profile, read the reviews, and see recent project photos
      before your consultation.</p>
    </div>
    <div class="map-grid">
      <div class="map-embed">
        <iframe title="Map of ${c.name}, California — VIP Home Painting service area"
          src="https://www.google.com/maps?q=${q}&amp;output=embed" loading="lazy"
          referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
      </div>
      <div class="nap-card">
        <div class="nap-name">${H.CFG.businessName}</div>
        <div class="nap-line" style="font-family:var(--font-serif); font-style:italic; color:var(--gold-deep);">Luxury Residential Painting · ${c.name}, CA</div>
        <div class="nap-line"><b>Phone:</b> <a href="${H.CFG.phoneHref}">${H.CFG.phone}</a></div>
        <div class="nap-line"><b>Email:</b> <a href="mailto:${H.CFG.email}">${H.CFG.email}</a></div>
        <div class="nap-line"><b>Hours:</b> Mon–Fri 8am–6pm · Sat 9am–3pm</div>
        ${kids ? `<div class="nap-line"><b>Villages served:</b> ${kids}</div>` : ''}
        <div class="nap-btns">
          <a class="btn-gold" href="${H.CFG.gbpUrl}" target="_blank" rel="noopener">See Us On Google</a>
          <a class="nap-ghost" href="${H.CFG.phoneHref}">${H.CFG.phone}</a>
        </div>
      </div>
    </div>
  </section>`;
};

/* ---- 9 · PROCESS — city version.
   The community `process` module reads community-only fields
   (context.hoaNote), so the city gets its own that speaks to the
   whole city rather than one association. ---- */
M.process = (c, no, bg, H) => {
  const steps = [
    ['Private Color Consultation',
     `A 30-minute in-home consultation, then our design team renders your ${c.name} home in every candidate palette — before anything is scheduled.`],
    ['Design Review, Handled',
     `Most ${c.name} communities require board approval before an exterior color change. We prepare the submission package as part of the project.`],
    ['Estate-Grade Preparation',
     'Pressure wash, stucco repair floated to match texture, sanding, bonding primer. Landscaping and hardscape masked before a gallon is opened.'],
    ['Precision Spray Application',
     'Sherwin-Williams Emerald applied with Graco and Titan airless equipment at full wet-mil, back-rolled on stucco, hand-cut at every transition.'],
    ['Founder’s Walkthrough &amp; Warranty',
     'Raking-light inspection of every elevation, touch-ups before you ask, and a signed walkthrough — backed by our 1-Year Warranty.']
  ];
  const rows = steps.map(([t, d], i) => `
      <div class="glove-step">
        <div class="glove-num">${i + 1}</div>
        <div>
          <h3 class="glove-title">${t}</h3>
          <p class="glove-desc">${d}</p>
        </div>
      </div>`).join('');
  return `
  <section class="${bg}" id="process">
    <div class="sec-head">
      <div class="sec-no">${H.secNo(no)}</div>
      <div class="eyebrow">The White-Glove Process</div>
      <h2 class="ttl">How a ${c.name} Project <span class="accent">Actually Runs</span></h2>
    </div>
    <div class="glove-steps">${rows}
    </div>
  </section>`;
};

module.exports = M;
