import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { Checkbox } from './Checkbox'
import { RadioGroup } from './RadioGroup'
import { Select } from './Select'
import { Switch } from './Switch'
import { TextInput } from './TextInput'
import { Textarea } from './Textarea'

describe('shared form controls', () => {
  it('associates labels, hints, and errors with their native controls', () => {
    render(
      <>
        <TextInput error="邮箱格式不正确" label="支持邮箱" />
        <Select hint="使用工作区默认值" label="时区"><option>UTC</option></Select>
        <Textarea hint="仅管理员可见" label="内部备注" />
      </>,
    )

    const input = screen.getByRole('textbox', { name: '支持邮箱' })
    expect(input).toHaveAccessibleDescription('邮箱格式不正确')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('combobox', { name: '时区' })).toHaveAccessibleDescription('使用工作区默认值')
    expect(screen.getByRole('textbox', { name: '内部备注' })).toHaveAccessibleDescription('仅管理员可见')
  })

  it('reflects the mixed selection state on a checkbox', () => {
    render(<Checkbox indeterminate label="选择当前页" />)

    expect(screen.getByRole('checkbox', { name: '选择当前页' })).toBePartiallyChecked()
  })

  it('reports radio selection through the group public interaction', async () => {
    const onValueChange = vi.fn()
    const user = userEvent.setup()
    render(
      <RadioGroup
        label="默认权限"
        onValueChange={onValueChange}
        options={[{ label: '查看者', value: 'viewer' }, { label: '编辑者', value: 'editor' }]}
      />,
    )

    await user.click(screen.getByRole('radio', { name: '编辑者' }))
    expect(onValueChange).toHaveBeenCalledWith('editor')
  })

  it('toggles a controlled switch and preserves its disabled boundary', async () => {
    const user = userEvent.setup()

    function Harness() {
      const [checked, setChecked] = useState(false)
      return (
        <>
          <Switch checked={checked} label="库存告警" onChange={(event) => setChecked(event.target.checked)} />
          <Switch checked={false} disabled label="系统维护" />
        </>
      )
    }

    render(<Harness />)
    const inventorySwitch = screen.getByRole('switch', { name: '库存告警' })
    inventorySwitch.focus()
    await user.keyboard(' ')
    expect(inventorySwitch).toBeChecked()
    expect(screen.getByRole('switch', { name: '系统维护' })).toBeDisabled()
  })
})
