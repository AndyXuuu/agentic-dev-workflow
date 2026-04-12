# Repo-nav-first

Before broad repo search, read:

1. `.repo-nav/index.generated.yaml`
2. Then one of:
   - `.repo-nav/docs.generated.yaml`
   - `.repo-nav/modules.generated.yaml`
   - `.repo-nav/workflows.generated.yaml`

Use `.repo-nav/` as navigation only.
If insufficient or stale, fall back to normal search (`read`, `grep`, `glob`, `LSP`).
Codebase truth wins over index content.

Repo-nav layering rule:

- `.repo-nav/` is the project-local navigation artifact
- `repo-nav-tooling/` is the tooling module that defines schema, templates, and update commands
- do not mix tooling and artifact content together

Root `README.md` rule:

- keep only project introduction, purpose, and module overview
- add links to submodule READMEs as the primary navigation path
- do not turn root `README.md` into the detailed spec or design document
