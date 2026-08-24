# Current-system SDD Model

本参考用于创建、迁移或审核同时服务项目理解与隔离重建的 current-system SDD。普通功能开发只使用项目已提供的 context 查询结果，不需要加载本模型。

## 双用途成功定义

**项目内上下文成功**：Agent 收到当前任务后，只查询通过完整 current 内容门禁的 SDD context，就能获得系统边界、术语、责任 Owner、最小 canonical Artifact、相关 Requirement/Oracle 和验证入口；在读取该切片后可以停止全局文档搜索。SDD 不保存当前任务实例，任务语义来自本次请求。

**隔离重建成功**：一个无法读取原源码、Git 历史、旧 Proposal 和项目私有文档的独立 Agent，仅使用 SDD bundle、manifest 声明的外部依赖及必要资产，就能实现一个通过独立验收的行为等价系统。

快速理解不等于读取全部规格，重建也不等于复刻源码。两种模式共享同一批 current canonical Artifact；context 只投影索引，不复制规范。

等价范围必须由 SDD 明确，包括适用的：

- 用户流程、业务行为、不变量和状态转换；
- API、事件、错误、权限、幂等和兼容契约；
- 数据结构、生命周期、一致性、迁移与恢复语义；
- 模块边界、依赖方向和外部系统边界；
- UI 路由、状态、交互、视觉 Token、响应式与无障碍；
- 配置、部署、可观测性、备份、恢复和回滚；
- 安全、性能、可靠性、容量和兼容边界；
- 不可推导资产、固定版本、摘要、来源和许可证；
- Requirement 到独立 Oracle 的可追踪关系。

如果要求新实现采用与原系统相同的内部代码结构，必须把该结构声明成约束并解释可观察价值；否则只要求行为和质量属性等价。

安全等价只覆盖 SDD 已声明的威胁模型和保证等级。相关 Requirement 必须说明保护资产、
故障或攻击、攻击者能力、信任边界以及可观察保证；自填的责任人标签不等于独立审批，
元数据或来源摘要不等于受信内容字节的完整性验证。不得仅因现有实现出现某个安全命名，
就让 Builder 增加新的身份、角色、审批状态、签名、密钥生命周期或迁移。

## 知识分层

| 层 | 内容 | SDD bundle |
| --- | --- | --- |
| 当前定义 | 完整 current specs、机器契约、资产清单、公开 Oracle | 包含 |
| 当前导航 | 非规范系统摘要、术语、Owner 和稳定任务路由 | 包含 |
| 临时变更 | requirement/design/test 增量、探索记录 | 不包含，放在默认仓库搜索之外 |
| 历史追溯 | 已完成 Proposal、旧方案、任务、会议和验证快照 | 不包含，由 Git/PR/Issue/审计系统持有 |
| 隐藏评估 | 反例、组合边界、安全与差分数据集 | 不包含，由独立 Evaluator 持有 |

Git 历史可以解释“当时怎么变化”，但不是日常任务路由或 Builder 的默认输入。仍然影响当前实现的决策原因必须压缩成当前约束，写在其唯一 Owner 附近；已经失效的原因不保留在 SDD。

## 唯一权威与迁移切换

Current-system SDD 不是既有 `docs/` 的第二份镜像。在项目明确声明的 SDD 边界内，每个规范
主题只有一个 manifest-registered canonical Artifact，并使用一次显式切换完成迁移；边界外
的项目 `AGENTS.md`、Owner 和 canonical docs 继续按项目规则生效：

- **切换前**：SDD Artifact 保持 `draft`，既有 canonical 文档、契约或 Schema 继续权威；
  `context` 命令拒绝把草稿当作当前任务路由。
- **切换条件**：边界内的目标规范已经迁入登记 Artifact，引用和构建消费者已更新，旧位置已删除、
  改为只链接 canonical Artifact 的非规范入口，或成为具有明确生成器和漂移检查的派生投影。
