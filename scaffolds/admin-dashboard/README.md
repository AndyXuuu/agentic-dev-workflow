# Admin Dashboard Scaffold

一套可单独复制、安装和运行的 React 后台管理脚手架。视觉方向参考现代数据后台，但不依赖参考站点的品牌、账号、业务接口或商业资产。

## 能力

- 响应式侧栏、顶部导航与移动端抽屉
- 亮色 / 暗色主题及本地偏好保存
- Dashboard 指标、趋势图、分类占比、交易表格与活动流
- ApexCharts 共享图表体系，统一面积图、柱状图、环图、主题、Tooltip、Legend 和数据状态
- Orders、Products、Customers、Settings 管理页面骨架，以及统一的列表搜索、状态筛选、重置、导出和创建操作
- Loading、Empty、Error 演示状态
- 语义 Token、可访问焦点、Reduced Motion 与窄屏适配
- Mock repository 边界，便于替换为真实 API client
- 独立 `AGENTS.md` AI 开发闭环，覆盖风险分流、Owner、设计、测试与交付规则
- `DESIGN.md`、真实组件 Catalog 与设计系统静态门禁
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
- 真实组件 Catalog：应用内 `/design-system`
- 表格：统一使用 `DataTable`，由 Surface 圆角、低对比度分隔线和局部横向滚动共同构成视觉契约
- 列表工具：统一使用 `ListToolbar`，页面仅持有搜索值、筛选值和业务过滤规则

## 接入真实项目

1. 在 `src/features/<domain>/` 建立领域页面与数据 owner。
2. 用项目 API adapter 替换 Mock 数据，视图只消费稳定 view model。
3. 在服务端重新校验身份和权限；隐藏菜单不是授权。
4. 在 `src/styles/tokens.css` 调整语义 Token，并同步 `DESIGN.md` 与 Catalog，不直接复制外部品牌值。
5. 为真实写操作补充重复提交、超时、部分失败、恢复和幂等行为。

## 来源边界

参考页面用于提取信息层级、数据密度、响应式网格和双主题等设计意图。本项目没有复制其 Logo、作者信息、购买入口、图片资产或源代码。

## ApexCharts 许可证

本脚手架按使用方已确认可采用 ApexCharts 的前提集成 `apexcharts` 与 `react-apexcharts`。ApexCharts 当前采用双重授权，社区免费资格、商业使用及 OEM/再分发条件可能随组织营收和产品形态不同；复制或发布本脚手架前，使用方必须依据 [ApexCharts 官方许可证](https://apexcharts.com/license/) 独立确认并承担授权合规责任。

## SPA 部署要求

本项目使用 History API 路由。生产服务器必须把未知页面路径回退到 `index.html`，否则直接刷新 `/orders`、`/products` 等深链会返回 404。不同平台应使用其官方 SPA rewrite 配置；部署验收至少覆盖深链打开、刷新和浏览器前进/后退。
