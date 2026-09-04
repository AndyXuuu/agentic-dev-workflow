# Agentic Development Workflow Rules

Project-independent rules for software-engineering work.

## Language

- 默认使用中文回复，除非用户明确要求英文。
- 先给结论，再给关键依据和下一步。
- 明确标注风险、假设、证据缺口和未验证范围。

## Task Routing and Critical Path

Before loading optional workflow or domain Skills, classify the requested subject:

- **Agent session/workflow measurement**: when the user asks how long an Agent, OMP or Orca session took, why it was slow, or whether tool/workflow execution was excessive, use `agent-workflow-measurement`. The measured object is the Agent session, not the project behavior mentioned as an example. Do not load project business Skills, create Todo items, or run project tests unless the user separately requests product-behavior verification.
- **Explicit local low-risk change**: use Fast Path below; do not load lifecycle/domain Skills merely because of the file type.
- **Non-trivial feature, fix or refactor**: use `ax-pipeline` as the single primary workflow. `ax-backend` and `ax-frontend` add only affected domain decisions; they do not repeat lifecycle gates.
- **New project/application with no Owner**: use `ax-project-bootstrap` before product design or implementation.
- **Git commit/sync/history operation**: use `git-workflow` for the requested Git boundary.
- **Domain SDD adoption/query/audit**: use `ax-sdd` only for its document model and navigation boundary.

Subject binding is sticky for the task. A project problem used as a measurement sample does not change `agent-session` into `project-behavior`; when both are requested, use separate evidence windows and conclusions.

Keep one active critical-path step:

- Prioritize the next unmet acceptance criterion. Process, business acceptance, review, documentation and hardening support it; they are not independent deliverables.
- Finish the smallest working vertical slice before broader risk-selected verification or optional cleanup.
- Stop discovery when the Owner, reuse point, smallest change and verification plan are known.
- Interrupt only for a confirmed material risk, missing approval, or failure in changed behavior/direct dependencies.
- Record unrelated defects, debt, security findings and acceptance gaps as follow-ups unless they block acceptance.
- Use one primary workflow. Supporting Skills add only task-relevant decisions.
- Stop and deliver when acceptance and every check selected by changed risks and project gates pass.

## Evidence, Decisions and Assumptions

- User outcomes, priorities, aesthetic preferences, risk appetite and explicit constraints are authoritative. The Agent owns technical discovery, evaluation, implementation quality and honest verification.
- Treat diagnoses, causal claims and proposed implementations from any participant as inputs to evaluate. Before accepting a material technical claim, inspect the narrowest authoritative source: current code/configuration, runtime state, logs, Git state, API/tool result or official contract.
- Separate actual behavior from intended behavior. Source/runtime and business evidence establish what happens; canonical requirements/contracts establish what should happen. Report mismatches instead of selecting the easier premise.
- Give an independent recommendation. Compare only meaningful options, including no change when it may be better.
- Establish the narrowest relevant baseline and success signal before a fix, refactor or claimed improvement; repeat the same signal after the change.
- A material assumption must be verified, converted into an explicit user decision/constraint, or removed with all dependent plan/acceptance/document/code before implementation, acceptance-oracle selection, canonical documentation or delivery.
- A remaining unknown is allowed only when harmless, reversible and unable to affect behavior or risk; record its checkpoint without presuming an answer.
- Ask only when an unresolved decision materially changes behavior, contracts, data, permissions, billing, security, workflow or delivery scope.
- Never alter project checks, documentation, metrics or acceptance criteria merely to make an unsupported premise appear correct.

## Terminology and Object Identity

At the requirement checkpoint, consult the existing registry and record only the task terminology delta.

- Register a concept only for an independently observable identity/lifecycle, cross-Owner/public/persistent contract, security/data-ownership boundary, or demonstrated naming collision that can change behavior.
- Ordinary prose, fields, helpers, local/internal types, single-Owner details, UI-only states, derived attributes and standard external technical terms do not require a global Concept ID.
- A registered entry needs a stable ID, canonical label, precise boundary/Owner and key invariants. Record aliases/confusables only when they exist; link the owning requirement/contract instead of duplicating traceability.
- Reuse verified project/domain labels; otherwise preserve the user's label and language. Translation or style variation must not create a second identity.
- Resolve a material same-concept/different-concept ambiguity before the dependent contract/design, not before unrelated exploration.

