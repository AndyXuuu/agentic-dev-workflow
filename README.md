# Agentic Development Workflow

中文手册：[使用手册.md](./docs/使用手册.md)

能力路线图：[ROADMAP.md](./docs/ROADMAP.md)

模型路由速查：[MODEL_ROUTING.md](./docs/MODEL_ROUTING.md)

TAPD MCP 安装指南：[TAPD-MCP安装指南.md](./docs/TAPD-MCP安装指南.md)

> This README is a non-normative overview. `AGENTS.md` owns global engineering gates; an explicitly
> invoked Skill owns its task-specific workflow. Examples here must not override either source.

> A project-independent engineering governance and delivery framework for AI coding agents.

This repository turns Codex from an isolated code generator into an accountable participant
in a software delivery system. It operationalizes requirement discipline, explicit architecture
ownership, risk-tiered change control, business acceptance, delivery review, and safe repository
operations.

The framework is maintained as a personal global engineering environment, while every project
remains independently understandable and executable. Global workflows provide reusable governance;
project repositories retain authority over their technology stack, contracts, commands, business
rules, and release constraints.

## Purpose

The framework is designed to make Agent-assisted development:

- **Governed** — classify risk before editing and apply proportionate delivery gates.
- **Evidence-led** — separate user goals from technical premises, verify current state, and recommend
  no change when it is better.
- **Assumption-disciplined** — resolve material assumptions as verified facts, explicit user decisions,
  or removed dependencies before they reach implementation, business acceptance, canonical docs, or archives.
- **Terminology-stable** — register behavior-relevant concepts before functional requirements and map
  translations or code identifiers without letting synonyms fork the object model.
- **Security-bounded** — preserve mandatory baselines while preventing unrequested guarantee or complexity
  escalation.
- **Traceable** — connect requirements, design decisions, code, and business acceptance evidence.
- **Locally understandable** — give each behavior a clear Owner, boundary, and verification path.
- **Recoverable** — preserve user work, expose risk, and define rollback or recovery when needed.
- **Project-independent** — reuse engineering methods without leaking product-specific rules into the global layer.

## License

The original work in this repository is licensed under the Apache License, Version 2.0. See
[`LICENSE`](./LICENSE) for the complete terms. Third-party dependencies and integrations retain
their own licenses; review the relevant notices before redistribution.

## Responsibilities

Software delivery is separated into explicit responsibilities:

- PRD / requirement analysis
- Architecture and design
- Development
- Business acceptance and verification
- Delivery review

The global environment is project-independent. Lifecycle Skills own delivery stages, discipline
Skills own reusable engineering practices, repository Skills own source-control and project-adoption
workflows, and integration Skills own external tool access. Each target project's `AGENTS.md` plus
thin adapter Skills own project-specific stacks, paths, commands, contracts, and business constraints.

## Layout

```text
README.md
docs/
  使用手册.md
  ROADMAP.md
  MODEL_ROUTING.md
  TAPD-MCP安装指南.md
profiles/
  arch.config.toml
  dev.config.toml
  review.config.toml
skills/
  catalog.tsv
  lifecycle/
    ax-pipeline/
    ax-prd/
    ax-arch/
    ax-dev/
    ax-review/
  disciplines/
    ax-frontend/
    ax-backend/
    ax-structure-review/
    agent-workflow-measurement/
  repository/
    git-workflow/
    ax-sdd/
    ax-project-bootstrap/
    ax-project-adapter/
  integrations/
    tapd-query/
    omp-question-first/
templates/
  PRD.md
  DESIGN.md
  DELIVERY.md
scaffolds/
  catalog.tsv
  admin-dashboard/
    AGENTS.md
    README.md
bin/
  create-admin-dashboard.sh
  install.sh
  validate-scaffolds.sh
  validate-skills.sh
  install-tapd-mcp.sh
  apply-global-agent.sh
  uninstall.sh
```

## Standalone Scaffolds

- Canonical registry: [`scaffolds/catalog.tsv`](./scaffolds/catalog.tsv). New-project Agents use
  `$ax-project-bootstrap` to select only registered scaffolds.
- [Admin Dashboard Scaffold](./scaffolds/admin-dashboard/README.md) — independently installable
  React administration workspace.

Create a verified copy at any non-existing target directory:

```bash
./bin/create-admin-dashboard.sh /path/to/new-admin-project
```

The generator refuses to overwrite an existing path, validates the copy in a temporary sibling
directory, and only exposes the final target after validation succeeds.

## Domain SDD

