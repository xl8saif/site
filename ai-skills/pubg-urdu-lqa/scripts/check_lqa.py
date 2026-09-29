#!/usr/bin/env python3
"""PUBG MOBILE Urdu LQA compatibility wrapper using the shared core."""

import argparse
import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
CORE = ROOT / "core" / "scripts" / "check_localization.py"
TERMS = Path(__file__).resolve().parents[1] / "references" / "terminology.json"
PROTECTED = Path(__file__).resolve().parents[1] / "references" / "protected-terms.json"
RETRIEVER = ROOT / "core" / "scripts" / "retrieve_references.py"


def main():
    parser = argparse.ArgumentParser(description="Run PUBG Urdu LQA checks.")
    parser.add_argument("--source", required=True)
    parser.add_argument("--target", required=True)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    retrieval = subprocess.run([sys.executable, str(RETRIEVER), "pubg-urdu-lqa", *args.source.split(), "--limit", "20"], capture_output=True, text=True)
    if retrieval.returncode != 0:
        print("REFERENCE RETRIEVAL FAIL")
        return retrieval.returncode

    cmd = [
        sys.executable, str(CORE),
        "--source", args.source,
        "--target", args.target,
        "--terminology", str(TERMS),
        "--protected", str(PROTECTED),
    ]
    if args.json:
        cmd.append("--json")
    return subprocess.call(cmd)


if __name__ == "__main__":
    raise SystemExit(main())
