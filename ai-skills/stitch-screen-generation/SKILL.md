---
name: stitch-screen-generation
description: Generate, edit, and iterate Stitch screens using structured prompts, project design-system tokens, and focused visual changes without leaking production secrets or replacing application logic.
---

# Stitch Screen Generation

Use this skill for Stitch screen creation, targeted edits, and design variants.

## Before generation
- Read `.stitch/SITE.md`, `.stitch/DESIGN.md`, and `.stitch/metadata.json`.
- Identify whether the request is a new screen, an edit, or a variant.
- Do not recreate a production page that already exists unless the task explicitly asks for a redesign.
- If a Stitch design system exists, rely on its tokens instead of duplicating theme instructions in generation prompts.

## Prompt construction
Structure prompts around:
1. user intent;
2. platform/device;
3. page hierarchy;
4. component structure;
5. interaction states;
6. responsive behavior;
7. multilingual/RTL requirements.

For generation prompts, avoid duplicating project-level hex colors and font tokens unless a precise edit requires them.

## Iteration
Prefer one coherent edit at a time over repeated full regeneration. Preserve information architecture and existing product terminology.

## Output handling
Stitch outputs are design artifacts until reviewed. Store accepted local artifacts under `.stitch/designs/`. Do not put credentials, private Second Brain data, ChatGPT archives, or local filesystem paths into prompts or generated assets.

## Acceptance gate
Before production implementation, verify desktop, tablet, 390px and 320px behavior plus LTR and RTL layouts. Then hand the accepted design to the normal Jules/agent implementation and review workflow.
