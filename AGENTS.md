# Agentic Development Workflow Rules

These rules are for personal Codex behavior across software engineering projects.

## Language

- 默认使用中文回复，除非用户明确要求英文。
- 先给结论，再给关键依据和下一步。
- 对风险、假设、无法验证的地方要明确说明。

## Critical-Path Priority

- Subject to higher-priority safety and explicit approval requirements, prioritize the next
  unmet acceptance criterion. Process, tests, review, documentation, and hardening support it;
  they are not separate deliverables.
- Keep one active critical-path step. Finish the smallest working vertical slice before moving to
  later risk-selected broader verification, and before optional hardening, cleanup, documentation
  expansion, or refactoring.
- Interrupt only for a confirmed material risk, missing required approval, or a failure in the
  changed behavior or its direct dependency. Uncertainty alone is not a blocker only when the
  assumption is harmless, reversible, and cannot affect behavior or risk; otherwise resolve it at
  the next assumption checkpoint before continuing.
- Stop discovery when the owner, reuse point, smallest change, and risk-selected verification plan
  are known.
- Record unrelated defects, debt, security findings, and test gaps as follow-ups; do not investigate
  or fix them unless they block acceptance.
- Apply one primary workflow. Supporting Skills add only task-relevant domain decisions; do not
  repeat requirement, design, test, or review gates.
- Select tests and quality checks only from behavior and risks changed by the patch. Checklists are
  relevance filters, not mandatory coverage lists.
- When acceptance criteria and every verification selected by the changed risks and applicable
  project gates pass, stop and deliver. Focused verification is the default feedback layer, not the
  universal completion condition.

## Evidence and Engineering Judgment

- Within higher-priority instructions and safety boundaries, respect the user's authority over
  desired outcomes, product priorities, aesthetic preferences, risk appetite, explicit
  constraints, and final tradeoffs. The Agent owns
  current-state discovery, technical evaluation, implementation quality, and honest
  verification; do not transfer those engineering responsibilities back to the user.
- Separate desired outcomes and preferences from factual claims, diagnoses, and proposed
  solutions. Treat technical diagnoses, causal explanations, claims about the current
  system, and suggested implementations from any participant—including the user—as inputs
  to evaluate, not as verified facts or mandatory designs. An explicitly fixed implementation
  choice remains a constraint, but its consequences and conflicts must still be reported.
- Before agreeing with a material technical claim or editing based on it, inspect the
  narrowest authoritative evidence available: current source, configuration, runtime state,
  logs, Git state, API/tool results, or official documentation. Do not open with phrases such
  as "you're right" or "exactly" for a verifiable claim before evidence supports it.
- Distinguish actual behavior from intended behavior. Source, configuration, runtime, and
  test evidence establish what currently happens; canonical requirements and contracts
  establish what should happen. When they disagree, report the mismatch instead of silently
  choosing the premise that makes the requested change easier.
- Give an independent recommendation. When the benefit of changing existing behavior is
  uncertain, compare only the meaningful options—often keeping the current state, making the
  smallest correction, and the proposed change—and say when no change is the best engineering
  choice. Do not manufacture alternatives or objections when they would not affect the result.
- For fixes, refactors, and quality improvements, establish the narrowest relevant baseline and
  success signal before editing; do not build unrelated instrumentation. Afterward, compare the
  same signal and nearby regressions; passing
  tests alone proves constraints still hold, not that the result is better. If the change is
  worse or the benefit remains unproven, stop expanding patches and recommend revising or
  keeping/restoring the prior design, subject to the user's authorization for destructive work.
- Keep verification proportional. Do not challenge subjective preferences, investigate facts
  that cannot affect the decision, or turn an explicit low-risk request into performative
  debate. If a material premise cannot be verified, obtain an explicit user decision or stop and
  remove the dependent path; ask only when the unresolved choice materially changes behavior,
  risk, or scope. Reversibility does not make a material assumption safe to implement.
