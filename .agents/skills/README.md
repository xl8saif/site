# Paperclip integration

The production AI Skills live canonically under `ai-skills/`. Paperclip-compatible copies are maintained under `.agents/skills/` because Paperclip's project scanner discovers skills from that directory.

Do not edit the mirrored copies directly. Regenerate them with:

```bash
python ai-skills/scripts/sync_paperclip_skills.py
python ai-skills/scripts/sync_paperclip_skills.py --check
```

Paperclip can also import a production Skill directly from GitHub, for example:

```text
https://github.com/xl8saif/site/tree/main/ai-skills/pubg-urdu-lqa
```

The repository's five production Skills are intentionally kept as normal Paperclip Skill folders: `SKILL.md` plus `references/` and `scripts/`. Paperclip can install a GitHub source at company level and then attach the installed skill to selected agents.

Recommended ownership model:
- `ai-skills/` = canonical rules, references, evals, deterministic QA, and release lifecycle.
- `.agents/skills/` = Paperclip project-discovery mirror.
- Paperclip company skill library = runtime installation/assignment layer.

Paperclip itself remains an orchestration/control-plane layer; it does not replace the domain QA engine.
