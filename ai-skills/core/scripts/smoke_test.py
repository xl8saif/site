#!/usr/bin/env python3
"""Fast integration smoke tests for the AI Skills framework."""

import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def run(*args):
    return subprocess.run([sys.executable, *map(str, args)], cwd=ROOT.parent, text=True,
                          capture_output=True)


def main():
    runner = ROOT / "run.py"
    registry = json.loads((ROOT / "registry.json").read_text(encoding="utf-8"))
    failures = []

    # Validate required production reference indexes and any optional indexes that exist.
    validator = ROOT / "core" / "scripts" / "validate_references.py"
    for skill in registry["skills"]:
        index = ROOT / skill["path"] / "references" / "index.json"
        if skill.get("status") != "production" and not index.is_file():
            continue
        result = run(validator, skill["id"])
        if result.returncode:
            failures.append(f"reference validation failed: {skill['id']}\n{result.stdout}{result.stderr}")

    # Verify the shared structural engine catches the critical invariants.
    checker = ROOT / "core" / "scripts" / "check_localization.py"
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        source = tmp / "source.txt"
        target = tmp / "target.txt"
        source.write_text("<b>{name}</b>\n", encoding="utf-8")
        target.write_text("<b>{name}</b>\n", encoding="utf-8")
        result = run(checker, "--source", source, "--target", target)
        if result.returncode:
            failures.append("shared structural checker rejected a valid fixture")

        target.write_text("<b>{name}</b>", encoding="utf-8")
        result = run(checker, "--source", source, "--target", target)
        if result.returncode == 0:
            failures.append("shared structural checker failed to detect line-break mismatch")

    # Exercise each production Skill's deterministic tool with a valid fixture.
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        source = tmp / "source.txt"
        target = tmp / "target.txt"
        source.write_text("<p>{name}</p>\\nDate: 2026-01-01", encoding="utf-8")
        target.write_text("<p>{name}</p>\\nDate: 2026-01-01", encoding="utf-8")
        production_tools = {
            "multilingual-translation-mtpe": ROOT / "multilingual-translation-mtpe" / "scripts" / "check_mtpe.py",
            "legal-translation-qa": ROOT / "legal-translation-qa" / "scripts" / "check_legal.py",
        }
        for sid, tool in production_tools.items():
            result = run(tool, "--source", source, "--target", target)
            if result.returncode:
                failures.append(f"production deterministic tool failed: {sid}\\n{result.stdout}{result.stderr}")
        research_tool = ROOT / "indus-kohistani-research" / "scripts" / "check_research_data.py"
        result = run(research_tool)
        if result.returncode:
            failures.append(f"production deterministic tool failed: indus-kohistani-research\\n{result.stdout}{result.stderr}")

    # Verify the Reference Retrieval Layer on a production Skill.
    retriever = ROOT / "core" / "scripts" / "retrieve_references.py"
    result = run(retriever, "pubg-urdu-lqa", "Official", "--limit", "5")
    if result.returncode:
        failures.append(f"reference retrieval failed\n{result.stdout}{result.stderr}")
    else:
        try:
            payload = json.loads(result.stdout)
            if not payload.get("results"):
                failures.append("reference retrieval returned no result for a verified PUBG term")
        except json.JSONDecodeError:
            failures.append("reference retrieval returned invalid JSON")

    # Exercise the unified validation/evaluation path.
    result = run(runner, "all")
    if result.returncode:
        failures.append(f"unified runner failed\n{result.stdout}{result.stderr}")

    if failures:
        print("SMOKE FAIL")
        for failure in failures:
            print(f"\n- {failure}")
        return 1

    print("SMOKE PASS")
    print(f"Checked {len(registry['skills'])} registered Skills, reference indexes, structural QA, retrieval, and unified evaluation.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
