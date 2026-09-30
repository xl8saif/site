#!/usr/bin/env python3
"""Human Review Gate: aggregate deterministic validator findings into one report."""

import argparse, json, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXECUTOR = ROOT / "scripts" / "execute_task.py"

SEVERITIES = ("critical", "major", "minor", "query")

def extract_findings(reports):
    findings = []
    for report in reports:
        result = report.get("result")
        if not isinstance(result, dict):
            continue
        raw = result.get("findings", [])
        if isinstance(raw, list):
            for item in raw:
                if isinstance(item, dict):
                    f = dict(item)
                    f["skill_id"] = report.get("skill_id")
                    f["validator"] = report.get("validator")
                    findings.append(f)
    return findings

def main():
    p=argparse.ArgumentParser(description="Aggregate deterministic QA findings for human review.")
    p.add_argument("--task", required=True)
    p.add_argument("--source")
    p.add_argument("--target")
    p.add_argument("--knowledge")
    p.add_argument("--json", action="store_true")
    a=p.parse_args()

    cmd=[sys.executable,str(EXECUTOR),"--task",a.task,"--json"]
    if a.source: cmd += ["--source",a.source]
    if a.target: cmd += ["--target",a.target]
    if a.knowledge: cmd += ["--knowledge",a.knowledge]
    proc=subprocess.run(cmd,cwd=ROOT.parent,capture_output=True,text=True)
    try:
        execution=json.loads(proc.stdout)
    except json.JSONDecodeError:
        print(json.dumps({"status":"REVIEW","stage":"execution","error":proc.stderr.strip() or proc.stdout},ensure_ascii=False,indent=2))
        return 2

    findings=extract_findings(execution.get("reports",[]))
    counts={s:sum(1 for f in findings if f.get("severity")==s) for s in SEVERITIES}
    unknown=[f for f in findings if f.get("severity") not in SEVERITIES]
    if unknown:
        counts["unknown"]=len(unknown)

    if counts["critical"] or counts["major"]:
        status="FAIL"
        decision="BLOCK_DELIVERY"
    elif execution.get("status")=="REVIEW" or unknown:
        status="REVIEW"
        decision="HUMAN_REVIEW_REQUIRED"
    elif counts["minor"] or counts["query"]:
        status="REVIEW"
        decision="HUMAN_REVIEW_REQUIRED"
    else:
        status="PASS"
        decision="READY_FOR_HUMAN_SIGNOFF"

    payload={
        "status":status,
        "decision":decision,
        "task":a.task,
        "agent_id":execution.get("agent_id"),
        "confidence":execution.get("confidence"),
        "summary":{"total_findings":len(findings),**counts},
        "findings":findings,
        "execution":execution,
        "human_signoff": status in ("PASS","REVIEW"),
        "side_effects":"none",
    }
    print(json.dumps(payload,ensure_ascii=False,indent=2))
    return 1 if status=="FAIL" else 2 if status=="REVIEW" else 0

if __name__=="__main__":
    raise SystemExit(main())
