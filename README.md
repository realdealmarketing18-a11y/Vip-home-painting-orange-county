# VIP Home Painting — Design System

> **Visualize It. See It. Paint It.**
> The premium $10,000 sales-page aesthetic for VIP Home Painting — a luxury residential painting company serving Southern California's affluent homeowners ($2M–$20M homes) across the Inland Empire, Orange County, and Los Angeles.

This design system is the source of truth for every VIP Home Painting touchpoint: mobile-first sales pages, community-specific landing pages, and any future marketing surface. It encodes the **paintbrush-crown** brand mark, the gold/navy/beige palette, the Fraunces + Inter type pairing, and the 3D-pop card vocabulary that separates VIP from cheap-contractor competitors.

---

## Index — what's in this system

| File / folder | What's inside |
|---|---|
| `README.md` | This file. Brand context, content + visual foundations, iconography. |
| `SKILL.md` | Agent Skill manifest — how Claude (Code or otherwise) should pick up this system. |
| `colors_and_type.css` | All design tokens — colors, type ramp, spacing, radii, shadows, gradients, motion. Import this once. |
| `assets/logos/` | Paintbrush-crown logo (primary + stacked split). |
| `assets/badges/` | Gold laurel trust badges — "Custom Color Schemes" and "Our Insane 1-Year Warranty". |
| `assets/icons/` | Brand-styled icons (subset; see ICONOGRAPHY below). |
| `fonts/` | Webfonts — currently Google-hosted via `colors_and_type.css` (see Fonts note). |
| `preview/` | Design-system specimen cards rendered in the Design System tab. |
| `ui_kits/sales-page/` | Hi-fi React UI kit recreating the mobile sales page. Click-thru prototype lives at `index.html`. |
| `reference/` | Source materials — copy template, asset guide, design prompt — preserved for reference. |

---

## Sources & inputs

