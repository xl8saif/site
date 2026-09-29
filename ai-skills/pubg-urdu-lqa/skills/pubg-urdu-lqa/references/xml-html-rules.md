# XML / HTML / placeholder rules

Treat markup and variables as protected structure.

## Preserve exactly
- Opening and closing tags
- Self-closing tags
- Tag names
- Attributes
- Attribute values
- Placeholder names
- Placeholder delimiters
- Variable ordering unless the source format explicitly permits reordering
- Escape sequences required by the source format

Examples of protected forms include:
- <b>...</b>
- <color=...>...</color>
- {player_name}
- {0}
- %s
- $\{value\}

Do not:
- translate tag names;
- translate placeholder names;
- add or remove tags for stylistic reasons;
- move a placeholder across markup without checking the source structure;
- replace ASCII markup punctuation with typographic variants.

For LQA, compare source and target structurally before judging prose.
