# Saif Second Brain

A local-first, source-aware memory layer for Saif AI.

The design follows current agent-memory practice: structured reusable knowledge instead of raw transcript stuffing, temporal validity, explicit provenance, contradiction handling, hybrid retrieval, and portable agent access. Current research and open-source implementations such as Graphiti, Mem0, LangMem, Letta, LightRAG, and MCP informed the architecture.

## Architecture

```
Conversation / files / research / work
              |
              v
        Capture + extract
              |
              v
     Candidate knowledge
              |
       provenance + status
              |
              v
       Durable memory store
       /       |        \
 semantic   temporal   relationships
       \       |        /
              v
        Hybrid retrieval
              |
              v
        Saif AI Router
              |
      Skill + evidence + context
              |
              v
        answer / decision
              |
        human confirmation
              |
              v
          memory update
```

## Canonical records

See `schemas/`:

- memory: durable facts, preferences, terminology, corrections, research;
- decision: choices, alternatives, rationale, scope and lifecycle;
- source: provenance for conversations, documents, URLs and research.

## Storage strategy

The repository does **not** contain private memory data.

Recommended deployment stages:

1. Browser/local prototype: IndexedDB/localStorage for immediate private capture.
2. Local durable store: SQLite + FTS5 for fast exact/keyword retrieval.
3. Semantic layer: embeddings with a replaceable vector index.
4. Relationship layer: Graphiti/Neo4j, FalkorDB, or a lighter graph store when relationship queries justify it.
5. Agent access: MCP resources/tools.
6. Optional cloud synchronization: only after encryption, authentication, backup and deletion controls are in place.

Markdown/JSON should remain exportable so the data is never locked to one vendor.

## Research-informed choices

- Graphiti provides temporal knowledge graphs and hybrid semantic/keyword/graph retrieval.
- Mem0 provides a practical memory layer with temporal reasoning and memory evaluation.
- LangMem provides hot-path and background memory management patterns.
- Letta treats memory as part of a stateful agent runtime.
- LightRAG combines graph structure with vector retrieval for incremental RAG.
- MCP provides a standard interface for exposing resources and tools to agents.

These are reference architectures, not dependencies. The first implementation keeps the storage contracts provider-neutral.

## Initial local CLI

The deterministic scripts are intentionally dependency-light:

```bash
python ai-skills/second-brain/scripts/validate_memory.py path/to/memory.jsonl
python ai-skills/second-brain/scripts/build_index.py path/to/memory.jsonl --db .second-brain/index.sqlite
python ai-skills/second-brain/scripts/query_index.py .second-brain/index.sqlite "GitHub Pages"
python ai-skills/second-brain/scripts/normalize_chatgpt_export.py conversations.json -o chatgpt-conversations.jsonl
```

The index is disposable; the JSONL/Markdown records remain the source data.

## Importing ChatGPT history

The intended ingestion pipeline is:

```
Chat export
  -> parser
  -> conversation normalization
  -> candidate extraction
  -> deduplication
  -> contradiction detection
  -> human confirmation
  -> durable memory
```

Do not place a raw ChatGPT export in this public repository. When a private export is available, the parser can be added as a local-only ingestion step.
