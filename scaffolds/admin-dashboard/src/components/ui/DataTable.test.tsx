import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { DataTable, type DataTableColumn } from './DataTable'

type Row = { id: string; name: string }

const columns: DataTableColumn<Row>[] = [
  { id: 'id', header: '编号', cell: (row) => row.id },
  { id: 'name', header: '名称', cell: (row) => row.name },
]

describe('DataTable', () => {
  it('provides a named scroll region and semantic table structure', () => {
    render(<DataTable ariaLabel="商品列表" columns={columns} rowKey={(row) => row.id} rows={[{ id: '1', name: '示例商品' }]} surface />)

    const region = screen.getByRole('region', { name: '商品列表，可横向滚动' })
    const table = within(region).getByRole('table', { name: '商品列表' })
    expect(within(table).getByRole('columnheader', { name: '编号' })).toBeVisible()
    expect(within(table).getByRole('cell', { name: '示例商品' })).toBeVisible()
  })

  it('exposes the remaining horizontal content through its shared edge affordance', () => {
    render(<DataTable ariaLabel="商品列表" columns={columns} rowKey={(row) => row.id} rows={[{ id: '1', name: '示例商品' }]} />)

    const region = screen.getByRole('region', { name: '商品列表，可横向滚动' })
    const frame = region.parentElement as HTMLElement
    Object.defineProperties(region, {
      clientWidth: { configurable: true, value: 320 },
      scrollLeft: { configurable: true, value: 0, writable: true },
      scrollWidth: { configurable: true, value: 704 },
    })

    fireEvent(window, new Event('resize'))
    expect(frame).toHaveAttribute('data-overflow', 'true')
    expect(frame).toHaveAttribute('data-at-end', 'false')

    region.scrollLeft = 384
    fireEvent.scroll(region)
    expect(frame).toHaveAttribute('data-at-end', 'true')
  })

  it('exposes controlled sort and current-page selection semantics', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    const onRowSelectionChange = vi.fn()
    const onSelectAllChange = vi.fn()
    render(
      <DataTable
        ariaLabel="商品列表"
        columns={[
          { ...columns[0], sort: { direction: 'ascending', label: '按编号排序', onToggle } },
          columns[1],
        ]}
        rowKey={(row) => row.id}
        rows={[{ id: '1', name: '商品一' }, { id: '2', name: '商品二' }]}
        selection={{
          selectedKeys: new Set(['1']),
          rowLabel: (row) => `商品 ${row.name}`,
          onRowSelectionChange,
          onSelectAllChange,
        }}
      />,
    )

    const sortableHeader = screen.getByRole('columnheader', { name: /编号/ })
    expect(sortableHeader).toHaveAttribute('aria-sort', 'ascending')
    await user.click(within(sortableHeader).getByRole('button', { name: '按编号排序，升序' }))
    expect(onToggle).toHaveBeenCalledOnce()

    const selectAll = screen.getByRole('checkbox', { name: '选择当前页全部记录' })
    expect(selectAll).toBePartiallyChecked()
    expect(screen.getByRole('row', { name: /商品一/ })).toHaveAttribute('aria-selected', 'true')
    await user.click(screen.getByRole('checkbox', { name: '选择商品 商品二' }))
    expect(onRowSelectionChange).toHaveBeenCalledWith({ id: '2', name: '商品二' }, true)
    await user.click(selectAll)
    expect(onSelectAllChange).toHaveBeenCalledWith(true)
  })
})
