/* ============================================================
   HOA PAGE MODULES

   A different buyer entirely. Boards and property managers buy
   COMMON-AREA painting on recurring maintenance cycles — clubhouses,
   pool houses, perimeter walls, monuments, guard houses — not house
   repaints. They procure; they don't shop.

   So: no portfolio, no problem/solution, no "envy of the neighborhood".
   The register is governance, documentation, and de-risking a vote.

   Signature (c, no, bg, H) where c is the hoa page object.
   Returns '' when data is missing, same as the city modules.
   ============================================================ */

const M = {};

/* ---- 1 · SCOPE — common areas, not houses. Sets the whole frame. ---- */
M.scope = (c, no, bg, H) => {
  const scope = c.common_area_scope || [];
  if (!scope.length) return '';
  const items = scope.map(s => `<li>${s}</li>`).join('\n          ');
  return `
  <section class="${bg}" id="scope">
    <div class="sec-head">
      <div class="sec-no">${H.secNo(no)}</div>
      <div class="eyebrow">Common-Area Painting</div>
      <h2 class="ttl">What We Paint for <span class="accent">Associations</span></h2>
      <p class="lead">${c.scope_intro || ''}</p>
    </div>
    <div class="hoa-scope-card">
      <ul class="hoa-scope">
          ${items}
      </ul>
    </div>
  </section>`;
};

