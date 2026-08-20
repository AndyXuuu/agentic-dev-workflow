---
name: ax-frontend
description: 项目无关的通用前端实现与审查流程。用于非平凡的 Web 页面、组件、交互、响应式布局、设计系统、Token、设计系统治理与采用检查、前端状态或 UI Bug 改动，以及把 Figma、截图、TypeUI、DESIGN.md 和品牌参考转换为项目设计语言；覆盖前端职责边界、完整状态、可访问性和验证。不用于仅需按 AGENTS.md Fast Path 处理的明确、局部、低风险小改动。
---

# Frontend Engineering

把本 Skill 当作“如何实施前端”，把目标项目的规则、设计系统和源码当作“做成什么样”。不要用通用流程覆盖项目自己的权威来源。

## 0. 先判定执行路径

在读取项目接入资料或质量检查表前，先读取适用的 `AGENTS.md`，检查工作树、目标文件、附近现有 Owner 与最小验证入口。

若满足 Fast Path，停止加载其余内容和引用资料，直接局部修改和最小验证。只在确认触及跨 Owner、共享状态、契约、权限、安全、用户流程、依赖、生成或部署风险时进入标准流程。其余未知只有在不影响行为或风险、无害、可逆且有检查点时才可作为临时工作假说继续；material assumption 必须先证实、转为用户明确决策，或退出并清理依赖。

本 Skill 的状态、设计系统、可访问性和验证清单均按本次改动的实际影响选择，不得自动扩展为全量审计。

## 与其他工程 Skill 的边界

- 新建前端项目、Admin Console 或独立前端包且目标 Owner 尚不存在时，先使用 `ax-project-bootstrap` 选择并完整生成已登记脚手架；本 Skill 从生成后的设计系统和源码 Owner 开始实施，不从空目录重建同类框架。
- 若由 `ax-pipeline`、`ax-dev` 或其他已确定的 primary workflow 路由，本 Skill 使用辅助模式：复用已经确认的需求、设计与验证计划，只补充前端 Owner、状态、设计系统、可访问性、浏览器边界和领域验证，不重复生命周期门禁或另做一份交付报告。
- 用户直接调用本 Skill 且当前没有其他 primary workflow 时，本 Skill 使用主模式：执行下文紧凑的需求、设计、实现、验证和交付闭环。
- 已有明确需求和设计时，可与 `ax-dev` 同时使用；本 Skill 补充 UI 状态、设计系统、响应式和可访问性要求。
- 纯后端、基础设施或非 UI 文档任务不使用本 Skill。

## 1. 接入目标项目

若目标仓库存在适用的 `AGENTS.md`，先完整读取；不存在则记录为治理缺口。随后读取贡献指南、架构文档、相关目录说明和 [references/project-adoption.md](references/project-adoption.md)，定位：

- 页面、路由、应用入口或宿主集成 owner
- 场景/功能组件与共享/基础组件 owner（按项目现有分层）
- 设计系统、Token、主题、资产和字体 owner
- 服务端状态、全局状态、局部状态和浏览器副作用 owner
- API 客户端、适配器、校验、权限和业务规则 owner
- 国际化、分析、错误处理、测试和界面/组件文档 owner
- 项目的测试、Lint、类型检查、构建和预览命令

若文档与源码冲突，先指出冲突并确认权威来源。不要在冲突未解决时实现依赖该行为的改动。

## 2. 通过需求门禁

不符合 Fast Path 时，主模式在编辑前输出简短需求理解；辅助模式复用 primary workflow 已确认的内容，只补充缺失的前端影响：

- Goal
- In scope
- Out of scope
- Acceptance criteria
- Affected modules/files
- Ambiguities, assumptions, and risks

若歧义会改变行为、数据模型、API、权限、计费、安全、分析语义或用户流程，先请求确认。

## 3. 通过设计门禁

不符合 Fast Path 时，使用 `rg`、`rg --files` 和项目原生命令搜索；主模式紧凑报告结果，辅助模式只把前端增量决策返回给 primary workflow：

- 现有 owner 与相似实现
- 可复用组件、组合逻辑（Hook/composable/service 等）、状态容器、Helper、Token 和测试工具
- UI、状态、业务规则、API、持久化和副作用之间的边界
- 邻近回归风险、测试位置和验证命令

不得在页面或组件中复制已有 formatter、validator、mapper、API wrapper、权限判断、定价规则或业务状态机。找不到可复用实现时，说明新增 owner 的理由。

## 4. 设计最小前端改动

- 遵循项目现有表现层边界；若项目采用页面/场景/基础组件分层，让入口负责编排、场景层组合任务、共享层拥有稳定视觉与交互契约。组件库、嵌入式 Widget、微前端或无路由应用不得被强行套入该层级。
- 让业务规则和数据转换留在现有 domain/service/lib/composable owner；视图通过窄输入/输出契约（Props、bindings、events、slots 等）或具体 view model 协作。
- 隔离第三方 SDK；UI 不直接依赖供应商响应、传输层类型或全局单例。
- 为状态选择唯一 owner：远端状态、跨入口/场景 UI 状态、局部状态和 URL/宿主派生状态不要重复存储。
- 写操作定义重复提交、并发、取消、部分失败、重试、幂等和恢复行为。
- 只实现已确认的最小方案；兼容层和迁移层须明确目标、成本、移除计划和验证，未包含在已确认方案中时需要用户批准。新增依赖先证明现有能力无法满足，并按项目策略评估体积、许可、安全、兼容和维护成本；只有会扩大已确认范围或项目明确要求时才等待批准。

