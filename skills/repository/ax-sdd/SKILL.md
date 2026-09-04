---
name: ax-sdd
description: 维护项目级 Domain SDD：定义项目全部当前行为、边界、契约、数据、不变量、验收与固定资产，并按 Domain 提供按需上下文。适用于任何规模的项目；不提供 CLI，也不替代 ax-pipeline。
---

# Domain SDD

`ax-sdd` is the project-wide capability for the complete current SDD: observable behavior, contracts, data, invariants, operational boundaries, acceptance boundaries and declared assets. It owns Domain organization, navigation, Spec grading, Logic Flow semantics, Requirement/Oracle mapping, Change Delta handling, and the temporary execution Todo; it does not establish a second lifecycle. A Domain is an organization and routing unit, not a limit on what the project SDD defines. A minimal closure means the smallest sufficient context read for one task, not a minimal project specification.

本 Skill 只有一个模型：`profile: domain-sdd`、`schema_version: 1`。旧 profile、coverage、context route Schema、分层校验和兼容路径已删除。

完整规范见 [references/domain-sdd-model.md](references/domain-sdd-model.md)。设计、迁移、实现或审核 SDD 时必须读取该文件。

## 核心规则

- SDD covers the current behavior and normative boundaries of the whole project, regardless of project size. Domain is the stable organization and ownership unit; it is not a claim that only one small domain is specified.
- Each Domain owns `domain.json`, PRD, SPEC, Logic Flow and business Test Flow; split Subdomains only when a real independent boundary exists.
- PRD/SPEC/Logic Flow/business Test Flow respectively own why/what/how/proof, without duplicating the same rule. Business Test Flow is not code-test source and does not record classes, functions, files, fixtures, mocks, frameworks, coverage or implementation branches.
- 图形只作同文件的非规范可视化投影：系统 Architecture Artifact 保存 Mermaid 系统边界图和 Domain 依赖图；每份 Logic Flow Artifact 保存覆盖其 `FLOW-*` 的 Mermaid `flowchart`。表格、Requirement、Domain Index 和技术合同仍是规范事实，禁止建立独立 diagram 目录、第二份图索引或以 PNG/SVG 替代可搜索文本。
- Dictionary 只登记 subject object 和 logic term；字段、DTO、Schema、参数、环境变量和局部类型留在技术 Owner。
- Requirement 只有一个 canonical Owner，并通过 traceability 连接 Agent-neutral Acceptance Boundary。
- Domain Index is the sole Domain navigation graph. Choose a primary Domain by operation and canonical Owner, then read the smallest sufficient closure for the task; this optimizes context loading and does not reduce project-wide SDD coverage. Dictionary and Traceability are lookup roots, not replacement Domain graphs. Register affected Domains only when their owned contract changes; overlapping Terms do not decide ownership alone.
- Manifest `references` form the direct Artifact dependency graph; all project SDD Artifacts remain registered and reachable. Read referenced assets only when the task touches that boundary or its projection.
- current truth 与 Change Delta 分离。Delta 仅使用 ADDED/MODIFIED/REMOVED/RENAMED，留在生命周期任务上下文；不得单独把未实现目标提交为 current。交付包原子合并规范、实现、projection 和 traceability，删除 Delta 后再验证。
- OpenSpec/Spec Kit 只提供设计原则来源；不复制其 CLI、分支、目录编号、阶段命令或工作流状态机。
- SDD 不保存 Proposal、tasks、进度、历史快照、被否决方案或 Agent 推理。
- For a task that changes a current Domain contract, this Skill checks the relevant project-wide SDD boundary and its smallest sufficient closure, then returns `accepted`, `gap` or `blocked`; after acceptance it generates and freezes the temporary execution Todo. A project that has not adopted Domain SDD returns `out-of-sdd` and keeps its existing specification Owner.
- `ax-pipeline` 只消费上述结果并控制生命周期转移；不得在 Pipeline、PRD 或架构 Skill 中复制本节的 Spec 分级、字段合同或 Todo 拆分规则。
- 迁移期间保持 `draft`；完成 canonical Owner 切换后才设为 `current`。

## Spec 分级与执行 Todo 合同

分级是一次任务的临时 Spec 路由结果，不是 current SDD 字段，也不改变 Domain 的 Owner：

- **Out of SDD / Fast Path**: no current project behavior, contract, data, permission, security, concurrency, migration, generation, dependency, deployment or external-side-effect boundary changes; `AGENTS.md` and `ax-pipeline` use Fast Path without entering Domain SDD.
- **S1 / Domain-local**: one current Domain and one primary Owner change; review that Domain's smallest sufficient closure and split Todo by independent Logic Flow or lower observable result. This is a task classification, not a statement that the project SDD covers only that Domain.
- **S2 / Cross-boundary**: multiple Domains, public Contract, Data, permission, security, concurrency, migration, generated projection, external side effect or release boundary change; register primary/affected Domains and read each smallest sufficient closure. The resulting closure is a reading set, not the project's complete SDD scope.

命中 S1 或 S2 后，按以下顺序审核 Spec：

