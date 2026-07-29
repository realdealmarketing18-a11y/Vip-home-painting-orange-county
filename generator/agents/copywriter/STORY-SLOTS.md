# STORY SLOTS — the film hero and case studies

Both containers are **built and dormant**. They activate the moment their data exists.
Nothing to change in the generator when the Irvine films are ready — just fill these in.

---

## 1 · THE FILM HERO

Replaces the static poster hero automatically. Same cinematic shape as the OC page:
film background, storytelling headline, avatar pill, play gate, trust strip.

**Where it goes:** `hero_story` on a community object in `communities.json`, or on the
city object in `cities.json`.

```json
"hero_story": {
  "youtube_id": "",                        ← REQUIRED. Nothing renders without it.
  "headline": "Discover How VIP Home Painting Transformed <span class=\"gold\">the Ceasar &amp; Julie's Shady Canyon Home</span> in Just 4 Days",
  "eyebrow": "Irvine · Luxury Home Painting",
  "kicker": "With Custom Color Consultation",
  "client_name": "Ceasar & Julie",
  "client_location": "Shady Canyon, Irvine",
  "initials": "C&J",
  "avatar_photo": "assets/avatar-x.jpg",    ← optional; initials used if absent
  "play_label": "Watch the Film",
  "note": "Save thousands on consultants and avoid common painting mistakes.",
  "days": 4,                                ← drives the "N-Day Transformations" badge
  "thumbnail_url": ""                       ← optional; YouTube maxres used if absent
}
```

**The headline formula:** `Discover How VIP Home Painting Transformed [who]'s [place] in Just [N] Days`
Wrap the middle clause in `<span class="gold">` — that's what makes it italic gold.

**It uses the YouTube facade**, not a raw embed. The poster shows instantly and the player
only loads on click, so an unwatched film costs nothing in page weight.

---

## 2 · CASE STUDIES

The OC page's storytelling shape: avatar pill, tag, headline, draggable before/after slider,
drop-cap story paragraph, then Reason / Strategy / Mood.

**Where it goes:** `case_studies` array on a community object, and add `"caseStudy"` to that
page's `module_order`.

```json
"case_studies": [{
  "client_name": "Ceasar & Julie",
  "initials": "C&J",
  "client_location": "Shady Canyon, Irvine",
  "tag": "Home Exterior Painting",
  "headline": "Ceasar & Julie's Exterior Transformation in Shady Canyon, Irvine",
  "caption": "Unbelievable 4-Day Paint",
  "before_photo": "https://…",             ← REQUIRED
  "after_photo": "https://…",              ← REQUIRED
  "story": "One paragraph. Who they are, what they wanted, what we did.",
  "reason": "Why they repainted.",
  "strategy": "How the consultation guided the palette.",
  "mood": "The feeling of the result.",
  "is_representative": false                ← true adds a visible label
}]
```

Renders only when `headline` **and** `story` are both present.

---

## ⚠️ THE RULE THAT GOVERNS BOTH

**A named client story must be real, and used on exactly one page.**
Check `generator/registry/client-stories.json` before assigning one.

Currently verified:

| Story | Status | Where |
|---|---|---|
| Douglas & Sheri | ✅ verified | Pelican Hill, Newport Beach — used on the OC page |
| Ceasar & Julie | ✅ verified | **Shady Canyon, Irvine** — used on the OC page |
| Gallagher family | ⚠️ **not verified** | Higgsfield-rendered. Confirm before naming as a client. |

If no real story exists for a page, set `is_representative: true` and don't invent a name.
A board or a homeowner will call to check — this is the one place fabricated proof gets
caught by a person rather than an algorithm.

**Geography matters too.** A Newport Beach story heading an Orchard Hills page tells the
reader they're on the wrong page and dilutes the local relevance the page exists for.
