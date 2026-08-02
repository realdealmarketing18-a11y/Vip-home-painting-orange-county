# HALO STRATEGY WORKSHEET — {CITY}

Copy this to `generator/research/{city}/07-VOICE.md` and fill it. Run by the
**vip-research-agent** skill.

Run per city. Refresh **quarterly**, and after **every 10 closed jobs** — Fabian's own
consult calls are a better source than the internet.

For each theme, capture the three most frequent expressions found, **verbatim**, with a
heat score 1-10 (frequency × emotional intensity).

> **No invented quotes. Ever.** Every line carries a source URL. Anything unsourced is
> marked `[VERIFY]` and may not be used in copy until it is.
>
> **A thin honest theme beats a padded one.** If a source was unreachable, write
> `[THIN — source blocked]` and say which. Padding poisons every headline downstream.

Run date: ____________  ·  Researcher: ____________

---

## THEME 1 — HOPES & DREAMS
*What she wants the house to be, in her words.*

| | Quote (verbatim) | Heat | Source URL |
|---|---|---|---|
| Most common | | | |
| 2nd | | | |
| 3rd | | | |

**Dominant feeling underneath:** ____________

---

## THEME 2 — PAINS & FEARS
*What keeps her from starting.* **This is the highest-value theme.**

> ⚠️ **Do not source this from Google reviews.** Reviews are written by the 3% who already
> bought, and verified on real Anaheim data they talk only about the crew — clean, on time,
> fair price. Fears live *pre*-purchase: forums, autocomplete, consult calls.

| | Quote (verbatim) | Heat | Source URL |
|---|---|---|---|
| Most common | | | |
| 2nd | | | |
| 3rd | | | |

**Dominant feeling underneath:** ____________
**Dollar cost of the fear coming true:** $____________

---

## THEME 3 — BARRIERS & UNCERTAINTIES
*What she'd need answered before she'd book. Objections, not fears.*

| | Quote (verbatim) | Heat | Source URL |
|---|---|---|---|
| Most common | | | |
| 2nd | | | |
| 3rd | | | |

**The one nobody in the market answers:** ____________

---

## GLOSSARY — verbiage, jargon, niche terms
*Her words, not the industry's.* **Minimum 15 lines.*

| term | what she means by it | where heard |
|---|---|---|
| e.g. "stuck" | has chosen nothing after months of looking | Nextdoor |

---

## WHAT SHE'S ALREADY TRIED AND WHY IT FAILED
**Minimum 5 entries.** The single richest content well in this document — each failed
attempt is one reel, one article, or one ad.

| attempt | why it didn't work | her exact words about it |
|---|---|---|

---

## NEIGHBORHOOD LAYER — one row per village

| village | architecture | light condition | design-review quirk | palette note |
|---|---|---|---|---|

---

## HALO MAP — who already holds her trust
*Borrowed trust. For each: what they want that costs no money.*

| who | reach | what they want that's free to give |
|---|---|---|
| Interior designers | | |
| Listing agents $2M+ | | |
| Stagers | | |
| Sherwin-Williams store staff | | |
| Flooring / cabinet installers | | |

---

## OUTPUT — what the copywriter actually uses

### Top 3 hair-on-fire concerns, ranked
1.
2.
3.

### Verbatim language bank — **minimum 20 lines**
`quote | source URL | theme | intensity`

### The gap statement
*One sentence on what nobody else in this market addresses.*

### Three hook candidates
*Drawn only from real quotes above. Cite the line each came from.*
1.
2.
3.

---

## SOURCES CHECKED THIS RUN
Tick what was actually mined. **Mark anything not checked** — an unchecked source is a
known hole, not a silent one.

- [ ] Google autocomplete — `curl "https://suggestqueries.google.com/complete/search?client=firefox&q=SEED"`
- [ ] Bing autocomplete — `curl "https://api.bing.com/osjson.aspx?query=SEED"`
- [ ] Apify Maps review text (Anaheim dataset `pw6djQiOl1uh6hDsq`) — **filter to painters**;
      the scrape also pulled windows, flooring, gutters and cabinet companies
- [ ] 1-star reviews of local painters *(where the barriers live)*
- [ ] 5-star reviews of local painters *(where the relief language lives)*
- [ ] Houzz threads — Firecrawl
- [ ] Sherwin-Williams color forums
- [ ] AnswerThePublic
- [ ] Reddit — ❌ *blocked for Firecrawl; needs an Apify Reddit actor*
- [ ] Nextdoor — ❌ *login-walled; Fabian can read his own village feeds*
- [ ] **Fabian's consult notes** — ⭐ *the best source. Ask for it every run.*
