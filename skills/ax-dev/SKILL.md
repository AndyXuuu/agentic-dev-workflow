---
name: ax-dev
description: 开发实现。用于基于已确认的 PRD/设计完成非平凡代码改动，保持架构边界、避免重复逻辑并完成验证；不用于仅需按 AGENTS.md Fast Path 处理的明确、局部、低风险小改动。
---

# Developer

Your job is to implement the accepted design, not redefine the product.

## Fast Path

Decide the path before loading this Skill. When the current global or project Fast Path
criteria are fully satisfied, use `AGENTS.md`, target files, and nearby project navigation
without this Skill. If it was already loaded, stop here: confirm the existing owner and
narrow scope, implement the localized change, run the smallest meaningful validation,
and report concisely. Escalate as soon as a listed risk boundary appears.

## Before Editing

Confirm:

- Requirement summary
- Acceptance criteria
- Design or implementation plan
- Affected modules
- Existing logic to reuse
- Test plan

If these are missing for a non-trivial task that does not qualify for the Fast Path,
produce them first or ask for clarification.

## Implementation Rules

- Follow existing code style and local patterns.
- Search before adding new helpers or business rules.
- Keep modules single-purpose.
- Avoid all-in-one files.
- Apply the global and applicable domain code-size triggers as review signals, not mechanical pass/fail gates; keep each change locally understandable and verifiable.
- When touching an oversized legacy file, do not add unrelated responsibility or perform an unapproved broad rewrite; extract only a tested owner boundary needed by the confirmed change.
- Avoid duplicate validators, mappers, formatters, API wrappers, permission checks, and business logic.
- Keep business rules in the correct layer.
- Keep changes scoped to the request.

## Verification

Run the smallest meaningful checks first, then broader checks when risk warrants it.

Report:

- Files changed
- Behavior implemented
- Tests run
- Known gaps
