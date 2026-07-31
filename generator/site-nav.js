/* ============================================================
   SITE NAVIGATION — one footer, one link helper, one city list

   There were five hand-written footers, one per page type, and they
   had drifted: the city hub never linked to its own HOA page, and
   six community pages plus the HOA page linked to the Guide zero
   times. Both silos we built were nearly unreachable.

   Five copies is why. This is the single source.

   THE SILO RULE, which everything here enforces:

     Every page links UP to its city hub, ACROSS to its siblings,
     and DOWN to its children. Cities link across to other cities.
     Nothing else crosses a silo.

   Concretely: a community page belongs to exactly one city and is
   never listed outside it. Anaheim's footer lists Anaheim villages.
   Linking every community of every city from every page is what
   makes a programmatic site read as doorway pages — the exact
   filter this whole build is designed to stay clear of.
   ============================================================ */

/* ---- THE LINK HELPER ----

   Pages sit at three different depths (/irvine/, /irvine/woodbury/,
   /irvine/guide/what-does-it-cost/) and GitHub Pages serves from a repo
   subpath, so a leading slash resolves to the domain root and 404s.
   Absolute-looking links have broken this site twice.

   So: store every internal path absolute ('/irvine/woodbury/') and let
   this turn it into the correct relative link from wherever you are.
   One place to get right instead of a rel() per page type. */
function linker(fromPath) {
  const from = String(fromPath).split('/').filter(Boolean);
  return (toPath) => {
    const to = String(toPath).split('/').filter(Boolean);
    let i = 0;
    while (i < from.length && i < to.length && from[i] === to[i]) i++;
    const up = '../'.repeat(from.length - i);
    const down = to.slice(i).join('/');
    const rel = up + (down ? down + '/' : '');
    return rel || './';
  };
}

/* ---- WHICH CITIES ACTUALLY EXIST ----

   Only cities with a built page. A dropdown that offers Anaheim before
   Anaheim is published is a 404 with extra steps, and a switcher holding
   a single city is just noise — so this returns [] until there are two,
   and the nav renders nothing. Anaheim appears by itself on the build
   that publishes it. */
function liveCities(CITIES) {
  const list = (CITIES.cities || [])
    .filter(c => c.slug && c.name)
    .map(c => ({ slug: c.slug, name: c.name, url: `/${c.slug}/` }));
  return list.length > 1 ? list : [];
}

/* ---- TOP NAV ----

   Ten flat items crushed the header: the logo collapsed to a sliver and the
   phone number wrapped onto three lines. Four categories instead, each one
   opening its own list, identical on every page type.

     Cities · Neighborhoods · Guides · Services

   details/summary so it opens without JavaScript; NAV_SCRIPT below only
   adds the courtesy of closing the others. */
function menu(id, label, items, esc) {
  const live = (items || []).filter(i => i && i.url && i.label);
  if (!live.length) return '';
  return `
      <details class="nav-item" data-nav="${id}">
        <summary>${esc(label)}</summary>
        <div class="nav-menu">
          ${live.map(i => `<a href="${i.url}"${i.current ? ' aria-current="page"' : ''}${i.strong ? ' class="is-lead"' : ''}>${esc(i.label)}</a>`).join('\n          ')}
        </div>
      </details>`;
}

function topNav(ctx) {
  const { esc, A } = ctx;
  const L = ctx.link;
  const cities = liveCities(ctx.CITIES);

  /* Cities — always at least the current city plus the county page, so the
     category is never empty and grows on its own as cities are published. */
  const cityItems = (cities.length
    ? cities.map(c => ({ label: c.name, url: L(c.url), current: c.slug === ctx.citySlug }))
    : [{ label: ctx.cityName, url: L(`/${ctx.citySlug}/`), current: true }]
  ).concat([{ label: 'All of Orange County', url: `${A}/` }]);

  /* Neighborhoods — this city's, never another's. The silo rule. */
  const hoodItems = [{ label: `All ${ctx.cityName} Painting`, url: L(`/${ctx.citySlug}/`), strong: true }]
    .concat((ctx.communities || []).filter(v => v.url && v.name)
      .map(v => ({ label: v.name, url: L(v.url) })))
    .concat(ctx.hoaUrl ? [{ label: 'HOA & Common-Area', url: L(ctx.hoaUrl) }] : []);

  const guideItems = (ctx.guideUrl ? [{ label: `The ${ctx.cityName} Color Guide`, url: L(ctx.guideUrl), strong: true }] : [])
    .concat((ctx.articles || []).filter(a => a.url && a.title).slice(0, 6)
      .map(a => ({ label: a.title, url: L(a.url) })));

  const serviceItems = [
    { label: 'Exterior Painting', url: `${A}/#services` },
    { label: 'Interior Painting', url: `${A}/#services` },
    { label: 'Kitchen Cabinets', url: `${A}/#services` },
    { label: 'Color Visualization', url: `${A}/#viz` }
  ];

  return [
    menu('cities', 'Cities', cityItems, esc),
    menu('hoods', 'Neighborhoods', hoodItems, esc),
    menu('guides', 'Guides', guideItems, esc),
    menu('services', 'Services', serviceItems, esc)
  ].filter(Boolean).join('');
}

/* Closes the other menus when one opens, and closes on outside click or Escape.
   Everything still works with this script absent. */
