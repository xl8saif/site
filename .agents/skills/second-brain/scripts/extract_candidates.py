#!/usr/bin/env python3
"""Deterministic high-signal candidate extractor for private normalized conversations."""
from __future__ import annotations
import argparse,json,re
from pathlib import Path
RULES=[("decision",r"\b(?:we|i)\s+(?:decided|will|choose|chose|prefer|agreed|settled)\b"),("correction",r"\b(?:correct|correction|instead of|use this|should be|must be)\b"),("terminology",r"\b(?:preferred term|terminology|translate|translation|locali[sz]e|glossary)\b"),("preference",r"\b(?:i|we)\s+(?:prefer|want|need|use|like|avoid|always|never)\b"),("research",r"\b(?:source|study|research|paper|documentation|reference|according to)\b")]
def classify(text):
    for kind,pat in RULES:
        if re.search(pat,text,re.I): return kind
    return None
def main():
    ap=argparse.ArgumentParser(); ap.add_argument("normalized_jsonl"); ap.add_argument("-o","--output",default="brain-candidates.jsonl"); args=ap.parse_args()
    count=0
    with Path(args.normalized_jsonl).open(encoding="utf-8") as src, Path(args.output).open("w",encoding="utf-8") as dst:
        for raw in src:
            if not raw.strip(): continue
            conv=json.loads(raw)
            for msg in conv.get("messages",[]):
                if msg.get("role")!="user": continue
                text=msg.get("text","").strip()
                if len(text)<20: continue
                kind=classify(text)
                if not kind: continue
                row={"id":f"cand-{conv.get('conversation_id','unknown')}-{msg.get('message_id','unknown')}","kind":kind,"content":text,"summary":text[:240],"source":{"kind":"conversation","locator":conv.get("conversation_id") or "unknown","title":conv.get("title","")},"confidence":0.65 if kind in {"decision","correction"} else 0.5,"state":"candidate","related_ids":[],"duplicate_of":None,"conflicts_with":[]}
                dst.write(json.dumps(row,ensure_ascii=False)+"\n"); count+=1
    print(f"PASS: extracted {count} candidate memories -> {args.output}")
if __name__=="__main__": main()
