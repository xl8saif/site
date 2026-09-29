# Shared Localization Core

The Core contains deterministic contracts and reusable tooling shared by localization Skills.

## Components

- `finding.schema.json` — standard finding structure.
- `evaluation.schema.json` — standard regression-case structure.
- `scripts/check_localization.py` — shared structural and terminology checker.
- `scripts/evaluate.py` — shared evaluation runner.

## Unified command

From the repository root:

```bash
python ai-skills/run.py list
python ai-skills/run.py validate
python ai-skills/run.py evaluate
python ai-skills/run.py all
```

`all` validates the registry and runs every registered Skill's `evals/cases.jsonl`.

The Core deliberately does not contain domain terminology or semantic translation decisions. Those remain owned by each Skill.
