# Task Continuation Incident Notes

## Reported symptom

During multi-task usage, some older tasks become suspended and later unexpectedly resume in a newer interaction.

Observed effect:

- old work suddenly continues later
- resumed old intent conflicts with newer work
- code appears to revert or move backward

## Working diagnosis

This behavior is consistent with oMo continuation and recovery mechanisms rather than a simple random bug.

Relevant local evidence showed built-in mechanisms such as:

- `todo-continuation-enforcer`
- `task-resume-info`
- `stop-continuation-guard`
- `compaction-todo-preserver`
- `preemptive-compaction`
- continuation markers under `.sisyphus/run-continuation`

## Likely trigger chain

1. an older task remains incomplete
2. continuation state remains active
3. a newer task starts in the same or related session context
4. continuation or recovery logic later resumes the older task
5. the older task acts on stale intent and conflicts with newer code

## Key observation

The issue is not “missing continuation.”
The issue is “continuation without sufficient task boundary control.”

## Design implication

We should not build a new task engine.

We should add a thin handoff guard that:

- detects active older work
- exposes it to the user
- forces an explicit handoff decision
- prevents superseded tasks from auto-resuming later