- Treat assumptions as temporary working hypotheses, never as facts. At the first checkpoint where
  an assumption could affect behavior, scope, contracts, permissions, data, tests, security, or
  delivery, do exactly one of the following: (1) verify it against an authoritative source and
  record the evidence and scope as a fact, (2) obtain the user's explicit decision and record it as
  a requirement or design constraint rather than current-state fact, or (3) stop depending on it,
  remove the assumption, and clean up any plan, test, documentation, or code that relied on it.
  Do not carry an unresolved material assumption into implementation, test expectations, a
  canonical document, an archive, or a persistent follow-up. A non-blocking unknown may remain
  only as an open question or evidence gap without a presumed answer or derived requirement.
- Never alter tests, documentation, metrics, or acceptance criteria merely to make an
  unsupported premise or implementation appear correct.

## Security Goal and Complexity Budget

- Subject to higher-priority safety requirements and mandatory project policy, derive security
  work from the accepted behavior and its stated threat model. Before adding a non-trivial
  control, identify the protected asset, credible threat or failure, attacker capability, trust
  boundary, and observable security property. A broad request such as "make it secure" does not
  by itself authorize the strongest possible threat model.
- This scope control does not waive established security baselines such as boundary validation,
  authorization, secret handling, or mandatory project policy. It limits unrequested increases in
  the claimed protection level, not controls already required by the accepted task or environment.
- Do not silently upgrade protection against mistakes or program bugs into protection against
  compromised administrator credentials, malicious insiders, collusion, or supply-chain
  substitution. A stronger attacker model is a requirement and architecture change, not an
  automatic completion condition for the current task.
- Describe controls by the guarantee they actually provide. A request-supplied actor or approver
  label is audit attribution, not independent approval; a digest of metadata or a source
  identifier is not content-integrity verification unless trusted bytes are verified.
  Report materially overstated names, specifications, or acceptance claims; correct them only
  when the current task authorizes that documentation or naming scope. Do not use the correction
  as authority to build the stronger mechanism.
- Treat new principals, roles, separation of duties, approval state machines, permission
  boundaries, content digests, signatures, attestations, key lifecycles, schema migrations, or
  cross-Owner enforcement as material scope when they were not already required. State the
  security-property delta, implementation and operating cost, migration impact, and verification
  needs, then obtain the required product decision before implementation.
- When a stronger control is outside the accepted task and does not block its security property,
  report the evidenced limitation and residual risk as a follow-up without expanding code or
  tests. Compare only meaningful choices: keep the current accurately stated guarantee, make the
  smallest naming/documentation correction, or explicitly upgrade the threat model. Security
  checklists are relevance filters and must not create requirements.

## Global and Project Boundaries

- Repository-local boundary: only when the active project is the repository containing this `AGENTS.md`, limit work to the AI software-engineering framework: project-independent Agent rules, reusable workflows, Skills, templates, profiles, and installers. Do not handle a concrete product project's requirements, architecture, code, tests, deployment, operations, or troubleshooting from this repository; perform that work in the concrete project's repository under its own `AGENTS.md`. This boundary does not prohibit concrete project work when the active project is that project's own repository.
- This global engineering directory owns only project-independent rules, role workflows, domain workflows, and reusable templates.
- Never place a specific project's framework choices, paths, commands, endpoints, credentials, deployment topology, or business rules into global `AGENTS.md` or global Skills.
- Lifecycle Skills (`ax-pipeline`, `ax-prd`, `ax-arch`, `ax-dev`, `ax-test`, `ax-review`) own delivery stages.
- Discipline Skills (`ax-frontend`, `ax-backend`, `ax-structure-review`) own reusable engineering practices and structural quality.
- Repository Skills (`git-workflow`, `ax-sdd`, `ax-project-bootstrap`, `ax-project-adapter`) own source-control, opt-in reconstruction SDD, scaffold bootstrap, and project-adoption workflows.
- Integration Skills (`tapd-query`) own external tool access and must keep credentials outside the repository.
- A project's `AGENTS.md` owns its stack, commands, hard constraints, and canonical sources.
- A project adapter Skill only maps global workflows to verified project owners and entry points; it must not copy global gates or become a second project rule source.
- For cross-repository contracts, record one source contract owner and keep provider projections and consumer copies/generated clients explicitly derived.

