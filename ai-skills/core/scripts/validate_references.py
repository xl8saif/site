#!/usr/bin/env python3
"""Validate and inspect a Skill's structured reference manifest."""

import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCHEMA_VERSION = "1.0"


def load(skill_id):
    path = ROOT / skill_id / "references" / "index.json"
    if not path.exists():
        raise SystemExit(f"missing reference index: {path}")
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise SystemExit(f"invalid reference index: {exc}") from exc
    return data


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("skill_id")
    parser.add_argument("--verified-only", action="store_true")
    args = parser.parse_args()

    data = load(args.skill_id)
    errors = []
    if data.get("schema_version") != SCHEMA_VERSION:
        errors.append("unsupported schema_version")
    if data.get("skill_id") != args.skill_id:
        errors.append("skill_id does not match directory")
    refs = data.get("references")
    if not isinstance(refs, list):
        errors.append("references must be an array")
        refs = []

    ids = set()
    for ref in refs:
        rid = ref.get("id")
        if not rid or rid in ids:
            errors.append(f"duplicate or missing reference id: {rid}")
        ids.add(rid or "")
        if ref.get("type") not in {"terminology","style","rule","example","source","dataset","workflow"}:
            errors.append(f"{rid}: invalid reference type")
        if ref.get("status") not in {"draft","verified","deprecated"}:
            errors.append(f"{rid}: invalid reference status")

    if errors:
        print("REFERENCES FAIL")
        for error in errors:
            print(error)
        return 1

    refs = [r for r in refs if r.get("status") == "verified"] if args.verified_only else refs
    print(f"REFERENCES PASS: {len(refs)} references")
    for ref in refs:
        print(f"{ref['id']} [{ref['type']}] [{ref['status']}] {ref['title']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
