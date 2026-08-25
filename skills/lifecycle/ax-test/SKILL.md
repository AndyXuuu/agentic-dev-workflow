---
name: ax-test
description: 测试 / 回归测试。用于设计行为测试、回归用例、边界用例、测试计划和验证命令。
---

# Tester

Your job is to prove behavior, not to mirror implementation.

## Rules

- Tests must encode expected behavior.
- Test names, fixtures, and oracles must use the accepted terminology/object registry. If a test
  needs a new behavior-relevant actor, entity, state, event, or operation, map or register that
  concept before adding the test; do not freeze an agent-created synonym into the suite.
- Do not copy implementation logic into tests.
- Test oracles must come from verified contracts, domain rules, explicit user decisions, or
  reproduced behavior. Do not turn an unresolved assumption into an expected value; resolve it or
  remove the dependent test.
- For bug fixes, first create or describe a failing regression case.
- Select only cases and boundaries affected by the change.
- Security cases must test the accepted threat model and claimed guarantee. Do not introduce a
  stronger attacker capability, approval model, integrity mechanism, or trust boundary as a hidden
  test requirement; report it as residual risk unless the requirement is explicitly upgraded.
- Prefer stable public interfaces over internal implementation details.
- Stop when the focused evidence and every broader or release verification selected by the changed
  risks and applicable project gates prove the acceptance criterion; do not pursue coverage for
  its own sake.

## Decide Whether to Add a Test

Do not derive the test list from the list of newly added methods. Admit a permanent test only
when it protects behavior with an independent oracle and a credible future failure mode.

| Situation | Default decision |
| --- | --- |
| Known bug, public contract, domain invariant, permission/security boundary, non-trivial pure rule | Add or extend the narrowest stable behavior test |
| Existing owner-level test already protects the same behavior and failure mode | Extend only if a distinct case is missing; otherwise add nothing |
| Private helper, trivial getter/setter, delegation, framework wiring, type guarantee | Do not add a direct test; validate through compilation, static checks, or the public owner |
| Visual/interaction detail not reliable in the current automated environment | Use targeted browser/manual/visual evidence; automate only when repeat risk justifies maintenance |

Do not assert layout geometry such as centering, anchoring, viewport containment, or overlay
stacking in JSDOM-style environments that do not perform real layout. Use browser-computed
geometry or visual evidence; add maintained E2E/visual regression coverage only when the public
contract and repeat risk justify it.

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

## Compose Gates And Reuse Evidence

Before running named targets, inspect the Makefile, package scripts, task graph, or CI definition:

- Map which suites and checks each target actually contains; names such as `check`, `acceptance`,
  `integration`, and `release` do not prove independent coverage.
- If a selected aggregate gate already contains another target with the same inputs, environment,
  and execution mode, run only the aggregate gate at the close boundary. Do not execute both to
  satisfy duplicated checklist entries.
- Keep a separate focused regression check when the aggregate suite cannot localize or reliably
  exercise the changed behavior.
- Reuse a successful result for the same relevant code/configuration/dependencies/generated inputs
  and environment. Invalidate only evidence affected by later changes, and label reused evidence as
  reused rather than newly run.
- Run race, E2E, artifact, SBOM, audit, packaging, deployment, and production smoke gates only at
  their risk or release boundary unless the patch directly changes them.
- Limit canonical-host or privileged-environment requirements to checks that truly depend on that
  host, platform, credential boundary, or side effect. Do not move hermetic focused tests out of the
  fast loop merely because live acceptance uses a special host.

When test time or maintenance is the problem, first remove duplicate execution and misplaced gate
frequency. Delete or merge permanent tests only after confirming that a stronger stable-boundary
test protects the same behavior and credible failure mode.

## Output

Report the behavior proved, commands/evidence used, and material gaps. Include regression, edge,
manual, broader, or release checks only when selected by actual risk.

## Review Existing Tests

When existing tests pass but bugs recur, inspect whether tests:

- Assert implementation details instead of behavior
- Use mocks that hide integration bugs
- Do not cover the failure mode
- Only test the current code path
- Exist only because an implementation unit exists, without a protected product or contract risk
- Duplicate stronger owner-level coverage while adding runtime and refactor coupling
