# Agentic Development Workflow

中文手册：[使用手册.md](./使用手册.md)

能力路线图：[ROADMAP.md](./ROADMAP.md)

> A project-independent engineering governance and delivery framework for AI coding agents.

This repository turns Codex from an isolated code generator into an accountable participant
in a software delivery system. It operationalizes practices commonly found in mature
engineering organizations: requirement discipline, explicit architecture ownership,
risk-tiered change control, behavior-driven verification, delivery review, and safe
repository operations.

The framework is maintained as a personal global engineering environment, while every
project remains independently understandable and executable. Global workflows provide
reusable governance; project repositories retain authority over their technology stack,
contracts, commands, business rules, and release constraints.

## Purpose

The objective is not to reproduce one company's internal process. It is to distill durable
engineering principles proven by large software teams into explicit, searchable, and
executable Agent workflows.

The framework is designed to make Agent-assisted development:

- **Governed** — classify risk before editing and apply proportionate delivery gates.
- **Traceable** — connect requirements, design decisions, code, tests, and delivery evidence.
- **Locally understandable** — give each behavior a clear Owner, boundary, and verification path.
- **Verifiable** — test expected behavior instead of mirroring the current implementation.
- **Recoverable** — preserve user work, expose risk, and define rollback or recovery when needed.
- **Project-independent** — reuse engineering methods without leaking product-specific rules into the global layer.

Software delivery is separated into explicit responsibilities:

- PRD / requirement analysis
- Architecture and design
- Development
- Testing and regression verification
- Delivery review

The global environment is project-independent. Lifecycle Skills own delivery stages,
discipline Skills own reusable engineering practices, repository Skills own source-control
and project-adoption workflows, and integration Skills own external tool access. Each target
project's `AGENTS.md` plus thin adapter Skills own project-specific stacks, paths, commands,
contracts, and business constraints.

Each project repository should remain independently usable: its `AGENTS.md` keeps
a minimal requirement, ownership, verification, and delivery loop for environments
where these personal global rules and `ax-*` Skills are not installed. The project
adapter remains navigation-only and must not copy the full global workflow.
When a repository already has an `AGENTS.md`, adaptation is additive only: preserve
its structure, language, project rules, and uncommitted changes, merge only missing
fallback clauses, and never replace the whole file from a template.

The intended model split is:

- `gpt-5.6-sol`: high-risk judgment, architecture, final review
- `gpt-5.6-terra`: default implementation and normal debugging
- `gpt-5.6-luna`: fast repeatable work, test scaffolding, docs, cleanup

## Layout

```text
AGENTS.md
profiles/
  arch.config.toml
  dev.config.toml
  test.config.toml
  review.config.toml
skills/
  catalog.tsv
  lifecycle/
    ax-pipeline/
    ax-prd/
    ax-arch/
    ax-dev/
    ax-test/
    ax-review/
  disciplines/
    ax-frontend/
    ax-backend/
    ax-structure-review/
  repository/
    git-workflow/
    ax-project-adapter/
  integrations/
    tapd-query/
templates/
  PRD.md
  DESIGN.md
  TEST_PLAN.md
  DELIVERY.md
bin/
  install.sh
  validate-skills.sh
  install-tapd-mcp.sh
  apply-global-agent.sh
  uninstall.sh
```

## Install

Run:

```bash
$HOME/Documents/codex/agentic-dev-workflow/bin/install.sh
```

This creates symlinks for the Skills registered in `skills/catalog.tsv`:

- `~/.agents/skills/<skill-name>` -> the registered nested Skill directory
- `~/.codex/arch.config.toml`
- `~/.codex/dev.config.toml`
- `~/.codex/test.config.toml`
- `~/.codex/review.config.toml`

Before changing symlinks, the installer runs `bin/validate-skills.sh` to verify catalog
uniqueness, module paths, Skill names, UI metadata, and catalog coverage.

It does not overwrite `~/.codex/AGENTS.md`. Instead, it installs:

```text
~/.codex/AGENTS.agentic-dev-workflow.md
```

If you want these rules globally, merge that file into `~/.codex/AGENTS.md`.

To keep the global rules synchronized with this repository, run:

```bash
$HOME/Documents/codex/agentic-dev-workflow/bin/apply-global-agent.sh
```

The script links `~/.codex/AGENTS.md` to this repository's `AGENTS.md`. An
existing non-empty file or different symlink is backed up before replacement.
Afterwards, edit this repository's `AGENTS.md` and restart Codex / ChatGPT to
reload the rules.

To roll back, remove the symlink and restore the backup reported by the script,
if one was created.

## Usage

From any project:

```bash
codex -p arch --cd /path/to/project
codex -p dev --cd /path/to/project
codex -p test --cd /path/to/project
codex -p review --cd /path/to/project
```

For explicit skill use:

```text
$ax-pipeline Analyze this feature and create PRD, design, implementation plan, tests, and delivery checklist.
```

Common flow:

```text
1. $ax-prd
2. $ax-arch
3. $ax-dev
4. $ax-frontend and/or $ax-backend (by affected domain)
5. $ax-test
6. $ax-structure-review (optional structure audit)
7. $ax-review
```

To generate or refresh a thin project-specific adapter skill from a repository's
actual architecture, owners, canonical documents, and verification commands:

```text
$ax-project-adapter Inspect this repository and generate its project adapter skill.
```

The generated adapter should contain only project navigation and project-specific
constraints. Global engineering gates and reusable domain workflows stay in this
directory's global rules and Skills.

Project adapter targets are discovered from the active repository or paths explicitly
provided for the current task. This repository does not persist machine-specific project
paths or synchronization status. When a request such as “sync all adapters” has no
unambiguous target set, provide the repository paths or a bounded parent directory when
prompted.

All AX Skills use lowercase hyphenated names. The installer removes obsolete
underscore-named symlinks; update saved prompts to use names such as
`$ax-pipeline`, `$ax-frontend`, and `$ax-project-adapter`.

For project-independent local commits and remote synchronization, use:

```text
$git-workflow Commit the intended local changes with an accurate message.
$git-workflow Safely synchronize the current branch with its upstream.
```

The Skill follows the active repository's branch policy and keeps commit and push
authorization separate. It does not embed any project's branch names or topology.

For read-only TAPD story and bug queries, install the MCP server from an
interactive terminal:

```bash
$HOME/Documents/codex/agentic-dev-workflow/bin/install-tapd-mcp.sh
```

If `TAPD_KEY` exists in `~/.zprofile`, the MCP loads it dynamically and does not
copy the token into the Codex configuration. Otherwise, the token is entered
without terminal echo and stored only in the Codex user MCP configuration. Then
restart Codex / ChatGPT and use:

```text
$tapd-query List stories and bugs for workspace 123456.
```

## Operating Rule

Use the Fast Path in `AGENTS.md` for explicit, localized, low-risk changes. Use PRD and
design gates for work that does not meet every Fast Path condition, and escalate
immediately when a risk boundary appears. Decide this before loading optional role or
domain Skills; an eligible Fast Path change uses project instructions and local Owner
navigation without loading the full `ax-dev`, `ax-frontend`, or `ax-backend` workflow.
