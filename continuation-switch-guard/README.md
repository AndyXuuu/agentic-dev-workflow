# Continuation Switch Guard

This module tracks a project-specific problem:

> oMo can keep older resumable work alive long enough that newer work gets interrupted, resumed over, or partially overwritten later.

## Current interpretation

The real issue is not manual handoff itself.

The real issue is:

- continuation switching
- stale resumable work
- overlapping task flows
- insufficient boundary control when intent changes

## Goal

Define the problem clearly enough that future implementation work stays focused on:

- detecting task/continuation switches
- exposing stale resumable work
- preventing silent resume of superseded work

## Non-goals

This module is not:

- a new task system
- a scheduler
- a permanent implementation workspace for generic oMo framework code

Generic implementation patterns should live in `omo-scaffold/`.

## Related docs

- `INCIDENT.md`
- `PLAN.md`
- `FLOW.md`
- `SUMMARY.md`
