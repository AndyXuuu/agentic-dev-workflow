import { Download, Plus } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '../components/ui/Button'
import { DataTable, type DataTableColumn } from '../components/ui/DataTable'
import { ListToolbar } from '../components/ui/ListToolbar'
import { Modal } from '../components/ui/Modal'
import { PageHeader } from '../components/ui/PageHeader'
import { PageState } from '../components/ui/PageState'
import { Skeleton } from '../components/ui/Skeleton'
import { StatusBadge } from '../components/ui/StatusBadge'
import { TablePagination } from '../components/ui/TablePagination'
import { TextInput } from '../components/ui/TextInput'
import { downloadCsv } from '../lib/csv'
import { resourceConfig, resourceRows, type ResourceKey, type ResourceRow } from './resource.data'

type ResourceListPageProps = {
  resource: ResourceKey
}

type LoadState = 'loading' | 'ready' | 'error'
type SortDirection = 'ascending' | 'descending' | 'none'

function ResourceTableSkeleton({ label }: { label: string }) {
  return (
    <div aria-label={label} className="app-table-skeleton" role="status">
      <h2 className="sr-only">加载数据</h2>
      <div className="app-table-skeleton__toolbar"><Skeleton className="w-32" /><Skeleton className="w-20" variant="control" /></div>
      {[0, 1, 2].map((row) => (
        <div className="app-table-skeleton__row" key={row}>
          <Skeleton variant="control" />
          <Skeleton className="w-28" />
          <Skeleton className="w-full" />
          <Skeleton className="w-20" />
        </div>
      ))}
    </div>
  )
}

