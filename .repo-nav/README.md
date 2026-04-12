# .repo-nav Artifact

This directory is the AI-first knowledge navigation module.

Its purpose is to help AI agents search the repository faster, more accurately, and more consistently before broad repository search.

## Intended usage order

1. Read `.repo-nav/index.yaml`
2. Follow the relevant index file:
   - `.repo-nav/docs.yaml`
   - `.repo-nav/modules.yaml`
   - `.repo-nav/workflows.yaml`
   - `.repo-nav/auto/README.md` when you need generated inventory
3. Only then expand into broad `grep` / `glob` / `read` / `LSP` search when the index is incomplete, stale, or insufficient.

## Scope

This module should contain stable, high-value navigation knowledge for AI search:

- important knowledge entries
- module ownership and entrypoints
- workflow entrypoints
- document-to-code mapping
- verification paths

This module is not primarily written for humans.
It is a machine-oriented search/navigation layer and should avoid unstable implementation details that change frequently.

## Incremental update command

Run:

```bash
repo-nav-tooling/commands/update-repo-nav
```

This updates generated artifacts under `.repo-nav/auto/` without overwriting the curated files in `.repo-nav/*.yaml`.