Lifecycle Skills consume this threshold; they must not reproduce or strengthen it.

## Security Goal and Complexity Budget

- Keep established boundary validation, authorization, secret handling and mandatory project security baselines.
- Before adding a non-trivial control, identify the protected asset, credible threat/failure, attacker capability, trust boundary and observable security property.
- Do not silently upgrade protection against mistakes/program bugs into protection against compromised administrator credentials, malicious insiders, collusion or supply-chain substitution.
- Describe only guarantees actually provided. Actor/approver labels are attribution, not independent approval; metadata/source digests are not content integrity unless trusted bytes are verified.
- New principals/roles, separation of duties, approval state machines, permission boundaries, content signatures/attestations, key lifecycles, migrations or cross-Owner enforcement are material requirement/architecture scope. State cost, migration and verification impact before implementation.
- Stronger unrelated defenses are evidenced residual risks or explicit alternatives, not hidden completion requirements. Security checklists filter relevant work; they do not create scope.

## Global and Project Ownership

- This repository owns project-independent Agent rules, reusable workflows, Skills, templates, profiles and installers. Concrete product work belongs in that product repository under its own `AGENTS.md`.
- Never put a specific project's stack, paths, commands, endpoints, credentials, deployment topology or business rules into global rules or Skills.
- Lifecycle Skills (`ax-pipeline`, `ax-prd`, `ax-arch`, `ax-dev`, `ax-review`) own delivery stages.
- Discipline Skills (`ax-frontend`, `ax-backend`, `ax-structure-review`, `agent-workflow-measurement`) own reusable domain practices.
- Repository Skills (`git-workflow`, `ax-sdd`, `ax-project-bootstrap`, `ax-project-adapter`) own their named repository boundaries. Integration Skills own external-tool access.
- A project's `AGENTS.md` owns its stack, commands, hard constraints and canonical sources. A project adapter only maps global workflows to verified project Owners/entrypoints; it must not copy global gates.
- Cross-repository contracts have one source Owner; provider projections and consumer/generated clients remain explicitly derived.

### Scaffold-first bootstrap

- For a new project/application with no existing Owner, inspect only the registered scaffold catalog through `ax-project-bootstrap` before designing a framework.
- Confirm target, application kind, material stack/security constraints and license compatibility before generation.
- When compatible, use the official generator to copy the complete baseline, including source, lockfiles, rules, design contracts, adapter, Owner maps and verification entrypoints. Never overlay a scaffold onto a non-empty target.
- Treat generated files and generator verification as baseline; adapt from their real Owners without immediately rerunning unchanged aggregate checks.

### Registered project synchronization

- The canonical registry is `$HOME/.codex/project-registry.yaml`; synchronize only entries with `sync_rules: true`.
- Add/remove registry entries only on explicit request. A local repository is not registered merely because it exists.
- Before changing a registered repository, verify its Git root, applicable rules, current branch, upstream and clean/dirty state. Keep each repository's change, validation, commit and remote synchronization independent.

### Domain SDD

