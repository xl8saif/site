#!/usr/bin/env python3
"""Deterministic structural QA entrypoint for multilingual MTPE."""
import argparse, json, sys
from pathlib import Path
CORE = Path(__file__).resolve().parents[2] / "core" / "scripts"
sys.path.insert(0, str(CORE))
from check_localization import load_reference_rules, run, result
def main():
    p=argparse.ArgumentParser(); p.add_argument("--source",required=True); p.add_argument("--target",required=True); p.add_argument("--reference-index",default=str(Path(__file__).resolve().parents[1]/"references/index.json")); a=p.parse_args()
    source=Path(a.source).read_text(encoding="utf-8"); target=Path(a.target).read_text(encoding="utf-8")
    terminology,protected=load_reference_rules(a.reference_index); findings=run(source,target,terminology,protected)
    print(json.dumps(result(a.source,a.target,findings),ensure_ascii=False,indent=2)); return 1 if findings else 0
if __name__=="__main__": raise SystemExit(main())
