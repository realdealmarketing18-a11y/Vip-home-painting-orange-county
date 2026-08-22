#!/usr/bin/env node
/* ============================================================
   PUBLISH-WP — push generated pages into WordPress

   The pages stay GENERATED. WordPress becomes where they are served,
   not where they are edited. Elementor keeps doing what Fabian wants
   it for — home, about, contact, gallery — and never touches these.

   Why that matters: the 2-year warranty change touched 116 places
   across 14 pages. By hand across the ~65 pages this becomes at four
   cities, that is a day's work and a guaranteed miss. And
   verify-site.js cannot check a page it did not generate.

     node generator/publish-wp.js              dry run, all pages
     node generator/publish-wp.js irvine       dry run, one city
     node generator/publish-wp.js --live       actually write

   AUTH — never put these in the repo:
     WP_URL=https://viphomepainting.com
     WP_USER=<your wp username>
     WP_APP_PASSWORD=<Users -> Profile -> Application Passwords>

   Application Passwords are built into WordPress. They can be revoked
   without changing the account password, which is why we use one
   rather than the real login.
   ============================================================ */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CITIES = JSON.parse(fs.readFileSync(path.join(__dirname, 'cities.json'), 'utf8'));
const BLOGP = path.join(__dirname, 'blog.json');
const BLOG = fs.existsSync(BLOGP) ? JSON.parse(fs.readFileSync(BLOGP, 'utf8')) : { pillars: [] };
const CFG = JSON.parse(fs.readFileSync(path.join(__dirname, 'communities.json'), 'utf8')).config;

const args = process.argv.slice(2);
const LIVE = args.includes('--live');
const ALLOW_STAGING = args.includes('--allow-staging');
const onlyCity = args.find(a => !a.startsWith('--'));

const WP_URL = (process.env.WP_URL || 'https://viphomepainting.com').replace(/\/$/, '');
const WP_USER = process.env.WP_USER;
const WP_PASS = process.env.WP_APP_PASSWORD;

/* Elementor's Canvas template renders NO theme header, footer or CSS.
   Our pages ship a complete document — their own topbar, nav and footer —
   and our stylesheet uses generic names (.body, .page, .sub, .ttl) plus bare
   section{} and body{} rules. Under any normal template those collide in both
   directions. Canvas removes the collision entirely rather than fighting it. */
const TEMPLATE = 'elementor_canvas';

/* ---------- discover what to publish, in parent-first order ---------- */
function discover() {
  const out = [];
  for (const c of CITIES.cities) {
    if (onlyCity && c.slug !== onlyCity) continue;
    const push = (rel, slug, parentPath, type) => {
      const f = path.join(ROOT, rel, 'index.html');
      if (fs.existsSync(f)) out.push({ file: f, rel, slug, parentPath, type, depth: rel.split('/').length });
    };
    push(c.slug, c.slug, null, 'city');
    for (const k of (c.child_communities || [])) {
      const s = String(k.url || '').split('/').filter(Boolean).pop();
      if (s) push(`${c.slug}/${s}`, s, c.slug, 'community');
    }
    if (c.hoa_page) push(`${c.slug}/${c.hoa_page.slug}`, c.hoa_page.slug, c.slug, 'hoa');
    for (const p of (BLOG.pillars || []).filter(p => p.city_slug === c.slug)) {
      push(`${c.slug}/${p.slug}`, p.slug, c.slug, 'pillar');
      for (const a of (p.cluster || [])) {
        push(`${c.slug}/${p.slug}/${a.slug}`, a.slug, `${c.slug}/${p.slug}`, 'article');
      }
    }
  }
  const sorted = out.sort((a, b) => a.depth - b.depth);   // parents before children
  /* --only=<slug> publishes one page, for a contained first test. Its parents
     still have to exist on WordPress or the child lands at the wrong path. */
  const only = (args.find(a => a.startsWith('--only=')) || '').split('=')[1];
  return only ? sorted.filter(p => p.slug === only) : sorted;
}

