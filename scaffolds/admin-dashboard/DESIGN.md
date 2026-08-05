# Admin Dashboard Design System

本文是本脚手架视觉与交互契约的唯一权威说明。实现源码仍是可执行事实：Foundation Token 位于 `src/styles/tokens.css`，控件、Catalog、数据表格与 Overlay 样式按 Owner 位于 `src/styles/components`，共享组件位于 `src/components/ui`，Catalog 位于 `/design-system`。

## Design Intent

本后台脚手架面向高频管理任务，采用清晰层级、紧凑信息密度、低对比度分隔线和稳定双主题。外部参考只用于校准信息组织、响应式与交互意图，不复制品牌、资产或固定视觉数值。

## Foundation

| 领域 | Token Owner | 使用规则 |
| --- | --- | --- |
| 壳层尺寸 | `--app-shell-*` | 只用于桌面展开/收起侧栏、侧栏品牌区和内容宽度；移动端通过左上角入口打开左侧 Drawer，桌面与移动端均不设置顶部工具条 |
| 排版与文本 | `--app-font-size-*`、`--app-line-height-*`、`--app-text-*` | 页面标题、关键指标、区块标题、正文、控件和辅助信息使用固定语义层级；有意义文本在双主题满足 WCAG 2.2 AA，不消费组件库偶然默认值或透明度工具类 |
| 密度与间距 | `--app-space-*` | 页面、Surface、工具栏和控件间距按任务邻近关系组合，不在消费者中建立第二套尺度 |
| 控件与焦点 | `--app-control-*`、`--app-focus-*`、`--app-primary-action-*` | 桌面端采用紧凑控件，粗指针设备提高点击高度；焦点使用低强度边框与柔和外环，Primary action 在双主题保持可读性 |
| 图标 | `--app-icon-size-*` | `sm/md/lg/xl` 分别用于紧凑控件、标准操作、强调图标和状态图标；图标消费者使用 `app-icon-*` 语义类，不传入任意像素尺寸 |
| 圆角 | `--app-radius-*` | Surface、Overlay、Control 分层，不在页面重复定义 |
| 边框 | `--app-border-*` | 默认使用低对比度语义分隔，不用粗线框住每个单元格 |
| 阴影 | `--app-shadow-*` | 只表达 Surface 与 Overlay 层级 |
| Motion | `--app-motion-*` | 只用于状态反馈，并服从 Reduced Motion |
| 表格与列表工具 | `--app-table-*` | 由 `DataTable`、`ListToolbar` 消费，页面不得平行实现表格皮肤或筛选工具布局 |
| 图表 | `--app-chart-*` | 由 `components/charts` 独占消费，统一高度、主题、色序、网格、Tooltip 与 Legend |

颜色角色来自 daisyUI 的 `base`、`primary`、`success`、`warning`、`error`、`info` 语义主题；项目 Token 只在稳定跨组件语义出现时扩展，不复制底层 primitive 色板。

Catalog 的 Foundation Tokens 区域是公开 Token 的可视索引：按语义颜色、排版、间距、图标、圆角、边框与表面、控件与焦点、壳层、层级与动效、图表分组，展示 Token 名称、当前主题计算值、用途和限制。数值仍由 `tokens.css` 或 daisyUI 主题持有，Catalog 不复制第二份值；静态门禁要求所有 `--app-*` 定义与 Catalog 注册表一一对应。

Catalog 顶部提供吸顶分类导航，固定链接到 Foundation Tokens、控件状态、组件清单、危险操作、列表工具、图表和页面状态。新增大型 Catalog 区块时必须同时注册顶部入口和稳定锚点；分类导航允许窄屏横向滚动，并通过共享边缘渐隐公布尚未显示的内容，不引入独立路由或重复页面状态。

公开组件清单由 `src/components/design-system/publicComponentCatalog.ts` 持有，Catalog 直接消费该清单；`DESIGN.md` 说明公开契约，静态门禁校验清单中的每个组件同时存在文档条目和真实 Catalog 示例。`ApexChart` 等内部适配层不进入公开清单。

## Component Contract