- **切换后**：边界内的规范变化直接修改 owning SDD Artifact，再生成消费者投影；不得同时手写
  SDD 与旧 docs，也不得从实现反向同步一份“现状副本”。边界外规范仍修改其项目 Owner。
- **证据边界**：源码、运行状态和测试说明 actual behavior，独立 Oracle 判断目标是否兑现；
  它们不会因为与 SDD 并存而成为第二个规范来源。冲突按规格漂移处理，而不是静默选择一侧。

只有所有纳入 SDD 边界的规范主题完成该切换，系统状态才可设为 `current`。部分迁移可以用于
结构校验和差分探针，但必须保持 `draft`，不能生成可被日常 Agent 当作当前事实的导航结果。

## `current` 的语义

`current` 是项目 Owner 已裁决且准备由实现、源契约和验收共同兑现的目标系统定义，不是“最新找到的文字”，也不是“当前程序碰巧会做的所有事情”。迁移既有系统时至少抽查每个高风险 Requirement 的三类证据：canonical contract、实际运行/源码、独立 Oracle。

- 三者一致时可收敛为 current Requirement。
- canonical contract 与 actual behavior 不一致时，先报告规格漂移，由 Owner 决定修实现还是修合同；在同步完成前相关 Artifact 保持 `draft`。
- 既有 canonical contract 尚未迁入 SDD 或旧手写副本尚未退役时，属于权威切换未完成；即使内容暂时相同也不得把相关 Artifact 标为 `current`。
- 运行时偶然缺陷只有在 Owner 明确把它升级为兼容合同后才进入 SDD；否则清洁重建不负责复制该缺陷。
- 证据矩阵、差分探针结果和裁决过程属于 bundle 外的临时变更或审计材料；SDD 只保留裁决后的当前合同及可观察原因。

隐藏 Evaluator 可保留未公开的输入值、状态组合和安全反例，但只能判定 bundle 已声明的 Requirement 和攻击者能力。用更强威胁模型、原实现独有而 SDD 未声明的行为让 Builder 失败，证明的是评估污染，不是 SDD 缺口。

隐藏失败必须先归因再行动：

| 分类 | 判据 | 后续动作 |
| --- | --- | --- |
| Builder 缺陷 | bundle 已明确声明，Builder 未兑现 | 保留失败证据；实现可修复后复验 |
| SDD 缺口 | 目标行为确实必要，但 bundle 没有足够定义 | 更新 current SDD、生成新 bundle、使用 fresh Builder 重建；不能只从隐藏测试补丁旧实现 |
| 原系统漂移 | canonical contract 与 actual behavior 冲突 | Owner 裁决并同步合同、实现和 Oracle 后再实验 |
| Evaluator 污染 | 隐藏测试要求 bundle 排除、未声明或仅原实现具有的行为 | 删除该隐藏要求；不得让 Builder 迎合秘密需求 |

最终结果按 Requirement/Oracle 粒度报告。核心行为通过不能抵消未执行的性能、安全、迁移、运维或交付 Oracle；可以报告“行为切片通过”，但只有所有声明门禁闭合才能报告该切片 reconstruction-grade 通过。

## Manifest 合同

实验 profile 是 `current-system-sdd/experimental-v2`，`schema_version` 为 `2`。根 `manifest.json` 包含：

- `system`：系统 ID、名称、规格版本和 `draft/current` 状态；
- `artifacts`：唯一 ID、允许的 kind、相对路径、状态和 Owner；`asset` 还必须声明并通过
  SHA-256、来源与许可证校验；
- `coverage`：十个能力面，逐项为 `specified` 或 `not-applicable`；
- `context_artifact`：非规范导航图的 Artifact ID；
- `traceability_artifact`：Requirement/Oracle 图的 Artifact ID；
- `external_inputs`：重建所需但不随 bundle 提供的确定输入。

实验 profile 使用封闭字段集合；未知 manifest/traceability 字段直接失败，不能用自定义 notes
夹带历史过程。外部输入 kind 只允许 `asset`、`dataset`、`dependency`、`platform`、`service`
和 `toolchain`，不得把原项目源码声明成重建依赖。

