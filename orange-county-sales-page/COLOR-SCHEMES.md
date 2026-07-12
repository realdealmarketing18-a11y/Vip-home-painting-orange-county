# Section 2 — Visualizer Assets & Color-Scheme Reference

Master reference for the "See Your Orange County Home In Every Color" interactive
visualizer (Section 2 of the sales page). Everything here maps a **photo file** to
its **exact paint colors + materials** so any image can be recreated or refined.

- **Base home:** Grand Mediterranean Revival villa, Pelican Hill, Newport Beach (dusk/twilight exterior).
- **Photos live in:** `photos/` (backup copy) — canonical copies also in
  `../github-sales-page/viz-photos/` (what the live site serves).
- **Render engine:** Higgsfield Nano Banana Pro / Nano Banana 2, image-to-image off `base.webp` (architecture locked).
- **Naming rule for combos:** `<category>-<option>--<scheme>.jpg`
  (e.g. `light-led-slot-sconce--euro.jpg` = LED sconce on the Euro-Industrial scheme).

---

## Base photo
| File | What it is |
|---|---|
| `base.webp` | Original villa — the BEFORE side of the slider + hero. All renders derive from this. |

---

## THE 11 COLOR SCHEMES (Step One)
Each is a COMPLETE look: body + trim + columns + lighting + stucco texture + garage + stone.
Ratio = 60 body : 30 trim : 10 accent.

### Bold & Modern
| # | Scheme (file `scheme-<id>.jpg`) | Body (60) | Trim/Fascia (30) | Accent / Garage / Stone (10) | Lighting | Texture |
|---|---|---|---|---|---|---|
| 1 | **Obsidian Monolith** · `scheme-obsidian.jpg` | SW Iron Ore 7069 | SW Tricorn Black 6258 | Smoked glass-panel garage (matte-black frames) · charcoal Silver Quartzite ledger stone pillars · columns monolithic Iron Ore | 48" matte-black vertical LED slot sconces | Ultra-smooth level-5 matte stucco |
| 2 | **Riviera Tuxedo** · `scheme-riviera.jpg` | SW Snowbound 7004 | SW Black Magic 6991 | Mirror black glass garage · deep black split-face slate pillars · Black Magic column caps | Square-profile matte-black aluminum sconces | Fine-grain sand-finish stucco |
| 3 | **Euro-Industrial Estate** · `scheme-euro.jpg` | SW Peppercorn 7674 | SW Cityscape 7067 | Frosted glass garage (silver aluminum frames) · gray architectural concrete pillars · Cityscape stepped columns | Brushed gunmetal cylinder up/down lights | Smooth-coat stucco + horizontal reveals |

### Warm & Earthy
| # | Scheme | Body (60) | Trim (30) | Accent / Garage / Stone (10) | Lighting | Texture |
|---|---|---|---|---|---|---|
| 4 | **Coastal Organic Compound** · `scheme-organic.jpg` | SW Alabaster 7008 | SW Urbane Bronze 7048 | Western Red Cedar plank garage · cream limestone split-face pillars · cedar-slat-wrapped columns | Oil-rubbed bronze geometric coach pendants | Smooth organic lime-wash stucco |
| 5 | **Pacific Sage Estate** · `scheme-pacificsage.jpg` | SW Evergreen Fog 9130 | SW Shoji White 7042 | White-oak-look steel garage · dry-stack golden sandstone pillars · Shoji White columns | Hand-rubbed antique brass transitional lanterns | Roman-clay / hand-troweled stucco |
| 6 | **Ibiza Luxury Villa** · `scheme-ibiza.jpg` | SW Balanced Beige 7037 | SW Aesthetic White 7035 | Walnut-toned wood garage · cross-cut ivory travertine pillars · Balanced Beige columns | Hammered copper oversized lanterns | Coarse Mediterranean pitted stucco |

