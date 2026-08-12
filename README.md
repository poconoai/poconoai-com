# Pocono AI — Static Site Build System

This is a static HTML site. There is no framework, no database, no build pipeline beyond a single Python script. The deployed site is the flat root directory of expanded `.html` files.

---

## Quick edit workflow

1. **To change global navigation:** edit `header.html` (a single file).
2. **To change global footer:** edit `footer.html` (a single file).
3. **To change a page's content:** edit `src/<page>.html` — NOT the root-level `<page>.html`.
4. **Run the build:** `python3 build.py`
5. **Commit and push** the expanded files at the root.

The site source of truth is `src/`. The repo root contains the deployed output.

---

## Why source/output split

A pure in-place build (markers in the same file you edit) would require manually re-inserting the markers after every build run, because the build replaces the markers with their expanded content. That defeats the maintainability goal.

`src/` holds the editorial source with `<!-- INCLUDE: ... -->` markers preserved. The root holds the deployable output that GitHub Pages serves. The two are kept in sync by `build.py`. GitHub Pages configuration does not change — the repo root is still publishable.

---

## Directory layout

```
.
├── header.html              shared header + nav (edit this for global nav changes)
├── footer.html              shared footer (edit this for global footer changes)
├── build.py                 the build script
├── README.md                this file
├── src/                     SOURCE files (edit these)
│   ├── index.html
│   ├── for-physicians.html
│   └── ... (one file per page)
├── *.html                   DEPLOYED files (generated — do not edit by hand)
├── *.css, *.js, *.png, ...  static assets (edit directly; not part of the include system)
└── build_backups/           timestamped backups of overwritten output (auto-created)
```

---

## Build commands

```bash
python3 build.py              # build src/*.html -> root *.html
python3 build.py --check      # dry-run, report only, no writes
python3 build.py --verbose    # show per-file action
```

The build:

- Reads every `src/*.html` file.
- Replaces `<!-- INCLUDE: header.html -->` with the contents of `header.html`.
- Replaces `<!-- INCLUDE: footer.html -->` with the contents of `footer.html`.
- Backs up any root-level page about to be overwritten into `build_backups/<timestamp>/`.
- Writes the expanded HTML to the root.
- Skips files whose expanded output is identical to the current output (idempotent re-run).
- Prints warnings for pages missing expected markers — but does not block the build.

---

## Pages with custom headers or footers

Most pages use the shared header and footer. A small number do not, on purpose:

**No header or footer (one-pagers, dev pages):**
- `local-ai-empire-v2.html`
- `nurses-one-pager.html`

**Standard header, custom footer (intentional editorial choice):**
- `404.html` — minimal error page footer
- `empire-v2.html`, `playground.html`, `resonance-mandala.html` — internal/dev pages
- `constitutional-question-of-ai.html` — institutional whitepaper footer
- `research.html` — research-hub-specific footer

These pages are listed in `build.py` constants (`EXEMPT_FROM_HEADER`, `EXEMPT_FROM_FOOTER`, `CUSTOM_FOOTER_OK`) and do not trigger missing-marker warnings.

---

## Cache-busting version strings

All CSS/JS includes use `?v=NNN` query strings for cache busting. The version is currently `v305`. When updating site assets:

1. Edit the version inside `header.html` (this is the source of truth for the global version).
2. Run `python3 build.py` to propagate.
3. If any individual page links to a versioned asset outside the header, update it in that page's `src/` file too.

---

## What the build does NOT do

- It does not minify or transform HTML in any way.
- It does not modify CSS, JS, images, PDFs, or other static assets.
- It does not touch `sitemap.xml`, `robots.txt`, `search-index.js`, or `BUILD_MANIFEST.json` (those are maintained by hand or other scripts).
- It does not add external dependencies. The expanded HTML is byte-for-byte what gets served — no client-side fetch, no JavaScript-based includes, no runtime template engine.

---

## Safety

- Every overwrite of a root-level page is backed up first to `build_backups/<YYYYMMDD_HHMMSS>/`.
- Backups can be browsed or deleted manually; they are not committed to git (add `build_backups/` to `.gitignore` if you haven't already).
- The build refuses to run if `header.html`, `footer.html`, or `src/` is missing.
- Idempotent: running the build twice in a row produces no second-build changes.
- Marker collisions (page contains both the marker and a raw `<header>` or `<footer>` element) are reported as warnings.

---

## Rolling back

If a build produced bad output, the previous version is in the most recent `build_backups/<timestamp>/`. Copy the backed-up file back to the root, fix the source in `src/`, and re-run the build.

---

## Troubleshooting

**"missing header include marker" warning on a page:**
The page in `src/` has neither the `<!-- INCLUDE: header.html -->` marker nor an exemption. Either add the marker or add the page to `EXEMPT_FROM_HEADER` in `build.py`.

**"page contains BOTH the header marker AND raw `<header role="banner">`" warning:**
A previous in-place edit left both. Open the `src/` file and remove the duplicate raw `<header>` block.

**Page styling broken after build:**
Check that the page's `src/` file still has `<link rel="stylesheet" href="styles.css?v=306">` and the other CSS includes. The build does not insert these — they come from the page's own `<head>`.
