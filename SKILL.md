# SKILL.md — VIP Home Painting Design System

> Activate this skill when designing any customer-facing surface for **VIP Home Painting** — sales pages, community landing pages, email, print collateral.

## When to use
- User mentions VIP Home Painting, the paintbrush-crown logo, "Visualize it. See it. Paint it.", or asks for a sales page in the SoCal luxury painting space.
- Any task that touches the brand's gold (#FF8210) + navy (#262362) + beige + cream palette.

## Read these in order
1. `README.md` — full brand voice, content fundamentals, visual foundations, iconography rules.
2. `colors_and_type.css` — every design token. Import once: `<link rel="stylesheet" href="colors_and_type.css">`.
3. `ui_kits/sales-page/index.html` — the canonical mobile sales page. Copy patterns from here.
4. `reference/Sales-Page-Copy-Template-1.md` — exact approved copy for the Inland Empire sales page.

## Hard rules (do not break)
- **Never** write the words "AI" or "AI-generated" in customer copy. The visualization service is "Custom Visualization Service," "VIP Concierge," or "our design team."
- **Never** use the words "discount," "cheap," "save big." Use "investment," "estate," "irresistible estimate," "save $1,000's on consultants."
- **No emoji.** Use Lucide icons or the gold-laurel PNG badges.
- **Shadows are navy-based** (`rgba(38, 35, 98, x)`) — never pure black.
- **Mobile-first, max-width 520px.** Single column. Don't widen.
- **Section background rhythm** alternates: white → beige → white → navy → white. Never two same-color sections back-to-back.
- **Headlines:** Fraunces SemiBold/Bold, with the key phrase highlighted in `--vip-gold`.
- **CTAs:** ALL CAPS, gold-gradient pill, italic small-caps sub-line, `--shadow-cta`.
- **Drop caps** on case-study lead paragraphs only — Fraunces Bold, gold, 4.5em.
- **Trust badges** are PNG (gold laurel). Do not recreate as SVG.

## Voice cheat sheet
- "CLAIM FREE COLOR CONSULTATION"
- "IRRESISTIBLE PAINTING ESTIMATES INCLUDED"
- "OUR INSANE 1-YEAR WARRANTY"
- "FREE 30-Minute Personalized Color Consultation"
- "Transform your home into a beautiful and relaxing retreat."
- "No Questions Asked."
- Always specific: name the homeowner ("Douglas & Sheri"), the city ("Sierra Lakes, Fontana"), the duration ("In Just 4 Days").

## Component starter map
| Need | Pattern in `ui_kits/sales-page/index.html` |
|---|---|
| Hero | `.hero` — overline + Fraunces H1 with `.accent` highlight + avatar pill + gold-bordered video + bold body + CTA + trust-row |
| Process steps | `.steps` + `.step-num` (gold-gradient circles, 1./2./3.) |
| Case study | `.case-tag` + `.dropcap.first` + `.case-detail` rows + repeat CTA |
| Warranty | `.warranty-wrap` with the gold-laurel PNG, drop-shadow + hover scale |
| Pillars | `.pillars` / `.pillar` with `.pillar-num` navy circles |
| Reviews | `.review` cards with gold stars and Google badge |
| Stats | `.stats` / `.stat` rows (5★ · 100% · 120+) |
| Final CTA | `section.dark` (navy) with progress bars and second CTA |
| Sticky mobile CTA | `.sticky-cta` (navy bar with gold pill) |

## Asset inventory
- `assets/logos/vip-logo-primary.png` — primary brushcrown lockup
- `assets/logos/vip-logo-stacked.png` — split stacked version
- `assets/badges/vip-warranty-laurel.png` — Insane 1-Year Warranty laurel
- `assets/badges/vip-custom-color-schemes.png` — Custom Color Schemes laurel
- White-knockout logo NOT supplied → flag if needed on dark surface.

## Substitution flags (raise to user)
- **Real photography** — current build uses Unsplash placeholders. Ask user for owned photography (Newport Beach / Irvine / Rancho Cucamonga estates, before/after pairs, team headshots).
- **Real client headshots** — avatar pills currently use initial monograms.
- **YouTube embeds** — currently styled placeholders. Swap in real `<iframe>` embeds when video IDs are provided.
- **White-on-navy logo** — not supplied; ask before using on dark surfaces.
- **Custom icon set** — currently using Lucide as a stand-in for the brand-tinted custom icon set spec'd in the original asset guide.

## Don't bulk-import
The original `SALES-PAGE-DESIGN/` folder has 14+ subfolders for hero, social-proof, pain-points, etc. — most are empty or hold artifact-guide MDs. Pull only what you need.
