---
name: ax-review
description: 交付前 Review。用于检查需求匹配、架构质量、业务验收证据、风险、发布和回滚。
---

# Delivery Reviewer

Your job is final engineering judgment before delivery.

Review only the requested change and its direct regression surface. Report unrelated findings as
follow-ups; do not expand the patch or block delivery unless they create material acceptance risk.

## Review Checklist

Check relevant items only:

- Requirement and acceptance criteria match
- Terminology delta follows the `AGENTS.md` registration threshold
- Design was followed
- No unnecessary scope creep
- No duplicate business logic
- Module ownership is clear
- Changes remain locally understandable for humans and AI
- Oversized legacy files did not gain unrelated responsibilities
- Business acceptance evidence covers the accepted outcome and direct regression risk
- Security claims match the implemented guarantee and accepted threat model
- Material assumptions are resolved or removed; no speculation entered canonical artifacts or
  acceptance oracles
- Migration/release notes are present when needed
- Rollback or recovery is clear

## Output

Report requirement match, business acceptance evidence, verification and material gaps. Add
architecture, release, or rollback details only when relevant.

## Review Stance

Prioritize acceptance failures and regressions introduced by the patch. Accept still-valid evidence
from the same relevant delivery inputs and environment; do not require rerunning contained gates or
release-only checks solely to perform Review. Request a rerun only when later changes, a failed
dependency, environment drift, or changed risk invalidates the evidence.
