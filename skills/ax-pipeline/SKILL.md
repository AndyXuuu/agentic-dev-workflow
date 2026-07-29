---
name: ax-pipeline
description: 全流程：需求 → 架构 → 开发 → 测试 → 交付。用于非平凡功能、Bug 修复、重构和高风险交付；明确的低风险小改动使用全局 Fast Path，不自动展开完整流水线。
---

# Software Engineering Pipeline

Use this workflow for non-trivial software changes. Do not start coding immediately.

## Fast Path Routing

Before starting the pipeline, apply the current global or project Fast Path criteria.
When every criterion is satisfied, do not run the stages below: confirm the existing
owner, make the localized change, run the smallest meaningful validation, and report
concisely. If the user explicitly requests the full pipeline, or any eligibility condition
is uncertain, use the full workflow below.

## 1. Requirement Analysis

Produce:

- Goal
- In scope
- Out of scope
- Acceptance criteria
- Ambiguities
- Risk areas

Ask clarification if ambiguity affects behavior, data model, API contract, permissions, billing, security, or user workflow.

## 2. Codebase Discovery

Before implementation:

- Search for existing similar logic.
- Identify owner modules.
- Identify existing patterns.
- Identify nearby tests.
- Identify commands for verification.

Do not create a parallel implementation without explaining why.

## 3. Domain Routing

Classify the affected scope before design:

- Frontend-only: use `ax-frontend` for UI, state, design-system, accessibility, and browser boundaries.
- Backend-only: use `ax-backend` for contracts, domain/data ownership, consistency, security, and runtime boundaries.
- Fullstack or multi-repo: use both domain Skills, identify one source contract owner, and keep provider projections plus consumer clients derived.

Project stack, paths, commands, and business rules come only from the target project's `AGENTS.md`, adapters, canonical docs, and source code. Do not add project facts to global Skills.

## 4. Architecture / Design

State:

- Files/modules to change
- New modules/classes/functions
- Reused modules
- Where business logic will live
- Where side effects will live
- How duplication will be avoided
- Rollback or migration concerns

## 5. Change Control

Before implementation, handle any requirement or architecture change through these rules.

If requirements change during implementation:

1. Stop coding.
2. Summarize the original requirement.
3. Summarize the requested change.
4. Identify changed acceptance criteria.
5. Identify affected modules, APIs, data models, permissions, tests, migration, and delivery risk.
6. Update the PRD/design/test plan before continuing.
7. Do not patch code directly from the change request unless the impact is trivial and explicitly scoped.

If architecture changes during implementation:

1. Stop coding.
2. Explain why the current design is insufficient.
3. Compare current design vs proposed design.
4. List files already changed that must be revised, kept, or reverted.
5. Update the implementation plan and regression test plan.
6. Continue only after the revised design is explicit.

## 6. Implementation

Rules:

- Keep files single-responsibility.
- Extract shared behavior when duplication is meaningful.
- Avoid large all-in-one files.
- Apply the global and routed domain code-size/AI-maintainability policy; do not use line count alone as a defect or split mechanically to satisfy a threshold.
- Prefer domain/service/helper modules for business logic.
- UI/controller/API layers should not own business rules if a service/domain layer exists.

## 7. Testing

For bug fixes:

- Reproduce the bug or explain why it cannot be automated.
- Add a regression test that would fail before the fix.

For features:

- Test behavior and edge cases.
- Avoid tests that only mirror implementation details.
- Include invalid input and state/permission boundaries when relevant.

## 8. Delivery Review

Final answer must include:

- Requirement matched
- Design used
- Files changed
- Tests run
- Remaining risks
- Rollback/recovery notes when relevant
