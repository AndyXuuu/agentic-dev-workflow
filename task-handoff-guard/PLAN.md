# Task Handoff Guard Plan

## Objective

Prevent stale continuation from resuming older tasks and overwriting newer intent.

## Constraints

- Must integrate into oMo/OpenCode rather than replace it
- Must not introduce a second full task system
- Must preserve user control at task handoff time
- Must prefer explicit confirmation over hidden automatic decisions

## Known integration points

Based on local package evidence, the most relevant extension points are:

- `command-execute-before`
- `StopContinuationGuard`
- continuation marker state under `.sisyphus/run-continuation`
- `task-resume-info`
- built-in commands:
  - `handoff`
  - `stop-continuation`

## Proposed architecture

### Layer 1: Handoff preflight

Trigger before `/handoff` executes.

Responsibilities:

- inspect continuation state
- inspect active todo continuation signals
- inspect resume info
- read local task handoff state
- show user a conflict summary if old work is still active

### Layer 2: Decision application

Possible decisions:

1. continue old task
2. stop old task and start new task
3. keep old task state and continue new task anyway

Decision 2 should call `stop-continuation` semantics and mark old task as superseded.

### Layer 3: Resume eligibility

When old continuation tries to resume later, check whether it has been superseded.

If superseded, block automatic continuation.

## State model

Recommended state file:

- `.sisyphus/task-handoff-state.json`

Suggested fields:

```json
{
  "version": 1,
  "active_task": {
    "session_id": "ses_xxx",
    "task_id": "task_xxx",
    "goal": "Refactor payment API flow",
    "status": "active",
    "allow_resume": true,
    "resume_signals": ["todo", "run-continuation"],
    "updated_at": "2026-04-12T12:00:00+08:00"
  },
  "superseded_tasks": []
}
```

## Implementation phases

### Phase 1: MVP

- add handoff preflight on `/handoff`
- display old task summary
- require user decision
- write local task handoff state

### Phase 2: Resume guard

- check superseded state before resuming older continuation
- block automatic resume when old task is no longer valid

### Phase 3: Optional prompt-level integration

- detect likely task switching even outside `/handoff`
- keep this optional because false positives are risky

## Non-goals

- building a new task database
- building a generic scheduler
- replacing oMo todo continuation
- doing aggressive auto-classification in v1

## Acceptance criteria

The design is successful if:

1. starting a new task no longer silently revives old work later
2. old task state is visible before handoff
3. user chooses the handoff outcome explicitly
4. old continuation can be blocked when superseded
