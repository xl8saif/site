#!/usr/bin/env python3
"""Unified runner for the Saif Language Skills framework."""

import argparse
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REGISTRY = ROOT / "registry.json"
EVALUATOR = ROOT / "core" / "scripts" / "evaluate.py"


def load_registry():
    return json.loads(REGISTRY.read_text(encoding="utf-8"))


def skills(registry):
    return registry.get("skills", [])


def validate_registry(registry):
    errors = []
    ids = set()
    for item in skills(registry):
        sid = item.get("id")
        if not sid or sid in ids:
            errors.append(f"duplicate or missing skill id: {sid}")
        ids.add(sid or "")
        for key in ("path", "entrypoint"):
            value = item.get(key)
            if not value:
                errors.append(f"{sid}: missing {key}")
            elif not (ROOT / value).exists():
                errors.append(f"{sid}: missing path {value}")
        skill_path = ROOT / item.get("path", "")
        for tool in item.get("deterministic_tools", []):
            if not (skill_path / tool).exists():
                errors.append(f"{sid}: missing deterministic tool {tool}")
    return errors


def evaluate_skill(item):
    cases = ROOT / item["path"] / "evals" / "cases.jsonl"
    if not cases.exists():
        return 1, f"{item['id']}: missing evals/cases.jsonl"
    result = subprocess.run([sys.executable, str(EVALUATOR), str(cases)], text=True)
    return result.returncode, f"{item['id']}: evaluator exit={result.returncode}"


def main():
    parser = argparse.ArgumentParser(description="Unified AI Skills runner.")
    parser.add_argument("command", choices=["list", "validate", "evaluate", "check", "all"])
    parser.add_argument("--skill", help="Run only the named Skill.")
    parser.add_argument("--status", help="Only run Skills with this registry status.")
    args = parser.parse_args()
    registry = load_registry()

    selected = [
        item for item in skills(registry)
        if (not args.skill or item.get("id") == args.skill)
        and (not args.status or item.get("status") == args.status)
    ]
    if args.skill and not selected:
        print(f"Unknown Skill: {args.skill}")
        return 1

    if args.command == "list":
        for item in selected:
            print(f"{item['id']} [{item.get('status', 'unknown')}]")
        return 0

    errors = validate_registry(registry)
    if args.command in {"validate", "check", "all"}:
        print(f"REGISTRY {'PASS' if not errors else 'FAIL'}")
        for error in errors:
            print(error)
        if errors:
            return 1
        if args.command == "validate":
            return 0

    if args.command in {"evaluate", "check", "all"}:
        failures = 0
        for item in selected:
            code, message = evaluate_skill(item)
            print(message)
            failures += int(code != 0)
        print(f"SKILL EVALUATION {'PASS' if failures == 0 else 'FAIL'}: {len(selected)} skills")
        return 1 if failures else 0

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
