#!/usr/bin/env python3
"""Normalize a ChatGPT data-export conversations.json into private Second Brain JSONL.

This script performs no LLM calls and writes only local files. It preserves source
conversation IDs/timestamps so a later extraction step can trace every memory back
to the original conversation.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path


def text_from_message(message: dict) -> str:
    content = message.get("content") or {}
    parts = content.get("parts") or []
    out = []
    for part in parts:
        if isinstance(part, str):
            out.append(part)
        elif isinstance(part, dict) and isinstance(part.get("text"), str):
            out.append(part["text"])
    return "\n".join(x for x in out if x).strip()


def flatten_mapping(mapping: dict) -> list[dict]:
    rows = []
    for node in mapping.values():
        msg = node.get("message") or {}
        author = msg.get("author") or {}
        role = author.get("role")
        text = text_from_message(msg)
        if role and text:
            rows.append({
                "role": role,
                "text": text,
                "message_id": msg.get("id"),
                "create_time": msg.get("create_time"),
            })
    rows.sort(key=lambda x: x.get("create_time") or 0)
    return rows


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("export", help="ChatGPT conversations.json")
    ap.add_argument("-o", "--output", default="chatgpt-conversations.jsonl")
    args = ap.parse_args()

    data = json.loads(Path(args.export).read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise SystemExit("Expected ChatGPT conversations.json to contain a JSON array.")

    out = Path(args.output)
    with out.open("w", encoding="utf-8") as fh:
        count = 0
        for conv in data:
            rows = flatten_mapping(conv.get("mapping") or {})
            if not rows:
                continue
            record = {
                "conversation_id": conv.get("conversation_id") or conv.get("id"),
                "title": conv.get("title") or "",
                "create_time": conv.get("create_time"),
                "update_time": conv.get("update_time"),
                "source": {"kind": "conversation", "locator": conv.get("conversation_id") or conv.get("id") or "unknown"},
                "messages": rows,
            }
            fh.write(json.dumps(record, ensure_ascii=False) + "\n")
            count += 1

    print(f"PASS: normalized {count} conversations -> {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
