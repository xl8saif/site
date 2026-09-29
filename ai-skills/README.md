# Saif Language Skills

Reusable AI skills for Saif Ullah's production translation, localization, linguistic research, and language-data workflows.

## Architecture

Each skill is self-contained and should expose:

- skills/<skill-name>/SKILL.md — operational instructions
- references/ — terminology, style, structural rules, and domain knowledge
- scripts/ — deterministic validation and data-processing tools
- evals/ — regression and evaluation cases
- README.md — optional human-facing documentation

The current production skill is:

- pubg-urdu-lqa — PUBG MOBILE Urdu translation, MTPE, terminology, and LQA
- arabic-urdu-localization — Arabic→Urdu localization, MTPE, terminology, and LQA

## Design principles

1. User-confirmed terminology is authoritative for the relevant production domain.
2. Structural invariants are machine-checkable wherever practical.
3. Linguistic quality remains a human/contextual judgment; deterministic scripts do not replace review.
4. Historical corrections should become regression cases when they are stable and reusable.
5. Skills must not silently alter tags, placeholders, line breaks, protected terms, or source meaning.
6. Domain-specific rules belong inside the domain skill rather than being scattered across unrelated prompts.
7. Reusable logic should be promoted into shared tooling only after it has proven stable in production.

## Skill lifecycle

Capture a repeated workflow → encode rules → add deterministic checks → add evaluation cases → run regression → use in production → promote stable patterns to shared infrastructure.

## Registry

See registry.json for machine-readable skill metadata.

## Skill Factory

New Skills should start from `templates/skill/`. The repository includes `scripts/create_skill.py` to generate the standard structure:

```bash
python ai-skills/scripts/create_skill.py <skill-id> "<description>"
```

The generated Skill contains `SKILL.md`, `references/`, `scripts/`, and `evals/`. Domain-specific rules stay inside the generated Skill; reusable deterministic logic belongs in `core/`.

## One-command validation

From the repository root:

```bash
python ai-skills/run.py all
```

This validates the Skill registry and evaluates every registered Skill. GitHub Actions runs the same command automatically when `ai-skills/` changes.

Individual commands:

```bash
python ai-skills/run.py list
python ai-skills/run.py validate
python ai-skills/run.py evaluate
python ai-skills/run.py --skill <skill-id> promote-check
```

## Plugin distribution

The canonical plugin manifest is `plugin.json`. It exposes both production Skills:

- `pubg-urdu-lqa/SKILL.md`
- `arabic-urdu-localization/SKILL.md`

The manifest version and registry release are kept in sync.

## Promotion gate

Draft Skills can be checked before promotion with `promote-check`. The gate verifies required artifacts, evaluation results, and reference maturity. Passing the gate does not silently promote the Skill; human review remains required.

## Production gate

A production Skill must have:

- a valid `SKILL.md`
- an `evals/cases.jsonl` regression suite
- all registry-listed deterministic tools present

These conditions are enforced by the unified runner.
