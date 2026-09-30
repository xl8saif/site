---
name: arabic-urdu-localization
description: Arabic to Urdu translation, MTPE, and linguistic QA with structural preservation, terminology control, and context-aware Pakistani Urdu output.
---

# Arabic Urdu Localization

## Purpose

Provide production-ready Arabic → Urdu translation, MTPE, terminology review, and structural QA while preserving source structure and applying controlled Urdu style.

## Workflow

1. Identify whether the task is translation, MTPE, LQA, terminology review, or structural QA.
2. Preserve XML/HTML tags, placeholders, line breaks, list structure, and other explicit source constraints.
3. Read applicable terminology from `references/terminology.json`.
4. Preserve protected terms from `references/protected-terms.json`.
5. Translate meaning rather than Arabic surface syntax; avoid unnecessary calques.
6. Use natural, clear Standard Urdu appropriate to the target audience and domain.
7. Preserve names, numbers, dates, units, URLs, product names, and technical tokens unless the task explicitly requires localization.
8. For religious, legal, governmental, or formal material, retain the source register and avoid adding interpretation not present in the source.
9. Run `scripts/check_ar_ur.py` for deterministic structural and terminology checks.
10. Record confirmed production corrections as regression cases under `evals/`.

## Arabic → Urdu style

- Prefer idiomatic Urdu over word-for-word Arabic calques.
- Preserve distinctions in meaning, tense, modality, negation, and attribution.
- Do not add honorifics, explanations, headings, or context absent from the source.
- Do not omit repeated information merely because it sounds redundant in Urdu.
- Keep Arabic proper names and established terminology consistent across a document.
- Match the source's level of formality.
- When a phrase is genuinely ambiguous, flag it for context rather than inventing a meaning.

## Structural rules

The following are deterministic invariants unless the task explicitly authorizes a change:

- XML/HTML tags must remain unchanged.
- Placeholders must remain unchanged.
- Line-break count must remain unchanged.
- Protected terms must remain unchanged.
- URLs and machine-readable tokens must not be altered.
- Automated checks establish structural properties only; they do not establish semantic translation quality.

## Output behavior

For direct translation requests, return the target translation without commentary unless explanation is requested.

For LQA, report:
- Status
- Issue
- Suggested correction
- Severity

Use severity:
- critical: structural corruption or unusable output
- major: mistranslation, omission, serious terminology or structural issue
- minor: non-blocking language, punctuation, or consistency issue
- query: context required before a reliable correction

## Evaluation

Use `evals/cases.jsonl` for confirmed corrections and deterministic fixtures. Run:

```bash
python scripts/check_ar_ur.py --source source.txt --target target.txt
python scripts/run_regression.py evals/cases.jsonl
```