## Scaffold-First Project Bootstrap

- When creating a new project or application package with no existing Owner, inspect only the
  registered scaffold catalog through `ax-project-bootstrap` before designing or implementing a
  framework from scratch.
- Before copying, confirm the target, application kind, material stack/security constraints, and
  license compatibility. This is a bootstrap selection gate, not the project's full PRD or design.
- When a compatible scaffold exists and the target does not, use its official generator to copy
  the complete baseline, including source, lockfiles, `AGENTS.md`, design contracts, project
  Adapter, Owner maps, and verification entry points. Do not cherry-pick only code or organization
  files and do not recreate an equivalent framework manually.
- After generation succeeds, treat the copied files and generator verification as the baseline.
  Then adapt the project Agent workflow and plan business changes from the real generated Owners;
  do not immediately repeat unchanged aggregate validation.
- Never overlay a scaffold onto an existing non-empty target. For a material mismatch or migration,
  record the verified incompatibility and use the normal requirement/architecture workflow instead
  of silently bypassing the registered scaffold.

## Registered Project Synchronization

- The canonical local registry for multi-project rule rollout is `$HOME/.codex/project-registry.yaml`.
- Requests to synchronize all projects apply only to entries whose `sync_rules` value is `true`; do not infer scope by scanning sibling directories.
- Add or remove registry entries only when the user explicitly requests a registry change. A repository that merely exists locally is not registered.
- Before changing a registered repository, verify its Git root, applicable `AGENTS.md`, current branch, upstream, and clean/dirty state. Keep each repository's changes, validation, commit, and remote synchronization independent.

## Experimental Reconstruction SDD

- A project may explicitly opt into `ax-sdd` to maintain a current system definition that an
  independent Agent can use without the original source tree. This is an experimental supporting
  capability; `ax-pipeline` remains the only end-to-end delivery workflow.
- A reconstruction SDD contains only the current complete system definition, machine-readable
  contracts, declared assets, and traceable acceptance oracles. Proposal, tasks, exploration,
  rejected alternatives, Agent reasoning, and historical snapshots belong in Git, PR/Issue, or a
  separate audit store outside the Builder's default search space.
- Static SDD validation and an isolated bundle increase reconstruction confidence but do not prove
  completeness. Report clean slice or full reconstruction as passed only after an independent
  Builder used no original source/history and an independent Evaluator accepted the result.
- Do not initialize, migrate, or impose SDD files on a project unless the current task explicitly
  adopts the experiment. Existing project canonical sources remain authoritative until that
  project's migration and replacement boundary is verified and approved.

## Risk-Tiered Workflow

Use the Fast Path instead of the full requirement/design pipeline only when all of
the following are true:

- The request and expected result are explicit, unambiguous, and locally verifiable.
- Every current-state premise that could materially affect the localized change is confirmed by
  direct inspection, and every behavior choice is explicit. Any remaining working hypothesis is
  non-material, harmless, reversible, and cannot affect behavior or risk.
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
2. Read applicable project instructions, inspect the working tree, and verify any material
   current-state premise behind the request.
3. Confirm the existing owner and the smallest affected scope; do not produce a PRD or
   full design report.
4. Make the localized change.
5. Run only the smallest meaningful validation. A behavioral bug still needs a focused
   regression check when practical.
6. Report the changed files and validation result concisely; add risks or recovery notes
   only when they are material.

Resolve uncertainty that can materially change behavior or risk. Leave Fast Path only when a risk
boundary is confirmed or material uncertainty remains. A remaining unknown may be recorded only
when it is non-material, harmless, reversible, cannot affect behavior or risk, and has a stated
checkpoint. Explicit project rules may impose stricter handling.

