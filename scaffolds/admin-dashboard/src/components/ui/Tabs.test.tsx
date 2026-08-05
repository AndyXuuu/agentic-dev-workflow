import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

import { Tabs } from './Tabs'

function TabsExample() {
  const [value, setValue] = useState('overview')
  return (
    <Tabs
      ariaLabel="账户分类"
      items={[
        { id: 'overview', label: '概览', content: '概览内容' },
        { id: 'disabled', label: '禁用页签', content: '不可见内容', disabled: true },
        { id: 'activity', label: '活动', content: '活动内容' },
      ]}
      onValueChange={setValue}
      value={value}
    />
  )
}

describe('Tabs', () => {
  it('uses automatic keyboard activation and skips disabled tabs', async () => {
    const user = userEvent.setup()
    render(<TabsExample />)

    const overview = screen.getByRole('tab', { name: '概览' })
    const activity = screen.getByRole('tab', { name: '活动' })
    expect(overview).toHaveAttribute('aria-selected', 'true')
    expect(overview).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('概览内容')

    overview.focus()
    await user.keyboard('{ArrowRight}')
    expect(activity).toHaveFocus()
    expect(activity).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('活动内容')

    await user.keyboard('{Home}')
    expect(overview).toHaveFocus()
    expect(overview).toHaveAttribute('aria-selected', 'true')
  })
})
