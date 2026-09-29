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
        for tool in item.get("deterministic_tools", []):
            if not (ROOT / item["path"] / tool).exists():
                errors.append(f"{sid}: missing deterministic tool {tool}")
    return errors


def evaluate_skill(item):
    cases = ROOT / item["path"] / "evals" / "cases.jsonl"
    if not cases.exists():
        return 0, f"{item['id']}: no evals/cases.jsonl"
    result = subprocess.run(
        [sys.executable, str(EVALUATOR), str(cases)],
        text=True,
    )
    return result.returncode, f"{item['id']}: evaluator exit={result.returncode}"


def main():
    parser = argparse.ArgumentParser(description="Unified AI Skills runner.")
    parser.add_argument("command", choices=["list", "validate", "evaluate", "check", "all"])
    args = parser.parse_args()
    registry = load_registry()

    if args.command == "list":
        for item in skills(registry):
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
        for item in skills(registry):
            code, _ = evaluate_skill(item)
            failures += int(code != 0)
        print(f"SKILL EVALUATION {'PASS' if failures == 0 else 'FAIL'}: {len(selected)} skills")
        if failures:
            return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
