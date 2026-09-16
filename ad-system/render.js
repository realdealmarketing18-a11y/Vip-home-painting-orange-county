#!/usr/bin/env node
/**
 * VIP AD RENDERER
 * ===============
 * Walks ad.html frame by frame and writes PNGs, then muxes them to H.264.
 *
 *   node render.js                                   # the hero cut (stage 2, reel)
 *   node render.js --ad=stage1-hook --format=square
 *   node render.js --all                             # all 3 stages, all 3 formats
 *   node render.js --still=8.9                       # one frame, for checking a look
 *   node render.js --grid                            # with safe-area guides
 *   node render.js --mode=client                     # named-client cut (gated, see brand.json)
 *   node render.js --preview                         # just print the browser URL and exit
 *
 * WHY A LOCAL SERVER: ad.html fetches brand.json and ads.json. Under file://
 * Chromium blocks those as cross-origin, so we serve the repo root over http
 * and drive the page from there. It also means you can open the printed URL in
 * a normal browser and scrub the ad by hand.
 */
const http = require('http');
const fs   = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const HERE = __dirname;
const ROOT = path.resolve(HERE, '..');          // repo root - so ../orange-county-sales-page resolves
const OUT  = path.join(HERE, 'out');

const BRAND = JSON.parse(fs.readFileSync(path.join(HERE, 'brand.json'), 'utf8'));
const ADS   = JSON.parse(fs.readFileSync(path.join(HERE, 'ads.json'), 'utf8'));

/* ---------------- args ---------------- */
const argv = process.argv.slice(2);
const flag = (n, d) => {
  const hit = argv.find(a => a === `--${n}` || a.startsWith(`--${n}=`));
  if (!hit) return d;
  return hit.includes('=') ? hit.split('=').slice(1).join('=') : true;
};
const OPT = {
  ad:     flag('ad', 'stage2-demonstration'),
  format: flag('format', 'reel'),
  mode:   flag('mode', 'method'),
  grid:   !!flag('grid', false),
  still:  flag('still', null),
  all:    !!flag('all', false),
  noVideo:!!flag('no-video', false),
  preview:!!flag('preview', false),
  keepFrames:!!flag('keep-frames', false),
};

const KEEP_FRAMES = process.argv.includes('--keep-frames');

const MIME = { '.html':'text/html', '.json':'application/json', '.css':'text/css',
  '.js':'text/javascript', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg',
  '.webp':'image/webp', '.woff2':'font/woff2', '.svg':'image/svg+xml' };

function serve() {
  return new Promise(resolve => {
    const srv = http.createServer((req, res) => {
      const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '');
      const file = path.join(ROOT, rel);
      if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        res.writeHead(404); return res.end('not found');
      }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    });
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}

/**
 * Chromium to drive. If the sandbox ships a prebuilt browser (PLAYWRIGHT_BROWSERS_PATH),
 * use it rather than making npm fetch a matching build - the pinned playwright version
 * and the prebuilt revision rarely agree, and the render does not care.
 */
function chromiumPath() {
  for (const p of [process.env.VIP_CHROMIUM,
                   '/opt/pw-browsers/chromium',
                   path.join(process.env.PLAYWRIGHT_BROWSERS_PATH || '', 'chromium')]) {
    if (p && fs.existsSync(p)) return p;
  }
  return undefined; // let playwright resolve its own download
}

function ffmpegBin() {
  // Prefer a full build (needs libx264); the Playwright bundle cannot encode H.264.
  for (const p of [path.join(HERE, 'node_modules/ffmpeg-static/ffmpeg'),
                   path.join(ROOT, 'node_modules/ffmpeg-static/ffmpeg')]) {
    if (fs.existsSync(p)) return p;
  }
  try { return require('ffmpeg-static'); } catch { return null; }
}

