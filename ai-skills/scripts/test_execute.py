#!/usr/bin/env python3
"""Smoke tests for the deterministic execution engine."""

import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXECUTOR = ROOT / "scripts" / "execute_task.py"

def call(task, source=None, target=None, knowledge=None):
    command=[sys.executable,str(EXECUTOR),"--task",task,"--json"]
    if source: command += ["--source",str(source)]
    if target: command += ["--target",str(target)]
    if knowledge: command += ["--knowledge",str(knowledge)]
    return subprocess.run(command,cwd=ROOT.parent,capture_output=True,text=True)

def main():
    failures=[]
    with tempfile.TemporaryDirectory() as tmp:
        tmp=Path(tmp)
        source=tmp/"source.txt"; target=tmp/"target.txt"
        source.write_text("<b>{name}</b>\n",encoding="utf-8")
        target.write_text("<b>{name}</b>\n",encoding="utf-8")

        r=call("PUBG MOBILE Urdu LQA for a WOW event",source,target)
        if r.returncode != 0:
            failures.append("valid PUBG execution did not PASS")
        else:
            payload=json.loads(r.stdout)
            if payload.get("status")!="PASS" or payload.get("reports",[{}])[0].get("status")!="PASS":
                failures.append("valid PUBG execution returned an unexpected report")

        target.write_text("<b>{name}</b>",encoding="utf-8")
        r=call("PUBG MOBILE Urdu LQA for a WOW event",source,target)
        if r.returncode != 1:
            failures.append("invalid PUBG execution did not FAIL")

        r=call("PUBG MOBILE Urdu LQA for a WOW event")
        if r.returncode != 2:
            failures.append("missing source/target did not return REVIEW")

        cases = [
            ("Arabic to Urdu localization", source, target),
            ("Multilingual translation MTPE", source, target),
            ("Legal translation QA for a contract", source, target),
        ]
        for task, src, tgt in cases:
            r=call(task,src,tgt)
            if r.returncode != 0 or json.loads(r.stdout).get("status") != "PASS":
                failures.append(f"registry-driven execution failed for: {task}")

        knowledge=tmp/"knowledge.json"
        knowledge.write_text(json.dumps({
            "identity":{"name":"Indus-Kohistani","iso_639_3":"mvy","family":"Dardic"},
            "orthography":{"letters":["چھ","څ","ݜ","ڙ","ݨ"]},
            "research_principles":["preserve provenance"],
            "common_voice_27":{"clips":1,"duration_hours":1,"speakers":1,"validated_clips":1,"dataset_id":"test","license":"CC0"}
        },ensure_ascii=False),encoding="utf-8")
        r=call("Indus-Kohistani research corpus integrity",knowledge=knowledge)
        if r.returncode != 0 or json.loads(r.stdout).get("status") != "PASS":
            failures.append("registry-driven research execution did not PASS")

        r=call("Indus-Kohistani research corpus integrity")
        if r.returncode != 2:
            failures.append("missing research knowledge did not return REVIEW")

    if failures:
        print("EXECUTION SMOKE FAIL")
        print("\n".join(failures))
        return 1
    print("EXECUTION SMOKE PASS: PASS/FAIL/REVIEW behavior verified")
    return 0

if __name__=="__main__":
    raise SystemExit(main())
