#!/usr/bin/env python3
"""Smoke tests for deterministic agent routing."""

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ROUTER = ROOT / "scripts" / "route_task.py"

CASES = [
    ("PUBG MOBILE Urdu LQA for a WOW live-ops string", "pubg-urdu-lqa-agent"),
    ("Translate this Arabic legal contract into Urdu", "legal-translation-agent"),
    ("Review Indus-Kohistani mvy corpus metadata", "indus-kohistani-research-agent"),
    ("Run final deterministic structural QA before delivery", "qa-gate-agent"),
    ("Arabic to Urdu localization and MTPE", "localization-agent"),
    ("Translate this general multilingual product text", "localization-agent"),
    ("Unrelated task with no routing signal", "localization-agent"),
]


def main():
    failures = []
    for task, expected in CASES:
        result = subprocess.run(
            [sys.executable, str(ROUTER), "--task", task, "--json"],
            capture_output=True,
            text=True,
            cwd=ROOT.parent,
        )
        if result.returncode:
            failures.append(f"{task!r}: router exited {result.returncode}: {result.stderr.strip()}")
            continue
        try:
            payload = json.loads(result.stdout)
        except json.JSONDecodeError as exc:
            failures.append(f"{task!r}: invalid JSON: {exc}")
            continue
        if payload.get("agent_id") != expected:
            failures.append(
                f"{task!r}: expected {expected}, got {payload.get('agent_id')}"
            )

    if failures:
        print("ROUTER SMOKE FAIL")
        print("\n".join(failures))
        return 1

    print(f"ROUTER SMOKE PASS: {len(CASES)} cases")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
