# Saif AI Second Brain

This is the knowledge layer planned for the Saif AI stack.

The public repository stores the architecture and tooling. Private memory data must never be committed here.

## Current design

**Memory** answers: "What do I know?"

**Skills** answer: "How do I do this?"

**Router/agent** answers: "Which knowledge and Skill should I use?"

**Review gate** answers: "What evidence supports this result?"

**Console** answers: "Where do I interact with it?"

## Non-negotiable properties

- source-aware;
- temporal;
- confidence-scored;
- versioned;
- contradiction-aware;
- human-confirmed for high-impact memory;
- portable across AI agents;
- exportable without vendor lock-in;
- searchable with exact + semantic + relationship retrieval;
- private by default.

## Planned data domains

- professional profile and career history;
- translation and localization terminology;
- PUBG MOBILE Urdu LQA decisions;
- Arabic ↔ Urdu / Persian workflows;
- legal translation patterns;
- project decisions;
- Waraq;
- FiKR&CD;
- Indus-Kohistani and Shina research;
- portfolio and AI Skills;
- client instructions;
- corrections and approved examples;
- research references;
- tool and technology decisions;
- recurring workflows;
- open questions and future plans.

## Historical conversation ingestion

The first migration target is the user's ChatGPT export. The migration must preserve:

- conversation ID;
- timestamps;
- user/assistant roles;
- titles;
- raw transcript;
- extracted candidate memories;
- source pointer back to the conversation;
- confidence/status;
- supersession relationships.

The raw export should remain private. The public repo should receive only sanitized schemas, tests, and non-sensitive examples.

## Target agent interface

MCP is the planned interoperability layer. The brain should eventually expose read/write capabilities such as:

- `brain_search`
- `brain_get`
- `brain_remember`
- `brain_update`
- `brain_forget` (implemented as supersession, not destructive deletion by default)
- `brain_decisions`
- `brain_conflicts`
- `brain_sources`

MCP's current specification separates resources, prompts and model-controlled tools, which fits this separation well.

## Research basis

The design was reviewed against current work on agent memory and knowledge retrieval, including Graphiti, Mem0, LangMem, Letta, LightRAG, Microsoft Research's PlugMem work, and the 2026 Agentic Memory (AgeMem) paper. The implementation intentionally keeps these as replaceable components rather than hard dependencies.