/* ---------- pull the parts out of a generated page ---------- */
function extract(file) {
  const html = fs.readFileSync(file, 'utf8');
  const one = (re) => { const m = html.match(re); return m ? m[1] : ''; };

  const styles = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n');
  const body = one(/<body>([\s\S]*?)<\/body>/)
    .replace(/<script>[\s\S]*?<\/script>/g, '')
    .trim();

  return {
    title: one(/<title>([^<]*)<\/title>/).replace(/\s*\|\s*VIP.*$/, '').trim(),
    fullTitle: one(/<title>([^<]*)<\/title>/),
    description: one(/<meta name="description" content="([^"]*)">/),
    canonical: one(/<link rel="canonical" href="([^"]*)">/),
    robots: one(/<meta name="robots" content="([^"]*)">/),
    jsonld: one(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/).trim(),
    styles, scripts, body
  };
}

/* The page now lives on WordPress, so every self-reference has to point there.

   The generated HTML carries the build-site canonical, and the build site is
   noindex. Publishing that verbatim would tell Google "the real version is at
   github.io" — and then tell it to ignore that one. A page that cancels itself.

   Rewritten in the JSON-LD too: @id, url and mainEntityOfPage all carry the
   build URL, and schema pointing at a noindexed twin is the same bug in a
   format Google reads more literally. */
function toWpUrl(buildUrl, siteBase, wpUrl) {
  return String(buildUrl).split(siteBase).join(wpUrl);
}
function rewriteCanonical(x, wpPageUrl) {
  const base = CFG.siteBase.replace(/\/$/, '');
  const out = { ...x };
  out.canonical = wpPageUrl;
  if (out.jsonld) out.jsonld = toWpUrl(out.jsonld, base, WP_URL);
  return out;
}

/* Assets are referenced relatively ("../../orange-county-sales-page/assets/x.png")
   because the build site serves them from a sibling folder. WordPress has no such
   folder, so every image 404s — confirmed on the first live publish, where the
   logo, badges and all viz photos came back broken.

   ASSET_BASE points them somewhere absolute. Default is the build host, which
   makes a test page render immediately. Before launch, upload the files to the
   WP media library and set ASSET_BASE to the uploads URL so nothing depends on
   github.io staying up. */
const ASSET_BASE = (process.env.ASSET_BASE || `${CFG.siteBase}/orange-county-sales-page`).replace(/\/$/, '');
function rewriteAssets(html) {
  return html.replace(/(?:\.\.\/)+orange-county-sales-page/g, ASSET_BASE);
}

/* The page content WordPress stores. Styles and scripts travel WITH the
   content so the page is self-contained and Canvas needs to supply nothing. */
function buildContent(x) {
  return rewriteAssets(`<!-- GENERATED by generator/publish-wp.js — do not edit in WordPress.
     Edit the data and re-run the generator; this page is overwritten on every publish. -->
<style>
${x.styles}
</style>
${x.body}
<script type="application/ld+json">
${x.jsonld}
</script>
<script>
${x.scripts}
</script>`);
}

