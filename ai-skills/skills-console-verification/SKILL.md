---
name: skills-console-verification
description: Deterministic production verification for the public Saif AI Skills Console.
---

# Skills Console Verification

Use this skill whenever public/skills or its supporting Agent Skills/design contracts change.

Run:
node scripts/verify-skills-console.mjs
node --check public/skills/app.js
node --check public/skills/ux-premium.js
node --check public/skills/second-brain-memory.js
npm run build

The verifier checks required multilingual UI contracts, skill registry integrity, mirrored Agent Skills, asset references, and public/private boundaries. It is deterministic and does not replace human visual review or browser testing.