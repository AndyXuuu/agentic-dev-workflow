# Knowledge Module

This directory is the project knowledge index module.

Its purpose is to give agents and humans a stable first-stop navigation layer before broad repository search.

## Intended usage order

1. Read `knowledge/index.yaml`
2. Follow the relevant index file:
   - `knowledge/docs.yaml`
   - `knowledge/modules.yaml`
   - `knowledge/workflows.yaml`
3. Only then expand into broad `grep` / `glob` / `read` / `LSP` search when the index is incomplete, stale, or insufficient.

## Scope

This module should contain stable, high-value project knowledge:

- important docs
- module ownership and entrypoints
- workflow entrypoints
- document-to-code mapping
- verification paths

This module should avoid unstable implementation details that change frequently.
