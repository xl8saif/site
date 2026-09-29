---
name: multilingual-translation-mtpe
description: Reusable multilingual translation, MTPE, terminology, and structural QA workflows.
---

# multilingual-translation-mtpe

## Status

Production. This Skill is registered for production use. Apply its documented workflow and verified references; escalate domain-specific uncertainty for human review.

## Workflow

1. Identify the task type and source/target language.
2. Preserve source structure, tags, placeholders, line breaks, and document meaning.
3. Apply only terminology and style rules explicitly defined in this Skill's references.
4. Run deterministic checks where available.
5. Record stable corrections as regression cases.
6. Escalate semantic or contextual uncertainty for human review.

## Production gate

Before promotion to `production`, add:

- domain terminology/reference data
- deterministic validation scripts where practical
- representative `evals/cases.jsonl`
- documented protected terms and structural invariants
