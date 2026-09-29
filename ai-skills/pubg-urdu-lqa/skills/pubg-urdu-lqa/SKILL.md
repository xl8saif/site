---
name: pubg-urdu-lqa
description: Review, translate, MTPE, and LQA PUBG MOBILE Urdu game text while preserving tags, placeholders, line breaks, punctuation, spacing, terminology, and established Pakistani Urdu localization conventions. Use for PUBG MOBILE Urdu UI, system messages, events, promos, missions, WOW/World of Wonder content, and related localization QA.
---

# PUBG MOBILE Urdu LQA

Use this skill for production PUBG MOBILE Urdu localization and LQA. Treat the source structure as immutable unless the task explicitly requires a structural change.

## Core workflow

1. Identify the task: translation, MTPE, LQA, terminology review, or structural QA.
2. Preserve every XML/HTML tag and placeholder exactly unless the source itself requires a change.
3. Preserve line-break count, whitespace structure, punctuation structure, and ordering.
4. Apply the terminology rules in references/terminology.md.
5. Apply the style rules in references/style-guide.md.
6. Apply the structural rules in references/xml-html-rules.md.
7. For repeatable deterministic QA, run scripts/check_lqa.py against Source and Target.
8. Before finalizing, run the relevant focused validation scripts when available:
   - check_tags.py
   - check_placeholders.py
   - check_linebreaks.py
9. Report only actionable errors when the user asks for QA. Do not rewrite valid text merely for stylistic preference.

## Non-negotiable rules

- Use concise Standard Pakistani Urdu suitable for game UI.
- Do not add information that is absent from the source.
- Do not omit source information.
- Do not change meaning to make the Urdu more literary.
- Preserve XML/HTML tags exactly, including attributes and tag order.
- Preserve placeholders exactly, including their spelling and braces.
- Preserve numbers unless localization explicitly requires a documented change.
- Preserve punctuation and spaces unless the target-language requirement clearly requires a change.
- If the source has no final full stop/period, do not add one merely because Urdu permits it.
- Preserve line-break count.
- Do not translate product names, platform names, Discord, Mission Card, WOW Tokens, or other protected terms unless the terminology reference explicitly says to do so.
- Do not introduce sacred/holy/god terminology into game concepts where the established terminology avoids it.
- When the user supplies an existing translation, treat it as the production artifact to review rather than replacing it wholesale.

## Deterministic LQA engine

Use scripts/check_lqa.py when Source and Target are available as UTF-8 text files:

python scripts/check_lqa.py --source source.txt --target target.txt

Use --json for machine-readable output.

For batch jobs, create a JSONL manifest with one object per item:
{"id":"row-001","source":"source text","target":"target text"}
For file-backed rows, use "@file:relative/path.txt" for source or target. Run:
python scripts/batch_lqa.py --manifest batch.jsonl --jsonl reports/results.jsonl --report reports/report.md

The batch runner preserves the item ID and manifest line number, aggregates PASS/FAIL results, and produces machine-readable plus Markdown reports. A batch failure means at least one deterministic finding exists.

For regression protection, run:
python scripts/run_regression.py evals/cases.jsonl
This validates structural expectations in the gold set and catches accidental replacement of a documented terminology correction.

The engine checks:
- XML/HTML tag equality
- placeholder equality
- line-break count
- protected terms
- established terminology and known rejected alternatives

A deterministic finding is evidence of a concrete issue, not a substitute for semantic/contextual review. The terminology engine intentionally checks known source terms only; it must not invent a target translation for an unseen term.

## LQA severity

Classify findings as:
- Critical: broken/missing placeholder or tag, corrupted markup, meaning reversal, or unusable UI output.
- Major: mistranslation, missing content, wrong terminology, serious grammar/clarity issue, or structural mismatch.
- Minor: punctuation, spacing, typography, or non-blocking consistency issue.
- Query: source ambiguity or context needed before making a safe correction.

Do not invent a correction when the source/context is insufficient. Mark it as Query.

## Output behavior

For a direct translation request, return the final target text only unless the user asks for explanation.

For LQA, use:
- Status
- Issue
- Suggested correction
- Severity

Keep valid XML/HTML and placeholders in the exact position required by the source.

## Validation principle

Automated checks prove structural properties, not linguistic correctness. A passing script does not override terminology, semantic, or contextual review.

## Evaluation and regression

When changing this skill, use the evaluation material in evals/.

- evals/cases.jsonl contains prior-work reference cases plus explicitly marked synthetic structural fixtures.
- scripts/validate_eval_cases.py validates the evaluation schema and deterministic structural expectations.
- Do not treat a synthetic fixture as evidence for a linguistic terminology decision.
- Prefer exact historical cases and user-confirmed terminology decisions when expanding the gold set.
- When a new production correction is confirmed, add it as a regression case with provenance and a concise rationale.
- A skill change should be considered a regression risk if it causes a previously correct terminology, meaning, placeholder, tag, or line-break case to fail.
