#!/usr/bin/env python3
"""Local integration smoke test for the Skills Console API."""

import json
import subprocess
import sys
import time
from pathlib import Path
from urllib import request

ROOT = Path(__file__).resolve().parents[2]
API = ROOT / "api" / "skills" / "run.py"
URL = "http://127.0.0.1:8787/api/skills/run"


def multipart(fields, files):
    boundary = "----SaifSkillsSmokeBoundary"
    chunks = []
    for name, value in fields.items():
        chunks += [
            f"--{boundary}\r\n".encode(),
            f'Content-Disposition: form-data; name="{name}"\r\n\r\n'.encode(),
            value.encode("utf-8"),
            b"\r\n",
        ]
    for name, (filename, data) in files.items():
        chunks += [
            f"--{boundary}\r\n".encode(),
            f'Content-Disposition: form-data; name="{name}"; filename="{filename}"\r\n'.encode(),
            b"Content-Type: text/plain\r\n\r\n",
            data,
            b"\r\n",
        ]
    chunks.append(f"--{boundary}--\r\n".encode())
    return f"multipart/form-data; boundary={boundary}", b"".join(chunks)


def post(task, files):
    content_type, body = multipart({"task": task}, files)
    req = request.Request(URL, data=body, method="POST", headers={"Content-Type": content_type})
    with request.urlopen(req, timeout=15) as response:
        return response.status, json.loads(response.read().decode("utf-8"))


def main():
    proc = subprocess.Popen(
        [sys.executable, str(API)],
        cwd=ROOT,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
        text=True,
    )
    try:
        for _ in range(30):
            try:
                request.urlopen("http://127.0.0.1:8787/", timeout=0.5).close()
                break
            except Exception:
                time.sleep(0.2)
        else:
            raise RuntimeError("Skills Console API did not start")

        valid = b"<b>{name}</b>\n"
        status, payload = post(
            "PUBG MOBILE Urdu LQA for a WOW event",
            {
                "source": ("source.txt", valid),
                "target": ("target.txt", valid),
            },
        )
        if status != 200 or payload.get("status") != "PASS":
            raise RuntimeError(f"valid API request failed: HTTP {status}, {payload}")

        invalid = b"<b>{name}</b>"
        status, payload = post(
            "PUBG MOBILE Urdu LQA for a WOW event",
            {
                "source": ("source.txt", valid),
                "target": ("target.txt", invalid),
            },
        )
        if status != 200 or payload.get("status") != "FAIL":
            raise RuntimeError(f"invalid API request failed: HTTP {status}, {payload}")

        knowledge = json.dumps({
            "identity": {"name": "Indus-Kohistani", "iso_639_3": "mvy", "family": "Dardic"},
            "orthography": {"letters": ["چھ", "څ", "ݜ", "ڙ", "ݨ"]},
            "research_principles": ["preserve provenance"],
            "common_voice_27": {
                "clips": 1, "duration_hours": 1, "speakers": 1,
                "validated_clips": 1, "dataset_id": "test", "license": "CC0"
            },
        }, ensure_ascii=False).encode("utf-8")
        status, payload = post(
            "Indus-Kohistani research corpus integrity",
            {"knowledge": ("knowledge.json", knowledge)},
        )
        if status != 200 or payload.get("status") != "PASS":
            raise RuntimeError(f"research API request failed: HTTP {status}, {payload}")

        print("SKILLS CONSOLE API SMOKE PASS")
        return 0
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            proc.kill()


if __name__ == "__main__":
    raise SystemExit(main())
