---
name: ax-frontend
description: 项目无关的通用前端实现与审查流程。用于非平凡的 Web 页面、组件、交互、响应式布局、设计系统、Token、设计系统治理与采用检查、前端状态或 UI Bug 改动，以及把 Figma、截图、TypeUI、DESIGN.md 和品牌参考转换为项目设计语言；覆盖前端职责边界、完整状态、可访问性和验证。不用于仅需按 AGENTS.md Fast Path 处理的明确、局部、低风险小改动。
---

# Frontend Engineering

把本 Skill 当作“如何实施前端”，把目标项目的规则、设计系统和源码当作“做成什么样”。不要用通用流程覆盖项目自己的权威来源。

## 0. 先判定执行路径

在读取项目接入资料或质量检查表前，先读取适用的 `AGENTS.md`，检查工作树、目标文件、附近现有 Owner 与最小验证入口。

若完全满足 Fast Path，停止加载本 Skill 的其余内容及 `references/project-adoption.md`、质量检查表：直接在现有 Owner 内完成局部修改和最小验证。若范围不明确，或涉及跨组件 Owner、共享状态、API、权限、安全、分析语义、用户流程、依赖、生成或部署，则继续标准流程。

## 与其他工程 Skill 的边界

- 非平凡改动由 `ax-pipeline` 管端到端阶段，`ax-prd`/`ax-arch` 管需求与架构，`ax-frontend` 管前端专项决策与质量。
- 已有明确需求和设计时，可与 `ax-dev` 同时使用；本 Skill 补充 UI 状态、设计系统、响应式和可访问性要求。
- 纯后端、基础设施或非 UI 文档任务不使用本 Skill。

## 1. 接入目标项目

若目标仓库存在适用的 `AGENTS.md`，先完整读取；不存在则记录为治理缺口。随后读取贡献指南、架构文档、相关目录说明和 [references/project-adoption.md](references/project-adoption.md)，定位：

- 页面或路由 owner
- 业务组件与原子组件 owner
- 设计系统、Token、主题、资产和字体 owner
- 服务端状态、全局状态、局部状态和浏览器副作用 owner
- API 客户端、适配器、校验、权限和业务规则 owner
- 国际化、分析、错误处理、测试和页面文档 owner
- 项目的测试、Lint、类型检查、构建和预览命令

若文档与源码冲突，先指出冲突并确认权威来源。不要在冲突未解决时实现依赖该行为的改动。

## 2. 通过需求门禁

不符合 Fast Path 时，编辑前输出简短需求理解：

- Goal
- In scope
- Out of scope
- Acceptance criteria
- Affected modules/files
- Ambiguities, assumptions, and risks

若歧义会改变行为、数据模型、API、权限、计费、安全、分析语义或用户流程，先请求确认。

## 3. 通过设计门禁

不符合 Fast Path 时，使用 `rg`、`rg --files` 和项目原生命令搜索并报告：

- 现有 owner 与相似实现
- 可复用组件、Hook、Store、Context、Service、Helper、Token 和测试工具
- UI、状态、业务规则、API、持久化和副作用之间的边界
- 邻近回归风险、测试位置和验证命令

不得在页面或组件中复制已有 formatter、validator、mapper、API wrapper、权限判断、定价规则或业务状态机。找不到可复用实现时，说明新增 owner 的理由。

## 4. 设计最小前端改动

- 保持路由/页面负责编排，场景组件负责 UI 组合，原子组件保持纯粹可复用。
- 让业务规则和数据转换留在现有 domain/service/lib/hook owner，视图接收窄 Props 或具体 view model。
- 隔离第三方 SDK；UI 不直接依赖供应商响应、传输层类型或全局单例。
- 为状态选择唯一 owner：远端状态、跨页面 UI 状态、局部状态和 URL 状态不要重复存储。
- 写操作定义重复提交、并发、取消、部分失败、重试、幂等和恢复行为。
- 只实现已确认的最小方案；兼容层、迁移层和新依赖需要用户批准。

