---
name: ax-sdd
description: 实验性维护可重建级 SDD：为没有源码的独立 Agent 定义当前完整系统规格、可追踪验收和隔离输入 bundle。用于初始化、迁移、校验或打包 reconstruction-grade SDD，以及检查规格是否仍依赖源码、历史方案或未解决假设；不替代 ax-pipeline 的需求、架构、开发、测试与交付主流程，也不用于保存 proposal、tasks 或 Agent 推理过程。
---

# Reconstruction-grade SDD

本 Skill 是 `ax-pipeline` 的支持型能力。它治理“最终系统必须是什么”，不建立第二套开发生命周期。
只有项目明确选择可重建级 SDD 时才写入项目；实验功能不得自动迁移既有文档或改变发布门禁。

## 不变量

- SDD 是无源码重建的完整当前输入，不是变更日志、计划目录或现有实现摘要。
- 当前规格不得使用“沿用现有逻辑”“保持当前行为”“参考原实现”等隐藏依赖。
- Proposal、任务清单、探索过程、被否决方案和历史快照不进入 SDD。需要追溯时显式查询 Git、PR、Issue 或独立审计系统。
- 每项当前 Requirement 必须连接到规格 Artifact 和独立 Oracle；测试通过不能补偿规格缺失。
- Bundle 只包含 manifest 明确登记的当前 Artifact；源码、Git 历史和仓库其他文档不得被顺带打包。
- SDD 内所有实质假设必须在封装前成为已验证事实、明确需求/约束，或连同依赖内容一起删除。
- `current` 表示 Owner 已裁决的目标合同，不表示盲目复制某一份材料。源契约、源码、运行证据或测试互相冲突时不得封装；先区分 intended contract 与 actual behavior，由 Owner 选择目标并同步另一侧及 Oracle。
- 清洁重建默认复现已声明行为，不复刻未声明的偶然缺陷。隐藏 Evaluator 只能变化已声明 Requirement 的反例和组合，不能把原实现独有行为作为秘密需求。

设计或审核 SDD 模型时读取 [references/reconstruction-model.md](references/reconstruction-model.md)。

## 命令

从本 Skill 目录运行标准库工具：

```bash
python3 scripts/sdd.py init /path/to/project/sdd --system-id example-system --name "Example System"
python3 scripts/sdd.py validate /path/to/project/sdd --level structure
python3 scripts/sdd.py validate /path/to/project/sdd
python3 scripts/sdd.py bundle /path/to/project/sdd /path/to/output/example-system-sdd.zip
```

- `init` 只写入此前不存在的目标，生成显式 `draft` 和 TODO；它不会伪装成可重建规格。
- `validate --level structure` 检查 manifest、覆盖面、引用、路径、文件登记和 traceability 结构，允许草稿占位符。
- `validate` 默认执行 reconstruction 门禁：全部必要 Artifact 必须为 `current`，禁止占位符、过程材料和隐藏源码依赖。
- `bundle` 先执行完整门禁，再生成内容排序、时间戳固定且带 SHA-256 清单的 ZIP；输出必须不存在且位于 SDD 根目录之外。

## 使用流程

1. 先由主流程确认系统边界、重建目标和允许的外部输入；不从既有文档数量推断完整性。
2. 初始化 SDD，或把现有当前事实逐项迁入 manifest 登记的 Artifact。迁移时用最小差分探针对照源契约、源码、运行证据和明确需求；证据矩阵留在 bundle 外，不复制历史 Proposal，也不把冲突一侧静默写成事实。
3. 对 `product`、`domain`、`contracts`、`data`、`architecture`、`ui`、`operations`、`quality`、`acceptance`、`assets` 十类逐项标为 `specified` 或有理由的 `not-applicable`。
4. 给 Requirement 稳定 ID，在 `acceptance/traceability.json` 中连接规格 Artifact 与 Oracle。
5. 运行结构校验；完成内容、证据和 intended/actual 一致性复核后才把系统及必要 Artifact 状态改为 `current`。无法当场裁决的冲突保持 draft，并退出依赖它的切片。
6. 运行完整校验并生成隔离 bundle。日常结果只表示静态可重建置信度，不声称已经完成清洁重建。
7. 周期性由无原项目上下文的 Agent 在隔离目录中只使用 bundle 重建切片或全系统，并由 bundle 外部的独立评估器验收。

清洁重建按 Requirement/Oracle 逐项报告；部分行为通过不能覆盖未执行的质量、性能、迁移或运维 Oracle。Evaluator 发现失败后先分类：bundle 已声明但 Builder 未实现是实现缺陷；当前规则缺失是 SDD 缺口并要求新 bundle 和 fresh Builder；bundle 明确排除或未声明、仅原实现具备的行为是评估污染，应删除该隐藏要求，不能反向补丁 Builder。

## 变更收敛

临时 requirement/design/test packet 仍由 `ax-pipeline` 管理，并应放在默认仓库检索空间之外。
交付前只把最终仍有效的行为、约束、契约、资产和 Oracle 合并进 SDD；随后删除临时 packet。
不得为了通过校验而把真实未知改写成确定事实，或创建没有独立判定标准的占位 Oracle。

## 交付说明

报告实际运行的结构校验、完整校验、bundle 路径与 hash，以及尚未执行的局部/完整清洁重建。
明确区分“静态门禁通过”和“独立重建通过”。
