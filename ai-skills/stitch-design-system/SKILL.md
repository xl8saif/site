---
name: stitch-design-system
description: Maintain a Stitch-compatible visual source of truth from the repository's accepted UI system, with project-level tokens, multilingual typography, component rules, responsive behavior, and anti-pattern controls.
---

# Stitch Design System

Use this skill when the task is to create, audit, reconcile, or maintain the design system used by Stitch.

## Source of truth
1. Read `DESIGN.md` for the broader product contract.
2. Read `.stitch/DESIGN.md` for Stitch-compatible visual guidance.
3. Read `.stitch/SITE.md` and `.stitch/metadata.json` for Stitch project context.
4. Never invent a Stitch project ID.

## Workflow
- Inspect the existing production UI before changing the visual system.
- Extract semantic tokens: canvas, surfaces, text, borders, accents, states, typography, spacing, radii, elevation, responsive rules.
- Preserve the established Saif AI Skills Console identity.
- Keep English, Arabic, Urdu, and Persian first-class; Arabic uses Cairo and Urdu uses Mehr Nastaliq.
- Keep RTL behavior genuine for Arabic/Urdu/Persian.
- Prefer semantic roles over isolated visual values.
- Record accepted changes in `.stitch/DESIGN.md` and keep root `DESIGN.md` synchronized where the product contract changes.

## Stitch MCP boundary
A live Stitch project requires an authenticated Stitch MCP connection. Do not upload `.stitch/DESIGN.md`, production HTML, screenshots, or any other asset until the user explicitly confirms the upload when the external Stitch project is involved.

## Quality gate
Reject generated design changes that introduce horizontal overflow, fake metrics, generic AI-dashboard filler, broken RTL, inaccessible controls, unsupported fonts, private data, or divergence from the accepted design contract.
