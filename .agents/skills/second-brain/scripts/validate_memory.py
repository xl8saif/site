#!/usr/bin/env python3
"""Validate Second Brain JSONL records with stdlib only."""

from __future__ import annotations

import json
import sys
from datetime import datetime
from pathlib import Path

MEMORY_TYPES = {"semantic","episodic","procedural","preference","terminology","correction","research","relationship"}
STATUSES = {"verified","established","tentative","superseded"}
SOURCE_KINDS = {"conversation","document","web","github","email","project","human","derived"}


def iso(value: str) -> bool:
    try:
        datetime.fromisoformat(value.replace("Z", "+00:00"))
        return True
    except Exception:
        return False


def validate(item: dict, line: int) -> list[str]:
    errors = []
    for key in ("id","type","content","status","confidence","source","created_at","updated_at"):
        if key not in item:
            errors.append(f"line {line}: missing {key}")
    if item.get("type") not in MEMORY_TYPES:
        errors.append(f"line {line}: invalid type")
    if item.get("status") not in STATUSES:
        errors.append(f"line {line}: invalid status")
    c = item.get("confidence")
    if not isinstance(c, (int,float)) or not 0 <= c <= 1:
        errors.append(f"line {line}: confidence must be 0..1")
    for key in ("created_at","updated_at"):
        if key in item and not iso(str(item[key])):
            errors.append(f"line {line}: {key} must be ISO-8601")
    source = item.get("source")
    if not isinstance(source, dict) or source.get("kind") not in SOURCE_KINDS or not source.get("locator"):
        errors.append(f"line {line}: invalid source")
    if item.get("status") == "verified" and item.get("confidence", 0) < 0.8:
        errors.append(f"line {line}: verified memory requires confidence >= 0.8")
    return errors


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: validate_memory.py MEMORY.jsonl")
        return 2
    path = Path(sys.argv[1])
    errors = []
    count = 0
    for line_no, raw in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not raw.strip():
            continue
        count += 1
        try:
            item = json.loads(raw)
        except json.JSONDecodeError as exc:
            errors.append(f"line {line_no}: invalid JSON: {exc}")
            continue
        if not isinstance(item, dict):
            errors.append(f"line {line_no}: record must be an object")
            continue
        errors.extend(validate(item, line_no))
    if errors:
        print("FAIL: Second Brain memory validation")
        print("\n".join(errors))
        return 1
    print(f"PASS: {count} memory records validated")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
