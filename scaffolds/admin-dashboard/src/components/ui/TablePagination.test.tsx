import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { TablePagination } from './TablePagination'

describe('TablePagination', () => {
  it('reports the visible range and enforces page boundaries', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    const onPageSizeChange = vi.fn()
    const { rerender } = render(
      <TablePagination ariaLabel="订单分页" onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} page={1} pageSize={10} total={24} />,
    )

    expect(screen.getByText('显示 1–10，共 24 条')).toBeVisible()
    expect(screen.getByRole('button', { name: '上一页' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: '下一页' }))
    expect(onPageChange).toHaveBeenCalledWith(2)

    rerender(<TablePagination ariaLabel="订单分页" onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} page={3} pageSize={10} total={24} />)
    expect(screen.getByText('显示 21–24，共 24 条')).toBeVisible()
    expect(screen.getByRole('button', { name: '下一页' })).toBeDisabled()

    await user.selectOptions(screen.getByRole('combobox', { name: '每页条数' }), '20')
    expect(onPageSizeChange).toHaveBeenCalledWith(20)
  })
})
