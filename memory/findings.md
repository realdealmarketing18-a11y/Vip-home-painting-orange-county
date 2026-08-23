# Findings — research, discoveries, constraints

Layer: **Project memory** (B.L.A.S.T. Protocol 0).

**The full register lives at `generator/research/_global/MEMORY.md`** — findings `M-01…M-10`
and failures `F-01…F-16`, with the promotion rule (a finding is *Candidate* until it holds in
a second city). This file is the short version: the findings that changed what we build.

---

## The one that defines the offer

Across ~50 painters in Irvine and Anaheim, **zero** carry a review tag about visualization or
seeing the result first. The Custom Visualization Service is genuinely uncontested, so every
page leads with it.

The buyer is **regret-averse, not price-sensitive**. They can afford the repaint. What they
can't afford is five figures on a colour they end up hating, on a house the neighbours see
every day.

---

## Findings that changed the plan

| ID | Finding | What we do differently |
|---|---|---|
| **M-05** | Domain authority barely matters here. Universal Coat ranks #3 in Anaheim at DR 0.2; VIP is DR 0 — level with page one, not behind. | **Don't buy links.** The gap is page count, not authority. |
| **M-06** | AI engines cite blog posts, not sales pages. CertaPro has 313 citations; one post earns 55 while hundreds of landing pages earn none. The engines that matter are **Copilot 50%** and **Google AI Mode 36%** — not ChatGPT. | Build the article page type. Copilot runs on Bing, so **Bing Places and Bing Webmaster Tools beat any ChatGPT tactic.** |
| **M-07** | Google reviews are written by the 3% who already bought — useful for Barriers, useless for Pains and Fears. | Copy targets the **97% who are stalling**. Their language comes from the Halo worksheet, not from reviews. |
| **M-01** | Review bar is ~55–60 in the target packs. VIP has **9**. | The review engine is a gating task, not a nice-to-have. |
| **M-03** | No competitor has community-level pages. | The community page type is the wedge. |
| **M-04** | Directories own half of page one. | Rank the pages *and* the directory listings. |
| **M-08** | The Maps dataset contains non-painters — 11 of 25. | Never trust a scraped competitor set unfiltered. |
| **M-09** | The missing free tool (GSC) beats the paid one. | Connect Search Console before buying anything. |
| **M-10** | Three tools blocked by the same domain problem. | Fix the domain question first; it unblocks several at once. |

---

## Constraints discovered the hard way

- **Anaheim is a different tier from Irvine.** Anaheim Hills median $1,134,500 — below
  Stonegate, Irvine's *entry* tier. Anaheim copy leads on value transparency, not Irvine's
  estate register.
- **Name collisions across cities are real.** Anaheim has a "Hidden Canyon"; so does Irvine,
  and Irvine's page was already live. Excluded deliberately.
- **Paid SEO tools are blocked.** Ahrefs MCP returns "Insufficient plan" on every paid
  endpoint; DataForSEO returns 403. Free tools only until the domain question is settled.
- **The visualizer builds image URLs at runtime** from two JS arrays — 11 schemes × 9 options.
  Scoping assets by scanning markup misses 99 files (F-16).
- **This environment cannot screenshot a hidden browser pane**, and `requestAnimationFrame`
  does not fire there either — rAF-driven behaviour must be shimmed before it can be tested,
  or it reports phantom bugs.