### 前端规模解释

- 继承全局“Code Size and AI Maintainability”口径；行数只触发审核，不单独构成违规。
- 默认审核手写 Component、Hook、Store 或功能模块超过 300 行的职责与状态边界；审核手写 HTML/template、页面组合或单文件组件超过 500 行的结构。项目规则可按框架和代码形态收紧或覆盖。
- 超阈值时检查 UI 编排、业务状态、数据转换、API、权限和浏览器副作用是否混合，以及一次局部修改需要追踪多少 Owner；只在存在独立职责、状态、复用或测试边界时拆分。
- 生成页面、第三方代码、SVG/Schema/静态数据及实质为声明式的模板先分类再判断。历史巨型文件采用基线只降不升和逐边界提取，不做无测试的大爆炸重写。

## 5. 治理并应用项目设计系统

执行 UI 改动时读取 [references/frontend-quality-checklist.md](references/frontend-quality-checklist.md)。核心规则：

- 把 Token 源码、组件实现、权威展示/文档和生产消费视为同一套设计契约；权威声明不能替代一致性证据。
- 优先复用项目组件、语义 Token、主题、字体和资产管线。
- 不把一次性视觉数值散落在组件；若项目禁止 raw/arbitrary values，严格遵守。
- 新 Token 或组件变体必须表达跨场景语义，并同步设计系统的权威展示或文档。
- 不把已有历史违规当作新实现的先例；仅修复本次直接触达范围并报告邻近遗留。
- 远端数据界面按相关性覆盖 Loading/Skeleton、Data、Error、Empty；交互覆盖 default、hover、focus-visible、active、disabled、loading、error。
- 非语义交互门禁以最终渲染 DOM 为判定对象；不得仅因 React 组件接收 `onClick` 就判违规。组件调用点、原生元素和无法静态确认的多态组件按检查表中的定义分别处理。
- 从最窄受支持视口开始，验证内容膨胀、触控、键盘、焦点、对比度、Reduced Motion 和 Overlay 行为。

当任务涉及设计系统、Token、共享 UI 组件、全局样式，或用户报告“设计标准与页面表现不一致”时，读取 [references/design-system-governance.md](references/design-system-governance.md)，先验证设计契约自身，再检查生产页面采用情况。审查/诊断任务使用其中的只读审计模式，不运行会写报告、缓存或构建产物的命令。分别报告设计契约、采用实现和自动化门禁的问题，不用一类问题替代另一类结论。

若输入是 Figma、截图、TypeUI、DESIGN.md 或外部品牌规范，先读取 [references/design-reference-adapter.md](references/design-reference-adapter.md)。外部大厂规范只用于校准适用于目标平台的原则，不能覆盖项目设计系统、业务流程、资产授权或无障碍硬约束。

## 6. 验证行为

Bug 修复按顺序执行：复现或说明无法自动复现的原因、添加修复前会失败的回归测试、实现最小修复、确认回归测试通过。

Feature 至少覆盖：

- Happy path
- Invalid input
- Edge case
- Permission/state boundary（相关时）
- Nearby regression risk

标准改动的验证顺序：最小相关测试 → 项目全量测试 → Lint/静态分析 → 类型检查 → 生产构建。UI 还要在目标页面手动验证受支持视口、主题、键盘、数据状态和控制台。Fast Path 只运行与局部改动直接相关的最小检查；除非项目明确要求，不自动追加全量测试、Lint 和生产构建。

只报告真实运行结果。环境阻塞时保留失败证据并列出未验证范围，不得把未运行写成通过。

## 7. 交付

交付时报告：

- Requirement match
- Design and reuse decisions
- Files changed
- Tests and manual checks run
- Remaining risks and unverified areas
- Rollback/recovery notes when relevant

行为、页面流程、公开组件或 Token 变化时更新项目既有权威文档，不创建重复说明。
