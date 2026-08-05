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
    expect(screen.queryByRole('button', { name: '重置筛选' })).not.toBeInTheDocument()
    await user.selectOptions(screen.getByRole('combobox', { name: '按状态筛选' }), '低库存')
    expect(screen.getByText('SKU-1002')).toBeVisible()
    expect(screen.queryByText('SKU-1001')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '重置筛选' })).toBeVisible()

    await user.click(screen.getByRole('button', { name: '重置筛选' }))
    expect(screen.getByRole('combobox', { name: '按状态筛选' })).toHaveValue('all')
    expect(screen.getByRole('searchbox', { name: '搜索商品或分类' })).toHaveValue('')
    expect(screen.getByText('SKU-1001')).toBeVisible()
  })

  it('keeps resource sorting, pagination, and current-page selection controlled by the page', async () => {
    const user = userEvent.setup()
    render(<App />)

    const navigation = screen.getByRole('navigation', { name: '主导航' })
    await user.click(within(navigation).getByRole('link', { name: '商品' }))
    expect(await screen.findByText('SKU-1001')).toBeVisible()
    expect(screen.queryByText('SKU-1003')).not.toBeInTheDocument()
    expect(screen.getByText('显示 1–2，共 3 条')).toBeVisible()

    await user.click(screen.getByRole('checkbox', { name: '选择记录 SKU-1001' }))
    expect(screen.getByText('已选择 1 条记录')).toBeVisible()
    await user.click(screen.getByRole('button', { name: '下一页' }))
    expect(screen.getByText('SKU-1003')).toBeVisible()
    expect(screen.getByText('显示 3–3，共 3 条')).toBeVisible()

    await user.click(screen.getByRole('button', { name: '按编号排序，未排序' }))
    await user.click(screen.getByRole('button', { name: '按编号排序，升序' }))
    expect(screen.getByText('SKU-1003')).toBeVisible()
    expect(screen.getByText('SKU-1002')).toBeVisible()
    expect(screen.queryByText('SKU-1001')).not.toBeInTheDocument()
  })

  it('uses the account menu for real application navigation', async () => {
    const user = userEvent.setup()
    render(<App />)

    const sidebar = screen.getByRole('complementary')
    await user.click(within(sidebar).getByRole('button', { name: '账户导航' }))
    expect(screen.getByRole('menu', { name: '账户导航' })).toBeVisible()
    await user.click(screen.getByRole('menuitem', { name: /设计系统/ }))
    expect(await screen.findByRole('heading', { name: '后台设计系统' })).toBeVisible()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('persists the selected color theme', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(within(screen.getByRole('complementary')).getByRole('button', { name: '账户导航' }))
    await user.click(screen.getByRole('menuitem', { name: /切换到暗色主题/ }))

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

  it('collapses and restores the desktop navigation without removing its destinations', async () => {
    const user = userEvent.setup()
    render(<App />)

    const sidebar = screen.getByRole('complementary')
    await user.click(within(sidebar).getByRole('button', { name: '收起侧栏' }))
    const dashboardLink = within(sidebar).getByRole('link', { name: '概览' })
    expect(within(sidebar).getByRole('button', { name: '展开侧栏' })).toHaveAttribute('aria-expanded', 'false')
    expect(dashboardLink).toBeVisible()
    expect(dashboardLink).toHaveAccessibleDescription('概览')

    await user.click(within(sidebar).getByRole('button', { name: '展开侧栏' }))
    expect(within(sidebar).getByRole('button', { name: '收起侧栏' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('keeps page scrolling locked until every stacked overlay closes', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '打开导航' }))
    await user.keyboard('{Control>}k{/Control}')
    expect(await screen.findByRole('dialog', { name: '快速导航' })).toBeVisible()
    expect(document.body).toHaveAttribute('data-overlay-open', 'true')

    await user.click(screen.getByRole('button', { name: '关闭' }))
    expect(document.body).toHaveAttribute('data-overlay-open', 'true')

    const closeNavigationButtons = screen.getAllByRole('button', { name: '关闭导航' })
    await user.click(closeNavigationButtons.at(-1) as HTMLButtonElement)
    expect(document.body).not.toHaveAttribute('data-overlay-open')
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

  it('associates an actionable error with an invalid settings field', async () => {
    const user = userEvent.setup()
    render(<App />)

    const navigation = screen.getByRole('navigation', { name: '主导航' })
    await user.click(within(navigation).getByRole('link', { name: '设置' }))
    const nameInput = screen.getByRole('textbox', { name: '工作区名称' })
    await user.clear(nameInput)
    await user.click(screen.getByRole('button', { name: '保存设置' }))

    expect(nameInput).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('请输入工作区名称。')).toBeVisible()
  })

  it('rejects a whitespace-only workspace name', async () => {
    const user = userEvent.setup()
    render(<App />)

    const navigation = screen.getByRole('navigation', { name: '主导航' })
    await user.click(within(navigation).getByRole('link', { name: '设置' }))
    const nameInput = screen.getByRole('textbox', { name: '工作区名称' })
    await user.clear(nameInput)
    await user.type(nameInput, '   ')
    await user.click(screen.getByRole('button', { name: '保存设置' }))

    expect(nameInput).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('请输入工作区名称。')).toBeVisible()
    expect(screen.queryByText('设置已保存')).not.toBeInTheDocument()
  })

  it('runs the destructive settings flow as an explicit no-data-change demo', async () => {
    const user = userEvent.setup()
    render(<App />)

    const navigation = screen.getByRole('navigation', { name: '主导航' })
    await user.click(within(navigation).getByRole('link', { name: '设置' }))
    await user.click(screen.getByRole('button', { name: '重置工作区数据' }))

    const confirmButton = screen.getByRole('button', { name: '确认重置' })
    expect(confirmButton).toBeDisabled()
    await user.type(screen.getByRole('textbox', { name: '输入确认短语' }), 'RESET WORKSPACE')
    await user.click(confirmButton)

    expect(await screen.findByText('“重置工作区数据”交互演示已完成，未更改或清除任何数据。')).toBeVisible()
    expect(screen.getByRole('textbox', { name: '工作区名称' })).toHaveValue('Demo Commerce')
  })

  it('keeps demo state controls in the design system instead of production-style lists', async () => {
    const user = userEvent.setup()
    render(<App />)

    const navigation = screen.getByRole('navigation', { name: '主导航' })
    await user.click(within(navigation).getByRole('link', { name: '商品' }))
    expect(await screen.findByText('SKU-1001')).toBeVisible()
    expect(screen.queryByRole('button', { name: '预览错误状态' })).not.toBeInTheDocument()

    await user.click(within(navigation).getByRole('link', { name: '设计系统' }))
    expect(await screen.findByRole('heading', { name: 'Error' })).toBeVisible()
    expect(screen.getByRole('button', { name: '重新加载' })).toBeVisible()
  })

  it('opens quick navigation with the documented keyboard shortcut', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.keyboard('{Control>}k{/Control}')
    expect(await screen.findByRole('dialog', { name: '快速导航' })).toBeVisible()
    expect(screen.getByRole('searchbox', { name: '搜索页面' })).toHaveFocus()
  })

  it('removes the top toolbar while keeping shell actions in their intended owners', () => {
    render(<App />)

    expect(screen.queryByRole('button', { name: '搜索订单、商品或客户' })).not.toBeInTheDocument()
    expect(screen.queryByRole('status', { name: '没有新通知' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '切换到暗色主题' })).not.toBeInTheDocument()
    expect(within(screen.getByRole('complementary')).getByRole('button', { name: '账户导航' })).toBeVisible()
  })

  it('keeps the public component catalog complete and renders the modal contract', async () => {
    const user = userEvent.setup()
    window.history.replaceState({}, '', '/design-system')
    render(<App />)

    const catalog = await screen.findByRole('table', { name: '共享组件清单' })
    for (const component of [
      'AreaChart',
      'BarChart',
      'DataTable',
      'DangerZone',
      'DesignTokenCatalog',
      'DestructiveActionDialog',
      'DonutChart',
      'DropdownMenu',
      'ListToolbar',
      'Modal',
      'PageHeader',
      'PageState',
      'Panel',
      'ProgressBar',
      'Skeleton',
      'StatusBadge',
      'TablePagination',
      'Tabs',
    ]) {
      expect(within(catalog).getByRole('cell', { name: component })).toBeVisible()
    }

    await user.click(screen.getByRole('button', { name: '预览 Modal' }))
    expect(screen.getByRole('dialog', { name: 'Modal 交互契约' })).toBeVisible()
  })
})
