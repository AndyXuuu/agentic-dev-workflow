---
name: admin-dashboard-adapter
description: 按 Admin Dashboard Scaffold 的真实 Owner、设计系统、图表适配层、Mock 数据边界和验证命令导航前端实现与审查。用于修改页面、共享组件、Token、Catalog、路由、图表或本地状态时；不保存通用前端规则。
---

# Admin Dashboard Scaffold 项目适配

本 Skill 只提供项目导航与差异。若当前环境提供通用工程 Skill 或全局规则，按其完整门禁执行；否则以仓库 `AGENTS.md` 的最小工作闭环完成需求、Owner、验证和交付。

## 必读入口

1. 完整读取仓库 `AGENTS.md`。
2. 按任务读取 [references/project-map.md](references/project-map.md) 中对应 Owner。
3. UI、Token、主题、共享组件或 Catalog 任务同时读取 `DESIGN.md`；应用行为和复制/生成方式变化时读取 `README.md`。
4. 检查目标源码、相似实现和邻近测试，不根据目录名称猜测边界。

## 项目特有路由

- 路由、深链或页面编排：从 `src/app/router.tsx`、`src/app/App.tsx` 和 `src/app/App.test.tsx` 开始。
- 设计系统或共享 UI：从 `DESIGN.md`、`src/styles/tokens.css`、`src/components/ui`、`src/components/design-system` 和 `scripts/check-design-system.mjs` 开始。
- 图表：从 `src/components/charts` 开始；页面和公开组件不得直接依赖 ApexCharts 供应商类型或入口。
- 列表与 Mock 数据：从 `src/pages/ResourceListPage.tsx`、`src/pages/resource.data.ts` 或对应 `src/features` Owner 开始；页面按过滤→排序→分页派生数据，复用 `ListToolbar`、`DataTable`、`TablePagination` 和 `Skeleton`。
- 本地设置与主题：分别从 `src/features/settings` 和 `src/hooks/useTheme.ts` 开始；危险操作复用 `DangerZone` 与 `DestructiveActionDialog`，不要把演示存储或 Mock action 当成真实权限、审计或服务端状态。

## 不可违反的项目边界

- `DESIGN.md` 是设计契约 Owner；公开 Token、组件或变体变化必须同步真实 Catalog 和设计门禁。
- Button、字段、选择控件、表格、列表工具、分页、加载占位、锚定菜单、页签、语义状态和图表分别复用既有共享 Owner；生产页面不直接输出原生按钮或表单控件，不自建浮层定位或键盘模型，也不创建平行实现。
- `ApexChart.tsx` 与 `apex.options.ts` 是供应商隔离边界；真实 API、认证、权限和业务规则不属于本脚手架。
- `node_modules`、`dist` 和生成器临时目录不是手工修改目标；生成新工程只使用已有安全生成入口。

## 验证入口

按项目地图选择最小相关检查。跨共享组件、Token、Catalog、路由或多个 Owner 的完整交付运行 `npm run verify`。涉及 Overlay、主题、响应式或图表视觉时，还需通过真实浏览器验证；不能用 JSDOM 证明几何布局。

行为、契约、页面、架构或公开组件变化时更新既有 canonical document，不创建重复说明。
