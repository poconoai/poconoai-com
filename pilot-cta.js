/* =====================================================
 * v330 2026-06-01 schema-enrichment-meta-fix — no functional changes
   POCONO AI — Floating Pilot Program CTA  v259
   -----------------------------------------------------
   Privacy posture:
     * sessionStorage only (key: pai_pilot_cta_dismissed)
     * No cookies, no localStorage, no analytics
     * No third-party requests, no telemetry
     * No external scripts loaded by this code

   UX:
     * Desktop: lower-right card
     * Mobile: slim bottom-centered ribbon
     * Appears 6 seconds after DOMContentLoaded
     * Respects prefers-reduced-motion (no slide animation)
     * Keyboard accessible (Tab, Enter, Escape)
     * Once dismissed, hidden for the rest of the browser session
     * In a fresh browser session, may appear again

   Page-aware copy:
     * Pages matching legal/attorney/law patterns get legal copy → law-firm-pilot.html
     * Pages matching clinical/physician patterns get clinical copy → pilot-brief.html
     * All other pages get neutral copy → pilot-brief.html

   Defensive improvements over v258:
     * Diagnostic log lines retained (1 line each, harmless)
     * Body-readiness check before injection
     * Retry on first failure with backoff
     * Simpler enter animation (no double rAF)
     * Skip self when page IS a pilot page (no recursion)
   ===================================================== */
(function () {
  'use strict';

  try { console.log('[pilot-cta v259] loaded'); } catch (e) {}

  if (window.__pocPilotCtaInit) return;
  window.__pocPilotCtaInit = true;

  // Already dismissed this session — exit silently
  try {
    if (sessionStorage.getItem('pai_pilot_cta_dismissed') === '1') {
      try { console.log('[pilot-cta v259] suppressed (session-dismissed)'); } catch (e) {}
      return;
    }
  } catch (e) { /* sessionStorage blocked — proceed without persistence */ }

  // Determine page-aware copy and link target from path
  var path = (location.pathname || '').toLowerCase();
  var copy, href;

  if (/(attorney|law-firm|legal|privilege|e-discovery|ethics|deposition|litigation)/.test(path)) {
    copy = {
      label:   'Pilot Program',
      heading: 'Private Law Firm Pilot Program',
      body:    'Local AI document retrieval and research workflows. Attorney\u2013client control preserved.',
      cta:     'Explore Pilot Eligibility'
    };
    href = 'law-firm-pilot.html';
  } else if (/(physician|clinic|clinical|nurse|ehr|prior-auth|denials|medical|chart)/.test(path)) {
    copy = {
      label:   'Pilot Program',
      heading: 'Independent Clinic Pilot Program',
      body:    'Local-first Sentinel Node platform for clinical workflows, compliance, and documentation.',
      cta:     'Request Pilot Information'
    };
    href = 'pilot-brief.html';
  } else {
    copy = {
      label:   'Pilot Program',
      heading: 'Pilot Program Now Open',
      body:    'Pocono AI is evaluating select clinical and legal pilot sites for local-first AI document workflows.',
      cta:     'Explore Pilot Eligibility'
    };
    href = 'pilot-brief.html';
  }

  // Don't show on the pilot pages themselves
  var thisFile = path.split('/').pop();
  if (thisFile === 'pilot-brief.html' || thisFile === 'law-firm-pilot.html' || thisFile === 'pilot-workflow.html') {
    try { console.log('[pilot-cta v259] suppressed (this IS a pilot page)'); } catch (e) {}
    return;
  }

  var attempts = 0;
  var MAX_ATTEMPTS = 3;

  function show() {
    attempts++;

    try {
      if (sessionStorage.getItem('pai_pilot_cta_dismissed') === '1') return;
    } catch (e) {}

    if (!document.body) {
      if (attempts < MAX_ATTEMPTS) {
        try { console.log('[pilot-cta v259] body not ready, retry ' + attempts); } catch (e) {}
        setTimeout(show, 500);
      }
      return;
    }

    if (document.getElementById('pai-pilot-cta')) return;

    var card = document.createElement('aside');
    card.id = 'pai-pilot-cta';
    card.setAttribute('role', 'region');
    card.setAttribute('aria-label', 'Pilot program invitation');
    card.innerHTML =
      '<button type="button" class="pai-pilot-cta-close" aria-label="Dismiss pilot program invitation" title="Dismiss">' +
        '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">' +
          '<line x1="2" y1="2" x2="12" y2="12"/><line x1="12" y1="2" x2="2" y2="12"/>' +
        '</svg>' +
      '</button>' +
      '<div class="pai-pilot-cta-body-wrap">' +
        '<span class="pai-pilot-cta-label">' + copy.label + '</span>' +
        '<h3 class="pai-pilot-cta-heading">' + copy.heading + '</h3>' +
        '<p class="pai-pilot-cta-body">' + copy.body + '</p>' +
      '</div>' +
      '<a class="pai-pilot-cta-link" href="' + href + '">' + copy.cta + ' \u2192</a>';

    document.body.appendChild(card);
    try { console.log('[pilot-cta v259] card injected'); } catch (e) {}

    setTimeout(function () { card.classList.add('is-visible'); }, 20);

    function dismiss(ev) {
      if (ev) { ev.preventDefault(); ev.stopPropagation(); }
      try { sessionStorage.setItem('pai_pilot_cta_dismissed', '1'); } catch (e) {}
      card.classList.remove('is-visible');
      card.classList.add('is-dismissing');
      setTimeout(function () {
        if (card && card.parentNode) card.parentNode.removeChild(card);
      }, 260);
      document.removeEventListener('keydown', onKey);
    }

    var btn = card.querySelector('.pai-pilot-cta-close');
    btn.addEventListener('click', dismiss);
    btn.addEventListener('touchend', dismiss, { passive: false });

    function onKey(e) {
      if (e.key === 'Escape' && card.contains(document.activeElement)) dismiss(e);
    }
    document.addEventListener('keydown', onKey);
  }

  function start() {
    try { console.log('[pilot-cta v259] timer started, render in 6s'); } catch (e) {}
    setTimeout(show, 6000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
