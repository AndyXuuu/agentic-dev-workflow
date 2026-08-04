import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { App } from './App'

describe('admin dashboard scaffold', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/dashboard')
    document.documentElement.dataset.theme = 'corporate'
  })

  it('shows the dashboard through its public route', async () => {
    render(<App />)

    expect(await screen.findByRole('heading', { name: '经营概览' })).toBeVisible()
    expect(screen.getByRole('region', { name: '关键指标' })).toBeVisible()
    expect(screen.getByRole('figure', { name: '年度销售趋势' })).toBeVisible()
    expect(screen.getByRole('figure', { name: '商品分类订单占比' })).toBeVisible()
    expect(screen.getByRole('table')).toBeVisible()
  })

  it('navigates to a management page and exposes an empty search state', async () => {
    const user = userEvent.setup()
    render(<App />)

    const navigation = screen.getByRole('navigation', { name: '主导航' })
    await user.click(within(navigation).getByRole('link', { name: '商品' }))
    expect(await screen.findByRole('heading', { name: '商品管理' })).toBeVisible()
    expect(await screen.findByText('SKU-1001')).toBeVisible()

    await user.type(screen.getByRole('searchbox', { name: '搜索商品或分类' }), '不存在的商品')
    expect(screen.getByRole('heading', { name: '没有匹配结果' })).toBeVisible()
  })

  it('keeps list search, status filtering, reset, export, and create actions consistent', async () => {
    const user = userEvent.setup()
    render(<App />)

    const navigation = screen.getByRole('navigation', { name: '主导航' })
    await user.click(within(navigation).getByRole('link', { name: '商品' }))
    expect(await screen.findByText('SKU-1001')).toBeVisible()

    expect(screen.getByRole('button', { name: '导出 CSV' })).toBeEnabled()
    expect(screen.getByRole('button', { name: '添加商品' })).toBeEnabled()
    await user.selectOptions(screen.getByRole('combobox', { name: '按状态筛选' }), '低库存')
    expect(screen.getByText('SKU-1002')).toBeVisible()
    expect(screen.queryByText('SKU-1001')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '重置筛选' }))
    expect(screen.getByRole('combobox', { name: '按状态筛选' })).toHaveValue('all')
    expect(screen.getByRole('searchbox', { name: '搜索商品或分类' })).toHaveValue('')
    expect(screen.getByText('SKU-1001')).toBeVisible()
  })

  it('persists the selected color theme', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '切换到暗色主题' }))

    expect(document.documentElement).toHaveAttribute('data-theme', 'business')
    expect(window.localStorage.getItem('admin-dashboard-theme')).toBe('business')
  })

  it('does not leak search state between resource routes', async () => {
    const user = userEvent.setup()
    render(<App />)

    const navigation = screen.getByRole('navigation', { name: '主导航' })
    await user.click(within(navigation).getByRole('link', { name: '商品' }))
    expect(await screen.findByText('SKU-1001')).toBeVisible()
    await user.type(screen.getByRole('searchbox', { name: '搜索商品或分类' }), '不存在的商品')
    expect(screen.getByRole('heading', { name: '没有匹配结果' })).toBeVisible()

    await user.click(within(navigation).getByRole('link', { name: '订单' }))
    expect(await screen.findByText('ORD-9952')).toBeVisible()
    expect(screen.getByRole('searchbox', { name: '搜索订单或客户' })).toHaveValue('')
  })

  it('moves focus into the mobile navigation when it opens', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '打开导航' }))
    const closeButtons = screen.getAllByRole('button', { name: '关闭导航' })
    expect(closeButtons.at(-1)).toHaveFocus()
  })

  it('marks settings as unsaved after a saved value changes', async () => {
    const user = userEvent.setup()
    render(<App />)

    const navigation = screen.getByRole('navigation', { name: '主导航' })
    await user.click(within(navigation).getByRole('link', { name: '设置' }))
    const nameInput = screen.getByRole('textbox', { name: '工作区名称' })
    await user.clear(nameInput)
    await user.type(nameInput, 'Demo Commerce Updated')
    await user.click(screen.getByRole('button', { name: '保存设置' }))
    expect(await screen.findByText('设置已保存')).toBeVisible()

    await user.type(nameInput, ' Again')
    expect(screen.queryByText('设置已保存')).not.toBeInTheDocument()
    expect(screen.getByText('有尚未保存的更改')).toBeVisible()
  })

  it('recovers a resource list from its error state', async () => {
    const user = userEvent.setup()
    render(<App />)

    const navigation = screen.getByRole('navigation', { name: '主导航' })
    await user.click(within(navigation).getByRole('link', { name: '商品' }))
    await user.click(await screen.findByRole('button', { name: '预览错误状态' }))
    expect(screen.getByRole('heading', { name: '加载失败' })).toBeVisible()

    await user.click(screen.getByRole('button', { name: '重新加载' }))
    expect(screen.getByRole('heading', { name: '加载数据' })).toBeVisible()
    expect(await screen.findByText('SKU-1001')).toBeVisible()
  })

  it('opens quick navigation with the documented keyboard shortcut', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.keyboard('{Control>}k{/Control}')
    expect(await screen.findByRole('dialog', { name: '快速导航' })).toBeVisible()
    expect(screen.getByRole('searchbox', { name: '搜索页面' })).toHaveFocus()
  })

  it('keeps the compact search control accessible without its visible label', () => {
    render(<App />)

    expect(screen.getByRole('button', { name: '搜索订单、商品或客户' })).toBeVisible()
  })
})
