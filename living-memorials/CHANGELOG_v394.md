# CHANGELOG — v394 — Living Echo Continuity Platform Repositioning

**Version:** v394
**Date:** 2026-06-19
**Release type:** Repositioning + new page
**Built by:** Claude (Anthropic)

## Release Summary

Upgraded the Living Echo section using the approved Titan page positioning
and the two approved Living Echo infographics. The existing personal
"Celebration of Life" content (grandmother tribute, Cory Pettit tribute,
Founder Echo program) was fully preserved per founder direction — the
enterprise continuity-platform framing was layered additively above it,
not in place of it.

## Assets Added

- `living-memorials/assets/living_echo_continuity_platform.png` (source)
- `living-memorials/assets/living_echo_continuity_platform.webp` (optimized, ~88% smaller)
- `living-memorials/assets/living_echo_estate_titan.png` (source)
- `living-memorials/assets/living_echo_estate_titan.webp` (optimized, ~86% smaller)

Simulated panel scores (9.1/10, 9.35/10) were NOT published on the public
site, per instruction.

## Main Page (`living-memorials/index.html`)

- Hero rebuilt: "Living Echo" / "Preserve what matters before it is lost." /
  new body copy naming families, veterans, fiduciaries, advisors, care teams,
  organizations. CTAs: Begin Your Living Echo, Preserve a Family Story,
  Explore Estate Professional Use, Talk to Pocono AI.
- Trust statement added near top.
- General infographic (`living_echo_continuity_platform`) added with
  `<picture>` WebP/PNG, lazy loading, tap-to-expand, full descriptive alt text.
- Six new accessible HTML sections added: The Problem, The Solution, Phased
  Development (4-phase roadmap), Who We Serve, Why Sentinel Node Matters,
  Ethics and Consent.
- Estate professionals cross-link card added.
- **All existing personal content preserved unchanged**: Celebration of Life,
  standing disclosure, concept video, Is/Is Not, Why Now, grandmother tribute,
  Cory Pettit tribute, Founder Echo program, pricing preview, funding link.

## New Page (`living-memorials/estate-professionals.html`)

- Distinct navy/gold professional visual register.
- Estate Titan infographic with `<picture>` WebP/PNG, lazy loading,
  tap-to-expand, full descriptive alt text.
- Sections: Why Estate Professionals Should Care, What Living Echo Adds,
  Professional Use Cases (6 cards), Fiduciary-Aware Guardrails with the
  required disclaimer.
- Return CTA to the main continuity platform page.
- No securities/funding language present (confirmed by sweep).

## Site-Wide Reference Updates

- `search-index.js`: living-memorials/ entry repositioned to Continuity
  Platform language; estate-professionals.html entry added (158→159 entries)
- `sitemap.xml`: estate-professionals.html added (152→153 URLs)
- `sitemap.html`: repositioned description, estate-professionals.html entry
  added (165→166 entries), v394 stamp
- `transparency.html`: v394 entry added, h1/site-version updated
- `audit.html`: v394 release entry added

## QA Results

23/23 implementation checklist items passed:
- Both images present, load correctly, optimized (WebP+PNG), descriptive alt text
- Main page still works at `/living-memorials/`
- Estate page reachable from main page and links back
- Infographic content repeated as accessible HTML on both pages
- No duplicate IDs introduced
- No resurrection/consciousness/autonomous-decision claims (only safe negations)
- No securities/funding/repayment language on continuity-platform or estate pages
- Fiduciary/legal-advice disclaimer present on estate page
- Simulated panel scores not published

## Internal Post-Implementation Self-Review

Five-round qualitative self-assessment against the supplied rubric (not an
actual 1,000-member panel — Claude's own structured QA judgment):
- Main page: ~9.0/10 (target 9.0+) — meets target
- Estate page: ~9.3/10 (target 9.25+) — meets target
- Full package: ~9.1/10 (target 9.3+) — near target, no blocking issues found
- Final decision: GO
