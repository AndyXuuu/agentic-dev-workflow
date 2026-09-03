---
name: ax-pipeline
description: 全流程控制器：按风险选择需求、设计、实现、验证和交付路径；不拥有 Domain SDD 的 Spec 分级、Logic Flow、Requirement/Oracle 或执行 Todo 合同。
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

## Spec / SDD Routing

`ax-pipeline` is the lifecycle controller. It decides the path, orders the lifecycle steps, and
returns the next executable boundary; it does not own Domain Spec grading, Logic Flow semantics,
Requirement/Oracle mapping, or execution-Todo decomposition.

Before requirement or design work, determine whether the target project adopts Domain SDD:

- **No adopted SDD**: locate the project's canonical behavior contract and continue through the
  normal lifecycle without inventing an SDD model.
- **Adopted SDD**: route Domain selection, Spec acceptance/gap classification, Change Delta,
  Logic Flow decomposition, temporary Todo creation/freeze, and coverage reconciliation to
  `ax-sdd`. Do not reproduce those rules in this Skill or create a second execution packet.

The pipeline consumes the SDD result (`out-of-sdd`, `accepted`, `gap`, or blocked) and controls only the lifecycle
transition: requirement/design when needed, implementation, risk-selected verification, and
delivery. A material SDD gap or decision blocks only its dependent path. After implementation,
return the selected evidence and SDD reconciliation result to the pipeline; do not repeat SDD
validation or lifecycle gates whose inputs are unchanged.

## Lifecycle Controller Contract

- Keep one active critical-path step.
- Finish the smallest working vertical slice before optional cleanup or hardening.
- Route only confirmed affected Owners and risk boundaries.
- Use focused verification by default; broaden only when the changed risk or project gate requires it.
- Reuse valid evidence and inspect aggregate command containment before running a broader gate.
- Do not create duplicate PRD, architecture, Spec, Todo, review, or delivery artifacts.

The detailed current-domain model, Spec grading, Logic Flow ownership, Requirement/Oracle mapping,
temporary execution Todo contract, freeze/rebuild rules, and SDD close reconciliation belong to
`ax-sdd` and its `domain-sdd-model` reference.

## Lifecycle Stages

The controller advances only the stages required by the selected route:

1. **Route** — classify Fast Path or standard workflow from `AGENTS.md`, identify the primary Owner, and load only the required supporting Skills.
2. **Clarify** — use `ax-prd` when the canonical behavior contract is missing or incomplete; otherwise consume the accepted contract result.
3. **Design** — use `ax-arch` only when an architecture, ownership, contract, data, permission, security, concurrency, migration, or failure boundary needs a decision.
4. **Implement** — use `ax-dev` and the routed domain Skill for the confirmed scope.
5. **Accept** — consume the business Test Flow and Acceptance Oracle owned by `ax-sdd` or the project's canonical contract; do not invoke a code-test planning Skill.
6. **Review / deliver** — use `ax-review` when the delivery boundary requires it, then report the result and residual risk.

When the project adopts Domain SDD, `ax-sdd` performs its own Domain/Spec/Todo work between Route and Implement. The controller waits for `accepted`, `gap`, blocked, and reconciliation results; it does not define their internal fields or decisions.

## Change Control

- Apply local, in-scope decisions without reopening completed stages.
- Stop only the dependent path for a material requirement, ownership, contract, data, permission, security, migration, or feasibility change.
- After a material decision, resume from the owning stage rather than restarting the whole pipeline.

## Acceptance Control

- The business Test Flow and Acceptance Oracle are created from the accepted Spec and frozen Todo before implementation when the project adopts Domain SDD.
- Verify observable business outcomes at the narrowest stable boundary; do not derive checks from changed files, methods, helpers, mocks, or implementation branches.
- Reuse valid acceptance evidence while the business contract and relevant inputs are unchanged.
- Broaden only when the business boundary, Owner, or explicit project gate requires it.
- Existing project-owned CI/release gates remain under the project's own contract; this controller does not invent or schedule code-test suites.

## Delivery Control

- Stop when the acceptance criterion and selected business evidence pass.
- Do not create duplicate PRD, architecture, Spec, Logic Flow, Test Flow, Todo, review, or delivery artifacts.
- Return only the outcome, affected scope, business evidence, and material residual risk required by the project.
