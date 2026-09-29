#!/usr/bin/env python3
"""Check whether a draft Skill satisfies the production promotion gate."""

import argparse
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "registry.json"
EVALUATOR = ROOT / "core" / "scripts" / "evaluate.py"

REQUIRED = ("SKILL.md", "evals/cases.jsonl", "references/index.json")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("skill_id")
    args = parser.parse_args()

    registry = json.loads(REGISTRY.read_text(encoding="utf-8"))
    item = next((x for x in registry.get("skills", []) if x.get("id") == args.skill_id), None)
    if item is None:
        print(f"PROMOTION FAIL: unknown Skill {args.skill_id}")
        return 1

    skill = ROOT / item["path"]
    failures = []

    if item.get("status") != "draft":
        failures.append(f"Skill status is {item.get('status')}, expected draft")

    for rel in REQUIRED:
        if not (skill / rel).exists():
            failures.append(f"missing required artifact: {rel}")

    cases = skill / "evals" / "cases.jsonl"
    if cases.exists():
        result = subprocess.run([sys.executable, str(EVALUATOR), str(cases)], text=True)
        if result.returncode:
            failures.append("evaluation suite failed")

    reference_index = skill / "references" / "index.json"
    if reference_index.exists():
        validator = ROOT / "core" / "scripts" / "validate_references.py"
        result = subprocess.run([sys.executable, str(validator), args.skill_id, "--verified-only"], text=True)
        if result.returncode:
            failures.append("reference index validation failed")
        else:
            data = json.loads(reference_index.read_text(encoding="utf-8"))
            verified = [r for r in data.get("references", []) if r.get("status") == "verified"]
            if not verified:
                failures.append("reference index has no verified references")


    if failures:
        print(f"PROMOTION FAIL: {args.skill_id}")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print(f"PROMOTION READY: {args.skill_id}")
    print("Human review is still required before changing registry status to production.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
