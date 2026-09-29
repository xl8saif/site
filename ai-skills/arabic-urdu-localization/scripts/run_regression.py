#!/usr/bin/env python3
"""Validate Arabic → Urdu evaluation cases against deterministic structural rules."""

import argparse
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CHECKER = Path(__file__).resolve().parent / "check_ar_ur.py"

REQUIRED = {"id","source","expected_target","task","error_type","severity","checks","rationale","provenance"}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("cases")
    args = parser.parse_args()

    cases = Path(args.cases).read_text(encoding="utf-8").splitlines()
    failures = []
    checked = 0

    for line_no, line in enumerate(cases, 1):
        if not line.strip():
            continue
        case = json.loads(line)
        missing = REQUIRED - set(case)
        if missing:
            failures.append(f"line {line_no}: missing fields {sorted(missing)}")
            continue

        checked += 1
        with tempfile.TemporaryDirectory() as tmp:
            tmp = Path(tmp)
            source = tmp / "source.txt"
            target = tmp / "target.txt"
            source.write_text(case["source"], encoding="utf-8")
            target.write_text(case["expected_target"], encoding="utf-8")
            result = subprocess.run(
                [sys.executable, str(CHECKER), "--source", str(source), "--target", str(target), "--json"],
                capture_output=True, text=True, encoding="utf-8"
            )
            if "tags" in case["checks"] and result.returncode != 0:
                payload = json.loads(result.stdout)
                if payload["checks"]["tags"] != "pass":
                    failures.append(f"{case['id']}: tag check failed")
            if "placeholders" in case["checks"]:
                payload = json.loads(result.stdout)
                if payload["checks"]["placeholders"] != "pass":
                    failures.append(f"{case['id']}: placeholder check failed")
            if "linebreaks" in case["checks"]:
                payload = json.loads(result.stdout)
                if payload["checks"]["linebreaks"] != "pass":
                    failures.append(f"{case['id']}: linebreak check failed")

    print(f"REGRESSION {'PASS' if not failures else 'FAIL'}: {checked} cases, {len(failures)} failures")
    for failure in failures:
        print(failure)
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