- Use `ax-sdd` only when the target repository's own `AGENTS.md` explicitly adopts project-level Domain SDD and its existing manifest/index are authoritative. Absence of that project-local adoption is a hard routing boundary: do not initialize or synchronize SDD routing/artifacts there. A project may keep one explicit non-adoption sentence as a standalone guard. Project size does not determine applicability.
- The Domain Index is the sole Domain navigation graph; select one primary Domain from operation/Owner evidence and register affected Domains only when their owned contract changes. Dictionary and Traceability are supporting lookup roots, not alternate Domain routing graphs. Tied candidates must be resolved before canonical edits. `default_domain` is for explicitly marked read-only initial navigation only. The selected Domain and its smallest sufficient closure control reading scope, not the complete project's SDD coverage.
- Manifest Artifact `references` form the direct dependency graph; every Artifact in the project-level SDD must be reachable from the Domain Index, Dictionary, or Traceability roots, while asset bytes are loaded only when the task or projection check touches them.
- Project-level Domain SDD contains the complete current definitions of project behavior, contracts, data, invariants, operational boundaries, declared assets and traceable Acceptance Boundaries—not Proposals, task lists, exploration, rejected alternatives, Agent reasoning, history or generated archives.
- Each Requirement has one canonical Domain Owner and must appear in at least one Test Flow owned by that Domain. Migration stays `draft` until every in-scope canonical document/contract/schema/asset has moved to its manifest Owner and former copies are removed, linked or checked projections.
- Behavior changes stay as ADDED/MODIFIED/REMOVED/RENAMED Delta in lifecycle task context until accepted; the delivery packet atomically merges SDD, implementation, projections and traceability, removes Delta, then runs the target project's SDD validation once. Ordinary SDD content changes do not trigger validator regression, CI simulation, or unrelated project gates.
- Use only the target project's existing SDD/projection validation entrypoint. `ax-sdd` must not add project generators, context commands, validators, bundlers, archive formats, CI jobs or installation gates.

## Fast Path

Use Fast Path only when all are true:

- Expected behavior is explicit, unambiguous and locally verifiable.
- Material current-state premises and behavior choices are confirmed by direct inspection.
- Scope stays inside one existing Owner or directly adjacent files.
- No architecture/ownership, public API/event, data model/migration, permission/billing/security/privacy, analytics, dependency, compatibility, deployment or production-data boundary changes.
- No generated-source/cross-repository work, new abstraction, or new state/transaction/concurrency Owner.
- Configuration is non-sensitive local tooling or an existing low-risk setting without production/runtime/deployment impact.
- A narrow meaningful verification or direct inspection is known.

Execution:

1. Read applicable project rules, target files and only the nearby navigation needed to confirm Owner/scope.
2. Do not load `ax-pipeline`, lifecycle/domain Skills, create a PRD/design report, terminology registry, staged Todo or full Review.
3. Make the smallest localized change.
4. Run only the smallest meaningful check; a behavioral bug still needs a focused pre/post signal when practical.
5. Report changed files, verification and material risk/recovery only.

Leave Fast Path only when a listed risk is confirmed or material uncertainty remains. Exiting Fast Path routes only the affected scope; it does not authorize a broader audit, stronger threat model or full gate stack.

## Standard Workflow Contract

For non-Fast-Path work, identify the canonical current behavior contract for the affected Owner
before implementation. If the project adopts Domain SDD, route Domain selection, Spec grading,
Requirement/Oracle mapping, Change Delta, Logic Flow decomposition, temporary Todo freeze, and
coverage reconciliation to `ax-sdd`; do not reproduce that SDD model in global rules or lifecycle
Skills. If the project does not adopt Domain SDD, use its own canonical contract and the normal
`ax-pipeline` lifecycle.

`ax-pipeline` consumes the resulting route (`out-of-sdd`, `Fast Path`, `accepted`, `gap`, or blocked) and controls
only lifecycle transitions. A missing or conflicting contract blocks only its dependent path. A code
defect that violates an accepted contract is an implementation fix; a requested behavior absent from
the contract requires the owning contract decision first. After routing, inspect only the Owner,
affected callers, required contracts/data, reusable code, nearby acceptance evidence, and selected verification
entrypoint; do not repeat lifecycle or SDD gates whose inputs are unchanged.

During implementation:

- incorporate explicit local requirement changes directly;
- when evidence invalidates a material assumption, pause only the dependent path and re-verify, obtain a decision, or remove derived work;
- when scope materially changes contracts, data, permissions, migration, ownership or delivery risk, state the delta and revised plan once;
- use the accepted canonical Owner and migrate every caller; clean cutover is default—no unapproved compatibility shims, aliases or deprecated paths.

## Coding, Structure and Documentation

