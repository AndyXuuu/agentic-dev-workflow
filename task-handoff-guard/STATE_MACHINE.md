# Task Handoff Guard State Machine

## Core states

### Task states

- `active`
- `stopped`
- `superseded`
- `unknown`

### Continuation states

- `none`
- `idle`
- `active`
- `stopped`

## State meanings

### `active`

The task is the current intended task and may continue or resume.

### `stopped`

The task was explicitly halted. It must not auto-resume.

### `superseded`

The task has been replaced by a newer task. It must not auto-resume.

### `unknown`

The guard cannot determine the correct state with confidence.
This state must be treated conservatively.

## Allowed transitions

```text
none -> active
active -> stopped
active -> superseded
active -> active   (same task refreshed)
unknown -> active  (only with explicit confirmation)
unknown -> stopped (safe cleanup)
```

## Forbidden transitions

```text
superseded -> active     (without explicit user confirmation)
stopped -> active        (without explicit user confirmation)
superseded -> auto-resume
stopped -> auto-resume
```

## Decision rules

### Rule 1

Only one primary task should be `active` at a time.

### Rule 2

Starting a clearly new task should not silently preserve resume rights for the old task unless the user chooses that explicitly.

### Rule 3

If the system cannot confidently prove that an old task should resume, it must not auto-resume it.

### Rule 4

User choice beats heuristic inference.

## Conflict matrix

| Old task state | New task requested | Recommended action |
|---|---|---|
| active | yes | ask for explicit handoff choice |
| stopped | yes | continue new task |
| superseded | yes | continue new task |
| unknown | yes | require explicit confirmation |

## Resume matrix

| Stored state | Resume requested | Action |
|---|---|---|
| active | yes | allow |
| stopped | yes | deny |
| superseded | yes | deny |
| unknown | yes | deny by default, require confirmation |
