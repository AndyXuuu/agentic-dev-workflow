# Agentic Development Workflow

中文手册：[使用手册.md](./docs/使用手册.md)

能力路线图：[ROADMAP.md](./docs/ROADMAP.md)

模型路由速查：[MODEL_ROUTING.md](./docs/MODEL_ROUTING.md)

TAPD MCP 安装指南：[TAPD-MCP安装指南.md](./docs/TAPD-MCP安装指南.md)

> This README is a non-normative overview. `AGENTS.md` owns global engineering gates; an explicitly
> invoked Skill owns its task-specific workflow. Examples here must not override either source.

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
- **Evidence-led** — separate user goals from technical premises, verify current state,
  and recommend no change when it is better.
- **Assumption-disciplined** — resolve material assumptions as verified facts, explicit user
  decisions, or removed dependencies before they reach implementation, tests, canonical docs,
  or archives.
- **Terminology-stable** — register behavior-relevant concepts before functional requirements,
  preserve canonical user/project language, and map translations or code identifiers without
  letting synonyms fork the object model.
- **Security-bounded** — preserve mandatory baselines while tying new controls to an explicit
  threat model and preventing unrequested guarantee or complexity escalation.
- **Traceable** — connect requirements, design decisions, code, tests, and delivery evidence.
- **Locally understandable** — give each behavior a clear Owner, boundary, and verification path.
- **Verifiable** — test expected behavior instead of mirroring the current implementation.
- **Recoverable** — preserve user work, expose risk, and define rollback or recovery when needed.
- **Project-independent** — reuse engineering methods without leaking product-specific rules into the global layer.

## License

The original work in this repository is licensed under the Apache License, Version 2.0. See
[`LICENSE`](./LICENSE) for the complete terms. Third-party dependencies and integrations retain
their own licenses; review the relevant notices before redistribution.

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
README.md
docs/
  使用手册.md
  ROADMAP.md
  MODEL_ROUTING.md
  TAPD-MCP安装指南.md
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
    ax-sdd/
    ax-project-bootstrap/
    ax-project-adapter/
  integrations/
    tapd-query/
templates/
  PRD.md
  DESIGN.md
  TEST_PLAN.md
  DELIVERY.md
scaffolds/
  catalog.tsv
  admin-dashboard/
    AGENTS.md
    README.md
bin/
  create-admin-dashboard.sh
  install.sh
  validate-sdd.sh
  validate-scaffolds.sh
  validate-skills.sh
  install-tapd-mcp.sh
  apply-global-agent.sh
  uninstall.sh
```

## Standalone Scaffolds

- Canonical registry: [`scaffolds/catalog.tsv`](./scaffolds/catalog.tsv). New-project Agents use `$ax-project-bootstrap` to select only registered scaffolds.
- [Admin Dashboard Scaffold](./scaffolds/admin-dashboard/README.md) — independently installable React administration workspace with responsive navigation, dashboard analytics, resource-list patterns, theme support, and replaceable mock data boundaries.

Create a verified copy at any non-existing target directory:

```bash
./bin/create-admin-dashboard.sh /path/to/new-admin-project
```

Relative targets are resolved from the current working directory. The generator refuses to overwrite an existing path, validates the copy in a temporary sibling directory, and only exposes the final target after validation succeeds.

Agent workflow for a greenfield application:

```text
1. $ax-project-bootstrap selects a compatible registered scaffold.
2. The official generator copies the complete source and organization baseline and verifies it once.
3. $ax-project-adapter adapts the copied Agent navigation to verified project facts.
4. $ax-pipeline plans and implements business changes from the generated Owners.
```

Do not start with project-specific Agent rules and then invent an application structure to match them. If no registered scaffold is compatible, record the material mismatch and enter architecture design without creating a partial copy.

## Experimental Current-system SDD

`$ax-sdd` is an opt-in experiment for projects that want one current system definition to help an
Agent understand a task quickly and to drive an independent implementation without the original
source tree. It supports:

- initializing an explicit draft instead of pretending an empty template is complete;
- querying a validated context route for the smallest relevant Owners, Artifacts,
  Requirements/Oracles, and verification entrypoints instead of loading every document;
- validating manifest coverage, registered artifacts, Requirement-to-Oracle traceability,
  unresolved placeholders, hidden source/history dependencies, and process-material pollution;
- producing a deterministic isolated ZIP that contains only manifest-registered current inputs.

Keep only one current ZIP near the project. Iteration bundles belong in a temporary directory;
superseded bundles move outside default Agent search only when an independent experiment, release,
signature, or external reference needs reproduction. Git is the ordinary specification history.
Within its declared system boundary, an adopted SDD replaces, rather than duplicates, each previous
canonical document: migration stays draft until old handwritten copies are retired, linked, or made
checked generated projections. Project rules and Owners outside that boundary remain authoritative.

It does not replace `$ax-pipeline`, migrate project documentation automatically, store Proposal or
task instances, or claim that static checks prove reconstruction. Clean reconstruction remains a periodic
independent evaluation.

```bash
python3 skills/repository/ax-sdd/scripts/sdd.py init /path/to/project/sdd \
  --system-id example-system --name "Example System"
