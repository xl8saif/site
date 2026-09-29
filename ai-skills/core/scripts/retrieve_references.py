#!/usr/bin/env python3
"""Retrieve verified Skill references relevant to a query."""

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VALID_STATUSES = {"draft", "verified", "deprecated"}


def load_index(skill_id):
    path = ROOT / skill_id / "references" / "index.json"
    if not path.exists():
        return []
    return json.loads(path.read_text(encoding="utf-8")).get("references", [])


def load_entries(skill_id, ref):
    path = ref.get("path")
    if not path:
        return ref.get("entries", [])
    target = ROOT / skill_id / "references" / path
    if not target.is_file() or target.suffix.lower() != ".json":
        return ref.get("entries", [])
    data = json.loads(target.read_text(encoding="utf-8"))
    if isinstance(data, dict):
        return [{"source": k, "preferred": v[0] if isinstance(v, list) and v else v,
                 "rejected": v[1] if isinstance(v, list) and len(v) > 1 else []}
                for k, v in data.items() if not k.startswith("_")]
    if isinstance(data, list):
        return [{"term": x} for x in data]
    return []


def score(ref, entry, query):
    hay = json.dumps({"reference": ref, "entry": entry}, ensure_ascii=False).lower()
    terms = re.findall(r"\w+", query.lower(), flags=re.UNICODE)
    return sum(1 for t in terms if t in hay)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("skill_id")
    parser.add_argument("query", nargs="+")
    parser.add_argument("--limit", type=int, default=10)
    parser.add_argument("--include-draft", action="store_true")
    args = parser.parse_args()

    query = " ".join(args.query)
    refs = load_index(args.skill_id)
    results = []
    for ref in refs:
        status = ref.get("status")
        if status != "verified" and not (args.include_draft and status == "draft"):
            continue
        for entry in load_entries(args.skill_id, ref):
            points = score(ref, entry, query)
            if points:
                results.append({"score": points, "reference": ref["id"], "type": ref.get("type"),
                                "status": status, "title": ref.get("title"), "entry": entry})
    results.sort(key=lambda x: (-x["score"], x["reference"]))
    print(json.dumps({"skill_id": args.skill_id, "query": query, "results": results[:max(1, args.limit)]},
                     ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
