# Admin Dashboard Scaffold Agent Guide

本目录是一套可独立运行的后台管理前端脚手架。修改时先读取本文件和 `README.md`。

本文件是在没有安装个人全局规则或 `ax-*` Skills 时仍然生效的项目级最小开发闭环。若外部工作流提出更严格的要求，从其规定；项目技术栈、目录、命令和边界以本文件为准。

## AI Working Loop

开始修改前：

1. 检查工作树，保留用户已有改动，不创建未经批准的分支。
2. 用一句话确认目标、用户可观察结果和明确不做的范围。
3. 找到现有 Owner、相似实现、可复用组件和最窄验证入口。
4. 仅当需求明确、改动局部、无公共契约或安全边界变化时使用 Fast Path；否则先写明验收标准、影响范围、风险和实现方案。

出现以下任一情况时不得直接编码：路由或用户流程变化、新依赖、共享组件契约变化、真实 API/数据模型、认证权限、安全隐私、分析语义、跨仓库契约或部署行为。先确认需求与设计，再继续。

## Project Boundaries

- React 页面与路由位于 `src/app`、`src/pages`。
- 应用壳位于 `src/layouts`，共享原语位于 `src/components/ui`。
- Dashboard 业务展示位于 `src/features/dashboard`，Mock 数据只由该 feature 的 data 文件提供。
- `DESIGN.md` 是设计契约 Owner，Foundation Token 由 `src/styles/tokens.css` 持有，主题接线与跨场景样式位于 `src/styles/index.css`。
- `src/components/design-system/publicComponentCatalog.ts` 是公开共享组件清单；Catalog 必须直接渲染清单中的真实组件，内部 Helper 通过文档明确豁免。
- 所有数据表格通过 `src/components/ui/DataTable.tsx` 渲染；页面只提供列定义和业务单元格内容。
- 所有资源列表通过 `src/components/ui/ListToolbar.tsx` 组合搜索、筛选、重置与结果摘要；页面拥有查询状态和业务过滤规则。
- 所有数据图表通过 `src/components/charts` 渲染；`ApexChart.tsx`、`apex.options.ts` 与 `apexcharts.modules.d.ts` 构成内部供应商适配层，公开组件和页面不得导入 `apexcharts`、`react-apexcharts` 或传递 `ApexOptions`。
- 真实 API、认证、权限和业务规则不属于本脚手架。接入项目时通过新的 service/adapter Owner 替换 Mock 数据。

页面只负责编排，场景组件负责领域展示，共享 UI 保持纯粹。不要在视图中复制 formatter、validator、权限判断、请求封装或业务状态机；新增逻辑前先搜索现有 Owner。

## Design and Interaction Contract

- `src/styles/tokens.css` 是项目 Token 源码 Owner；组件优先消费 daisyUI 语义类和项目 Token，不散落品牌色、固定外部视觉值或无语义的一次性样式。
- 页面标题、正文、辅助信息、Surface 间距、控件高度和焦点反馈必须消费 `--app-font-*`、`--app-line-*`、`--app-space-*`、`--app-control-*` 与 `--app-focus-*` 契约；页面不得用组件库默认尺寸建立平行密度体系。
- 有意义文本必须使用 `app-text-secondary`、`app-text-muted`、`app-text-accent` 等已验证角色，不使用 `text-base-content/<opacity>` 自行调低对比度；语义状态统一通过 `StatusBadge` 渲染。
- 外部设计参考只用于提取信息层级、密度、响应式和交互意图，不复制 Logo、品牌资产、商业文案或源代码，也不能覆盖本项目的可访问性与业务边界。
- 数据界面按相关性覆盖 Loading、Data、Empty、Error 和恢复操作；交互覆盖键盘、焦点、禁用、等待与错误反馈。
- 从 320 CSS px 等效宽度开始验证。页面不得产生整体横向滚动；宽表和图表可在自身有名称、可聚焦的容器内滚动。
- 使用语义 HTML 和原生交互元素，保持可访问名称、合理焦点顺序、清晰 `focus-visible`，并尊重 `prefers-reduced-motion`。
- 写操作接入真实服务时必须定义重复提交、并发、超时、部分失败、重试、幂等和恢复行为；前端隐藏控件不等于权限校验。

## Implementation Rules

- 实现已确认需求的最小正确方案，优先组合与复用，不为未来场景预建抽象。
- 浏览器状态只能有一个 Owner；URL、局部状态、主题偏好和远端数据不得重复存储。
- 第三方 SDK 和服务响应通过 adapter/view model 进入 UI，不向组件泄漏供应商类型。
- 不硬编码、提交或记录密钥、令牌、个人路径、个人数据和敏感 URL。
- 不吞掉错误；保留原因并向用户提供可行动的恢复信息。

## Validation

- Focused 行为测试：`npm test -- <test-file>`
- 全部行为测试：`npm test`
- 静态与设计契约：`npm run lint`
- 类型与生产构建：`npm run build`
- 完整本地门禁：`npm run verify`
- 人工检查：亮/暗主题、320px 等效窄屏、键盘导航、表格横向滚动和浏览器控制台；触达 Overlay 时必须真实打开并检查居中或锚定位置、视口包含、安全边距、Backdrop、层级和滚动。

先运行能证明改动的最窄检查；跨 Owner 或共享契约变化后再运行全部行为测试和构建。不要在每次局部编辑后机械重复全量检查，也不要把未运行的 CI/发布门禁写成已经通过。

测试保护需求、公开契约、回归风险和用户可观察行为，不因新增 helper、方法或组件自动新增永久测试。测试输入与预期应来自验收标准和边界条件，而不是复述当前实现。

## Delivery

完成时简要报告：

- 需求是否满足，以及采用了哪些现有 Owner、组件和 Token。
- 修改文件和真实运行的测试、构建、浏览器检查。
- 未验证范围、剩余风险，以及必要时的恢复方式。

行为变化时更新现有 `README.md`；公开组件或 Token 变化时更新 `DESIGN.md`。同一主题只保留一个权威说明，不创建重复文档。
