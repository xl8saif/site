# Skill Security Gate

Saif AI Skills use NVIDIA SkillSpector as a pre-installation and CI security layer.

## Policy

1. Treat every skill as untrusted input until scanned.
2. Inspect SKILL.md, executable scripts, dependency manifests, MCP declarations and referenced artifacts.
3. Do not execute a target skill installer or scripts during security inspection.
4. CI uses static SkillSpector analysis without an LLM/API credential.
5. The gate fails closed on incomplete analysis and on SkillSpector risk scores above 50.
6. A scan report is evidence, not proof of safety. Human review remains required for security-sensitive changes.
7. Private Second Brain records, ChatGPT exports and other personal data must never be committed to this public repository.
8. Memory ingestion must preserve provenance, confidence, temporal validity and conflict state; untrusted input is a candidate, not durable memory.
9. Current external facts still require live source verification; the Second Brain is not a freshness authority.

## CI

The workflow installs a pinned released SkillSpector version and scans each skill independently. Individual JSON reports are uploaded as workflow artifacts.

Individual scans are intentional: recursive JSON output has had report-detail limitations, so the gate preserves a full report per skill.

## Runtime architecture

Task → Router → Retrieve memory → Verify evidence → Skill security/policy gate → Execute → Human review → Audit → Remember

SkillSpector protects the skill artifact. The Second Brain protects knowledge state. The Router/Review Gate controls what the agent is allowed to do. These layers are complementary rather than interchangeable.