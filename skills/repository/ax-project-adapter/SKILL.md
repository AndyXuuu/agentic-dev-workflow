---
name: ax-project-adapter
description: 根据已有源码项目或脚手架生成结果的真实技术栈、架构、Owner、权威文档、生成目录和验证命令，识别 frontend、backend、fullstack/monorepo 或 multi-repo 形态并创建或更新精简、可脱离个人全局环境运行的项目专用 Agent Skill 适配层。用于项目接入、脚手架生成后的规则适配、迁移项目 Skill、消除全局与项目规则重复，或让适配层随架构变化同步；不用于从空目录创建项目、选择脚手架或实现业务功能。
---

# Project Adapter Builder

生成只保存“项目导航和项目差异”的薄适配层。不要把全局工程规则、领域工作流或通用质量清单复制进项目 Skill。

## 结构边界

- 全局 `AGENTS.md`：个人通用工程、安全、变更控制和交付规则。
- 通用工程 Skill：前端、后端、架构等可在不同项目复用的工作流。
- 项目 `AGENTS.md`：技术栈、项目命令、强制约束、权威来源，以及脱离个人全局环境时的最小工作门禁。
- 项目适配 Skill：高频入口、Owner 地图、只读/生成边界和项目特有验证导航。

项目仓库必须可以独立使用。全局规则存在时按其更完整的门禁执行；不存在时，项目 `AGENTS.md` 至少要覆盖编辑前的需求范围、安全目标与复杂度边界、Owner/复用检查、行为验证和交付报告。只保留最低闭环，不复制完整全局规范或领域质量清单。

发生冲突时按当前运行环境的指令优先级执行，并报告文档与源码冲突。不要在适配 Skill 中另建一套优先级。

目标项目或应用包尚不存在、准备从零创建时，停止本 Skill 并先使用 `ax-project-bootstrap`。只有官方生成器完整交付源码和组织契约后，才根据生成结果更新适配层；不要先猜测框架再生成项目规则。

## 1. 发现项目事实

若目标仓库存在适用的 `AGENTS.md`，先完整读取；不存在则记录为治理缺口。随后读取 [references/discovery-checklist.md](references/discovery-checklist.md)，并使用 `rg --files`、`rg`、项目清单、CI 配置和实际 import/调用关系确认：

- 仓库形态、语言、框架、包管理器和部署方式
- API、业务、持久化、UI、状态与副作用边界
- 设计系统、资产、国际化、权限、分析和错误处理 Owner
- 生成目录、供应商目录、敏感目录和禁止手改区域
- 业务验收、Lint、类型检查、构建、预览和契约同步命令
- 聚合命令的实际子命令/依赖关系、各验证层的执行频率，以及哪些检查会被更强门禁包含
- 每项验证真正依赖的执行环境；区分 hermetic focused 检查、平台集成、CI/release 和真实外部验收
- 权威文档、相似实现和现有项目 Skill
- 前后端是否同仓、契约源定义位于何处、消费者如何同步

只记录验证过的当前事实。文档与源码冲突时先列出冲突，不生成依赖该冲突结论的规则；未发现 canonical owner、业务验收、CI 或部署资料时记录为缺口，不用模板补造。
任何会影响 Owner、边界、命令、生成目录或验证入口的假设，必须在适配层生成前被证实为事实、被用户明确决定为目标/约束，或连同依赖它的导航一起移除；不能把未解决假设写入项目地图或 Skill，也不能把目标/约束伪装成当前项目事实。

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
10. 验证导航注明 focused、integration、CI/release 和真实外部门禁的包含关系与执行环境；不得把真实服务、部署或 canonical-host 限制泛化到无该依赖的单元、组件、合同、静态或临时数据库检查。

## 4. 确定目标与同步范围

不要在本仓库持久化项目绝对路径、已接入项目清单或同步状态。多项目规则发布的唯一机器本地登记源是 `$HOME/.codex/project-registry.yaml`：

1. 当前工作目录位于具体 Git 仓库时，默认只处理该仓库。
2. 用户明确给出仓库路径或项目列表时，只处理这些目标，不自动改变 registry。
3. 用户要求“全部注册项目”“全部受控项目”或同义范围时，只读取 registry 中 `sync_rules: true` 的条目；不得扫描父目录、兄弟目录或相邻仓库推断范围。
4. registry 缺失、格式无效或路径无法解析时，停止依赖该目标集合的写操作并报告精确问题；不要改用目录扫描扩大范围。
5. 只有用户明确要求发现某个有界父目录下的候选仓库时，才在该目录中发现 Git root 和仓库自有 `.agents/skills/`，并排除 `.venv`、`node_modules`、vendor、缓存和第三方依赖。被发现不等于已注册，也不自动获得同步授权。
6. 新增、删除或改变 registry 条目只在用户明确要求时执行。
7. 顶层规则变化需要同步时，在本次确定的目标集合内按领域筛选，逐个比较 `AGENTS.md`、适配 Skill、Owner 地图和验证入口；只报告本次实际核验结果。
8. Domain SDD is opt-in per repository. Synchronize `ax-sdd` routing or SDD-specific fallback clauses only when that target repository's own `AGENTS.md` explicitly adopts Domain SDD and its existing manifest/index are authoritative. Every other registered project may keep one short non-adoption guard, but must not receive an SDD tree, Artifact model, validation command or Domain routing; preserve its existing specification Owner (for example OpenSpec or project documentation).

## 5. 检查重复与冲突

逐项比较全局规则、通用 Skill、项目 `AGENTS.md` 和生成结果：

- 删除通用需求门禁、设计门禁、测试原则和交付格式副本。
- 删除框架通识、通用可访问性清单和项目无关编码建议的副本。
- 保留项目独有 Owner、命令、生成规则、设计入口、部署限制和文档同步要求。
- 同一事实只保留一个 canonical owner；适配层只链接和导航。
- 不假设目标项目存在某个全局 Skill；项目 `AGENTS.md` 必须是可独立执行的最低规则，适配 Skill 只引用它。
- 不把未解决的项目假设留作长期缺口：在生成、同步或交付前，将其证实为事实、转成明确目标/约束，或删除依赖它的适配内容。
- 删除要求同一交付输入连续运行一个聚合目标及其被包含目标的重复规则；保留不能被聚合门禁替代的 focused 回归证据。
- 环境限制必须有已验证的平台、凭证、网络、数据或副作用依赖；没有该依赖时不得只因真实验收使用特定主机就限制全部测试。

## 6. 验证

- 运行 Skill 结构校验器（可用时）。
- 使用 `rg` 确认无 `TODO`、占位符、示例项目名或不存在的路径。
- 检查所有链接、Owner 和命令均存在或明确标注条件。
- 比较精简前后，确认项目强约束没有丢失。
- 若修改已有 `AGENTS.md`，检查 diff 只包含预期增量，没有整文件替换、无关删除、格式重写或已有用户改动丢失。
- 在不读取个人全局目录、不调用 `ax-*` Skill 的条件下检查需求、安全范围、Owner、业务验收和交付四个最小入口仍然存在。
- 用一个真实项目任务做只读前向测试，确认 Agent 会读取正确 Owner 且不会套用错误技术栈。
- 检查交付报告列出本次用户确认的目标范围和每个目标的实际核验结果，不暗示未检查项目已同步。

交付时报告结构发现、生成/修改文件、验证结果、未解决冲突和回滚方式。
