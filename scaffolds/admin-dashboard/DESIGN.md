# Admin Dashboard Design System

本文是本脚手架视觉与交互契约的唯一权威说明。实现源码仍是可执行事实：Foundation Token 位于 `src/styles/tokens.css`，共享组件位于 `src/components/ui`，Catalog 位于 `/design-system`。

## Design Intent

本后台脚手架面向高频管理任务，采用清晰层级、中等信息密度、低对比度分隔线和稳定双主题。外部参考只用于校准信息组织、响应式与交互意图，不复制品牌、资产或固定视觉数值。

## Foundation

| 领域 | Token Owner | 使用规则 |
| --- | --- | --- |
| 壳层尺寸 | `--app-shell-*` | 只用于侧栏、顶部栏和内容宽度 |
| 圆角 | `--app-radius-*` | Surface、Overlay、Control 分层，不在页面重复定义 |
| 边框 | `--app-border-*` | 默认使用低对比度语义分隔，不用粗线框住每个单元格 |
| 阴影 | `--app-shadow-*` | 只表达 Surface 与 Overlay 层级 |
| Motion | `--app-motion-*` | 只用于状态反馈，并服从 Reduced Motion |
| 表格与列表工具 | `--app-table-*` | 由 `DataTable`、`ListToolbar` 消费，页面不得平行实现表格皮肤或筛选工具布局 |
| 图表 | `--app-chart-*` | 由 `components/charts` 独占消费，统一主题、色序、网格、Tooltip 与 Legend |

颜色角色来自 daisyUI 的 `base`、`primary`、`success`、`warning`、`error`、`info` 语义主题；项目 Token 只在稳定跨组件语义出现时扩展，不复制底层 primitive 色板。

## Component Contract

| 组件 | Owner | 契约 |
| --- | --- | --- |
| `DataTable` | `src/components/ui/DataTable.tsx` | 语义 caption、命名滚动区域、柔和表头、低对比度行分隔、末行收口、surface/embedded 两种容器 |
| `ListToolbar` | `src/components/ui/ListToolbar.tsx` | 受控搜索、单维筛选、重置、结果摘要、`aria-controls` 与从窄屏开始的排列；业务过滤规则仍由页面拥有 |
| `Modal` | `src/components/ui/Modal.tsx` | Native dialog、Escape、背景关闭、初始焦点、关闭后焦点恢复、滚动锁定 |
| `Panel` | `src/components/ui/Panel.tsx` | 标题、说明、可选操作与内容编排 |
| `PageState` | `src/components/ui/PageState.tsx` | Loading、Empty、Error 与恢复动作 |
| `StatusBadge` | `src/components/ui/StatusBadge.tsx` | success、warning、error、info、neutral 语义状态 |
| `AreaChart` | `src/components/charts/AreaChart.tsx` | 平滑趋势、渐变面积、语义序列、数据摘要与完整数据状态 |
| `BarChart` | `src/components/charts/BarChart.tsx` | 分类对比、分组柱、统一柱形圆角、语义序列、数据摘要与完整数据状态 |
| `DonutChart` | `src/components/charts/DonutChart.tsx` | 分类占比、中心汇总、统一色序、数据摘要与完整数据状态 |
| `ApexChart` | `src/components/charts/ApexChart.tsx`、`apex.options.ts` | 内部第三方适配层，负责 ApexCharts 渲染、配置和 Reduced Motion；公开组件与页面不得依赖供应商类型 |

原生 Button、Input、Select 继续使用 daisyUI 语义组件。只有出现跨场景行为或样式契约时才新增项目包装组件。

## Table Visual Contract

表格的“圆滑”来自结构，而不是复制某个参考站的圆角值：

1. Surface 容器拥有项目圆角、细边框和裁切。
2. 表格使用 `border-collapse: separate` 与零间距。
3. 单元格仅使用低对比度底部分隔线，最后一行不画线。
4. Hover 只提供轻微背景反馈，不改变布局。
5. 二维内容在命名且可聚焦的局部区域滚动，页面本身不得横向溢出。

## List Header Contract

资源列表采用三层结构：页标题区说明任务并承载导出/新增等页级动作；`ListToolbar` 承载搜索、筛选、重置和结果反馈；`DataTable` 承载数据语义与局部横向滚动。工具栏和数据状态位于同一 Surface，Loading、Empty、Error 时工具栏保持可见，用户可以直接修改或重置条件。

`ListToolbar` 是受控视图组件，不解析查询、不筛选数据、不决定权限，也不拥有导出和创建流程。窄屏按搜索、筛选、重置的任务顺序纵向排列，宽屏再增强为单行；搜索和筛选必须通过 `aria-controls` 指向持续存在的结果区域。

## Consumer Map

| Consumer | Shared components | State coverage |
| --- | --- | --- |
| Dashboard | Panel、DataTable、StatusBadge、Modal | Data、导出反馈、详情 Overlay |
| Resource Lists | PageHeader、ListToolbar、DataTable、PageState、StatusBadge、Modal | Loading、Data、Empty、Error、Search、Filter、Reset、Export、Create、Details |
| Settings | PageHeader | Dirty、Saving、Saved、Error、Invalid input |
| Design System Catalog | 直接导入真实共享组件 | Light/Dark、组件状态与表格契约 |

## Verification

- `npm run check:design`：Token、个人数据、禁止的壳层硬编码与平行 `<table>` 检查。
- `npm run lint`：TypeScript、React Hooks、JSX 可访问性和设计契约静态检查。
- `npm test`：用户行为、回归边界和共享组件契约。
- Orca：亮/暗主题、320px、键盘 Overlay、表格滚动、控制台和实际视觉。

Catalog 是展示入口，不是第二套实现；任何示例必须直接导入真实组件。

## Chart Visual Contract

图表以 ApexCharts 为渲染引擎，但项目设计系统拥有最终视觉契约：

1. 页面只提供分类、序列、摘要和业务单位，不传递 `ApexOptions`。
2. `chart.theme.ts` 从 `--app-chart-*` Token 解析亮暗主题，统一色序、网格与标签。
3. Area Chart 统一使用平滑曲线、克制渐变和低对比度虚线网格；Bar Chart 统一使用分组柱、柱末端圆角和克制间距；Donut Chart 统一使用中心汇总和底部 Legend。
4. Loading、Empty、Error、Data 状态由 `ChartFrame` 持有；错误状态可提供恢复动作。
5. 每个图表必须提供场景化名称和文本数据摘要，视觉图形不能成为理解数据的唯一方式。
6. 动画服从 `prefers-reduced-motion`；图表宽度不得导致页面整体横向滚动。
