## 1.17.0

- Hardened the Skills Console for Vercel Python Functions deployment.
- Explicitly include the canonical `ai-skills/**` runtime files required by the review API.
- Added a 60-second API function duration ceiling and excluded test-only files from the function bundle.
- Synchronized registry and plugin release metadata to 1.17.0.

## 1.16.0

- Fixed the Skills Console API JSON parsing for pretty-printed review reports.
- Added an API integration smoke test covering PASS, FAIL, and research execution paths.
- Added the API integration test to CI.
- Bumped release metadata to 1.16.0.

## 1.15.0

- Added canonical per-Skill execution contracts to the registry.
- Hardened the Execution Engine so validator invocation is registry-driven across all five production Skills.
- Expanded execution smoke coverage across translation, localization, legal QA, and Indus-Kohistani research.
- Hardened the Human Review Gate so any deterministic validator failure blocks delivery.

## 1.14.0

- Added machine-readable evidence and traceability to the Human Review Gate.
- Refactored planning to reuse the canonical Router instead of duplicating routing logic.
- Removed duplicate planning execution from CI.
- Added the evidence contract and bumped release metadata to 1.14.0.

## 1.13.0

- Added the Human Review Gate and findings aggregator.
- Added severity-based delivery gating for deterministic findings.
- Preserved human sign-off as the final decision layer.
- Added review-gate smoke tests and CI coverage.
- Bumped release metadata to 1.13.0.

## 1.12.0

- Added the deterministic Execution Engine after routing and planning.
- Added normalized `PASS` / `FAIL` / `REVIEW` execution reports.
- Added side-effect-free validator invocation with explicit source/target or research inputs.
- Added execution smoke tests and CI coverage.
- Bumped release metadata to 1.12.0.

## 1.11.0

- Added executable Skill planning after deterministic routing.
- Resolved agents to registered Skill entrypoints and deterministic validators without side effects.
- Added validation-only handling for the QA gate and planning smoke tests.
- Added CI coverage for the planning layer and bumped release metadata to 1.11.0.

## 1.10.0

- Added a deterministic Skill Router driven by `paperclip-agent-profiles.json`.
- Added explicit routing priorities, keyword signals, least-privilege fallback behavior, and machine-readable router output.
- Added router smoke tests covering production domains and fallback behavior.
- Added CI validation for the router and bumped release metadata to 1.10.0.

## 1.9.0

- Integrated the production Skills with Paperclip's project skill discovery layout under `.agents/skills/`.
- Added `ai-skills/paperclip.json` as the machine-readable integration manifest.
- Added `sync_paperclip_skills.py` with drift detection so `.agents/skills/` remains a generated mirror of `ai-skills/`.
- Updated GitHub Actions coverage to validate the Paperclip mirror whenever Skills or the mirror changes.
- Bumped release metadata to 1.9.0.

## 1.8.0

- Promoted `multilingual-translation-mtpe`, `legal-translation-qa`, and `indus-kohistani-research` from draft to production after satisfying the repository promotion gate artifacts and verified-reference requirements.
- Synchronized the production plugin manifest with the expanded production Skill set.
- Added deterministic production tools for multilingual MTPE, legal controlled-identifier QA, and Indus-Kohistani research metadata integrity.
- Updated release metadata to 1.8.0.

## 1.7.0

- Added a framework-level self-audit for registry paths, Skill entrypoints, deterministic tools, eval contracts, reference manifests, plugin synchronization, Python syntax, and production reference retrieval.
- Added path-containment and duplicate-ID checks to the audit layer so structural drift is detected before evaluation.
- Added the self-audit to GitHub Actions before the unified Skill evaluation.
- Synchronized the registry, runner, and plugin release metadata at 1.7.0.

## 1.6.3

- Added an end-to-end smoke test covering reference validation, structural QA, retrieval, and the unified runner.
- Corrected framework path resolution in core reference tooling and production QA wrappers.
- Generalized the promotion gate so research and legal Skills are not forced to maintain translation-specific terminology artifacts.
- Connected production localization QA wrappers to the verified Reference Retrieval Layer.
- Improved reference query tokenization for multilingual text.
- Synchronized registry and plugin release metadata.

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
``