| 组件 | Owner | 契约 |
| --- | --- | --- |
| `Button` | `src/components/ui/Button.tsx` | 原生 button 语义、primary/outline/ghost/danger/link 变体、标准/小型密度、方形图标按钮，以及 loading、disabled、`aria-busy` 和默认非提交行为；路由 Link 的按钮式动作通过其公开样式构造复用相同视觉 Owner，不直接拼接 `btn*`；业务权限与动作状态由消费者拥有 |
| `FormField` | `src/components/ui/FormField.tsx` | 标签、必填提示、Hint/Error、稳定 ID 和 `aria-describedby`/`aria-invalid` 关联；只拥有字段布局与可访问性接线，不拥有业务校验规则 |
| `TextInput` | `src/components/ui/TextInput.tsx` | 原生 input 属性、统一标签/帮助/错误、标准密度、可选起始图标和隐藏视觉标签；搜索、邮箱等业务语义仍由原生 type 与消费者定义 |
| `Select` | `src/components/ui/Select.tsx` | 原生 select 与 option 语义、统一字段布局、错误和聚焦外观；消费者拥有选项来源与业务选择状态 |
| `Textarea` | `src/components/ui/Textarea.tsx` | 原生多行输入、统一字段布局、最小高度与纵向缩放；不内置富文本或字数业务规则 |
| `Checkbox` | `src/components/ui/Checkbox.tsx` | 独立布尔/多选语义、可视觉隐藏的可访问标签、说明、错误和 indeterminate 混合状态；消费者拥有批量选择规则 |
| `RadioGroup` | `src/components/ui/RadioGroup.tsx` | 原生 fieldset/radio 单选组、受控/非受控选择、横向/纵向排列、禁用、必填和错误语义 |
| `Switch` | `src/components/ui/Switch.tsx` | 原生 checkbox 数据模型与 switch 语义、标签、说明、错误、禁用和紧凑设置 Surface；组件显式拥有圆角轨道、Thumb、checked、focus 与 disabled 外观，不继承 daisyUI 偶然默认值；仅用于即时布尔设置，不替代 Checkbox 的多选语义 |
| `Tooltip` | `src/components/ui/Tooltip.tsx` | 为收起导航等缺少可见文本的控件提供 hover 与 keyboard focus 可见标签，并通过 `aria-describedby` 关联触发器；只补充说明，不替代触发器自己的可访问名称或承载可交互内容 |
| `DataTable` | `src/components/ui/DataTable.tsx` | 语义 caption、命名滚动区域、柔和表头、低对比度行分隔、surface/embedded 容器、随滚动位置更新的边缘渐隐提示，以及受控排序、当前页全选/混合状态、行选择和 `aria-sort`/`aria-selected`；页面拥有数据顺序、跨页选择与批量业务规则 |
| `DangerZone` | `src/components/ui/DangerZone.tsx` | 将高风险操作收束到页面末尾的独立 Surface，逐项呈现名称、影响说明和明确触发入口；只负责视图契约，不判断权限或执行操作 |
| `ListToolbar` | `src/components/ui/ListToolbar.tsx` | 受控搜索、单维筛选、按需出现的重置动作、结果摘要、`aria-controls` 与从窄屏开始的排列；无有效筛选时不为禁用恢复动作占用移动空间，业务过滤规则仍由页面拥有 |
| `TablePagination` | `src/components/ui/TablePagination.tsx` | 受控页码与页大小、可见结果范围、总页数和首尾禁用状态；页面拥有服务端/本地数据切片、查询复位与 URL 策略 |
| `DropdownMenu` | `src/components/ui/DropdownMenu.tsx` | Portal 锚定菜单、视口翻转/夹取、menu/menuitem 语义、方向键/Home/End/Escape/Tab、外部关闭和焦点恢复；消费方只提供真实可执行动作，不放置复选过滤或伪造操作 |
| `Tabs` | `src/components/ui/Tabs.tsx` | 受控自动激活页签、tab/tabpanel 关联、roving tabindex、方向键/Home/End 与禁用项跳过；只切换同一任务上下文内的关联视图 |
| `Skeleton` | `src/components/ui/Skeleton.tsx` | text/control/avatar/block 四类内容形状与隐藏视觉语义；外层状态区提供可访问加载名称，消费者按真实布局组合且不伪造业务内容 |
| `Modal` | `src/components/ui/Modal.tsx` | Native dialog、默认视口居中、窄屏安全边距、Backdrop、Escape、背景关闭、初始焦点、关闭后焦点恢复、可叠加引用计数的滚动锁定；全局 Reset 后必须显式保留居中定位契约 |
| `DestructiveActionDialog` | `src/components/ui/DestructiveActionDialog.tsx` | 复用 Modal，展示影响与恢复方式；按动作要求输入确认短语，覆盖取消、等待、防重复提交、成功关闭和可重试错误，消费方拥有权限与执行逻辑 |
| `PageHeader` | `src/components/ui/PageHeader.tsx` | 每页唯一主标题、说明、Eyebrow 与页级操作编排 |
| `Panel` | `src/components/ui/Panel.tsx` | 标题、说明、可选操作与内容编排 |
| `PageState` | `src/components/ui/PageState.tsx` | Loading、Empty、Error 与恢复动作 |
| `ProgressBar` | `src/components/ui/ProgressBar.tsx` | 原生 progressbar 语义、确定/不确定进度、可见标签和值、数值边界保护，以及 primary、success、warning、error、info、neutral 语义色调；业务任务状态、上传和轮询由消费者拥有 |
| `StatusBadge` | `src/components/ui/StatusBadge.tsx` | success、warning、error、info、neutral 语义状态；颜色与文案共同表达状态，前景/柔和背景组合在双主题达到普通文本对比度 |
| `DesignTokenCatalog` | `src/components/design-system/DesignTokenCatalog.tsx` | Catalog 专用公开 Token 索引，从运行时计算样式读取当前主题值，并提供分组、用途与视觉预览 |
| `AreaChart` | `src/components/charts/AreaChart.tsx` | 平滑趋势、渐变面积、语义序列、数据摘要与完整数据状态 |
| `BarChart` | `src/components/charts/BarChart.tsx` | 分类对比、分组柱、统一柱形圆角、语义序列、数据摘要与完整数据状态 |
| `DonutChart` | `src/components/charts/DonutChart.tsx` | 分类占比、中心汇总、统一色序、数据摘要与完整数据状态 |
| `ApexChart` | `src/components/charts/ApexChart.tsx`、`apex.options.ts`、`apexcharts.modules.d.ts` | 内部第三方适配层，负责 ApexCharts 渲染、配置、缺失的 side-effect module 声明和 Reduced Motion；公开组件与页面不得依赖供应商类型 |

