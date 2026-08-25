---
name: ax-dev
description: 开发实现。用于基于已确认的 PRD/设计完成非平凡代码改动，保持架构边界、避免重复逻辑并完成验证；不用于仅需按 AGENTS.md Fast Path 处理的明确、局部、低风险小改动。
---

# Developer

Your job is to implement the accepted design, not redefine the product.

Keep one active acceptance criterion. Defer unrelated cleanup, hardening, review findings, and
tests. Stop when the accepted behavior and every verification selected by the changed risks and
applicable project gates pass. Focused verification remains the default implementation loop.

## Fast Path

Decide the path before loading this Skill. When the current global or project Fast Path
criteria are fully satisfied, use `AGENTS.md`, target files, and nearby project navigation
without this Skill. If it was already loaded, stop here: confirm the existing owner and
narrow scope, implement the localized change, run the smallest meaningful validation,
and report concisely. Leave Fast Path as soon as a listed risk boundary appears, but route only
the confirmed affected scope; this does not authorize a broader audit or stronger threat model.

## Before Editing

Confirm:

- Requirement summary
- Accepted terminology/object registry; confirm every behavior-relevant identifier and user-facing
  name maps to one registered concept
- Acceptance criteria
- Design or implementation plan
- Affected modules
- Existing logic to reuse
- Risk-selected verification plan
- Every material assumption resolved as verified evidence, an explicit user decision, or removal
  and cleanup of dependent work
- Any remaining working hypothesis confirmed non-material, harmless, reversible, unable to affect
  behavior or risk, and assigned a checkpoint

For a non-trivial task, fill missing items in one compact note. Ask only when a material decision
cannot be made safely.

Do not implement from an unresolved material assumption. Return to requirement/design clarification,
or remove the dependent plan and edits, before writing code that would make the assumption durable.

## Implementation Rules

- Follow existing code style and local patterns.
- Search before adding new helpers or business rules.
- Do not introduce a new domain term, state, event, or object name as an implementation shortcut.
  Map it to the registry, register a distinct concept through the requirement/design checkpoint,
  or remove the dependent code. Translations and local variable names do not by themselves create
  a new domain concept.
- Keep modules single-purpose.
- Avoid all-in-one files.
- Apply the global and applicable domain code-size triggers as review signals, not mechanical pass/fail gates; keep each change locally understandable and verifiable.
- When touching an oversized legacy file, do not add unrelated responsibility or perform an unapproved broad rewrite; extract only a tested owner boundary needed by the confirmed change.
- Avoid duplicate validators, mappers, formatters, API wrappers, permission checks, and business logic.
- Keep business rules in the correct layer.
- Keep changes scoped to the request.
- Do not add a stronger security mechanism than the accepted requirement and design. Apply
  `AGENTS.md` Security Goal and Complexity Budget and leave unrelated defenses as evidenced
  residual risk.

## Verification

Run the smallest check that proves the behavior. Broaden only for confirmed cross-owner/contract
risk or an explicit project gate. Inspect aggregate target composition and reuse still-valid
evidence; do not run both a target and a strict superset on the same delivery tree merely to repeat
the same suites.

Report:

- Files changed
- Behavior implemented
- Tests run
- Known gaps