`$ax-sdd` is an opt-in project capability for maintaining one current Domain SDD that helps Agents
load the smallest complete domain context. It defines the document model and editing rules only:

- inspect `sdd/index/domains.json` to match one Domain;
- read that Domain's Metadata, PRD, SPEC, Logic Flow, Test Flow, Dictionary terms, direct technical
  dependencies, Requirements, and Acceptance Boundaries;
- update canonical Domain documents directly and keep traceability and projections consistent;
- use the project's existing validation commands when the project provides them.

An adopted Domain SDD replaces, rather than duplicates, each previous canonical document inside its
declared boundary. Migration remains draft until old handwritten copies are retired, linked, or made
checked generated projections. Source code and runtime evidence remain implementation/evidence.

`ax-sdd` provides no CLI, generator, context command, validator, or bundler. It does not replace
`$ax-pipeline`, store proposal or task instances, archive implementation history, or claim that
document inspection proves implementation behavior.

## Install

Run:

```bash
$HOME/Documents/codex/agentic-dev-workflow/bin/install.sh
```

This creates symlinks for the Skills registered in `skills/catalog.tsv` and links the `arch`, `dev`,
and `review` profiles. It also installs `~/.codex/AGENTS.agentic-dev-workflow.md` without overwriting
`~/.codex/AGENTS.md`.

Before changing symlinks, the installer runs `bin/validate-skills.sh` and the structural mode of
`bin/validate-scaffolds.sh`. They verify catalog uniqueness and coverage, module paths, Skill
frontmatter, UI metadata, and scaffold registry paths.

To make these rules the active global rules, run:

```bash
$HOME/Documents/codex/agentic-dev-workflow/bin/apply-global-agent.sh
```

The script links `~/.codex/AGENTS.md` to this repository's `AGENTS.md`, backing up an existing
non-empty file or different symlink first. To roll back, remove the symlink and restore the reported
backup.

`bin/uninstall.sh` removes only links installed by this repository and preserves unrelated global
rules and `AGENTS.md.backup.*` files.

## Usage

From any project:

```bash
codex -p arch --cd /path/to/project
codex -p dev --cd /path/to/project
codex -p review --cd /path/to/project
```

For an end-to-end change, use one primary workflow:

```text
$ax-pipeline
  -> routes $ax-frontend and/or $ax-backend in supporting mode
  -> consumes the accepted business contract and its project-owned acceptance evidence
  -> completes delivery review when the boundary requires it
```

When intentionally working stage by stage, use `$ax-prd` -> `$ax-arch` -> `$ax-dev` plus the affected
domain Skill -> acceptance from the accepted Spec/Test Flow or project contract -> `$ax-review`.
`$ax-structure-review` remains an optional, explicitly requested structure audit.

For a project that explicitly adopts Domain SDD, use `$ax-sdd` in supporting mode to route a Domain,
review the current Spec, manage the temporary Change Delta/Todo context, and reconcile the final
current artifacts. Domain SDD does not provide a validator, generator, CLI, export command, or
second lifecycle; use the project's existing SDD/projection validation entrypoint when required.

To generate or refresh a thin project-specific adapter Skill:

```text
$ax-project-adapter Inspect this repository and generate its project adapter skill.
```

The generated adapter contains only project navigation and project-specific constraints. Global
engineering gates and reusable domain workflows stay in this repository's global rules and Skills.

For an OMP build that supports `conversation.questionFirst`, use the optional runtime adapter:

```text
$omp-question-first Check compatibility and install the reversible launcher.
```

If `.local.env` contains `TAPD_ACCESS_TOKEN` or `TAPD_KEY`, the installer configures
the MCP process to load that ignored project-local file dynamically without copying the
token into Codex configuration. Otherwise, the token is entered without terminal echo
and stored only in the Codex user MCP configuration. Then restart Codex / ChatGPT and use:

The launcher uses a temporary OMP config overlay and does not modify global OMP configuration.

For project-independent local commits and remote synchronization, use `$git-workflow`.
For read-only TAPD story and bug queries, install the MCP server with
`bin/install-tapd-mcp.sh` and use `$tapd-query`.

## Operating Rule

Apply the evidence and engineering-judgment gate in `AGENTS.md` before accepting a technical
premise or proposed solution. Use Fast Path for explicit, localized, low-risk changes. Use PRD and
design gates only when the change does not meet every Fast Path condition, and route only confirmed
risk boundaries. Business acceptance remains owned by the project's canonical contract or adopted
Domain SDD; this repository does not provide a separate code-test planning Skill.
