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
- browser-safe utilities and side-effect hooks
- i18n messages and routing
- adjacent tests, fixtures and test setup

不要根据常见目录名猜测 owner；以目标仓库实际 import 和调用关系为证据。

## 3. 技术栈适配

- React/Next/Vue/Svelte 等只影响实现手段，不改变需求、设计和测试门禁。
- Tailwind、CSS Modules、CSS-in-JS 或原生 CSS 都优先使用项目已有 Token 与组合方式。
- TanStack Query、SWR、Redux、Zustand、Pinia 或 Context 都必须先识别现有状态 owner，避免双写。
- REST、GraphQL、RPC 或 SDK 都通过项目现有 client/adapter 边界进入 UI。
- SSR/SSG/CSR 项目分别验证 hydration、server-only/client-only 边界和浏览器 API 使用。

## 4. 验证命令

从 package scripts、workspace config、CI 和项目文档中确认：

- 纯只读检查与会写报告、缓存、快照、生成源码或构建产物的命令边界
- 最小相关测试
- 全量测试
- Lint/formatter
- 类型检查
- 生产构建
- 本地预览或端到端测试

优先运行项目定义的命令，不自行发明替代命令。审查/诊断任务先检查脚本副作用，未获得修改授权时不运行会落盘的命令。若命令互相冲突或 CI 与文档不一致，先报告。

## 5. 接入结果

编辑前应能简短回答：

1. 哪个模块拥有页面和业务行为？
2. 哪些组件、规则、Token、状态和 API 可以复用？
3. 新逻辑应该落在哪一层，为什么？
4. 哪些文件和流程明确不应修改？
5. 哪些测试和手动验证能证明需求成立？
6. 哪些证据证明设计系统自身完整，并被目标页面正确采用？
