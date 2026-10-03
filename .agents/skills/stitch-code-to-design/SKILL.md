---
name: stitch-code-to-design
description: Translate the existing static AI Skills Console frontend into Stitch-ready design artifacts by extracting structure and visual rules before any authenticated upload.
---

# Stitch Code to Design

Use this skill when the goal is to represent existing frontend code in Stitch for visual analysis or iterative redesign.

## Pipeline
1. Inspect `public/skills/index.html`, `app.js`, and relevant CSS.
2. Extract the existing visual system rather than inventing a replacement.
3. Produce or reconcile `.stitch/DESIGN.md`.
4. Prepare a self-contained static representation only when a Stitch project is intentionally connected.
5. Require explicit user confirmation before external Stitch upload.
6. Keep production GitHub Pages unchanged until a design is accepted.
7. After acceptance, implement the smallest coherent HTML/CSS change and run deterministic checks.

## Preservation rules
- Preserve runtime IDs and event hooks.
- Preserve localization keys and direct language switching.
- Preserve XML/HTML placeholders and structural formatting in localization workflows.
- Preserve Arabic Cairo and Urdu Mehr Nastaliq.
- Preserve privacy boundaries around Second Brain and private data.
- Do not migrate the static application to React merely for Stitch.

## Verification
Compare the extracted design against the live production structure. Flag missing controls, broken responsive behavior, incorrect RTL, typography drift, or inaccessible interaction states before implementation.
