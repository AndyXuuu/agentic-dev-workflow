import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

import { Modal } from './Modal'

function ModalHarness() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)} type="button">打开详情</button>
      <Modal description="订单详情说明" onClose={() => setOpen(false)} open={open} title="订单详情">
        <button data-autofocus="primary" type="button">确认订单</button>
      </Modal>
    </>
  )
}

describe('Modal', () => {
  it('moves focus into the dialog, closes on cancel, and restores the trigger focus', async () => {
    const user = userEvent.setup()
    render(<ModalHarness />)

    const trigger = screen.getByRole('button', { name: '打开详情' })
    await user.click(trigger)

    const dialog = screen.getByRole('dialog', { name: '订单详情' })
    await waitFor(() => expect(screen.getByRole('button', { name: '确认订单' })).toHaveFocus())

    fireEvent(dialog, new Event('cancel', { bubbles: false, cancelable: true }))

    await waitFor(() => expect(dialog).not.toHaveAttribute('open'))
    expect(trigger).toHaveFocus()
  })
})
