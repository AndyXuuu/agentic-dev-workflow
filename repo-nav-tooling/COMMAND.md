# /rnt Command

This module defines the intended command surface for repo-nav tooling.

## Goal

Provide one short command for managing `.repo-nav/` navigation artifacts.

## Command

### Local command

```bash
repo-nav-tooling/commands/rnt -r
repo-nav-tooling/commands/rnt -u
repo-nav-tooling/commands/rnt -c
repo-nav-tooling/commands/rnt -d
repo-nav-tooling/commands/rnt -d <target>
```

### Intended slash-command shape

```text
/rnt -r
/rnt -u
/rnt -c
/rnt -d
/rnt -d <target>
```

## Meaning

- `-r` → rebuild navigation info
- `-u` → update navigation info
- `-c` → correct navigation info by rescanning and rewriting
- `-d` → delete generated navigation info, or delete one specific target if given

## Scope

This command is for `.repo-nav/` artifact management only.

It should:

- rebuild
- update
- correct
- delete

It should not mutate unrelated modules.

## Notes

- `.repo-nav/` is the artifact
- `repo-nav-tooling/` is the tool
- `/rnt` is the intended oMo/OpenCode command surface for navigation management
