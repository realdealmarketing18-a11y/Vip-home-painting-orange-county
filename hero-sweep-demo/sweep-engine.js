/* =============================================================
   VIP BEFORE/AFTER SWEEP ENGINE  —  one engine, three skins.

   Replaces the two separate slider implementations already in the
   codebase (.ba-* on case studies, .vp-* in the visualizer) so the
   hero, the case studies and the visualizer all behave identically.

   Contract — any element with [data-sweep] and, inside it:
     [data-sweep-after]  the AFTER layer (gets clip-path)
     [data-sweep-seam]   the moving seam
     [data-sweep-cap]    optional caption that swaps mid-pass
   Options via attributes:
     data-sweep-auto="once"   run one cinematic pass when scrolled into
                              view, then hand control to the visitor
     data-sweep-hold="1100"   ms to sit on BEFORE before the pass
     data-sweep-dur="2600"    ms the pass takes
   ============================================================= */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MIN = 2, MAX = 98;

  /* Slow in, slow out — a wipe, not a swipe. */
  function ease(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function initSweep(frame) {
    var after = frame.querySelector('[data-sweep-after]');
    var seam  = frame.querySelector('[data-sweep-seam]');
    if (!after || !seam) return;

    var cap     = frame.querySelector('[data-sweep-cap]');
    var capFrom = frame.getAttribute('data-cap-before') || '';
    var capTo   = frame.getAttribute('data-cap-after')  || '';
    var hold    = parseInt(frame.getAttribute('data-sweep-hold') || '1100', 10);
    var dur     = parseInt(frame.getAttribute('data-sweep-dur')  || '2600', 10);
    var auto    = frame.getAttribute('data-sweep-auto') === 'once';
    /* The hero plate performs; it is not operated. Everywhere else the
       visitor gets the handle once the pass is done. */
    var canDrag = frame.getAttribute('data-sweep-drag') !== 'off';

    var pos = auto ? MAX : 50;
    var raf = null, dragging = false, handedOver = !auto;

    function setPos(p) {
      pos = Math.max(MIN, Math.min(MAX, p));
      after.style.clipPath = 'inset(0 0 0 ' + pos + '%)';
      seam.style.left = pos + '%';
      if (cap) cap.textContent = pos > 50 ? capFrom : capTo;
    }

    /* Once the pass is done the plate becomes a thing you can touch. */
    function handOver() {
      if (handedOver) return;
      handedOver = true;
      frame.classList.remove('is-sweeping');
      frame.classList.add('is-live');
    }

    function stopAuto() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      handOver();
    }

    function play() {
      if (REDUCED) { setPos(MIN); handOver(); return; }
      frame.classList.add('is-sweeping');
      frame.classList.remove('is-live');
      handedOver = false;
      setPos(MAX);
      setTimeout(function () {
        if (dragging) { handOver(); return; }
        var start = performance.now();
        (function tick(now) {
          var t = Math.min(1, (now - start) / dur);
          setPos(MAX - (MAX - MIN) * ease(t));
          if (t < 1) { raf = requestAnimationFrame(tick); }
          else { raf = null; handOver(); }
        })(performance.now());
      }, hold);
    }

    /* ---- visitor control ---- */
    if (canDrag) {
      var move = function (clientX) {
        var r = frame.getBoundingClientRect();
        setPos(((clientX - r.left) / r.width) * 100);
      };
      var rail = frame.querySelector('[data-sweep-rail]') || frame;
      rail.addEventListener('mousedown', function (e) { stopAuto(); dragging = true; move(e.clientX); e.preventDefault(); });
      window.addEventListener('mousemove', function (e) { if (dragging) move(e.clientX); });
      window.addEventListener('mouseup', function () { dragging = false; });
      rail.addEventListener('touchstart', function (e) { stopAuto(); dragging = true; move(e.touches[0].clientX); }, { passive: true });
      window.addEventListener('touchmove', function (e) { if (dragging) move(e.touches[0].clientX); }, { passive: true });
      window.addEventListener('touchend', function () { dragging = false; });

      /* keyboard — the plate is a real control, so it answers arrow keys */
      rail.setAttribute('tabindex', '0');
      rail.setAttribute('role', 'slider');
      rail.setAttribute('aria-label', 'Reveal the finished home');
      rail.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft')  { stopAuto(); setPos(pos - 4); e.preventDefault(); }
        if (e.key === 'ArrowRight') { stopAuto(); setPos(pos + 4); e.preventDefault(); }
      });
    }

    setPos(pos);
    frame.sweepPlay = play;

    if (auto) {
      var seen = false;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && !seen) { seen = true; play(); io.disconnect(); }
        });
      }, { threshold: 0.35 });
      io.observe(frame);
    } else if (!REDUCED && canDrag) {
      /* a small nudge so it reads as draggable */
      setTimeout(function () {
        var seq = [50, 38, 62, 50], i = 0;
        (function step() {
          if (i >= seq.length || dragging) return;
          setPos(seq[i++]); setTimeout(step, 380);
        })();
      }, 700);
    }
  }

  function boot() {
    document.querySelectorAll('[data-sweep]').forEach(initSweep);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }

  window.initSweep = initSweep;
})();
