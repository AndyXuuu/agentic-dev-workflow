# Task Handoff Guard MVP Skeleton

This directory contains a minimal TypeScript skeleton for a future Task Handoff Guard implementation.

## Purpose

The skeleton is intentionally narrow:

- no real OpenCode/oMo hook wiring yet
- no packaging yet
- no runtime dependencies yet

It exists to make the design executable enough that future implementation work has a concrete starting point.

## Files

- `types.ts` — core state and result types
- `state.ts` — state file read/write helpers
- `decision.ts` — resumable older task detection
- `preflight.ts` — pre-handoff check and choice application
- `resume.ts` — resume eligibility check
- `adapter.ts` — placeholder interface for oMo integration
- `index.ts` — exports

## Intended next step

Connect this skeleton to a real oMo plugin hook path:

1. pre-command interception for `/handoff`
2. continuation state read from oMo
3. user confirmation prompt
4. stop-continuation integration
5. resume-time denial check
