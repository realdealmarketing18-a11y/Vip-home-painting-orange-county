/* ============================================================
   CLUSTER ARTICLE MODULES

   The pillar is for humans and internal linking. These are the
   pages built to be *cited* — M-06: CertaPro earns 313 AI citations
   and a single blog post accounts for 55 of them while hundreds of
   landing pages earn nothing.

   So every module here is shaped for extraction:
     · one direct answer, early, in a self-contained block
     · headings that read as questions a person would type
     · tables and lists, because engines lift structured data first
     · FAQ text that matches the JSON-LD word for word

   Signature (a, H) where a is the article object and H is
   { CFG, ctaButton, esc, A }. Modules return '' when data is missing.
   ============================================================ */

const M = {};

const paras = (s) => String(s).split('\n\n').filter(Boolean);

/* ---- TABLE OF CONTENTS ---- */
M.toc = (a, H) => {
  const items = (a.toc || []).filter(t => t.id && t.label);
  if (!items.length) return '';
  return `
  <nav class="pl-toc" aria-label="On this page">
    <div class="pl-toc-lbl">On this page</div>
    <ol>${items.map(t => `
      <li><a href="#${t.id}">${H.esc(t.label)}</a></li>`).join('')}
    </ol>
  </nav>`;
};

/* ---- LEAD — the scene. Short. The answer block does the work. ---- */
M.intro = (a, H) => {
  if (!a.intro) return '';
  return `
  <section class="pl-section" id="intro">
      ${paras(a.intro).map(x => `<p class="pl-lead">${x}</p>`).join('\n      ')}
  </section>`;
};

/* ---- THE ANSWER — the block an engine lifts. Self-contained on
   purpose: it must still make sense quoted with no page around it,
   so it names the city and the company rather than saying "we". ---- */
M.answer = (a, H) => {
  const q = a.answer || {};
  if (!q.body) return '';
  return `
  <section class="pl-section" id="answer">
    <div class="ar-answer">
      <div class="pl-answer-lbl">${H.esc(q.label || 'The short answer')}</div>
      ${paras(q.body).map(x => `<p>${x}</p>`).join('\n      ')}
      ${(q.points || []).length ? `<ul class="ar-answer-list">
        ${q.points.map(x => `<li>${x}</li>`).join('\n        ')}
      </ul>` : ''}
    </div>
  </section>`;
};

/* ---- BODY SECTIONS — the flexible spine. Each is its own H2 so the
   heading structure stays extractable. ---- */
M.sections = (a, H) => {
  const list = (a.sections || []).filter(s => s.heading && (s.body || s.list));
  if (!list.length) return '';
  return list.map((s, i) => `
  <section class="pl-section" id="${s.id || `s${i + 1}`}">
    <h2 class="pl-h2">${s.number ? `<span class="ar-num">${H.esc(s.number)}</span>` : ''}${H.esc(s.heading)}</h2>
    ${s.body ? paras(s.body).map(x => `<p>${x}</p>`).join('\n    ') : ''}
    ${(s.list || []).length ? `<ul class="pl-list">
      ${s.list.map(x => `<li>${x}</li>`).join('\n      ')}
    </ul>` : ''}
    ${s.callout ? `<div class="ar-callout"><p>${s.callout}</p></div>` : ''}
  </section>`).join('\n');
};

/* ---- TABLE — engines lift tables before prose. Worth a module. ---- */
M.table = (a, H) => {
  const t = a.table || {};
  if (!(t.rows || []).length) return '';
  return `
  <section class="pl-section" id="${t.id || 'table'}">
    ${t.heading ? `<h2 class="pl-h2">${H.esc(t.heading)}</h2>` : ''}
    ${t.intro ? `<p>${t.intro}</p>` : ''}
    <div class="ar-table-wrap">
      <table class="ar-table">
        <thead><tr>${(t.columns || []).map(c => `<th>${H.esc(c)}</th>`).join('')}</tr></thead>
        <tbody>
          ${t.rows.map(r => `<tr>${r.map((cell, i) => i === 0
            ? `<th scope="row">${cell}</th>`
            : `<td>${cell}</td>`).join('')}</tr>`).join('\n          ')}
        </tbody>
      </table>
    </div>
    ${t.note ? `<p class="ar-table-note">${t.note}</p>` : ''}
  </section>`;
};

/* ---- TAKEAWAYS — a summary block is the second-most-quoted element
   after the answer, and it gives the reader an exit point. ---- */
M.takeaways = (a, H) => {
  const t = a.takeaways || {};
  const list = (t.points || []).filter(Boolean);
  if (!list.length) return '';
  return `
  <section class="pl-section" id="takeaways">
    <div class="ar-takeaways">
      <div class="pl-answer-lbl">${H.esc(t.heading || 'What to remember')}</div>
      <ol>
        ${list.map(x => `<li>${x}</li>`).join('\n        ')}
      </ol>
    </div>
  </section>`;
};

/* ---- FAQ — visible text must match the FAQPage JSON-LD exactly.
   Same rule as the community pages; the schema is built from this
   identical array in generate.js. ---- */
M.faq = (a, H) => {
  const list = (a.faq || []).filter(f => f.q && f.a);
  if (!list.length) return '';
  return `
  <section class="pl-section" id="faq">
    <h2 class="pl-h2">${H.esc(a.faq_heading || 'Questions people ask')}</h2>
    <div class="faq-list">
      ${list.map((f, i) => `<details class="faq-item"${i === 0 ? ' open' : ''}>
        <summary class="faq-q">${H.esc(f.q)}<span class="pm">+</span></summary>
        <div class="faq-a">${f.a.replace(H.CFG.phone, `<a href="${H.CFG.phoneHref}">${H.CFG.phone}</a>`)}</div>
      </details>`).join('\n      ')}
    </div>
  </section>`;
};

/* ---- RELATED — closes the cluster loop back to the pillar and
   across to siblings. Every article links up, never only down. ---- */
M.related = (a, H) => {
  const sibs = (a.related || []).filter(r => r.title && r.url);
  if (!sibs.length && !a.pillar_url) return '';
  return `
  <section class="pl-section" id="related">
    <h2 class="pl-h2">${H.esc(a.related_heading || 'Read next')}</h2>
    <div class="pl-cards">
      ${sibs.map(r => `<a class="pl-card" href="${r.url}">
        <div class="pl-card-t">${H.esc(r.title)}</div>
        ${r.sub ? `<div class="pl-card-s">${H.esc(r.sub)}</div>` : ''}
      </a>`).join('\n      ')}
    </div>
    ${a.pillar_url ? `<a class="pl-inline-link" href="${a.pillar_url}">Back to the full ${H.esc(a.city_name)} color guide →</a>` : ''}
  </section>`;
};

/* ---- CLOSE — the offer, once, plainly. Same discipline as the pillar. ---- */
M.close = (a, H) => {
  const c = a.close || {};
  if (!c.body) return '';
  return `
  <section class="pl-section pl-close" id="close">
    <h2 class="pl-h2">${H.esc(c.heading || 'Seeing It First')}</h2>
    ${paras(c.body).map(x => `<p>${x}</p>`).join('\n    ')}
    <div class="pl-cta">
      ${H.ctaButton(c.cta || 'Claim Complimentary Color Consultation', c.cta_sub || 'Your home, your colors, before anything is scheduled')}
    </div>
  </section>`;
};

module.exports = M;
