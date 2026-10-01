# Saif AI Skills Console\n\nThe Skills Console combines Saif's domain-specific language skills with reusable agentic-development practices.\n\n## OpenHands integration\n\nThe console incorporates selected concepts from the public OpenHands Extensions catalog and the open Agent Skills format. OpenHands skills are treated as workflow patterns, not copied wholesale:\n\n- Code Review: prove material correctness, compatibility, security and maintainability findings.\n- Iterate & Verify: run the verification loop against the latest change and fix root causes.\n- Skill Creator: use precise triggers, lean core instructions and progressive disclosure.\n- Review Learning: extract recurring patterns from review feedback into reusable guidance.\n\nThe browser metadata lives in `openhands-skill-library.js`. The public OpenHands registry remains the upstream reference.\n\n## Existing Saif domain skills\n\n- `pubg-urdu-lqa`\n- `arabic-urdu-localization`\n- `multilingual-translation-mtpe`\n- `legal-translation-qa`\n- `indus-kohistani-research`\n\nThe router can combine domain expertise with engineering workflow skills. For example, a request containing both “PUBG Urdu LQA” and “review the implementation” should retain the PUBG localization context while applying the code-review workflow.\n\n## Agent Skills design principles\n\nSkills use concise metadata for discovery and operational instructions for execution. Detailed material should be moved into references when a skill grows large. This follows the progressive-disclosure model used by the Agent Skills ecosystem.
## Dify-inspired skill architecture

The console adapts selected architecture patterns from the official Dify repository: discovery metadata first, progressive disclosure, scoped verification, evidence-first validation, and portable SKILL.md packaging. Dify's current repository exposes first-class Agent Skills under .agents/skills, while its CLI supports installing skills from a standard folder layout. These patterns are adapted to the static GitHub Pages console rather than copying Dify runtime code.

Added Dify-inspired skills:

- dify-scope-ownership
- dify-frontend-verification
- dify-evidence-verification
- dify-skill-packaging

Portable starter packages are stored under public/skills/packages/. Package validation normalizes line endings, requires a package-root SKILL.md, validates frontmatter presence, and rejects absolute/traversal paths.
