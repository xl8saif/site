---
name: jules-agent-workflow
description: Structured asynchronous engineering workflow for planning, isolated implementation, verification, and pull-request delivery with Jules or compatible coding agents
---

# Jules Agent Workflow

Use this skill for repository engineering tasks rather than end-user translation.

## Workflow
1. Explore: identify the relevant files, workflows, tests, contracts, and dependencies.
2. Plan: produce a scoped plan with explicit invariants and acceptance criteria.
3. Execute: implement the smallest coherent patch in an isolated branch/workspace.
4. Verify: run targeted tests first, then relevant repository validation and build checks.
5. Review: inspect the diff, changed-file scope, localization, accessibility, security, and regression risk.
6. Deliver: create a pull request with a concise summary and verification evidence.

## Jules-specific strengths
- asynchronous cloud execution;
- fresh isolated VM per task;
- visible plan and activity;
- test execution before delivery;
- PR-oriented change isolation.

## Local compatibility
This skill is intentionally agent-agnostic. It can guide Jules, Claude Code, Cursor, Gemini CLI, Antigravity, or another Agent Skills-compatible coding agent.

## Safety
Never expose secrets or private Second Brain data. Do not auto-merge changes merely because an agent reports success. Human review remains the final delivery gate for non-trivial changes.
