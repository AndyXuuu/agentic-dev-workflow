# Task Handoff Guard Flow

## Main user flow

### Trigger

The preferred trigger is before `/handoff` executes.

### Step 1: Preflight inspection

Collect:

- current session id
- active continuation markers
- todo continuation signals
- task resume info
- local task handoff state

### Step 2: Conflict check

If no active older task is resumable:

- allow handoff immediately

If an older task is still resumable:

- show old task summary
- ask user for explicit handoff decision

### Step 3: User confirmation

Suggested prompt:

```text
Detected resumable older work.

Old task:
- Goal: <summary>
- Session: <id>
- Signals: <signals>

Choose:
1. Continue old task
2. Stop old task and start new task
3. Keep old task resumable and continue new task anyway (high risk)
```

### Step 4: Apply decision

#### Option 1: Continue old task

- abort new handoff
- keep current continuation state
- update task handoff state as still active

#### Option 2: Stop old task and start new task

- invoke stop-continuation semantics
- mark old task as superseded/stopped
- create new active task state
- continue with handoff

#### Option 3: Keep old task and continue new task anyway

- record conflict decision
- allow handoff to continue
- preserve warning state for future resume checks

## Resume flow

### Trigger

When a prior task attempts to resume through continuation or recovery.

### Step 1: Read state

Read local task handoff state.

### Step 2: Eligibility check

If task is:

- active and not superseded -> allow resume
- superseded -> block resume
- explicitly stopped -> block resume
- unknown -> require conservative handling

### Step 3: Conservative behavior

If state is ambiguous:

- do not silently resume
- emit an informative message
- require explicit user action to continue

## Failure-safe rule

When state is inconsistent or evidence is missing:

- do not guess
- do not silently revive old work
- prefer explicit user confirmation
