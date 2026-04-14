# Continuation Switch Flow

## Problem flow

1. an older execution flow remains resumable
2. a newer user goal appears
3. the system does not clearly separate the old flow from the new one
4. older continuation may resume later and interfere with newer work

## Desired behavior

When a new message likely represents a task switch:

- inspect whether older resumable work still exists
- surface that fact explicitly
- avoid silently reviving stale work
- preserve uncertainty when switch detection is not confident

## Non-goal

This module should not assume `/handoff` is the only or primary trigger.

The real target is task/continuation switching in general.
