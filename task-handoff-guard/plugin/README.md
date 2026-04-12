# Task Handoff Guard Plugin Scaffold

This directory is a **plugin scaffold**, not a finished plugin.

## Purpose

It exists to bridge the gap between:

- the design module in `task-handoff-guard/`
- the MVP skeleton in `task-handoff-guard/mvp/`
- a future real oMo/OpenCode plugin implementation

## What it currently does

- defines a package boundary
- defines TypeScript-level plugin-facing types
- defines a `createTaskHandoffGuardPlugin(...)` scaffold
- bridges plugin-level input into the existing `mvp/integration.ts` handoff flow
- exposes a real preflight path for `/handoff` at the scaffold level
- exposes a minimal API around `StopContinuationGuard`

## What it does not do yet

- read real continuation state from oMo
- read real task resume info from oMo
- show real confirmation prompts
- persist or reconcile real task handoff state
- block real resume hooks

More precisely, the scaffold now expects those capabilities to be injected by an adapter.
It still does not ship a production adapter.

## Why this still matters

This scaffold gives the project a stable implementation landing zone.
Future work can replace placeholders with real integration logic without changing the package shape.

## Expected future wiring

1. inject real continuation-state reader
2. inject real task-resume-info reader
3. inject prompt/confirm adapter
4. connect to command-execute-before
5. connect to resume-time hook/guard path
