#!/usr/bin/env python3
"""Validate the ecosystem-facing Agent Skills mirror and skills.sh grouping."""
from __future__ import annotations
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MIRROR = ROOT.parent / '.agents' / 'skills'
REGISTRY = ROOT / 'registry.json'
GROUPS = ROOT.parent / 'skills.sh.json'

def frontmatter(path: Path):
    text = path.read_text(encoding='utf-8')
    if not text.startswith('---\n'):
        raise ValueError(f'{path}: missing YAML frontmatter')
    end = text.find('\n---', 4)
    if end < 0:
        raise ValueError(f'{path}: unterminated YAML frontmatter')
    block = text[4:end]
    fields = {}
    for line in block.splitlines():
        if ':' in line and not line.startswith((' ', '\t')):
            key, value = line.split(':', 1)
            fields[key.strip()] = value.strip().strip('"\'')
    if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', fields.get('name', '')):
        raise ValueError(f'{path}: invalid or missing name')
    if not fields.get('description') or len(fields['description']) < 10:
        raise ValueError(f'{path}: invalid or missing description')
    return fields

def main():
    registry = json.loads(REGISTRY.read_text(encoding='utf-8'))
    expected = {s['id'] for s in registry['skills'] if s.get('status') == 'production' or s.get('ecosystem') is True}
    actual = {p.name for p in MIRROR.iterdir() if p.is_dir() and (p / 'SKILL.md').is_file()}
    if expected != actual:
        raise SystemExit(f'FAIL: mirror mismatch; expected={sorted(expected)} actual={sorted(actual)}')
    for sid in sorted(expected):
        frontmatter(MIRROR / sid / 'SKILL.md')
    groups = json.loads(GROUPS.read_text(encoding='utf-8'))
    listed = {sid for group in groups.get('groupings', []) for sid in group.get('skills', [])}
    if not listed.issubset(expected):
        raise SystemExit(f'FAIL: skills.sh.json contains unknown skills: {sorted(listed - expected)}')
    print(f'PASS: {len(expected)} Agent Skills are ecosystem-compatible and grouped for skills.sh')
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
