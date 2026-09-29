# AI Skills Framework — Release Checklist

## Finalization

- [x] Shared Core contracts
- [x] Shared localization checker
- [x] Shared evaluation engine
- [x] PUBG Urdu LQA Skill
- [x] Arabic→Urdu localization Skill
- [x] Evaluation fixtures
- [x] Skill Factory
- [x] Registry
- [x] Unified runner
- [x] GitHub Actions CI
- [x] Runtime evaluation-contract validation
- [x] Duplicate Skill protection
- [x] One-command documentation
- [x] Reference Layer schema and validation
- [x] Verified reference indexes for production Skills
- [x] Reference file integrity checks
- [x] Reference Retrieval Layer
- [x] Promotion gate integration

## Operational command

Run from the repository root:

```bash
python ai-skills/run.py all
```

For a single production Skill:

```bash
python ai-skills/run.py --skill pubg-urdu-lqa evaluate
```

For all production Skills only:

```bash
python ai-skills/run.py --status production all
```

A release is considered ready when the unified command exits with code 0 and GitHub Actions reports the same validation as successful.
