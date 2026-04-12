# Project goal and principles

Ultimate goal:

- optimize for helping AI reach goals faster, more accurately, and more reliably
- do not optimize for code implementation volume by default

Project principle:

- prefer planning, summarization, navigation, and decision support over code generation
- avoid writing heavy code when a lighter planning or structure-first solution is sufficient
- do not add code just to simulate completeness

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

AI-first repo-nav rule:

- prefer `.repo-nav/` as the first navigation layer for AI search tasks
- use repo-nav to narrow search scope before broad codebase search
- do not skip repo-nav unless it is missing, stale, or insufficient

Repo-nav layering rule:

- `.repo-nav/` is the project-local navigation artifact
- `repo-nav-tooling/` is the tooling module that defines schema, templates, and update commands
- do not mix tooling and artifact content together

Root `README.md` rule:

- keep only project introduction, purpose, and module overview
- add links to submodule READMEs as the primary navigation path
- do not turn root `README.md` into the detailed spec or design document
