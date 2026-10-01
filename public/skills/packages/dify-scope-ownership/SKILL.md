---
name: dify-scope-ownership
description: Use when a change may cross feature boundaries, state ownership, data flow, or interaction ownership. Keep changes within the smallest behavior-owning boundary.
---

# Dify Scope & Ownership

1. Identify the behavior owner.
2. Identify state lifetime and public contracts.
3. Keep the change in the owning vertical slice unless a contract requires propagation.
4. Verify the owning surface and dependent interactions.
