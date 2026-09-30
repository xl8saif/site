#!/usr/bin/env python3
"""Compatibility wrapper for the shared Skill evaluator."""

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
EVALUATOR = ROOT / "core" / "scripts" / "evaluate.py"


def main():
    if len(sys.argv) != 2:
        print("Usage: run_regression.py <cases.jsonl>")
        return 2
    return subprocess.call([sys.executable, str(EVALUATOR), sys.argv[1]])


if __name__ == "__main__":
    raise SystemExit(main())
