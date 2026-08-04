import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ProgressBar } from './ProgressBar'

describe('ProgressBar', () => {
  it('announces a named determinate value and shows its percentage', () => {
    render(<ProgressBar label="数据导入" value={42} />)

    const progress = screen.getByRole('progressbar', { name: '数据导入' })
    expect(progress).toHaveAttribute('max', '100')
    expect(progress).toHaveAttribute('value', '42')
    expect(screen.getByText('42%')).toBeVisible()
  })

  it('keeps determinate values inside the visible range', () => {
    const { rerender } = render(<ProgressBar label="文件处理" max={120} value={180} />)

    expect(screen.getByRole('progressbar', { name: '文件处理' })).toHaveAttribute('value', '120')
    expect(screen.getByText('100%')).toBeVisible()

    rerender(<ProgressBar label="文件处理" max={120} value={-20} />)
    expect(screen.getByRole('progressbar', { name: '文件处理' })).toHaveAttribute('value', '0')
    expect(screen.getByText('0%')).toBeVisible()
  })

  it('exposes an indeterminate state with an optional status label', () => {
    render(<ProgressBar label="库存同步" valueLabel="正在等待服务响应" />)

    const progress = screen.getByRole('progressbar', { name: '库存同步' })
    expect(progress).not.toHaveAttribute('value')
    expect(progress).toHaveAttribute('aria-valuetext', '正在等待服务响应')
    expect(screen.getByText('正在等待服务响应')).toBeVisible()
  })
})
