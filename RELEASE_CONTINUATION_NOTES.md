# RELEASE CONTINUATION NOTES — rolling
**Current shipped version: v358 `evidence-room` (2026-06-10).** Previous: v357 trust-banner consistency · v356/.1 trust-language hotfix + Quiet Mode · v355 buyer-conversion.

## State of the tree
**v358 added the flagship `evidence-room.html` (The Evidence Room)** — a self-contained, live, attackable SHA-256 chain of custody of the visitor's own session (`.evr-` scoped; zero deps; zero cookies/storage/network; Web Crypto + verified pure-JS fallback). Three-stage attack arc (edit→re-seal→forge) vs three custody layers (content seal→link→witness anchors), reviewer-attestation w/ amend-not-erase, generative head-hash seal, optional sonification, local .json/.txt packet export (audit-first). **Discovery (quiet by design):** Tools & Simulators hub card #1, trust.html cross-link band (before `#pressure-tested`), sitemap.html (127) / sitemap.xml (134 urls) / search-index (79). In the partial system; HITL banner present.
Carried forward unchanged: `pilot-program.html` canonical pilot offer (+`pricing.html` deep page w/ pointer — deliberate deviation from rebuild-plan §7); header = 7 buyer links + Hub pill + single "Request a Pilot" → `contact.html#pilot`. **Anchor contract (do not rename):** contact.html `#pilot #medical #legal #partner #investor #advisor #general`. audit.html title/site-version reconciled to v358 (had lagged at v355 — watch this; it lags when releases skip the audit-meta block).

## Conventions (carry verbatim)
- **Build:** `node tools/build-partials.js` (idempotent; SKIP_DIRS: documentation-hub, global). New root pages: bare `<!-- INCLUDE:HEADER --><!-- /INCLUDE:HEADER -->` (same for FOOTER) → build injects.
- **Footer label reaches partial-managed pages via build ONLY** — the 10 self-contained hub/global pages need a direct `>Transparency v35x<` sed every release (v357 HITL precedent; done again in v358).
- **Version bump:** extension-anchored `(\.(css|js|svg|png|jpg|jpeg|webp|ico|mp4|pdf))\?v=OLD → ?v=NEW` (preserves changelog prose) + exact codename-stamp replace (now `v358 2026-06-10 evidence-room`) + footer label + search-index.js header `Search Index v35x | NN entries` (bump count when adding entries) + styles.css stamp + sitemap.xml comment + audit.html "Release stamp"→"Previous releases" rotation.
- **Packaging:** FULL first: `cd /home/claude/v357 && zip -r -q /mnt/user-data/outputs/poconoai-full-vNNN.zip . -x '*.DS_Store'` → differential via `zip -q … -@ < difflist`. Five docs in site root before zipping: RELEASE_NOTES, CHANGELOG, CHANGE_MANIFEST (SHA-256 by edit class), TEST_REPORT (Result: PASS), this file rewritten.
- **Claim gates (run all, expect 0 after whitelists):** the v354.1 §2 phrase battery + `executed at engagement` + first-party `BAA included` + `executes a standard Business Associate` + zero-exfiltration variants (exclusions: zero-exfiltration-ai.html, attorneys-hub label, audit.html, trust-receipts receipt-01) + Mata/$110K on-line-attribution rule (Couvrette|Oregon) + persona scan (whitelist: simulation, transparency, audit, governance-dashboard, operational-artifacts — synthetic-data notices present). **v358 strongest-form variant: run each gate as a file-hit-count DELTA vs the pristine prior-release archive — expect identical counts.**

## Known pre-existing conditions (do not "fix" casually)
- `favicon.svg/.ico/-16/-32/-180.png`, `logo.svg`, `og-image.jpg`, `brand-v292.css` are **referenced by every page but absent from the repo archive** (deploy-side assets). Present in pristine v357 baseline identically. New pages should keep referencing them for consistency.
- audit.html: +5 unclosed-`<p>` pattern (HTML-legal); sitemap.html: 1 unclosed tag. Both pre-existing, byte-stable across v358.
- 3 literal `?v=357` strings live in audit.html changelog **prose** (incl. the v358 entry's own "?v=357 → ?v=358" sentence) — intentional, never sed these.

## Next-release candidates
- Evidence Room: optional deep-link `#exhibit-b` arrival mode; consider a footer "Deep Cuts"-style link once a footer pass is scheduled (deliberately NOT added in v358 to avoid a partials/nav change in a flagship-artifact release).
- og-image for evidence-room (room-specific seal render) when the deploy-side asset set is next touched.
