import type { Key, ReactNode } from 'react'

export type DataTableColumn<Row> = {
  id: string
  header: ReactNode
  cell: (row: Row) => ReactNode
  align?: 'left' | 'center' | 'right'
  className?: string
}

type DataTableProps<Row> = {
  ariaLabel: string
  columns: DataTableColumn<Row>[]
  rows: readonly Row[]
  rowKey: (row: Row) => Key
  footer?: ReactNode
  minimumWidth?: 'standard' | 'wide'
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
  surface = false,
}: DataTableProps<Row>) {
  return (
    <section className={surface ? 'data-table-shell surface-card' : 'data-table-shell'} aria-label={ariaLabel}>
      {/* biome-ignore lint/a11y/noNoninteractiveTabindex: 横向溢出区需要进入键盘焦点流，才能使用方向键滚动。 */}
      <section className="data-table-region" aria-label={`${ariaLabel}，可横向滚动`} tabIndex={0}>
        <table className={`data-table data-table--${minimumWidth}`}>
          <caption className="sr-only">{ariaLabel}</caption>
          <thead>
            <tr>
              {columns.map((column) => (
                <th className={`${alignment[column.align ?? 'left']} ${column.className ?? ''}`} key={column.id} scope="col">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)}>
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
      {footer && <footer className="data-table-footer">{footer}</footer>}
    </section>
  )
}
