---
name: {{SKILL_ID}}
description: {{DESCRIPTION}}
---

# {{TITLE}}

## Purpose

{{PURPOSE}}

## Workflow

1. Identify the task and required output.
2. Apply the domain rules in `references/`.
3. Preserve applicable structural invariants from `core/`.
4. Run deterministic checks from `scripts/` where available.
5. Review semantic quality and context separately from automated checks.
6. Record reusable corrections as evaluation cases.

## Domain rules

Keep domain-specific terminology, style, protected terms, and semantic decisions in this Skill rather than in the shared Core.

## Validation

Automated validation establishes structural or deterministic properties only. It does not establish translation quality, factual correctness, or contextual adequacy.

## Evaluation

Add regression cases under `evals/` whenever a production correction represents a reusable rule.
