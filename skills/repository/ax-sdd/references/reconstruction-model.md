# Reconstruction SDD Model

本参考用于创建、迁移或审核可重建级 SDD。普通功能开发不需要加载它。

## 成功定义

可重建不等于复刻源码。成功条件是：一个无法读取原源码、Git 历史、旧 Proposal 和项目私有文档的独立 Agent，仅使用 SDD bundle、manifest 声明的外部依赖及必要资产，就能实现一个通过独立验收的行为等价系统。

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
| 临时变更 | requirement/design/test 增量、探索记录 | 不包含，放在默认仓库搜索之外 |
| 历史追溯 | 已完成 Proposal、旧方案、任务、会议和验证快照 | 不包含，由 Git/PR/Issue/审计系统持有 |
| 隐藏评估 | 反例、组合边界、安全与差分数据集 | 不包含，由独立 Evaluator 持有 |

Git 历史可以解释“当时怎么变化”，但不是 Builder 的输入。仍然影响当前实现的决策原因必须压缩成当前约束，写在其唯一 Owner 附近；已经失效的原因不保留在 SDD。

## `current` 的语义

`current` 是项目 Owner 已裁决且准备由实现、源契约和验收共同兑现的目标系统定义，不是“最新找到的文字”，也不是“当前程序碰巧会做的所有事情”。迁移既有系统时至少抽查每个高风险 Requirement 的三类证据：canonical contract、实际运行/源码、独立 Oracle。

- 三者一致时可收敛为 current Requirement。
- canonical contract 与 actual behavior 不一致时，先报告规格漂移，由 Owner 决定修实现还是修合同；在同步完成前相关 Artifact 保持 `draft`。
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

实验 profile 是 `reconstruction-sdd/experimental-v1`。根 `manifest.json` 包含：

- `system`：系统 ID、名称、规格版本和 `draft/current` 状态；
- `artifacts`：唯一 ID、允许的 kind、相对路径、状态和 Owner；`asset` 还必须声明并通过
  SHA-256、来源与许可证校验；
- `coverage`：十个能力面，逐项为 `specified` 或 `not-applicable`；
- `traceability_artifact`：Requirement/Oracle 图的 Artifact ID；
- `external_inputs`：重建所需但不随 bundle 提供的确定输入。

实验 profile 使用封闭字段集合；未知 manifest/traceability 字段直接失败，不能用自定义 notes
夹带历史过程。外部输入 kind 只允许 `asset`、`dataset`、`dependency`、`platform`、`service`
和 `toolchain`，不得把原项目源码声明成重建依赖。

Manifest 的 SHA-256 只证明 bundle 中登记资产的字节与清单一致；除非系统 Requirement 另行
声明并由运行时验证，它不代表远端来源、部署资源或业务内容具有同等级的完整性保证。

Artifact kind 只允许：

```text
specification contract data architecture ui operation quality acceptance asset traceability
```

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

## 验证层

1. **结构门禁**：每次草稿编辑，检查路径、登记、引用、覆盖面和 traceability 结构。
2. **完整门禁**：封装前检查 current 状态、占位符、隐藏依赖、过程污染和 Requirement/Oracle 闭包。
3. **影响切片**：行为变更或既有系统迁移时，对同一边界运行源契约检查、实际行为差分探针与 SDD Oracle；冲突先裁决，不能靠选择有利的一侧宣称一致。
4. **局部清洁重建**：定期让无上下文 Agent 只用 bundle 重建一个能力切片。
5. **全系统清洁重建**：里程碑时在隔离环境重建，并由独立 Evaluator 验收。

每层证据都只覆盖自身：编译不等于行为测试，公开 Oracle 自测不等于隐藏验收，隐藏行为通过也不等于未执行的质量 Oracle。报告时列出实际闭合与未闭合的 Requirement，不用一个总绿灯覆盖缺口。

前两层提高置信度但不能证明规格完备；只有实际清洁重建能发现“整个需求从未被写入”的隐藏知识。

## 外部输入

公共包、第三方服务、模型、字体、媒体或基础设施可作为 `external_inputs`，但每项必须声明稳定 ID、类别、版本/协议、获取方式以及为什么不能放入 bundle。凭据只描述获取边界，永远不包含实际值。

没有版本或协议边界的第三方行为不是可重建输入。无法合法再分发的资产必须提供摘要、许可证和受控获取方式，并在清洁重建环境中验证可获得性。
