---
name: second-brain
description: Maintain a source-aware, temporal personal knowledge system for durable facts, decisions, terminology, corrections, projects, research, and conversation-derived knowledge. Use when deciding what to remember, retrieving prior knowledge, detecting contradictions, promoting repeated experience into reusable rules, or preparing context for another Skill.
---

# Saif Second Brain

## Purpose

The Second Brain is the durable knowledge layer underneath Saif AI. It stores structured knowledge rather than treating raw conversation history as memory.

Use it to:

1. capture durable knowledge from conversations, documents, research, and work;
2. distinguish verified knowledge from inference;
3. preserve provenance and timestamps;
4. retrieve relevant context before answering or making decisions;
5. detect conflicting or superseded decisions;
6. promote repeated corrections into reusable rules;
7. keep memory portable across agents through Markdown/JSON and MCP-compatible interfaces.

## Memory classes

- semantic: stable facts, terminology, references, project facts;
- episodic: dated events and conversation-derived experiences;
- procedural: reusable workflows and Skills;
- decision: choices, alternatives, rationale, scope, status;
- preference: user-confirmed working preferences;
- correction: source → machine output → approved output;
- research: claims with sources, dates, and verification status;
- relationship: links between people, projects, terms, decisions, and sources.

## Trust model

Every durable record should carry:

- status: verified | established | tentative | superseded;
- confidence: 0.0–1.0;
- source type and source reference;
- created_at and updated_at;
- valid_from and optional valid_until;
- scope/project/domain.

Never silently upgrade an AI inference to verified knowledge.

## Retrieval policy

Use hybrid retrieval:

1. exact lexical matches;
2. metadata filters;
3. semantic retrieval when available;
4. relationship/graph traversal;
5. temporal validity;
6. confidence and status;
7. recency as a tie-breaker.

Prefer the smallest evidence set that answers the question. Do not dump entire conversations into model context.

## Decision policy

When a new record conflicts with an active decision:

- do not overwrite automatically;
- surface the conflict;
- show both records and their dates;
- ask whether the new record supersedes, scopes, or merely discusses the old decision.

## Promotion policy

Repeated human corrections or recurring QA findings may be proposed as reusable rules. Promotion requires evidence and human confirmation for high-impact terminology, legal, religious, client-specific, or production rules.

## Privacy

The public repository contains schemas, tooling, and non-sensitive examples only. Private conversation exports, personal documents, credentials, and raw memory databases must remain outside the public repository.
