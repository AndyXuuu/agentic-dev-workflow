import { useCallback, useEffect, useMemo, useState } from 'react'

import { downloadCsv } from '../../lib/csv'
import { resourceConfig, type ResourceKey, type ResourceRow } from './resource.data'
import { listResourceRows } from './resource.repository'

export type ResourceLoadState = 'error' | 'loading' | 'ready'
export type ResourceSortDirection = 'ascending' | 'descending' | 'none'

export function useResourceList(resource: ResourceKey) {
  const config = resourceConfig[resource]
  const [announcement, setAnnouncement] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [draftName, setDraftName] = useState('')
  const [loadState, setLoadState] = useState<ResourceLoadState>('loading')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSizeState] = useState(2)
  const [query, setQueryState] = useState('')
  const [reloadVersion, setReloadVersion] = useState(0)
  const [rows, setRows] = useState<ResourceRow[]>([])
  const [selected, setSelected] = useState<ResourceRow | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<Set<string>>(() => new Set())
  const [sortDirection, setSortDirection] = useState<ResourceSortDirection>('none')
  const [statusFilter, setStatusFilterState] = useState('all')

  // biome-ignore lint/correctness/useExhaustiveDependencies: reloadVersion is an explicit retry trigger, not request data.
  useEffect(() => {
    const controller = new AbortController()
    setLoadState('loading')
    void listResourceRows(resource, controller.signal)
      .then((nextRows) => {
        setRows(nextRows)
        setLoadState('ready')
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoadState('error')
      })
    return () => controller.abort()
  }, [reloadVersion, resource])

  const statuses = useMemo(() => [...new Set(rows.map((row) => row.status))], [rows])
  const statusOptions = useMemo(() => [{ label: '全部状态', value: 'all' }, ...statuses.map((status) => ({ label: status, value: status }))], [statuses])
  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('zh-CN')
    return rows.filter((row) => {
      const matchesQuery = !normalized || [row.id, row.title, row.subtitle, row.meta, row.status].some((value) => value.toLocaleLowerCase('zh-CN').includes(normalized))
      return matchesQuery && (statusFilter === 'all' || row.status === statusFilter)
    })
  }, [query, rows, statusFilter])
  const sortedRows = useMemo(() => {
    if (sortDirection === 'none') return filteredRows
    return [...filteredRows].sort((left, right) => {
      const result = left.id.localeCompare(right.id, 'zh-CN', {
        numeric: true,
      })
      return sortDirection === 'ascending' ? result : -result
    })
  }, [filteredRows, sortDirection])
  const pageCount = Math.max(1, Math.ceil(sortedRows.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visibleRows = useMemo(() => sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize), [currentPage, pageSize, sortedRows])

  const clearSelectionAndResetPage = useCallback(() => {
    setPage(1)
    setSelectedRowKeys(new Set())
  }, [])

  const createRow = () => {
    const title = draftName.trim()
    if (!title) return
    const row: ResourceRow = {
      id: `LOCAL-${String(rows.length + 1).padStart(3, '0')}`,
      meta: '等待接入服务端',
      status: '草稿',
      subtitle: '本地演示记录',
      title,
      tone: 'neutral',
      value: '—',
    }
    setRows((current) => [row, ...current])
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
    setQueryState('')
    setStatusFilterState('all')
    clearSelectionAndResetPage()
  }

  return {
    announcement,
    closeCreate: () => setCreateOpen(false),
    config,
    createOpen,
    createRow,
    currentPage,
    draftName,
    exportRows,
    loadState,
    openCreate: () => setCreateOpen(true),
    pageSize,
    query,
    resetFilters,
    retry: () => setReloadVersion((current) => current + 1),
    selected,
    selectedRowKeys,
    setDraftName,
    setPage,
    setPageSize: (value: number) => {
      setPageSizeState(value)
      setPage(1)
    },
    setQuery: (value: string) => {
      setQueryState(value)
      clearSelectionAndResetPage()
    },
    setSelected,
    setStatusFilter: (value: string) => {
      setStatusFilterState(value)
      clearSelectionAndResetPage()
    },
    sortedRows,
    statusFilter,
    statusOptions,
    toggleRow: (row: ResourceRow, checked: boolean) =>
      setSelectedRowKeys((current) => {
        const next = new Set(current)
        if (checked) next.add(row.id)
        else next.delete(row.id)
        return next
      }),
    toggleSelectAll: (checked: boolean) =>
      setSelectedRowKeys((current) => {
        const next = new Set(current)
        for (const row of visibleRows) {
          if (checked) next.add(row.id)
          else next.delete(row.id)
        }
        return next
      }),
    toggleSort: () => {
      setSortDirection((current) => (current === 'ascending' ? 'descending' : 'ascending'))
      setPage(1)
    },
    sortDirection,
    visibleRows,
  }
}
