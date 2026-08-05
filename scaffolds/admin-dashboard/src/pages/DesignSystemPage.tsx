import { MoreHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'

import { AreaChart } from '../components/charts/AreaChart'
import { BarChart } from '../components/charts/BarChart'
import { DonutChart } from '../components/charts/DonutChart'
import { DesignTokenCatalog } from '../components/design-system/DesignTokenCatalog'
import { publicComponentCatalog, type PublicComponentCatalogRow } from '../components/design-system/publicComponentCatalog'
import { Button } from '../components/ui/Button'
import { Checkbox } from '../components/ui/Checkbox'
import { DataTable, type DataTableColumn } from '../components/ui/DataTable'
import { DestructiveActionDialog } from '../components/ui/DestructiveActionDialog'
import { DangerZone, type DangerZoneAction } from '../components/ui/DangerZone'
import { DropdownMenu } from '../components/ui/DropdownMenu'
import { FormField } from '../components/ui/FormField'
import { ListToolbar } from '../components/ui/ListToolbar'
import { Modal } from '../components/ui/Modal'
import { PageHeader } from '../components/ui/PageHeader'
import { PageState } from '../components/ui/PageState'
import { Panel } from '../components/ui/Panel'
import { ProgressBar } from '../components/ui/ProgressBar'
import { RadioGroup } from '../components/ui/RadioGroup'
import { Select } from '../components/ui/Select'
import { Skeleton } from '../components/ui/Skeleton'
import { StatusBadge } from '../components/ui/StatusBadge'
import { Switch } from '../components/ui/Switch'
import { TablePagination } from '../components/ui/TablePagination'
import { Tabs } from '../components/ui/Tabs'
import { Textarea } from '../components/ui/Textarea'
import { TextInput } from '../components/ui/TextInput'

const designSections = [
  { href: '#foundation-tokens', label: '基础 Token' },
  { href: '#controls', label: '控件状态' },
  { href: '#components', label: '组件清单' },
  { href: '#safety', label: '危险操作' },
  { href: '#list-patterns', label: '列表工具' },
  { href: '#charts', label: '图表' },
  { href: '#states', label: '页面状态' },
]

const catalogDangerAction: DangerZoneAction = {
  id: 'catalog-reset',
  title: '重置示例数据',
  description: '展示不可恢复操作的影响说明、输入确认与等待状态，不会清除数据。',
  impact: '仅用于验证共享危险操作组件的交互契约。',
  recovery: '这是设计系统演示，不会产生需要恢复的数据变更。',
  triggerLabel: '预览重置流程',
  confirmLabel: '确认重置',
  confirmationPhrase: 'RESET DEMO',
}

export function DesignSystemPage() {
  const [announcement, setAnnouncement] = useState('')
  const [catalogFilter, setCatalogFilter] = useState('all')
  const [catalogQuery, setCatalogQuery] = useState('')
  const [dangerAction, setDangerAction] = useState<DangerZoneAction | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [newsletterEnabled, setNewsletterEnabled] = useState(true)
  const [permissions, setPermissions] = useState('editor')
  const [selectedRows, setSelectedRows] = useState(true)
  const [tabValue, setTabValue] = useState('overview')
  const [paginationPage, setPaginationPage] = useState(1)
  const [paginationPageSize, setPaginationPageSize] = useState(10)
  const columns = useMemo<DataTableColumn<PublicComponentCatalogRow>[]>(() => [
    { id: 'component', header: '组件', cell: (row) => <span className="font-semibold">{row.component}</span> },
    { id: 'owner', header: 'Owner', cell: (row) => <code className="app-caption">{row.owner}</code> },
    { id: 'status', header: '状态', cell: (row) => <StatusBadge label={row.status} tone={row.tone} /> },
  ], [])

  return (
    <div className="app-page-stack">
      <PageHeader description="直接渲染真实 Token 与共享组件；设计契约以 DESIGN.md 和源码 Owner 为准。" eyebrow="Design System" title="后台设计系统" />
      <p aria-live="polite" className="sr-only">{announcement}</p>

      <nav aria-label="设计系统分类" className="design-system-nav">
        <span className="app-caption app-text-muted shrink-0 font-semibold">分类</span>
        <div className="design-system-nav-list">
          {designSections.map((section) => (
            <a className="design-system-nav-link" href={section.href} key={section.href}>{section.label}</a>
          ))}
        </div>
      </nav>

      <DesignTokenCatalog />

      <section aria-label="控件与状态" className="design-section-anchor app-layout-gap grid xl:grid-cols-2" id="controls">
        <Panel description="只展示实际支持的交互状态" title="Controls">
          <div className="app-surface-body grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput label="Input" placeholder="搜索订单" type="search" />
              <Select defaultValue="all" label="Select">
                  <option value="all">全部状态</option>
                  <option value="active">已启用</option>
              </Select>
            </div>
            <TextInput defaultValue="invalid-value" error="请输入符合业务规则的值。" label="Invalid input" />
            <Textarea hint="用于多行说明，字段高度由共享组件保持一致。" label="Textarea" placeholder="输入内部备注" rows={3} />
            <FormField hint="FormField 负责标签和帮助信息关联，业务控件仍可自行组合。" label="FormField">
              {(controlProps) => <output className="input input-bordered flex w-full items-center" {...controlProps}>只读的自定义字段内容</output>}
            </FormField>
            <div className="app-control-gap flex flex-wrap">
              <Button onClick={() => setAnnouncement('Primary 操作已触发')} variant="primary">Primary</Button>
              <Button onClick={() => setAnnouncement('Outline 操作已触发')} variant="outline">Outline</Button>
              <Button disabled>Disabled</Button>
              <Button aria-label="正在提交" loading variant="primary">Loading</Button>
            </div>
          </div>
        </Panel>
        <Panel description="使用原生表单语义承载布尔值和单选状态" title="Choice Controls">
          <div className="app-surface-body grid gap-4">
            <Checkbox
              checked={selectedRows}
              description="选择当前页可执行批量操作的记录。"
              label="选择当前页记录"
              onChange={(event) => setSelectedRows(event.target.checked)}
            />
            <RadioGroup
              label="默认权限"
              onValueChange={setPermissions}
              options={[
                { label: '查看者', value: 'viewer', description: '只能浏览数据。' },
                { label: '编辑者', value: 'editor', description: '可以修改业务数据。' },
              ]}
              orientation="horizontal"
              value={permissions}
            />
            <Switch
              checked={newsletterEnabled}
              description="控制是否发送每周运营摘要。"
              label="每周摘要"
              onChange={(event) => setNewsletterEnabled(event.target.checked)}
            />
          </div>
        </Panel>
        <Panel description="颜色与文案共同表达状态" title="Status Badges">
          <div className="app-control-gap app-surface-body flex flex-wrap">
            <StatusBadge label="已完成" tone="success" />
            <StatusBadge label="待处理" tone="warning" />
            <StatusBadge label="失败" tone="error" />
            <StatusBadge label="信息" tone="info" />
            <StatusBadge label="草稿" tone="neutral" />
          </div>
        </Panel>
        <Panel description="确定进度、完成状态与不确定等待均保留可见文本和原生语义" title="Progress Bar">
          <div className="app-surface-body grid gap-4">
            <ProgressBar label="数据导入" value={42} />
            <ProgressBar label="索引构建" tone="success" value={100} />
            <ProgressBar label="库存同步" tone="info" valueLabel="正在等待服务响应" />
          </div>
        </Panel>
      </section>

      <section aria-label="组件清单" className="design-section-anchor space-y-4" id="components">
        <DataTable ariaLabel="共享组件清单" columns={columns} rowKey={(row) => row.component} rows={publicComponentCatalog} surface />
        <Panel description="使用真实 Modal 验证打开、关闭、Escape 与焦点恢复。" title="Modal">
          <div className="app-surface-body">
            <Button onClick={() => setModalOpen(true)} variant="outline">预览 Modal</Button>
          </div>
        </Panel>
        <div className="app-layout-gap grid xl:grid-cols-2">
          <Panel description="Portal 浮层统一处理方向键、视口边界、Escape 与焦点恢复。" title="Dropdown Menu">
            <div className="app-surface-body">
              <DropdownMenu
                items={[
                  { id: 'edit', label: '编辑资料', description: '打开资料编辑流程', onSelect: () => setAnnouncement('编辑资料操作已触发') },
                  { id: 'archive', label: '归档记录', description: '演示危险语义菜单项', tone: 'danger', onSelect: () => setAnnouncement('归档记录操作已触发') },
                ]}
                label="记录操作"
                trigger={<><MoreHorizontal aria-hidden className="app-icon-md" />更多操作</>}
              />
            </div>
          </Panel>
          <Panel description="受控选中值，方向键、Home 与 End 会跳过禁用项。" title="Tabs">
            <div className="app-surface-body">
              <Tabs
                ariaLabel="账户信息分类"
                items={[
                  { id: 'overview', label: '概览', content: <p className="app-body app-text-secondary">展示账户摘要与主要指标。</p> },
                  { id: 'activity', label: '活动', content: <p className="app-body app-text-secondary">展示最近的操作记录。</p> },
                  { id: 'billing', label: '账单', content: <p className="app-body app-text-secondary">账单能力尚未接入。</p>, disabled: true },
                ]}
                onValueChange={setTabValue}
                value={tabValue}
              />
            </div>
          </Panel>
          <Panel description="统一结果范围、页大小和首尾边界状态；数据请求仍由页面负责。" title="Table Pagination">
            <div className="app-surface-body">
              <TablePagination
                ariaLabel="组件清单分页示例"
                onPageChange={setPaginationPage}
                onPageSizeChange={(value) => { setPaginationPageSize(value); setPaginationPage(1) }}
                page={paginationPage}
                pageSize={paginationPageSize}
                total={47}
              />
            </div>
          </Panel>
          <Panel description="只表达加载中的内容形状，不伪造业务文案。" title="Skeleton">
            <div className="app-surface-body grid gap-3" role="status" aria-label="内容加载占位示例">
              <div className="flex items-center gap-3"><Skeleton variant="avatar" /><div className="grid flex-1 gap-2"><Skeleton className="w-32" /><Skeleton className="w-48 max-w-full" /></div></div>
              <Skeleton variant="block" />
              <Skeleton className="w-24" variant="control" />
            </div>
          </Panel>
        </div>
      </section>

      <section aria-label="危险操作" className="design-section-anchor" id="safety">
        <DangerZone actions={[catalogDangerAction]} description="共享组件将危险语义、影响说明和确认入口保持一致；业务权限与执行逻辑仍由消费方负责。" onSelect={setDangerAction} />
      </section>

      <section aria-labelledby="list-toolbar-title" className="design-section-anchor surface-card" id="list-patterns">
        <div className="p-4 pb-3 sm:px-5">
          <h2 className="app-section-title" id="list-toolbar-title">List Toolbar</h2>
          <p className="app-section-description mt-1">统一受控搜索、筛选、重置、结果反馈与窄屏排列。</p>
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
        <p className="app-body app-surface-body app-text-secondary" id="catalog-toolbar-result">列表内容由消费页面提供，工具栏不拥有业务过滤规则。</p>
      </section>

      <section aria-labelledby="chart-system-title" className="design-section-anchor space-y-4" id="charts">
        <div>
          <h2 className="app-section-title" id="chart-system-title">Charts</h2>
          <p className="app-section-description mt-1">ApexCharts 仅由共享适配层消费，页面只提供语义数据。</p>
        </div>
        <div className="app-layout-gap grid xl:grid-cols-2">
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

      <section aria-label="页面状态" className="design-section-anchor app-layout-gap grid xl:grid-cols-3" id="states">
        <PageState description="正在准备设计系统示例。" state="loading" title="Loading" />
        <PageState description="调整条件或创建第一条记录。" state="empty" title="Empty" />
        <PageState description="设计系统示例暂时不可用。" onRetry={() => setAnnouncement('PageState 恢复操作已触发')} state="error" title="Error" />
      </section>

      <Modal description="这是共享 Modal 的真实交互示例。" onClose={() => setModalOpen(false)} open={modalOpen} title="Modal 交互契约">
        <p className="app-body">内容、说明、关闭按钮和焦点行为均来自共享组件。</p>
      </Modal>
      <DestructiveActionDialog
        action={dangerAction}
        onClose={() => setDangerAction(null)}
        onConfirm={async () => ({ ok: true, message: '危险操作交互示例已完成，未更改任何数据。' })}
        onSuccess={setAnnouncement}
        open={Boolean(dangerAction)}
      />
    </div>
  )
}
