# Agentic Development Workflow Rules

These rules are for personal Codex behavior across software engineering projects.

## Language

- 默认使用中文回复，除非用户明确要求英文。
- 先给结论，再给关键依据和下一步。
- 对风险、假设、无法验证的地方要明确说明。

## Global and Project Boundaries

- Repository-local boundary: only when the active project is the repository containing this `AGENTS.md`, limit work to the AI software-engineering framework: project-independent Agent rules, reusable workflows, Skills, templates, profiles, and installers. Do not handle a concrete product project's requirements, architecture, code, tests, deployment, operations, or troubleshooting from this repository; perform that work in the concrete project's repository under its own `AGENTS.md`. This boundary does not prohibit concrete project work when the active project is that project's own repository.
- This global engineering directory owns only project-independent rules, role workflows, domain workflows, and reusable templates.
- Never place a specific project's framework choices, paths, commands, endpoints, credentials, deployment topology, or business rules into global `AGENTS.md` or global Skills.
- Lifecycle Skills (`ax-pipeline`, `ax-prd`, `ax-arch`, `ax-dev`, `ax-test`, `ax-review`) own delivery stages.
- Discipline Skills (`ax-frontend`, `ax-backend`, `ax-structure-review`) own reusable engineering practices and structural quality.
- Repository Skills (`git-workflow`, `ax-project-adapter`) own source-control and project-adoption workflows.
- Integration Skills (`tapd-query`) own external tool access and must keep credentials outside the repository.
- A project's `AGENTS.md` owns its stack, commands, hard constraints, and canonical sources.
- A project adapter Skill only maps global workflows to verified project owners and entry points; it must not copy global gates or become a second project rule source.
- For cross-repository contracts, record one source contract owner and keep provider projections and consumer copies/generated clients explicitly derived.

## Risk-Tiered Workflow

Use the Fast Path instead of the full requirement/design pipeline only when all of
the following are true:

- The request and expected result are explicit, unambiguous, and locally verifiable.
- The change stays inside one existing owner or a small set of directly adjacent files.
- It does not change architecture, ownership, public API/event contracts, data models,
  migrations, permissions, billing, security/privacy boundaries, analytics semantics,
  dependencies, compatibility behavior, deployment topology, or production data.
- It does not require generated-source changes, cross-repository coordination, a new
  abstraction, or a new state/transaction/concurrency owner.
- For configuration, the change is limited to non-sensitive local tooling or an
  already-defined low-risk setting with no production/runtime or deployment impact.
- A narrow relevant verification command or direct inspection is known.

Fast Path execution:

1. Decide the path before loading optional workflow or domain Skills. For Fast Path work,
   do not load `ax-pipeline`, `ax-prd`, `ax-arch`, `ax-dev`, `ax-test`, `ax-review`,
   `ax-frontend`, or `ax-backend` merely because of the file type; use applicable
   `AGENTS.md`, target files, and project navigation only when needed.
2. Read applicable project instructions and inspect the working tree.
3. Confirm the existing owner and the smallest affected scope; do not produce a PRD or
   full design report.
4. Make the localized change.
5. Run only the smallest meaningful validation. A behavioral bug still needs a focused
   regression check when practical.
6. Report the changed files and validation result concisely; add risks or recovery notes
   only when they are material.

If any eligibility condition is uncertain or becomes false during the change, stop the
Fast Path and apply the standard requirement, design, test, and delivery gates below.
Explicit project rules may impose stricter handling.

## Requirement Gate

For work that does not qualify for the Fast Path, before editing code for a feature,
bug fix, or refactor, Codex must produce a short requirement understanding:

- Goal
- In scope
- Out of scope
- Acceptance criteria
- Affected modules/files
- Ambiguities and risks

If ambiguity changes behavior, data model, API contract, permissions, billing, security, or user workflow, ask a clarification before editing.

## Design Gate

For work that does not qualify for the Fast Path, before implementation, Codex must
inspect the existing codebase and identify:

- Existing owner modules
- Similar implementations
- Existing helpers/services/classes/hooks to reuse
- Boundaries between API, business logic, persistence, and UI
- Test locations and verification commands

Do not implement parallel logic without explaining why.

## Coding Principles

- Implement only the smallest correct solution for confirmed requirements; avoid speculative code.
- Compatibility code needs user approval after stating its target, cost, removal plan, and tests.
- Use OOP for boundaries and decoupling. Prefer composition; use inheritance/polymorphism only for clear substitution.
- At real boundaries, accept narrow interfaces/abstract types and return concrete structured results. Avoid needless abstractions.
- Keep one responsibility per unit across OOP and non-OOP code. Apply the code-size review policy below instead of treating line count as an automatic violation.
- Reuse before adding code or dependencies; isolate third-party SDKs.
- Validate inputs and permissions at system boundaries. Never hardcode or log secrets/sensitive data.
- Never swallow errors; preserve causes. External calls need timeouts; retries need bounds, backoff, and idempotency.
- Define transaction/concurrency behavior for writes, duplicates, and partial failures.
- Prefer clear names, useful `why` comments, structured logs, and centralized rules; remove dead code.

## Change Control

If requirements change during implementation:

