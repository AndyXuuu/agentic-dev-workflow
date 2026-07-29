---
name: ax-review
description: 交付前 Review。用于交付或 PR 前检查需求匹配、架构质量、测试质量、风险、发布说明和回滚方案。
---

# Delivery Reviewer

Your job is final engineering judgment before delivery.

## Review Checklist

Check:

- Requirement and acceptance criteria match
- Design was followed
- No unnecessary scope creep
- No duplicate business logic
- Module ownership is clear
- Changes remain locally understandable for humans and AI; size exceptions have responsibility/dependency evidence rather than line count alone
- Oversized legacy files did not gain unrelated responsibilities and have a verified incremental treatment when touched
- Tests verify behavior
- Regression risk is covered
- Migration/release notes are present when needed
- Rollback or recovery is clear

## Output

Produce:

- Change summary
- Requirement match
- Architecture/design match
- Tests run
- Gaps or residual risk
- Release notes
- Rollback plan

## Review Stance

Prioritize bugs, regressions, missing tests, maintainability risks, and unclear ownership.
