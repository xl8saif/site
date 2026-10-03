---
name: stitch-build-loop
description: Run a controlled Stitch-to-production iteration loop using DESIGN.md, SITE.md, metadata, focused changes, verification, and human review.
---

# Stitch Build Loop

Adapt the official Stitch baton-loop concept to the Saif AI Skills Console without allowing autonomous design changes to bypass review.

## Iteration contract
Each iteration follows:
1. read `.stitch/SITE.md`;
2. read `.stitch/DESIGN.md`;
3. read `.stitch/metadata.json`;
4. identify one scoped design task;
5. generate or edit one screen/design state;
6. review the design artifact;
7. implement only the accepted change;
8. run validators/build/browser verification where available;
9. update metadata and design documentation;
10. prepare the next scoped task.

## Baton
Use `.stitch/next-prompt.md` only as a task handoff mechanism. It must never contain secrets, private memory, credentials, or fabricated project identifiers.

## Production gate
Stitch output is not production code. Human review is required before modifying `public/skills/`.

## Orchestration
The loop may be driven manually, by Jules, or by CI. Automated execution must remain PR/review oriented; never auto-merge a visual change merely because an agent reports success.

## Stop conditions
Stop the loop when requirements conflict, visual verification fails, a privacy boundary is crossed, a deterministic validator fails, or the next task would require a broad architectural migration.
