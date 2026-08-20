---
name: ax-pipeline
description: 全流程：需求 → 架构 → 开发 → 测试 → 交付。用于非平凡功能、Bug 修复、重构和高风险交付；明确的低风险小改动使用全局 Fast Path，不自动展开完整流水线。
---

# Software Engineering Pipeline

Use this workflow for non-trivial changes. Keep one active critical-path step. Gates and domain
Skills support delivery; do not turn them into parallel outputs. Stop when acceptance and every
verification selected by the changed risks and applicable project gates pass. Focused verification
is the default feedback layer, not the universal completion condition.

## Fast Path Routing

Apply the current `AGENTS.md` routing. Use the full workflow only for a confirmed risk boundary,
material unresolved uncertainty, or an explicit request. Otherwise use Fast Path.

If the request creates a new project or application package and no corresponding Owner exists,
invoke `ax-project-bootstrap` before this pipeline. Resume requirement and architecture planning
from the fully generated baseline; do not design an equivalent framework from an empty directory
when a compatible registered scaffold exists.

## 1. Requirement Analysis

Produce one compact note, not separate stage artifacts:

- Goal
- In scope
- Out of scope
- Acceptance criteria
- Ambiguities
- Risk areas
- Material assumptions and their disposition

Ask only if ambiguity materially affects behavior or risk and it cannot be resolved from
authoritative evidence or an explicit user decision. Do not continue by relabeling a material
ambiguity as reversible.

Treat assumptions as temporary working hypotheses. Before implementation or test planning, every
material assumption must be verified from an authoritative source, converted into an explicit user
decision/constraint, or removed together with dependent plan content. Do not carry an unresolved
assumption into a canonical document, archive, or delivery report.

## 2. Codebase Discovery

Inspect until the owner, reuse point, smallest change, and risk-selected verification plan are known:

- Search for existing similar logic.
- Identify owner modules.
- Identify existing patterns.
- Identify nearby tests.
- Identify commands for verification.

Do not create a parallel implementation without explaining why.

## 3. Domain Routing

Route only the affected scope. When this pipeline is primary, Domain Skills run in supporting mode:
they add domain decisions without repeating requirement, design, test, or delivery gates.

- Frontend-only: use `ax-frontend` for UI, state, design-system, accessibility, and browser boundaries.
- Backend-only: use `ax-backend` for contracts, domain/data ownership, consistency, security, and runtime boundaries.
- Fullstack or multi-repo: use both domain Skills, identify one source contract owner, and keep provider projections plus consumer clients derived.

Project stack, paths, commands, and business rules come only from the target project's `AGENTS.md`, adapters, canonical docs, and source code. Do not add project facts to global Skills.

When a project explicitly opts into reconstruction-grade SDD, use `ax-sdd` only in supporting
mode: the lifecycle still owns requirement, design, implementation, verification, and delivery;
SDD owns the converged current system definition, traceability, and isolated Builder bundle.
Never copy stage notes, Proposal, tasks, rejected alternatives, or Agent reasoning into current SDD.

## 4. Architecture / Design

State only items that affect implementation:

- Files/modules to change
- New modules/classes/functions
- Reused modules
- Where business logic will live
- Where side effects will live
- How duplication will be avoided
- Rollback or migration concerns when present

## 5. Change Control

Apply local explicit changes directly. For a material requirement or architecture change, pause
once to state the delta, impact, and revised plan; ask only when a decision or approval is needed.

If evidence invalidates a material assumption, pause the dependent path, identify derived work, and
re-verify it, obtain an explicit decision, or clean up the derived work before continuing.

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
- Preserve a pre-fix check; add a permanent test only when it protects a stable behavior or known
  regression better than existing coverage.

For features:

- Test the changed behavior and affected risks only.
- Avoid tests that only mirror implementation details.
- Do not expand into unrelated edge, permission, security, or failure scenarios.

Choose one verification owner for each risk. Inspect aggregate target composition, reuse valid
evidence for unchanged inputs, and run broader or release gates once at the coherent close boundary.
Do not stack focused, integration, full, and release commands when later targets simply repeat the
same suites.

## 8. Delivery Review

Report outcome, files, verification, and material residual risk. Add design, migration, or rollback
details only when relevant.

For an opted-in reconstruction SDD, reconcile the accepted behavior and oracles into its current
artifacts, remove the temporary change packet from the default repository search space, and run the
selected SDD validation. Do not report static validation or bundle creation as a successful clean
reconstruction.
