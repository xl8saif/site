#!/usr/bin/env python3
"""PUBG MOBILE Urdu LQA compatibility wrapper using the shared core."""

import argparse
import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CORE = ROOT / "core" / "scripts" / "check_localization.py"
TERMS = Path(__file__).resolve().parents[1] / "references" / "terminology.json"
PROTECTED = Path(__file__).resolve().parents[1] / "references" / "protected-terms.json"


def main():
    parser = argparse.ArgumentParser(description="Run PUBG Urdu LQA checks.")
    parser.add_argument("--source", required=True)
    parser.add_argument("--target", required=True)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    cmd = [
        sys.executable, str(CORE),
        "--source", args.source,
        "--target", args.target,
        "--reference-index", str(Path(__file__).resolve().parents[1] / "references" / "index.json"),
    ]
    if args.json:
        cmd.append("--json")
    return subprocess.call(cmd)


if __name__ == "__main__":
    raise SystemExit(main())
