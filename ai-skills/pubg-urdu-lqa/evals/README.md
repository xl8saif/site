# PUBG Urdu LQA Evaluation Dataset

This evaluation set records real PUBG MOBILE Urdu localization decisions from production-oriented review work.

## Purpose

The dataset is used to regression-test the `pubg-urdu-lqa` skill against established Urdu localization decisions.

Each case records:
- source
- previous target when a correction was needed
- expected target
- error type
- severity
- rationale
- checks that should be applied

## Evaluation principles

1. Do not treat every alternative Urdu phrasing as an error.
2. Gold targets represent an established production decision or a documented correction.
3. Structural checks such as tags, placeholders, and line breaks are deterministic.
4. Linguistic evaluation remains context-sensitive.
5. The skill must not invent missing game context.
6. Existing production translations should not be rewritten merely for stylistic preference.

## Dataset status

The first version contains a small seed set of verified historical examples. More real LQA cases should be added before using this as a quantitative benchmark.

## Case schema

```json
{
  "id": "PUBG-001",
  "source": "...",
  "previous_target": "...",
  "expected_target": "...",
  "task": "lqa",
  "error_type": "accuracy",
  "severity": "major",
  "checks": ["meaning", "naturalness"],
  "rationale": "..."
}
```

Allowed severity values: `critical`, `major`, `minor`, `query`.

Allowed task values: `translation`, `mtpe`, `lqa`, `terminology`, `structural_qa`.

## Privacy

Do not add confidential client material, unreleased game content, account information, screenshots containing personal information, or proprietary source files. Prefer anonymized strings or terminology-only cases when the original material is sensitive.
