#!/usr/bin/env python3
"""Deterministic integrity checks for Indus-Kohistani research metadata."""
import argparse,json
from pathlib import Path
EXPECTED={"name":"Indus-Kohistani","iso_639_3":"mvy","family":"Dardic"}
LETTERS={"چھ","څ","ݜ","ڙ","ݨ"}
def main():
    p=argparse.ArgumentParser(); p.add_argument("--knowledge",default=str(Path(__file__).resolve().parents[1]/"references/research-knowledge.json")); a=p.parse_args()
    d=json.loads(Path(a.knowledge).read_text(encoding="utf-8")); failures=[]
    for k,v in EXPECTED.items():
        if d.get("identity",{}).get(k)!=v: failures.append(f"identity.{k} mismatch")
    if not LETTERS.issubset(set(d.get("orthography",{}).get("letters",[]))): failures.append("orthography inventory mismatch")
    if not d.get("research_principles"): failures.append("research_principles missing")
    cv=d.get("common_voice_27",{})
    for k in ("clips","duration_hours","speakers","validated_clips","dataset_id","license"):
        if k not in cv: failures.append(f"common_voice_27.{k} missing")
    print("PASS" if not failures else "FAIL")
    for f in failures: print("- "+f)
    return 1 if failures else 0
if __name__=="__main__": raise SystemExit(main())
