# Admin Dashboard Scaffold Agent Guide

本目录是一套可独立运行的后台管理前端脚手架。修改时先读取本文件和 `README.md`。

本文件是在没有安装个人全局规则或 `ax-*` Skills 时仍然生效的项目级最小开发闭环。若外部工作流提出更严格的要求，从其规定；项目技术栈、目录、命令和边界以本文件为准。

## AI Working Loop

开始修改前：

1. 检查工作树，保留用户已有改动，不创建未经批准的分支。
2. 用一句话确认目标、用户可观察结果和明确不做的范围。
3. 找到现有 Owner、相似实现、可复用组件和最窄验证入口。
4. 仅当需求明确、改动局部、无公共契约或安全边界变化时使用 Fast Path；否则先写明验收标准、影响范围、风险和实现方案。

假设只可作为临时工作假说。任何会影响行为、范围、契约、权限、数据、测试、安全或交付的假设，必须在实现、测试预期、权威文档或交付前被证实为事实、由用户明确决定为需求/约束，或者退出并清理依赖它的计划、测试、文档和代码；不得把未解决假设沉淀为项目事实。非阻断未知只能保留为不预设答案的待确认问题或证据缺口。

保留本项目已规定的安全基线，但新增安全控制必须绑定已确认的资产、威胁或故障、攻击者能力、信任边界和可观察保证。不得把防误操作自动升级为防管理员凭证失陷、内部恶意或供应链替换，也不得把 UI 提示、请求方填写的角色标签、元数据摘要或来源标识描述为独立审批或内容完整性校验。新增身份/角色、审批状态、内容摘要/签名、密钥生命周期、迁移或跨 Owner 强制属于 material 需求与设计变化；未确认时只报告限制和剩余风险，不扩大当前实现与测试。

出现以下任一情况时不得直接编码：路由或用户流程变化、新依赖、共享组件契约变化、真实 API/数据模型、认证权限、安全隐私、分析语义、跨仓库契约或部署行为。先确认需求与设计，再继续。

## Project Boundaries

- `src/app/routes.tsx` 是页面路径、导航标签、搜索说明、图标、访问要求与渲染入口的唯一注册表；`src/app/router.tsx` 只拥有 History API、深链归一化与 Link 行为，`src/pages` 只负责编排 feature。
- `src/auth/SessionProvider.tsx` 是唯一应用级 Session 状态 Owner，`accessPolicy.ts` 是路由与局部操作访问判断的唯一 Owner；页面保护、侧栏和命令搜索必须消费同一路由访问元数据，前端隐藏控件不替代 Provider 授权。
- `src/auth/session.gateway.ts` 是 Session endpoint 的前端适配边界；`contracts/admin-api.openapi.json` 是浏览器与同源 BFF 的语言无关源契约，手写前端类型与未来后端模型都只是 projection，不得反向成为第二契约源。
- 应用壳位于 `src/layouts`，共享原语位于 `src/components/ui`。
- Dashboard 业务展示位于 `src/features/dashboard`，Mock 数据只由该 feature 的 data 文件提供。
- 资源列表与设置场景分别由 `src/features/resources` 和 `src/features/settings` 持有；页面不得重新持有查询、分页、保存状态或 repository 调用。
- `src/api/httpClient.ts` 是浏览器 HTTP 传输边界；feature service 通过 `HttpClient` 接口接入真实 endpoint，生产源码不得在其他位置直接调用 `fetch`。
- `DESIGN.md` 是设计契约 Owner，Foundation Token 由 `src/styles/tokens.css` 持有，主题接线与真正跨场景样式位于 `src/styles/index.css`，Catalog、表单控件、数据表格与 Overlay 样式按职责位于 `src/styles/components`。
- `src/components/design-system/publicComponentCatalog.ts` 是公开共享组件清单；Catalog 必须直接渲染清单中的真实组件，内部 Helper 通过文档明确豁免。
- `src/lib/overlayScrollLock.ts` 是多 Overlay 页面滚动锁的唯一 Owner；Dialog、Drawer 或移动导航不得直接开关 Body 锁定状态。
- 所有数据表格通过 `src/components/ui/DataTable.tsx` 渲染；组件拥有表格语义和受控排序/选择控件，消费 feature 拥有实际数据顺序、跨页选择与批量业务规则。
- 所有资源列表通过 `ListToolbar`、`DataTable`、`TablePagination` 和 `Skeleton` 组合搜索、筛选、加载、排序、分页与当前页选择；resource feature 按过滤→排序→分页派生数据，并拥有查询复位、导出和服务端接入策略。
- 锚定操作菜单通过 Portal `DropdownMenu` 渲染，同一任务上下文内的关联视图通过受控 `Tabs` 渲染；业务页面不得自建浮层定位或页签键盘逻辑。
- 生产消费者从 `src/components/ui/index.ts` 公共入口复用按钮、文本输入、选择、多行输入、Checkbox、Radio、Switch 和 Tabs；只有这些组件 Owner 可以直接渲染原生 `<button>`、`<input>`、`<select>` 或 `<textarea>`。共享层拥有 DOM、密度、状态和可访问性关联，业务校验、权限和提交仍由 feature 拥有。
- 危险操作通过 `src/components/ui/DangerZone.tsx` 与 `DestructiveActionDialog.tsx` 组合；共享层拥有影响说明、确认、等待、错误和焦点契约，具体权限、前置条件、审计与执行仍由 feature/service 拥有。
- 所有数据图表通过 `src/components/charts` 渲染；`ApexChart.tsx`、`apex.options.ts` 与 `apexcharts.modules.d.ts` 构成内部供应商适配层，公开组件和页面不得导入 `apexcharts`、`react-apexcharts` 或传递 `ApexOptions`。分组柱间距由图表适配层和 `--app-chart-surface` 共同持有，页面不得覆盖供应商 stroke/columnWidth。
- 脚手架只提供 Session/访问控制骨架和已确认的 BFF 契约，不实现真实身份服务、数据库、密码策略、OAuth/OIDC、角色模型或业务授权。接入项目时在对应 feature 下新增 service/adapter，把传输响应映射为稳定 view model，并通过 `HttpClient` 注入传输实现后替换 Mock repository。

