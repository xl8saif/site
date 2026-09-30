#!/usr/bin/env python3
"""Validate the PUBG Urdu LQA evaluation JSONL schema and structural gold cases."""

import json
import re
import sys
from pathlib import Path

ALLOWED_TASKS = {"translation", "mtpe", "lqa", "terminology", "structural_qa"}
ALLOWED_SEVERITIES = {"critical", "major", "minor", "query"}
ALLOWED_PROVENANCE = {"prior_conversation", "synthetic_fixture"}
REQUIRED = {
    "id", "source", "expected_target", "task", "error_type",
    "severity", "checks", "rationale", "provenance"
}
PLACEHOLDER_RE = re.compile(r"\{[^{}]+\}|\$\{[^{}]+\}|%(?:\d+\$)?[sdif]|%%")
TAG_RE = re.compile(r"<[^>]+>")

def main():
    if len(sys.argv) != 2:
        print("Usage: validate_eval_cases.py CASES.jsonl")
        return 2

    path = Path(sys.argv[1])
    errors = []
    count = 0

    for line_no, raw in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not raw.strip():
            continue
        count += 1

        try:
            case = json.loads(raw)
        except json.JSONDecodeError as exc:
            errors.append(f"line {line_no}: invalid JSON: {exc}")
            continue

        missing = REQUIRED - case.keys()
        if missing:
            errors.append(f"line {line_no}: missing fields: {', '.join(sorted(missing))}")

        if case.get("task") not in ALLOWED_TASKS:
            errors.append(f"line {line_no}: invalid task: {case.get('task')}")

        if case.get("severity") not in ALLOWED_SEVERITIES:
            errors.append(f"line {line_no}: invalid severity: {case.get('severity')}")

        if not isinstance(case.get("checks"), list):
            errors.append(f"line {line_no}: checks must be a list")

        if case.get("provenance") not in ALLOWED_PROVENANCE:
            errors.append(f"line {line_no}: invalid provenance: {case.get('provenance')}")

        source = case.get("source", "")
        expected = case.get("expected_target", "")
        checks = set(case.get("checks", [])) if isinstance(case.get("checks"), list) else set()

        if "placeholders" in checks:
            if sorted(PLACEHOLDER_RE.findall(source)) != sorted(PLACEHOLDER_RE.findall(expected)):
                errors.append(f"line {line_no}: placeholder mismatch between source and expected_target")

        if "tags" in checks:
            if TAG_RE.findall(source) != TAG_RE.findall(expected):
                errors.append(f"line {line_no}: tag mismatch between source and expected_target")

        if "linebreaks" in checks and source.count("\n") != expected.count("\n"):
            errors.append(f"line {line_no}: line-break count mismatch between source and expected_target")

    if errors:
        print("FAIL")
        print("\n".join(errors))
        return 1

    print(f"PASS: validated {count} cases")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
