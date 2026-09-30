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

# Changelog

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

