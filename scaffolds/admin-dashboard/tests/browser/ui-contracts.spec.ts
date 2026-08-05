import { expect, type Locator, type Page, test } from '@playwright/test'

async function expectInsideViewport(page: Page, locator: Locator, inset = 0) {
  const box = await locator.boundingBox()
  const viewport = page.viewportSize()

  expect(box).not.toBeNull()
  expect(viewport).not.toBeNull()
  if (!box || !viewport) return

  expect(box.x).toBeGreaterThanOrEqual(inset)
  expect(box.y).toBeGreaterThanOrEqual(inset)
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width - inset)
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height - inset)
}

test('desktop dashboard keeps its shell and primary action contract', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page.getByRole('heading', { name: '经营概览' })).toBeVisible()

  const sidebar = page.getByRole('complementary')
  await expect(sidebar.getByText('Admin', { exact: true })).toBeVisible()
  await expect(sidebar.locator('.app-shell-header').getByText('Workspace', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: '管理商品' })).toHaveClass(/\bbtn-primary\b/)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('320px resource list reveals local table overflow without wasting toolbar space', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 })
  await page.goto('/products')
  await expect(page.getByText('SKU-1001', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: '重置筛选' })).toHaveCount(0)

  const region = page.getByRole('region', { name: '商品管理列表，可横向滚动' })
  const frame = region.locator('..')
  await expect(frame).toHaveAttribute('data-overflow', 'true')
  await expect(frame).toHaveAttribute('data-at-end', 'false')
  await expect.poll(async () => frame.evaluate((element) => getComputedStyle(element, '::after').opacity)).toBe('1')

  await region.evaluate((element) => { element.scrollLeft = element.scrollWidth })
  await expect(frame).toHaveAttribute('data-at-end', 'true')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)

  await page.getByRole('searchbox', { name: '搜索商品或分类' }).fill('SKU-1001')
  await expect(page.getByRole('button', { name: '重置筛选' })).toBeVisible()
})

test('switch geometry and focus remain stable in both supported themes', async ({ page }) => {
  await page.goto('/design-system')
  const control = page.getByRole('switch', { name: '每周摘要' })

  for (const theme of ['corporate', 'business']) {
    await page.evaluate((nextTheme) => { document.documentElement.dataset.theme = nextTheme }, theme)
    const geometry = await control.evaluate((element) => {
      const styles = getComputedStyle(element)
      const rect = element.getBoundingClientRect()
      return { borderRadius: Number.parseFloat(styles.borderRadius), height: rect.height, width: rect.width }
    })
    expect(geometry).toEqual({ borderRadius: 12, height: 24, width: 40 })

    await control.focus()
    expect(await control.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe('none')
  }
})

test('modal, mobile drawer, and dropdown stay inside their owning viewport and move focus', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 })
  await page.goto('/settings')
  await page.getByRole('button', { name: '重置工作区数据' }).click()

  const destructiveDialog = page.getByRole('dialog', { name: '重置工作区数据' })
  await expect(destructiveDialog).toBeVisible()
  await expectInsideViewport(page, destructiveDialog, 16)
  await expect(page.getByRole('textbox', { name: '输入确认短语' })).toBeFocused()
  await page.getByRole('button', { name: '取消', exact: true }).click()

  await page.getByRole('button', { name: '打开导航' }).click()
  const drawer = page.getByRole('dialog', { name: '移动导航' }).getByRole('complementary')
  await expect(drawer).toBeVisible()
  await expect.poll(async () => Math.round((await drawer.boundingBox())?.x ?? -1)).toBe(0)
  await expectInsideViewport(page, drawer)
  await expect(page.getByRole('button', { name: '关闭导航' })).toBeFocused()
  await page.getByRole('button', { name: '关闭导航' }).click()

  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/design-system')
  await page.getByRole('button', { name: '记录操作' }).click()
  const menu = page.getByRole('menu', { name: '记录操作' })
  await expect(menu).toBeVisible()
  await expectInsideViewport(page, menu, 8)
  await expect(menu.getByRole('menuitem').first()).toBeFocused()
  await page.keyboard.press('Escape')

  await page.getByRole('button', { name: '预览 Modal' }).click()
  const modal = page.getByRole('dialog', { name: 'Modal 交互契约' })
  await expect(modal).toBeVisible()
  await expectInsideViewport(page, modal, 16)
})
