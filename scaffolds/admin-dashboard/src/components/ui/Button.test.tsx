import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Button } from './Button'

describe('Button', () => {
  it('exposes an unavailable busy action while loading', () => {
    render(<Button loading variant="primary">保存设置</Button>)

    const button = screen.getByRole('button', { name: '保存设置' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
  })

  it('defaults to a non-submitting button', () => {
    render(<Button>打开详情</Button>)

    expect(screen.getByRole('button', { name: '打开详情' })).toHaveAttribute('type', 'button')
  })
})
