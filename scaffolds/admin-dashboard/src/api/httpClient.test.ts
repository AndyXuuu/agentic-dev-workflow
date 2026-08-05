import { describe, expect, it, vi } from 'vitest'

import { FetchHttpClient, HttpClientError } from './httpClient'

describe('FetchHttpClient', () => {
  it('serializes JSON requests and parses a successful JSON response', async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(
      new Response(JSON.stringify({ id: 'ORD-1' }), {
        headers: { 'content-type': 'application/json' },
        status: 201,
      }),
    )
    const client = new FetchHttpClient({ baseUrl: '/api', fetch })

    await expect(
      client.request<{ id: string }, { name: string }>({
        body: { name: 'Example' },
        method: 'POST',
        path: '/orders',
      }),
    ).resolves.toEqual({ id: 'ORD-1' })

    expect(fetch).toHaveBeenCalledWith(
      '/api/orders',
      expect.objectContaining({
        body: JSON.stringify({ name: 'Example' }),
        credentials: 'same-origin',
        method: 'POST',
      }),
    )
    const request = fetch.mock.calls[0]?.[1]
    expect(new Headers(request?.headers).get('content-type')).toBe('application/json')
  })

  it('preserves HTTP status and response details in a structured error', async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(
      new Response(JSON.stringify({ code: 'CONFLICT' }), {
        headers: { 'content-type': 'application/problem+json' },
        status: 409,
      }),
    )
    const client = new FetchHttpClient({ fetch })

    const error = await client.request({ path: '/orders' }).catch((cause: unknown) => cause)

    expect(error).toBeInstanceOf(HttpClientError)
    expect(error).toMatchObject({
      details: { code: 'CONFLICT' },
      kind: 'http',
      method: 'GET',
      status: 409,
      url: '/orders',
    })
  })

  it('distinguishes a deadline from a caller cancellation', async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockImplementation(
      (_input, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(init.signal?.reason), { once: true })
        }),
    )
    const client = new FetchHttpClient({ defaultTimeoutMs: 5, fetch })

    await expect(client.request({ path: '/slow' })).rejects.toMatchObject({
      kind: 'timeout',
    })

    const controller = new AbortController()
    const cancelled = client.request({
      path: '/cancelled',
      signal: controller.signal,
    })
    controller.abort()
    await expect(cancelled).rejects.toMatchObject({ kind: 'aborted' })
  })

  it('returns undefined for a successful empty response', async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(new Response(null, { status: 204 }))
    const client = new FetchHttpClient({ fetch })

    await expect(client.request<void>({ method: 'DELETE', path: '/orders/1' })).resolves.toBeUndefined()
  })
})
