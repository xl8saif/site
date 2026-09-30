#!/usr/bin/env python3
"""Smoke tests for the Human Review Gate."""

import subprocess, sys, tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
GATE=ROOT/"scripts"/"review_gate.py"

def call(task, source, target):
    return subprocess.run([sys.executable,str(GATE),"--task",task,"--source",str(source),"--target",str(target),"--json"],cwd=ROOT.parent,capture_output=True,text=True)

def main():
    with tempfile.TemporaryDirectory() as d:
        d=Path(d); s=d/"s.txt"; t=d/"t.txt"
        s.write_text("<b>{name}</b>\n",encoding="utf-8")
        t.write_text("<b>{name}</b>\n",encoding="utf-8")
        r=call("PUBG MOBILE Urdu LQA for a WOW event",s,t)
        if r.returncode!=0: raise SystemExit("REVIEW GATE SMOKE FAIL: valid case")
        t.write_text("<b>{name}</b>",encoding="utf-8")
        r=call("PUBG MOBILE Urdu LQA for a WOW event",s,t)
        if r.returncode!=1: raise SystemExit("REVIEW GATE SMOKE FAIL: invalid case")
        t.write_text("<b>{name}</b>\n",encoding="utf-8")
        r=call("Run final deterministic structural QA before delivery",s,t)
        if r.returncode!=0: raise SystemExit("REVIEW GATE SMOKE FAIL: validation-only gate")
    print("REVIEW GATE SMOKE PASS")
    return 0

if __name__=="__main__": raise SystemExit(main())
