#!/usr/bin/env python3
"""Validate the PUBG Urdu LQA evaluation JSONL schema."""

import json
import sys
from pathlib import Path

ALLOWED_TASKS = {"translation", "mtpe", "lqa", "terminology", "structural_qa"}
ALLOWED_SEVERITIES = {"critical", "major", "minor", "query"}
REQUIRED = {"id", "source", "expected_target", "task", "error_type", "severity", "checks", "rationale"}

def main():
    if len(sys.argv) != 2:
        print("Usage: validate_eval_cases.py CASES.jsonl")
        return 2

    path = Path(sys.argv[1])
    errors = []

    for line_no, raw in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not raw.strip():
            continue
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

    if errors:
        print("FAIL")
        print("\n".join(errors))
        return 1

    print(f"PASS: validated {sum(1 for x in path.read_text(encoding='utf-8').splitlines() if x.strip())} cases")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
