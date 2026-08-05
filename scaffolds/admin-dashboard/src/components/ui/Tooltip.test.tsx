import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Button } from './Button'
import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
  it('associates its visible label with the trigger without replacing the trigger name', () => {
    render(
      <Tooltip label="打开当前记录的操作菜单">
        {({ 'aria-describedby': describedBy }) => <Button aria-describedby={describedBy}>更多操作</Button>}
      </Tooltip>,
    )

    const trigger = screen.getByRole('button', { name: '更多操作' })
    expect(trigger).toHaveAccessibleDescription('打开当前记录的操作菜单')
    expect(screen.getByRole('tooltip', { name: '打开当前记录的操作菜单' })).toBeInTheDocument()
  })
})