### Subtle & Elegant
| # | Scheme | Body (60) | Trim (30) | Accent / Garage / Stone (10) | Lighting | Texture |
|---|---|---|---|---|---|---|
| 7 | **Newport Admiral** · `scheme-admiral.jpg` | SW Repose Gray 7015 | SW Pure White 7005 | SW Naval 6244 door/shutters · satin-etched white glass garage · light-gray New England fieldstone pillars | Heavy-cast matte-black gas-look lanterns | Smooth-sand finish stucco |
| 8 | **Marine Layer** · `scheme-marinelayer.jpg` | SW Sea Salt 6204 | SW High Reflective White 7757 | SW Oyster Bay 6206 shutters · white carriage garage w/ top windows · ice-gray split granite pillars | Polished stainless steel coach pendants | Ultra-clean modern smooth stucco |
| 9 | **Pebble Beach Manor** · `scheme-pebblebeach.jpg` | SW Accessible Beige 7036 | SW Dover White 6385 | SW Garret Gray 6075 painted-wood garage · multi-color bluestone pillars · Dover White columns | Dark antique bronze scrolling wall sconces | Fine English-cotta-texture stucco |

### Premium Styles
| # | Scheme | Body (60) | Trim (30) | Accent / Garage / Stone (10) | Lighting | Texture |
|---|---|---|---|---|---|---|
| 10 | **Santa Barbara Luxe** (Modern Spanish Revival) · `scheme-spanish.jpg` | SW Alabaster 7008 | SW Tricorn Black 6258 (thin roofline trim) | Espresso-stained arched wood garage · Santa Barbara sandstone pillars · **clay-tile roof kept** · Alabaster columns | Large black wrought-iron scroll lanterns | Hand-troweled smooth white stucco |
| 11 | **Beverly Hills Resort** (Ultra-Luxury Transitional) · `scheme-resort.jpg` | SW City Loft 7631 (monochrome — body+trim+columns) | SW City Loft 7631 | Seamless glass garage (bronze frames) · honed Portuguese limestone pillars · **roof updated charcoal-black** | Flush-mounted bronze recessed downlights | Flawless level-5 smooth stucco |

---

## THE 9 ADDITIONS (Steps Two–Four)
Two files per addition: a **product thumbnail** (`thumb-*.jpg`, catalog shot) shown on
the option button, and the **on-house render** (`<cat>-<option>.jpg`, addition on the
base villa) shown when tapped. Combos apply the addition ON each scheme (see below).

### Step Two · Lighting Fixtures  (category `light`)
| Option | Thumbnail | On-house render | Description |
|---|---|---|---|
| LED Slot Sconce | `thumb-light-led-slot-sconce.jpg` | `light-led-slot-sconce.jpg` | 48" matte-black vertical LED slot sconces |
| Iron Scroll Lantern | `thumb-light-iron-scroll-lantern.jpg` | `light-iron-scroll-lantern.jpg` | Black wrought-iron scroll lanterns, seeded amber glass |
| Bronze Coach Pendant | `thumb-light-bronze-coach-pendant.jpg` | `light-bronze-coach-pendant.jpg` | Oil-rubbed bronze geometric hanging coach pendants |

### Step Three · Siding Options  (category `siding`)
| Option | Thumbnail | On-house render | Description |
|---|---|---|---|
| Cedar Shake | `thumb-siding-cedar-shake.jpg` | `siding-cedar-shake.jpg` | Honey-toned cedar shake on tower + gables |
| Board & Batten | `thumb-siding-board-batten.jpg` | `siding-board-batten.jpg` | Vertical board-and-batten, body-color, on tower + above garages |
| Stacked Stone Veneer | `thumb-siding-stacked-stone-veneer.jpg` | `siding-stacked-stone-veneer.jpg` | Cream/tan dry-stack ledgestone wainscot band |

### Step Four · Premium Additions  (category `premium`)
| Option | Thumbnail | On-house render | Description |
|---|---|---|---|
| Smoked Glass Garage | `thumb-premium-smoked-glass-garage.jpg` | `premium-smoked-glass-garage.jpg` | Smoked glass-panel doors, matte-black aluminum frames |
| Walnut Wood Garage | `thumb-premium-walnut-wood-garage.jpg` | `premium-walnut-wood-garage.jpg` | Walnut-toned horizontal wood-plank doors |
| Limestone Pillars | `thumb-premium-limestone-pillars.jpg` | `premium-limestone-pillars.jpg` | Driveway pillars reclad in honed Portuguese limestone |

