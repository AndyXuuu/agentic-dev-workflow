# Personal Software Engineering Agent Environment

中文手册：[使用手册.md](./使用手册.md)

This directory contains a personal Codex setup for disciplined software engineering work. It is intentionally outside project repositories and should not be committed to product code.

## Purpose

The environment separates software work into clear roles:

- PRD / requirement analysis
- Architecture and design
- Development
- Testing and regression verification
- Delivery review

The global environment is project-independent. Role Skills own delivery stages,
domain Skills own reusable frontend/backend practices, and each target project's
`AGENTS.md` plus thin adapter Skills own project-specific stacks, paths, commands,
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
  ax-pipeline/
  ax-prd/
  ax-arch/
  ax-dev/
  ax-test/
  ax-review/
  ax-frontend/
  ax-backend/
  ax-project-adapter/
  ax-structure-review/
  tapd-query/
state/
  project-adapter-registry.json
templates/
  PRD.md
  DESIGN.md
  TEST_PLAN.md
  DELIVERY.md
bin/
  install.sh
  install-tapd-mcp.sh
  apply-global-agent.sh
  uninstall.sh
```

## Install

Run:

```bash
$HOME/Documents/codex/engineering/bin/install.sh
```

This creates symlinks for the Skills listed in `bin/install.sh`:

- `~/.agents/skills/*` -> this directory's skills
- `~/.codex/arch.config.toml`
- `~/.codex/dev.config.toml`
- `~/.codex/test.config.toml`
- `~/.codex/review.config.toml`

It does not overwrite `~/.codex/AGENTS.md`. Instead, it installs:

```text
~/.codex/AGENTS.engineering.md
```

If you want these rules globally, merge that file into `~/.codex/AGENTS.md`.

To keep the global rules synchronized with this repository, run:

```bash
$HOME/Documents/codex/engineering/bin/apply-global-agent.sh
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

Adapted repositories and their top-level standard revision status are recorded in
`state/project-adapter-registry.json`. Update that single local registry whenever an
adapter is created, moved, refreshed, or reviewed after a global rule change.

All AX Skills use lowercase hyphenated names. The installer removes obsolete
underscore-named symlinks; update saved prompts to use names such as
`$ax-pipeline`, `$ax-frontend`, and `$ax-project-adapter`.

For read-only TAPD story and bug queries, install the MCP server from an
interactive terminal:

```bash
$HOME/Documents/codex/engineering/bin/install-tapd-mcp.sh
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
