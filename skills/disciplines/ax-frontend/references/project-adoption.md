# 目标项目接入

迁入新项目后先完成本页盘点，不要假设框架、目录或工具链。

## 1. 权威来源

按项目实际情况定位并记录：

| 主题 | 要找的来源 | 需要确认 |
| --- | --- | --- |
| Agent/开发规则 | `AGENTS.md`、贡献指南、workspace instructions | 语言、门禁、禁止事项、交付格式 |
| 产品行为 | PRD、route/page docs、acceptance tests | 当前行为与计划是否区分 |
| 架构 | architecture/design docs、目录说明 | 模块边界和依赖方向 |
| UI 视觉标准 | Storybook、design page、design tokens、Figma/library | Token、组件、展示和生产消费各自的 owner、同步方式与验证入口 |
| API 契约 | OpenAPI/GraphQL/schema/generated clients | 生成目录、同步和验证命令 |
| 文档索引 | docs index | 每个主题的 canonical document |

若同一主题有多份说明，找出权威来源并报告冲突；不要通过新增第三份文档绕开冲突。

视觉标准的“权威”表示变更归属，不自动表示内容已经正确。接入时确认 Token 定义、组件实现、展示/文档和生产页面能否相互追踪，并确认设计系统目录是否受自动化质量门禁保护。需要审计设计系统或页面采用时读取 `design-system-governance.md`。

## 2. 代码 Owner

使用 `rg --files` 和有针对性的 `rg` 搜索以下 owner：

- routes/pages/screens
- feature or domain components
- atomic UI/component library
- tokens/themes/global styles
- asset registry/icon system/font loading
- server state/query clients
- global state/context/store
- form, validation, permission, billing, analytics, error handling
- untrusted content/sanitization, URL navigation, cross-window messaging and client storage boundaries
- supported browsers, WebView/extension/embedded hosts, polyfills and progressive enhancement
- performance budgets, runtime monitoring, image/font loading and large-list/rendering strategies
- browser-safe utilities and side-effect hooks
- i18n messages and routing
- adjacent tests, fixtures and test setup

不要根据常见目录名猜测 owner；以目标仓库实际 import 和调用关系为证据。

## 3. 技术栈适配

- React/Next/Vue/Nuxt/Svelte/Angular/Web Components 等只影响实现手段，不改变需求、设计和测试门禁；微前端、组件库、嵌入式 Widget 和无路由应用遵循其真实入口与宿主边界，不强行套页面分层。
- Tailwind、CSS Modules、CSS-in-JS 或原生 CSS 都优先使用项目已有 Token 与组合方式。
- TanStack Query、SWR、Redux、Zustand、Pinia 或 Context 都必须先识别现有状态 owner，避免双写。
- REST、GraphQL、RPC 或 SDK 都通过项目现有 client/adapter 边界进入 UI。
- SSR/SSG/CSR/Islands 项目分别验证 hydration、server-only/client-only 边界和浏览器 API 使用。
- 从 Browserslist、构建配置、兼容文档、宿主声明和真实流量确认浏览器/运行时范围；新增平台 API 或 CSS 能力时遵循项目 polyfill、fallback 和 progressive-enhancement 策略。
- 从性能预算、RUM/Lighthouse/Web Vitals、Bundle 分析和项目文档确认性能 Owner；只在改动影响启动、渲染、交互、资源或大数据量时运行相关门禁。

## 4. 验证命令

从 package scripts、workspace config、CI 和项目文档中确认：

- 纯只读检查与会写报告、缓存、快照、生成源码或构建产物的命令边界
- 本地最小单元/组件/回归测试与 scoped Lint/类型检查
- 跨 Owner、模块、package/workspace 或仓库级整体测试的触发条件
- CI/发布持有的覆盖率、审计、E2E、全量 Lint、构建、打包、部署和环境验证
- 项目已有的浏览器兼容、安全扫描、性能预算、Bundle 或 Web Vitals 门禁及其触发条件
- 本地预览、人工验证和会启动服务或写产物的命令

优先运行项目定义的命令，不自行发明替代命令。记录每层的 Owner、触发条件与是否需要本地重复；不要把所有可用命令拼成每次开发都执行的固定清单。审查/诊断任务先检查脚本副作用，未获得修改授权时不运行会落盘的命令。若命令互相冲突或 CI 与文档不一致，先报告。

## 5. 接入结果

编辑前应能简短回答：

1. 哪个模块拥有目标界面、应用入口或宿主集成及其业务行为？
2. 哪些组件、规则、Token、状态和 API 可以复用？
3. 新逻辑应该落在哪一层，为什么？
4. 哪些文件和流程明确不应修改？
5. 哪些测试和手动验证能证明需求成立？
6. 哪些证据证明设计系统自身完整，并被目标页面正确采用？
7. 目标浏览器/宿主、安全边界和性能预算中，哪些与本次改动相关？
