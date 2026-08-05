---
name: admin-dashboard-adapter
description: 按 Admin Dashboard Scaffold 的真实 Owner、路由与访问注册表、Session/BFF 契约、HTTP 边界、feature 分层、设计系统、图表适配层和验证命令导航实现与审查。用于修改页面、共享组件、Token、Catalog、路由、认证授权、API 契约与接入、图表或本地状态时；不保存通用工程规则。
---

# Admin Dashboard Scaffold 项目适配

本 Skill 只提供项目导航与差异。若当前环境提供通用工程 Skill 或全局规则，按其完整门禁执行；否则以仓库 `AGENTS.md` 的最小工作闭环完成需求、Owner、验证和交付。

## 必读入口

1. 完整读取仓库 `AGENTS.md`。
2. 按任务读取 [references/project-map.md](references/project-map.md) 中对应 Owner。
3. UI、Token、主题、共享组件或 Catalog 任务同时读取 `DESIGN.md`；应用行为和复制/生成方式变化时读取 `README.md`。
4. 检查目标源码、相似实现和邻近测试，不根据目录名称猜测边界。

## 项目特有路由

- 路由、深链或页面编排：从 `src/app/routes.tsx`、`src/app/router.tsx`、`src/app/App.tsx` 和 `src/app/App.test.tsx` 开始；页面、侧栏和命令搜索统一消费路由注册表。
- Session、认证或授权：从 `contracts/admin-api.openapi.json`、`contracts/README.md` 和 `src/auth` 开始；Session Provider、路由保护、侧栏与命令搜索统一消费 `accessPolicy.ts`，真实 Provider 必须按源契约实现。
- API 接入：从 `src/api/httpClient.ts` 和对应 `src/features/<domain>` 开始；HTTP client 只拥有传输、超时、取消、解析和错误分类，endpoint、响应映射、重试与恢复属于 feature service/adapter。
- 设计系统或共享 UI：从 `DESIGN.md`、`src/styles/tokens.css`、`src/components/ui`、`src/components/design-system` 和 `scripts/check-design-system.mjs` 开始。
- 图表：从 `src/components/charts` 开始；页面和公开组件不得直接依赖 ApexCharts 供应商类型或入口。
- 列表与 Mock 数据：从 `src/features/resources` 开始；`ResourceListPage.tsx` 只是路由包装，feature 按过滤→排序→分页派生数据并复用 `ListToolbar`、`DataTable`、`TablePagination` 和 `Skeleton`。
- 本地设置与主题：分别从 `src/features/settings` 和 `src/hooks/useTheme.ts` 开始；危险操作复用 `DangerZone` 与 `DestructiveActionDialog`，不要把演示存储或 Mock action 当成真实权限、审计或服务端状态。

## 不可违反的项目边界

- `DESIGN.md` 是设计契约 Owner；公开 Token、组件或变体变化必须同步真实 Catalog 和设计门禁。
- Button、字段、选择控件、表格、列表工具、分页、加载占位、锚定菜单、页签和语义状态统一从 `src/components/ui/index.ts` 公共入口消费并复用既有 Owner；生产页面不直接输出原生按钮或表单控件，不自建浮层定位或键盘模型，也不创建平行实现。
- `ApexChart.tsx` 与 `apex.options.ts` 是图表供应商隔离边界；`src/api/httpClient.ts` 是原始 HTTP 传输边界；`session.gateway.ts` 拥有已确认的认证 endpoint 适配。真实身份服务、数据库、角色模型和业务授权不属于本脚手架。
- `contracts/admin-api.openapi.json` 是唯一 BFF 源契约；前端类型、生成 Client 和后端模型不得成为平行来源。浏览器不得接触 Access Token/Refresh Token，隐藏导航或操作也不得被视为 Provider 授权。
- `node_modules`、`dist` 和生成器临时目录不是手工修改目标；生成新工程只使用已有安全生成入口。

## 验证入口

按项目地图选择最小相关检查。跨共享组件、Token、Catalog、路由或多个 Owner 的完整交付运行 `npm run verify`。涉及 Overlay、主题或响应式稳定契约时运行独立 `npm run test:browser`；完整视觉和图表细节仍需 Orca 或等价真实浏览器检查，不能用 JSDOM 证明几何布局。

行为、契约、页面、架构或公开组件变化时更新既有 canonical document，不创建重复说明。
