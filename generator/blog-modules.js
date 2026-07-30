/* ============================================================
   PILLAR PAGE MODULES

   A pillar is editorial, not a sales page. Narrower column, longer
   read, table of contents, and the visualizer sitting mid-article
   where a reader is already thinking about color.

   Its job is humans and internal linking — dwell time, and pushing
   authority down into the community pages. It is NOT built to earn
   AI citations; the cluster articles do that (see BLOG.md / M-06).

   Signature (p, H) where p is the pillar object and H is
   { CFG, ctaButton, esc, A }. Modules return '' when data is missing.
   ============================================================ */

const M = {};

/* ---- TABLE OF CONTENTS — long-form needs one, and AI engines
   use heading structure to find the extractable answer ---- */
M.toc = (p, H) => {
  const items = (p.toc || []).filter(t => t.id && t.label);
  if (!items.length) return '';
  return `
  <nav class="pl-toc" aria-label="On this page">
    <div class="pl-toc-lbl">On this page</div>
    <ol>${items.map(t => `
      <li><a href="#${t.id}">${H.esc(t.label)}</a></li>`).join('')}
    </ol>
  </nav>`;
};

/* ---- OPENING — a scene, never a definition ---- */
M.intro = (p, H) => {
  if (!p.intro) return '';
  const paras = p.intro.split('\n\n').map(x => `<p class="pl-lead">${x}</p>`).join('\n      ');
  return `
  <section class="pl-section" id="intro">
      ${paras}
  </section>`;
};

/* ---- WHY THIS CITY ISN'T ONE MARKET ---- */
M.why_different = (p, H) => {
  const w = p.why_different || {};
  if (!w.body) return '';
  const stats = (w.stats || []).map(s => `
        <div class="pl-stat">
          <div class="pl-stat-n">${H.esc(s.value)}</div>
          <div class="pl-stat-l">${H.esc(s.label)}</div>
        </div>`).join('');
  return `
  <section class="pl-section" id="why-different">
    <h2 class="pl-h2">${H.esc(w.heading || `Why ${p.city_name} Isn't One Market`)}</h2>
    ${w.body.split('\n\n').map(x => `<p>${x}</p>`).join('\n    ')}
    ${stats ? `<div class="pl-stats">${stats}\n    </div>` : ''}
  </section>`;
};

/* ---- THE VILLAGES — the internal-link engine, one section each ---- */
M.villages = (p, H) => {
  const list = (p.villages || []).filter(v => v.name && v.body);
  if (!list.length) return '';
  const blocks = list.map(v => `
    <article class="pl-village" id="${v.slug}">
      <div class="pl-village-head">
        <h3 class="pl-h3">${H.esc(v.name)}</h3>
        ${v.meta ? `<div class="pl-village-meta">${H.esc(v.meta)}</div>` : ''}
      </div>
      ${v.body.split('\n\n').map(x => `<p>${x}</p>`).join('\n      ')}
      ${(v.palette || []).length ? `<div class="pl-palette">
        ${v.palette.map(c => `<span class="pl-chip" style="--c:${c.hex}"><i></i>${H.esc(c.name)} <em>${H.esc(c.code)}</em></span>`).join('\n        ')}
      </div>` : ''}
      ${v.url ? `<a class="pl-village-link" href="${v.url}">Painting in ${H.esc(v.name)} →</a>` : ''}
    </article>`).join('');
  return `
  <section class="pl-section" id="villages">
    <h2 class="pl-h2">${H.esc(p.villages_heading || 'The Villages')}</h2>
    ${p.villages_intro ? `<p>${p.villages_intro}</p>` : ''}
    <div class="pl-villages">${blocks}
    </div>
  </section>`;
};

/* ---- WHAT EVERY REPAINT HAS IN COMMON ---- */
M.common = (p, H) => {
  const c = p.common || {};
  if (!c.body) return '';
  const points = (c.points || []).map(x => `<li>${x}</li>`).join('\n        ');
  return `
  <section class="pl-section" id="common">
    <h2 class="pl-h2">${H.esc(c.heading || 'What Every Repaint Here Has in Common')}</h2>
    ${c.body.split('\n\n').map(x => `<p>${x}</p>`).join('\n    ')}
    ${points ? `<ul class="pl-list">\n        ${points}\n    </ul>` : ''}
  </section>`;
};

/* ---- COST — answer-shaped, because it's the most-asked question ---- */
M.cost = (p, H) => {
  const c = p.cost || {};
  if (!c.answer) return '';
  return `
  <section class="pl-section" id="cost">
    <h2 class="pl-h2">${H.esc(c.heading || 'What It Costs')}</h2>
    <div class="pl-answer">
      <div class="pl-answer-lbl">The short answer</div>
      <p>${c.answer}</p>
    </div>
    ${(c.body || '').split('\n\n').filter(Boolean).map(x => `<p>${x}</p>`).join('\n    ')}
    ${c.article_url ? `<a class="pl-inline-link" href="${c.article_url}">The full breakdown: what changes the price →</a>` : ''}
  </section>`;
};

/* ---- THE CLUSTER — links to the articles. This is the pillar
   half of the pillar-and-cluster structure. ---- */
M.articles = (p, H) => {
  const list = (p.articles || []).filter(a => a.title && a.url);
  if (!list.length) return '';
  const cards = list.map(a => `
      <a class="pl-card" href="${a.url}">
        <div class="pl-card-t">${H.esc(a.title)}</div>
        ${a.sub ? `<div class="pl-card-s">${H.esc(a.sub)}</div>` : ''}
      </a>`).join('');
  return `
  <section class="pl-section" id="articles">
    <h2 class="pl-h2">${H.esc(p.articles_heading || 'Read Next')}</h2>
    ${p.articles_intro ? `<p>${p.articles_intro}</p>` : ''}
    <div class="pl-cards">${cards}
    </div>
  </section>`;
};

/* ---- CLOSE — the offer, once, plainly ---- */
M.close = (p, H) => {
  const c = p.close || {};
  if (!c.body) return '';
  return `
  <section class="pl-section pl-close" id="close">
    <h2 class="pl-h2">${H.esc(c.heading || 'Seeing It First')}</h2>
    ${c.body.split('\n\n').map(x => `<p>${x}</p>`).join('\n    ')}
    <div class="pl-cta">
      ${H.ctaButton('Claim Complimentary Color Consultation', 'Your home, your colors, before anything is scheduled')}
    </div>
  </section>`;
};

module.exports = M;
