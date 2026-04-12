# Summary

## What this module is

This is a design module for a **Task Handoff Guard**.

## What it is not

It is **not**:

- a full task management system
- a replacement for oMo continuation
- a new scheduler

## Main conclusion

OpenCode + oMo already has strong continuation features.

What is missing is a reliable user-controlled handoff checkpoint between:

- older resumable work
- newer intended work

## Recommended direction

Build a thin guard that integrates with existing oMo mechanisms.

Best integration path:

1. intercept `/handoff`
2. inspect active continuation markers and resume info
3. show old task summary to the user
4. require explicit choice
5. mark old task as stopped or superseded when necessary

## Most important rule

Do not guess task ownership.
Do not silently revive older work when a newer task may have superseded it.

## Preferred product behavior

When a new task begins and older resumable work exists, the system should ask:

- continue old task?
- stop old task and start new task?
- keep both (high risk)?

That explicit handoff is the core behavior this module is trying to formalize.
