---
name: indus-kohistani-research
description: Research and language-data workflows for Indus-Kohistani documentation, corpus analysis, and linguistic metadata.
---

# indus-kohistani-research

## Status

Draft. Do not treat this Skill as production guidance until its terminology, deterministic checks, and regression suite have been validated.

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
