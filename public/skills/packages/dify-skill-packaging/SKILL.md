---
name: dify-skill-packaging
description: Use when creating, importing, exporting, or validating a portable Agent Skill package.
---

# Dify Skill Packaging

1. Require a package-root SKILL.md.
2. Normalize CRLF/CR to LF.
3. Validate frontmatter.
4. Reject absolute paths and .. traversal.
5. Keep detailed guidance in references instead of bloating the discovery file.
