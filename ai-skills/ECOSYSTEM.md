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
