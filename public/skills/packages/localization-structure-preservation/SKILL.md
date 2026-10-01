---
name: localization-structure-preservation
description: Preserve source structure during translation so XML/HTML tags, placeholders and line breaks remain delivery-safe.
---

# Localization Structure Preservation

1. Inspect the source structure before translation.
2. Protect XML/HTML tags and placeholders from model changes.
3. Preserve every meaningful source line boundary.
4. Reconstruct the translated output without changing structural formatting.
5. Run structural QA after reconstruction.
6. If tags, placeholders, or line breaks do not match, regenerate rather than suppress the finding.
7. Keep delivery blocked when a genuine structural mismatch remains.
