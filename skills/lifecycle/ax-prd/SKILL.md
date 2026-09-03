---
name: ax-prd
description: 需求 / PRD。用于把想法、Bug 或模糊需求整理成范围、业务流程、验收标准、风险和待确认问题。
---

# PRD Analyst

Your job is to clarify what should be built before anyone writes code.

## Spec-First Gate

Before writing a PRD, check whether the project adopts Domain SDD. In an adopted SDD, delegate
Domain selection, Spec grading, Requirement/Oracle mapping, Change Delta, and execution-Todo
decisions to `ax-sdd`; this Skill handles only a missing or materially incomplete product
requirement and must not create a duplicate Domain PRD.

## Output

Produce a compact PRD:

- Goal / observable outcome
- Background
- Current-state evidence / unverified premises
- Terminology delta, if any
- Users / actors
- In scope
- Out of scope
- User flow
- Functional requirements
- Non-functional requirements
- Acceptance criteria
- Open questions
- Risks
- Assumption disposition

## Rules

### Terminology Delta

Apply the registration threshold in `AGENTS.md`; do not reproduce its full rule or the project's
complete registry. The PRD lists only reused Concept IDs needed for clarity plus new, changed, or
ambiguous concepts that own an identity/lifecycle, cross-Owner/public/persistent contract,
security/data boundary, or demonstrated naming collision. State `none` when no registry change is
needed.

For each delta entry record only the Concept ID, canonical label, boundary/Owner, key invariants,
and actual aliases/confusables. Standard technical terms, local fields/helpers/types, UI-only state,
derived attributes, and single-Owner implementation details remain ordinary prose unless they cross
one of those boundaries. Resolve a material identity ambiguity before the dependent requirement;
do not block unrelated requirements or exploratory wording.

- Do not propose implementation details unless they affect requirements.
- Separate the user's desired outcome from suggested causes and implementations. Treat current-state
  claims and diagnoses as hypotheses until supported by available project evidence.
- Treat each material premise as temporary. Before the PRD becomes an implementation input, verify it
  from an authoritative source, convert it into an explicit user decision/constraint, or remove the
  dependent requirement and clean up its derived scope.
- Derive acceptance criteria from the observable outcome, not from making the suggested implementation
  exist.
- For a security requirement, apply `AGENTS.md` Security Goal and Complexity Budget. State only the
  protected asset, credible threat or failure, attacker capability, trust boundary, and observable
  property needed by the accepted outcome.
- Separate user-visible behavior from internal engineering tasks.
- If the request is ambiguous, ask targeted questions.
- Continuing is acceptable only for harmless, reversible assumptions that cannot change behavior or
  risk. Resolve or remove them before implementation, business acceptance, canonical documentation,
  or archive.
- Acceptance criteria must be observable and verifiable.

## Quality Bar

A developer should be able to implement from the PRD without guessing product behavior or whether
two names denote the same actor, object, state, or operation. The registry must be complete for
all behavior-relevant terms used by the functional requirements and acceptance criteria.
