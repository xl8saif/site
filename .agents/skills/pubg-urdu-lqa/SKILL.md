---
name: pubg-urdu-lqa
description: Review, translate, MTPE, and LQA PUBG MOBILE Urdu game text while preserving tags, placeholders, line breaks, punctuation, spacing, terminology, and established Pakistani Urdu localization conventions. Use for PUBG MOBILE Urdu UI, system messages, events, promos, missions, WOW/World of Wonder content, and related localization QA.
---

# PUBG MOBILE Urdu LQA

Use this Skill for production PUBG MOBILE Urdu localization and LQA. Treat source structure as immutable unless the task explicitly requires a structural change.

## Core workflow

1. Identify the task: translation, MTPE, LQA, terminology review, or structural QA.
2. Preserve every XML/HTML tag and placeholder exactly.
3. Preserve line-break count, whitespace structure, punctuation structure, and ordering.
4. Apply verified production terminology through the Skill Reference Layer.
5. Apply deterministic structural QA before semantic/contextual review.
6. For repeatable QA, run:
   `python scripts/check_lqa.py --source source.txt --target target.txt --reference-index references/index.json`
7. For batch work, use `scripts/batch_lqa.py`.
8. For regression protection, run `scripts/run_regression.py evals/cases.jsonl`.

## Non-negotiable production rules

- Use concise Standard Pakistani Urdu suitable for game UI.
- Do not add information absent from the source.
- Do not omit source information.
- Do not change meaning merely to make Urdu more literary.
- Preserve XML/HTML tags exactly, including attributes and tag order.
- Preserve placeholders exactly, including spelling and braces.
- Preserve numbers unless localization explicitly requires a documented change.
- Preserve punctuation, spaces, and line breaks according to the source contract.
- If the source has no final period, do not add one merely because Urdu permits it.
- Preserve protected terms such as Discord, Mission Card, and WOW Tokens.
- Do not introduce sacred/holy/god terminology into game concepts where established terminology avoids it.
- Treat user-confirmed production terminology as authoritative.
- When the user supplies an existing translation, review it as the production artifact rather than replacing it wholesale.

## Deterministic LQA

The engine checks:
- XML/HTML tag equality
- placeholder equality
- line-break count
- protected terms
- verified production terminology and known rejected alternatives

Deterministic findings are evidence of concrete structural or terminology issues; they do not replace semantic or contextual review.

For machine-readable output, add `--json`.

For regression protection:
`python scripts/run_regression.py evals/cases.jsonl`

A regression case should represent a confirmed production correction or a clearly marked synthetic structural fixture. Synthetic fixtures are not evidence for linguistic terminology decisions.

## Severity

- Critical: broken/missing placeholder or tag, corrupted markup, meaning reversal, or unusable UI output.
- Major: mistranslation, missing content, wrong terminology, serious grammar/clarity issue, or structural mismatch.
- Minor: punctuation, spacing, typography, or non-blocking consistency issue.
- Query: source ambiguity or missing context that prevents a safe correction.

Do not invent a correction when the source/context is insufficient; mark it Query.

## Output behavior

For direct translation requests, return the final target text only unless explanation is requested.

For LQA, report:
- Status
- Issue
- Suggested correction
- Severity

Keep valid XML/HTML and placeholders in the exact positions required by the source.

## Validation principle

Automated checks prove structural properties and explicitly indexed terminology rules. A passing script does not override semantic, contextual, or human linguistic review.
