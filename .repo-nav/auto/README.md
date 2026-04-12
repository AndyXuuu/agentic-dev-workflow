# Auto-generated Knowledge Index

This directory contains generated knowledge index artifacts.

They are refreshed by:

```bash
repo-nav-tooling/commands/update-repo-nav
```

## Purpose

- keep a cheap incremental view of markdown docs
- keep a cheap incremental view of top-level modules
- avoid overwriting the hand-curated `.repo-nav/*.yaml` files

## Files

- `state.json` — internal incremental state
- `summary.json` — last update summary
- `docs.auto.yaml` — generated doc index
- `modules.auto.yaml` — generated top-level module index

The hand-written files in `.repo-nav/` remain the primary AI navigation layer.
