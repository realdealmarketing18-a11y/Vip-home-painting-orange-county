# Google Maps Local Pack + AI Search Playbook — VIP Home Painting

Goal: rank in the local 3-pack for "house painters Irvine / [community] painters"
and be the answer AI assistants give for luxury painting in Irvine.

**Reality check:** the local pack is ranked by Google Business Profile (GBP)
signals — relevance, proximity, prominence — not by landing pages alone. The
generated `/irvine/` pages handle every **on-site** signal; this checklist is
the **off-site** work that actually moves the pack. Nobody can guarantee #1,
but this is the complete signal set.

## 1. What the site now does automatically (done, per page)

- LocalBusiness (`HomeAndConstructionBusiness`) + `Service` + `FAQPage` +
  `BreadcrumbList` + speakable JSON-LD, with `hasMap` → GBP and
  `areaServed` geo-coordinates per community
- Answer Capsule under the hero (AI-engine citation block: who/where/what/
  price anchor/warranty/phone in one paragraph)
- Embedded Google Map of the community + NAP block (name, phone, hours,
  service area) — **identical NAP on every page**
- "See Us On Google" / "Open Google Maps" links (profile engagement signals)
- Visible FAQs that mirror the FAQPage schema exactly
- sitemap.xml + robots.txt; unique titles/H1s/layout order per community

## 2. Google Business Profile — the ranking engine (do these in GBP)

1. **Primary category:** Painter. Secondary: House Painter, Painting
   contractor (add all that apply — category is the #1 relevance signal).
2. **Service area:** add Irvine plus each village by name (Orchard Hills,
   Altair, Portola Springs, Hidden Canyon, Woodbury, Stonegate) — GBP allows
   up to 20 areas. Service-area business: keep address hidden, never fake one.
3. **Services list:** add each service (Exterior Painting, Interior Painting,
   Kitchen Cabinet Painting, Color Consultation) with descriptions that match
   the landing-page copy — same vocabulary, same phone.
4. **Website field:** point at the OC page; use UTM tags
   (`?utm_source=gbp&utm_medium=organic`) so you can prove pack traffic.
5. **Photos:** 3–5 real project photos per week, geotagged where honest
   (befores/afters, crew, cans/equipment — Graco/Titan rigs read as pro).
6. **Google Posts weekly**, each linking to one community page in rotation.
7. **Q&A:** seed and answer the questions customers actually ask (cost,
   HOA, timeline — reuse the page FAQs verbatim).
8. **Booking/quote link + phone** — keep the (909) 312-5400 number
   everywhere; call history is a prominence signal.

## 3. Reviews — the strongest prominence lever

- Ask every completed client, same-day, with a direct review link
  (`g.page/viphomepainting/review` style short link).
- Coach the ask: mention **city/community and service** naturally ("cabinet
  painting in Woodbury") — review keywords power "justifications" in the pack.
- Reply to 100% of reviews within 48h, naming the community and service in
  the reply (owner replies are indexed).
- Velocity beats volume: steady 2–4/month outranks a one-time burst.
- Never buy, gate, or incentivize reviews — that risks suspension, and the
  aggregate-rating claims on the site must stay backed by real reviews.

## 4. Citations — NAP consistency everywhere

Exact same Name / Phone / service-area on: Yelp, Angi, Houzz, Thumbtack,
HomeAdvisor, BBB, Nextdoor, Facebook, Instagram, Apple Business Connect,
**Bing Places** (feeds Copilot). Fix any old listings with different numbers
or names — inconsistency suppresses pack rankings. Add the CSLB license
number to profiles that support it (also a trust signal AI engines quote).

## 5. AI search (ChatGPT / Perplexity / Gemini / AI Overviews)

- The Answer Capsules + FAQPage schema are built for extraction — keep any
  future edits in that "direct answer, one paragraph, with price anchor and
  phone" format.
- Bing Places listing (Copilot pulls from Bing's local index).
- Consistent entity: same business description on GBP, Yelp, Facebook, site
  footer — AI engines cross-check sources before recommending.
- Earn 2–3 local mentions (Irvine community blogs, OC home-tour features,
  Nextdoor recommendations) — third-party corroboration is what makes AI
  engines name you instead of a directory.

## 6. Measurement

- GBP Performance tab monthly: calls, direction requests, website clicks
  per query ("painter near me" vs community names).
- Google Search Console: index coverage for `/irvine/*` + query report.
- Rich Results Test each page after generator changes (LocalBusiness + FAQ
  should both validate).
