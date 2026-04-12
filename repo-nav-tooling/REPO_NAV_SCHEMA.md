# Repo-Nav-First Schema

This document defines a reusable, project-agnostic knowledge index schema for AI-assisted software engineering.

The goal is not to replace code search. The goal is to provide an AI-first navigation layer that makes search tasks faster, more accurate, and more stable before broad search.

## Core principle

Use `.repo-nav/` as a first-stop navigation layer.

Recommended search order:

1. `.repo-nav/index.yaml`
2. Then one of:
   - `.repo-nav/docs.yaml`
   - `.repo-nav/modules.yaml`
   - `.repo-nav/workflows.yaml`
3. If insufficient or stale, fall back to normal search:
   - `read`
   - `grep`
   - `glob`
   - `LSP`

Codebase truth wins over index content.

## Scope

This schema is designed for stable AI navigation knowledge:

- document entrypoints
- module ownership and entrypoints
- workflow starting points
- verification paths
- explicit unknowns and missing evidence

It is not primarily a human-oriented documentation layer.
It should avoid unstable implementation details that change frequently.

## Required files

```text
.repo-nav/
  index.yaml
  docs.yaml
  modules.yaml
  workflows.yaml
```

Optional extensions:

```text
.repo-nav/
  glossary.yaml
  decisions.yaml
  entrypoints.yaml
  templates/
```

## File responsibilities

### `index.yaml`

Top-level navigation entry.

Should answer:

- what this knowledge index is
- how to use it
- which sub-index files exist
- what the current unknowns are

### `docs.yaml`

AI-facing document and knowledge-entry map.

Should answer:

- which knowledge entries exist
- what each entry is about
- which modules/workflows each entry is related to
- which entries are uncertain or temporary

### `modules.yaml`

Code/module map.

Should answer:

- which modules exist
- what each module is for
- where the stable entrypoints are
- which areas inside a module matter
- what is still unclear

### `workflows.yaml`

Task navigation map.

Should answer:

- for a given engineering task, where to start
- what to inspect next
- what to verify
- what is still unclear

## Generic fields

### Common conventions

- prefer stable path references over detailed implementation notes
- prefer engineering workflow names over product-specific feature names
- use `unknowns` whenever something is not yet proven
- use `missing_evidence` whenever a conclusion is partial
- do not guess

## `index.yaml` schema

Required:

- `version`
- `project`
- `type`
- `usage`
- `entrypoints`

Recommended:

- `project_entrypoints`
- `unknowns`

## `docs.yaml` schema

Each document item should prefer:

- `id`
- `title`
- `path`
- `topics`

Optional:

- `related_modules`
- `related_workflows`
- `unknowns`
- `notes`

## `modules.yaml` schema

Each module item should prefer:

- `id`
- `path`
- `purpose`
- `entrypoints`

Optional:

- `areas`
- `related_docs`
- `unknowns`
- `notes`

Use `areas` as the general nested field instead of hard-coding names like `subdomains` or `submodules`.

## `workflows.yaml` schema

Each workflow item should prefer:

- `id`
- `goal`
- `start_with`
- `inspect`

Optional:

- `related_modules`
- `verify`
- `unknowns`
- `notes`
- `missing_evidence`

## Workflow naming guidance

Prefer names like:

- `bootstrap-project`
- `user-and-auth-change`
- `payment-and-order-change`
- `deployment-and-runtime-change`
- `messaging-and-events`
- `admin-backoffice-change`
- `provider-adapter-change`
- `artifact-and-image-spec-change`

Avoid naming workflows too tightly to one product feature unless there is no useful generic engineering name.

## Unknowns policy

When evidence is incomplete:

- list `unknowns`
- list `missing_evidence`
- do not fill gaps by guesswork

This policy is part of the schema, not optional style guidance.

## Success criteria

A good knowledge index should help answer these quickly:

- Where should I start reading?
- Which module likely owns this area?
- Which docs are relevant?
- Which workflow best matches this task?
- What still remains unclear?

If it cannot answer those, the index is too vague or too detailed.
