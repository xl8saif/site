#!/usr/bin/env python3
"""Shared evaluator for all localization Skill regression suites."""

import argparse
import json
import re
import sys
from pathlib import Path

TAG_RE = re.compile(r"<[^>]+>")
PLACEHOLDER_RE = re.compile(r"\{[^{}]+\}|\$\{[^{}]+\}|%(?:\d+\$)?[sdif]|%%")
REQUIRED = {"id","source","expected_target","task","error_type","severity","checks","rationale","provenance"}


def parts(text):
    return (
        TAG_RE.findall(text),
        sorted(PLACEHOLDER_RE.findall(text)),
        text.count("\n"),
    )


def evaluate(case, line_no):
    errors = []
    missing = REQUIRED - set(case)
    if missing:
        return [f"line {line_no}: missing fields {sorted(missing)}"]

    source, target = case["source"], case["expected_target"]
    s, t = parts(source), parts(target)
    checks = set(case.get("checks", []))

    if "tags" in checks and s[0] != t[0]:
        errors.append(f"{case['id']}: tag regression")
    if "placeholders" in checks and s[1] != t[1]:
        errors.append(f"{case['id']}: placeholder regression")
    if "linebreaks" in checks and s[2] != t[2]:
        errors.append(f"{case['id']}: line-break regression")
    if case["task"] == "terminology" and "previous_target" in case:
        if target == case["previous_target"]:
            errors.append(f"{case['id']}: expected_target equals previous_target")

    return errors


def main():
    parser = argparse.ArgumentParser(description="Run shared Skill evaluation cases.")
    parser.add_argument("cases", nargs="+")
    args = parser.parse_args()

    errors = []
    total = 0

    for filename in args.cases:
        path = Path(filename)
        for line_no, raw in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
            if not raw.strip():
                continue
            total += 1
            try:
                case = json.loads(raw)
            except json.JSONDecodeError as exc:
                errors.append(f"{path}:{line_no}: invalid JSON: {exc}")
                continue
            errors.extend(f"{path}:{line_no}: {e}" for e in evaluate(case, line_no))

    status = "PASS" if not errors else "FAIL"
    print(f"EVALUATION {status}: {total} cases, {len(errors)} failures")
    for error in errors:
        print(error)
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
