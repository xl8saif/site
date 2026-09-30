#!/usr/bin/env python3
"""Execute a routed deterministic validator and normalize its result.

This runner has no mutation capability. It only reads supplied inputs and
invokes a registered validator with subprocess argument arrays.
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PLAN = ROOT / "scripts" / "plan_task.py"
REGISTRY = ROOT / "registry.json"


def run_json(command, cwd):
    return subprocess.run(command, cwd=cwd, capture_output=True, text=True)


def normalize_result(skill_id, tool, completed):
    output = completed.stdout.strip()
    parsed = None
    if output:
        try:
            parsed = json.loads(output)
        except json.JSONDecodeError:
            parsed = None

    if completed.returncode == 0:
        status = "PASS"
    elif completed.returncode == 1:
        status = "FAIL"
    else:
        status = "REVIEW"

    return {
        "status": status,
        "skill_id": skill_id,
        "validator": tool,
        "exit_code": completed.returncode,
        "result": parsed if parsed is not None else output,
        "stderr": completed.stderr.strip(),
    }


def main():
    p = argparse.ArgumentParser(description="Execute the deterministic validator selected for a task.")
    p.add_argument("--task", required=True)
    p.add_argument("--source")
    p.add_argument("--target")
    p.add_argument("--knowledge")
    p.add_argument("--json", action="store_true")
    args = p.parse_args()

    plan_proc = run_json(
        [sys.executable, str(PLAN), "--task", args.task, "--json"],
        ROOT.parent,
    )
    if plan_proc.returncode:
        payload = {"status": "REVIEW", "stage": "planning", "error": plan_proc.stderr.strip()}
        print(json.dumps(payload, ensure_ascii=False, indent=2))
        return 2

    plan = json.loads(plan_proc.stdout)
    selected = plan.get("selected_skills", [])
    if not selected:
        print(json.dumps({"status": "REVIEW", "stage": "planning", "error": "No Skill selected."}, ensure_ascii=False, indent=2))
        return 2

    reports = []
    for skill in selected:
        tool = skill.get("primary_tool")
        if not tool:
            reports.append({
                "status": "REVIEW",
                "skill_id": skill["id"],
                "validator": None,
                "exit_code": None,
                "result": None,
                "stderr": "No deterministic validator registered.",
            })
            continue

        tool_path = ROOT / skill["id"] / tool
        if not tool_path.is_file():
            reports.append({
                "status": "REVIEW",
                "skill_id": skill["id"],
                "validator": tool,
                "exit_code": None,
                "result": None,
                "stderr": f"Validator not found: {tool_path}",
            })
            continue

        contract = skill.get("execution")
        if not isinstance(contract, dict):
            reports.append({
                "status": "REVIEW",
                "skill_id": skill["id"],
                "validator": tool,
                "exit_code": None,
                "result": None,
                "stderr": "No execution contract registered.",
            })
            continue

        command = [sys.executable, str(tool_path)]
        missing = False
        for input_name in contract.get("inputs", []):
            value = getattr(args, input_name, None)
            flag = contract.get("args", {}).get(input_name)
            if not value or not flag:
                missing = True
                break
            command += [flag, value]
        if missing:
            reports.append({
                "status": "REVIEW",
                "skill_id": skill["id"],
                "validator": tool,
                "exit_code": None,
                "result": None,
                "stderr": "Required execution input is missing.",
            })
            continue
        if contract.get("json"):
            command.append("--json")

        completed = run_json(command, ROOT.parent)
        reports.append(normalize_result(skill["id"], tool, completed))

    statuses = {item["status"] for item in reports}
    overall = "FAIL" if "FAIL" in statuses else "REVIEW" if "REVIEW" in statuses else "PASS"
    payload = {
        "status": overall,
        "agent_id": plan["agent_id"],
        "confidence": plan["confidence"],
        "matched_rule": plan.get("matched_rule"),
        "task": args.task,
        "reports": reports,
        "side_effects": "none",
    }
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    return 1 if overall == "FAIL" else 2 if overall == "REVIEW" else 0


if __name__ == "__main__":
    raise SystemExit(main())
