#!/usr/bin/env node
/**
 * tools/build-partials.js — Pocono AI v396
 *
 * Build-time partial injection + legacy migration for the Pocono AI static site.
 *
 * Usage:
 *   node tools/build-partials.js [--dry-run] [--verbose]
 *
 * MODES OF OPERATION (per file, applied in order):
 *   1. LEGACY MIGRATION — if a page uses the old PARTIAL:* marker system, the
 *      consecutive header-region blocks (PARTIAL:header START … through the last
 *      of nav-drop-root / search-panel / mobile-nav END) are collapsed into a
 *      single <!-- INCLUDE:HEADER --> … <!-- /INCLUDE:HEADER --> block, and the
 *      PARTIAL:footer block (or a bare <footer>…</footer> with no markers) is
 *      wrapped in <!-- INCLUDE:FOOTER --> … <!-- /INCLUDE:FOOTER -->.
 *   2. INJECTION — content between INCLUDE markers is replaced with the current
 *      canonical partial (partials/header.html, partials/footer.html).
 *
 * The deployed HTML is fully static after build. No runtime JS includes,
 * no server-side includes, no framework. GitHub Pages safe.
 *
 * Marker format:
 *   <!-- INCLUDE:HEADER -->  …generated…  <!-- /INCLUDE:HEADER -->
 *   <!-- INCLUDE:FOOTER -->  …generated…  <!-- /INCLUDE:FOOTER -->
 *
 * IMPORTANT: Edit partials/header.html or partials/footer.html, then re-run.
 * Do NOT hand-edit content between INCLUDE markers in individual pages.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ─── Configuration ───────────────────────────────────────────────
const SITE_ROOT    = path.resolve(__dirname, '..');
const PARTIALS_DIR = path.join(SITE_ROOT, 'partials');

const SKIP_DIRS = new Set([
  'partials', 'tools', 'node_modules', '.git',
  'output', 'outputs', 'build', 'dist', 'archive', 'backup', '_site', 'packages',
  'documentation-hub',  // v352: self-contained hub pages with their own Documentation-Hub nav
  'global',             // v353: self-contained Global Federated Rollout hub with its own header/footer
  'living-memorials',   // v359: self-contained Living Memorials (founder project), own header/footer
  'sentinel-home',      // v361: self-contained Sentinel Home Edition page, own root-relative nav
  'advertising',        // v359: self-contained subdir page, own root-relative nav
  'games',              // v359: self-contained game pages, own/no standard nav
  'engineering-drafting' // v396: self-contained Sentinel Node — Drafting & Engineering Edition, own root-relative nav
]);

// Pages intentionally excluded from standard header/footer injection.
// Each documented in BUILD_NOTES.md.
const SKIP_FILES = new Set([
  'header.html',            // legacy/source artifact, not a public page
  'plain.html',             // intentionally minimal/stripped layout
  'portal.html',            // standalone portal, custom nav
  'playground.html',        // dev sandbox, no nav
  'resonance-mandala.html', // standalone art page, no nav
  'empire-v2.html',         // standalone game, custom layout
  '404.html',               // GitHub Pages error page, minimal custom layout
]);

const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');

// ─── Load partials ───────────────────────────────────────────────
function loadPartial(filename) {
  const fpath = path.join(PARTIALS_DIR, filename);
  if (!fs.existsSync(fpath)) {
    console.error(`ERROR: Partial not found: ${fpath}`);
    process.exit(1);
  }
  return fs.readFileSync(fpath, 'utf8').trim();
}

const HEADER_PARTIAL = loadPartial('header.html');
const FOOTER_PARTIAL = loadPartial('footer.html');

// ─── Patterns ────────────────────────────────────────────────────
const INCLUDE_HEADER_RE = /<!--\s*INCLUDE:HEADER\s*-->[\s\S]*?<!--\s*\/INCLUDE:HEADER\s*-->/g;
const INCLUDE_FOOTER_RE = /<!--\s*INCLUDE:FOOTER\s*-->[\s\S]*?<!--\s*\/INCLUDE:FOOTER\s*-->/g;

// Legacy header region: from PARTIAL:header START through the END of the last
// consecutive header-region block. The blocks always appear in this order:
// header, nav-drop-root, search-panel, mobile-nav (any subset, consecutive).
// We greedily match from header START to the final mobile-nav END (or whichever
// of nav-drop-root/search-panel END is last present).
// Legacy header region: from PARTIAL:header START through the END of the last
// consecutive header-region block. Blocks appear in order:
// header, nav-drop-root, search-panel, mobile-nav. We must consume ALL of them,
// so we match through the LAST mobile-nav END (greedy up to it). Because the
// blocks are consecutive, we anchor the end on the mobile-nav END marker, which
// is always the final header-region block on these pages.
const LEGACY_HEADER_REGION_RE = /<!--\s*PARTIAL:header\s+START\s*-->[\s\S]*?<!--\s*PARTIAL:mobile-nav\s+END\s*-->/;

// Variant: pages whose header region ends at search-panel or nav-drop-root
// (no mobile-nav block). Tried only if the mobile-nav variant does not match.
const LEGACY_HEADER_REGION_NOMOBILE_RE = /<!--\s*PARTIAL:header\s+START\s*-->[\s\S]*?<!--\s*PARTIAL:(?:search-panel|nav-drop-root|header)\s+END\s*-->/;

// Fallback: pages missing the PARTIAL:header START marker but with a raw
// <header role="banner"> followed by the rest of the legacy header region
// ending in mobile-nav END (or search-panel / nav-drop-root END).
const LEGACY_HEADER_REGION_NOSTART_RE = /<header\s+role="banner">[\s\S]*?<!--\s*PARTIAL:mobile-nav\s+END\s*-->/;
const LEGACY_HEADER_REGION_NOSTART_NOMOBILE_RE = /<header\s+role="banner">[\s\S]*?<!--\s*PARTIAL:(?:search-panel|nav-drop-root)\s+END\s*-->/;

const LEGACY_FOOTER_RE = /<!--\s*PARTIAL:footer\s+START\s*-->[\s\S]*?<!--\s*PARTIAL:footer\s+END\s*-->/;

// Bare footer (no markers): a <footer ...>...</footer> block
const BARE_FOOTER_RE = /<footer[\s\S]*?<\/footer>/i;

// ─── Gather HTML files ───────────────────────────────────────────
function gatherHtmlFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) {
        results.push(...gatherHtmlFiles(path.join(dir, entry.name)));
      }
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(path.join(dir, entry.name));
    }
  }
  return results;
}

// ─── Process one file ────────────────────────────────────────────
function processFile(fpath) {
  const rel = path.relative(SITE_ROOT, fpath);
  const basename = path.basename(fpath);

  if (SKIP_FILES.has(basename)) {
    if (VERBOSE) console.log(`  SKIP (intentional): ${rel}`);
    return { skipped: true };
  }

  let content = fs.readFileSync(fpath, 'utf8');
  const original = content;
  const warnings = [];
  let migratedHeader = false;
  let migratedFooter = false;

  // ── STEP 1a: migrate legacy header region → INCLUDE:HEADER (if not already) ──
  if (!INCLUDE_HEADER_RE.test(content)) {
    INCLUDE_HEADER_RE.lastIndex = 0;
    const repl = '<!-- INCLUDE:HEADER -->\n<!-- /INCLUDE:HEADER -->';
    if (LEGACY_HEADER_REGION_RE.test(content)) {
      content = content.replace(LEGACY_HEADER_REGION_RE, repl);
      migratedHeader = true;
    } else if (LEGACY_HEADER_REGION_NOMOBILE_RE.test(content)) {
      content = content.replace(LEGACY_HEADER_REGION_NOMOBILE_RE, repl);
      migratedHeader = true;
    } else if (LEGACY_HEADER_REGION_NOSTART_RE.test(content)) {
      content = content.replace(LEGACY_HEADER_REGION_NOSTART_RE, repl);
      migratedHeader = true;
    } else if (LEGACY_HEADER_REGION_NOSTART_NOMOBILE_RE.test(content)) {
      content = content.replace(LEGACY_HEADER_REGION_NOSTART_NOMOBILE_RE, repl);
      migratedHeader = true;
    }
  }
  INCLUDE_HEADER_RE.lastIndex = 0;

  // ── STEP 1b: migrate legacy footer → INCLUDE:FOOTER (if not already) ──
  if (!INCLUDE_FOOTER_RE.test(content)) {
    INCLUDE_FOOTER_RE.lastIndex = 0;
    if (LEGACY_FOOTER_RE.test(content)) {
      content = content.replace(LEGACY_FOOTER_RE,
        '<!-- INCLUDE:FOOTER -->\n<!-- /INCLUDE:FOOTER -->');
      migratedFooter = true;
    } else if (BARE_FOOTER_RE.test(content)) {
      // Wrap a bare footer (no markers) — replace first occurrence only
      content = content.replace(BARE_FOOTER_RE,
        '<!-- INCLUDE:FOOTER -->\n<!-- /INCLUDE:FOOTER -->');
      migratedFooter = true;
    }
  }
  INCLUDE_FOOTER_RE.lastIndex = 0;

  // ── STEP 2: inject canonical partials into INCLUDE markers ──
  const headerCount = (content.match(INCLUDE_HEADER_RE) || []).length;
  INCLUDE_HEADER_RE.lastIndex = 0;
  const footerCount = (content.match(INCLUDE_FOOTER_RE) || []).length;
  INCLUDE_FOOTER_RE.lastIndex = 0;

  if (headerCount > 1) warnings.push(`WARN: ${rel} has ${headerCount} INCLUDE:HEADER blocks (expected 1)`);
  if (footerCount > 1) warnings.push(`WARN: ${rel} has ${footerCount} INCLUDE:FOOTER blocks (expected 1)`);

  if (headerCount >= 1) {
    content = content.replace(INCLUDE_HEADER_RE, HEADER_PARTIAL);
  } else {
    warnings.push(`WARN: ${rel} has no header marker and no legacy header to migrate`);
  }
  INCLUDE_HEADER_RE.lastIndex = 0;

  if (footerCount >= 1) {
    content = content.replace(INCLUDE_FOOTER_RE, FOOTER_PARTIAL);
  } else {
    warnings.push(`WARN: ${rel} has no footer marker and no legacy/bare footer to migrate`);
  }
  INCLUDE_FOOTER_RE.lastIndex = 0;

  const changed = content !== original;
  if (changed && !DRY_RUN) {
    fs.writeFileSync(fpath, content, 'utf8');
  }

  if (VERBOSE && (migratedHeader || migratedFooter)) {
    console.log(`  MIGRATED ${migratedHeader ? 'H' : '-'}${migratedFooter ? 'F' : '-'}: ${rel}`);
  }

  return { skipped: false, changed, warnings, migratedHeader, migratedFooter };
}

// ─── Main ────────────────────────────────────────────────────────
console.log('');
console.log('╔══════════════════════════════════════════════════╗');
console.log('║  Pocono AI — build-partials.js  v396             ║');
console.log(DRY_RUN ? '║  MODE: DRY RUN (no files written)                ║' :
            '║  MODE: LIVE (files will be updated)              ║');
console.log('╚══════════════════════════════════════════════════╝');
console.log('');
console.log(`Site root:    ${SITE_ROOT}`);
console.log(`Partials dir: ${PARTIALS_DIR}\n`);

const allFiles = gatherHtmlFiles(SITE_ROOT);
console.log(`Scanning ${allFiles.length} HTML files...\n`);

let scanned = 0, updated = 0, skipped = 0, migratedH = 0, migratedF = 0;
const allWarnings = [];

for (const fpath of allFiles) {
  scanned++;
  const r = processFile(fpath);
  if (r.skipped) { skipped++; continue; }
  if (r.changed) updated++;
  if (r.migratedHeader) migratedH++;
  if (r.migratedFooter) migratedF++;
  if (r.warnings && r.warnings.length) allWarnings.push(...r.warnings);
}

console.log('─────────────────────────────────────────────────────');
console.log(`Files scanned:          ${scanned}`);
console.log(`Files updated:          ${updated}${DRY_RUN ? ' (dry run — not written)' : ''}`);
console.log(`Files skipped:          ${skipped} (intentional exclusions)`);
console.log(`Headers migrated:       ${migratedH} (legacy PARTIAL → INCLUDE)`);
console.log(`Footers migrated:       ${migratedF} (legacy/bare → INCLUDE)`);
console.log(`Warnings:               ${allWarnings.length}`);
console.log('─────────────────────────────────────────────────────');

if (allWarnings.length) {
  console.log('\nWarnings:');
  for (const w of allWarnings) console.log(' ', w);
}

console.log('');
console.log(DRY_RUN ? 'DRY RUN complete. No files modified.' :
            `Build complete. ${updated} file(s) updated.`);
console.log('');
