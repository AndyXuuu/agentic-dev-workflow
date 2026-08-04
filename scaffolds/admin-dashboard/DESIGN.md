# Admin Dashboard Design System

本文是本脚手架视觉与交互契约的唯一权威说明。实现源码仍是可执行事实：Foundation Token 位于 `src/styles/tokens.css`，共享组件位于 `src/components/ui`，Catalog 位于 `/design-system`。

## Design Intent

本后台脚手架面向高频管理任务，采用清晰层级、紧凑信息密度、低对比度分隔线和稳定双主题。外部参考只用于校准信息组织、响应式与交互意图，不复制品牌、资产或固定视觉数值。

## Foundation

| 领域 | Token Owner | 使用规则 |
| --- | --- | --- |
| 壳层尺寸 | `--app-shell-*` | 只用于侧栏、顶部栏和内容宽度 |
| 排版与文本 | `--app-font-size-*`、`--app-line-height-*`、`--app-text-*` | 页面标题、关键指标、区块标题、正文、控件和辅助信息使用固定语义层级；有意义文本在双主题满足 WCAG 2.2 AA，不消费组件库偶然默认值或透明度工具类 |
| 密度与间距 | `--app-space-*` | 页面、Surface、工具栏和控件间距按任务邻近关系组合，不在消费者中建立第二套尺度 |
| 控件与焦点 | `--app-control-*`、`--app-focus-*`、`--app-primary-action-*` | 桌面端采用紧凑控件，粗指针设备提高点击高度；焦点使用低强度边框与柔和外环，Primary action 在双主题保持可读性 |
| 圆角 | `--app-radius-*` | Surface、Overlay、Control 分层，不在页面重复定义 |
| 边框 | `--app-border-*` | 默认使用低对比度语义分隔，不用粗线框住每个单元格 |
| 阴影 | `--app-shadow-*` | 只表达 Surface 与 Overlay 层级 |
| Motion | `--app-motion-*` | 只用于状态反馈，并服从 Reduced Motion |
| 表格与列表工具 | `--app-table-*` | 由 `DataTable`、`ListToolbar` 消费，页面不得平行实现表格皮肤或筛选工具布局 |
| 图表 | `--app-chart-*` | 由 `components/charts` 独占消费，统一主题、色序、网格、Tooltip 与 Legend |

颜色角色来自 daisyUI 的 `base`、`primary`、`success`、`warning`、`error`、`info` 语义主题；项目 Token 只在稳定跨组件语义出现时扩展，不复制底层 primitive 色板。

Catalog 的 Foundation Tokens 区域是公开 Token 的可视索引：按语义颜色、排版、间距、圆角、边框与表面、控件与焦点、壳层、层级与动效、图表分组，展示 Token 名称、当前主题计算值、用途和限制。数值仍由 `tokens.css` 或 daisyUI 主题持有，Catalog 不复制第二份值；静态门禁要求所有 `--app-*` 定义与 Catalog 注册表一一对应。

Catalog 顶部提供吸顶分类导航，固定链接到 Foundation Tokens、控件状态、组件清单、列表工具、图表和页面状态。新增大型 Catalog 区块时必须同时注册顶部入口和稳定锚点；分类导航允许窄屏横向滚动，不引入独立路由或重复页面状态。

公开组件清单由 `src/components/design-system/publicComponentCatalog.ts` 持有，Catalog 直接消费该清单；`DESIGN.md` 说明公开契约，静态门禁校验清单中的每个组件同时存在文档条目和真实 Catalog 示例。`ApexChart` 等内部适配层不进入公开清单。

## Component Contract

