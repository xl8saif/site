# Skill Platform

This directory is the reusable AI Skills platform for Saif Ullah's production workflows.

## Lifecycle

1. Generate a Skill from `templates/skill/`.
2. Register it in `registry.json`.
3. Add domain references and deterministic tools.
4. Add regression cases under `evals/cases.jsonl`.
5. Keep new Skills in `draft` until their contract and regression suite are production-ready.
6. Promote to `production`.
7. Run `python ai-skills/run.py all`.

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
