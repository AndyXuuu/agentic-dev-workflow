---
name: ax-sdd
description: 实验性维护当前系统 SDD：用机器可读导航帮助 Agent 按任务快速定位系统边界、术语、Owner、最小规格切片和验证入口，并为无源码独立重建提供完整规格、可追踪验收与隔离 bundle。用于初始化、迁移、查询、校验或打包 current-system SDD，以及检查规格是否仍依赖源码、历史方案或未解决假设；不替代 ax-pipeline 的需求、架构、开发、测试与交付主流程，也不保存 proposal、tasks 或 Agent 推理过程。
---

# Current-system SDD

本 Skill 是 `ax-pipeline` 的支持型能力。它治理“最终系统必须是什么”，不建立第二套开发生命周期。
只有项目明确选择 current-system SDD 时才写入项目；实验功能不得自动迁移既有文档或改变发布门禁。

它使用同一个当前事实源支持两种读取模式：

- **项目内上下文**：默认先查询导航 Artifact，只读命中任务的最小 current Artifact、Owner、Requirement、Oracle 和验证入口；不默认读取全部 SDD。
- **隔离重建**：按 manifest 封装完整 current Artifact 和固定资产，让无源码 Builder 在独立环境重建，并由独立 Evaluator 验收。

## 不变量

- 通过 `current` 门禁后的 SDD 是其声明系统边界内 Agent 理解项目的唯一规范事实源，也是无源码重建的完整输入；不是变更日志、计划目录或源码摘要。项目 `AGENTS.md` 及边界外 Owner 仍按项目规则保持权威。迁移中的 SDD 必须保持 `draft`，不能与既有权威文档同时充当当前来源。
- 当前任务来自用户请求或主流程。SDD 只保存稳定任务路由，不保存某次任务的描述、状态或执行记录。
- `context` Artifact 是非规范导航视图，只能引用 canonical Artifact；它不得重述完整规则，冲突时服从引用目标。每项 current Requirement、Oracle 和非 traceability Artifact 必须至少进入一个稳定路由，避免当前事实只能靠全局搜索发现。
- SDD 声明边界内的每个规范主题只有一个 manifest 登记的 canonical Artifact。切换为 `current` 前，把既有权威文档、契约、Schema 和声明资产迁入该 Owner，并更新消费者；原位置必须删除、改为指向 canonical Artifact 的非规范链接，或成为带生成器和漂移检查的派生投影。禁止在 `docs/` 与 SDD 之间手工双向同步同一边界内的规则。源码、运行证据和测试用于证明 actual behavior，不是第二份规范。
- 当前规格不得使用“沿用现有逻辑”“保持当前行为”“参考原实现”等隐藏依赖。
- Proposal、任务清单、探索过程、被否决方案和历史快照不进入 SDD。需要追溯时显式查询 Git、PR、Issue 或独立审计系统。
- 每项当前 Requirement 必须连接到规格 Artifact 和独立 Oracle；测试通过不能补偿规格缺失。
- Bundle 只包含 manifest 明确登记的当前 Artifact；源码、Git 历史和仓库其他文档不得被顺带打包。
- 项目及其附近的 Agent 默认搜索空间只保留一个 current bundle。迭代校验输出到临时目录；旧 bundle 只有在已被独立实验、发布、签名或外部引用时才移入默认搜索空间之外的审计存储，否则删除。普通规格历史由 Git 保存。
- SDD 内所有实质假设必须在封装前成为已验证事实、明确需求/约束，或连同依赖内容一起删除。
- 安全 Requirement 必须写明保护资产、可信边界、要防的故障或攻击、攻击者能力和可观察保证；控制名称或现有字段不能替代这份合同。不得从“审批”“摘要”“受控”等字样推导独立身份、内容完整性或更强攻击者模型。
- `current` 表示 Owner 已裁决的目标合同，不表示盲目复制某一份材料。源契约、源码、运行证据或测试互相冲突时不得封装；先区分 intended contract 与 actual behavior，由 Owner 选择目标并同步另一侧及 Oracle。
- 清洁重建默认复现已声明行为，不复刻未声明的偶然缺陷。隐藏 Evaluator 只能变化已声明 Requirement 的反例和组合，不能把原实现独有行为或更强威胁模型作为秘密需求。

设计、迁移或审核 SDD 模型时读取 [references/current-system-model.md](references/current-system-model.md)。

## 命令

从本 Skill 目录运行标准库工具：

```bash
python3 scripts/sdd.py init /path/to/project/sdd --system-id example-system --name "Example System"
python3 scripts/sdd.py context /path/to/project/sdd --query "修改 API 权限"
python3 scripts/sdd.py validate /path/to/project/sdd --level structure
python3 scripts/sdd.py validate /path/to/project/sdd
python3 scripts/sdd.py bundle /path/to/project/sdd /path/to/output/example-system-sdd-0.1.0.zip
```

