# viz-photos — drop your home photos here

Photos placed in this folder appear **automatically** in the Section 2
Custom Visualization preview with a smooth crossfade. No code changes needed.
Use `.jpg`, `.png`, `.jpeg`, or `.webp`. Landscape ~16:9, 1400px+ wide is ideal.

## Required names

### Before photo (original color scheme)
| File | Used as |
|---|---|
| `base.jpg` | BEFORE side of the visualizer **and** the hero before/after slider |

### After photos — one per color scheme (Step One)
| File | Palette |
|---|---|
| `scheme-shadow.jpg` | Shadow Slate · SW Iron Ore |
| `scheme-navy.jpg` | Estate Navy · SW Naval |
| `scheme-bronze.jpg` | Bronze Manor · BM Wenge |
| `scheme-greige.jpg` | Greige Estate · SW Accessible Beige |
| `scheme-sand.jpg` | Coastal Sand · SW Natural Linen |
| `scheme-sage.jpg` | Sierra Sage · BM Sea Salt |
| `scheme-fog.jpg` | Newport Fog · SW Repose Gray |
| `scheme-cashmere.jpg` | Cashmere Cream · BM White Dove |

### Optional — Steps Two/Three/Four additions
These override the scheme photo when the visitor taps that option
(most-specific photo wins).

| File | Option |
|---|---|
| `light-modern-sconce.jpg` | Step 2 · Modern Sconce |
| `light-classic-lantern.jpg` | Step 2 · Classic Lantern |
| `light-coach-pendant.jpg` | Step 2 · Coach Pendant |
| `siding-lap-vinyl.jpg` | Step 3 · Lap Vinyl |
| `siding-cedar-shake.jpg` | Step 3 · Cedar Shake |
| `siding-hardie-board.jpg` | Step 3 · Hardie Board |
| `premium-glass-garage.jpg` | Step 4 · Glass Garage |
| `premium-natural-stone.jpg` | Step 4 · Natural Stone |
| `premium-stone-columns.jpg` | Step 4 · Stone Columns |

## Behavior
- Selection with a photo → the AFTER side **crossfades** to that photo
  (slow, elegant zoom-settle, like the motionsites.ai solar example).
- Selection without a photo yet → falls back to the color-tint preview.
- The before/after drag slider keeps working on top of everything.

Tip: generate the after photos with Higgsfield/Gemini from your base photo,
one render per Sherwin-Williams scheme, then save them here with the names above.
