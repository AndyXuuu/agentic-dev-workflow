# Continuation Switch Guard Plan

## Objective

Keep this module focused on the project-specific continuation switching problem.

## Current scope

- describe the failure pattern
- describe the intended boundary behavior
- avoid overcommitting to one specific trigger such as `/handoff`

## Working direction

The likely solution space still includes:

- stale continuation detection
- switch detection
- explicit warning or guard behavior
- prevention of silent resume after intent changes

But implementation details should be treated as secondary until the problem boundary is stable.

## Constraints

- do not turn this module into a generic oMo implementation sandbox
- do not assume manual handoff is the primary long-term mechanism
- do not add code or pseudo-code that locks the design to a too-specific trigger path

## Next-step rule

If new work is added here, it should clarify:

- what counts as a switch
- what counts as stale resumable work
- what should happen when confidence is low

If the work is generic framework construction guidance, move it to `omo-scaffold/` instead.