生产消费者必须通过上述共享基础组件渲染按钮和表单控件，不直接拼接 daisyUI 原生类。按钮式路由动作由 Router Link 调用 `Button` 的公开视觉构造，保留链接语义但不建立第二套皮肤。组件 Owner 内部继续使用原生元素与 daisyUI 语义类，并把 DOM 属性透传给稳定边界；业务校验、权限、提交、查询和领域状态始终由页面或 feature 拥有。

## Destructive Action Contract

危险操作按可恢复性区分语义：停用/禁用可以恢复，重置/删除默认不可恢复。两者都必须说明影响范围和恢复方式；不可恢复操作必须要求输入场景明确的确认短语。触发按钮、标题、说明和确认文案共同表达风险，不能只用红色区分。

`DangerZone` 只组织操作列表并向消费方返回选中动作，`DestructiveActionDialog` 只拥有确认输入和本地提交状态。feature/service 必须负责权限、二次认证、前置条件、依赖检查、审计、幂等、超时和实际副作用；脚手架 Mock action 只能返回明确的“未更改数据”结果，不能伪装完成真实删除。

等待期间禁止重复提交并阻止关闭导致状态悬空；失败在 Dialog 内提供可行动信息并允许重试；成功关闭后恢复触发器焦点，由消费方通过既有反馈区域宣布结果。不可恢复操作进入 Dialog 后优先聚焦确认输入，可恢复操作优先聚焦取消。

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
5. 二维内容在命名且可聚焦的局部区域滚动，页面本身不得横向溢出；当局部区域仍有未显示列时，边缘渐隐必须随滚动位置更新。
6. 排序与选择是受控契约：表头公布 `aria-sort`，当前页全选反映混合状态，行公布 `aria-selected`；页面负责过滤、排序、分页后再把当前页数据交给表格。

