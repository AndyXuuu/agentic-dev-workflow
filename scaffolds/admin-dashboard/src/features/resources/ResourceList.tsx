import { Download, Plus } from 'lucide-react'
import { useMemo } from 'react'

import { Button, DataTable, type DataTableColumn, ListToolbar, Modal, PageHeader, PageState, Skeleton, StatusBadge, TablePagination, TextInput } from '../../components/ui'
import type { ResourceKey, ResourceRow } from './resource.data'
import { useResourceList } from './useResourceList'

function ResourceTableSkeleton({ label }: { label: string }) {
  return (
    <div aria-label={label} className="app-table-skeleton" role="status">
      <h2 className="sr-only">加载数据</h2>
      <div className="app-table-skeleton__toolbar">
        <Skeleton className="w-32" />
        <Skeleton className="w-20" variant="control" />
      </div>
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

export function ResourceList({ resource }: { resource: ResourceKey }) {
  const model = useResourceList(resource)
  const columns = useMemo<DataTableColumn<ResourceRow>[]>(
    () => [
      {
        id: 'id',
        header: '编号',
        cell: (row) => <span className="font-semibold">{row.id}</span>,
        sort: {
          direction: model.sortDirection,
          label: '按编号排序',
          onToggle: model.toggleSort,
        },
      },
      {
        id: 'name',
        header: '名称',
        cell: (row) => (
          <span>
            <span className="block font-medium">{row.title}</span>
            <span className="app-caption app-text-muted">{row.subtitle}</span>
          </span>
        ),
      },
      {
        id: 'meta',
        header: '信息',
        cell: (row) => row.meta,
        className: 'app-text-secondary',
      },
      {
        id: 'value',
        header: '价值',
        cell: (row) => <span className="font-semibold tabular-nums">{row.value}</span>,
      },
      {
        id: 'status',
        header: '状态',
        cell: (row) => <StatusBadge label={row.status} tone={row.tone} />,
      },
      {
        id: 'actions',
        header: <span className="sr-only">操作</span>,
        align: 'right',
        cell: (row) => (
          <Button onClick={() => model.setSelected(row)} size="small" variant="ghost">
            查看
          </Button>
        ),
      },
    ],
    [model.setSelected, model.sortDirection, model.toggleSort],
  )

  return (
    <div className="app-page-stack">
      <PageHeader
        actions={
          <>
            <Button
              className="border-base-300"
              disabled={model.loadState !== 'ready' || model.sortedRows.length === 0}
              onClick={model.exportRows}
              size="small"
              startIcon={<Download aria-hidden className="app-icon-sm" />}
              variant="outline"
            >
              导出 CSV
            </Button>
            <Button onClick={model.openCreate} size="small" startIcon={<Plus aria-hidden className="app-icon-sm" />} variant="primary">
              {model.config.primaryAction}
            </Button>
          </>
        }
        description={model.config.description}
        eyebrow="Management"
        title={model.config.title}
      />
      <p aria-live="polite" className="sr-only">
        {model.announcement}
      </p>

      <section aria-label={`${model.config.title}列表与工具`} className="surface-card" id="resource-list-results">
        <ListToolbar
          ariaLabel={`${model.config.title}筛选工具`}
          controlsId="resource-list-content"
          filterLabel="按状态筛选"
          filterOptions={model.statusOptions}
          filterValue={model.statusFilter}
          onFilterChange={model.setStatusFilter}
          onReset={model.resetFilters}
          onSearchChange={model.setQuery}
          resultSummary={model.loadState === 'ready' ? `共 ${model.sortedRows.length} 条结果` : '正在准备列表结果'}
          searchLabel={model.config.search}
          searchValue={model.query}
        />

        <div id="resource-list-content">
          {model.loadState === 'loading' ? (
            <ResourceTableSkeleton label={`${model.config.title}加载占位`} />
          ) : model.loadState === 'error' ? (
            <PageState description="演示数据源暂时不可用，请重试恢复列表。" onRetry={model.retry} state="error" surface={false} title="加载失败" />
          ) : model.sortedRows.length === 0 ? (
            <PageState description="尝试修改关键词或状态筛选查看其他演示数据。" state="empty" surface={false} title="没有匹配结果" />
          ) : (
            <DataTable
              ariaLabel={`${model.config.title}列表`}
              columns={columns}
              footer={
                <div className="grid gap-3">
                  <p className="app-body app-text-muted">已选择 {model.selectedRowKeys.size} 条记录</p>
                  <TablePagination
                    ariaLabel={`${model.config.title}分页`}
                    onPageChange={model.setPage}
                    onPageSizeChange={model.setPageSize}
                    page={model.currentPage}
                    pageSize={model.pageSize}
                    pageSizeOptions={[2, 5, 10]}
                    total={model.sortedRows.length}
                  />
                </div>
              }
              rowKey={(row) => row.id}
              rows={model.visibleRows}
              selection={{
                selectedKeys: model.selectedRowKeys,
                rowLabel: (row) => `记录 ${row.id}`,
                onRowSelectionChange: model.toggleRow,
                onSelectAllChange: model.toggleSelectAll,
              }}
            />
          )}
        </div>
      </section>

      <Modal description="该记录只保存在当前页面状态中，用于演示创建流程。" onClose={model.closeCreate} open={model.createOpen} title={model.config.primaryAction}>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            model.createRow()
          }}
        >
          <TextInput data-autofocus label="名称" maxLength={80} name="name" onChange={(event) => model.setDraftName(event.target.value)} required value={model.draftName} />
          <div className="flex justify-end gap-2">
            <Button onClick={model.closeCreate} variant="ghost">
              取消
            </Button>
            <Button type="submit" variant="primary">
              保存演示记录
            </Button>
          </div>
        </form>
      </Modal>

      <Modal onClose={() => model.setSelected(null)} open={model.selected !== null} title={model.selected?.title ?? '记录详情'}>
        {model.selected && (
          <dl className="app-body grid grid-cols-[auto_1fr] gap-x-6 gap-y-3">
            <dt className="app-text-muted">编号</dt>
            <dd className="font-medium">{model.selected.id}</dd>
            <dt className="app-text-muted">信息</dt>
            <dd>{model.selected.meta}</dd>
            <dt className="app-text-muted">价值</dt>
            <dd>{model.selected.value}</dd>
            <dt className="app-text-muted">状态</dt>
            <dd>
              <StatusBadge label={model.selected.status} tone={model.selected.tone} />
            </dd>
          </dl>
        )}
      </Modal>
    </div>
  )
}