/* ---------- WP REST ---------- */
async function wp(endpoint, opts = {}) {
  const auth = Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');
  const res = await fetch(`${WP_URL}/wp-json/wp/v2${endpoint}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
      ...(opts.headers || {})
    }
  });
  const text = await res.text();
  let json; try { json = JSON.parse(text); } catch { json = { raw: text.slice(0, 300) }; }
  if (!res.ok) throw new Error(`${res.status} ${endpoint} — ${json.message || json.raw || ''}`);
  return json;
}

const findBySlug = async (slug, parent) => {
  const q = await wp(`/pages?slug=${encodeURIComponent(slug)}&parent=${parent}&status=any&per_page=5&_fields=id,slug,parent,link`);
  return Array.isArray(q) && q.length ? q[0] : null;
};

/* ---------- main ---------- */
(async () => {
  const pages = discover();
  if (!pages.length) {
    console.log(`\nnothing generated${onlyCity ? ` for "${onlyCity}"` : ''} — run node generator/generate.js first\n`);
    process.exit(1);
  }

  console.log(`\nPUBLISH TO WORDPRESS — ${WP_URL}`);
  console.log(`${pages.length} page(s)${onlyCity ? `, city "${onlyCity}"` : ''}   template: ${TEMPLATE}`);
  console.log(LIVE ? '*** LIVE — this writes to WordPress ***' : 'DRY RUN — nothing will be written. Add --live to publish.');
  if (LIVE && CFG.staging && ALLOW_STAGING) {
    console.log('--allow-staging: publishing while config.staging is true.');
    console.log('These pages carry noindex, so Google will not index them. Correct for a');
    console.log('test; wrong for a launch. Flip config.staging when the whole site moves.');
  }
  console.log('');

  /* staging pages carry noindex; publishing those to the real domain would
     ship a live site nobody can find. Refuse rather than surprise. */
  if (LIVE && CFG.staging && !ALLOW_STAGING) {
    console.log('REFUSING TO PUBLISH: config.staging is true, so every page carries');
    console.log('noindex,nofollow. Publishing these to the real domain would put a site');
    console.log('live that Google is told to ignore.\n');
    console.log('At launch, in generator/communities.json:');
    console.log('  "staging": false');
    console.log(`  "siteBase": "${WP_URL}"`);
    console.log('then: node generator/generate.js && node generator/verify-site.js\n');
    process.exit(1);
  }

  if (LIVE && (!WP_USER || !WP_PASS)) {
    console.log('MISSING CREDENTIALS. Set these in your shell, never in the repo:\n');
    console.log('  WP_URL=https://viphomepainting.com');
    console.log('  WP_USER=<wp username>');
    console.log('  WP_APP_PASSWORD=<WP Admin -> Users -> Profile -> Application Passwords>\n');
    process.exit(1);
  }

  const idByPath = {};
  let created = 0, updated = 0, bytes = 0;

  for (const p of pages) {
    const wpPageUrl = `${WP_URL}/${p.rel}/`;
    const x = rewriteCanonical(extract(p.file), wpPageUrl);
    const content = buildContent(x);
    bytes += content.length;

    const parentId = p.parentPath ? (idByPath[p.parentPath] ?? '?') : 0;

    if (!LIVE) {
      idByPath[p.rel] = `<${p.slug}>`;
      console.log(`  ${p.type.padEnd(10)} /${p.rel}/`);
      console.log(`     slug "${p.slug}"  parent ${parentId}  ${(content.length / 1024).toFixed(0)}KB`);
      console.log(`     title  ${x.fullTitle.slice(0, 68)}`);
      console.log(`     canon  ${x.canonical}`);
      console.log(`     schema ${x.jsonld ? JSON.parse(x.jsonld)['@graph'].map(g => g['@type']).join(', ') : 'NONE'}`);
      if (x.robots && /noindex/.test(x.robots)) console.log(`     robots ${x.robots}   <-- staging`);
      continue;
    }

    const existing = await findBySlug(p.slug, parentId);
    const payload = {
      title: x.title,
      slug: p.slug,
      parent: parentId,
      status: 'publish',
      template: TEMPLATE,
      content,
      meta: {
        rank_math_title: x.fullTitle,
        rank_math_description: x.description,
        rank_math_canonical_url: wpPageUrl,
        rank_math_robots: /noindex/i.test(x.robots) ? ['noindex', 'nofollow'] : ['index', 'follow'],
        rank_math_rich_snippet: 'off'
      }
    };

    const saved = existing
      ? await wp(`/pages/${existing.id}`, { method: 'POST', body: JSON.stringify(payload) })
      : await wp('/pages', { method: 'POST', body: JSON.stringify(payload) });


    idByPath[p.rel] = saved.id;
    existing ? updated++ : created++;
    console.log(`  ${existing ? 'updated' : 'CREATED'}  ${saved.link}   (id ${saved.id})`);
  }

  console.log(`\n${LIVE ? `${created} created, ${updated} updated` : `${pages.length} pages would publish`} · ${(bytes / 1024 / 1024).toFixed(1)}MB of HTML total`);

  if (!LIVE) {
    console.log('\nBEFORE THE FIRST LIVE RUN — three things:');
    console.log('  1. Create an Application Password: WP Admin -> Users -> Profile');
    console.log('  2. Rank Math emits its own JSON-LD. Ours is richer and page-specific,');
    console.log('     so turn theirs off for Pages: Rank Math -> Titles & Meta -> Pages');
    console.log('     -> Schema Type: None. Two competing graphs is worse than one.');
    console.log('  3. Upload the 30MB of viz-photos to WP media, or the visualizer');
    console.log('     images will still be served from the old host.\n');
  }
})().catch(e => { console.error('\nFAILED: ' + e.message + '\n'); process.exit(1); });
