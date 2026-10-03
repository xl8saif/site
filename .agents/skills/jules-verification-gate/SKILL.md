---
name: jules-verification-gate
description: Verify Jules-generated changes before merge using deterministic repository checks, security scanning, localization invariants, and explicit evidence.
---

# Jules Verification Gate

Use this skill for a Jules-generated branch or pull request before merge.

## Gate sequence
1. Inspect the diff and confirm the change stays within the requested scope.
2. Check for secrets, private Second Brain data, ChatGPT archives, credentials, and local filesystem paths.
3. Run JavaScript syntax/build checks for frontend changes.
4. Run the repository AI Skills validation/evaluation commands relevant to changed skills.
5. Run the NVIDIA SkillSpector security gate for changed Agent Skills.
6. Verify registry entries and .agents/skills mirrors.
7. For localization changes, verify tags, placeholders, line breaks, punctuation, and protected terminology.
8. For UI changes, verify all four languages, genuine RTL, direct language selection, responsive layout, and asset cache-busting.
9. Record commands and outcomes as verification evidence.
10. Require human review before merge for non-trivial changes.

## Failure policy
A failed check is evidence, not a reason to suppress the check. Diagnose the smallest relevant failure, correct it, and rerun the affected gate.

Never mark a Jules change as verified solely because Jules reports success.

## Security
Issue-triggered Jules execution must be restricted to trusted actors. Never pass untrusted issue content to a privileged Jules workflow without an allowlist or equivalent authorization boundary.

Do not auto-merge a Jules PR solely from agent output.
