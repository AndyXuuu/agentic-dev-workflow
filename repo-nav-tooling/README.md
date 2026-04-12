# Repo Nav Tooling

This module contains the tooling side of the repo-nav system.

It is not the project-local navigation artifact itself.

## This module contains

- schema definition
- templates
- command entrypoints

## Main command

Use:

```bash
repo-nav-tooling/commands/rnt -r
repo-nav-tooling/commands/rnt -u
repo-nav-tooling/commands/rnt -c
repo-nav-tooling/commands/rnt -d
```

Short flags:

- `-r` rebuild
- `-u` update
- `-c` correct
- `-d` delete

See also:

- `repo-nav-tooling/COMMAND.md`

## The actual project artifact

The actual per-project navigation artifact should live in:

- `.repo-nav/`

That separation keeps the tool and its generated artifact from being mixed together.

## Generated artifact model

`.repo-nav/` should contain generated artifact files only, for example:

- `.repo-nav/index.generated.yaml`
- `.repo-nav/docs.generated.yaml`
- `.repo-nav/modules.generated.yaml`
- `.repo-nav/workflows.generated.yaml`
- `.repo-nav/state.json`
- `.repo-nav/summary.json`

It should not be used as a hand-written documentation space.
