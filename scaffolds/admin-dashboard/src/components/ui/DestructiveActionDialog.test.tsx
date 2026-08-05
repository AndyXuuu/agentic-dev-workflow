import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import type { DangerZoneAction } from './DangerZone'
import { DestructiveActionDialog, type DestructiveActionResult } from './DestructiveActionDialog'

const action: DangerZoneAction = {
  id: 'reset-data',
  title: '重置工作区数据',
  description: '永久清除工作区数据。',
  impact: '订单和客户记录将被清除。',
  recovery: '无法直接恢复。',
  triggerLabel: '重置数据',
  confirmLabel: '确认重置',
  confirmationPhrase: 'RESET WORKSPACE',
}

type HarnessProps = {
  onConfirm: (selectedAction: DangerZoneAction) => Promise<DestructiveActionResult>
  onSuccess?: (message: string) => void
}

function DialogHarness({ onConfirm, onSuccess }: HarnessProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)} type="button">打开危险操作</button>
      <DestructiveActionDialog action={action} onClose={() => setOpen(false)} onConfirm={onConfirm} onSuccess={onSuccess} open={open} />
    </>
  )
}

describe('DestructiveActionDialog', () => {
  it('requires the documented phrase and prevents duplicate submission while pending', async () => {
    const user = userEvent.setup()
    let resolveAction: ((result: DestructiveActionResult) => void) | undefined
    const onConfirm = vi.fn(() => new Promise<DestructiveActionResult>((resolve) => { resolveAction = resolve }))
    const onSuccess = vi.fn()
    render(<DialogHarness onConfirm={onConfirm} onSuccess={onSuccess} />)

    const trigger = screen.getByRole('button', { name: '打开危险操作' })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: '重置工作区数据' })
    const confirmButton = screen.getByRole('button', { name: '确认重置' })
    const confirmationInput = screen.getByRole('textbox', { name: '输入确认短语' })
    expect(confirmButton).toBeDisabled()
    expect(confirmationInput).toHaveFocus()

    await user.type(confirmationInput, 'RESET')
    expect(confirmButton).toBeDisabled()
    await user.clear(confirmationInput)
    await user.type(confirmationInput, '  RESET WORKSPACE  ')
    expect(confirmButton).toBeEnabled()

    await user.click(confirmButton)
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: '处理中' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: '处理中' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)

    resolveAction?.({ ok: true, message: '操作已完成。' })
    await waitFor(() => expect(dialog).not.toHaveAttribute('open'))
    expect(trigger).toHaveFocus()
    expect(onSuccess).toHaveBeenCalledWith('操作已完成。')
  })

  it('keeps a failed action open and exposes an actionable error for retry', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn().mockResolvedValue({ ok: false, message: '权限已过期，请重新验证身份。' })
    render(<DialogHarness onConfirm={onConfirm} />)

    await user.click(screen.getByRole('button', { name: '打开危险操作' }))
    await user.type(screen.getByRole('textbox', { name: '输入确认短语' }), 'RESET WORKSPACE')
    await user.click(screen.getByRole('button', { name: '确认重置' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('权限已过期，请重新验证身份。')
    expect(screen.getByRole('dialog', { name: '重置工作区数据' })).toHaveAttribute('open')
    expect(screen.getByRole('button', { name: '确认重置' })).toBeEnabled()
  })
})
