import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { App } from '../app/App'
import { PermissionGate } from './PermissionGate'
import { SessionProvider } from './SessionProvider'
import { defaultDemoSession } from './demoSessionGateway'
import type { SessionGateway } from './session.gateway'
import type { Session } from './session.types'

function sessionWithPermissions(permissions: readonly string[]): Session {
  return { ...defaultDemoSession, permissions }
}

function gatewayReturning(session: Session | null): SessionGateway {
  return {
    readSession: async () => session,
    refreshSession: async () => session ?? defaultDemoSession,
    signOut: async () => undefined,
  }
}

describe('session and route access contract', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/products')
  })

  it('does not render a protected destination or navigation when the browser session is anonymous', async () => {
    const user = userEvent.setup()
    render(<App sessionGateway={gatewayReturning(null)} />)

    expect(await screen.findByRole('heading', { name: '需要登录' })).toBeVisible()
    expect(screen.queryByRole('heading', { name: '商品管理' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: '商品' })).not.toBeInTheDocument()

    await user.keyboard('{Control>}k{/Control}')
    expect(screen.queryByRole('dialog', { name: '快速导航' })).not.toBeInTheDocument()
  })

  it('shows forbidden and filters every route discovery surface from the same permission policy', async () => {
    const user = userEvent.setup()
    const session = sessionWithPermissions(['dashboard:read'])
    render(<App initialSession={session} sessionGateway={gatewayReturning(session)} />)

    expect(await screen.findByRole('heading', { name: '无权访问' })).toBeVisible()
    const navigation = screen.getByRole('navigation', { name: '主导航' })
    expect(within(navigation).getByRole('link', { name: '概览' })).toBeVisible()
    expect(within(navigation).queryByRole('link', { name: '商品' })).not.toBeInTheDocument()

    await user.keyboard('{Control>}k{/Control}')
    const search = await screen.findByRole('dialog', { name: '快速导航' })
    expect(within(search).getByRole('button', { name: /经营概览/ })).toBeVisible()
    expect(within(search).queryByRole('button', { name: /商品管理/ })).not.toBeInTheDocument()
  })

  it('recovers from a session read failure through the public retry action', async () => {
    window.history.replaceState({}, '', '/dashboard')
    const user = userEvent.setup()
    const readSession = vi
      .fn<SessionGateway['readSession']>()
      .mockRejectedValueOnce(new Error('temporary session failure'))
      .mockResolvedValue(defaultDemoSession)
    const gateway: SessionGateway = {
      readSession,
      refreshSession: async () => defaultDemoSession,
      signOut: async () => undefined,
    }

    render(<App sessionGateway={gateway} />)

    expect(await screen.findByRole('heading', { name: '无法读取会话' })).toBeVisible()
    await user.click(screen.getByRole('button', { name: '重新加载' }))
    expect(await screen.findByRole('heading', { name: '经营概览' })).toBeVisible()
    expect(readSession).toHaveBeenCalledTimes(2)
  })

  it('ends the browser session through the account menu', async () => {
    window.history.replaceState({}, '', '/dashboard')
    const user = userEvent.setup()
    render(<App />)

    const sidebar = screen.getByRole('complementary')
    await user.click(within(sidebar).getByRole('button', { name: '账户导航' }))
    await user.click(screen.getByRole('menuitem', { name: /退出登录/ }))

    expect(await screen.findByRole('heading', { name: '需要登录' })).toBeVisible()
    expect(screen.queryByRole('heading', { name: '经营概览' })).not.toBeInTheDocument()
  })

  it('uses the public permission gate for a local action without treating it as provider authorization', () => {
    const session = sessionWithPermissions(['products:read'])
    render(
      <SessionProvider gateway={gatewayReturning(session)} initialSession={session}>
        <PermissionGate fallback={<p>操作不可用</p>} permissions={['products:write']}>
          <button type="button">修改商品</button>
        </PermissionGate>
      </SessionProvider>,
    )

    expect(screen.getByText('操作不可用')).toBeVisible()
    expect(screen.queryByRole('button', { name: '修改商品' })).not.toBeInTheDocument()
  })
})
