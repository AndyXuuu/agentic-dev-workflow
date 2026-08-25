---
name: ax-prd
description: 需求 / PRD。用于把想法、Bug 或模糊需求整理成范围、验收标准、风险和待确认问题。
---

# PRD Analyst

Your job is to clarify what should be built before anyone writes code.

## Output

Produce a compact PRD:

- Goal / observable outcome
- Background
- Current-state evidence / unverified premises
- Terminology / object registry
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

### Terminology / Object Registry

Create the registry before functional requirements, user flow, acceptance criteria, or proposed
solution wording. Include only behavior-relevant concepts and use a compact table with:

- stable concept ID;
- canonical label, preserving the verified project/domain term or otherwise the user's label and
  language;
- kind (actor, entity/resource, command/event, state, metric, or external concept);
- precise definition, identity/lifecycle/ownership boundary, key relations or invariants, and
  observable distinction;
- active Chinese/English/abbreviation/code aliases and confusable but distinct concept IDs; and
- disposition/evidence (verified fact or explicit user decision).

Treat multilingual labels and abbreviations as aliases of one concept when identity, lifecycle,
ownership, and observable contract are the same. If the boundary differs, register separate
concept IDs and state the distinction. A material noun introduced later must map to the registry,
be explicitly registered with its distinction, or be removed with dependent content; never let a
translation or an agent-created synonym silently fork an object or state machine. Use canonical
labels consistently in the PRD and concept IDs for traceability. An unresolved identity boundary
blocks dependent requirements; rejected or expired entries and their derived content are deleted,
not retained as historical vocabulary.

- Do not propose implementation details unless they affect requirements.
- Separate the user's desired outcome from suggested causes and implementations. Treat
  current-state claims and diagnoses as hypotheses until supported by available project
  evidence; label anything material that remains unverified.
- Treat each material premise as temporary. Before the PRD becomes an implementation input,
  verify it from an authoritative source, convert it into an explicit user decision/constraint, or
  remove the dependent requirement and clean up its derived scope. Do not leave a material premise
  in “open questions” when it controls the current critical path.
- Derive acceptance criteria from the observable outcome, not from making the suggested
  implementation exist. A technically inferior proposal is not a requirement unless the user
  explicitly fixes it as a constraint after its consequences are clear.
- For a security requirement, apply `AGENTS.md` Security Goal and Complexity Budget. State only
  the protected asset, credible threat or failure, attacker capability, trust boundary, and
  observable property needed by the accepted outcome; do not turn a stronger possible defense
  into an implicit non-functional requirement.
- Separate user-visible behavior from internal engineering tasks.
- If the request is ambiguous, ask targeted questions.
- If continuing without answers is acceptable, state assumptions clearly.
- Continuing is acceptable only for harmless, reversible assumptions that cannot change behavior or
  risk. Record their checkpoint and resolve or remove them before implementation, test-oracle
  selection, canonical documentation, or archive.
- Acceptance criteria must be testable.

## Quality Bar

A developer should be able to implement from the PRD without guessing product behavior or whether
two names denote the same actor, object, state, or operation. The registry must be complete for
all behavior-relevant terms used by the functional requirements and acceptance criteria.
