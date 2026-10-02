# Saif Language Skills

Reusable AI skills for Saif Ullah's production translation, localization, linguistic research, and language-data workflows.

## Architecture

Each skill is self-contained and should expose:

- <skill-name>/SKILL.md — operational instructions
- references/ — terminology, style, structural rules, and domain knowledge
- scripts/ — deterministic validation and data-processing tools
- evals/ — regression and evaluation cases
- README.md — optional human-facing documentation

The current production Skills are:

- pubg-urdu-lqa — PUBG MOBILE Urdu translation, MTPE, terminology, and LQA
- arabic-urdu-localization — Arabic→Urdu localization, MTPE, terminology, and LQA
- multilingual-translation-mtpe — multilingual translation and MTPE workflow
- legal-translation-qa — legal translation and document QA
- indus-kohistani-research — Indus-Kohistani research and language-data workflow

Experimental:
- second-brain — source-aware personal knowledge, decision memory, contradiction handling, and retrieval foundation

## Second Brain

The experimental `second-brain` Skill is the knowledge layer underneath the production Skills. It remains outside the production Agent Skills mirror until its import, retrieval, conflict and evaluation layers mature. See `SECOND_BRAIN.md` and `second-brain/README.md`.

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

## Framework self-audit

Run `python ai-skills/core/scripts/self_audit.py` before normal evaluation when making structural changes. It checks registry paths, Skill entrypoints, deterministic tools, eval contracts, reference manifests, plugin synchronization, Python syntax, and production reference retrieval.

## One-command validation

From the repository root:

```bash
python ai-skills/run.py all
```

This validates the Skill registry and evaluates every registered Skill. GitHub Actions runs the same command automatically when `ai-skills/` changes.

Individual commands:

```bash
python ai-skills/run.py list
  python ai-skills/run.py audit
python ai-skills/run.py validate
python ai-skills/run.py evaluate
python ai-skills/run.py retrieve --skill <skill-id> <query>\npython ai-skills/run.py review --skill <skill-id> <task>\npython ai-skills/run.py --skill <skill-id> promote-check
```


## Deterministic Skill Router

The agent router is driven by `paperclip-agent-profiles.json` rather than hard-coded routing branches. It selects the least-privilege agent from explicit priority/keyword rules and falls back to `localization-agent` when no rule matches.

```bash
python ai-skills/scripts/route_task.py --task "PUBG MOBILE Urdu LQA for a WOW event" --json
python ai-skills/scripts/test_router.py
```

The router is deterministic and inspectable; it does not claim live Paperclip assignment. The output identifies the selected agent, Skills, confidence, matched rule, and matched keywords.


## Executable Skill Planning

After routing, `plan_task.py` resolves the selected agent into its registered Skill entrypoint and deterministic validator without performing side effects. Validation-only agents expose all assigned Skills so the QA gate can cover the complete validation surface.

```bash
python ai-skills/scripts/plan_task.py --task "PUBG MOBILE Urdu LQA for a WOW event" --json
python ai-skills/scripts/test_plan.py
```


## Deterministic Execution Engine

`execute_task.py` takes a routed task plus the required input files, runs only the registered deterministic validator, and normalizes the result to `PASS`, `FAIL`, or `REVIEW`. It has no write/mutation capability.

```bash
python ai-skills/scripts/execute_task.py --task "PUBG MOBILE Urdu LQA for a WOW event" --source source.txt --target target.txt --json
python ai-skills/scripts/test_execute.py
```


## Human Review Gate

`review_gate.py` aggregates deterministic findings, counts severity, and produces a delivery decision without replacing human judgment. Critical/major findings block delivery; minor/query findings require human review.

```bash
python ai-skills/scripts/review_gate.py --task "PUBG MOBILE Urdu LQA for a WOW event" --source source.txt --target target.txt --json

# Indus-Kohistani research can use a knowledge/data input:
python ai-skills/scripts/review_gate.py --task "Indus-Kohistani research corpus integrity" --knowledge knowledge.json --json
python ai-skills/scripts/test_review_gate.py
node --check public/skills/app.js
```


## Evidence and Traceability

The Review Gate preserves a machine-readable trace from routed agent and Skill through the deterministic validator to each finding. It records the validator output as evidence without inventing source locations or semantic judgments.

The evidence contract is defined in `core/evidence.schema.json`.

## Plugin distribution

The canonical plugin manifest is `plugin.json`. It exposes all production Skills:

- `pubg-urdu-lqa/SKILL.md`
- `arabic-urdu-localization/SKILL.md`
- `multilingual-translation-mtpe/SKILL.md`
- `legal-translation-qa/SKILL.md`
- `indus-kohistani-research/SKILL.md`

The manifest version and registry release are kept in sync. Current production release: `1.16.0`.

## Promotion gate

Draft Skills can be checked before promotion with `promote-check`. The gate verifies required artifacts, evaluation results, and reference maturity. Passing the gate does not silently promote the Skill; human review remains required.

## Production gate

A production Skill must have:

- a valid `SKILL.md`
- an `evals/cases.jsonl` regression suite
- all registry-listed deterministic tools present

These conditions are enforced by the unified runner. Production Skills must also expose a valid `references/index.json` with verified references. The Reference Retrieval Layer reads verified reference files and returns relevant entries for the active Skill.

## Paperclip integration

The production Skills are Paperclip-compatible. The canonical source remains `ai-skills/`; a synchronized project-discovery mirror lives in `.agents/skills/`.

```bash
python ai-skills/scripts/sync_paperclip_skills.py
python ai-skills/scripts/sync_paperclip_skills.py --check
bash ai-skills/scripts/import_to_paperclip.sh
```

Paperclip can also import each production Skill directly from the GitHub folders listed in `ai-skills/paperclip.json`. Paperclip remains the agent orchestration/control-plane layer while the existing Skill framework remains the source of truth for terminology, references, evals, and deterministic QA.


## Skills Console

The repository includes a browser console at `public/skills/` for running the Router → Planner → Execution → Human Review Gate pipeline.

For local execution:

```bash
python api/skills/run.py
```

Then open the Skills Console and submit the required inputs. Translation/LQA tasks use Source + Target; Indus-Kohistani research can use Knowledge / Research Data.

The API integration smoke test is:

```bash
python api/skills/test_run.py
```

GitHub Pages serves the static console only; the Python API must run locally or on a Python-capable deployment target.
## Open Agent Skills ecosystem

The production Skills are distributed through the open Agent Skills ecosystem using the portable `SKILL.md` format. The ecosystem-facing mirror is `.agents/skills/`, synchronized from the canonical `ai-skills/` source tree.

See `ai-skills/ECOSYSTEM.md` for installation and distribution details.

Examples:

`npx skills add xl8saif/site --list`

`npx skills add xl8saif/site --skill pubg-urdu-lqa`

`npx skills add xl8saif/site --skill arabic-urdu-localization`

`skills.sh.json` groups the public skills for skills.sh discovery. The open skill distribution remains separate from the commercial Skills Console/SaaS execution layer.