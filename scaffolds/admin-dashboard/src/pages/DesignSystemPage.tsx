import { useMemo, useState } from 'react'

import { AreaChart } from '../components/charts/AreaChart'
import { BarChart } from '../components/charts/BarChart'
import { DonutChart } from '../components/charts/DonutChart'
import { DataTable, type DataTableColumn } from '../components/ui/DataTable'
import { ListToolbar } from '../components/ui/ListToolbar'
import { PageHeader } from '../components/ui/PageHeader'
import { PageState } from '../components/ui/PageState'
import { Panel } from '../components/ui/Panel'
import { StatusBadge, type StatusTone } from '../components/ui/StatusBadge'

type CatalogRow = {
  component: string
  owner: string
  status: string
  tone: StatusTone
}

const catalogRows: CatalogRow[] = [
  { component: 'AreaChart', owner: 'components/charts', status: '稳定', tone: 'success' },
  { component: 'BarChart', owner: 'components/charts', status: '稳定', tone: 'success' },
  { component: 'DonutChart', owner: 'components/charts', status: '稳定', tone: 'success' },
  { component: 'DataTable', owner: 'components/ui', status: '稳定', tone: 'success' },
  { component: 'ListToolbar', owner: 'components/ui', status: '稳定', tone: 'success' },
  { component: 'Modal', owner: 'components/ui', status: '稳定', tone: 'success' },
  { component: 'PageState', owner: 'components/ui', status: '稳定', tone: 'success' },
]

const colorRoles = [
  { label: 'Primary', className: 'bg-primary' },
  { label: 'Success', className: 'bg-success' },
  { label: 'Warning', className: 'bg-warning' },
  { label: 'Error', className: 'bg-error' },
  { label: 'Info', className: 'bg-info' },
]

export function DesignSystemPage() {
  const [announcement, setAnnouncement] = useState('')
  const [catalogFilter, setCatalogFilter] = useState('all')
  const [catalogQuery, setCatalogQuery] = useState('')
  const columns = useMemo<DataTableColumn<CatalogRow>[]>(() => [
    { id: 'component', header: '组件', cell: (row) => <span className="font-semibold">{row.component}</span> },
    { id: 'owner', header: 'Owner', cell: (row) => <code className="text-xs">{row.owner}</code> },
    { id: 'status', header: '状态', cell: (row) => <StatusBadge label={row.status} tone={row.tone} /> },
  ], [])

  return (
    <div className="space-y-6">
      <PageHeader description="直接渲染真实 Token 与共享组件；设计契约以 DESIGN.md 和源码 Owner 为准。" eyebrow="Design System" title="后台设计系统" />
      <p aria-live="polite" className="sr-only">{announcement}</p>

      <section aria-labelledby="foundation-title" className="surface-card p-5 sm:p-6">
        <h2 className="text-lg font-semibold" id="foundation-title">Foundation</h2>
        <p className="mt-1 text-sm text-base-content/58">语义颜色随 corporate/business 主题切换，消费者不依赖固定色值。</p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {colorRoles.map((role) => (
            <li className="rounded-xl border border-base-300 p-3" key={role.label}>
              <span aria-hidden className={`block h-10 rounded-lg ${role.className}`} />
              <span className="mt-2 block text-sm font-medium">{role.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel description="只展示实际支持的交互状态" title="Controls">
          <div className="flex flex-wrap gap-3 p-5">
            <button className="btn btn-primary" onClick={() => setAnnouncement('Primary 操作已触发')} type="button">Primary</button>
            <button className="btn btn-outline" onClick={() => setAnnouncement('Outline 操作已触发')} type="button">Outline</button>
            <button className="btn" disabled type="button">Disabled</button>
            <button aria-label="正在提交" className="btn btn-primary" disabled type="button"><span className="loading loading-spinner loading-sm" />Loading</button>
          </div>
        </Panel>
        <Panel description="颜色与文案共同表达状态" title="Status Badges">
          <div className="flex flex-wrap gap-3 p-5">
            <StatusBadge label="已完成" tone="success" />
            <StatusBadge label="待处理" tone="warning" />
            <StatusBadge label="失败" tone="error" />
            <StatusBadge label="信息" tone="info" />
            <StatusBadge label="草稿" tone="neutral" />
          </div>
        </Panel>
      </div>

      <DataTable ariaLabel="共享组件清单" columns={columns} rowKey={(row) => row.component} rows={catalogRows} surface />

      <section aria-labelledby="list-toolbar-title" className="surface-card">
        <div className="p-5 pb-3 sm:px-6">
          <h2 className="text-lg font-semibold" id="list-toolbar-title">List Toolbar</h2>
          <p className="mt-1 text-sm text-base-content/58">统一受控搜索、筛选、重置、结果反馈与窄屏排列。</p>
        </div>
        <ListToolbar
          ariaLabel="设计系统列表工具栏示例"
          controlsId="catalog-toolbar-result"
          filterLabel="按状态筛选"
          filterOptions={[
            { label: '全部状态', value: 'all' },
            { label: '已启用', value: 'enabled' },
            { label: '草稿', value: 'draft' },
          ]}
          filterValue={catalogFilter}
          onFilterChange={setCatalogFilter}
          onReset={() => { setCatalogQuery(''); setCatalogFilter('all') }}
          onSearchChange={setCatalogQuery}
          resultSummary="共 24 条结果"
          searchLabel="搜索成员或邮箱"
          searchValue={catalogQuery}
        />
        <p className="p-5 text-sm text-base-content/55 sm:px-6" id="catalog-toolbar-result">列表内容由消费页面提供，工具栏不拥有业务过滤规则。</p>
      </section>

      <section aria-labelledby="chart-system-title" className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold" id="chart-system-title">Charts</h2>
          <p className="mt-1 text-sm text-base-content/58">ApexCharts 仅由共享适配层消费，页面只提供语义数据。</p>
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <Panel description="统一曲线、渐变、网格、Tooltip 与 Legend" title="Area Chart">
            <div className="p-3">
              <AreaChart
                ariaLabel="设计系统趋势图示例"
                categories={['周一', '周二', '周三', '周四', '周五', '周六']}
                series={[
                  { name: '访问量', data: [36, 48, 41, 68, 73, 92] },
                  { name: '转化量', data: [14, 19, 17, 28, 31, 39] },
                ]}
                summary="访问量和转化量在六天内整体上升。"
              />
            </div>
          </Panel>
          <Panel description="统一色序、中心汇总与分类 Legend" title="Donut Chart">
            <div className="p-3">
              <DonutChart
                ariaLabel="设计系统分类占比示例"
                labels={['直营', '渠道', '合作伙伴', '其他']}
                series={[46, 28, 18, 8]}
                summary="直营渠道占比最高，为百分之四十六。"
                totalLabel="渠道总量"
              />
            </div>
          </Panel>
          <Panel description="统一圆角柱、分组间距、网格、Tooltip 与 Legend" title="Bar Chart">
            <div className="p-3">
              <BarChart
                ariaLabel="设计系统渠道业绩柱状图示例"
                categories={['直营', '分销', '市场', '伙伴']}
                series={[
                  { name: '本期', data: [72, 54, 46, 63] },
                  { name: '目标', data: [80, 60, 50, 65] },
                ]}
                summary="直营渠道本期业绩最高，四个渠道均接近目标。"
                valueSuffix="万"
              />
            </div>
          </Panel>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <PageState description="正在准备设计系统示例。" state="loading" title="Loading" />
        <PageState description="调整条件或创建第一条记录。" state="empty" title="Empty" />
      </div>
    </div>
  )
}
