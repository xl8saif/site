#!/usr/bin/env python3
"""Run NVIDIA SkillSpector as a fail-closed security gate for local Agent Skills."""

from __future__ import annotations
import argparse, json, subprocess, sys
from pathlib import Path

DEFAULT_SKILLS = [
    "ai-skills/pubg-urdu-lqa",
    "ai-skills/arabic-urdu-localization",
    "ai-skills/multilingual-translation-mtpe",
    "ai-skills/legal-translation-qa",
    "ai-skills/indus-kohistani-research",
    "ai-skills/second-brain",
]

def run_scan(skill: Path, out_dir: Path, version: str) -> tuple[int, dict]:
    report_path = out_dir / f"{skill.name}.json"
    cmd = [
        "skillspector", "scan", str(skill), "--no-llm", "--format", "json",
        "--output", str(report_path), "--fail-on-incomplete",
    ]
    proc = subprocess.run(cmd, text=True, capture_output=True)
    report = {}
    if report_path.exists():
        try:
            report = json.loads(report_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            raise RuntimeError(f"Invalid SkillSpector JSON for {skill}: {exc}") from exc
    summary = {
        "skill": str(skill), "scanner": "NVIDIA SkillSpector",
        "scanner_version": version, "exit_code": proc.returncode,
        "risk_score": report.get("risk_score"),
        "risk_severity": report.get("risk_severity"),
        "risk_recommendation": report.get("risk_recommendation"),
        "analysis_completeness": report.get("analysis_completeness"),
        "finding_count": len(report.get("findings", [])), "report": str(report_path),
    }
    (out_dir / f"{skill.name}.summary.json").write_text(
        json.dumps(summary, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    if proc.returncode == 2:
        raise RuntimeError(f"SkillSpector failed for {skill}:\n{proc.stderr[-4000:]}")
    return proc.returncode, report

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--skills", nargs="*", default=DEFAULT_SKILLS)
    parser.add_argument("--output-dir", default="skill-security-reports")
    parser.add_argument("--version", default="2.11.2")
    args = parser.parse_args()
    out_dir = Path(args.output_dir); out_dir.mkdir(parents=True, exist_ok=True)
    results = []; failed = False
    for raw in args.skills:
        skill = Path(raw)
        if not (skill / 'SKILL.md').is_file():
            print(f"ERROR: missing SKILL.md: {skill}", file=sys.stderr); failed = True; continue
        try:
            exit_code, report = run_scan(skill, out_dir, args.version)
        except Exception as exc:
            print(f"ERROR: {exc}", file=sys.stderr); failed = True; continue
        risk = report.get('risk_score'); completeness = report.get('analysis_completeness')
        incomplete = isinstance(completeness, dict) and (
            completeness.get('complete') is False or
            completeness.get('status') in {'partial', 'incomplete', 'failed'}
        )
        blocking = exit_code == 1 or (isinstance(risk, (int, float)) and risk > 50) or incomplete
        failed = failed or blocking
        results.append({
            'skill': str(skill), 'risk_score': risk,
            'risk_severity': report.get('risk_severity'),
            'risk_recommendation': report.get('risk_recommendation'),
            'analysis_completeness': completeness,
            'finding_count': len(report.get('findings', [])), 'blocking': blocking
        })
        status = "BLOCK" if blocking else "PASS"
        print(f"[{status}] {skill} | risk={risk} | severity={report.get("risk_severity")} | findings={len(report.get("findings", []))}")
    aggregate = {'scanner':'NVIDIA SkillSpector','scanner_version':args.version,'mode':'static-only','skills':results,'blocking':failed}
    (out_dir / "summary.json").write_text(json.dumps(aggregate, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    if failed:
        print("\nSkill security gate: BLOCKED", file=sys.stderr); return 1
    print("\nSkill security gate: PASS"); return 0

if __name__ == '__main__':
    raise SystemExit(main())