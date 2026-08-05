import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { DropdownMenu } from './DropdownMenu'

describe('DropdownMenu', () => {
  it('supports menu keyboard navigation, selection, and focus restoration', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <DropdownMenu
        items={[
          { id: 'edit', label: '编辑资料', onSelect },
          { id: 'disabled', label: '不可用操作', disabled: true, onSelect: vi.fn() },
          { id: 'archive', label: '归档记录', onSelect: vi.fn() },
        ]}
        label="记录操作"
        trigger="更多操作"
      />,
    )

    const trigger = screen.getByRole('button', { name: '记录操作' })
    await user.click(trigger)
    expect(screen.getByRole('menu', { name: '记录操作' })).toBeVisible()
    expect(screen.getByRole('menuitem', { name: '编辑资料' })).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: '归档记录' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()

    await user.click(trigger)
    await user.click(screen.getByRole('menuitem', { name: '编辑资料' }))
    expect(onSelect).toHaveBeenCalledOnce()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('keeps its portal inside a modal dialog when the trigger belongs to that dialog', async () => {
    const user = userEvent.setup()
    render(
      <dialog open>
        <DropdownMenu
          items={[{ id: 'settings', label: '设置', onSelect: vi.fn() }]}
          label="抽屉账户导航"
          trigger="打开账户菜单"
        />
      </dialog>,
    )

    await user.click(screen.getByRole('button', { name: '抽屉账户导航' }))
    const menu = screen.getByRole('menu', { name: '抽屉账户导航' })
    expect(menu.closest('dialog')).toBe(screen.getByRole('dialog'))
  })
})