async function renderOne(browser, base, adId, format) {
  const ad  = ADS[adId];
  const dim = BRAND.formats[format];
  const fps = BRAND.fps;
  const total = Math.round(ad.duration * fps);
  const dir = path.join(OUT, `${adId}-${format}`);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });

  const page = await browser.newPage({
    viewport: { width: dim.w, height: dim.h },
    deviceScaleFactor: 1,
  });
  const url = `${base}/ad-system/ad.html?ad=${adId}&format=${format}&mode=${OPT.mode}` +
              `&grid=${OPT.grid ? 1 : 0}&t=0`;
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction('window.__adReady === true', { timeout: 30000 });

  // Preload every image the timeline can touch, so no frame races a decode.
  await page.evaluate(async (paths) => {
    await Promise.all(paths.map(u => new Promise(r => {
      const i = new Image(); i.onload = i.onerror = r; i.src = u;
    })));
  }, [BRAND.paths.base, ...BRAND.schemes.map(s => BRAND.paths.viz + s.file)]);

  process.stdout.write(`  ${adId} / ${format}  ${dim.w}x${dim.h}  ${total} frames `);
  for (let f = 0; f < total; f++) {
    const t = f / fps;
    await page.evaluate(tt => window.__renderFrame(tt), t);
    await page.screenshot({ path: path.join(dir, `f-${String(f).padStart(5, '0')}.jpg`),
                            type: 'jpeg', quality: 94 });
    if (f % 60 === 0) process.stdout.write('.');
  }
  await page.close();
  console.log(' done');

  if (OPT.noVideo) return { dir, mp4: null };
  const ff = ffmpegBin();
  const mp4 = path.join(OUT, `vip-${adId}-${format}.mp4`);
  if (!ff) { console.log('  ! no ffmpeg with libx264 - frames only'); return { dir, mp4: null }; }
  execFileSync(ff, [
    '-y', '-framerate', String(fps), '-i', path.join(dir, 'f-%05d.jpg'),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4,
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
  const kb = Math.round(fs.statSync(mp4).size / 1024);
  console.log(`  -> ${path.relative(ROOT, mp4)}  (${kb} KB)`);

  // A poster frame for Meta's thumbnail picker: the chosen-scheme beat.
  const poster = path.join(OUT, `vip-${adId}-${format}-poster.jpg`);
  const pf = Math.min(total - 1, Math.round((ad.duration - 4.0) * fps));
  fs.copyFileSync(path.join(dir, `f-${String(pf).padStart(5, '0')}.jpg`), poster);

  // Frames are an intermediate, not a deliverable: ~900 MB per render if kept.
  if (!KEEP_FRAMES) fs.rmSync(dir, { recursive: true, force: true });
  return { dir, mp4 };
}

(async () => {
  const { chromium } = require('playwright');
  const srv  = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;

  if (OPT.preview) {
    console.log(`\nPreview URL (scrub by changing &t=):\n  ${base}/ad-system/ad.html` +
      `?ad=${OPT.ad}&format=${OPT.format}&mode=${OPT.mode}&grid=1&fit=1&t=3\n` +
      `Server stays up - Ctrl-C to stop.\n`);
    return; // leave the server running
  }

  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({
    executablePath: chromiumPath(),
    args: ['--force-color-profile=srgb', '--font-render-hinting=none'],
  });

  if (OPT.still !== null && OPT.still !== true) {
    const dim = BRAND.formats[OPT.format];
    const page = await browser.newPage({ viewport: { width: dim.w, height: dim.h }, deviceScaleFactor: 1 });
    await page.goto(`${base}/ad-system/ad.html?ad=${OPT.ad}&format=${OPT.format}` +
                    `&mode=${OPT.mode}&grid=${OPT.grid ? 1 : 0}&t=${OPT.still}`, { waitUntil: 'load' });
    await page.waitForFunction('window.__adReady === true', { timeout: 30000 });
    const out = path.join(OUT, `still-${OPT.ad}-${OPT.format}-t${OPT.still}.png`);
    fs.mkdirSync(OUT, { recursive: true });
    await page.screenshot({ path: out });
    console.log('still ->', path.relative(ROOT, out));
  } else {
    const jobs = OPT.all
      ? Object.keys(ADS).filter(k => !k.startsWith('_')).flatMap(a => ['reel', 'square', 'wide'].map(f => [a, f]))
      : [[OPT.ad, OPT.format]];
    console.log(`\nVIP ad render - mode=${OPT.mode}\n`);
    for (const [a, f] of jobs) await renderOne(browser, base, a, f);
  }

  await browser.close();
  srv.close();
  console.log('');
})().catch(e => { console.error(e); process.exit(1); });
