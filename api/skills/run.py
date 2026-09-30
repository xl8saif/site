import json, os, subprocess, tempfile
from pathlib import Path
from http import HTTPStatus

ROOT=Path(__file__).resolve().parents[1]
SCRIPT=ROOT/"ai-skills"/"scripts"/"review_gate.py"
MAX=2*1024*1024

def handler(request):
    if request.method!="POST":
        return {"statusCode":405,"headers":{"Allow":"POST"},"body":json.dumps({"error":"POST required"})}
    try:
        form=request.form
        task=str(form.get("task","")).strip()
        source=form.get("source")
        target=form.get("target")
        if not task or not source or not target:
            return {"statusCode":400,"body":json.dumps({"error":"task, source and target are required"})}
        if source.content_length and source.content_length>MAX or target.content_length and target.content_length>MAX:
            return {"statusCode":413,"body":json.dumps({"error":"file too large"})}
        with tempfile.TemporaryDirectory() as td:
            s=Path(td)/"source.txt"; t=Path(td)/"target.txt"
            s.write_bytes(source.read(MAX+1)); t.write_bytes(target.read(MAX+1))
            if s.stat().st_size>MAX or t.stat().st_size>MAX:
                return {"statusCode":413,"body":json.dumps({"error":"file too large"})}
            p=subprocess.run(["python",str(SCRIPT),"--task",task,"--source",str(s),"--target",str(t),"--json"],cwd=str(ROOT),capture_output=True,text=True,timeout=45)
            out=p.stdout.strip().splitlines()
            payload=json.loads(out[-1]) if out else {"status":"REVIEW","decision":"HUMAN_REVIEW_REQUIRED","findings":[{"severity":"query","issue":p.stderr[-1000:]}]}
            return {"statusCode":200,"headers":{"Content-Type":"application/json"},"body":json.dumps(payload,ensure_ascii=False)}
    except Exception as e:
        return {"statusCode":500,"headers":{"Content-Type":"application/json"},"body":json.dumps({"status":"REVIEW","decision":"HUMAN_REVIEW_REQUIRED","findings":[{"severity":"query","issue":str(e)}]},ensure_ascii=False)}