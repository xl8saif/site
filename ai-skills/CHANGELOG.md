# Changelog

## 1.5.0

- Added a unified framework runner at `ai-skills/run.py`.
- Added registry validation and Skill-wide evaluation.
- Added per-Skill selection and status filtering.
- Added GitHub Actions validation for changes under `ai-skills/`.
- Added runtime enforcement of the evaluation-case contract.
- Hardened the Skill Factory against duplicate registrations and path drift.
- Corrected the PUBG line-break regression fixture.
- Documented the one-command workflow.

### Production Skills

- `pubg-urdu-lqa`
- `arabic-urdu-localization`

### Verification command

```bash
python ai-skills/run.py all
```