export function ResourceListPage({ resource }: ResourceListPageProps) {
  const config = resourceConfig[resource]
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [localRows, setLocalRows] = useState<ResourceRow[]>(() => [...resourceRows[resource]])
  const [createOpen, setCreateOpen] = useState(false)
  const [draftName, setDraftName] = useState('')
  const [selected, setSelected] = useState<ResourceRow | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<Set<string>>(() => new Set())
  const [sortDirection, setSortDirection] = useState<SortDirection>('none')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(2)
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
  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('zh-CN')
    return localRows.filter((row) => {
      const matchesQuery = !normalized || [row.id, row.title, row.subtitle, row.meta, row.status].some((value) =>
        value.toLocaleLowerCase('zh-CN').includes(normalized))
      const matchesStatus = statusFilter === 'all' || row.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [localRows, query, statusFilter])
  const sortedRows = useMemo(() => {
    if (sortDirection === 'none') return filteredRows
    return [...filteredRows].sort((left, right) => {
      const result = left.id.localeCompare(right.id, 'zh-CN', { numeric: true })
      return sortDirection === 'ascending' ? result : -result
    })
  }, [filteredRows, sortDirection])
  const pageCount = Math.max(1, Math.ceil(sortedRows.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visibleRows = useMemo(
    () => sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [currentPage, pageSize, sortedRows],
  )

  const columns = useMemo<DataTableColumn<ResourceRow>[]>(() => [
    {
      id: 'id',
      header: '编号',
      cell: (row) => <span className="font-semibold">{row.id}</span>,
      sort: {
        direction: sortDirection,
        label: '按编号排序',
        onToggle: () => {
          setSortDirection((current) => current === 'ascending' ? 'descending' : 'ascending')
          setPage(1)
        },
      },
    },
    { id: 'name', header: '名称', cell: (row) => <span><span className="block font-medium">{row.title}</span><span className="app-caption app-text-muted">{row.subtitle}</span></span> },
    { id: 'meta', header: '信息', cell: (row) => row.meta, className: 'app-text-secondary' },
    { id: 'value', header: '价值', cell: (row) => <span className="font-semibold tabular-nums">{row.value}</span> },
    { id: 'status', header: '状态', cell: (row) => <StatusBadge label={row.status} tone={row.tone} /> },
    { id: 'actions', header: <span className="sr-only">操作</span>, align: 'right', cell: (row) => <Button onClick={() => setSelected(row)} size="small" variant="ghost">查看</Button> },
  ], [sortDirection])

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
    setPage(1)
    setDraftName('')
    setCreateOpen(false)
    setAnnouncement(`${title} 已添加到本地演示列表`)
  }

  const exportRows = () => {
    const header = ['编号', '名称', '补充信息', '业务信息', '价值', '状态']
    const data = sortedRows.map((row) => [row.id, row.title, row.subtitle, row.meta, row.value, row.status])
    downloadCsv(`${resource}.csv`, [header, ...data])
    setAnnouncement(`已导出 ${sortedRows.length} 条${config.title}记录`)
  }

  const resetFilters = () => {
    setQuery('')
    setStatusFilter('all')
    setPage(1)
    setSelectedRowKeys(new Set())
  }

  return (
    <div className="app-page-stack">
      <PageHeader
        actions={
          <>
            <Button className="border-base-300" disabled={loadState !== 'ready' || sortedRows.length === 0} onClick={exportRows} size="small" startIcon={<Download aria-hidden className="app-icon-sm" />} variant="outline">导出 CSV</Button>
            <Button onClick={() => setCreateOpen(true)} size="small" startIcon={<Plus aria-hidden className="app-icon-sm" />} variant="primary">{config.primaryAction}</Button>
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
          onFilterChange={(value) => { setStatusFilter(value); setPage(1); setSelectedRowKeys(new Set()) }}
          onReset={resetFilters}
          onSearchChange={(value) => { setQuery(value); setPage(1); setSelectedRowKeys(new Set()) }}
          resultSummary={loadState === 'ready' ? `共 ${sortedRows.length} 条结果` : '正在准备列表结果'}
          searchLabel={config.search}
          searchValue={query}
        />

        <div id="resource-list-content">
          {loadState === 'loading' ? (
            <ResourceTableSkeleton label={`${config.title}加载占位`} />
          ) : loadState === 'error' ? (
            <PageState description="演示数据源暂时不可用，请重试恢复列表。" onRetry={startLoad} state="error" surface={false} title="加载失败" />
          ) : sortedRows.length === 0 ? (
            <PageState description="尝试修改关键词或状态筛选查看其他演示数据。" state="empty" surface={false} title="没有匹配结果" />
          ) : (
            <DataTable
              ariaLabel={`${config.title}列表`}
              columns={columns}
              footer={
                <div className="grid gap-3">
                  <p className="app-body app-text-muted">已选择 {selectedRowKeys.size} 条记录</p>
                  <TablePagination
                    ariaLabel={`${config.title}分页`}
                    onPageChange={setPage}
                    onPageSizeChange={(value) => { setPageSize(value); setPage(1) }}
                    page={currentPage}
                    pageSize={pageSize}
                    pageSizeOptions={[2, 5, 10]}
                    total={sortedRows.length}
                  />
                </div>
              }
              rowKey={(row) => row.id}
              rows={visibleRows}
              selection={{
                selectedKeys: selectedRowKeys,
                rowLabel: (row) => `记录 ${row.id}`,
                onRowSelectionChange: (row, checked) => setSelectedRowKeys((current) => {
                  const next = new Set(current)
                  if (checked) next.add(row.id)
                  else next.delete(row.id)
                  return next
                }),
                onSelectAllChange: (checked) => setSelectedRowKeys((current) => {
                  const next = new Set(current)
                  for (const row of visibleRows) {
                    if (checked) next.add(row.id)
                    else next.delete(row.id)
                  }
                  return next
                }),
              }}
            />
          )}
        </div>
      </section>

      <Modal description="该记录只保存在当前页面状态中，用于演示创建流程。" onClose={() => setCreateOpen(false)} open={createOpen} title={config.primaryAction}>
        <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); createRow() }}>
          <TextInput data-autofocus label="名称" maxLength={80} name="name" onChange={(event) => setDraftName(event.target.value)} required value={draftName} />
          <div className="flex justify-end gap-2">
            <Button onClick={() => setCreateOpen(false)} variant="ghost">取消</Button>
            <Button type="submit" variant="primary">保存演示记录</Button>
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
