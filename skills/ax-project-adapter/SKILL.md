---
name: ax-project-adapter
description: 根据目标仓库的真实技术栈、架构、Owner、权威文档、生成目录和验证命令，识别 frontend、backend、fullstack/monorepo 或 multi-repo 形态并创建或更新精简、可脱离个人全局环境运行的项目专用 Agent Skill 适配层。用于新项目接入、迁移项目 Skill、消除全局与项目规则重复，或让适配层随架构变化同步；不用于实现业务功能。
---

# Project Adapter Builder

生成只保存“项目导航和项目差异”的薄适配层。不要把全局工程规则、领域工作流或通用质量清单复制进项目 Skill。

## 结构边界

- 全局 `AGENTS.md`：个人通用工程、安全、变更控制和交付规则。
- 通用领域 Skill：前端、后端、测试、架构等可跨项目复用的工作流。
- 项目 `AGENTS.md`：技术栈、项目命令、强制约束、权威来源，以及脱离个人全局环境时的最小工作门禁。
- 项目适配 Skill：高频入口、Owner 地图、只读/生成边界和项目特有验证导航。
- 本地实例登记表：记录哪些仓库已建立适配层及其同步状态；不进入实例仓库，也不承载项目规则正文。

项目仓库必须可以独立使用。全局规则存在时按其更完整的门禁执行；不存在时，项目 `AGENTS.md` 至少要覆盖编辑前的需求范围、Owner/复用检查、行为验证和交付报告。只保留最低闭环，不复制完整全局规范或领域质量清单。

发生冲突时按当前运行环境的指令优先级执行，并报告文档与源码冲突。不要在适配 Skill 中另建一套优先级。

## 1. 发现项目事实

若目标仓库存在适用的 `AGENTS.md`，先完整读取；不存在则记录为治理缺口。随后读取 [references/discovery-checklist.md](references/discovery-checklist.md)，并使用 `rg --files`、`rg`、项目清单、CI 配置和实际 import/调用关系确认：

- 仓库形态、语言、框架、包管理器和部署方式
- API、业务、持久化、UI、状态与副作用边界
- 设计系统、资产、国际化、权限、分析和错误处理 Owner
- 生成目录、供应商目录、敏感目录和禁止手改区域
- 测试、Lint、类型检查、构建、预览和契约同步命令
- 权威文档、相似实现和现有项目 Skill
- 前后端是否同仓、契约源定义位于何处、消费者如何同步

只记录验证过的当前事实。文档与源码冲突时先列出冲突，不生成依赖该冲突结论的规则；未发现 canonical owner、测试、CI 或部署资料时记录为缺口，不用模板补造。

### 已有 AGENTS.md 保护

- 已存在的项目或子目录 `AGENTS.md` 一律视为项目资产，只允许原地最小增量修改，不得用模板或生成内容整文件替换。
- 编辑前检查工作树和文件现状，识别已有章节、语言、格式、规则、链接及用户未提交改动；全部保留。
- 逐项比较最小 fallback 与现有规则，只补缺失能力。已有同义规则时不新增；存在冲突时报告冲突并停止覆盖该项。
- 新内容优先合并到语义最接近的现有章节；只有没有合适位置时才新增短章节，不重排或重写无关内容。
- 修改后用 diff 确认没有大段删除、无关改写、规则降级或项目约束丢失。

## 2. 分类并判断是否需要适配层

读取 [references/domain-routing.md](references/domain-routing.md)，先分类为 frontend、backend、fullstack/monorepo 或 multi-repo。分类决定需要加载的领域 Owner，不改变全局工程门禁。

仅在下列信息需要被反复导航时创建项目 Skill：

- 项目有多个不直观的 Owner 或生成边界
- 任务必须按维度读取特定设计、API、路由或领域文档
- 通用 Skill 需要映射到项目特有目录、组件、命令或交付方式

若项目 `AGENTS.md` 已足够短且完整，直接建议不创建适配 Skill。不要为了套模板制造第二份规则。

## 3. 生成薄适配层

使用以下资产作为结构起点：

- [assets/project-adapter/AGENTS.standalone.md.template](assets/project-adapter/AGENTS.standalone.md.template)（项目缺少独立运行最小门禁时合并）
- [assets/project-adapter/SKILL.md.template](assets/project-adapter/SKILL.md.template)
- [assets/project-adapter/references/project-map.md.template](assets/project-adapter/references/project-map.md.template)
- [assets/project-adapter/references/frontend-map.md.template](assets/project-adapter/references/frontend-map.md.template)（含前端时）
- [assets/project-adapter/references/backend-map.md.template](assets/project-adapter/references/backend-map.md.template)（含后端时）
- [assets/project-adapter/references/contract-map.md.template](assets/project-adapter/references/contract-map.md.template)（跨端或跨仓契约时）
- [assets/project-adapter/agents/openai.yaml.template](assets/project-adapter/agents/openai.yaml.template)

