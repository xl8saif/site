#!/usr/bin/env python3
import argparse,json,subprocess,sys,tempfile
from collections import Counter
from pathlib import Path

def load_manifest(path):
    for n,raw in enumerate(path.read_text(encoding="utf-8").splitlines(),1):
        if not raw.strip(): continue
        item=json.loads(raw)
        if not isinstance(item,dict) or "source" not in item or "target" not in item:
            raise ValueError("manifest line {}: source and target are required".format(n))
        yield n,item

def value(v,base):
    return (base/v[6:]).read_text(encoding="utf-8") if isinstance(v,str) and v.startswith("@file:") else str(v)

def check(checker,source,target):
    with tempfile.TemporaryDirectory() as tmp:
        root=Path(tmp); sp=root/"source.txt"; tp=root/"target.txt"
        sp.write_text(source,encoding="utf-8"); tp.write_text(target,encoding="utf-8")
        p=subprocess.run([sys.executable,str(checker),"--source",str(sp),"--target",str(tp),"--json"],
                         capture_output=True,text=True,encoding="utf-8")
        if p.returncode not in (0,1): raise RuntimeError(p.stderr or p.stdout)
        return json.loads(p.stdout)

def report(results,path):
    status=Counter(r["status"] for r in results)
    lines=["# PUBG Urdu Batch LQA Report","","- Items: {}".format(len(results)),
           "- PASS: {}".format(status.get("PASS",0)),"- FAIL: {}".format(status.get("FAIL",0)),
           "- Findings: {}".format(sum(len(r.get("findings",[])) for r in results)),"","## Findings",""]
    for r in results:
        if r["status"]=="PASS": continue
        lines.append("### {}".format(r["id"]))
        lines.append("- Manifest line: {}".format(r["manifest_line"]))
        for f in r["findings"]:
            c=" → "+f["suggested_correction"] if "suggested_correction" in f else ""
            lines.append("- {} {}: {}{}".format(f["severity"],f["code"],f["issue"],c))
        lines.append("")
    path.parent.mkdir(parents=True,exist_ok=True); path.write_text("\n".join(lines)+"\n",encoding="utf-8")

def main():
    p=argparse.ArgumentParser(); p.add_argument("--manifest",required=True)
    p.add_argument("--checker",default=str(Path(__file__).with_name("check_lqa.py")))
    p.add_argument("--jsonl"); p.add_argument("--report"); a=p.parse_args()
    manifest=Path(a.manifest).resolve(); checker=Path(a.checker).resolve(); results=[]
    for n,item in load_manifest(manifest):
        r=check(checker,value(item["source"],manifest.parent),value(item["target"],manifest.parent))
        r["id"]=str(item.get("id","item-{}".format(n))); r["manifest_line"]=n
        if "metadata" in item: r["metadata"]=item["metadata"]
        results.append(r)
    if a.jsonl:
        out=Path(a.jsonl); out.parent.mkdir(parents=True,exist_ok=True)
        out.write_text("\n".join(json.dumps(r,ensure_ascii=False) for r in results)+"\n",encoding="utf-8")
    if a.report: report(results,Path(a.report))
    failed=sum(r["status"]=="FAIL" for r in results); findings=sum(len(r.get("findings",[])) for r in results)
    print("BATCH {}: {} items, {} pass, {} fail, {} findings".format("FAIL" if failed else "PASS",len(results),len(results)-failed,failed,findings))
    return 1 if failed else 0
if __name__=="__main__": raise SystemExit(main())
