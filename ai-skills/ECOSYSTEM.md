# Saif AI Skills — Open Agent Skills Ecosystem

The production skills are distributed in the portable Agent Skills format. The canonical intelligence and QA source is `ai-skills/`; the ecosystem-facing mirror is `.agents/skills/`.

## Install

Use the open skills CLI:

`npx skills add xl8saif/site --list`

Selected skills:

`npx skills add xl8saif/site --skill pubg-urdu-lqa`

`npx skills add xl8saif/site --skill arabic-urdu-localization`

`npx skills add xl8saif/site --skill multilingual-translation-mtpe`

`npx skills add xl8saif/site --skill legal-translation-qa`

`npx skills add xl8saif/site --skill indus-kohistani-research`

## Architecture

`ai-skills/` is the source of truth for terminology, references, evaluations, deterministic validators, and orchestration. `.agents/skills/` is the distribution mirror used by the open Agent Skills ecosystem. The Skills Console remains the GitHub Pages interface, while a future SaaS workspace can provide commercial execution features.

## Maintenance

Synchronize the ecosystem mirror from the canonical skills with:

`python ai-skills/scripts/sync_paperclip_skills.py`

Then verify:

`python ai-skills/scripts/sync_paperclip_skills.py --check`

Do not edit the mirrored skill manually when the corresponding canonical skill exists under `ai-skills/`.


## Stitch design tooling

The repository integrates a focused subset of the official `google-labs-code/stitch-skills` concepts through four project-local Agent Skills:

- `stitch-design-system` — visual source-of-truth management
- `stitch-screen-generation` — structured screen generation/editing
- `stitch-code-to-design` — existing frontend → Stitch design preparation
- `stitch-build-loop` — controlled iterative design/build/verification loop

The integration intentionally remains provider-neutral until a Stitch MCP connection is configured. `.stitch/DESIGN.md`, `.stitch/SITE.md`, and `.stitch/metadata.json` are the local contract and state boundary. External Stitch uploads require explicit confirmation and must never contain private Second Brain data, archives, secrets, credentials, or local filesystem paths.

Reference: `google-labs-code/stitch-skills` (Agent Skills-compatible Stitch workflows). This project treats the upstream repository as an external capability source, not as a dependency to blindly copy into production.