/* ---- 2 · PROCESS — HOA variant. The board's timeline, not a homeowner's. ---- */
M.process = (c, no, bg, H) => {
  const steps = [
    ['Walk &amp; Itemized Bid',
     'We walk every common-area surface with your manager, measure, and return a bid itemized by structure — clubhouse, pool building, walls, monuments — so the board can compare like for like.'],
    ['Color Rendered Before the Vote',
     'Our design team renders the actual buildings in each candidate scheme. The board votes on something residents can see, not a swatch passed around a meeting.'],
    ['Documentation &amp; Scheduling',
     'Certificates of insurance naming the association, licensing, W-9, and a written work schedule with resident-notice dates before anyone arrives on site.'],
    ['Phased Execution',
     'Work is sequenced building by building so amenities stay open. Full masking, daily clean-up, and crews briefed on gate and pool-area protocol.'],
    ['Board Walkthrough &amp; Warranty',
     'Final walkthrough with your manager or board representative, punch list closed before sign-off, backed by our 1-Year Warranty on labor and materials.']
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
      <div class="eyebrow">How an Association Project Runs</div>
      <h2 class="ttl">Built for <span class="accent">Board Approval</span></h2>
    </div>
    <div class="glove-steps">${rows}
    </div>
  </section>`;
};

/* ---- 3 · COMPLIANCE — the section that actually wins the bid ---- */
M.compliance = (c, no, bg, H) => {
  if (!c.compliance_block) return '';
  const docs = [
    ['Certificate of Insurance', 'General liability and workers’ compensation, naming your association as additional insured.'],
    ['California Contractor’s License', 'Licensed, Bonded &amp; Insured. License details supplied with every bid.'],
    ['Itemized Bid', 'Priced by structure and by scope item — prep, primer, coating, trim — so bids are genuinely comparable.'],
    ['Written Work Schedule', 'Start and finish dates per building, with resident-notice lead time agreed in advance.'],
    ['Product Data Sheets', 'Sherwin-Williams specifications for every product, for your reserve study and records.'],
    ['1-Year Warranty', 'Labor and materials, in writing, no questions asked.']
  ].map(([t, d]) => `
        <div class="hoa-doc">
          <div class="hoa-doc-t">${t}</div>
          <div class="hoa-doc-d">${d}</div>
        </div>`).join('');
  return `
  <section class="${bg}" id="compliance">
    <div class="sec-head">
      <div class="sec-no">${H.secNo(no)}</div>
      <div class="eyebrow">Documentation</div>
      <h2 class="ttl">Everything Your Board Needs <span class="accent">On File</span></h2>
      <p class="lead">${c.compliance_block}</p>
    </div>
    <div class="hoa-docs">${docs}
    </div>
  </section>`;
};

/* ---- 4 · SPEC — the materials and method, for the reserve study ---- */
M.spec = (c, no, bg, H) => `
  <section class="${bg}" id="spec">
    <div class="sec-head">
      <div class="sec-no">${H.secNo(no)}</div>
      <div class="eyebrow">Materials &amp; Method</div>
      <h2 class="ttl">The Common-Area <span class="accent">Specification</span></h2>
    </div>
    <div class="spec-table">
      <div class="st-head"><span class="t">Association Painting Specification</span><span class="n">Prepared for ${c.city_name || ''} associations</span></div>
      <div class="st-row"><span class="st-k">Surface Preparation</span><span class="st-v">Pressure wash, scrape and sand failing edges, <b>stucco crack and patch repair floated to match existing texture</b>, bonding primer on bare substrate.</span></div>
      <div class="st-row"><span class="st-k">Coating System</span><span class="st-v"><b>Sherwin-Williams Emerald and Duration</b> exterior acrylics on bodies and walls; urethane trim enamel on doors, railings and iron. Two coats at full wet-mil.</span></div>
      <div class="st-row"><span class="st-k">Application</span><span class="st-v"><b>Graco and Titan professional airless rigs</b>, back-rolled on stucco, hand-cut at every transition.</span></div>
      <div class="st-row"><span class="st-k">Iron &amp; Metalwork</span><span class="st-v">Rust treatment and spot-prime on gates, railings and light poles before finish coats.</span></div>
      <div class="st-row"><span class="st-k">Site Protection</span><span class="st-v">Landscaping wrapped, hardscape and pool surrounds covered, wind-checked spray scheduling, clean site every evening. Amenities stay open wherever sequencing allows.</span></div>
      <div class="st-row"><span class="st-k">Resident Impact</span><span class="st-v">Written notice dates per building, crews badged and briefed on gate protocol, work hours agreed with management.</span></div>
      <div class="st-row"><span class="st-k">Warranty</span><span class="st-v"><b>1-Year Warranty on labor and materials.</b> Licensed, Bonded &amp; Insured in the State of California.</span></div>
    </div>
  </section>`;

/* ---- 5 · REFERENCES — stays empty until real association work exists.
   The contract forbids inventing client stories, and a board will call. ---- */
M.references = (c, no, bg, H) => {
  const refs = (c.references || []).filter(r => r && r.association);
  if (!refs.length) return '';
  const cards = refs.map(r => `
      <div class="hoa-ref">
        <div class="hoa-ref-name">${r.association}</div>
        ${r.units ? `<div class="hoa-ref-meta">${r.units.toLocaleString()} units</div>` : ''}
        ${r.scope ? `<div class="hoa-ref-scope">${r.scope}</div>` : ''}
      </div>`).join('');
  return `
  <section class="${bg}" id="references">
    <div class="sec-head">
      <div class="sec-no">${H.secNo(no)}</div>
      <div class="eyebrow">Association Work</div>
      <h2 class="ttl">Communities We've <span class="accent">Served</span></h2>
    </div>
    <div class="hoa-refs">${cards}
    </div>
  </section>`;
};

/* ---- 6 · BID CTA — boards procure. Never "book a consultation". ---- */
M.bid_cta = (c, no, bg, H) => `
  <section class="${bg}" id="bid">
    <div class="hoa-bid">
      <div class="sec-no">${H.secNo(no)}</div>
      <div class="eyebrow">Request a Bid</div>
      <h2 class="ttl">${c.bid_cta_title || `Put Us on Your Next Bid List`}</h2>
      <p class="hoa-bid-body">${c.bid_cta || ''}</p>
      <div class="hoa-bid-actions">
        <a href="${H.CFG.phoneHref}" class="btn-gold">
          <span class="col-2"><span>Request a Bid</span><span class="sub">Itemized by structure · no obligation</span></span>
        </a>
        <a class="nap-ghost" href="mailto:${H.CFG.email}?subject=HOA%20Painting%20Bid%20Request">${H.CFG.email}</a>
      </div>
      <p class="hoa-bid-note">Managers and board members: we can walk the property and return an
      itemized bid without a meeting. Certificates of insurance and licensing supplied with every proposal.</p>
    </div>
  </section>`;

module.exports = M;
