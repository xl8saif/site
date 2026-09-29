# Changelog

## 1.6.2

- Added the structured Reference Layer contract.
- Added reference-index validation with verified/draft/deprecated states.
- Integrated reference validation into the unified runner and promotion gate.
- Indexed verified PUBG structural QA rules.

## 1.6.1

- Added registry/plugin consistency validation to the unified runner.
- Added a machine-readable registry schema contract.
- Added a platform lifecycle document.
- Added draft expansion tracks for multilingual MTPE, Indus-Kohistani research, and legal translation QA.
- Kept draft Skills outside the production plugin manifest.

## 1.6.0

- Added the scalable Skill Platform structure.
- Added three draft Skill tracks without inventing production terminology.

## 1.5.0

- Added a unified framework runner at `ai-skills/run.py`.
- Added registry validation and Skill-wide evaluation.
- Added per-Skill selection and status filtering.
- Added GitHub Actions validation for changes under `ai-skills/`.
- Added runtime enforcement of the evaluation-case contract.
- Hardened the Skill Factory against duplicate registrations and path drift.
- Corrected the PUBG line-break regression fixture.
- Documented the one-command workflow.

### Verification command

```bash
python ai-skills/run.py all
```