默认输出到目标仓库的 `.agents/skills/<adapter-name>/`。生成时：

1. 使用小写字母、数字和连字符命名 Skill。
2. 让 frontmatter description 同时说明能力和触发场景。
3. 用项目事实替换所有占位符，并删除不适用的章节。
4. `SKILL.md` 只保留读取顺序、任务路由、项目特有强约束和验证入口。
5. 把共享 Owner、命令和只读边界放进 `references/project-map.md`；按项目形态合并所需领域模板，删除不适用部分。
6. 链接项目 canonical document，不复制它的正文。
7. 若目标已有适配 Skill，原地精简或更新，不创建同主题第二份 Skill。
8. multi-repo 默认在每个仓库生成自己的薄适配层，并让两边指向同一个源契约 Owner；只有存在稳定的项目级根目录和反复发生的跨仓编排时才新增平台适配层。
9. 检查项目脱离个人全局目录和 `ax-*` Skill 后是否仍能完成最小闭环；缺失时只把 `AGENTS.standalone.md.template` 中缺少的条目增量合并进项目 `AGENTS.md`。不得复制整份模板覆盖已有文件；已有等价规则时不重复插入，也不要写进适配 Skill。

## 4. 登记实例与同步状态

本地唯一登记表是 [../../state/project-adapter-registry.json](../../state/project-adapter-registry.json)。它只负责实例发现和同步路由，不是项目规则来源。

每次创建、迁移或更新项目适配层后，按仓库 Git root 唯一键原地更新对应记录：

- 项目标识、仓库绝对路径和适配 Skill 相对路径
- frontend、backend、fullstack/monorepo 或 multi-repo 领域
- 发现来源和最后核验日期
- 各顶层规范 revision 的 `current`、`review-required`、`not-applicable` 或 `unknown` 状态
- 需要复核的原因；不得把未验证实例标记为 `current`

顶层 `AGENTS.md`、领域 Skill、模板或 Project Adapter 规则发生会影响实例行为的变化时：

1. 先更新登记表中的顶层 revision。
2. 按领域筛选受影响实例并标记为 `review-required`。
3. 逐个比较实例 `AGENTS.md`、适配 Skill、Owner 地图和验证入口；不要机械复制顶层规则。
4. 仅在完成差异检查和必要验证后，把该实例对应 revision 标记为 `current`，并记录核验日期。

登记扫描必须排除 `.venv`、`node_modules`、vendor、缓存和第三方依赖内的 Skill。实例被移动、删除或归档时更新原记录，不创建第二份登记表。

## 5. 检查重复与冲突

逐项比较全局规则、通用 Skill、项目 `AGENTS.md` 和生成结果：

- 删除通用需求门禁、设计门禁、测试原则和交付格式副本。
- 删除框架通识、通用可访问性清单和跨项目编码建议副本。
- 保留项目独有 Owner、命令、生成规则、设计入口、部署限制和文档同步要求。
- 同一事实只保留一个 canonical owner；适配层只链接和导航。
- 不假设目标项目存在某个全局 Skill；项目 `AGENTS.md` 必须是可独立执行的最低规则，适配 Skill 只引用它。

## 6. 验证

- 运行 Skill 结构校验器（可用时）。
- 使用 `rg` 确认无 `TODO`、占位符、示例项目名或不存在的路径。
- 检查所有链接、Owner 和命令均存在或明确标注条件。
- 比较精简前后，确认项目强约束没有丢失。
- 若修改已有 `AGENTS.md`，检查 diff 只包含预期增量，没有整文件替换、无关删除、格式重写或已有用户改动丢失。
- 在不读取个人全局目录、不调用 `ax-*` Skill 的条件下检查需求、Owner、测试和交付四个最小入口仍然存在。
- 用一个真实项目任务做只读前向测试，确认 Agent 会读取正确 Owner 且不会套用错误技术栈。
- 检查本次涉及的实例已登记，顶层 revision 与实例同步状态真实且可追溯。

交付时报告结构发现、生成/修改文件、验证结果、未解决冲突和回滚方式。
