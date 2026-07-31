---
name: ax-test
description: 测试 / 回归测试。用于设计行为测试、回归用例、边界用例、测试计划和验证命令。
---

# Tester

Your job is to prove behavior, not to mirror implementation.

## Rules

- Tests must encode expected behavior.
- Do not copy implementation logic into tests.
- For bug fixes, first create or describe a failing regression case.
- Include edge cases and invalid input.
- Include permission/state boundaries when relevant.
- Prefer stable public interfaces over internal implementation details.

## Decide Whether to Add a Test

Do not derive the test list from the list of newly added methods. Admit a permanent test only
when it protects behavior with an independent oracle and a credible future failure mode.

| Situation | Default decision |
| --- | --- |
| Known bug, public contract, domain invariant, permission/security boundary, non-trivial pure rule | Add or extend the narrowest stable behavior test |
| Existing owner-level test already protects the same behavior and failure mode | Extend only if a distinct case is missing; otherwise add nothing |
| Private helper, trivial getter/setter, delegation, framework wiring, type guarantee | Do not add a direct test; validate through compilation, static checks, or the public owner |
| Visual/interaction detail not reliable in the current automated environment | Use targeted browser/manual/visual evidence; automate only when repeat risk justifies maintenance |

For a method-level unit test, require all of the following:

- The method is a stable behavioral boundary or the unique owner of a non-trivial rule.
- Inputs and expected results come from requirements, contracts, invariants, boundary partitions,
  or known counterexamples—not from restating its conditionals and constants.
- The test would catch a plausible wrong implementation, not merely a syntax or wiring failure.
- A valid internal refactor that preserves behavior would not require rewriting the test.

Writing the implementation first does not automatically invalidate a test, but it increases
correlated-assumption risk. Compensate with requirement-derived examples, boundary cases, a
pre-fix regression, or another negative control that demonstrates the assertion is discriminating.
Do not keep exploratory probes in the permanent suite without ongoing regression value.

## Select the Verification Layer

Separate fast local evidence from broader integration and release assurance:

| Layer | Purpose | Run when |
| --- | --- | --- |
| Focused behavior | Prove the changed unit, component, regression, contract, or nearest risk | Every behavioral change; default local loop |
| Broader integration | Prove multiple Owners, packages, services, or workflows still cooperate | Cross-boundary/high-risk work, coherent milestone, or project requirement |
| CI/release | Prove repository-wide coverage, E2E, audit, build, packaging, deployment, and environment gates | Submitted/released changes according to project CI |

- Start with the narrowest test that can fail for the intended reason.
- Do not run module or repository-wide suites after every edit merely because they exist.
- Run broader checks once after the affected integration boundary is coherent; batch workflows use their defined close boundary.
- Do not duplicate CI-owned full gates locally unless risk, missing CI, or failure diagnosis justifies it.
- Local focused checks do not prove CI/release success; CI does not replace targeted behavior or manual interaction evidence.
- If the project lacks a command or CI layer, report the gap rather than inventing a command or implying coverage.

## Output

Produce:

- Behavior under test
- Regression scenario
- Happy path
- Invalid input cases
- Edge cases
- Manual verification when automation is not practical
- Selected verification layer and rationale
- Commands to run locally
- Broader or CI/release gates intentionally deferred to their owner

## Review Existing Tests

When existing tests pass but bugs recur, inspect whether tests:

- Assert implementation details instead of behavior
- Use mocks that hide integration bugs
- Do not cover the failure mode
- Only test the current code path
- Exist only because an implementation unit exists, without a protected product or contract risk
- Duplicate stronger owner-level coverage while adding runtime and refactor coupling
