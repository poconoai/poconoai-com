# Sentinel Node Installation Simulator — Developer Handoff

**Version:** 3.0.0-beta  
**Release tag:** v378-install-simulator-beta  
**Date:** 2026-06-17  
**File:** `sentinel-node/installation-simulator.html`  
**Status:** Beta public artifact — pilot details will evolve  

---

## What This Is

An interactive, accessibility-first, data-driven deployment walkthrough for the Sentinel Node appliance. Covers the complete installation path from network discovery through go-live sign-off.

**Intended audiences:** MSPs, practice IT administrators, pilot site stakeholders, investors, physicians, attorneys, internal Pocono AI staff.

**Not a substitute for:** authorized IT/MSP implementation, site-specific security review, or professional installation.

---

## Completed Stages

| Stage | Description | Phases |
|-------|-------------|--------|
| 2 | Data-driven refactor — INSTALL_SIMULATOR_DATA, all renderers | 1–2 |
| 3 | DHCP discovery / network preflight | 2–4 |
| 4 | Isolated subnet / VLAN design + router profile expansion | 5–10 |
| 5 | Firewall trust-boundary simulator (14 rules, filter tabs) | 9, 15–17 |
| 6 | Appliance bootstrap + local service hardening | 11–14 |
| 7 | Approved-source ingestion pipeline (vault, OCR, chunk, embed, retrieve, cite) | 19–20 |
| 8 | Draft workspace + human review gate + reviewer roles + approval states | 21–22 |
| 9 | Immutable audit trail explorer + 8 extended verification tests (20 total) | 23–24 |
| 10 | Launch modes (investor/MSP/pilot/internal) + complete go-live report | 25–26 |

**Total phases:** 26  
**Total verification tests:** 20 (12 network/bootstrap + 8 source/review/audit)

---

## Architecture

All content lives in `INSTALL_SIMULATOR_DATA`. Renderers read from this single object.

```
INSTALL_SIMULATOR_DATA
├── metadata
├── safetyLanguage
├── defaultScenario
├── phases[]              ← Stages 2–6 (phases 1–18)
├── phasesStage7to10[]    ← Stages 7–10 (phases 19–26) — merged at DOMContentLoaded
├── preflightStates[]
├── routerProfiles{}
├── trustZones[]
├── firewallRuleTemplates[]
├── firewallPosture[]
├── bootstrapServices[]
├── bootstrapStatus[]
├── hardeningChecklist[]
├── bootstrapWarnings[]
├── verificationTests[]         ← Stages 5–6 (v1–v12)
├── verificationTestsStage7to9[]← Stages 7–9 (v13–v20)
├── glossary{}
├── pilotNotes
├── sourceIngestionProfiles{}   ← NEW Stage 7
├── ingestionPipeline[]         ← NEW Stage 7
├── workflowModes{}             ← NEW Stage 8
├── reviewerRoles[]             ← NEW Stage 8
├── approvalStates[]            ← NEW Stage 8
├── auditTrailFields[]          ← NEW Stage 9
├── installReportFields[]       ← NEW Stage 9
├── launchModes{}               ← NEW Stage 10
└── futureExpansionNotes{}
```

---

## How to Add Content

### Add a new phase
1. Add an object to `INSTALL_SIMULATOR_DATA.phases[]` (for Stages 2–6) or `phasesStage7to10[]` (for Stages 7+).
2. Set the required fields: `number`, `name`, `eyebrow`, `title`, `group`, `tag`, `body`, `captionText`, `transcriptText`, `narrationText`, `captionSeverity`, `svgState`, `checklistUpdates`.
3. Set the appropriate renderer flag: `preflight`, `subnetDesign`, `firewallMatrix`, `localServices`, `ingestionProfile`, `draftWorkspace`, `reviewWorkflow`, `auditExplorer`, `verificationPanel`, `launchModePanel`.
4. Update phase total in all `eyebrow` strings (currently "of 26").

### Add a router profile
Edit `INSTALL_SIMULATOR_DATA.routerProfiles`. Each profile needs:
- `displayName`, `profileStatus`, `profileNote`
- `vendorTerms{}` — vendor-specific terminology for VLAN, DHCP, firewall
- `conceptualSteps{}` — `vlan[]`, `dhcp[]`, `firewall[]` arrays
- `notes`, `warnings[]`, `screenshotPlaceholders[]`, `pilotNotes`, `pilotValidationNotes`

Always include: *"Conceptual path — exact menu names vary by firmware/version. MSP/IT validation required."*

### Add a source ingestion profile
Add to `INSTALL_SIMULATOR_DATA.sourceIngestionProfiles`. Each profile needs:
`label`, `symbol`, `sourceTypes[]`, `approvalRole`, `ingestionSteps[]`, `riskIfSkipped`, `successCriteria`, `failureConditions`.

### Add workflow mode examples
Add to `INSTALL_SIMULATOR_DATA.workflowModes`. Each mode needs:
`label`, `symbol`, `examples[]` — each example: `name`, `desc`.

### Update safety language
Edit `INSTALL_SIMULATOR_DATA.safetyLanguage`. All changes propagate to every phase that references it.

