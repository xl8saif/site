#!/usr/bin/env python3
"""Resolve a routed task into an executable Skill/QA plan.

This layer remains deterministic and side-effect free. It selects the primary
Skill and any compatible deterministic validator, but does not execute work.
"""

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROFILES = ROOT / "paperclip-agent-profiles.json"
REGISTRY = ROOT / "registry.json"


def load_json(path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise SystemExit(f"invalid JSON {path}: {exc}") from exc


from route_task import load_profiles, route as route_task

def build_plan(task):
    profiles = load_json(PROFILES)
    registry = load_json(REGISTRY)
    routed = route_task(task, profiles)
    agent_id = routed["agent_id"]
    agent = next(a for a in profiles["agents"] if a["id"] == agent_id)
    confidence = routed["confidence"]
    rule_id = (routed.get("matched_rules") or [None])[0]
    matches = routed.get("matched_keywords", [])
    score = routed.get("score", 0)
    by_id = {item["id"]: item for item in registry["skills"]}

    skills = []
    for skill_id in agent["skills"]:
        item = by_id.get(skill_id)
        if item is None:
            raise SystemExit(f"agent {agent_id} references unregistered Skill: {skill_id}")
        tools = item.get("deterministic_tools", [])
        skills.append({
            "id": skill_id,
            "status": item.get("status"),
            "entrypoint": item.get("entrypoint"),
            "domain": item.get("domain", []),
            "deterministic_tools": tools,
            "primary_tool": tools[0] if tools else None,
            "execution": item.get("execution"),
        })

    if agent.get("mode") == "validation-only":
        selected = skills
    else:
        selected = skills[:1]

    return {
        "task": task,
        "agent_id": agent_id,
        "confidence": confidence,
        "matched_rule": rule_id,
        "matched_keywords": matches,
        "routing_score": score,
        "mode": agent.get("mode", "execution"),
        "selected_skills": selected,
        "available_skills": skills,
        "side_effects": "none",
        "next_action": (
            "Execute the selected Skill workflow, then run its deterministic validator."
            if selected and selected[0].get("primary_tool")
            else "Execute the selected Skill workflow; no deterministic validator is registered."
        ),
    }


def main():
    parser = argparse.ArgumentParser(description="Build an executable plan from a routed task.")
    parser.add_argument("--task", required=True)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    plan = build_plan(args.task)
    if args.json:
        print(json.dumps(plan, ensure_ascii=False, indent=2))
    else:
        print(f"Agent: {plan['agent_id']}")
        print(f"Skill: {plan['selected_skills'][0]['id'] if plan['selected_skills'] else 'none'}")
        print(f"Confidence: {plan['confidence']}")
        print(f"Validator: {plan['selected_skills'][0]['primary_tool'] if plan['selected_skills'] else 'none'}")
        print(f"Mode: {plan['mode']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
