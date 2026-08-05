# Admin Dashboard Scaffold 项目地图

## 项目形态

- frontend：React 19、TypeScript、Vite、Tailwind CSS 4、daisyUI 5。
- 包管理器：npm；锁文件为 `package-lock.json`。
- 当前只包含浏览器端演示应用，没有后端、真实 API schema、认证或部署实现。

## 权威来源

| 主题 | Owner | 何时读取/更新 |
| --- | --- | --- |
| 工程与交付规则 | `AGENTS.md` | 每次任务先读；Owner、硬约束或验证入口变化时更新 |
| 应用能力与接入方式 | `README.md` | 用户可见能力、生成方式、真实项目接入或部署要求变化时更新 |
| 设计系统 | `DESIGN.md` | Token、主题、共享组件、Catalog、图表视觉或采用规则变化时更新 |
| 可执行设计 Token | `src/styles/tokens.css` | Foundation Token 的唯一数值 Owner |
| 组件样式 | `src/styles/components` | Catalog、表单控件、数据表格与 Overlay 的样式 Owner；跨场景基础规则保留在 `src/styles/index.css` |
| 公开组件清单 | `src/components/design-system/publicComponentCatalog.ts` | 共享公开组件增删或成熟度变化时更新 |
| 项目架构 | `AGENTS.md` 与真实 import/调用关系 | 未发现独立架构文档；不得用本地图替代源码事实 |

## 架构与 Owner

| 职责 | Owner | 边界/复用规则 |
| --- | --- | --- |
| 入口、路由与页面编排 | `src/main.tsx`、`src/app/App.tsx`、`src/app/router.tsx`、`src/pages` | 页面负责编排；History API 路由新增路径时同步路由类型、导航和深链测试 |
| 应用壳与全局交互 | `src/layouts` | 桌面展开/收起侧栏、侧栏账户入口、移动端左侧 Drawer、命令搜索和全局快捷键只在壳层持有；桌面与移动端均不渲染顶部工具条 |
| Dashboard 场景 | `src/features/dashboard` | 指标、图表场景和交易展示消费稳定 view model，不持有供应商配置 |
| 资源列表 | `src/pages/ResourceListPage.tsx`、`src/pages/resource.data.ts` | 页面持有查询、筛选、排序、分页、跨页选择与导出策略；按过滤→排序→分页派生当前页数据，复用列表工具、表格、分页与加载占位组件 |
| 设置与本地持久化 | `src/pages/SettingsPage.tsx`、`src/features/settings/settings.repository.ts`、`settings.danger-actions.ts` | 仅保存非敏感演示设置并演示无数据副作用的危险操作；真实服务接入需新增 service/adapter Owner |
| 主题状态 | `src/hooks/useTheme.ts` | 主题偏好与 DOM 主题接线的唯一 Owner |
| 共享 UI | `src/components/ui` | 基础控件、Tooltip、表格、分页、加载占位、Portal 菜单、Tabs 与 Overlay 的 DOM 语义、键盘、状态、尺寸和样式契约由组件拥有；生产消费者不得绕过基础组件，危险操作通过 `DangerZone` 与 `DestructiveActionDialog` 组合，业务校验、权限和副作用不得进入共享层 |
| 图表公共边界 | `src/components/charts/AreaChart.tsx`、`BarChart.tsx`、`DonutChart.tsx`、`ChartFrame.tsx` | 页面只传语义数据、状态和摘要 |
| ApexCharts 适配 | `src/components/charts/ApexChart.tsx`、`apex.options.ts`、`chart.theme.ts`、`apexcharts.modules.d.ts` | 供应商导入、类型、按需模块、主题转换与分组柱间距不得泄漏到页面 |
| 设计 Catalog | `src/pages/DesignSystemPage.tsx`、`src/components/design-system` | 直接渲染真实 Token 与公开组件，不维护展示专用平行实现 |
| 浏览器副作用 | `src/app/router.tsx`、`src/hooks/useTheme.ts`、`src/features/settings/settings.repository.ts`、`src/lib/csv.ts`、`src/lib/overlayScrollLock.ts` | 监听、Object URL、存储和焦点必须在对应生命周期清理；多 Overlay 滚动锁只由共享 Owner 引用计数 |
| 测试 | 邻近 `*.test.ts(x)`、`src/test/setup.ts` | 测试公开行为和稳定契约；真实布局由浏览器验证 |

## 生成与受保护区域

- `node_modules/` 与 `dist/` 是依赖/构建产物，不手工修改或提交。
- `scripts/create-admin-dashboard.mjs` 是安全生成入口；它复制当前脚手架、运行 `npm ci` 与 `npm run verify`，成功后才交付目标目录。
- `src/components/charts/apexcharts.modules.d.ts` 属于本地供应商适配声明，只随实际 ApexCharts 模块入口变化更新。
- `package-lock.json` 只随已批准的 npm 依赖变化更新。

## 验证命令

| 验证层 | 目的 | 命令 | 适用条件/Owner |
| --- | --- | --- | --- |
| Focused 行为 | 单个公开行为或回归 | `npm test -- <test-file>` | 局部组件、路由、CSV 或图表行为 |
| 设计契约 | Token、Catalog、共享采用和供应商边界 | `npm run check:design` | UI、Token、组件、图表或设计文档变化 |
| 静态检查 | Biome 与设计契约 | `npm run lint` | 跨文件前端改动或交付边界 |
| 整体行为 | 当前全部 Vitest 行为测试 | `npm test` | 跨 Owner、共享契约或完整交付 |
| 类型与生产包 | TypeScript 与 Vite 生产构建 | `npm run build` | 公开类型、依赖、动态导入、样式或交付边界变化 |
| 完整本地门禁 | Lint、设计契约、全部测试和构建 | `npm run verify` | 跨 Owner 或准备复制/交付脚手架时 |
| 浏览器契约 | 桌面/320px、双主题控件、Modal/Drawer/Dropdown 几何与焦点 | `npm run test:browser` | 响应式、主题、Overlay 或完整 UI 交付；首次运行先安装 Chromium |
| 人工/运行时 | 页面、主题、视口、键盘、控制台和真实几何 | `npm run dev` | 视觉、响应式、Overlay、焦点或图表变化 |

## 项目特有风险与缺口

- ApexCharts 许可资格取决于使用方组织与再分发方式；发布前以 `README.md` 链接的官方许可为准。
- History API 路由要求部署平台配置未知路径回退；仓库未提供平台专属部署配置。
- `localStorage` 只承载主题与演示设置，不得扩展为长期敏感凭据存储。
- 未发现仓库 CI 配置、生产部署 Owner、真实 API 契约、认证或权限实现；本地 `npm run verify` 不代表 CI/发布成功。
- JSDOM 不执行真实布局；代表性几何由 Playwright 浏览器契约持续保护，完整视觉判断、图表细节和控制台仍需 Orca 或等价真实浏览器证据。
