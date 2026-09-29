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
REFERENCE_VALIDATOR = ROOT / "core" / "scripts" / "validate_references.py"


def load_registry():
    return json.loads(REGISTRY.read_text(encoding="utf-8"))


def skills(registry):
    return registry.get("skills", [])


def validate_registry(registry):
    errors = []
    if registry.get("version") != "1.6.3":
        errors.append("registry version must match release 1.6.3")
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
        if item.get("status") == "production" and not (skill_path / "SKILL.md").exists():
            errors.append(f"{sid}: production Skill missing SKILL.md")
        if item.get("status") == "production" and not (skill_path / "evals" / "cases.jsonl").exists():
            errors.append(f"{sid}: production Skill missing evals/cases.jsonl")
        for tool in item.get("deterministic_tools", []):
            if not (skill_path / tool).exists():
                errors.append(f"{sid}: missing deterministic tool {tool}")
        reference_index = skill_path / "references" / "index.json"
        if reference_index.exists():
            result = subprocess.run([sys.executable, str(REFERENCE_VALIDATOR), sid], capture_output=True, text=True)
            if result.returncode:
                errors.append(f"{sid}: invalid reference index")
        elif item.get("status") == "production":
            errors.append(f"{sid}: production Skill missing references/index.json")
    return errors

def validate_plugin(registry):
    errors = []
    plugin_path = ROOT / "plugin.json"
    if not plugin_path.exists():
        return ["missing plugin.json"]
    try:
        plugin = json.loads(plugin_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        return [f"plugin.json: invalid JSON: {exc}"]
    if plugin.get("version") != registry.get("version"):
        errors.append("plugin version must match registry version")
    registry_by_path = {
        item.get("entrypoint"): item
        for item in skills(registry)
        if item.get("entrypoint")
    }
    plugin_skills = plugin.get("skills", [])
    if not isinstance(plugin_skills, list):
        errors.append("plugin skills must be an array")
        return errors
    if len(plugin_skills) != len(set(plugin_skills)):
        errors.append("plugin contains duplicate Skill entries")
    for ref in plugin_skills:
        entrypoint = ref[2:] if isinstance(ref, str) and ref.startswith("./") else ref
        item = registry_by_path.get(entrypoint)
        if item is None:
            errors.append(f"plugin references unregistered Skill: {ref}")
        elif item.get("status") != "production":
            errors.append(f"plugin references non-production Skill: {ref}")
    for item in skills(registry):
        if item.get("status") == "production":
            expected = "./" + item.get("entrypoint", "")
            if expected not in plugin_skills:
                errors.append(f"production Skill missing from plugin: {item.get('id')}")
    return errors


def evaluate_skill(item):
    cases = ROOT / item["path"] / "evals" / "cases.jsonl"
    if not cases.exists():
        return 1, f"{item['id']}: missing evals/cases.jsonl"
    result = subprocess.run([sys.executable, str(EVALUATOR), str(cases)], text=True)
    return result.returncode, f"{item['id']}: evaluator exit={result.returncode}"


def main():
    parser = argparse.ArgumentParser(description="Unified AI Skills runner.")
    parser.add_argument("command", choices=["list", "validate", "evaluate", "retrieve", "promote-check", "check", "all"])
    parser.add_argument("--skill", help="Run only the named Skill.")
    parser.add_argument("--status", help="Only run Skills with this registry status.")
    parser.add_argument("query", nargs="*", help="Reference retrieval query.")
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

    if args.command == "retrieve":
        if not args.skill:
            print("retrieve requires --skill")
            return 1
        if not args.query:
            print("retrieve requires a query")
            return 1
        retriever = ROOT / "core" / "scripts" / "retrieve_references.py"
        return subprocess.run([sys.executable, str(retriever), args.skill, *args.query], text=True).returncode

    errors = validate_registry(registry)
    plugin_errors = validate_plugin(registry)
    errors.extend(plugin_errors)
    if args.command in {"validate", "check", "all"}:
        print(f"REGISTRY {'PASS' if not errors else 'FAIL'}")
        for error in errors:
            print(error)
        if errors:
            return 1
        if args.command == "validate":
            return 0

    if args.command == "promote-check":
        if not args.skill:
            print("promote-check requires --skill")
            return 1
        item = selected[0]
        gate = ROOT / "scripts" / "promotion_gate.py"
        result = subprocess.run([sys.executable, str(gate), item["id"]], text=True)
        return result.returncode

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
