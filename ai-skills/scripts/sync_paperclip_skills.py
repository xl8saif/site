#!/usr/bin/env python3
"""Synchronize production AI Skills into Paperclip's project-discovery layout.

Canonical source: ai-skills/<skill>/
Paperclip discovery mirror: .agents/skills/<skill>/
Only SKILL.md, references/, and scripts/ are mirrored; eval suites stay canonical.
"""

from __future__ import annotations

import argparse
import filecmp
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REGISTRY = ROOT / "registry.json"
SOURCE_ROOT = ROOT
REPO_ROOT = ROOT.parent
PAPERCLIP_ROOT = REPO_ROOT / ".agents" / "skills"


def production_skills() -> list[str]:
    import json
    data = json.loads(REGISTRY.read_text(encoding="utf-8"))
    return [item["id"] for item in data["skills"] if item.get("status") == "production"]


def mirrored_files(skill: str) -> list[Path]:
    src = SOURCE_ROOT / skill
    files = [src / "SKILL.md"]
    for folder in ("references", "scripts"):
        base = src / folder
        if base.exists():
            files.extend(p for p in base.rglob("*") if p.is_file())
    return sorted(files)


def compare_skill(skill: str) -> list[str]:
    problems = []
    src_skill = SOURCE_ROOT / skill
    dst_skill = PAPERCLIP_ROOT / skill
    expected = mirrored_files(skill)
    expected_rel = {p.relative_to(src_skill).as_posix() for p in expected}

    for src in expected:
        rel = src.relative_to(src_skill)
        dst = dst_skill / rel
        if not dst.exists():
            problems.append(f"missing: {dst.relative_to(REPO_ROOT)}")
        elif not filecmp.cmp(src, dst, shallow=False):
            problems.append(f"drift: {dst.relative_to(REPO_ROOT)}")

    if dst_skill.exists():
        for dst in dst_skill.rglob("*"):
            if dst.is_file() and dst.relative_to(dst_skill).as_posix() not in expected_rel:
                problems.append(f"extra: {dst.relative_to(REPO_ROOT)}")
    return problems


def sync_skill(skill: str) -> None:
    src_skill = SOURCE_ROOT / skill
    dst_skill = PAPERCLIP_ROOT / skill
    dst_skill.mkdir(parents=True, exist_ok=True)

    for src in mirrored_files(skill):
        rel = src.relative_to(src_skill)
        dst = dst_skill / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)

    expected_rel = {p.relative_to(src_skill) for p in mirrored_files(skill)}
    if dst_skill.exists():
        for dst in sorted(dst_skill.rglob("*"), reverse=True):
            if dst.is_file() and dst.relative_to(dst_skill) not in expected_rel:
                dst.unlink()
        for d in sorted((p for p in dst_skill.rglob("*") if p.is_dir()), reverse=True):
            if not any(d.iterdir()):
                d.rmdir()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="fail if the Paperclip mirror differs")
    args = parser.parse_args()

    skills = production_skills()
    if args.check:
        problems = [problem for skill in skills for problem in compare_skill(skill)]
        if problems:
            print("FAIL: Paperclip mirror drift detected")
            print("\n".join(problems))
            return 1
        print(f"PASS: Paperclip mirror matches {len(skills)} production Skills")
        return 0

    for skill in skills:
        sync_skill(skill)
    print(f"SYNC PASS: mirrored {len(skills)} production Skills to .agents/skills/")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
