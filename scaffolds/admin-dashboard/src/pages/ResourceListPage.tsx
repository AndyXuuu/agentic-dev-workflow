import { Download, Plus } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { DataTable, type DataTableColumn } from '../components/ui/DataTable'
import { ListToolbar } from '../components/ui/ListToolbar'
import { Modal } from '../components/ui/Modal'
import { PageHeader } from '../components/ui/PageHeader'
import { PageState } from '../components/ui/PageState'
import { StatusBadge } from '../components/ui/StatusBadge'
import { downloadCsv } from '../lib/csv'
import { resourceConfig, resourceRows, type ResourceKey, type ResourceRow } from './resource.data'

type ResourceListPageProps = {
  resource: ResourceKey
}

type LoadState = 'loading' | 'ready' | 'error'

export function ResourceListPage({ resource }: ResourceListPageProps) {
  const config = resourceConfig[resource]
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [localRows, setLocalRows] = useState<ResourceRow[]>(() => [...resourceRows[resource]])
  const [createOpen, setCreateOpen] = useState(false)
  const [draftName, setDraftName] = useState('')
  const [selected, setSelected] = useState<ResourceRow | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const timerRef = useRef<number | null>(null)

  const startLoad = useCallback(() => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    setLoadState('loading')
    timerRef.current = window.setTimeout(() => {
      setLoadState('ready')
      timerRef.current = null
    }, 180)
  }, [])

  useEffect(() => {
    startLoad()
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    }
  }, [startLoad])

  const statuses = useMemo(() => [...new Set(localRows.map((row) => row.status))], [localRows])
  const statusOptions = useMemo(() => [
    { label: '全部状态', value: 'all' },
    ...statuses.map((status) => ({ label: status, value: status })),
  ], [statuses])
  const rows = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('zh-CN')
    return localRows.filter((row) => {
      const matchesQuery = !normalized || [row.id, row.title, row.subtitle, row.meta, row.status].some((value) =>
        value.toLocaleLowerCase('zh-CN').includes(normalized))
      const matchesStatus = statusFilter === 'all' || row.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [localRows, query, statusFilter])

  const columns = useMemo<DataTableColumn<ResourceRow>[]>(() => [
    { id: 'id', header: '编号', cell: (row) => <span className="font-semibold">{row.id}</span> },
    { id: 'name', header: '名称', cell: (row) => <span><span className="block font-medium">{row.title}</span><span className="app-caption app-text-muted">{row.subtitle}</span></span> },
    { id: 'meta', header: '信息', cell: (row) => row.meta, className: 'app-text-secondary' },
    { id: 'value', header: '价值', cell: (row) => <span className="font-semibold tabular-nums">{row.value}</span> },
    { id: 'status', header: '状态', cell: (row) => <StatusBadge label={row.status} tone={row.tone} /> },
    { id: 'actions', header: <span className="sr-only">操作</span>, align: 'right', cell: (row) => <button className="btn btn-ghost btn-sm" onClick={() => setSelected(row)} type="button">查看</button> },
  ], [])

  const createRow = () => {
    const title = draftName.trim()
    if (!title) return
    const row: ResourceRow = {
      id: `LOCAL-${String(localRows.length + 1).padStart(3, '0')}`,
      title,
      subtitle: '本地演示记录',
      meta: '等待接入服务端',
      value: '—',
      status: '草稿',
      tone: 'neutral',
    }
    setLocalRows((current) => [row, ...current])
    setDraftName('')
    setCreateOpen(false)
    setAnnouncement(`${title} 已添加到本地演示列表`)
  }

  const exportRows = () => {
    const header = ['编号', '名称', '补充信息', '业务信息', '价值', '状态']
    const data = rows.map((row) => [row.id, row.title, row.subtitle, row.meta, row.value, row.status])
    downloadCsv(`${resource}.csv`, [header, ...data])
    setAnnouncement(`已导出 ${rows.length} 条${config.title}记录`)
  }

  const resetFilters = () => {
    setQuery('')
    setStatusFilter('all')
  }

  return (
    <div className="app-page-stack">
      <PageHeader
        actions={
          <>
            <button className="btn btn-outline btn-sm border-base-300" disabled={loadState !== 'ready' || rows.length === 0} onClick={exportRows} type="button">
              <Download aria-hidden size={17} />导出 CSV
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => setCreateOpen(true)} type="button">
              <Plus aria-hidden size={17} />{config.primaryAction}
            </button>
          </>
        }
        description={config.description}
        eyebrow="Management"
        title={config.title}
      />
      <p aria-live="polite" className="sr-only">{announcement}</p>

      <section aria-label={`${config.title}列表与工具`} className="surface-card" id="resource-list-results">
        <ListToolbar
          ariaLabel={`${config.title}筛选工具`}
          controlsId="resource-list-content"
          filterLabel="按状态筛选"
          filterOptions={statusOptions}
          filterValue={statusFilter}
          onFilterChange={setStatusFilter}
          onReset={resetFilters}
          onSearchChange={setQuery}
          resultSummary={loadState === 'ready' ? `共 ${rows.length} 条结果` : '正在准备列表结果'}
          searchLabel={config.search}
          searchValue={query}
        />

        <div id="resource-list-content">
          {loadState === 'loading' ? (
            <PageState description="正在读取本地演示 repository。" state="loading" surface={false} title="加载数据" />
          ) : loadState === 'error' ? (
            <PageState description="演示数据源暂时不可用，请重试恢复列表。" onRetry={startLoad} state="error" surface={false} title="加载失败" />
          ) : rows.length === 0 ? (
            <PageState description="尝试修改关键词或状态筛选查看其他演示数据。" state="empty" surface={false} title="没有匹配结果" />
          ) : (
            <DataTable
              ariaLabel={`${config.title}列表`}
              columns={columns}
              footer={
                <div className="app-body app-text-muted flex flex-wrap items-center justify-between gap-3">
                  <span>显示 {rows.length} 条演示记录</span>
                  <button className="link link-hover" onClick={() => setLoadState('error')} type="button">预览错误状态</button>
                </div>
              }
              rowKey={(row) => row.id}
              rows={rows}
            />
          )}
        </div>
      </section>

      <Modal description="该记录只保存在当前页面状态中，用于演示创建流程。" onClose={() => setCreateOpen(false)} open={createOpen} title={config.primaryAction}>
        <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); createRow() }}>
          <label className="form-control block">
            <span className="label-text mb-2 block font-medium">名称</span>
            <input className="input input-bordered w-full" data-autofocus maxLength={80} name="name" onChange={(event) => setDraftName(event.target.value)} required value={draftName} />
          </label>
          <div className="flex justify-end gap-2">
            <button className="btn btn-ghost" onClick={() => setCreateOpen(false)} type="button">取消</button>
            <button className="btn btn-primary" type="submit">保存演示记录</button>
          </div>
        </form>
      </Modal>

      <Modal onClose={() => setSelected(null)} open={selected !== null} title={selected?.title ?? '记录详情'}>
        {selected && (
          <dl className="app-body grid grid-cols-[auto_1fr] gap-x-6 gap-y-3">
            <dt className="app-text-muted">编号</dt><dd className="font-medium">{selected.id}</dd>
            <dt className="app-text-muted">信息</dt><dd>{selected.meta}</dd>
            <dt className="app-text-muted">价值</dt><dd>{selected.value}</dd>
            <dt className="app-text-muted">状态</dt><dd><StatusBadge label={selected.status} tone={selected.tone} /></dd>
          </dl>
        )}
      </Modal>
    </div>
  )
}
