import { type CSSProperties, useEffect, useState } from 'react'

type TokenPreview = 'border' | 'color' | 'length' | 'line-height' | 'radius' | 'shadow' | 'type'

type DesignToken = {
  label: string
  name: `--${string}`
  preview?: TokenPreview
  usage: string
}

type DesignTokenGroup = {
  description: string
  id: string
  title: string
  tokens: DesignToken[]
}

export const designTokenGroups: DesignTokenGroup[] = [
  {
    id: 'semantic-colors',
    title: '语义颜色',
    description: '由 daisyUI 主题提供，消费者按角色使用，不读取或复制底层色值。',
    tokens: [
      { name: '--color-base-100', label: 'Surface', usage: '卡片、弹窗和控件表面。', preview: 'color' },
      { name: '--color-base-200', label: 'Canvas', usage: '页面画布和弱层级背景。', preview: 'color' },
      { name: '--color-base-300', label: 'Divider', usage: '通用边界与结构分隔。', preview: 'color' },
      { name: '--color-base-content', label: 'Content', usage: '默认正文与图标。', preview: 'color' },
      { name: '--color-primary', label: 'Primary', usage: '主要操作、当前状态和品牌强调。', preview: 'color' },
      { name: '--color-primary-content', label: 'On primary', usage: 'Primary 表面上的前景内容。', preview: 'color' },
      { name: '--color-neutral', label: 'Neutral', usage: '中性强调与高对比度状态。', preview: 'color' },
      { name: '--color-neutral-content', label: 'On neutral', usage: 'Neutral 表面上的前景内容。', preview: 'color' },
      { name: '--color-success', label: 'Success', usage: '完成、健康和正向状态。', preview: 'color' },
      { name: '--color-success-content', label: 'On success', usage: 'Success 表面上的前景内容。', preview: 'color' },
      { name: '--color-warning', label: 'Warning', usage: '风险提醒和等待处理状态。', preview: 'color' },
      { name: '--color-warning-content', label: 'On warning', usage: 'Warning 表面上的前景内容。', preview: 'color' },
      { name: '--color-error', label: 'Error', usage: '失败、破坏性与校验错误。', preview: 'color' },
      { name: '--color-error-content', label: 'On error', usage: 'Error 表面上的前景内容。', preview: 'color' },
      { name: '--color-info', label: 'Info', usage: '中性信息和进行中状态。', preview: 'color' },
      { name: '--color-info-content', label: 'On info', usage: 'Info 表面上的前景内容。', preview: 'color' },
      { name: '--app-text-secondary', label: 'Secondary text', usage: '页面说明、区块说明和次级正文；双主题满足普通文本对比度。', preview: 'color' },
      { name: '--app-text-muted', label: 'Muted text', usage: '时间、元数据和辅助信息；不得承载唯一关键含义。', preview: 'color' },
      { name: '--app-text-accent', label: 'Accent text', usage: 'Eyebrow 与文字型强调，不直接使用未验证的 Primary 色。', preview: 'color' },
      { name: '--app-text-error', label: 'Error text', usage: '字段错误和可恢复失败说明；双主题满足普通文本对比度。', preview: 'color' },
    ],
  },
  {
    id: 'typography',
    title: '排版',
    description: '六级字号和五级行高覆盖页面标题、关键指标、区块、正文、控件与辅助信息。',
    tokens: [
      { name: '--app-font-size-page-title', label: '页面标题', usage: '每页唯一主标题。', preview: 'type' },
      { name: '--app-font-size-metric', label: '关键指标', usage: 'Dashboard 指标卡的主数值。', preview: 'type' },
      { name: '--app-font-size-section-title', label: '区块标题', usage: 'Panel、Modal 和内容分组标题。', preview: 'type' },
      { name: '--app-font-size-body', label: '正文', usage: '默认阅读与数据说明。', preview: 'type' },
      { name: '--app-font-size-control', label: '控件文字', usage: 'Button、Input、Select 与表格正文。', preview: 'type' },
      { name: '--app-font-size-caption', label: '辅助文字', usage: '元数据、表头和次级说明。', preview: 'type' },
      { name: '--app-line-height-page-title', label: '页面标题行高', usage: '与页面标题字号配对。', preview: 'line-height' },
      { name: '--app-line-height-metric', label: '关键指标行高', usage: '与关键指标字号配对。', preview: 'line-height' },
      { name: '--app-line-height-section-title', label: '区块标题行高', usage: '与区块标题字号配对。', preview: 'line-height' },
      { name: '--app-line-height-body', label: '正文行高', usage: '正文与控件的默认垂直节奏。', preview: 'line-height' },
      { name: '--app-line-height-caption', label: '辅助文字行高', usage: '紧凑元数据与表头。', preview: 'line-height' },
    ],
  },
  {
    id: 'spacing',
    title: '间距',
    description: '按页面、Surface、工具栏和控件邻近关系分层，不把数字间距散落到消费者。',
    tokens: [
      { name: '--app-space-page-gap', label: '页面区块', usage: '同一页面主要区块之间。', preview: 'length' },
      { name: '--app-space-panel', label: 'Surface 内边距', usage: 'Panel、Modal 和页面主体内边距。', preview: 'length' },
      { name: '--app-space-toolbar', label: '工具栏内边距', usage: '列表工具栏和表格页脚。', preview: 'length' },
      { name: '--app-space-control-gap', label: '控件间距', usage: '同一操作组和紧密内容之间。', preview: 'length' },
    ],
  },
  {
    id: 'radius',
    title: '圆角',
    description: '按 Surface、Overlay 和 Control 三层使用，不在页面创建新的圆角语义。',
    tokens: [
      { name: '--app-radius-surface', label: 'Surface', usage: '卡片、表格和主要内容容器。', preview: 'radius' },
      { name: '--app-radius-overlay', label: 'Overlay', usage: 'Modal、Sheet 等浮层。', preview: 'radius' },
      { name: '--app-radius-control', label: 'Control', usage: '输入、选择、按钮和 Tooltip。', preview: 'radius' },
    ],
  },
  {
    id: 'borders-surfaces',
    title: '边框与表面',
    description: '使用低对比度层级表达结构；表格只保留必要分隔，不绘制单元格网格。',
    tokens: [
      { name: '--app-border-subtle', label: '细边界', usage: 'Surface 与浮层边缘。', preview: 'border' },
      { name: '--app-border-muted', label: '弱分隔', usage: '表格行、工具栏与内容分区。', preview: 'border' },
      { name: '--app-surface-hover', label: 'Surface Hover', usage: '可浏览数据行的轻量 Hover。', preview: 'color' },
      { name: '--app-table-header', label: '表头背景', usage: 'DataTable 表头层级。', preview: 'color' },
      { name: '--app-table-toolbar', label: '工具栏背景', usage: 'ListToolbar 与表格 Surface 连接层。', preview: 'color' },
      { name: '--app-table-cell-padding-block', label: '单元格纵向', usage: 'DataTable 行高密度。', preview: 'length' },
      { name: '--app-table-cell-padding-inline', label: '单元格横向', usage: 'DataTable 列间呼吸空间。', preview: 'length' },
    ],
  },
  {
    id: 'controls-focus',
    title: '控件与焦点',
    description: '统一标准/小型控件尺寸；键盘焦点清晰但克制，输入类控件不绘制双重轮廓。',
    tokens: [
      { name: '--app-control-height', label: '标准控件', usage: '默认 Button、Input、Select；粗指针设备自动提高。', preview: 'length' },
      { name: '--app-control-height-sm', label: '小型控件', usage: '表格与页头的低频次级操作。', preview: 'length' },
      { name: '--app-control-padding-inline', label: '控件横向内边距', usage: '标准控件的文字与边缘距离。', preview: 'length' },
      { name: '--app-focus-ring', label: '通用焦点环', usage: '链接、按钮和非输入交互元素。', preview: 'color' },
      { name: '--app-focus-control-border', label: '输入焦点边框', usage: 'Input、Select 与 Textarea 聚焦边界。', preview: 'border' },
      { name: '--app-focus-control-shadow', label: '输入焦点外环', usage: '输入类控件的柔和外部反馈。', preview: 'shadow' },
      { name: '--app-primary-action-background', label: 'Primary action', usage: '主要按钮与 Skip Link 的可访问背景。', preview: 'color' },
      { name: '--app-primary-action-content', label: 'On primary action', usage: 'Primary action 背景上的前景内容。', preview: 'color' },
    ],
  },
  {
    id: 'shell',
    title: '壳层与布局',
    description: '仅服务应用壳和内容边界，业务页面不得直接复刻这些尺寸。',
    tokens: [
      { name: '--app-shell-sidebar-width', label: '桌面侧栏', usage: '桌面端主导航宽度。', preview: 'length' },
      { name: '--app-shell-header-height', label: '顶部栏', usage: '顶部导航与侧栏品牌区高度。', preview: 'length' },
      { name: '--app-content-max-width', label: '内容最大宽度', usage: '超宽屏页面内容边界。', preview: 'length' },
    ],
  },
  {
    id: 'elevation-motion',
    title: '层级与动效',
    description: '阴影只表达 Surface/Overlay 层级；动效仅用于状态反馈并服从 Reduced Motion。',
    tokens: [
      { name: '--app-shadow-surface', label: 'Surface 阴影', usage: '静态卡片的轻量分层。', preview: 'shadow' },
      { name: '--app-shadow-overlay', label: 'Overlay 阴影', usage: 'Modal、Tooltip 等浮层。', preview: 'shadow' },
      { name: '--app-motion-fast', label: '快速反馈', usage: 'Hover、Focus 等即时状态。' },
    ],
  },
  {
    id: 'charts',
    title: '图表',
    description: '仅由图表适配层消费；页面传递语义数据，不直接读取色序或供应商配置。',
    tokens: [
      { name: '--app-chart-series-1', label: 'Series 1', usage: '第一主序列。', preview: 'color' },
      { name: '--app-chart-series-2', label: 'Series 2', usage: '第二对比序列。', preview: 'color' },
      { name: '--app-chart-series-3', label: 'Series 3', usage: '第三分类序列。', preview: 'color' },
      { name: '--app-chart-series-4', label: 'Series 4', usage: '第四分类序列。', preview: 'color' },
      { name: '--app-chart-series-5', label: 'Series 5', usage: '第五分类序列。', preview: 'color' },
      { name: '--app-chart-grid', label: 'Grid', usage: '坐标网格与参考线。', preview: 'color' },
      { name: '--app-chart-label', label: 'Label', usage: '坐标、Legend 与辅助标签。', preview: 'color' },
      { name: '--app-chart-tooltip', label: 'Tooltip', usage: '图表浮层背景。', preview: 'color' },
    ],
  },
]

