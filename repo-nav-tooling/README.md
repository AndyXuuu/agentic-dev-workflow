# Repo Nav Tooling

This module contains the tooling side of the repo-nav system.

It is not the project-local navigation artifact itself.

## This module contains

- schema definition
- templates
- command entrypoints

## The actual project artifact

The actual per-project navigation artifact should live in:

- `.repo-nav/`

That separation keeps the tool and its generated/curated artifact from being mixed together.
