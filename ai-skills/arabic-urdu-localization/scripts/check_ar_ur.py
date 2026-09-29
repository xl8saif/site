#!/usr/bin/env python3
"""Arabic → Urdu deterministic QA wrapper using the shared localization core."""

import argparse
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
CORE = ROOT / "core" / "scripts" / "check_localization.py"
TERMS = Path(__file__).resolve().parents[1] / "references" / "terminology.json"
PROTECTED = Path(__file__).resolve().parents[1] / "references" / "protected-terms.json"
RETRIEVER = ROOT / "core" / "scripts" / "retrieve_references.py"


def main():
    parser = argparse.ArgumentParser(description="Run Arabic → Urdu localization checks.")
    parser.add_argument("--source", required=True)
    parser.add_argument("--target", required=True)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    retrieval = subprocess.run([sys.executable, str(RETRIEVER), "arabic-urdu-localization", *args.source.split(), "--limit", "20"], capture_output=True, text=True)
    if retrieval.returncode != 0:
        print("REFERENCE RETRIEVAL FAIL")
        return retrieval.returncode

    command = [
        sys.executable, str(CORE),
        "--source", args.source,
        "--target", args.target,
        "--terminology", str(TERMS),
        "--protected", str(PROTECTED),
    ]
    if args.json:
        command.append("--json")
    return subprocess.call(command)


if __name__ == "__main__":
    raise SystemExit(main())
