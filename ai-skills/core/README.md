# Shared Localization Core

Framework-level contracts for translation, localization, MTPE, and LQA skills.

## Structural invariants

Unless a domain skill explicitly overrides a rule:

- XML/HTML tags must be preserved exactly.
- Placeholders must be preserved exactly.
- Line-break count must be preserved.
- Source information must not be silently added or omitted.
- Protected terms must follow the active domain terminology set.
- Automated checks validate structure; they do not establish semantic correctness.

## Finding model

Use these severities:

- critical — broken markup, placeholder corruption, unusable output, or meaning reversal
- major — mistranslation, missing content, wrong terminology, serious grammar/clarity issue, or structural mismatch
- minor — punctuation, spacing, typography, or non-blocking consistency issue
- query — insufficient context or source ambiguity

Each deterministic finding should contain a stable code, severity, issue, and optional suggested correction.

## Evaluation contract

Evaluation cases should include:

- id
- source
- expected_target
- task
- error_type
- severity
- checks
- rationale
- provenance

Use prior_conversation for documented production decisions and synthetic_fixture only for structural testing.

## Domain boundary

The core does not define domain terminology. A skill owns its terminology, protected terms, style, and semantic decisions.

## Promotion rule

Move a rule into the core only when it is genuinely cross-domain and has deterministic behavior. Keep domain-specific terminology and style inside the skill.
