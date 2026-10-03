#!/usr/bin/env python3
"""Deterministic lexical deduplication for private candidate JSONL."""
from __future__ import annotations
import argparse,json,re
from pathlib import Path
def tokens(s): return set(re.findall(r"\b[\w\u0600-\u06ff]{3,}\b",s.lower()))
def sim(a,b):
    x,y=tokens(a),tokens(b); return len(x&y)/max(1,len(x|y))
def main():
    ap=argparse.ArgumentParser(); ap.add_argument("input"); ap.add_argument("-o","--output",default="brain-candidates-deduped.jsonl"); ap.add_argument("--threshold",type=float,default=.82); args=ap.parse_args()
    rows=[json.loads(x) for x in Path(args.input).read_text(encoding="utf-8").splitlines() if x.strip()]
    kept=[]
    for row in rows:
        for old in kept:
            if row.get("kind")==old.get("kind") and sim(row["content"],old["content"])>=args.threshold:
                row["state"]="merged"; row["duplicate_of"]=old["id"]; break
        kept.append(row)
    Path(args.output).write_text("\n".join(json.dumps(x,ensure_ascii=False) for x in kept)+"\n",encoding="utf-8")
    print(f"PASS: processed {len(rows)} candidates")
if __name__=="__main__": main()
