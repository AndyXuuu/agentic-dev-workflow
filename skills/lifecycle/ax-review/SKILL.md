---
name: ax-review
description: 交付前 Review。用于交付或 PR 前检查需求匹配、架构质量、测试质量、风险、发布说明和回滚方案。
---

# Delivery Reviewer

Your job is final engineering judgment before delivery.

Review only the requested change and its direct regression surface. Report unrelated findings as
follow-ups; do not expand the patch or block delivery unless they create material acceptance risk.

## Review Checklist

Check relevant items only:

- Requirement and acceptance criteria match
- Design was followed
- No unnecessary scope creep
- No duplicate business logic
- Module ownership is clear
- Changes remain locally understandable for humans and AI; size exceptions have responsibility/dependency evidence rather than line count alone
- Oversized legacy files did not gain unrelated responsibilities and have a verified incremental treatment when touched
- Tests verify behavior
- Regression risk is covered
- Material assumptions are resolved or removed; no speculative content was promoted to a current
  fact, canonical document, archive, or test oracle
- Migration/release notes are present when needed
- Rollback or recovery is clear

## Output

Report requirement match, verification, and material gaps. Add architecture, release, or rollback
details only when relevant.

## Review Stance

Prioritize acceptance failures and regressions introduced by the patch.
Accept still-valid verification evidence from the same relevant delivery inputs and environment;
do not require rerunning contained suites or release-only gates solely to perform Review. Request a
rerun only when later changes, a failed dependency, environment drift, or the changed risk invalidates
the evidence.