1. Stop coding.
2. Summarize the original requirement.
3. Summarize the requested change.
4. Identify changed acceptance criteria.
5. Identify affected modules, APIs, data models, permissions, tests, migration, and delivery risk.
6. Update the PRD/design/test plan before continuing.
7. Do not patch code directly from the change request unless the impact is trivial and explicitly scoped.

If architecture changes during implementation:

1. Stop coding.
2. Explain why the current design is insufficient.
3. Compare current design vs proposed design.
4. List files already changed that must be revised, kept, or reverted.
5. Update the implementation plan and regression test plan.
6. Continue only after the revised design is explicit.

## Code Organization

- Do not put unrelated responsibilities in one file.
- Avoid all-in-one files that mix API calls, validation, business rules, persistence, UI rendering, and side effects.
- Search before adding helpers, validators, formatters, mappers, API wrappers, permission checks, or business rules.
- If the same behavior appears twice, reuse or extract it unless the difference is intentional and documented.
- Keep business rules out of UI/controllers when there is an existing service/domain layer.

## Code Size and AI Maintainability

- Optimize for local reasoning: each behavior needs one searchable owner, explicit dependencies and contracts, localized changes, and an executable verification path.
- Line count is a structural-review trigger, not a quality score, target, or automatic failure. By default, review handwritten production files over 500 lines and functions/methods over 50 lines; applicable domain or project rules may set stricter triggers.
- A size finding needs evidence of mixed responsibilities, excessive dependency/context fan-out, hidden state or side effects, poor change locality, duplication, or weak testability. Do not report line count alone as the defect.
- Do not split code mechanically or introduce needless interfaces, forwarding layers, tiny files, deep inheritance, or generic abstractions merely to meet a threshold; these also harm human and AI navigation.
- Identify generated, vendored, migration, schema, static-data, fixture, and substantially declarative artifacts before applying thresholds. Exempt them when splitting would not improve ownership or verification, and record the reason.
- For oversized legacy files, avoid broad rewrites and unrelated growth. Establish a baseline, add behavior tests, keep new responsibilities in the correct owner, and extract one verified boundary at a time so size and complexity do not increase.

## Documentation Rules

- Each topic must have one canonical document. Search before creating and update it in place.
- Other documents must link to the canonical source instead of copying its content.
- Document verified current behavior; label assumptions, plans, and unverified claims explicitly.
- Update documentation with behavior changes. Remove or mark stale and conflicting content.
- When documents conflict, identify the authoritative source and resolve the conflict before continuing.

## Git Branch Control

- Do not create a Git branch unless the user has explicitly approved creating it.
- Before running commands such as `git branch <name>`, `git switch -c`, `git checkout -b`, or `git worktree add -b`, state the proposed branch name and purpose, then wait for user approval.
- Do not infer branch-creation permission from a request to implement, fix, commit, publish, open a PR, create a task, or use a worktree.
- If the user has not approved a new branch, continue on the current branch when safe or stop and ask before branch creation.
- Read-only branch inspection and working on an existing user-selected branch do not require branch-creation approval.

## Local Docker Control

- Use local Docker only for generic development infrastructure such as PostgreSQL, Redis, Valkey, MySQL, Etcd, message queues, or similar shared foundational components.
- Do not use local Docker to package, build, or run application/business services unless the user has explicitly approved that specific use.
- Before running any image-changing or registry operation, state the image, purpose, expected disk impact, and command, then wait for explicit user approval. This includes `docker build`, `docker buildx`, `docker pull`, `docker push`, `docker tag`, `docker load`, `docker import`, `docker compose build`, and `docker compose pull`.
- Automatic image pulling caused by `docker run` or `docker compose up` is still a pull operation and requires approval when the image is not already present locally.
- Do not infer Docker build, pull, or packaging permission from a request to develop, test, run, deploy, debug, or use an existing Compose file.
- Prefer native local commands for application compilation and tests. Use an already-present foundational container only when it is necessary for dependencies.
- Read-only inspection commands such as `docker ps`, `docker images`, `docker inspect`, and `docker system df` do not require approval.
- Do not delete containers, images, networks, build cache, or volumes without explicit approval. Never run broad cleanup commands such as `docker system prune -a` or use `--volumes` unless the user has approved the exact cleanup scope.

## Testing Rules

Tests must verify expected behavior, not mirror current implementation.

For bug fixes:

1. Reproduce the bug or describe why reproduction cannot be automated.
2. Add a regression test that would fail before the fix.
3. Implement the fix.
4. Verify the regression test passes.

For features, cover:

- Happy path
- Invalid input
- Edge case
- Permission/state boundary if relevant
- Nearby regression risk

Do not make tests pass by changing expectations to match broken behavior.

For Fast Path documentation, formatting, comments, or low-risk configuration changes,
run only the narrowest relevant validation; do not require unrelated full test suites.

## Delivery Criteria

For standard work, a task is not done until Codex reports:

- Requirement match
- Design used
- Files changed
- Tests run
- Remaining risks
- Rollback or recovery notes when relevant

For Fast Path work, report only the changed files, validation performed, and any material
risk or recovery note. Do not expand the response into a full pipeline report.
