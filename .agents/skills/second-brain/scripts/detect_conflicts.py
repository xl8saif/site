#!/usr/bin/env python3
"""Flag possible conflicts; never overwrite either record."""
from __future__ import annotations
import argparse,json,re
from pathlib import Path
NEG=re.compile(r"\b(?:not|never|avoid|instead|don't|do not|no longer)\b|(?:نہیں|مت|بجائے)",re.I)
def terms(s): return set(re.findall(r"\b[\w\u0600-\u06ff]{3,}\b",s.lower()))
def main():
    ap=argparse.ArgumentParser(); ap.add_argument("input"); ap.add_argument("-o","--output",default="brain-conflicts.jsonl"); args=ap.parse_args()
    rows=[json.loads(x) for x in Path(args.input).read_text(encoding="utf-8").splitlines() if x.strip()]
    for i,a in enumerate(rows):
        if a.get("kind") not in {"decision","preference","terminology","correction"}: continue
        for b in rows[i+1:]:
            if b.get("kind")!=a.get("kind"): continue
            overlap=len(terms(a["content"])&terms(b["content"]))/max(1,len(terms(a["content"])|terms(b["content"])))
            if overlap>=.45 and bool(NEG.search(a["content"])) != bool(NEG.search(b["content"])):
                a.setdefault("conflicts_with",[]).append(b["id"]); b.setdefault("conflicts_with",[]).append(a["id"])
    out=[x for x in rows if x.get("conflicts_with")]
    Path(args.output).write_text("\n".join(json.dumps(x,ensure_ascii=False) for x in out)+"\n",encoding="utf-8")
    print(f"PASS: flagged {len(out)} candidate records with possible conflicts")
if __name__=="__main__": main()
