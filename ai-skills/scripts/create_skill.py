#!/usr/bin/env python3
"""Create a new Skill from the repository template.

Usage:
  python ai-skills/scripts/create_skill.py my-skill "Short description"
"""

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = ROOT / "templates" / "skill"
SKILLS = ROOT / "skills"


def slug(value):
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    if not value:
        raise ValueError("skill id must contain at least one alphanumeric character")
    return value


def render(text, skill_id, description):
    title = skill_id.replace("-", " ").title()
    purpose = description.rstrip(".") + "."
    return (text
            .replace("{{SKILL_ID}}", skill_id)
            .replace("{{DESCRIPTION}}", description)
            .replace("{{TITLE}}", title)
            .replace("{{PURPOSE}}", purpose))


def main():
    parser = argparse.ArgumentParser(description="Create a reusable AI Skill.")
    parser.add_argument("skill_id")
    parser.add_argument("description")
    args = parser.parse_args()

    skill_id = slug(args.skill_id)
    destination = SKILLS / skill_id
    if destination.exists():
        raise SystemExit(f"Skill already exists: {skill_id}")

    for source in TEMPLATE.rglob("*"):
        relative = source.relative_to(TEMPLATE)
        target = destination / relative
        if source.is_dir():
            target.mkdir(parents=True, exist_ok=True)
        else:
            target.parent.mkdir(parents=True, exist_ok=True)
            content = source.read_text(encoding="utf-8")
            target.write_text(render(content, skill_id, args.description),
                              encoding="utf-8")

    registry = ROOT / "registry.json"
    registry_data = json.loads(registry.read_text(encoding="utf-8"))
    if any(item.get("id") == skill_id for item in registry_data.get("skills", [])):\n        raise SystemExit(f"Skill already registered: {skill_id}")\n\n    registry_data.setdefault("skills", []).append({
        "id": skill_id,
        "status": "draft",
        "domain": [],
        "path": skill_id,
        "entrypoint": f"{skill_id}/SKILL.md",
        "deterministic_tools": [],
        "protected_work": []
    })
    registry_data["version"] = registry_data.get("version", "1.0.0")
    registry.write_text(
        json.dumps(registry_data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8"
    )

    print(destination)
    print("Registered in ai-skills/registry.json with status=draft.")


if __name__ == "__main__":
    main()