| 组件 | Owner | 契约 |
| --- | --- | --- |
| `DataTable` | `src/components/ui/DataTable.tsx` | 语义 caption、命名滚动区域、柔和表头、低对比度行分隔、末行收口、surface/embedded 两种容器 |
| `ListToolbar` | `src/components/ui/ListToolbar.tsx` | 受控搜索、单维筛选、重置、结果摘要、`aria-controls` 与从窄屏开始的排列；业务过滤规则仍由页面拥有 |
| `Modal` | `src/components/ui/Modal.tsx` | Native dialog、默认视口居中、窄屏安全边距、Backdrop、Escape、背景关闭、初始焦点、关闭后焦点恢复、滚动锁定；全局 Reset 后必须显式保留居中定位契约 |
| `PageHeader` | `src/components/ui/PageHeader.tsx` | 每页唯一主标题、说明、Eyebrow 与页级操作编排 |
| `Panel` | `src/components/ui/Panel.tsx` | 标题、说明、可选操作与内容编排 |
| `PageState` | `src/components/ui/PageState.tsx` | Loading、Empty、Error 与恢复动作 |
| `ProgressBar` | `src/components/ui/ProgressBar.tsx` | 原生 progressbar 语义、确定/不确定进度、可见标签和值、数值边界保护，以及 primary、success、warning、error、info、neutral 语义色调；业务任务状态、上传和轮询由消费者拥有 |
| `StatusBadge` | `src/components/ui/StatusBadge.tsx` | success、warning、error、info、neutral 语义状态；颜色与文案共同表达状态，前景/柔和背景组合在双主题达到普通文本对比度 |
| `DesignTokenCatalog` | `src/components/design-system/DesignTokenCatalog.tsx` | Catalog 专用公开 Token 索引，从运行时计算样式读取当前主题值，并提供分组、用途与视觉预览 |
| 原生 Button / Input / Select | daisyUI 语义类 + `src/styles/index.css` | 共享 md/sm 高度、字号、圆角、边框和 focus-visible；消费者只选择语义 variant，不覆盖基础密度 |
| `AreaChart` | `src/components/charts/AreaChart.tsx` | 平滑趋势、渐变面积、语义序列、数据摘要与完整数据状态 |
| `BarChart` | `src/components/charts/BarChart.tsx` | 分类对比、分组柱、统一柱形圆角、语义序列、数据摘要与完整数据状态 |
| `DonutChart` | `src/components/charts/DonutChart.tsx` | 分类占比、中心汇总、统一色序、数据摘要与完整数据状态 |
| `ApexChart` | `src/components/charts/ApexChart.tsx`、`apex.options.ts`、`apexcharts.modules.d.ts` | 内部第三方适配层，负责 ApexCharts 渲染、配置、缺失的 side-effect module 声明和 Reduced Motion；公开组件与页面不得依赖供应商类型 |

原生 Button、Input、Select 继续使用 daisyUI 语义组件。只有出现跨场景行为或样式契约时才新增项目包装组件。

## Typography and Density Contract

排版保持六个稳定角色：页面标题、关键指标、区块标题、正文、控件文本和辅助信息。页面标题只用于每页唯一主标题；关键指标只用于数据卡主数值；区块标题建立 Surface 层级；正文承担高频阅读；控件文本为紧凑操作优化；辅助信息不得承载唯一关键含义。Catalog 必须直接展示这些真实角色以及 Input、Select、Button 的实际尺寸、焦点与 invalid 状态。

次级正文使用 `app-text-secondary`，元数据和辅助信息使用 `app-text-muted`，Eyebrow 等文字强调使用 `app-text-accent`，字段与恢复错误使用 `app-text-error`。消费者不得通过 `text-base-content/<opacity>` 或未经验证的主题色工具类自行创造文本层级；禁用控件透明度由控件组件持有，不作为普通文本先例。

页面使用统一内容间距，Surface 使用统一内边距，列表工具使用更紧凑的工具间距。标准控件在桌面环境使用紧凑高度，`btn-sm` 用于表格或页头的次级操作；粗指针设备通过 Token 自动提高标准控件高度，不要求业务页面维护移动端副本。

输入类控件获得焦点时，由控件容器统一呈现轻量边框和低透明度外环；内部原生 input 不再绘制第二层粗轮廓。其他键盘交互元素仍保留清晰的全局 `focus-visible`，不得用 `outline: none` 移除而不提供等价状态。

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
| Design System Catalog | 直接导入真实共享组件与公开组件 manifest | Light/Dark、控件 invalid、Modal、确定/不确定进度、Loading、Empty、Error 与表格契约 |

## Verification

- `npm run check:design`：Token 定义与 Catalog 注册表一一对应、公开组件 manifest 与文档/真实示例一致、语义文本与 `StatusBadge` 采用、主题语义角色、个人数据、禁止的壳层硬编码与平行 `<table>` 检查。
- `npm run lint`：TypeScript、React Hooks、JSX 可访问性和设计契约静态检查。
- `npm test`：用户行为、回归边界和共享组件契约。
- Orca：亮/暗主题、320px、键盘 Overlay、表格滚动、控制台和实际视觉；触达 Overlay 时必须真实打开并检查居中或锚定位置、视口包含、Backdrop 和层级。

Catalog 是展示入口，不是第二套实现；任何示例必须直接导入真实组件。

## Chart Visual Contract

图表以 ApexCharts 为渲染引擎，但项目设计系统拥有最终视觉契约：

1. 页面只提供分类、序列、摘要和业务单位，不传递 `ApexOptions`。
2. `ApexChart.tsx` 只加载 ApexCharts core、当前实际使用的图表类型以及 Legend/Keyboard 功能；`chart.theme.ts` 从 `--app-chart-*` Token 解析亮暗主题，统一色序、网格与标签。
3. Area Chart 统一使用平滑曲线、克制渐变和低对比度虚线网格；Bar Chart 统一使用分组柱、柱末端圆角和克制间距；Donut Chart 统一使用中心汇总和底部 Legend。
4. Loading、Empty、Error、Data 状态由 `ChartFrame` 持有；错误状态可提供恢复动作。
5. 每个图表必须提供场景化名称和文本数据摘要，视觉图形不能成为理解数据的唯一方式。
6. 动画服从 `prefers-reduced-motion`；图表宽度不得导致页面整体横向滚动。
