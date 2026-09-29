#!/usr/bin/env python3
"""Validate a Skill's structured reference manifest."""

import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCHEMA_VERSION = "1.0"
VALID_TYPES = {"terminology", "style", "rule", "example", "source", "dataset", "workflow"}
VALID_STATUSES = {"draft", "verified", "deprecated"}
ALLOWED_INDEX_KEYS = {"schema_version", "skill_id", "references"}
ALLOWED_REF_KEYS = {"id", "type", "title", "status", "source", "notes", "tags", "entries", "path"}


def fail(message):
    print("REFERENCES FAIL")
    print(message)
    return 1


def load_index(skill_id):
    if not isinstance(skill_id, str) or not skill_id:
        return None, "skill_id must be a non-empty string"
    path = ROOT / skill_id / "references" / "index.json"
    try:
        path.resolve().relative_to(ROOT.resolve())
    except ValueError:
        return None, "skill_id resolves outside ai-skills/"
    if not path.is_file():
        return None, f"missing reference index: {path}"
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        return None, f"invalid reference index: {exc}"
    return data, None


def validate(skill_id, data):
    errors = []
    if not isinstance(data, dict):
        return ["reference index top-level value must be an object"]
    extra = set(data) - ALLOWED_INDEX_KEYS
    if extra:
        errors.append(f"unexpected top-level fields: {sorted(extra)}")
    if data.get("schema_version") != SCHEMA_VERSION:
        errors.append("schema_version must be 1.0")
    if data.get("skill_id") != skill_id:
        errors.append("skill_id does not match directory")
    refs = data.get("references")
    if not isinstance(refs, list):
        errors.append("references must be an array")
        return errors

    ref_root = (ROOT / skill_id / "references").resolve()
    seen = set()
    for index, ref in enumerate(refs, 1):
        label = f"reference #{index}"
        if not isinstance(ref, dict):
            errors.append(f"{label}: must be an object")
            continue
        rid = ref.get("id")
        if not isinstance(rid, str) or not rid:
            errors.append(f"{label}: id must be a non-empty string")
            rid = f"#{index}"
        elif rid in seen:
            errors.append(f"duplicate reference id: {rid}")
        else:
            seen.add(rid)
        extra = set(ref) - ALLOWED_REF_KEYS
        if extra:
            errors.append(f"{rid}: unexpected fields: {sorted(extra)}")
        if not isinstance(ref.get("title"), str) or not ref.get("title"):
            errors.append(f"{rid}: title must be a non-empty string")
        if ref.get("type") not in VALID_TYPES:
            errors.append(f"{rid}: invalid reference type")
        if ref.get("status") not in VALID_STATUSES:
            errors.append(f"{rid}: invalid reference status")

        if "source" in ref and not isinstance(ref["source"], str):
            errors.append(f"{rid}: source must be a string")
        if "notes" in ref and not isinstance(ref["notes"], str):
            errors.append(f"{rid}: notes must be a string")
        if "tags" in ref and (
            not isinstance(ref["tags"], list) or not all(isinstance(x, str) for x in ref["tags"])
        ):
            errors.append(f"{rid}: tags must be a string array")
        if "entries" in ref and not isinstance(ref["entries"], (list, dict)):
            errors.append(f"{rid}: entries must be an array or object")

        if "path" in ref:
            path_value = ref["path"]
            if not isinstance(path_value, str) or not path_value:
                errors.append(f"{rid}: path must be a non-empty string")
                continue
            target = ref_root / path_value
            try:
                target.resolve().relative_to(ref_root)
            except ValueError:
                errors.append(f"{rid}: reference path escapes references/: {path_value}")
                continue
            if not target.is_file():
                errors.append(f"{rid}: referenced file does not exist: {path_value}")
            elif target.suffix.lower() == ".json":
                try:
                    json.loads(target.read_text(encoding="utf-8"))
                except (OSError, json.JSONDecodeError) as exc:
                    errors.append(f"{rid}: referenced JSON is invalid: {exc}")
    return errors


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("skill_id")
    parser.add_argument("--verified-only", action="store_true")
    args = parser.parse_args()

    data, error = load_index(args.skill_id)
    if error:
        return fail(error)
    errors = validate(args.skill_id, data)
    if errors:
        print("REFERENCES FAIL")
        for error in errors:
            print(error)
        return 1

    refs = data["references"]
    if args.verified_only:
        refs = [ref for ref in refs if ref["status"] == "verified"]
    print(f"REFERENCES PASS: {len(refs)} references")
    for ref in refs:
        print(f"{ref['id']} [{ref['type']}] [{ref['status']}] {ref['title']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