### 前端规模解释

- 继承全局“Code Size and AI Maintainability”口径；行数只触发审核，不单独构成违规。
- 默认审核手写 Component、Hook、Store 或功能模块超过 300 行的职责与状态边界；审核手写 HTML/template、页面组合或单文件组件超过 500 行的结构。项目规则可按框架和代码形态收紧或覆盖。
- 超阈值时检查 UI 编排、业务状态、数据转换、API、权限和浏览器副作用是否混合，以及一次局部修改需要追踪多少 Owner；只在存在独立职责、状态、复用或测试边界时拆分。
- 生成页面、第三方代码、SVG/Schema/静态数据及实质为声明式的模板先分类再判断。历史巨型文件采用基线只降不升和逐边界提取，不做无测试的大爆炸重写。

## 5. 治理并应用项目设计系统

仅当 UI 改动触及其中的状态、设计系统、响应式或可访问性边界时，按需读取 [references/frontend-quality-checklist.md](references/frontend-quality-checklist.md)。核心规则：

- 把 Token 源码、组件实现、权威展示/文档和生产消费视为同一套设计契约；权威声明不能替代一致性证据。
- 优先复用项目组件、语义 Token、主题、字体和资产管线。
- 不把一次性视觉数值散落在组件；若项目禁止 raw/arbitrary values，严格遵守。
- 新全局/共享 Token 必须表达跨组件或跨场景语义；组件私有 Token 必须表达稳定的组件内部语义；一次性场景值留在对应 Owner。公开 Token 或组件变体同步设计系统的权威展示或文档。
- 不把已有历史违规当作新实现的先例；仅修复本次直接触达范围并报告邻近遗留。
- 远端数据界面按相关性覆盖 Loading/Skeleton、Data、Error、Empty；交互覆盖 default、hover、focus-visible、active、disabled、loading、error。
- 非语义交互门禁以最终渲染 DOM、可访问性树和键盘行为为判定对象；不得仅因框架组件接收点击/激活回调就判违规。框架语法相关静态规则只在目标项目采用该语法时启用，具体分类按检查表处理。
- 从项目或宿主支持的最窄视口开始，验证内容膨胀、触控、键盘、焦点、对比度、Reduced Motion 和 Overlay 行为。触达 Dialog、Modal、Drawer、Popover 或其他 Overlay 时必须真实打开，按其契约检查居中或锚定位置、所属视口/包含块内的完整包含、安全边距、Backdrop、层级、滚动和焦点；嵌入场景还需区分 Widget/iframe 与顶层宿主边界，不能用触发器存在或打开回执代替展开后的布局证据。

当任务涉及设计系统、Token、共享 UI 组件、全局样式，或用户报告“设计标准与页面表现不一致”时，读取 [references/design-system-governance.md](references/design-system-governance.md)，先验证设计契约自身，再检查生产页面采用情况。审查/诊断任务使用其中的只读审计模式，不运行会写报告、缓存或构建产物的命令。分别报告设计契约、采用实现和自动化门禁的问题，不用一类问题替代另一类结论。

若输入是 Figma、截图、TypeUI、DESIGN.md 或外部品牌规范，先读取 [references/design-reference-adapter.md](references/design-reference-adapter.md)。外部大厂规范只用于校准适用于目标平台的原则，不能覆盖项目设计系统、业务流程、资产授权或无障碍硬约束。

## 6. 验证行为

Bug 修复按顺序执行：取得修复前失败证据、按全局 Test Admission Gate 判断是否保留永久回归测试、实现最小修复、确认同一证据转为通过。可自动化的稳定行为优先添加失败测试；真实布局、动画、浏览器兼容等无法由当前测试环境可靠断言时，使用修复前后的浏览器计算结果、E2E、视觉证据或明确的人工步骤，不制造伪测试。

Feature 从下列类别中只选择被改动实际影响的场景，不按清单机械补齐：

- Happy path
- Invalid input
- Edge case
- Permission/state boundary（相关时）
- Nearby regression risk

本地先运行能证明改动行为和邻近风险的最小测试、scoped Lint/静态分析或类型检查，并在目标界面、入口或宿主环境验证相关视口、主题、键盘、数据状态和控制台。跨组件 Owner、共享契约或高风险改动再升级到模块/项目级测试；完整测试、覆盖率、E2E、审计和生产构建若由项目 CI/发布门禁持有，按该门禁执行，不因本地实现完成就机械重复。Fast Path 只运行与局部改动直接相关的最小检查。

运行 `check`、`build` 或其他聚合脚本前检查其实际子命令；若后续门禁已包含相同 test、typecheck、lint 或 build，不在同一交付输入上重复执行。只有真实浏览器、宿主、凭证或发布环境依赖的检查才绑定该环境，纯组件和静态检查留在最快可用反馈环。

只报告真实运行结果。环境阻塞时保留失败证据并列出未验证范围，不得把未运行写成通过。

## 7. 交付

主模式交付时报告以下相关项；辅助模式只把前端决策、验证证据和剩余风险合并回 primary workflow，不生成第二份交付：

- Requirement match
- Design and reuse decisions
- Files changed
- Tests and manual checks run
- Remaining risks and unverified areas
- Rollback/recovery notes when relevant

行为、页面流程、公开组件或 Token 变化时更新项目既有权威文档，不创建重复说明。
