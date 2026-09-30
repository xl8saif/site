#!/usr/bin/env python3
"""Deterministic task router for the Saif Language Skills agent system.

The router is deliberately rule-based: routing decisions are reproducible,
inspectable, and sourced from paperclip-agent-profiles.json.
"""

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROFILES = ROOT / "paperclip-agent-profiles.json"


def load_profiles():
    try:
        data = json.loads(PROFILES.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise SystemExit(f"invalid paperclip-agent-profiles.json: {exc}") from exc

    if not isinstance(data, dict):
        raise SystemExit("agent profiles must be a JSON object")
    routing = data.get("routing")
    if not isinstance(routing, list) or not routing:
        raise SystemExit("agent profiles require a non-empty routing array")
    for rule in routing:
        if not isinstance(rule, dict):
            raise SystemExit("routing entries must be objects")
        if not isinstance(rule.get("id"), str) or not rule["id"]:
            raise SystemExit("routing rule requires a non-empty id")
        if not isinstance(rule.get("agent"), str) or not rule["agent"]:
            raise SystemExit(f"{rule.get('id', '<unknown>')}: missing agent")
        if not isinstance(rule.get("priority"), int):
            raise SystemExit(f"{rule['id']}: priority must be an integer")
        if not isinstance(rule.get("keywords"), list) or not rule["keywords"]:
            raise SystemExit(f"{rule['id']}: keywords must be a non-empty array")
        if not all(isinstance(keyword, str) and keyword.strip() for keyword in rule["keywords"]):
            raise SystemExit(f"{rule['id']}: keywords must contain non-empty strings")

    agents = {agent.get("id") for agent in data.get("agents", []) if isinstance(agent, dict)}
    for rule in routing:
        if rule["agent"] not in agents:
            raise SystemExit(f"{rule['id']}: unknown agent {rule['agent']}")
    fallback = data.get("fallback")
    if not isinstance(fallback, dict) or not isinstance(fallback.get("agent"), str):
        raise SystemExit("agent profiles require a fallback agent")
    if fallback["agent"] not in agents:
        raise SystemExit(f"fallback references unknown agent {fallback['agent']}")
    return data


def normalize(text):
    return re.sub(r"\s+", " ", text.casefold()).strip()


def score_rule(task, rule):
    normalized = normalize(task)
    matches = []
    for keyword in rule["keywords"]:
        token = normalize(keyword)
        if not token:
            continue
        if re.search(r"(?<!\w)" + re.escape(token) + r"(?!\w)", normalized, flags=re.UNICODE):
            matches.append(keyword)

    # More matched signals and longer phrases both increase confidence.
    score = sum(max(1, len(normalize(item).split())) for item in matches)
    return score, matches


def route(task, profiles):
    if not task or not task.strip():
        raise SystemExit("task must be non-empty")

    candidates = []
    for rule in profiles["routing"]:
        score, matches = score_rule(task, rule)
        if score:
            candidates.append((rule["priority"], score, rule, matches))

    if not candidates:
        fallback = profiles["fallback"]
        return {
            "agent_id": fallback["agent"],
            "skills": next(
                agent["skills"] for agent in profiles["agents"]
                if agent["id"] == fallback["agent"]
            ),
            "confidence": fallback.get("confidence", "low"),
            "matched_rules": [],
            "matched_keywords": [],
            "reason": fallback.get("reason", "fallback"),
        }

    candidates.sort(key=lambda item: (item[0], item[1]), reverse=True)
    priority, score, rule, matches = candidates[0]
    confidence = "high" if score >= 4 else "medium" if score >= 2 else "low"
    agent = next(item for item in profiles["agents"] if item["id"] == rule["agent"])

    return {
        "agent_id": agent["id"],
        "skills": agent["skills"],
        "confidence": confidence,
        "matched_rules": [rule["id"]],
        "matched_keywords": matches,
        "priority": priority,
        "score": score,
    }


def main():
    parser = argparse.ArgumentParser(description="Route a task to the appropriate language agent.")
    parser.add_argument("--task", required=True, help="Task description to route.")
    parser.add_argument("--json", action="store_true", help="Emit machine-readable JSON.")
    args = parser.parse_args()

    profiles = load_profiles()
    result = route(args.task, profiles)
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(f"Agent: {result['agent_id']}")
        print(f"Confidence: {result['confidence']}")
        print(f"Skills: {', '.join(result['skills'])}")
        print(f"Matched rules: {', '.join(result['matched_rules']) or 'fallback'}")
        print(f"Matched keywords: {', '.join(result['matched_keywords']) or 'none'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
