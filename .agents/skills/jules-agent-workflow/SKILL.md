---
name: jules-agent-workflow
description: Structured asynchronous engineering workflow for planning, isolated implementation, verification, and pull-request delivery with Jules or compatible coding agents
---

# Jules Agent Workflow

Use this skill for repository engineering tasks rather than end-user translation.

## Workflow
1. Explore: identify relevant files, workflows, tests, contracts, and dependencies.
2. Plan: define scope, invariants, and acceptance criteria.
3. Execute: implement the smallest coherent patch in an isolated branch/workspace.
4. Verify: run targeted tests, repository validation, and build checks.
5. Review: inspect diff, localization, accessibility, security, and regression risk.
6. Deliver: create a pull request with verification evidence.

Jules can provide asynchronous cloud execution, isolated workspaces, visible plans, test execution, and PR-oriented delivery.

Never expose secrets or private Second Brain data. Human review remains the final delivery gate for non-trivial changes.
