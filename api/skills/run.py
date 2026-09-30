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
MAX_FILE = 2 * 1024 * 1024
MAX_BODY = 5 * 1024 * 1024


def send_json(handler, payload, status=200):
    data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
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

            if not task or not source or not target:
                send_json(self, {"error": "task, source and target are required."}, 400)
                return

            source_bytes = source["data"]
            target_bytes = target["data"]
            if len(source_bytes) > MAX_FILE or len(target_bytes) > MAX_FILE:
                send_json(self, {"error": "Each file must be 2 MB or smaller."}, 413)
                return

            with tempfile.TemporaryDirectory() as td:
                source_path = Path(td) / "source.txt"
                target_path = Path(td) / "target.txt"
                source_path.write_bytes(source_bytes)
                target_path.write_bytes(target_bytes)

                process = subprocess.run(
                    [
                        sys.executable, str(SCRIPT),
                        "--task", task,
                        "--source", str(source_path),
                        "--target", str(target_path),
                        "--json",
                    ],
                    cwd=str(ROOT),
                    capture_output=True,
                    text=True,
                    timeout=45,
                )

                lines = [line for line in process.stdout.splitlines() if line.strip()]
                try:
                    payload = json.loads(lines[-1]) if lines else {}
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
