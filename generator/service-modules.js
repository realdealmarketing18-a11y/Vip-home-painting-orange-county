/* ============================================================
   SERVICE PAGE MODULES

   A service page answers "what exactly do you do, and how" for one
   service across the whole county. It is not a city page: it never
   claims a location, and it links DOWN to the city hubs rather than
   competing with them.

   Every builder has the signature (s, no, bg, H) where:
     s  = the service object from services.json
     no = section serial number (No. 03, No. 04 …)
     bg = section background class
     H  = helpers { CFG, ctaButton, secNo, esc, cityLinks }

   A module returns '' when its data is missing, so a half-filled
   service renders a shorter page rather than a broken one.
   ============================================================ */

const M = {};

/* ---- problems · the researched failure modes, and our answer ----
   These pairs come out of the Irvine research, not out of a template.
   They are the most reusable thing the research produced and they are
   what makes a service page specific rather than generic. */
M.problems = (s, no, bg, H) => {
  const rows = (s.problems || []).filter(p => p.p && p.s);
  if (!rows.length) return '';
  return `
  <section class="${bg}" id="problems">
    <div class="sec-head">
      <div class="sec-no">${H.secNo(no)}</div>
      <div class="eyebrow">What Goes Wrong</div>
      <h2 class="ttl">Where ${H.esc(s.short)} Jobs <span class="accent">Actually Fail</span></h2>
      <p class="lead">Every one of these is a real failure mode we were called in to correct.
      Here is how each is designed out of the job instead.</p>
    </div>
    <div class="ps-grid">
      ${rows.map(p => `
      <article class="ps-card">
        <div class="ps-p"><span class="ps-tag">The problem</span><p>${H.esc(p.p)}</p></div>
        <div class="ps-s"><span class="ps-tag">How we answer it</span><p>${H.esc(p.s)}</p></div>
      </article>`).join('')}
    </div>
  </section>`;
};

/* ---- system · the spec sheet. The coating and the application
   matter more than the color, and both belong on the estimate. ---- */
M.system = (s, no, bg, H) => {
  const y = s.system || {};
  if (!y.specs || !y.specs.length) return '';
  return `
  <section class="${bg}" id="system">
    <div class="sec-head">
      <div class="sec-no">${H.secNo(no)}</div>
      <div class="eyebrow">Specification</div>
      <h2 class="ttl">${H.esc(y.title || 'The system')}</h2>
      ${y.body ? `<p class="lead">${H.esc(y.body)}</p>` : ''}
    </div>
    <dl class="spec-grid">
      ${y.specs.filter(x => x.k && x.v).map(x => `
      <div class="spec-row">
        <dt>${H.esc(x.k)}</dt>
        <dd>${H.esc(x.v)}</dd>
      </div>`).join('')}
    </dl>
  </section>`;
};

/* ---- visualize · the differentiator. Across ~50 painters in Irvine
   and Anaheim, zero carry a review tag about seeing the result first.
   Every page leads back to this. ---- */
M.visualize = (s, no, bg, H) => `
  <section class="${bg}" id="visualize">
    <div class="sec-head">
      <div class="sec-no">${H.secNo(no)}</div>
      <div class="eyebrow">Before Anything Is Committed</div>
      <h2 class="ttl">You Approve a <span class="accent">Picture</span>, Not a Swatch</h2>
      <p class="lead">A two-inch chip cannot tell you what a color does across a whole
      surface, in your light, next to everything else you already own. So we render it
      first — your own home, in every palette you are considering, before a gallon is tinted.
      It is complimentary, and it is where every ${H.esc(s.short.toLowerCase())} project starts.</p>
    </div>
    <div class="viz-cta-row">
      ${H.ctaButton('See My Home In Every Color', 'Complimentary · No obligation')}
      <a class="viz-see" href="${H.A}/#viz">Try the visualizer &rarr;</a>
    </div>
  </section>`;

/* ---- process · numbered because it genuinely is a sequence ---- */
M.process = (s, no, bg, H) => {
  const steps = (s.process || []).filter(x => x.t && x.d);
  if (!steps.length) return '';
  return `
  <section class="${bg}" id="process">
    <div class="sec-head">
      <div class="sec-no">${H.secNo(no)}</div>
      <div class="eyebrow">How It Runs</div>
      <h2 class="ttl">From Rendering to <span class="accent">Final Walkthrough</span></h2>
    </div>
    <ol class="svc-steps">
      ${steps.map((x, i) => `
      <li>
        <span class="step-n">${String(i + 1).padStart(2, '0')}</span>
        <div><h3>${H.esc(x.t)}</h3><p>${H.esc(x.d)}</p></div>
      </li>`).join('')}
    </ol>
  </section>`;
};

/* ---- pricing · starts-at only. Never a market average, never a
   project range we cannot evidence. ---- */
M.pricing = (s, no, bg, H) => {
  const p = s.pricing || {};
  if (!p.rate_line) return '';
  return `
  <section class="${bg}" id="pricing">
    <div class="sec-head">
      <div class="sec-no">${H.secNo(no)}</div>
      <div class="eyebrow">What It Costs</div>
      <h2 class="ttl">Priced Line by Line, <span class="accent">Not as One Number</span></h2>
    </div>
    <div class="price-block">
      <p class="price-rate">${H.esc(p.rate_line)}</p>
      ${p.body ? `<p class="price-body">${H.esc(p.body)}</p>` : ''}
      <div class="price-cta">${H.ctaButton('Get an Itemized Estimate', 'Complimentary · No obligation')}</div>
    </div>
  </section>`;
};

/* ---- where · links DOWN to the city hubs. This is the service
   branch meeting the geography branch; it is also what stops a
   service page from being a dead end. ---- */
M.where = (s, no, bg, H) => {
  const cities = H.cityLinks || [];
  if (!cities.length) return '';
  return `
  <section class="${bg}" id="where">
    <div class="sec-head">
      <div class="sec-no">${H.secNo(no)}</div>
      <div class="eyebrow">Where We Work</div>
      <h2 class="ttl">${H.esc(s.short)} Painting <span class="accent">Across Orange County</span></h2>
      <p class="lead">We work county-wide from Anaheim. These cities have their own pages,
      with the communities inside them.</p>
    </div>
    <div class="where-grid">
      ${cities.map(c => `<a class="where-card" href="${c.url}">
        <span class="wc-name">${H.esc(c.name)}</span>
        <span class="wc-go">${H.esc(s.short)} painting in ${H.esc(c.name)} &rarr;</span>
      </a>`).join('')}
    </div>
  </section>`;
};

module.exports = M;