1. 确认 Domain、Spec 与 Requirement 的 canonical Owner；
2. 确认请求行为、边界、失败/恢复结果与直接 Contract/Data/Acceptance 一致；
3. 确认每个受影响 Requirement 有稳定 `REQ-*` ID、每个验证结果有可执行 `ORACLE-*`；
4. 确认 Logic Flow 覆盖当前行为；
5. 在 Spec 接受且 Todo 生成/冻结后，先建立或更新业务 Test Flow：以 Journey、角色、前置条件、业务动作、可观察结果和边界结果描述验收；
6. 确认没有控制实现的未决 material assumption。

审核结果只有四种：`out-of-sdd`（目标项目未采用 Domain SDD，走项目原有路线）、`accepted`（可执行）、`gap`（记录精确缺口并阻塞依赖路径）或 `blocked`（Owner、边界或来源冲突需要人工决定）。不得用临时 Todo 或 Agent 推断填补 `gap`。

### 路由结果与主流程交接

每次命中 Domain 或确认项目不适用 SDD 的处理必须返回一份紧凑交接结果，至少包含：`status`（`out-of-sdd`、`accepted`、`gap` 或 `blocked`）、`classification`（`S1`、`S2` 或 `null`）、`primary_domain`、`affected_domains`、实际读取的最小充分上下文闭包、受影响的 `REQ-*`/`ORACLE-*`、是否需要临时 Todo，以及阻塞原因或下一步。最小充分闭包是读取预算，不是项目 SDD 的范围。


`accepted` 只表示项目级 SDD 中相关 Spec/Owner/Oracle/Logic Flow 已足以执行，不表示实现或项目门禁已通过；`gap` 必须列出缺失的 canonical Artifact、Requirement、Oracle、Owner 或边界；`blocked` 必须列出需要人工决定的冲突。`ax-pipeline` 只消费这份结果，不重新建立 SDD 路由或 Todo 合同。

- 每项有一个主要 Owner、一个主要 `FLOW-*` 或更低层可观察结果、明确 Requirement/Oracle、受影响调用方/文件/projection、依赖顺序和可观察完成条件；
- 每个 in-scope Requirement 至少映射一个 item，每个 item 必须映射回明确 Spec 行为；
- 一个 Requirement + Logic Flow 已形成单一结果、单一主要 Owner 和一个 Oracle 时保持一项，不机械细分；
- 包含多个 Owner、独立状态转换、独立 Oracle 或独立回滚边界时拆分；仅按文件名、函数名或机械编辑差异不得拆分；
- Todo 不得新增 Spec 外行为、Owner、契约、数据、权限、安全、兼容性、重试、遥测、文档或门禁。

Todo 创建后冻结 Owner、范围、依赖顺序和完成条件，逐项执行。普通命名、私有 helper、导入和可纠正的局部编译错误不重开 Spec；发生行为、Owner、Contract/Data、权限、安全、迁移或不可行性变化时阻塞受影响项，先将批准的规范性决定写回 canonical Spec，再重新生成并冻结 Todo。

交付前执行 Requirement ↔ Todo 双向对账、一次选定的业务 Test Flow/Acceptance Oracle，并清理临时 Todo。Todo、Change Delta、执行日志、临时失败和私有实现选择不得写入 current SDD、Git、Archive 或长期文档。

## 唯一目录

```text
sdd/
├── manifest.json
├── index/domains.json
├── domains/<domain-id>/
│   ├── domain.json
│   ├── prd.md
│   ├── spec.md
│   ├── logic-flow.md
│   └── test-flow.md
├── dictionary/objects.md
├── dictionary/logic-terms.md
├── contracts/
├── data/
├── architecture/
├── operations/
├── quality/
├── acceptance/traceability.json
└── assets/
```

## 使用流程

1. 采用前置检查：确认目标仓库 `AGENTS.md` 明确采用项目级 Domain SDD，并确认现有 `manifest.json` 与 `index/domains.json` 被项目规则声明为 authoritative。任一条件不满足时返回 `out-of-sdd`，保留项目原有规格 Owner，不创建或同步 SDD 目录、Artifact、校验命令或 Domain 路由。
2. 主流程确认项目系统边界和本次任务的 primary Domain。
3. 目标 `sdd/` 已存在时按当前项目 SDD 内容迁移；新建时按本 Skill 的目录合同直接创建文档，不运行生成器。
4. 建立或维护覆盖项目当前行为的 Domain Index、Domain Metadata、PRD/SPEC/Logic/业务 Test Flow、必要 Dictionary 和 Requirement/Oracle traceability。
5. 选择 primary/affected Domains，读取各自最小充分上下文闭包和任务触及的 Manifest `references`；未被本次任务触及的项目行为仍由其 current Artifact 定义，不因按需读取而失去规范归属。
6. 对命中的 current Spec 按“Spec 分级与执行 Todo 合同”执行审核、接受判定、Todo 冻结、执行和交付对账；`ax-pipeline` 只负责生命周期转移。
7. 普通 SDD 内容不运行无关项目门禁；仅校验器/模型合同变化时运行其 focused 业务验收。

## 交付

报告命中的 Domain、实际读取或修改的 Artifact、项目验证命令及结果。