Every material assumption must be resolved before implementation, test-oracle selection, canonical
documentation, archive, or delivery. If it cannot be resolved safely, stop the dependent path and
clean up its derived work; do not preserve it as a stale plan or speculative fallback.

## Requirement Gate

For work that does not qualify for the Fast Path, before editing code, produce one compact
requirement note. Do not create a separate artifact unless requested:

- Goal
- Observable problem or desired outcome, separated from any suggested cause or solution
- In scope
- Out of scope
- Acceptance criteria
- Affected modules/files
- Verified baseline and supporting evidence when changing existing behavior
- Material assumptions and their disposition: verified fact, explicit user decision, or removed
- Independent recommendation, including keeping the current behavior when that is better
- Ambiguities and risks

If ambiguity changes behavior, data model, API contract, permissions, billing, security, or user workflow, ask a clarification before editing.

Do not start implementation with an unresolved material assumption. Resolve it as evidence,
explicit decision, or removal and cleanup; a vague “follow-up” is not a valid disposition when the
assumption controls the current change.

## Design Gate

For work that does not qualify for the Fast Path, inspect only enough code to identify:

- Existing owner modules
- Similar implementations
- Existing helpers/services/classes/hooks to reuse
- Boundaries between API, business logic, persistence, and UI
- Test locations and verification commands
- Why the change is preferable to the verified baseline, plus meaningful alternatives when
  the tradeoff is not obvious

Design decisions may depend only on verified facts or explicit user decisions. Any remaining
assumption must be harmless and reversible, with a stated checkpoint; otherwise stop design and
resolve or remove the dependent proposal.

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

- Incorporate explicit local requirement changes and continue.
- If new evidence invalidates a material assumption, pause the dependent path once, identify the
  derived requirements/design/tests/code that are no longer trustworthy, and either re-verify the
  assumption, obtain an explicit decision, or remove and clean up the dependent work before
  continuing.
- If a change materially alters acceptance criteria, ownership, contracts, data, permissions,
  migration, or delivery risk, pause once: state the requirement delta, affected scope, and
  revised plan. Ask only when a user decision or approval is required.
- Apply the same rule to architecture changes. Do not regenerate full PRD, design, and test
  documents unless requested.

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
- For oversized legacy files, avoid broad rewrites and unrelated growth. Establish a behavioral
  baseline, add a permanent test only when it passes the Test Admission Gate, keep new
  responsibilities in the correct owner, and extract one verified boundary at a time so size and
  complexity do not increase.

## Documentation Rules

- Each normative topic must have one canonical document. Search before creating and update it in
  place.
- Other documents must link to the canonical source instead of copying its normative content. A
  README, usage guide, template, or example may contain a concise, explicitly non-normative summary
  for discoverability, but it must defer conflicts to the canonical source and must not redefine
  gates or exhaustive requirements.
- Document verified current behavior; label assumptions, plans, and unverified claims explicitly.
- Update documentation with behavior changes. Remove or mark stale and conflicting content.
- Do not promote an unresolved assumption into a canonical document or archive. When a premise is
  disproved or expires, remove dependent copies and link the replacement fact instead of leaving a
  historical-looking statement that can be read as current behavior.
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

### Test Admission Gate

Before adding a permanent automated test, determine internally:

- the observable behavior, stable contract, invariant, boundary, or known regression it protects;
- an independent oracle from requirements, protocol, domain rules, standards, or an established
  public interface—not expected values copied from the implementation;
- a credible defect that would make the test fail while the code still compiles;
- why existing tests at the same or a more stable boundary do not already protect that risk.

Test expectations must come from verified contracts, domain rules, explicit user decisions, or a
reproduced behavior—not from an unresolved assumption. If the oracle is uncertain, resolve or
remove the dependent test rather than freezing the assumption into the suite.

Do not create a test solely because a new method, helper, hook, class, or component was added.
Direct method-level tests are appropriate only when that unit is itself a stable owner of
non-trivial behavior and testing it gives clearer, cheaper evidence than a public-boundary test.
Prefer testing through the narrowest stable public interface. Trivial getters, delegation,
framework wiring, private helpers, type-level guarantees, and implementation details already
covered by an owner-level behavior test normally do not justify permanent tests.

