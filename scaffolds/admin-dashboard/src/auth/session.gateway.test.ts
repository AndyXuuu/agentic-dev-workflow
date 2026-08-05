import { describe, expect, it, vi } from 'vitest'

import type { HttpClient, HttpRequest } from '../api/httpClient'
import { HttpClientError } from '../api/httpClient'
import { defaultDemoSession } from './demoSessionGateway'
import { HttpSessionGateway } from './session.gateway'

function clientFrom(request: (input: HttpRequest) => Promise<unknown>): HttpClient {
  return {
    async request<Response, Body = unknown>(input: HttpRequest<Body>) {
      return await request(input) as Response
    },
  }
}

describe('HttpSessionGateway', () => {
  it('maps an unauthenticated session read to anonymous state', async () => {
    const request = vi.fn<(input: HttpRequest) => Promise<unknown>>().mockRejectedValue(
      new HttpClientError('unauthorized', {
        kind: 'http',
        method: 'GET',
        status: 401,
        url: '/v1/auth/session',
      }),
    )
    const gateway = new HttpSessionGateway(clientFrom(request))

    await expect(gateway.readSession()).resolves.toBeNull()
  })

  it('sends the session-bound CSRF value on state-changing requests', async () => {
    const request = vi
      .fn<(input: HttpRequest) => Promise<unknown>>()
      .mockResolvedValueOnce(defaultDemoSession)
      .mockResolvedValueOnce(undefined)
    const gateway = new HttpSessionGateway(clientFrom(request))

    await gateway.refreshSession({ csrfToken: 'csrf-value' })
    await gateway.signOut({ csrfToken: 'csrf-value' })

    expect(request).toHaveBeenNthCalledWith(1, expect.objectContaining({
      headers: { 'X-CSRF-Token': 'csrf-value' },
      method: 'POST',
      path: '/v1/auth/session/refresh',
    }))
    expect(request).toHaveBeenNthCalledWith(2, expect.objectContaining({
      headers: { 'X-CSRF-Token': 'csrf-value' },
      method: 'DELETE',
      path: '/v1/auth/session',
    }))
  })

  it('maps an expired refresh to an anonymous session instead of a generic failure', async () => {
    const request = vi.fn<(input: HttpRequest) => Promise<unknown>>().mockRejectedValue(
      new HttpClientError('expired', {
        kind: 'http',
        method: 'POST',
        status: 401,
        url: '/v1/auth/session/refresh',
      }),
    )
    const gateway = new HttpSessionGateway(clientFrom(request))

    await expect(gateway.refreshSession({ csrfToken: 'csrf-value' })).resolves.toBeNull()
  })
})
