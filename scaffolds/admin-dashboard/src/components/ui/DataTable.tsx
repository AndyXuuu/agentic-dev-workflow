import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import type { Key, ReactNode } from 'react'

import { useHorizontalOverflow } from '../../hooks/useHorizontalOverflow'
import { Button } from './Button'
import { Checkbox } from './Checkbox'

export type DataTableSort = {
  direction: 'ascending' | 'descending' | 'none'
  label: string
  onToggle: () => void
}

export type DataTableSelection<Row> = {
  onRowSelectionChange: (row: Row, selected: boolean) => void
  onSelectAllChange: (selected: boolean) => void
  rowLabel: (row: Row) => string
  selectedKeys: ReadonlySet<Key>
}

export type DataTableColumn<Row> = {
  id: string
  header: ReactNode
  cell: (row: Row) => ReactNode
  align?: 'left' | 'center' | 'right'
  className?: string
  sort?: DataTableSort
}

type DataTableProps<Row> = {
  ariaLabel: string
  columns: DataTableColumn<Row>[]
  rows: readonly Row[]
  rowKey: (row: Row) => Key
  footer?: ReactNode
  minimumWidth?: 'standard' | 'wide'
  selection?: DataTableSelection<Row>
  surface?: boolean
}

const alignment = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

export function DataTable<Row>({
  ariaLabel,
  columns,
  rows,
  rowKey,
  footer,
  minimumWidth = 'standard',
  selection,
  surface = false,
}: DataTableProps<Row>) {
  const overflow = useHorizontalOverflow<HTMLElement>()
  const selectedCount = selection ? rows.filter((row) => selection.selectedKeys.has(rowKey(row))).length : 0
  const allSelected = rows.length > 0 && selectedCount === rows.length
  const partlySelected = selectedCount > 0 && !allSelected

  return (
    <section className={surface ? 'data-table-shell surface-card' : 'data-table-shell'} aria-label={ariaLabel}>
      <div
        className="horizontal-scroll-frame"
        data-at-end={overflow.atEnd}
        data-at-start={overflow.atStart}
        data-overflow={overflow.hasOverflow}
      >
        {/* biome-ignore lint/a11y/noNoninteractiveTabindex: 横向溢出区需要进入键盘焦点流，才能使用方向键滚动。 */}
        <section className="data-table-region" aria-label={`${ariaLabel}，可横向滚动`} ref={overflow.ref} tabIndex={0}>
          <table className={`data-table data-table--${minimumWidth}`}>
          <caption className="sr-only">{ariaLabel}</caption>
          <thead>
            <tr>
              {selection && (
                <th className="data-table__selection" scope="col">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={partlySelected}
                    label="选择当前页全部记录"
                    labelHidden
                    onChange={(event) => selection.onSelectAllChange(event.target.checked)}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  aria-sort={column.sort?.direction}
                  className={`${alignment[column.align ?? 'left']} ${column.className ?? ''}`}
                  key={column.id}
                  scope="col"
                >
                  {column.sort ? (
                    <Button
                      aria-label={`${column.sort.label}，${column.sort.direction === 'ascending' ? '升序' : column.sort.direction === 'descending' ? '降序' : '未排序'}`}
                      className="data-table__sort"
                      onClick={column.sort.onToggle}
                      size="small"
                      variant="ghost"
                    >
                      {column.header}
                      {column.sort.direction === 'ascending' ? <ArrowUp aria-hidden className="app-icon-sm" /> : column.sort.direction === 'descending' ? <ArrowDown aria-hidden className="app-icon-sm" /> : <ArrowUpDown aria-hidden className="app-icon-sm" />}
                    </Button>
                  ) : column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr aria-selected={selection ? selection.selectedKeys.has(rowKey(row)) : undefined} key={rowKey(row)}>
                {selection && (
                  <td className="data-table__selection">
                    <Checkbox
                      checked={selection.selectedKeys.has(rowKey(row))}
                      label={`选择${selection.rowLabel(row)}`}
                      labelHidden
                      onChange={(event) => selection.onRowSelectionChange(row, event.target.checked)}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td className={`${alignment[column.align ?? 'left']} ${column.className ?? ''}`} key={column.id}>
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          </table>
        </section>
      </div>
      {footer && <footer className="data-table-footer">{footer}</footer>}
    </section>
  )
}