- `init` 只写入此前不存在的目标，生成显式 `draft` 和 TODO；它不会伪装成可重建规格。
- `context` 对 current SDD 执行完整内容门禁并校验导航图，然后按查询词为全部命中路由排序，输出系统摘要、Owner、最小读取 Artifact、Requirement/Oracle 与验证入口；草稿或含未决假设的 SDD 不提供导航结果。无匹配时返回显式默认路由。需要机器消费时加 `--json`。
- `validate --level structure` 检查 manifest、覆盖面、引用、路径、文件登记和 traceability 结构，允许草稿占位符。
- `validate` 默认执行 reconstruction 门禁：全部必要 Artifact 必须为 `current`，禁止占位符、过程材料和隐藏源码依赖。
- `bundle` 先执行完整门禁，再生成内容排序、时间戳固定且带 SHA-256 清单的 ZIP；输出必须不存在、位于 SDD 根目录之外，且文件名精确为 `<system-id>-sdd-<manifest-version>.zip`，使同系统竞争版本无法绕过检测。
- 开发中重复验证 bundle 时使用 `mktemp -d` 产生的隔离目录并比较 hash；仅在内容收敛后把一个最终 bundle 写到交付位置。不得用连续版本号把每次探针结果都留在项目父目录。

## 使用流程

1. 先由主流程确认系统边界、日常理解目标、重建目标和允许的外部输入；不从既有文档数量推断完整性。
2. 初始化 SDD，或把现有当前事实逐项迁移（不是复制）到 manifest 登记的 Artifact。迁移期间保持 `draft`，既有 canonical Owner 继续生效；用最小差分探针对照源契约、源码、运行证据和明确需求。证据矩阵留在 bundle 外，不复制历史 Proposal，也不把冲突一侧静默写成事实。
3. 对 `product`、`domain`、`contracts`、`data`、`architecture`、`ui`、`operations`、`quality`、`acceptance`、`assets` 十类逐项标为 `specified` 或有理由的 `not-applicable`。
4. 给 Requirement 稳定 ID，在 `acceptance/traceability.json` 中连接规格 Artifact 与 Oracle。
5. 在唯一 `context` Artifact 中压缩系统摘要、术语和 Owner，并按稳定任务类型建立最小路由。每条路由只引用本任务需要的 canonical Artifact 和 traceability 节点；命令或验证入口是当前可执行入口，不是历史结果。
6. 用典型任务查询 `context`，确认 Agent 无需全局搜索即可定位 Owner 和最小切片；未命中词应安全退回概览，而不是猜测任务归属。
7. 运行结构校验；完成内容、证据和 intended/actual 一致性复核，并确认原 canonical 文档已退役、链接化或成为可校验生成投影后，才把系统及必要 Artifact 状态改为 `current`。无法当场裁决的冲突或未完成的权威切换保持 draft，并退出依赖它的切片。
8. 运行完整校验，在临时目录验证确定性后只生成一个最终隔离 bundle；清理默认搜索空间内无实验或发布价值的旧版本。日常结果只表示静态闭包和导航可用，不声称已经完成清洁重建。
9. 周期性由无原项目上下文的 Agent 在隔离目录中只使用 bundle 重建切片或全系统，并由 bundle 外部的独立评估器验收。

清洁重建按 Requirement/Oracle 逐项报告；部分行为通过不能覆盖未执行的质量、性能、迁移或运维 Oracle。Evaluator 发现失败后先分类：bundle 已声明但 Builder 未实现是实现缺陷；当前规则缺失是 SDD 缺口并要求新 bundle 和 fresh Builder；bundle 明确排除或未声明、仅原实现具备的行为是评估污染，应删除该隐藏要求，不能反向补丁 Builder。

## 变更收敛

当前任务和临时 requirement/design/test packet 仍由 `ax-pipeline` 管理，并应放在默认仓库检索空间之外。
切换为 current 后，主流程在对应合同检查点直接更新唯一 canonical Artifact；交付前只验证最终仍有效的行为、约束、契约、资产和 Oracle 已经收敛，并删除临时 packet。不得再从旧 docs 向 SDD 做第二次手工同步。
新增稳定任务类型时更新 context 路由；一次性任务不得为了可发现性进入 SDD。
不得为了通过校验而把真实未知改写成确定事实，或创建没有独立判定标准的占位 Oracle。

## 交付说明

报告实际运行的典型 context 查询、结构校验、完整校验、bundle 路径与 hash，以及尚未执行的局部/完整清洁重建。
明确区分“静态门禁通过”和“独立重建通过”。