## List Header Contract

资源列表采用三层结构：页标题区说明任务并承载导出/新增等页级动作；`ListToolbar` 承载搜索、筛选、重置和结果反馈；`DataTable` 与 `TablePagination` 承载当前页数据语义、排序、选择和分页。页面按过滤→排序→分页的顺序派生数据，查询、筛选、页大小或排序变化时回到第一页；导出覆盖全部过滤/排序结果，不缩小为当前页。工具栏和数据状态位于同一 Surface，Loading 组合 `Skeleton` 保持布局稳定，Empty、Error 提供明确恢复路径。

`ListToolbar` 是受控视图组件，不解析查询、不筛选数据、不决定权限，也不拥有导出和创建流程。窄屏按搜索、筛选、结果摘要的任务顺序排列；重置只在查询或筛选实际生效时靠近摘要出现，宽屏再增强搜索与筛选布局；搜索和筛选必须通过 `aria-controls` 指向持续存在的结果区域。

## Consumer Map

| Consumer | Shared components | State coverage |
| --- | --- | --- |
| Dashboard | Panel、DataTable、StatusBadge、Modal | Data、导出反馈、详情 Overlay |
| Resource Lists | PageHeader、ListToolbar、DataTable、TablePagination、Skeleton、PageState、StatusBadge、Modal | Loading、Data、Empty、Error、Search、Filter、Sort、Pagination、Current-page selection、Reset、Export、Create、Details |
| Settings | PageHeader、Panel、DangerZone、DestructiveActionDialog | Dirty、Saving、Saved、Error、Invalid input、取消更改、可恢复确认、不可恢复短语确认、等待与 Mock 成功反馈 |
| Design System Catalog | 直接导入真实共享组件与公开组件 manifest | Light/Dark、控件 invalid、Modal、Dropdown Menu、Tabs、Pagination、Skeleton、危险操作确认、确定/不确定进度、Loading、Empty、Error 与表格契约 |

## Verification

- `npm run check:design`：Token 定义与 Catalog 注册表一一对应、公开组件 manifest 与文档/真实示例一致、语义文本与 `StatusBadge` 采用、主题语义角色、个人数据、禁止的壳层硬编码与平行 `<table>` 检查。
- `npm run lint`：TypeScript、React Hooks、JSX 可访问性和设计契约静态检查。
- `npm test`：用户行为、回归边界和共享组件契约。
- `npm run test:browser`：独立运行代表性桌面/320px、双主题控件和 Modal/Drawer/Dropdown 几何焦点契约；不并入每次本地 `verify`。
- Orca：亮/暗主题、320px、键盘 Overlay、表格滚动、控制台和实际视觉；触达 Overlay 时必须真实打开并检查居中或锚定位置、视口包含、Backdrop 和层级。

Catalog 是展示入口，不是第二套实现；任何示例必须直接导入真实组件。

## Chart Visual Contract

图表以 ApexCharts 为渲染引擎，但项目设计系统拥有最终视觉契约：

1. 页面只提供分类、序列、摘要和业务单位，不传递 `ApexOptions`。
2. `ApexChart.tsx` 只加载 ApexCharts core、当前实际使用的图表类型以及 Legend/Keyboard 功能；`chart.theme.ts` 从 `--app-chart-*` Token 解析亮暗主题，统一色序、网格与标签。
3. Area Chart 统一使用平滑曲线、克制渐变和低对比度虚线网格；Bar Chart 统一使用分组柱、柱末端圆角、分类组宽度和 `--app-chart-surface` 描边形成的组内视觉间距，不允许相邻序列无分隔贴合；Donut Chart 统一使用中心汇总和底部 Legend。
4. Loading、Empty、Error、Data 状态由 `ChartFrame` 持有；错误状态可提供恢复动作。
5. 每个图表必须提供场景化名称和文本数据摘要，视觉图形不能成为理解数据的唯一方式。
6. 动画服从 `prefers-reduced-motion`；图表宽度不得导致页面整体横向滚动。
