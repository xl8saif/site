---
name: skills-console-verification
description: Deterministic production verification for the public Saif AI Skills Console.
---

# Skills Console Verification

Run this skill whenever public/skills or its supporting Agent Skills/design contracts change.

Checks required multilingual UI contracts, registry integrity, mirrored Agent Skills, asset references, public/private boundaries, JavaScript syntax, and production build readiness.

Commands:
node scripts/verify-skills-console.mjs
node --check public/skills/app.js
node --check public/skills/ux-premium.js
node --check public/skills/second-brain-memory.js
npm run build

This deterministic gate complements human visual and browser review.