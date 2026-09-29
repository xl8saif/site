# Skill Platform

This directory is the reusable AI Skills platform for Saif Ullah's production workflows.

## Lifecycle

1. Generate a Skill from `templates/skill/`.
2. Register it in `registry.json`.
3. Add domain references and deterministic tools where practical.
4. Validate the Reference Layer through `references/index.json`.
5. Retrieve verified references with `python ai-skills/run.py retrieve --skill <skill-id> <query>`.
6. Add regression cases under `evals/cases.jsonl`.
7. Keep new Skills in `draft` until their domain evidence and regression suite are production-ready.
8. Promote to `production` after human review.
9. Run `python ai-skills/run.py all`.

## Platform contracts

- `core/evaluation.schema.json` — evaluation case contract.
- `registry.schema.json` — registry contract.
- `plugin.json` — canonical distribution manifest.
- `run.py` — unified validation/evaluation entry point.

## Current production Skills

- PUBG MOBILE Urdu LQA
- Arabic → Urdu localization

## Draft expansion tracks

The platform is prepared for additional workflows without coupling them to existing production Skills:

- general multilingual translation and MTPE
- Indus-Kohistani linguistic research/data work
- legal translation and document QA

Draft Skills are intentionally not treated as production until their terminology, deterministic checks, and regression suites are validated.
