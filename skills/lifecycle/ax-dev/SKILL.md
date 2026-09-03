---
name: ax-dev
description: 开发实现。用于基于已确认的 PRD/设计完成非平凡代码改动，保持架构边界、避免重复逻辑并完成业务验收；不用于仅需按 AGENTS.md Fast Path 处理的明确、局部、低风险小改动。
---

# Developer

Your job is to implement the accepted design, not redefine the product.

Keep one active acceptance criterion. Defer unrelated cleanup, hardening, review findings, and
documentation. Stop when the accepted behavior and every business acceptance check selected by the
changed risks and applicable project gates pass. Focused acceptance remains the default implementation loop.

## Fast Path

Decide the path before loading this Skill. When the current global or project Fast Path criteria are
fully satisfied, use `AGENTS.md`, target files, and nearby project navigation without this Skill. If
it was already loaded, confirm the existing Owner and narrow scope, implement the localized change,
run the smallest meaningful acceptance check, and report concisely.

## Contract and SDD Handoff

Before implementation, consume the accepted design or the route result from `ax-sdd` when the
project adopts Domain SDD. `ax-dev` owns implementation only; it does not grade Specs, decompose
Logic Flows, define Requirement/Oracle mappings, or create/freeze execution Todos.

If the handoff is not executable, return the dependent path to `ax-pipeline` and report the exact
missing contract rather than recreating an SDD packet inside this Skill.

## Before Editing

Confirm the handoff is executable:

- accepted behavior/design or the `ax-sdd` route result;
- affected modules and callers;
- existing logic to reuse;
- business acceptance entrypoint selected by the owning contract;
- material assumptions already resolved by the owning contract/design stage.

If any required boundary is missing, return to `ax-pipeline`; do not fill a requirement, Spec, or
Todo gap inside implementation.

## Implementation Rules

- Follow existing code style and local patterns.
- Search before adding new helpers or business rules.
- Do not introduce a second identity, lifecycle, public/persistent contract, or security boundary as
  an implementation shortcut.
- Keep modules single-purpose and avoid all-in-one files.
- Apply code-size triggers as review signals, not mechanical pass/fail gates.
- Avoid duplicate validators, mappers, formatters, API wrappers, permission checks, and business logic.
- Keep business rules in the correct layer and changes scoped to the request.
- Do not add a stronger security mechanism than the accepted requirement and design.

## Acceptance

Run the smallest business check that proves the observable outcome. Broaden only for confirmed
cross-owner/contract risk or an explicit project gate. Inspect aggregate target composition and reuse
still-valid evidence; do not repeat a contained gate on the same delivery input.

Report:

- Files changed
- Business behavior implemented
- Acceptance evidence
- Known gaps