The system was built from these inputs (paths are read-only mounts from the user's machine — included here so a downstream agent can re-attach):

- `SALES-PAGE-DESIGN/Sales-Page-Copy-Template-1.md` — full copy template for the Inland Empire sales page (12 sections, real client stories: Miguel & Karla, Douglas & Sheri, Ceasar & Julie).
- `SALES-PAGE-DESIGN/assets/ASSET-GUIDE.md` — original asset guide (older brand notation: Cormorant Garamond + Montserrat + Poppins; superseded by **Fraunces + Inter** per current brand rules).
- `SALES-PAGE-DESIGN/assets/logos/` — primary and stacked logo PNGs.
- `SALES-PAGE-DESIGN/assets/Badges/` — gold laurel badge PNGs.
- `Sales-Page-10k-Design/CLAUDE-DESIGN-PROMPT.md` — the "$10k vibe" anti-slop framework brief.
- Three uploaded reference PNGs (logo + 2 badges).

> **Note:** The asset guide and the brand rules disagree on type and orange hex. We follow the user's explicit brand rules: **VIP Gold #FF8210**, **Fraunces** (headlines), **Inter** (body/UI). The legacy `#e8833a` orange is treated as a near-equivalent hover/deep tone, not the primary.

---

## Brand at a glance

- **Company:** VIP Home Painting — luxury residential painting, SoCal.
- **Differentiator:** Custom Visualization Service — photorealistic renders of a homeowner's house in multiple color schemes before painting begins.
- **Tagline:** "Visualize it. See it. Paint it."
- **Logo:** Paintbrush whose bristles form a crown — navy ferrule with gold accents and a black handle.
- **Persona:** Affluent SoCal homeowners ($2M–$20M homes) who value sophistication, low-friction concierge service, and zero risk of repaint regret.
- **Phone:** (909) 312-5400 · **Web:** viphomepainting.com
- **Critical rule — never write "AI" in customer copy.** The visualization service is described as "Custom Visualization Service," "VIP Concierge," or "our design team."

---

## CONTENT FUNDAMENTALS

VIP copy reads like a sophisticated direct-response sales page wearing a luxury tuxedo. It's persuasion-led, but every word feels chosen — never pushy, never discount-coded.

### Voice & tone
- **Confident, never timid.** "Discover how VIP Home Painting **transformed** Miguel & Karla's home in just 4 days." Past-tense success language, not future-tense hope.
- **Outcome-focused, not feature-focused.** Talks about *transformation*, *standing out*, *peace of mind* — not paint chemistry.
- **Premium, never cheap.** The word "discount" never appears. Use **"investment," "estate," "project," "irresistible estimate."** Even pricing copy is recoded as value: "IRRESISTIBLE PAINTING ESTIMATES INCLUDED."
- **Reassuring on risk.** Constantly reframes the worry: "Avoid Costly Mistakes," "No Questions Asked," "Backed by 1-Year Warranty," "Save $1,000's on expensive consultants."
- **Specific, named, local.** Every story names the homeowner ("Douglas & Sheri"), the neighborhood ("Sierra Lakes, Fontana"), and the duration ("In Just 4 Days"). Generic luxury language is paired with concrete proof.

### Casing rules
- **Headlines (H1/H2):** Title Case With Capitalized Words, even mid-phrase. "Avoid Costly Mistakes—Our Free Consultation Ensures Your Home Stands Out."
- **Overlines (eyebrows above headlines):** ALL CAPS, wide letter-spacing, often city-prefixed: `INLAND EMPIRE CUSTOMIZED HOME PAINTING SERVICES`.
- **CTA buttons:** ALL CAPS. "CLAIM FREE COLOR CONSULTATION."
- **Body copy:** Sentence case. Friendly, conversational.
- **Sub-CTAs / kickers under buttons:** Often italic + small caps. "(SAVE $1,000'S ON EXPENSIVE CONSULTANTS…)"

### Person, voice
- **"You" addressed throughout.** "Your home," "Your dream," "Trust us to get the job done." Reader is the hero of the story.
- **"We" / "Our" for VIP.** Warm and personal — it's a team, not a corporation. "Our team of skilled painters," "We stand behind our work."
- **Third-person case studies** for social proof: "Douglas and Sheri, longtime residents of Fontana, wanted to make their Sierra Lakes home truly their own."

### Vibe
- **Aspirational SoCal luxury** + **direct-response confidence.** It's an Architectural Digest aesthetic with a long-form sales letter underneath.
- **Trust signals are loud.** "OUR INSANE 1-YEAR WARRANTY" gold laurel badges. ★★★★★ Google reviews with full names and dates. Specific numbers: "120 Projects Done," "100% Client Satisfied," "5 Star Reviews."
- **Story over features.** Three full case studies (Miguel & Karla, Douglas & Sheri, Ceasar & Julie) built around drop-cap paragraphs and BEFORE/AFTER video.

### Emoji & punctuation
- **No emoji.** Ever. Replaced with branded icons (gold checkmarks, circle "?" badge, numbered step circles, gold laurel).
- **No exclamation pile-ups.** One per section, max — usually on the warranty line ("No Questions Asked.").
- **Em-dashes (—)** for emphasis. "Avoid Costly Mistakes—Our Free Consultation…"
- **Specific dollar signs** ("$1,000's," "$2M–$20M homes") used as concrete proof, never as discount.

### Specific phrasing — copy-paste ready
- "Visualize It. See It. Paint It."
- "Custom Visualization Service" / "VIP Concierge" / "design team" *(never "AI")*
- "OUR INSANE 1-YEAR WARRANTY"
- "FREE 30-Minute Personalized Color Consultation"
- "CLAIM FREE COLOR CONSULTATION"
- "IRRESISTIBLE PAINTING ESTIMATES INCLUDED"
- "Transform your home into a beautiful and relaxing retreat."
- "No Questions Asked."

---

## VISUAL FOUNDATIONS

### Colors
- **VIP Gold `#FF8210`** — every primary CTA, every accent highlight inside headlines, the orange "See it" in the tagline. Used **sparingly** — gold is a spotlight.
- **Bright Gold `#FFB200`** — laurel-wreath badge accents, 5-star icons, warm gold reflections.
- **Deep Navy `#262362`** — primary text on light, dark sections, all shadows are navy-based (never pure black).
- **Warm Beige `#BAAEA1`** — secondary section backgrounds, alternating with white. Soft tint `#E8E0D6` for ultra-subtle backgrounds.
- **Pure White `#FFFFFF`** — primary surface.
- **Cream `#F8F7F4`** — alternative warm-white for premium sections.

**Section background rhythm (top → bottom):** white → beige → white → navy → white. Never two same-color sections back-to-back.

### Typography
- **Fraunces (variable serif)** — every headline (H1/H2/H3/H4) and the H1 callout in the hero. Optical-size axis tuned to display at large sizes; we use Semi-Bold (600) by default for headlines and Bold (700) for max-impact.
- **Inter (sans)** — body, labels, buttons, captions, navigation. Weights: Regular 400, Medium 500, Semi-Bold 600, Bold 700.
- **Drop caps** on case-study paragraphs — Fraunces Bold, gold (`#FF8210`), 3.6× line-height, classic editorial styling.
- **Type ramp** is encoded as CSS vars (`--fs-display` → `--fs-caption`) in `colors_and_type.css`.

### Spacing & layout
- **Mobile-first, max-width 520px**, content centered. Desktop is the same column with more breathing room around it (no multi-column reflows; the 520 max is intentional — preserves the editorial sales-letter feel).
- **8pt grid** — `--sp-1` (4px) through `--sp-24` (96px). Section padding `var(--section-pad-y)` = 64px on mobile.
- **Generous whitespace** between sections — premium pages breathe. Density is the enemy of luxury.

### Backgrounds & imagery
- **Solid color sections, alternating** — no overused gradient washes. The page rhythm is the visual story.
- **One brand gradient — gold** — used only on CTA buttons (subtle 3-stop) and the optional shimmer-on-hover sweep. Never used as a section background.
- **Imagery is warm, golden-hour, SoCal luxury** — Newport Beach, Irvine, Rancho Cucamonga estates. Never gray suburban tract homes. Photos run 4:5 or 16:9, generous radii, navy shadows beneath.
- **No hand-drawn illustrations.** No emoji. No clip-art.
- **Full-bleed video embeds** for each case study — YouTube embed, orange border frame, BEFORE/AFTER overlay label.

### Animation & motion
- **Scroll-reveal** on every major section: fade + 16px translate-up, 720ms, `cubic-bezier(0.22, 1, 0.36, 1)` (easing token `--ease-out-soft`).
- **3D pop on cards** — subtle `scale(1.02)` + lifted navy shadow on hover.
- **CTA shimmer** — gold gradient sweeps left → right across the button on hover (animated background-position, ~1200ms).
- **No bounces, no springs, no overshoots.** Motion is calm, expensive, deliberate.
- **No looping ambient animations** — every motion is in response to the user (scroll, hover, tap).

### Interaction states
- **Hover (CTA):** gold gradient deepens; shimmer band sweeps once; shadow intensifies (`--shadow-cta-hover`).
- **Hover (card):** `translateY(-2px)`, shadow steps from `--shadow-md` → `--shadow-pop`.
- **Hover (link):** color shift to `--vip-gold-deep`; underline appears with 100ms ease.
- **Press / active:** `scale(0.98)` on tap, snap easing — adds tactility on mobile.
- **Focus:** 2px gold outline at 3px offset (never the browser default).

### Borders
- **Hairline** `1px solid rgba(38, 35, 98, 0.10)` — default card/divider stroke.
- **Soft** `1px solid rgba(38, 35, 98, 0.18)` — emphasized.
- **Gold** `2px solid #FF8210` — video embed frames, featured-card outlines.

### Shadows (always navy-based)
- `--shadow-xs` — subtle separation (1px).
- `--shadow-sm` — buttons at rest.
- `--shadow-md` — cards at rest.
- `--shadow-lg` — pricing/featured cards, modals.
- `--shadow-pop` — the signature 3D-pop combo (deep + tight) for tactile cards.
- `--shadow-cta` / `--shadow-cta-hover` — gold-tinted glow under primary CTAs.

### Cards
- **Radius:** `--radius-lg` (20px) for content cards; `--radius-md` (14px) for inline chips.
- **Padding:** `--sp-6` (24px) interior padding minimum; `--sp-8` (32px) for premium cards.
- **Surface:** white with hairline border + `--shadow-md`. Elevated/featured cards get `--shadow-pop` + a 2px gold border.
- **3D pop variant:** `transform: translateY(-1px)` + `--shadow-pop` on rest, `translateY(-3px)` + `--shadow-lg` on hover.

### Buttons
- **Primary CTA:** full-width on mobile, gold gradient (`--grad-gold`), white uppercase Inter Bold, `--radius-pill`, `--shadow-cta`, optional sub-line below in italic small caps.
- **Secondary:** outlined navy on white. `--border-soft`, navy text, hover fills navy with white text.
- **Tertiary / link:** gold underline-on-hover.

### Iconography (high level — see ICONOGRAPHY)
- **Lucide** as the icon library (CDN, default stroke 1.5–2px, navy or gold).
- **Custom badge graphics** (gold laurel) for trust signals — these are PNG photoreal renders, not flat SVG.
- **Numbered circle steps** ("1.", "2.", "3.") rendered as solid-gold circles with white Fraunces numerals.
- **Checkmarks** are solid gold, filled circle, white check inside — used in feature lists.

### Transparency, blur, glass
- Sparingly. The brand is **solid, confident, opaque**. Glass/blur shows up only on the sticky mobile header (a 90% white blur backdrop) and on dialog overlays (navy 60% with 12px blur).

### Layout fixed elements
- **Sticky CTA bar on mobile** — bottom-fixed gold-gradient button after hero scrolls past. White scrim above for legibility.
- **Sticky logo header** — top, blur backdrop, 64px tall.

### Forms / inputs (popup modal pattern)
- Every CTA opens a **modal popup form** with photo upload (per brand rule). White card, 28px radius, navy heading, inputs with `--border-soft` and 12px radius, primary submit is the gold gradient button. Photo upload zone is dashed navy at 30% opacity.

---

## ICONOGRAPHY

VIP Home Painting uses **two parallel icon systems** that should never be mixed in the same context.

### 1. Functional UI icons → **Lucide via CDN**
- Loaded from `https://unpkg.com/lucide-static@latest/icons/<name>.svg` or via `lucide-react`.
- **Stroke weight:** 1.5px for inline use, 2px for emphasis.
- **Size:** 20px (inline labels), 24px (default), 32px (feature lists), 48px+ (hero accents).
- **Color:** `--vip-navy` for default, `--vip-gold` for accent / on-CTA, `--fg-inverse` (white) on dark sections.
- **Rounded line caps and joins**, never sharp.
- **Substitution flag:** the original asset guide proposes a custom 1.5px-stroke icon set in the brand orange/navy/gold palette. We're substituting Lucide as the closest CDN-available equivalent with matching stroke weight + rounded caps. Flag this if a custom set later arrives.

**Icons we use (mapped from copy template):**
- `phone` — click-to-call (909) 312-5400
- `mail` — contact email
- `map-pin` — service-area map / community pages
- `calendar` — booking widget
- `check-circle` (filled gold) — feature checklists
- `star` (filled gold #FFB200) — reviews
- `palette` — Custom Visualization Service
- `paintbrush` — services nav
- `shield-check` — warranty / guarantee
- `clock` — process timeline
- `chevron-right` — service-card "Learn More"
- `chevron-down` — collapsed FAQ
- `play-circle` (gold) — video play overlay
- `instagram`, `facebook` — footer social
- `quote` — testimonial decoration

### 2. Trust badges → **bespoke gold-laurel PNG artwork**
- Photoreal 3D renders. Never flat. Never recreated as SVG.
- Used at hero (paired side-by-side) and at the warranty section (single, large).
- Files: `assets/badges/vip-warranty-laurel.png`, `assets/badges/vip-custom-color-schemes.png`.
- The paintbrush-crown logo is the centerpiece of every laurel badge.

### Numerals (process steps)
- Rendered as a solid gold circle (32–48px) with the Fraunces SemiBold numeral inside in white.
- Trailing period after the number ("1.", "2.", "3.") — matches the copy template.

### Drop caps
- The first letter of case-study paragraphs in Fraunces Bold, sized 3.6× the body, colored gold. Acts as both decoration and reading anchor. Encoded as `.vip-dropcap` in `colors_and_type.css`.

### What we do NOT use
- **No emoji.** Anywhere.
- **No unicode-character icons** (★, ✓, →, etc.) in production. Use the proper SVG.
- **No flat single-color illustration.** No isometric line art. No hand-drawn doodles.
- **No SVG recreation of the warranty laurel** — keep it as the photoreal PNG.

### Logo
- **Primary (color, on white):** `assets/logos/vip-logo-primary.png` — the paintbrush-crown above "VIP HOME PAINTING / Visualize it. See it. Paint it."
- **Stacked split:** `assets/logos/vip-logo-stacked.png` — "VIP [brush-crown icon] PAINTING" + "HOME PAINTING SERVICES" subline.
- **Clear-space rule:** minimum margin = the height of the "V" in VIP on all sides.
- **Never** stretch, recolor, or place on conflicting (orange, beige, busy photo) backgrounds. On dark surfaces, use the stacked split with white wordmark (currently flag — the white-knockout version isn't supplied; ask the user for it before using on navy).

---

## Fonts — substitution flag

The current brand rule is **Fraunces (headlines) + Inter (body)**. The original asset guide referenced Cormorant Garamond + Montserrat + Poppins.

We're loading **Fraunces** and **Inter** from Google Fonts via `colors_and_type.css`. Both are open-source and a perfect match for the brand rule — no substitution required. If you'd like local TTF/WOFF2 files for Figma or offline use, ask and we'll vendor them into `fonts/`.

---

## How to use this system

1. **Import the tokens:** `<link rel="stylesheet" href="colors_and_type.css">` once.
2. **Reference assets** from `assets/logos/`, `assets/badges/`, `assets/icons/`.
3. **For new screens, start from `ui_kits/sales-page/`** — it has the hero, video story card, process-steps, case-study, warranty badge, testimonials, and the popup CTA modal.
4. **Follow the brand rules at the top of this file** — especially the no-AI naming and the navy-shadow rule.
5. **For new agents:** read `SKILL.md`.

---

*VIP Home Painting Design System · v1.0 · Premium $10k aesthetic*
