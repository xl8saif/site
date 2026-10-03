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
SELF_AUDIT = ROOT / "core" / "scripts" / "self_audit.py"


def load_registry():
    try:
        return json.loads(REGISTRY.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise SystemExit(f"invalid registry.json: {exc}") from exc


def skills(registry):
    value = registry.get("skills")
    return value if isinstance(value, list) else []


def contained(base, candidate):
    try:
        Path(candidate).resolve().relative_to(Path(base).resolve())
        return True
    except ValueError:
        return False


def validate_registry(registry):
    errors = []
    if not isinstance(registry, dict):
        return ["registry top-level value must be an object"]
    if registry.get("schema_version") != "1.0":
        errors.append("registry schema_version must be 1.0")
    if not isinstance(registry.get("name"), str) or not registry.get("name"):
        errors.append("registry requires a non-empty name")
    if not isinstance(registry.get("owner"), str) or not registry.get("owner"):
        errors.append("registry requires a non-empty owner")
    registry_skills = registry.get("skills")
    if not isinstance(registry_skills, list):
        return errors + ["registry skills must be an array"]

    ids = set()
    for item in registry_skills:
        if not isinstance(item, dict):
            errors.append("registry Skill entries must be objects")
            continue
        sid = item.get("id")
        if not isinstance(sid, str) or not sid:
            errors.append("Skill id must be a non-empty string")
            continue
        if sid in ids:
            errors.append(f"duplicate Skill id: {sid}")
        ids.add(sid)

        status = item.get("status")
        if status not in {"draft", "production", "deprecated"}:
            errors.append(f"{sid}: invalid status {status!r}")

        path_value = item.get("path")
        entrypoint = item.get("entrypoint")
        if not isinstance(path_value, str) or not path_value:
            errors.append(f"{sid}: missing path")
            continue
        skill_path = ROOT / path_value
        if not contained(ROOT, skill_path):
            errors.append(f"{sid}: path escapes ai-skills/: {path_value}")
            continue
        if not skill_path.is_dir():
            errors.append(f"{sid}: Skill directory missing: {path_value}")

        if not isinstance(entrypoint, str) or not entrypoint:
            errors.append(f"{sid}: missing entrypoint")
        else:
            ep = ROOT / entrypoint
            if not contained(skill_path, ep):
                errors.append(f"{sid}: entrypoint escapes Skill directory: {entrypoint}")
            elif not ep.is_file():
                errors.append(f"{sid}: entrypoint is missing: {entrypoint}")

        tools = item.get("deterministic_tools", [])
        if not isinstance(tools, list) or not all(isinstance(x, str) for x in tools):
            errors.append(f"{sid}: deterministic_tools must be a string array")
            tools = []
        for tool in tools:
            target = skill_path / tool
            if not contained(skill_path, target):
                errors.append(f"{sid}: deterministic tool escapes Skill directory: {tool}")
            elif not target.is_file():
                errors.append(f"{sid}: missing deterministic tool: {tool}")

        if status == "production":
            for required in ("SKILL.md", "evals/cases.jsonl", "references/index.json"):
                if not (skill_path / required).is_file():
                    errors.append(f"{sid}: production Skill missing {required}")

        reference_index = skill_path / "references" / "index.json"
        if reference_index.is_file():
            result = subprocess.run(
                [sys.executable, str(REFERENCE_VALIDATOR), sid],
                cwd=ROOT.parent, capture_output=True, text=True
            )
            if result.returncode:
                details = result.stdout.strip() or result.stderr.strip() or "validator failed"
                errors.append(f"{sid}: invalid reference index: {details}")
        elif status == "production":
            errors.append(f"{sid}: production Skill missing references/index.json")
    return errors


def validate_plugin(registry):
    errors = []
    plugin_path = ROOT / "plugin.json"
    if not plugin_path.is_file():
        return ["missing plugin.json"]
    try:
        plugin = json.loads(plugin_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        return [f"plugin.json: invalid JSON: {exc}"]
    if not isinstance(plugin, dict):
        return ["plugin.json: top-level value must be an object"]
    if plugin.get("version") != registry.get("version"):
        errors.append("plugin version must match registry version")

    registry_by_path = {
        item.get("entrypoint"): item
        for item in skills(registry)
        if isinstance(item, dict) and isinstance(item.get("entrypoint"), str)
    }
    plugin_skills = plugin.get("skills", [])
    if not isinstance(plugin_skills, list) or not all(isinstance(x, str) for x in plugin_skills):
        return errors + ["plugin skills must be a string array"]
    if len(plugin_skills) != len(set(plugin_skills)):
        errors.append("plugin contains duplicate Skill entries")

    for ref in plugin_skills:
        entrypoint = ref[2:] if ref.startswith("./") else ref
        item = registry_by_path.get(entrypoint)
        if item is None:
            errors.append(f"plugin references unregistered Skill: {ref}")
        elif item.get("status") != "production":
            errors.append(f"plugin references non-production Skill: {ref}")

    expected = {
        "./" + item["entrypoint"]
        for item in skills(registry)
        if isinstance(item, dict)
        and item.get("status") == "production"
        and isinstance(item.get("entrypoint"), str)
    }
    if set(plugin_skills) != expected:
        errors.append(f"plugin production Skill set mismatch: expected {sorted(expected)}, got {sorted(plugin_skills)}")
    return errors


def run_self_audit():
    return subprocess.run([sys.executable, str(SELF_AUDIT)], cwd=ROOT.parent, text=True).returncode


def evaluate_skill(item):
    cases = ROOT / item["path"] / "evals" / "cases.jsonl"
    if not cases.is_file():
        if item.get("status") != "production":
            return 0, f"{item['id']}: evaluation skipped ({item.get('status', 'non-production')})"
        return 1, f"{item['id']}: missing evals/cases.jsonl"
    result = subprocess.run([sys.executable, str(EVALUATOR), str(cases)], text=True)
    return result.returncode, f"{item['id']}: evaluator exit={result.returncode}"


def main():
    parser = argparse.ArgumentParser(description="Unified AI Skills runner.")
    parser.add_argument(
        "command",
        choices=["list", "audit", "validate", "evaluate", "retrieve", "promote-check", "review", "check", "all"],
    )
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

    if args.command == "audit":
        return run_self_audit()

    if args.command == "retrieve":
        if not args.skill:
            print("retrieve requires --skill")
            return 1
        if not args.query:
            print("retrieve requires a query")
            return 1
        retriever = ROOT / "core" / "scripts" / "retrieve_references.py"
        return subprocess.run(
            [sys.executable, str(retriever), args.skill, *args.query],
            cwd=ROOT.parent, text=True
        ).returncode

    errors = validate_registry(registry)
    errors.extend(validate_plugin(registry))
    if args.command in {"validate", "check", "all"}:
        print(f"REGISTRY {'PASS' if not errors else 'FAIL'}")
        for error in errors:
            print(error)
        if errors:
            return 1
        if args.command == "validate":
            return 0

    if args.command == "review":
        if not args.skill and not args.query:
            print("review requires --skill or a task query")
            return 1
        gate = ROOT / "scripts" / "review_gate.py"
        if args.skill:
            task = " ".join(args.query) if args.query else args.skill
        else:
            task = " ".join(args.query)
        return subprocess.run([sys.executable, str(gate), "--task", task, "--json"], cwd=ROOT.parent, text=True).returncode

    if args.command == "promote-check":
        if not args.skill:
            print("promote-check requires --skill")
            return 1
        gate = ROOT / "scripts" / "promotion_gate.py"
        return subprocess.run(
            [sys.executable, str(gate), selected[0]["id"]],
            cwd=ROOT.parent, text=True
        ).returncode

    if args.command in {"evaluate", "check", "all"}:
        if args.command == "all":
            audit_code = run_self_audit()
            if audit_code:
                return audit_code
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
