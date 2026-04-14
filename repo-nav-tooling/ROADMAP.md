# Repo Nav Tooling Roadmap

This document captures the evolution principles for `repo-nav-tooling`.

## Core principle

Optimize for helping AI search tasks become:

- faster
- more accurate
- more stable

Do not optimize for implementation complexity by default.

## What to do next

### 1. Improve generated entry quality

Priority:

- `modules.generated.yaml`
- `docs.generated.yaml`

Focus on:

- better entrypoint selection
- more stable ordering
- higher-signal file inclusion

### 2. Keep generated-only boundaries strict

- `.repo-nav/` should stay generated-only
- `repo-nav-tooling/` should stay tooling-only
- do not mix hand-written artifact content back into `.repo-nav/`

### 3. Keep command semantics simple

Preserve the short command surface:

- `-r`
- `-u`
- `-c`
- `-d`

Add new actions only when they directly improve navigation artifact management.

### 4. Preserve fallback discipline

The generated repo-nav artifact should remain a first-stop navigation layer.
It must not become a replacement for:

- `read`
- `grep`
- `glob`
- `LSP`

## What not to do

### 1. Do not turn repo-nav-tooling into a heavy knowledge system

Avoid evolving it into:

- a project wiki
- a semantic knowledge base
- a design archive
- a source-of-truth layer above code

### 2. Do not auto-generate high-confidence workflow intelligence too early

Avoid premature generation of:

- best modification path
- cross-module dependency reasoning
- task-specific change recommendations

These are higher-risk than simple navigation entrypoints.

### 3. Do not prefer code complexity over information quality

If a lighter structural improvement solves the problem, prefer it over writing more logic.

## What to delay

### 1. Richer workflow generation

Improve `workflows.generated.yaml` only after module/doc entry quality is strong.

### 2. Deeper module summaries

Only add richer summaries when they remain stable and low-risk.

### 3. Real `/rnt` slash-command integration

Delay direct OpenCode/oMo integration until local command semantics are stable.

### 4. Integration with continuation-switch-guard

Keep this as a later cross-module optimization, not a first-order requirement.

## Decision filter

Before adding a new capability, ask:

1. Does this make AI find the correct starting point faster?
2. Does this reduce or increase the risk of misleading AI?
3. Does this improve information quality, or only add implementation complexity?
4. If this feature is wrong, can AI still safely fall back to normal search?

If the answer is weak on these questions, do not implement the feature yet.