---

## Renderers

| Renderer | Trigger flag | Stage |
|----------|-------------|-------|
| `PreflightRenderer` | `phase.preflight = true` | 3 |
| `SubnetDesignRenderer` | `phase.subnetDesign = true` | 4 |
| `FirewallMatrixRenderer` | `phase.firewallMatrix = true` | 5 |
| `LocalServicesRenderer` | `phase.localServices = "services"\|"sources"\|"pipeline"\|"workspace"` | 6 |
| `IngestionPipelineRenderer` | `phase.ingestionProfile = true`, `phase.ingestionProfileMode = "vault"\|"pipeline"` | 7 |
| `DraftWorkspaceRenderer` | `phase.draftWorkspace = true` | 8 |
| `ReviewWorkflowRenderer` | `phase.reviewWorkflow = true` | 8 |
| `AuditExplorerRenderer` | `phase.auditExplorer = true` | 9 |
| `VerificationPanelRenderer` | `phase.verificationPanel = true` | 9 |
| `LaunchModePanelRenderer` | `phase.launchModePanel = true` | 10 |

---

## Accessibility Notes

All accessibility features are implemented and must be preserved in future builds:

- **Caption bar:** Updates per phase via `CaptionManager.update(phase)`. Always visible.
- **aria-live announcer:** `#sr-announcer` — announces phase title + severity to screen readers.
- **Transcript:** Full written transcript of all 26 phases, accessible via button or keyboard.
- **Keyboard controls:** `←/→` prev/next, `Space` play/pause, `R` restart, `Escape` close overlays.
- **Focus visibility:** `:focus-visible` with 2px teal outline — WCAG 2.2.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables all animations. No content is hidden — captions and transcript preserve all information.
- **No color-only meaning:** Every status badge uses text label + symbol + color (PASS/WARN/CRITICAL/BLOCKED).
- **No-JS fallback:** Complete plain-language guide for all 26 stages inside `<noscript>`.
- **Mobile layout:** Responsive, stacked layout for small screens.

---

## Safety Disclaimers (Permanent)

These must appear clearly and repeatedly throughout the simulator and may not be removed:

1. **Sentinel Node performs DHCP discovery — it does NOT act as the DHCP server.** The router/firewall remains the DHCP authority.
2. **Network configuration must be performed by an authorized IT administrator or MSP.** Sentinel discovers and recommends; it does not take over DHCP, silently modify router/firewall policy, or bypass human approval.
3. **Sentinel Node produces draft-only outputs from approved sources.** Clinical, legal, or operational use requires human review and approval.
4. **Router/firewall policy remains under authorized IT/MSP control.** Router configuration guides are conceptual paths — exact menu names vary by firmware/version/licensing/deployment design.
5. **This simulator is a beta training artifact** — it is not a substitute for authorized implementation, site-specific security review, or professional certification.
6. **Draft-only means the AI may prepare work for review, but it does not make the final clinical, legal, or operational decision.**

---

## Known Limitations

- SVG diagram shows/hides nodes per phase; Phase 7-10 reuse the existing SVG — a future build should add source vault and review gate nodes to the diagram.
- Router profile screenshot placeholders are text-only (no actual screenshots).
- Launch mode switching in Stage 10 selects the mode button but does not yet change per-phase caption text dynamically — this is a future enhancement.
- `ingestionProfileMode` is evaluated per phase; future builds can add more pipeline visualization modes.
- Firewall matrix appears on specific phases (9, 15–17); add `firewallMatrix: true` to any phase to extend.
- The audit explorer shows field definitions rather than a live log — a future build can connect to actual Sentinel audit export format.

---

## Recommended Next Build Stage (Stage 11)

**Pilot Evidence Framework and Outcome Metrics**

- KPI dashboard: query volume, review turnaround time, approval/rejection rates, source utilization
- Go/no-go decision support checklist
- Pilot evidence packet export
- Multi-site deployment model overview
- SVG diagram update: add source vault node, review gate node, audit chain visual

**Prompt scaffold:**
```
Continue from Stages 2–10. Stage 11: Pilot evidence framework.
Add pilotEvidenceData to INSTALL_SIMULATOR_DATA with:
  - KPI fields and example values
  - Go/no-go checklist items
  - Evidence packet export fields
Add a PilotEvidenceRenderer for phases with pilotEvidence:true.
Add phases 27–28 to phasesStage7to10[].
Update phase count to "of 28".
Preserve all existing architecture. No rebuild.
```

---

## Navigation Wiring (v378)

- `/sentinel-node.html` — related card added ✓
- `/architecture.html` — CTA section added ✓
- `/training.html` — Installation Simulator Training section added ✓
- `/evidence-room.html` — Deployment Controls Walkthrough card added ✓
- `search-index.js` — entry added ✓
- `sitemap.xml` — URL added ✓

Pages not yet wired (future):
- `/pilot-readiness-kit.html`
- `/law-firm-pilot.html`
- `/global/index.html`
- `/channel-partners.html` (if exists)

---

## Contact

marcus@poconoai.com — Pocono AI, LLC — East Stroudsburg, PA  
(570) 534-0602 — poconoai.com