python3 skills/repository/ax-sdd/scripts/sdd.py context /path/to/project/sdd \
  --query "change an API permission"
python3 skills/repository/ax-sdd/scripts/sdd.py validate /path/to/project/sdd --level structure
python3 skills/repository/ax-sdd/scripts/sdd.py validate /path/to/project/sdd
python3 skills/repository/ax-sdd/scripts/sdd.py bundle \
  /path/to/project/sdd /path/to/output/example-system-sdd-0.1.0.zip
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

Before changing symlinks, the installer runs `bin/validate-skills.sh`, the structural mode of
`bin/validate-scaffolds.sh`, and `bin/validate-sdd.sh`. They verify catalog uniqueness and coverage,
module paths, Skill frontmatter through the standard validator when available, UI metadata,
scaffold registry paths, and the experimental SDD behavior gates. Scaffold generation is
deliberately separate because it installs dependencies; run `bin/validate-scaffolds.sh --smoke`
explicitly when a generator or scaffold source changes.

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

`bin/uninstall.sh` removes the Skill/Profile links installed by this repository and also removes
`~/.codex/AGENTS.md` only when it is a symlink that resolves exactly to this repository's
`AGENTS.md`. It preserves unrelated global rules and all `AGENTS.md.backup.*` files so a prior
configuration can be restored manually.

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

Use one primary workflow. For an end-to-end change, prefer:

```text
$ax-pipeline
  -> routes $ax-frontend and/or $ax-backend in supporting mode
  -> completes risk-selected verification and delivery review
```

When intentionally working stage by stage, use `$ax-prd` -> `$ax-arch` -> `$ax-dev` + the affected
domain Skill -> `$ax-test` -> `$ax-review`. `$ax-structure-review` remains an optional, explicitly
requested structure audit; domain Skills do not become additional lifecycle stages.

For a project that explicitly adopts current-system SDD, use `$ax-sdd` in supporting mode to query,
initialize, validate, or bundle the converged current definition. Stage notes and task instances
remain owned by the lifecycle and do not become SDD artifacts.

To generate or refresh a thin project-specific adapter skill from a repository's
actual architecture, owners, canonical documents, and verification commands:

```text
$ax-project-adapter Inspect this repository and generate its project adapter skill.
```

The generated adapter should contain only project navigation and project-specific
constraints. Global engineering gates and reusable domain workflows stay in this
directory's global rules and Skills.

Project adapter targets come from the active repository or paths explicitly provided for the
current task. For “all registered/controlled projects,” the canonical machine-local target set is
`$HOME/.codex/project-registry.yaml`, limited to entries with `sync_rules: true`; do not infer
registration by scanning parent or sibling directories. A bounded parent directory is used only
when the user explicitly asks to discover candidate repositories, and discovery does not register
or authorize synchronization. This repository itself does not persist machine-specific paths.

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

If `.local.env` contains `TAPD_ACCESS_TOKEN` or `TAPD_KEY`, the installer configures
the MCP process to load that ignored project-local file dynamically without copying the
token into Codex configuration. Otherwise, the token is entered without terminal echo
and stored only in the Codex user MCP configuration. Then restart Codex / ChatGPT and use:

```text
$tapd-query List stories and bugs for workspace 123456.
```

## Operating Rule

Apply the evidence and engineering-judgment gate in `AGENTS.md` before accepting a technical
premise or proposed solution. Then use the Fast Path for explicit, localized, low-risk changes.
Use PRD and design gates for work that does not meet every Fast Path condition, and leave Fast
Path when a risk boundary appears while routing only its confirmed affected scope. Decide this
before loading optional role or domain Skills; an eligible Fast Path change uses project
instructions and local Owner navigation without loading the full `ax-dev`, `ax-frontend`, or
`ax-backend` workflow.
