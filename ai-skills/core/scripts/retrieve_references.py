#!/usr/bin/env python3
"""Retrieve verified Skill references relevant to a query."""

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
VALID_TYPES = {"terminology", "style", "rule", "example", "source", "dataset", "workflow"}
VALID_STATUSES = {"draft", "verified", "deprecated"}


def error(message):
    raise ValueError(message)


def load_index(skill_id):
    path = ROOT / skill_id / "references" / "index.json"
    try:
        path.resolve().relative_to(ROOT.resolve())
    except ValueError:
        error("skill_id resolves outside ai-skills/")
    if not path.is_file():
        error(f"missing reference index: {path}")
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        error(f"invalid reference index: {exc}")
    if not isinstance(data, dict):
        error("reference index top-level value must be an object")
    if data.get("schema_version") != "1.0":
        error("unsupported reference schema_version")
    if data.get("skill_id") != skill_id:
        error("reference index skill_id does not match requested Skill")
    refs = data.get("references")
    if not isinstance(refs, list):
        error("reference index references must be an array")
    return refs


def load_entries(skill_id, ref):
    rid = ref.get("id", "<unknown>")
    if not isinstance(ref, dict):
        error("reference entry must be an object")
    if not isinstance(ref.get("id"), str) or not ref["id"]:
        error("reference id must be a non-empty string")
    if ref.get("type") not in VALID_TYPES:
        error(f"{rid}: invalid reference type")
    if ref.get("status") not in VALID_STATUSES:
        error(f"{rid}: invalid reference status")
    if not isinstance(ref.get("title"), str) or not ref["title"]:
        error(f"{rid}: title must be a non-empty string")

    path_value = ref.get("path")
    if not path_value:
        entries = ref.get("entries", [])
        if not isinstance(entries, (list, dict)):
            error(f"{rid}: entries must be an array or object")
        return normalize_entries(entries, rid)

    if not isinstance(path_value, str):
        error(f"{rid}: path must be a string")
    root = (ROOT / skill_id / "references").resolve()
    target = root / path_value
    try:
        target.resolve().relative_to(root)
    except ValueError:
        error(f"{rid}: reference path escapes references/: {path_value}")
    if not target.is_file():
        error(f"{rid}: referenced file does not exist: {path_value}")
    if target.suffix.lower() != ".json":
        error(f"{rid}: only JSON reference files are supported: {path_value}")
    try:
        data = json.loads(target.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        error(f"{rid}: referenced JSON is invalid: {exc}")
    return normalize_entries(data, rid)


def normalize_entries(data, rid):
    if isinstance(data, dict):
        return [
            {
                "source": key,
                "preferred": value[0] if isinstance(value, list) and value else value,
                "rejected": value[1] if isinstance(value, list) and len(value) > 1 else [],
            }
            for key, value in data.items()
            if not key.startswith("_")
        ]
    if isinstance(data, list):
        return [{"term": value} for value in data]
    error(f"{rid}: reference data must be an array or object")


def score(ref, entry, query):
    hay = json.dumps({"reference": ref, "entry": entry}, ensure_ascii=False).lower()
    terms = [t for t in re.findall(r"\w+", query.lower(), flags=re.UNICODE) if len(t) > 1]
    return sum(1 for term in terms if term in hay)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("skill_id")
    parser.add_argument("query", nargs="+")
    parser.add_argument("--limit", type=int, default=10)
    parser.add_argument("--include-draft", action="store_true")
    args = parser.parse_args()

    if args.limit < 1:
        parser.error("--limit must be >= 1")

    query = " ".join(args.query)
    refs = load_index(args.skill_id)

    results = []
    seen_ids = set()
    for ref in refs:
        if not isinstance(ref, dict):
            error("reference entry must be an object")
        rid = ref.get("id")
        if rid in seen_ids:
            error(f"duplicate reference id: {rid}")
        seen_ids.add(rid)
        status = ref.get("status")
        if status != "verified" and not (args.include_draft and status == "draft"):
            continue
        for entry in load_entries(args.skill_id, ref):
            points = score(ref, entry, query)
            if points:
                results.append(
                    {
                        "score": points,
                        "reference": rid,
                        "type": ref.get("type"),
                        "status": status,
                        "title": ref.get("title"),
                        "entry": entry,
                    }
                )

    results.sort(key=lambda item: (-item["score"], item["reference"]))
    print(
        json.dumps(
            {"skill_id": args.skill_id, "query": query, "results": results[:args.limit]},
            ensure_ascii=False,
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ValueError as exc:
        print(f"REFERENCE RETRIEVAL FAIL: {exc}")
        raise SystemExit(1)
