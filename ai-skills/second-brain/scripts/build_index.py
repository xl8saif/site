#!/usr/bin/env python3
"""Build a disposable SQLite FTS5 index from Second Brain JSONL."""

from __future__ import annotations

import argparse
import json
import sqlite3
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("memory_jsonl")
    parser.add_argument("--db", default=".second-brain/index.sqlite")
    args = parser.parse_args()

    source = Path(args.memory_jsonl)
    db_path = Path(args.db)
    db_path.parent.mkdir(parents=True, exist_ok=True)

    con = sqlite3.connect(db_path)
    con.executescript("""
      PRAGMA journal_mode=WAL;
      DROP TABLE IF EXISTS memory;
      DROP TABLE IF EXISTS memory_fts;
      CREATE TABLE memory (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        content TEXT NOT NULL,
        domain TEXT,
        project TEXT,
        status TEXT NOT NULL,
        confidence REAL NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        payload TEXT NOT NULL
      );
      CREATE VIRTUAL TABLE memory_fts USING fts5(
        id UNINDEXED,
        content,
        domain,
        project,
        tags,
        tokenize='unicode61'
      );
    """)

    count = 0
    for raw in source.read_text(encoding="utf-8").splitlines():
        if not raw.strip():
            continue
        item = json.loads(raw)
        con.execute(
            "INSERT INTO memory VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (
                item["id"], item["type"], item["content"], item.get("domain"),
                item.get("project"), item["status"], item["confidence"],
                item["created_at"], item["updated_at"], json.dumps(item, ensure_ascii=False)
            ),
        )
        con.execute(
            "INSERT INTO memory_fts VALUES (?, ?, ?, ?, ?)",
            (
                item["id"], item["content"], item.get("domain",""),
                item.get("project",""), " ".join(item.get("tags", [])),
            ),
        )
        count += 1

    con.commit()
    con.close()
    print(f"INDEX PASS: {count} records -> {db_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