Manifest 的 SHA-256 只证明 bundle 中登记资产的字节与清单一致；除非系统 Requirement 另行
声明并由运行时验证，它不代表远端来源、部署资源或业务内容具有同等级的完整性保证。

Artifact kind 只允许：

```text
context specification contract data architecture ui operation quality acceptance asset traceability
```

`context` 不属于 coverage 内容面，因为它只索引 canonical Artifact，不能成为 Requirement Owner 或取代完整规格。v1 `reconstruction-sdd/experimental-v1` 仍可被工具校验和封装，但没有 `context_artifact` 时不能执行 context 查询；迁移到 v2 必须显式补齐导航图，不能自动推断路由。

`proposal`、`task`、`plan`、`history` 和 `archive` 不是当前系统定义，不能登记为 Artifact。所有 SDD 根目录下的普通文件都必须登记；manifest 本身除外。软链接、绝对路径、反向路径和根目录外引用均被拒绝。

## Coverage 合同

以下十类必须全部显式处置：

| 类别 | 需要表达的内容 |
| --- | --- |
| `product` | Actor、能力、流程、行为边界 |
| `domain` | 模型、不变量、状态机、业务计算 |
| `contracts` | API、事件、错误、权限、兼容性 |
| `data` | Schema、生命周期、一致性、迁移 |
| `architecture` | 模块、依赖、数据流、外部边界 |
| `ui` | 路由、页面状态、交互、视觉与无障碍 |
| `operations` | 配置、部署、观测、备份、恢复、回滚 |
| `quality` | 安全威胁模型与保证等级、性能、可靠性、容量、兼容目标 |
| `acceptance` | 行为 Oracle、契约校验和验收入口 |
| `assets` | 不可推导资产、摘要、来源、许可证 |

`not-applicable` 必须有系统特有且可审查的原因；“暂未编写”“以后补充”或 TODO 不是原因。

## Traceability 合同

`traceability.json` 采用两个集合：

```json
{
  "schema_version": 1,
  "requirements": [
    {
      "id": "REQ-AUTH-001",
      "artifacts": ["SPEC-AUTH"],
      "oracles": ["ORACLE-AUTH-001"]
    }
  ],
  "oracles": [
    {
      "id": "ORACLE-AUTH-001",
      "artifact": "ACCEPTANCE-AUTH"
    }
  ]
}
```

Requirement ID 必须实际出现在所列规格 Artifact 中；Oracle 必须指向 `acceptance` Artifact。
每个在当前规范中出现的 `REQ-*` 都必须进入图，每个 Oracle 都必须保护至少一个 Requirement。

公开 Oracle 描述 Builder 可以知道的验收合同。为避免根据测试实现反向拼答案，隐藏反例和组合数据由 bundle 外部 Evaluator 持有，但必须测试相同的 Requirement 和边界，不能引入未在 SDD 声明的新产品规则。

## Context 导航合同

`context_artifact` 指向一个 JSON Artifact：

```json
{
  "schema_version": 1,
  "role": "non-normative-navigation",
  "system_summary": "一句话说明系统边界、主要 Actor 和结果",
  "default_route": "system-overview",
  "glossary": [
    {
      "term": "Manifest",
      "definition": "当前系统内的精确定义",
      "artifacts": ["CONTRACT-MANIFEST"]
    }
  ],
  "owners": [
    {
      "id": "api",
      "responsibility": "HTTP 合同和入口",
      "entrypoints": ["CONTRACT-OPENAPI"]
    }
  ],
  "routes": [
    {
      "id": "api-change",
      "keywords": ["API", "OpenAPI", "handler", "接口"],
      "glossary": ["Manifest"],
      "read": ["CONTRACT-OPENAPI", "ACCEPTANCE-API"],
      "owners": ["api"],
      "requirements": ["REQ-API-CONTRACT-001"],
      "oracles": ["ORACLE-API-CONTRACT-001"],
      "verification": ["运行公开 API contract check"]
    }
  ]
}
```

约束：

