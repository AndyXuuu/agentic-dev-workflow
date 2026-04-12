# Hook-Ready Usage Sketch

This is not a running plugin yet.

It shows how the MVP skeleton can be integrated with real oMo extension points.

## Intended entrypoint

The preferred MVP entrypoint is:

- `command-execute-before`

Specifically:

- intercept `/handoff`
- inspect continuation marker state
- inspect task resume info
- inspect local handoff state file
- request explicit user choice if older resumable work exists

## Expected adapter responsibilities

The integration layer must provide:

- continuation marker read
- resume info read
- stop continuation action
- user confirmation prompt
- a way to append an informational message to command output

Note:

- public local type evidence clearly exposes `StopContinuationGuard.stop(sessionID)`
- continuation marker details are available conceptually, but full runtime state access may still need a small wrapper around existing oMo internals

## Why this is the right MVP

- it integrates with existing user intent (`/handoff`)
- it avoids trying to classify every new prompt
- it reuses existing oMo continuation mechanisms
- it gives control back to the user before stale work resumes later

## Not included yet

- direct binding to a real oMo plugin object
- actual prompt UI implementation
- resume-time interception hook wiring
- tests

Those are the next implementation layer after this sketch.
