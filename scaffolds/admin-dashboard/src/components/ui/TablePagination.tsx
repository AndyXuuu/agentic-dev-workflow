import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from './Button'
import { Select } from './Select'

type TablePaginationProps = {
  ariaLabel: string
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  page: number
  pageSize: number
  pageSizeOptions?: readonly number[]
  total: number
}

export function TablePagination({
  ariaLabel,
  onPageChange,
  onPageSizeChange,
  page,
  pageSize,
  pageSizeOptions = [5, 10, 20],
  total,
}: TablePaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(Math.max(page, 1), pageCount)
  const first = total === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const last = Math.min(currentPage * pageSize, total)

  return (
    <nav aria-label={ariaLabel} className="app-table-pagination">
      <p aria-live="polite" className="app-caption app-text-muted">
        显示 {first}–{last}，共 {total} 条
      </p>
      <div className="app-table-pagination__controls">
        <Select
          aria-label="每页条数"
          className="w-24"
          label="每页条数"
          labelHidden
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          value={pageSize}
        >
          {pageSizeOptions.map((option) => <option key={option} value={option}>{option} 条/页</option>)}
        </Select>
        <span className="app-caption app-text-secondary tabular-nums">{currentPage} / {pageCount}</span>
        <Button aria-label="上一页" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)} size="small" square variant="ghost">
          <ChevronLeft aria-hidden className="app-icon-sm" />
        </Button>
        <Button aria-label="下一页" disabled={currentPage >= pageCount} onClick={() => onPageChange(currentPage + 1)} size="small" square variant="ghost">
          <ChevronRight aria-hidden className="app-icon-sm" />
        </Button>
      </div>
    </nav>
  )
}
