# Admin Dashboard Scaffold

一套可单独复制、安装和运行的 React 后台管理脚手架。视觉方向参考现代数据后台，但不依赖参考站点的品牌、账号、业务接口或商业资产。

## 能力

- 桌面可收起侧栏、侧栏账户入口、移动端左上角入口与左侧 Drawer，以及键盘快速导航
- 亮色 / 暗色主题及本地偏好保存
- Dashboard 指标、趋势图、分类占比、交易表格与活动流
- ApexCharts 共享图表体系，统一面积图、柱状图、环图、主题、Tooltip、Legend 和数据状态
- Orders、Products、Customers 管理页面骨架，以及统一的列表搜索、状态筛选、受控排序、分页、当前页选择、重置、导出和创建操作
- 分区式 Settings、保存状态与操作栏，以及只演示交互、不破坏数据的危险操作接入骨架
- Loading、Empty、Error 演示状态
- 统一排版、双主题 AA 文本角色与紧凑密度 Token、柔和可访问焦点、Reduced Motion 与窄屏适配
- Button、TextInput、Select、Textarea、Checkbox、RadioGroup、Switch、Tooltip、DropdownMenu、Tabs、TablePagination、Skeleton 等可直接复用的基础组件库
- 单一路由注册表，同时驱动页面渲染、桌面/移动导航与命令搜索，新增页面不再维护多份元数据
- 路由访问元数据、统一 Session 状态机、页面访问边界与局部 `PermissionGate`；直接深链、侧栏和命令搜索共享同一权限策略
- 同源 BFF + HttpOnly Cookie Session 骨架，默认 Demo Gateway 保持脚手架开箱可用，并可替换为真实 `HttpSessionGateway`
- 可注入的 `HttpClient` 传输边界，内置有限超时、调用方取消、JSON/空响应处理和结构化错误，默认不替业务决定重试
- `contracts/admin-api.openapi.json` OpenAPI 3.1 源契约，覆盖 Session 建立、读取、续期、幂等退出、RFC 9457 错误、Request ID、CSRF 与 Cookie 安全属性
- Mock repository 边界，便于替换为真实 API client
- 独立 `AGENTS.md` AI 开发闭环，覆盖风险分流、Owner、设计、测试与交付规则
- 仓库内 `admin-dashboard-adapter` 薄适配 Skill，导航页面、设计系统、图表、Mock 数据与验证 Owner
- `DESIGN.md`、完整 Token/真实组件 Catalog 与设计系统静态门禁
- 安全生成入口：目标存在即拒绝，临时目录验证通过后才交付

## 独立运行

```bash
npm install
npm run dev
```

生产验证：

```bash
npm test
npm run lint
npm run build
```

一次执行完整本地门禁：

```bash
npm run verify
```

涉及响应式、主题或 Overlay 几何的完整交付，首次运行先安装 Chromium，再执行独立浏览器契约：

```bash
npm run test:browser:install
npm run test:browser
```

浏览器契约不并入每次 `verify`，避免局部迭代重复承担真实浏览器启动成本。

## 安全生成新工程

从本目录执行：

```bash
npm run create -- /path/to/new-admin-project
```

生成器拒绝任何已存在的目标目录；它先复制到同级临时目录，执行 `npm ci` 和 `npm run verify`，成功后才原子交付。失败会清理临时目录，不覆盖目标文件。

## 设计系统

- 权威契约：`DESIGN.md`
- Foundation Token：`src/styles/tokens.css`
- 共享组件：`src/components/ui`
- 组件样式：`src/styles/components`，按 Catalog、表单控件、数据表格与 Overlay 的真实 Owner 拆分
- 公开组件清单：`src/components/design-system/publicComponentCatalog.ts`
- 真实组件 Catalog：应用内 `/design-system`
- Token Catalog：顶部吸顶分类导航，列举全部项目与主题语义 Token、当前主题计算值、用途和视觉预览，并由静态门禁防止注册表漂移
- 表格：统一使用受控 `DataTable` 与 `TablePagination`，由页面按过滤、排序、分页顺序派生当前页数据，并拥有跨页选择和导出策略
- 列表工具：统一使用 `ListToolbar`，页面仅持有搜索值、筛选值和业务过滤规则
- 浮层与分组：锚定操作统一使用 Portal `DropdownMenu`，同一上下文视图切换使用受控 `Tabs`；加载占位按真实内容形状组合 `Skeleton`
- 基础控件：生产页面统一消费 `Button`、`FormField` 与各类表单组件；共享层负责 DOM 语义、密度、状态和可访问性关联，页面继续负责业务校验与提交
- 状态标签：统一使用 `StatusBadge`，其 success、warning、error、info、neutral 组合均由共享组件持有并按双主题验证
- 进度反馈：统一使用原生语义 `ProgressBar`，覆盖确定/不确定状态、可见状态值、数值边界与语义色调，业务任务状态仍由消费页面持有
- 危险操作：`DangerZone` 统一入口与影响说明，`DestructiveActionDialog` 统一确认短语、等待、防重复提交、错误和焦点；权限、二次认证、审计、幂等与真实执行由接入项目的后端拥有
- 图表运行时：通过 ApexCharts 官方 tree-shaking 入口按需加载 core、面积图、柱状图、环图及必要交互功能，不打包未使用图表类型；分组柱通过图表 Surface Token 保持组内视觉间距