- Implement the smallest correct solution; reuse before adding code or dependencies.
- Keep API/UI/controllers at protocol/presentation boundaries; business rules stay in the existing domain/service Owner.
- At real boundaries accept narrow interfaces/abstract types and return concrete structured results. Prefer composition; use inheritance only for substitution.
- Each write has one data Owner. Define transaction, duplicate, concurrency, partial-failure and recovery behavior where relevant.
- External calls use timeouts; retries are bounded, backed off and limited to safe/idempotent or reconciled operations. Preserve error causes.
- Never hardcode or log secrets/sensitive data. Validate inputs and permissions at boundaries.
- Search before adding validators, mappers, formatters, API wrappers, permission checks or business rules. Do not create parallel implementations without an evidenced reason.
- Code size is a review trigger, not a target: by default inspect handwritten production files over 500 lines and functions/methods over 50 lines for mixed responsibilities, context fan-out, hidden state/side effects, poor locality, duplication or weak verifiability.
- Classify generated, vendored, migration, Schema, static-data, fixture and declarative files before size review. Never split mechanically into tiny files, forwarding layers, needless interfaces or deep inheritance.
- For oversized legacy code, avoid broad rewrites and unrelated growth; extract one verified Owner boundary at a time.
- Each normative topic has one canonical document. Other docs link to it or provide a concise non-normative summary that defers conflicts.
- Document verified current behavior. Remove stale/conflicting copies; never promote unresolved assumptions into canonical documentation or archives.

## Protected Operations

### Git branches and history

- Do not create a branch unless the user explicitly approves the proposed name and purpose. Implement/fix/commit/publish/PR/worktree requests do not imply branch-creation permission.
- Continue on the current branch when safe; read-only branch inspection and work on an existing user-selected branch need no creation approval.
- Do not discard, hide or overwrite unrelated working-tree changes. Compatibility/history rewriting, force-push, destructive reset/clean or conflict resolution by ours/theirs requires explicit scope and approval.
- Use `git-workflow` for commit/sync operations; committing and pushing are separate authorizations.

### Local Docker

- Use local Docker without extra approval only for already-present generic development infrastructure such as databases, caches or queues when necessary.
- Do not build/package/run application or business services in Docker without explicit approval.
- Before any image-changing or registry operation—including build, pull, push, tag, load/import, Compose build/pull, or an automatic pull from run/up—state image, purpose, command and expected disk impact, then wait for approval.
- Prefer native compilation and project-owned checks. Read-only `docker ps/images/inspect/system df` is allowed.
- Never delete containers, images, networks, caches or volumes without exact approval; never run broad prune commands by default.

## Business Acceptance and Verification

业务 Test Flow、Acceptance Oracle 与 Requirement 的关系属于业务契约，项目若采用 Domain SDD，必须由
`ax-sdd` 在 Spec 接受和执行 Todo 冻结后维护；全局层不再提供代码测试设计、测试计划或测试准入 Skill。

- 业务验收必须来自已接受的 Spec、Requirement、Oracle、Logic Flow 或项目权威契约，不从文件、方法、助手、mock 或实现分支反推。
- Bug 修复保留修复前后同一条可观察业务失败证据；永久自动化验证不是全局工作流产物，是否维护由项目自身契约和发布门禁决定。
- 默认验证是最窄稳定边界上的业务结果、人工/运行时交互或项目既有契约检查；只有跨 Owner、公开契约、高风险边界或明确项目门禁要求时才扩大。
- 运行聚合目标前检查包含关系；同一输入上不得重复运行被整体门禁包含的检查。复用输入、环境和模式未变化的有效证据。
- CI/release 的覆盖率、E2E、审计、构建、打包、部署和环境门禁仍由项目规则或 CI Owner 持有；全局规则不自动调度代码测试套件。
- UI、CLI/TUI 仍须验证真实界面或交互；无法运行时报告精确的未验证范围，不把文档检查写成行为通过。

项目存在自动化验证时，将其视为项目拥有的验证入口，而非全局 Skill 能力；不得因存在命令机械运行全量套件。

## Delivery

- Standard work reports outcome, affected files, actual business acceptance evidence and material remaining risks. Add baseline/design/migration/rollback details only when relevant.
- Fast Path reports only changed files, verification and material risk/recovery.
- Agent session measurement reports wall time, tool critical path, turns/calls, over-execution evidence and the minimal expected path; it does not claim project behavior was accepted.
- Never claim CI, release, deployment, visual behavior or production success without matching evidence.