页面只负责编排，场景组件负责领域展示，共享 UI 保持纯粹。不要在视图中复制 formatter、validator、权限判断、请求封装或业务状态机；新增逻辑前先搜索现有 Owner。

## Design and Interaction Contract

- `src/styles/tokens.css` 是项目 Token 源码 Owner；组件优先消费 daisyUI 语义类和项目 Token，不散落品牌色、固定外部视觉值或无语义的一次性样式。
- 页面标题、正文、辅助信息、Surface 间距、控件高度、图标尺寸和焦点反馈必须消费 `--app-font-*`、`--app-line-*`、`--app-space-*`、`--app-control-*`、`--app-icon-*` 与 `--app-focus-*` 契约；页面不得用组件库默认尺寸建立平行密度体系。
- 有意义文本必须使用 `app-text-secondary`、`app-text-muted`、`app-text-accent` 等已验证角色，不使用 `text-base-content/<opacity>` 自行调低对比度；语义状态统一通过 `StatusBadge` 渲染。
- 外部设计参考只用于提取信息层级、密度、响应式和交互意图，不复制 Logo、品牌资产、商业文案或源代码，也不能覆盖本项目的可访问性与业务边界。
- 数据界面按相关性覆盖 Loading、Data、Empty、Error 和恢复操作；交互覆盖键盘、焦点、禁用、等待与错误反馈。
- 从 320 CSS px 等效宽度开始验证。页面不得产生整体横向滚动；宽表和图表可在自身有名称、可聚焦的容器内滚动。
- 使用语义 HTML 和原生交互元素，保持可访问名称、合理焦点顺序、清晰 `focus-visible`，并尊重 `prefers-reduced-motion`。
- 写操作接入真实服务时必须定义重复提交、并发、超时、部分失败、重试、幂等和恢复行为；前端隐藏控件不等于权限校验。

## Implementation Rules

- 实现已确认需求的最小正确方案，优先组合与复用，不为未来场景预建抽象。
- 浏览器状态只能有一个 Owner；URL、局部状态、主题偏好和远端数据不得重复存储。
- 浏览器不得读取或把 Access Token、Refresh Token 写入任何 Web Storage；同源 BFF Session Cookie 必须为 `Secure; HttpOnly; SameSite=Lax; Path=/`。所有状态写请求校验可信 Origin，已有身份的写请求还要校验 Session 绑定的 CSRF Header。
- 第三方 SDK 和服务响应通过 adapter/view model 进入 UI，不向组件泄漏供应商类型。
- HTTP 默认不自动重试写操作；调用方必须按读写语义明确决定重试、幂等和恢复策略。请求支持调用方取消和有限超时，错误按 HTTP、网络、超时、取消与响应解析分类，不依赖文案判断失败类型。
- 不硬编码、提交或记录密钥、令牌、个人路径、个人数据和敏感 URL。
- 不吞掉错误；保留原因并向用户提供可行动的恢复信息。

## Validation

- Focused 行为测试：`npm test -- <test-file>`
- 全部行为测试：`npm test`
- 静态与设计契约：`npm run lint`
- 代码结构契约：`npm run check:architecture`
- API 源契约：`npm run check:contracts`
- 类型与生产构建：`npm run build`
- 完整本地门禁：`npm run verify`
- 独立真实浏览器契约：`npm run test:browser`（首次运行先执行 `npm run test:browser:install`；仅在响应式、主题、Overlay 或完整 UI 交付时触发，不并入每次 `verify`）
- 人工检查：亮/暗主题、320px 等效窄屏、键盘导航、表格横向滚动和浏览器控制台；触达 Overlay 时必须真实打开并检查居中或锚定位置、视口包含、安全边距、Backdrop、层级和滚动。

先运行能证明改动的最窄检查；跨 Owner 或共享契约变化后再运行全部行为测试和构建。不要在每次局部编辑后机械重复全量检查，也不要把未运行的 CI/发布门禁写成已经通过。

测试保护需求、公开契约、回归风险和用户可观察行为，不因新增 helper、方法或组件自动新增永久测试。测试输入与预期应来自已确认的验收标准、权威契约、领域规则和边界条件，不得来自未解决假设，也不能只复述当前实现。

## Delivery

完成时简要报告：

- 需求是否满足，以及采用了哪些现有 Owner、组件和 Token。
- 修改文件和真实运行的测试、构建、浏览器检查。
- 未验证范围、剩余风险，以及必要时的恢复方式。

行为变化时更新现有 `README.md`；公开组件或 Token 变化时更新 `DESIGN.md`。同一主题只保留一个权威说明，不创建重复文档。