---

## THE 99 COMBOS (addition × scheme)
Every addition rendered ON every color scheme, so a chosen scheme never resets when
an addition is tapped. File pattern: **`<category>-<option>--<scheme>.jpg`**

- **Categories/options:**
  `light-led-slot-sconce`, `light-iron-scroll-lantern`, `light-bronze-coach-pendant`,
  `siding-cedar-shake`, `siding-board-batten`, `siding-stacked-stone-veneer`,
  `premium-smoked-glass-garage`, `premium-walnut-wood-garage`, `premium-limestone-pillars`
- **Scheme ids (11):**
  `obsidian`, `riviera`, `euro`, `organic`, `pacificsage`, `ibiza`,
  `admiral`, `marinelayer`, `pebblebeach`, `spanish`, `resort`

Example: `siding-cedar-shake--spanish.jpg` = cedar shake on the Santa Barbara Luxe scheme.
Total = 9 options × 11 schemes = **99 files**.

---

## SCHEME DATA (as coded in the site)
This is the exact `SCHEMES` array from `index.html` (Section 2 JS) — the swatch colors
shown on each palette card. Keep this in sync if you rename/recolor.

```js
const SCHEMES = [
  { id:'obsidian',    name:'Obsidian Monolith',        sw:'SW Iron Ore · Tricorn Black',        style:'bold',    main:'#434341', trim:'#2F2F30', accent:'#5B5E62' },
  { id:'riviera',     name:'Riviera Tuxedo',           sw:'SW Snowbound · Black Magic',         style:'bold',    main:'#EDEAE0', trim:'#2A2A2C', accent:'#3B3B3E' },
  { id:'euro',        name:'Euro-Industrial Estate',   sw:'SW Peppercorn · Cityscape',          style:'bold',    main:'#585A5C', trim:'#9A9C98', accent:'#7E8285' },
  { id:'organic',     name:'Coastal Organic Compound', sw:'SW Alabaster · Urbane Bronze',       style:'earthy',  main:'#EDEAE0', trim:'#54504A', accent:'#9C7B53' },
  { id:'pacificsage', name:'Pacific Sage Estate',      sw:'SW Evergreen Fog · Shoji White',     style:'earthy',  main:'#95978A', trim:'#E6DFD3', accent:'#A98D4B' },
  { id:'ibiza',       name:'Ibiza Luxury Villa',       sw:'SW Balanced Beige · Aesthetic White',style:'earthy',  main:'#D1C7B8', trim:'#E8E3DA', accent:'#C8B59B' },
  { id:'admiral',     name:'Newport Admiral',          sw:'SW Repose Gray · Pure White',        style:'subtle',  main:'#CCC9C0', trim:'#F0EFE9', accent:'#2F2F30' },
  { id:'marinelayer', name:'Marine Layer',             sw:'SW Sea Salt · Hi-Reflective White',  style:'subtle',  main:'#CDD2CA', trim:'#F7F7F1', accent:'#BFC7C5' },
  { id:'pebblebeach', name:'Pebble Beach Manor',       sw:'SW Accessible Beige · Dover White',  style:'subtle',  main:'#D1C7B8', trim:'#EFE8D8', accent:'#95948C' },
  { id:'spanish',     name:'Santa Barbara Luxe',       sw:'SW Alabaster · Tricorn Black',       style:'spanish', main:'#F1EDE2', trim:'#2F2F30', accent:'#B5714A' },
  { id:'resort',      name:'Beverly Hills Resort',     sw:'SW City Loft · Bronze',              style:'resort',  main:'#D6D2C9', trim:'#D6D2C9', accent:'#8C6E4C' }
];
```

Style tabs: `all`, `bold` (Bold & Modern), `earthy` (Warm & Earthy),
`subtle` (Subtle & Elegant), `spanish` (Spanish Revival), `resort` (Ultra-Luxury Resort).