- `system_summary` 和 glossary 只帮助识别概念，必须链接 canonical Artifact，不得重写完整合同。
- 每条路由可显式选择该切片需要显示的 glossary 术语，避免因为共用一个大型规格 Artifact 就输出所有术语；未选择的术语仍可在查询精确提及时显示。
- `owners` 必须覆盖 manifest 中全部 canonical Artifact Owner；`entrypoints` 是该 Owner 的最小入口，不要求枚举全部资产，但只能指向自己拥有的 Artifact。
- 路由描述稳定任务类型，不描述某次任务、计划、进度或结果。
- 路由的 `read` 必须包含所列 Requirement 的规格 Artifact 和 Oracle 的 acceptance Artifact；Owner 必须由 `read` 中 Artifact 体现。
- 每项 current Requirement、Oracle 和除 context/traceability 之外的 Artifact 必须至少被一个路由覆盖；导航不能只覆盖常见功能而迫使冷门当前事实退回全局搜索。
- `verification` 给出项目当前验证入口，可以是命令或可执行说明；它不是曾经执行过的证据。
- 查询按关键字分数排序并返回全部命中路由，使一个显式跨边界任务不会丢失次级 Owner；无命中返回 `default_route` 并明确标记 fallback，不能猜测。关键词必须使用系统领域词，避免用泛化的“改动”“Agent”等词制造无关命中。
- Context 查询结果决定首轮阅读预算，不禁止在源码证据表明任务跨界后扩大到相邻 Artifact；扩大原因来自任务证据，不来自全局漫游。

## 验证层

1. **结构门禁**：每次草稿编辑，检查路径、登记、引用、覆盖面、context 和 traceability 结构。
2. **导航探针**：用代表性当前任务查询，确认路由可找到最小 Owner/Artifact/Oracle/验证入口；测量的是路由闭包，不证明规格内容正确。
3. **完整门禁**：封装前检查 current 状态、占位符、隐藏依赖、过程污染和 Requirement/Oracle 闭包。
4. **影响切片**：行为变更或既有系统迁移时，对同一边界运行源契约检查、实际行为差分探针与 SDD Oracle；冲突先裁决，不能靠选择有利的一侧宣称一致。
5. **局部清洁重建**：定期让无上下文 Agent 只用 bundle 重建一个能力切片。
6. **全系统清洁重建**：里程碑时在隔离环境重建，并由独立 Evaluator 验收。

每层证据都只覆盖自身：编译不等于行为测试，公开 Oracle 自测不等于隐藏验收，隐藏行为通过也不等于未执行的质量 Oracle。报告时列出实际闭合与未闭合的 Requirement，不用一个总绿灯覆盖缺口。

前两层提高置信度但不能证明规格完备；只有实际清洁重建能发现“整个需求从未被写入”的隐藏知识。

## 外部输入

公共包、第三方服务、模型、字体、媒体或基础设施可作为 `external_inputs`，但每项必须声明稳定 ID、类别、版本/协议、获取方式以及为什么不能放入 bundle。凭据只描述获取边界，永远不包含实际值。

没有版本或协议边界的第三方行为不是可重建输入。无法合法再分发的资产必须提供摘要、许可证和受控获取方式，并在清洁重建环境中验证可获得性。

## Bundle 生命周期

- 默认 Agent 搜索空间只存在一个 current bundle；manifest 内的系统版本和 bundle SHA-256 共同确定其身份。
- 静态校验和确定性探针在临时目录生成，可重复比较后丢弃，不形成版本档案。
- 只有已经作为独立 Builder 输入、正式发布/签名产物或外部引用对象的旧 bundle 才有复现价值；将它移入默认搜索空间之外的独立审计存储，并连同 hash、实验或发布引用保存。
- 没有上述引用的中间 bundle 是派生缓存，不是历史事实，删除后可由对应 Git revision 重新生成。
- 项目附近出现多个 `*-sdd-*.zip` 时，不能让 Agent按文件名猜测 current；先依据当前 manifest 和明确交付指针收敛为唯一版本。
