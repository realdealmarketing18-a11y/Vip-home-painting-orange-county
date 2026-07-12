# Orange County Sales Page — VIP Home Painting

The luxury Orange County landing page + interactive Section-2 color/addition visualizer
for VIP Home Painting (Newport Beach · Irvine · Coto de Caza).

## Files
```
index.html            The whole page (design-system CSS inlined — one file to edit).
viz-photos/           All 131 images: base villa, 11 color schemes, 99 combos, 9 addition shots.
serve-oc.js           Local preview server → http://localhost:5460/
COLOR-SCHEMES.md      Every photo mapped to its exact Sherwin-Williams colors + materials.
commercial-prompts.md 8K commercial-grade image prompts (schemes + additions) for Higgsfield/Seedance.
.nojekyll             Lets GitHub Pages serve the files as-is.
```

## Preview locally
```
node serve-oc.js      # then open http://localhost:5460/
```

## The interactive visualizer (Section 2)
- **Step 1 — Color Schemes:** 11 full-look palettes (Bold & Modern, Warm & Earthy,
  Subtle & Elegant, Spanish Revival, Ultra-Luxury Resort).
- **Steps 2–4 — Additions:** lighting fixtures, siding materials, premium garage/stone —
  each rendered on every scheme (99 combos) so the chosen color never resets.
- Full spec + file naming in `COLOR-SCHEMES.md`.

## Brand
Colors: Orange #E8833A · Navy #1A1F4E · Gold #C9A961. Fonts: Fraunces + Inter.
Phone (909) 312-5400 · viphomepainting.com · "See It. Love It. Paint It."
Never use the word "AI" in customer-facing copy — always "Custom Visualization Service."
