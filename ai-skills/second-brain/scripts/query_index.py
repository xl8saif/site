#!/usr/bin/env python3
"""Query the disposable Second Brain SQLite FTS5 index."""

from __future__ import annotations

import argparse
import json
import sqlite3


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("db")
    parser.add_argument("query", nargs="+")
    parser.add_argument("--limit", type=int, default=8)
    parser.add_argument("--status", choices=["verified","established","tentative","superseded"])
    parser.add_argument("--project")
    args = parser.parse_args()

    q = " ".join(args.query).strip()
    con = sqlite3.connect(args.db)
    where = []
    params = [q]
    if args.status:
        where.append("m.status = ?")
        params.append(args.status)
    if args.project:
        where.append("m.project = ?")
        params.append(args.project)
    sql = """
      SELECT m.id, m.type, m.content, m.domain, m.project, m.status,
             m.confidence, m.created_at, m.updated_at, m.payload,
             bm25(memory_fts) AS rank
      FROM memory_fts
      JOIN memory m ON m.id = memory_fts.id
      WHERE memory_fts MATCH ?
    """
    if where:
        sql += " AND " + " AND ".join(where)
    sql += " ORDER BY rank LIMIT ?"
    params.append(args.limit)
    rows = con.execute(sql, params).fetchall()
    con.close()

    for row in rows:
        print(json.dumps({
            "id": row[0], "type": row[1], "content": row[2],
            "domain": row[3], "project": row[4], "status": row[5],
            "confidence": row[6], "created_at": row[7], "updated_at": row[8],
            "rank": row[10],
            "record": json.loads(row[9]),
        }, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
