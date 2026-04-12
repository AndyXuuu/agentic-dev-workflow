# Adding a Plugin

## When this applies

Use this for anything that should become a reusable oMo/OpenCode plugin package or plugin-like integration unit.

## Recommended repository shape

Put plugin code in a dedicated module directory, for example:

```text
<feature-name>/plugin/
  package.json
  tsconfig.json
  src/
```

## Minimum pieces

- package boundary (`package.json`)
- source entry (`src/index.ts`)
- one clear plugin factory (`createXPlugin(...)`)
- README explaining current status:
  - scaffold only
  - hook-ready sketch
  - real implementation

## Integration guidance

Prefer this progression:

1. design docs
2. MVP skeleton
3. hook-ready sketch
4. plugin scaffold
5. real runtime integration

## Questions to answer

- What existing oMo/OpenCode hook or command does this integrate with?
- What state does it own vs reuse?
- Is it a scaffold or a real plugin?
- What is still missing?

## Do not

- claim a scaffold is already installable
- duplicate oMo state if existing continuation/command state already exists
- skip README status notes
