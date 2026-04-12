# Implementation Notes

This document maps the Task Handoff Guard design to concrete local oMo/OpenCode extension points found in the installed package.

## Local evidence used for the design

### Stop-continuation guard

Evidence:

- `~/.cache/opencode/packages/node_modules/oh-my-opencode/dist/hooks/stop-continuation-guard/hook.d.ts`

Why it matters:

- confirms there is already a session-level continuation stop mechanism
- supports the idea that a guard should reuse existing stop semantics rather than invent a second stopping model

## Continuation state

Evidence:

- `~/.cache/opencode/packages/node_modules/oh-my-opencode/dist/features/run-continuation-state/types.d.ts`
- `~/.cache/opencode/packages/node_modules/oh-my-opencode/dist/features/run-continuation-state/constants.d.ts`

Observed clue:

- continuation marker state exists under `.sisyphus/run-continuation`
- marker model includes sources such as `todo` and `stop`
- states include `idle`, `active`, and `stopped`

Why it matters:

- the guard can inspect existing continuation markers instead of maintaining a parallel truth source for continuation status

## Task resume information

Evidence:

- `~/.cache/opencode/packages/node_modules/oh-my-opencode/dist/hooks/task-resume-info/hook.d.ts`

Why it matters:

- confirms there is already a mechanism for retaining task-resume context from prior tool execution
- this is the best source for showing the user what old work might resume

## Pre-command interception

Evidence:

- `~/.cache/opencode/packages/node_modules/oh-my-opencode/dist/plugin/command-execute-before.d.ts`

Why it matters:

- confirms a clean pre-execution interception point exists
- this is the preferred MVP insertion point for checking task conflicts before `/handoff`

## Built-in command alignment

Evidence:

- `~/.cache/opencode/packages/node_modules/oh-my-opencode/dist/features/builtin-commands/types.d.ts`

Observed clue:

- built-in command names include `handoff` and `stop-continuation`

Why it matters:

- the guard can integrate with existing user behavior instead of requiring a brand-new control surface

## Continuation-related hooks already active in the ecosystem

Evidence:

- `~/.cache/opencode/packages/node_modules/oh-my-opencode/dist/hooks/index.d.ts`
- `~/.cache/opencode/packages/node_modules/oh-my-opencode/dist/index.js`

Observed clue:

- `todo-continuation-enforcer`
- `task-resume-info`
- `stop-continuation-guard`
- `compaction-todo-preserver`
- `preemptive-compaction`
- `auto_resume`

Why it matters:

- confirms the problem is not “missing task persistence”
- confirms the design should be a handoff/guard layer, not a replacement task engine

## Recommended implementation order

### MVP

Implement a pre-command guard for `/handoff`:

1. read continuation marker state
2. read task resume info
3. read local task handoff state file
4. if resumable old work exists, show a choice prompt
5. on “stop old task and start new task”, invoke stop-continuation semantics and mark old task superseded

### Second step

Add resume-time protection:

1. when continuation attempts to resume
2. read task handoff state
3. if task is `superseded` or `stopped`, deny auto-resume

### Third step

Optional prompt-level integration:

- detect likely task switches even when `/handoff` is not used
- this should be delayed because false positives are expensive

## State ownership rule

Use existing oMo continuation state for:

- whether continuation exists
- whether stop markers exist
- what resume signals are active

Use local task handoff state for:

- user handoff decisions
- which task is currently primary
- which old tasks were superseded on purpose

## Risks and cautions

### Risk 1: Duplicate state authority

Do not treat the local task handoff state as a replacement for continuation marker truth.

### Risk 2: Over-eager intent classification

Do not auto-detect “new task” aggressively in v1.
Use `/handoff` interception first.

### Risk 3: Silent fallback

If state is ambiguous, the guard must not silently choose continuation behavior.

### Risk 4: Guessing ownership

If the old task summary is weak or incomplete, present uncertainty to the user.
Do not pretend the system knows more than it does.

## Current unknowns

These are still not proven and should not be guessed:

- the exact runtime shape of `command-execute-before` interception behavior in a custom plugin implementation
- the exact best hook point for resume-time denial without unintended side effects
- whether built-in handoff logic already injects assumptions that must be neutralized first
- whether user confirmation can be implemented directly through existing prompt utilities or needs a small wrapper

## Decision summary

The current evidence strongly supports this path:

- integrate with built-in `/handoff`
- use pre-command interception
- reuse `StopContinuationGuard`
- inspect continuation markers
- maintain a thin local task handoff state
- avoid building a second task system
