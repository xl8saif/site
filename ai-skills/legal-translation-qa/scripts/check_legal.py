#!/usr/bin/env python3
"""Deterministic legal-document QA entrypoint."""
import argparse,json,re,sys
from pathlib import Path
CORE=Path(__file__).resolve().parents[2]/"core"/"scripts"
sys.path.insert(0,str(CORE))
from check_localization import load_reference_rules,run,result
CONTROLLED_RE=re.compile(r"\b(?:\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d+)\b")
def main():
    p=argparse.ArgumentParser(); p.add_argument("--source",required=True); p.add_argument("--target",required=True); p.add_argument("--reference-index",default=str(Path(__file__).resolve().parents[1]/"references/index.json")); a=p.parse_args()
    s=Path(a.source).read_text(encoding="utf-8"); t=Path(a.target).read_text(encoding="utf-8")
    term,prot=load_reference_rules(a.reference_index); findings=run(s,t,term,prot)
    if CONTROLLED_RE.findall(s)!=CONTROLLED_RE.findall(t): findings.append({"code":"CONTROLLED_IDENTIFIER_MISMATCH","severity":"critical","issue":"Controlled numeric/date identifiers differ between source and target."})
    out=result(a.source,a.target,findings); out["checks"]["controlled_identifiers"]="fail" if any(x["code"]=="CONTROLLED_IDENTIFIER_MISMATCH" for x in findings) else "pass"
    print(json.dumps(out,ensure_ascii=False,indent=2)); return 1 if findings else 0
if __name__=="__main__": raise SystemExit(main())
