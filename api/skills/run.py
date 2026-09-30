import json
import subprocess
import sys
import tempfile
from email import policy
from email.parser import BytesParser
from http.server import BaseHTTPRequestHandler
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / "ai-skills" / "scripts" / "review_gate.py"
MAX_FILE = 1536 * 1024
MAX_BODY = 4 * 1024 * 1024


def send_json(handler, payload, status=200):
    data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    handler.send_header("Access-Control-Allow-Headers", "Content-Type")
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(data)))
    handler.end_headers()
    handler.wfile.write(data)


def parse_multipart(content_type, body):
    headers = (
        f"Content-Type: {content_type}\r\n"
        f"MIME-Version: 1.0\r\n\r\n"
    ).encode("utf-8")
    message = BytesParser(policy=policy.default).parsebytes(headers + body)
    fields = {}
    files = {}
    for part in message.iter_parts():
        name = part.get_param("name", header="content-disposition")
        if not name:
            continue
        filename = part.get_filename()
        data = part.get_payload(decode=True) or b""
        if filename:
            files[name] = {"filename": filename, "data": data}
        else:
            fields[name] = data.decode("utf-8", errors="replace")
    return fields, files


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        send_json(self, {"ok": True})

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length <= 0 or length > MAX_BODY:
                send_json(self, {"error": "Request too large or empty."}, 413)
                return

            content_type = self.headers.get("Content-Type", "")
            if "multipart/form-data" not in content_type:
                send_json(self, {"error": "multipart/form-data is required."}, 415)
                return

            body = self.rfile.read(length)
            fields, files = parse_multipart(content_type, body)
            task = str(fields.get("task", "")).strip()
            source = files.get("source")
            target = files.get("target")
            knowledge = files.get("knowledge")

            if not task or (not source and not knowledge):
                send_json(self, {"error": "task and at least one input file are required."}, 400)
                return

            source_bytes = source["data"] if source else None
            target_bytes = target["data"] if target else None
            knowledge_bytes = knowledge["data"] if knowledge else None
            if any(data is not None and len(data) > MAX_FILE for data in (source_bytes, target_bytes, knowledge_bytes)):
                send_json(self, {"error": "Each file must be 1.5 MB or smaller."}, 413)
                return

            with tempfile.TemporaryDirectory() as td:
                source_path = Path(td) / "source.txt"
                target_path = Path(td) / "target.txt"
                knowledge_path = Path(td) / "knowledge.json"
                if source_bytes is not None: source_path.write_bytes(source_bytes)
                if target_bytes is not None: target_path.write_bytes(target_bytes)
                if knowledge_bytes is not None: knowledge_path.write_bytes(knowledge_bytes)

                process = subprocess.run(
                    [
                        sys.executable, str(SCRIPT),
                        "--task", task,
                        *(["--source", str(source_path)] if source_bytes is not None else []),
                        *(["--target", str(target_path)] if target_bytes is not None else []),
                        *(["--knowledge", str(knowledge_path)] if knowledge_bytes is not None else []),
                        "--json",
                    ],
                    cwd=str(ROOT),
                    capture_output=True,
                    text=True,
                    timeout=45,
                )

                try:
                    payload = json.loads(process.stdout)
                except json.JSONDecodeError:
                    payload = {}

                if not payload:
                    payload = {
                        "status": "REVIEW",
                        "decision": "HUMAN_REVIEW_REQUIRED",
                        "summary": {"critical": 0, "major": 0, "minor": 0, "query": 1},
                        "findings": [{
                            "severity": "query",
                            "issue": process.stderr[-2000:] or "The review engine returned no JSON result.",
                        }],
                    }

                send_json(self, payload, 200 if process.returncode in (0, 1) else 500)
        except Exception as exc:
            send_json(
                self,
                {
                    "status": "REVIEW",
                    "decision": "HUMAN_REVIEW_REQUIRED",
                    "summary": {"critical": 0, "major": 0, "minor": 0, "query": 1},
                    "findings": [{"severity": "query", "issue": str(exc)}],
                },
                500,
            )

    def do_GET(self):
        send_json(self, {"ok": True, "service": "saif-ai-skills-review-gate"})


if __name__ == "__main__":
    from http.server import HTTPServer
    HTTPServer(("127.0.0.1", 8787), handler).serve_forever()