const NAV_SCRIPT = `<script>
(function(){
  var items = [].slice.call(document.querySelectorAll('.top-nav .nav-item'));
  if (!items.length) return;
  items.forEach(function(d){
    d.addEventListener('toggle', function(){
      if (!d.open) return;
      items.forEach(function(o){ if (o !== d) o.open = false; });
    });
  });
  document.addEventListener('click', function(e){
    if (e.target.closest && e.target.closest('.top-nav .nav-item')) return;
    items.forEach(function(d){ d.open = false; });
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') items.forEach(function(d){ d.open = false; });
  });
})();
</script>`;

/* ---- THE FOOTER ----

   ctx = {
     from        absolute path of the page being built ('/irvine/guide/')
     cityName, citySlug
     communities [{name, url}]   this city's villages, absolute urls
     hoaUrl      absolute url or ''
     guideUrl    absolute url or ''
     articles    [{title, url}]  this city's cluster, absolute urls
     CITIES, CFG, esc, A
   }                                                                  */
function buildFooter(ctx) {
  const { CFG, esc, A } = ctx;
  const L = ctx.link;
  const cities = liveCities(ctx.CITIES);

  const cityCol = `
        <nav class="f-col" aria-label="${esc(ctx.cityName)} pages">
          <div class="f-col-label">${esc(ctx.cityName)}</div>
          <ul class="f-links">
            <li><a href="${L(`/${ctx.citySlug}/`)}"><b>All ${esc(ctx.cityName)} Home Painting</b></a></li>
            ${(ctx.communities || []).filter(v => v.url && v.name)
              .map(v => `<li><a href="${L(v.url)}">${esc(v.name)}</a></li>`).join('\n            ')}
            ${ctx.hoaUrl ? `<li><a href="${L(ctx.hoaUrl)}">HOA &amp; Common-Area Painting</a></li>` : ''}
          </ul>
        </nav>`;

  /* The Guides column is capped and city-scoped on purpose. Dropping every
     article into a sitewide footer turns them into boilerplate Google
     discounts, and leaks one city's cluster into another's silo. */
  const guideCol = (ctx.guideUrl || (ctx.articles || []).length) ? `
        <nav class="f-col" aria-label="${esc(ctx.cityName)} guides">
          <div class="f-col-label">Guides</div>
          <ul class="f-links">
            ${ctx.guideUrl ? `<li><a href="${L(ctx.guideUrl)}"><b>The ${esc(ctx.cityName)} Color Guide</b></a></li>` : ''}
            ${(ctx.articles || []).filter(a => a.url && a.title).slice(0, 5)
              .map(a => `<li><a href="${L(a.url)}">${esc(a.title)}</a></li>`).join('\n            ')}
          </ul>
        </nav>` : '';

  const citiesCol = cities.length ? `
        <nav class="f-col" aria-label="Cities we serve">
          <div class="f-col-label">Cities We Serve</div>
          <ul class="f-links">
            ${cities.map(c => `<li><a href="${L(c.url)}">${esc(c.name)} Home Painting</a></li>`).join('\n            ')}
            <li><a href="${A}/">All of Orange County</a></li>
          </ul>
        </nav>` : `
        <nav class="f-col" aria-label="Premium services">
          <div class="f-col-label">Premium Services</div>
          <ul class="f-links">
            <li><a href="${A}/#services">Residential Exterior Painting</a></li>
            <li><a href="${A}/#services">Premium Interior Painting</a></li>
            <li><a href="${A}/#services">Kitchen Cabinet Painting</a></li>
            <li><a href="${A}/#viz">Custom Color Visualization</a></li>
            <li><a href="${A}/">All of Orange County</a></li>
          </ul>
        </nav>`;

  const concierge = `
        <div class="f-col">
          <div class="f-col-label">VIP Concierge</div>
          <ul class="f-links">
            <li><a href="${CFG.phoneHref}">${CFG.phone}</a></li>
            <li><a href="mailto:${CFG.email}">${CFG.email}</a></li>
            <li><span style="font-size:13.5px; color:rgba(255,255,255,0.78);">Mon–Fri 8am–6pm · Sat 9am–3pm</span></li>
          </ul>
        </div>`;

  const cols = [cityCol, guideCol, citiesCol, concierge].filter(Boolean);

  return `
  <footer>
    <div class="f-shell">
      <div class="f-mast">
        <div class="f-logo">
          <img class="f-mark" src="${A}/assets/logos/logo-mark.png" alt="VIP Home Painting"/>
          <div class="wm"><div class="vip">VIP</div><div class="sub">HOME PAINTING</div></div>
        </div>
        <div class="f-tag"><b>We don't just paint homes,</b><br/>we transform lives.</div>
      </div>
      <div class="f-cols f-cols-${cols.length}">${cols.join('')}
      </div>
      <div class="f-bottom">
        <div class="f-contact">
          <span>${esc(ctx.bottomLine || `Serving every village of ${ctx.cityName}, CA`)}</span>
          <a href="${CFG.phoneHref}">${CFG.phone}</a>
        </div>
        <div class="f-copy">© ${new Date().getFullYear()} VIP Home Painting. Licensed, Bonded &amp; Insured · 1-Year Warranty on Labor &amp; Materials.</div>
      </div>
    </div>
  </footer>`;
}

module.exports = { linker, liveCities, topNav, buildFooter, NAV_SCRIPT };
