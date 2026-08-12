# BUILD_NOTES.md — Pocono AI (v349)

## Partial System Overview

The Pocono AI site uses a **build-time** partial injection system for the shared
header and footer. After the build runs, every page contains normal static HTML —
there are **no runtime JavaScript includes, no server-side includes, and no
framework dependency**. The deployed site works if opened directly and is fully
crawlable. GitHub Pages requires no special configuration.

### Canonical sources (edit these, not individual pages)

| File | Purpose |
|------|---------|
| `partials/header.html` | THE canonical header. Contains all four header components: `<header role="banner">`, the `#nav-drop-root` dropdowns, the `#search-panel`, and the `#mobile-nav-panel`. |
| `partials/footer.html` | THE canonical 6-column footer (Product / Governance / Architecture / Resources / Company / Deep Cuts). |
| `tools/build-partials.js` | Node.js build + migration script. |

There is **one** canonical header source and **one** canonical footer source.
The old root-level `header.html` (v343) has been deprecated and moved to
`archive/header-v343-deprecated.html`. Do not reintroduce a root header.

### Include marker format

```html
<!-- INCLUDE:HEADER -->
... generated header (DO NOT EDIT BY HAND) ...
<!-- /INCLUDE:HEADER -->
```
```html
<!-- INCLUDE:FOOTER -->
... generated footer (DO NOT EDIT BY HAND) ...
<!-- /INCLUDE:FOOTER -->
```

**Never hand-edit the content between INCLUDE markers.** Edit the partial, re-run
the build. The script overwrites everything between the markers.

## How to run

```bash
# From the site root:
node tools/build-partials.js            # live build
node tools/build-partials.js --dry-run  # show what would change, write nothing
node tools/build-partials.js --verbose  # per-file detail incl. migrations
```
Requires Node.js (any recent version). No `npm install` needed.

## Legacy marker migration (completed in v348)

Earlier releases used a multi-block legacy marker system:

```
<!-- PARTIAL:header START --> ... <!-- PARTIAL:header END -->
<!-- PARTIAL:nav-drop-root START --> ... <!-- PARTIAL:nav-drop-root END -->
<!-- PARTIAL:search-panel START --> ... <!-- PARTIAL:search-panel END -->
<!-- PARTIAL:mobile-nav START --> ... <!-- PARTIAL:mobile-nav END -->
<!-- PARTIAL:footer START --> ... <!-- PARTIAL:footer END -->
```

The v348 build script automatically:
1. Collapses the four consecutive header-region blocks into a single
   `INCLUDE:HEADER` block (and also handles pages missing the `PARTIAL:header START`
   marker by anchoring on the raw `<header role="banner">` tag).
2. Converts the `PARTIAL:footer` block — or a bare `<footer>…</footer>` with no
   markers — into a single `INCLUDE:FOOTER` block.
3. Injects the current canonical partial content into both.

This migration is idempotent: once a page uses INCLUDE markers, re-running only
re-injects current partial content. A second run reports 0 updates.

## Intentional exceptions (SKIP_FILES)

These pages are deliberately excluded from header/footer injection:

| Page | Reason |
|------|--------|
| `404.html` | GitHub Pages error page; minimal custom layout. |
| `plain.html` | Intentionally minimal/stripped, readability-first layout. |
| `portal.html` | Standalone portal with custom navigation. |
| `playground.html` | Developer sandbox; no nav. |
| `resonance-mandala.html` | Standalone generative-art page; no nav. |
| `empire-v2.html` | Standalone game; custom full-screen layout. |
| `header.html` | (Now archived.) Was the legacy source artifact, never a public page. |

Skipped directories: `partials/`, `tools/`, `archive/`, `node_modules/`, `.git/`,
and any `output*/build/dist/backup/packages/_site` folder.

## Navigation final form (v348)

**Header (lean):** Home · Physicians · Attorneys · Solutions ▾ · Architecture ·
Pricing · Company ▾ · Contact. The Easter egg is **not** in the header.

**Footer (6 columns):** Product / Use Cases · Governance / Trust · Architecture /
Technical · Resources · Company · Deep Cuts. The Strategic AI What-If Scenario
Engine appears subtly under **Deep Cuts** only (plus sitemap.html and the
cleverness page).

## Version / cache-bust convention

- HTML comment (line 2): `<!-- v349 YYYY-MM-DD description -->`
- Asset cache-busts: `?v=349` (CSS, JS, logo)
- Footer label: `Transparency v349`
- All `?v=348` normalised to `?v=349` in this release (the only residual `?v=348`/`?v=343`
  strings are historical prose inside the audit.html changelog and are intentionally preserved).
- v349 added the flagship `sentinel-trial-room.html` (Sentinel Trial Room) — a self-contained
  interactive governance demonstration (plain HTML/CSS/vanilla JS, no external deps). It is in the
  partial system (carries INCLUDE:HEADER / INCLUDE:FOOTER) and is linked from the Solutions
  dropdown, mobile menu, and footer.

## Search index

`search-index.js` is a **curated** index (~60 entries), **not** an exhaustive
sitemap. To add a page to on-site search, append an entry and bump the count in the
header comment. The full page list lives in `sitemap.xml` / `sitemap.html`.

## Pricing reference

Service pricing uses **"starting at $1,495/month"** for Phase II. The only `$1,450`
on the site is a RAM hardware component cost in `sentinel-specs.html` (not a
service price).

## KNOWN: binary assets not bundled in this working tree

This working tree is **HTML/text-complete** but does **not** contain the binary
assets that pages reference. These are confirmed to exist on the production
GitHub Pages server and their references are intentionally preserved (standing
policy: do not modify links to files confirmed to exist server-side). They must be
present in the deployed site:

- `logo.svg`, `favicon.svg`, `favicon.ico`, `favicon-16x16.png`,
  `favicon-32x32.png`, `favicon-180x180.png`
- `brand-v292.css`
- architecture/infographic PNGs (e.g. `arch-*.png`, `*-infographic-*.png`)
- whitepaper PDFs (e.g. `Pocono_AI_*.pdf`, `assets/pdf*/...pdf`)
- team photos (`assets/images/team/*.jpg`)
- hero/loop videos (`*.mp4`)
- Open Graph image (`og-image.jpg`)

When producing a deploy-ready FULL bundle, overlay these binary assets on top of
this tree. See RELEASE_CONTINUATION_NOTES.md for the full list and counts.

## Hard rules

- Edit partials, never the generated nav/footer inside individual pages.
- Final deployed HTML is static and crawlable.
- No runtime include dependency, no framework, no server-side includes.
- Surgical/additive changes; never modify links to files confirmed server-side.
- Never overclaim on HIPAA/legal/compliance; all citations factual.

## v358 note

- v358 added the flagship `evidence-room.html` (The Evidence Room) — a self-contained live tamper-evidence
  artifact (plain HTML/CSS/vanilla JS, zero external deps, `.evr-` scoped styles). It is in the partial system
  (carries INCLUDE:HEADER / INCLUDE:FOOTER) and is linked from the Tools & Simulators hub index, trust.html,
  sitemap.html/xml, and the search index. Asset cache-busts normalised ?v=357 → ?v=358 site-wide; stamps and
  footer Transparency labels updated to `v358 2026-06-10 evidence-room`.
