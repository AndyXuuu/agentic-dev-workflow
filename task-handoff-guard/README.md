# Task Handoff Guard

This module is a design workspace for preventing stale oMo continuation from unexpectedly resuming old work and conflicting with newer tasks.

## Goal

Add a thin guard layer on top of existing OpenCode + oh-my-opencode continuation features.

The module is intentionally **not** a new task system. It is a:

- task conflict guard
- continuation handoff guard
- resume eligibility check layer

## Core idea

Before a new task begins, detect whether an older task is still resumable.

If an older task is still active, show the user:

- what the old task is
- which continuation signals are active
- what actions are available

Then let the user choose whether to:

1. continue the old task
2. stop the old task and start the new one
3. keep the old task state and continue the new task anyway (high risk)

## Why this exists

Current oMo continuation features are strong enough to revive older work later.

That is useful for unfinished tasks, but risky when:

- multiple goals overlap
- the user changes direction
- old continuation resumes after newer code changes

## Related docs

- `PLAN.md`
- `INCIDENT.md`
- `SUMMARY.md`