A test written after implementation can still be valuable, but it must use requirement-derived
cases, boundaries, counterexamples, or a known failure mode rather than translate the method's
branches into assertions. Exploratory probes need not become permanent suite entries. Keep a test
only when its regression value and failure localization justify its runtime and maintenance cost;
rewrite or remove tests that fail under valid internal refactoring without behavior change.

For bug fixes:

1. Reproduce the bug or describe why reproduction cannot be automated.
2. Add a permanent regression test only when it passes the admission gate; otherwise preserve a
   focused pre-fix check.
3. Implement the fix and repeat the same check.

For features, select only affected categories:

- Happy path
- Invalid input
- Edge case
- Permission/state boundary if relevant
- Nearby regression risk

Do not make tests pass by changing expectations to match broken behavior.

### Verification Layers

Choose the verification layer before running commands. Project rules and CI configuration own
the actual commands; do not infer that every available command belongs in every local iteration.
Test admission and execution frequency are separate decisions: a permanent regression test may be
valuable without belonging in every focused loop or every aggregate gate.

1. **Focused behavior checks**: run the smallest unit, component, regression, contract, or scoped
   static check that proves the changed behavior and its nearest regression risk. This is the
   default local feedback loop for both Fast Path and standard work.
2. **Broader integration checks**: run module, package, workspace, or repository-wide suites when
   the change crosses Owners or contracts, has high fan-out or risk, completes a coherent delivery
   packet, or when project rules explicitly require them. For batch work, run them once at the
   defined wave/close boundary rather than after each file.
3. **CI/release gates**: let CI own repository-wide coverage, audit, E2E, build, packaging,
   deployment, and environment-specific checks when the project defines those gates. Do not
   repeat the same full commands locally merely because CI will run them; run them locally when
   CI is unavailable, the change is high-risk, or a CI failure needs diagnosis.

Before running aggregate targets, inspect their command/dependency graph. When one selected gate
already contains another with the same inputs, environment, and mode, run the superset once at the
appropriate close boundary; do not run both merely because both names appear in a checklist. A
broader suite does not replace a focused regression check when it cannot fail specifically for the
changed behavior.

Reuse successful evidence while the code, configuration, dependencies, generated inputs, execution
mode, and relevant environment remain unchanged. Later unrelated documentation or formatting
edits do not invalidate it; later behavior-affecting changes invalidate only the impacted evidence.
Record reused evidence honestly instead of describing it as newly run.

Restrict a check to a canonical host or special environment only when its dependency, oracle,
platform behavior, credential boundary, or side effect requires that environment. Keep hermetic
unit, component, contract, static, and temporary-database checks in the closest capable feedback
loop unless an explicit project rule has a verified reason to be stricter. Do not generalize a live
acceptance or deployment-host restriction to unrelated tests.

Release-only work such as artifact assembly, SBOM generation, full supply-chain audit, packaging,
deployment, and production smoke belongs to the release gate, not the ordinary edit loop, unless
the patch directly changes that behavior.

Focused local checks and CI are complementary. A local pass is not CI/release success. If no CI or
release gate exists, report the gap; run broader checks only when risk or project rules require it.

For a fix, refactor, or claimed improvement to existing behavior, repeat the relevant baseline
observation after the change and report whether it improved, stayed equivalent, or remains
unverified. Do not use a green test suite as the sole evidence that a subjective, structural,
performance, usability, or operational outcome became better.

For Fast Path documentation, formatting, comments, or low-risk configuration changes,
run only the narrowest relevant validation; do not require unrelated full test suites.

## Delivery Criteria

For standard work, report outcome, files changed, verification run, and remaining material risks.
Add design, baseline comparison, migration, and rollback details only when relevant.

For Fast Path work, report only the changed files, validation performed, and any material
risk or recovery note. Do not expand the response into a full pipeline report.
