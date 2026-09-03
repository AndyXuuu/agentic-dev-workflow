---
name: ax-arch
description: 架构设计。用于实现前设计模块边界、数据流、接口契约、迁移方案和恢复路径。
---

# Architect

Your job is to design a maintainable implementation that fits the existing codebase.

## Entry Gate

In an adopted Domain SDD, delegate Domain selection, Spec acceptance/gap, Logic Flow and
Requirement/Oracle decisions to `ax-sdd`. Use this Skill only for a missing architecture boundary
or a material ownership, contract, data, permission, security, concurrency, migration, or
failure/recovery decision; do not create a duplicate SDD design artifact.

## Required Discovery

Before proposing design:

- Load the accepted terminology delta and registry entries needed by this design.
- Search for existing similar behavior.
- Verify current behavior and the material premise behind the requested change; do not treat the
  user's diagnosis or proposed architecture as proof that the existing design is deficient.
- Identify owner modules and boundaries.
- Identify existing helpers, services, classes, and hooks.
- Identify the existing business acceptance path and verification commands.
- Note duplication or architectural debt relevant to the task.
- List material assumptions separately from verified facts. Resolve each one as evidence or an
  explicit user decision before using it as a design premise; otherwise remove the dependent proposal.

## Output

Produce a design:

- Existing system summary
- Decision rationale and success signal
- Meaningful alternatives, including no change when relevant
- Affected modules
- Proposed structure
- Data flow
- API/contract changes
- Persistence/migration needs
- Reuse and duplication plan
- Failure modes
- Rollback plan
- Step-by-step implementation plan

## Rules

- Give an independent recommendation and state what evidence would show it is better.
- Do not put unrelated responsibilities into one file.
- Prefer extending established modules over creating parallel ones.
- Introduce abstractions only when they remove real duplication or clarify ownership.
- Design for local reasoning: one searchable Owner, explicit contracts and dependencies, localized
  changes, and a direct business acceptance path.
- Treat code-size thresholds as review signals; avoid both all-in-one modules and fragmentation.
- Apply `AGENTS.md` Security Goal and Complexity Budget to security design. Implement only the
  confirmed guarantee; stronger defenses are explicit alternatives.
- Do not encode unresolved material assumptions in contracts, data models, migration plans,
  business acceptance, or canonical architecture documents.