const allTokens = designTokenGroups.flatMap((group) => group.tokens)

function TokenPreview({ token }: { token: DesignToken }) {
  if (!token.preview) return null
  const value = `var(${token.name})`
  const style: CSSProperties = token.preview === 'color'
    ? { background: value }
    : token.preview === 'border'
      ? { borderColor: value }
      : token.preview === 'radius'
        ? { borderRadius: value }
        : token.preview === 'shadow'
          ? { boxShadow: value }
          : token.preview === 'type'
            ? { fontSize: value }
            : token.preview === 'line-height'
              ? { lineHeight: value }
              : { inlineSize: `clamp(0.25rem, ${value}, 5rem)` }

  return <span aria-hidden className={`token-preview token-preview--${token.preview}`} style={style}>Aa</span>
}

export function DesignTokenCatalog() {
  const [values, setValues] = useState<Record<string, string>>({})

  useEffect(() => {
    const updateValues = () => {
      const styles = getComputedStyle(document.documentElement)
      setValues(Object.fromEntries(allTokens.map((token) => [token.name, styles.getPropertyValue(token.name).trim()])))
    }
    updateValues()
    const observer = new MutationObserver(updateValues)
    observer.observe(document.documentElement, { attributeFilter: ['data-theme'], attributes: true })
    return () => observer.disconnect()
  }, [])

  return (
    <section aria-labelledby="foundation-title" className="design-section-anchor surface-card" id="foundation-tokens">
      <header className="app-surface-body border-b border-base-300/70">
        <h2 className="app-section-title" id="foundation-title">Foundation Tokens</h2>
        <p className="app-section-description mt-1">列出全部项目 Token 与主题语义 Token；显示值来自当前页面的真实计算样式，切换主题会同步更新。</p>
      </header>
      <div className="token-catalog-groups p-3 sm:p-4">
        {designTokenGroups.map((group) => (
          <section aria-labelledby={`token-group-${group.id}`} className="token-group" key={group.id}>
            <header className="border-b border-base-300/70 p-3">
              <h3 className="app-section-title" id={`token-group-${group.id}`}>{group.title}</h3>
              <p className="app-caption app-text-muted mt-1">{group.description}</p>
            </header>
            <dl>
              {group.tokens.map((token) => (
                <div className="token-row" key={token.name}>
                  <dt className="min-w-0">
                    <code className="token-name">{token.name}</code>
                    <span className="mt-1 block font-medium">{token.label}</span>
                  </dt>
                  <dd className="min-w-0">
                    <div className="flex items-center gap-2">
                      <TokenPreview token={token} />
                      <code className="token-value" title={values[token.name]}>{values[token.name] || '读取中'}</code>
                    </div>
                    <p className="app-caption app-text-muted mt-1">{token.usage}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </section>
  )
}
