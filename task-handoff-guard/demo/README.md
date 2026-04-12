# Task Handoff Guard Demo

This is a zero-dependency Node.js demo for validating the handoff interaction before wiring into real oMo hooks.

## What it demonstrates

- detection of resumable older work
- explicit user choice before starting a new task
- stop-and-supersede behavior
- high-risk parallel continuation behavior
- local state persistence

## Run

```bash
node task-handoff-guard/demo/cli.mjs new-session "Implement new task"
```

Hook-shape demo:

```bash
node task-handoff-guard/demo/hook-ready-demo.mjs /handoff new-session "Switch to new task"
```

Resume guard demo:

```bash
# seed a superseded task
node task-handoff-guard/demo/resume-guard-demo.mjs seed-superseded old-session

# test whether it can resume
node task-handoff-guard/demo/resume-guard-demo.mjs check old-session
```

## State file

The demo writes local state to:

```text
.tmp/task-handoff-state.json
```

This file is only for the demo flow and is not part of the intended final oMo integration path.

## Why this demo exists

Before integrating with real oMo hooks, it is useful to validate:

- whether the handoff confirmation is understandable
- whether the three choices are the right ones
- whether the state model is sufficient

The `hook-ready-demo.mjs` script goes one step further and simulates a `/handoff` pre-command interception shape.

The `resume-guard-demo.mjs` script simulates resume-time denial for superseded or stopped tasks.
