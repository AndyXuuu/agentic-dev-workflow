import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

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
})
