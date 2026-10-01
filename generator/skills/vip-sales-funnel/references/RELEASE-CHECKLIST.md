# RELEASE CHECKLIST — one page, before it goes to Fabian for approval

## Files
- [ ] `research/{city}/07-VOICE.md` exists (city-level buyer language)
- [ ] `research/{city}/stories/{slug}.STORY.md` filled, or the page is knowingly on the Gallagher placeholder
- [ ] Page record has `storyLayout`, `layoutOptions`, `story`, `master.reveal`, `master.flashback`
- [ ] `campaigns/{city}/{slug}/ADS.md` written from the same story

## Gates (all green, in this order)
- [ ] `node generator/validate-brief.js {city}`
- [ ] `node generator/generate.js`
- [ ] `node generator/verify-site.js`
- [ ] `node generator/verify-layouts.js` — opens with The Reveal, steps in standard order, unique H2s, form after pain, markers balanced
- [ ] `node generator/swap-checklist.js` — remaining SWAP markers are the ones you meant to leave

## Eyes on it
- [ ] 390px phone width: no sideways scroll
- [ ] Visualizer: a scheme click and an option click both change the stage
- [ ] Before/after sliders drag
- [ ] Photo form: adding a photo enables Send
- [ ] Title, meta description, canonical, robots and H1 unchanged unless the brief changed them

## Hand-off
- [ ] One commit per page, message says what changed and every judgment call
- [ ] Branch pushed (never `main`, never force); HANDOFF.md updated
- [ ] Fabian approves → merge → `publish-wp.js` dry run → Fabian runs `--live`