## 接入真实项目

1. 在 `src/features/<domain>/` 建立场景组件、状态控制器和数据 owner，让 `src/pages` 只做路由级编排。
2. 在 `src/app/routes.tsx` 注册路径、导航标签、搜索说明、图标和页面渲染入口；不要在侧栏或命令搜索复制元数据。
3. 在同一路由项声明 `access`，通过 `src/auth/accessPolicy.ts` 统一保护深链、导航和页面；局部操作使用 `PermissionGate`，但服务端仍须重新授权。
4. 先更新 `contracts/admin-api.openapi.json`，再生成或实现前后端 projection；当前 `session.types.ts` 是无生成器依赖的临时消费者 projection，不是源契约。
5. 使用 `HttpSessionGateway` 接入同源 BFF；Access Token/Refresh Token 不得进入浏览器，Session Cookie 必须保持 HttpOnly 安全属性。所有状态写请求校验 Origin，已有身份的写请求还要校验 Session 绑定的 CSRF Header。
6. 在 feature 下建立 service/adapter，依赖 `src/api/httpClient.ts` 暴露的 `HttpClient`，把传输响应转换为稳定 view model；不要让页面直接 `fetch` 或消费服务响应类型。
7. 在 `src/styles/tokens.css` 调整语义 Token，并同步 `DESIGN.md` 与 Catalog，不直接复制外部品牌值。
8. 为真实写操作补充重复提交、超时、部分失败、恢复和幂等行为；`HttpClient` 默认无重试，避免悄然重复写入。

## 代码结构

- `src/app/routes.tsx`：应用路由元数据、访问要求和页面入口；`router.tsx` 只处理浏览器 History 行为。
- `src/auth/index.ts`：认证模块公共入口；Session 状态、Gateway、统一访问策略、路由保护和局部权限门的实现都收敛在 `src/auth`。
- `contracts/admin-api.openapi.json`：浏览器与同源 BFF 的唯一 API 源契约；`contracts/README.md` 只说明 Ownership、派生和兼容规则。
- `src/api/httpClient.ts`：HTTP 传输、超时、取消、响应解析和结构化错误；endpoint 与业务恢复策略留在 feature service。
- `src/components/ui/index.ts`：共享 UI 公共入口；组件内部实现仍保留在各自 Owner 文件。
- `src/features/<domain>`：场景视图、状态控制器、Mock repository、adapter 和 view model。
- `src/pages`：路由级薄编排，不持有领域状态机或传输逻辑。
- `scripts/check-architecture.mjs`：阻止路由元数据、UI 深层导入和直接网络调用重新分散。
- `scripts/check-api-contract.mjs`：验证 OpenAPI 版本、关键 Session operation、Cookie/CSRF/Request ID 与 Problem Details 安全约束。

## 状态 Ownership

- Session 是唯一应用级全局状态，由 `SessionProvider` 以 `loading / authenticated / anonymous / error` 状态机持有；读取失败可重试，续期和退出可取消且后到请求不能覆盖新状态。
- 当前路径和深链归一化只由 Router 持有；侧栏、命令搜索和当前页面不复制路径状态。
- 主题只由 `useTheme` 持有，Web Storage 仅保存已登记的非敏感主题与演示设置；认证信息不得进入 Web Storage。
- 远端业务数据由对应 feature repository/service 持有，局部交互由组件或 feature Hook 持有；脚手架不引入 Redux/Zustand 或“大一统 Store”。

## 来源边界

参考页面用于提取信息层级、数据密度、响应式网格和双主题等设计意图。本项目没有复制其 Logo、作者信息、购买入口、图片资产或源代码。

## ApexCharts 许可证

本脚手架按使用方已确认可采用 ApexCharts 的前提集成 `apexcharts` 与 `react-apexcharts`。ApexCharts 当前采用双重授权，社区免费资格、商业使用及 OEM/再分发条件可能随组织营收和产品形态不同；复制或发布本脚手架前，使用方必须依据 [ApexCharts 官方许可证](https://apexcharts.com/license/) 独立确认并承担授权合规责任。

## SPA 部署要求

本项目使用 History API 路由。生产服务器必须把未知页面路径回退到 `index.html`，否则直接刷新 `/orders`、`/products` 等深链会返回 404。不同平台应使用其官方 SPA rewrite 配置；部署验收至少覆盖深链打开、刷新和浏览器前进/后退。
