#!/usr/bin/env python3
"""Smoke tests for routed execution planning."""

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PLAN = ROOT / "scripts" / "plan_task.py"

CASES = [
    ("PUBG MOBILE Urdu LQA for a WOW event", "pubg-urdu-lqa-agent", "pubg-urdu-lqa"),
    ("Translate this Arabic legal contract into Urdu", "legal-translation-agent", "legal-translation-qa"),
    ("Review Indus-Kohistani mvy corpus metadata", "indus-kohistani-research-agent", "indus-kohistani-research"),
    ("Run final deterministic structural QA before delivery", "qa-gate-agent", None),
]

def main():
    failures=[]
    for task, expected_agent, expected_skill in CASES:
        r=subprocess.run([sys.executable,str(PLAN),"--task",task,"--json"],cwd=ROOT.parent,capture_output=True,text=True)
        if r.returncode:
            failures.append(f"{task!r}: exit {r.returncode}: {r.stderr.strip()}")
            continue
        try: payload=json.loads(r.stdout)
        except json.JSONDecodeError as exc:
            failures.append(f"{task!r}: invalid JSON: {exc}")
            continue
        if payload.get("agent_id") != expected_agent:
            failures.append(f"{task!r}: expected agent {expected_agent}, got {payload.get('agent_id')}")
        if expected_skill and payload.get("selected_skills",[{}])[0].get("id") != expected_skill:
            failures.append(f"{task!r}: expected Skill {expected_skill}")
        if expected_agent == "qa-gate-agent" and len(payload.get("selected_skills",[])) < 5:
            failures.append("qa-gate-agent did not expose all validation Skills")
    if failures:
        print("PLAN SMOKE FAIL")
        print("\n".join(failures))
        return 1
    print(f"PLAN SMOKE PASS: {len(CASES)} cases")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
