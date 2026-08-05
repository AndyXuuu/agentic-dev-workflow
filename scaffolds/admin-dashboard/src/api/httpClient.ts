export type HttpMethod = 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT'

export type HttpRequest<Body = unknown> = {
  body?: Body
  headers?: HeadersInit
  method?: HttpMethod
  path: string
  signal?: AbortSignal
  timeoutMs?: number
}

export interface HttpClient {
  request<Response, Body = unknown>(request: HttpRequest<Body>): Promise<Response>
}

export type HttpClientErrorKind = 'aborted' | 'http' | 'network' | 'response' | 'timeout'

type HttpClientErrorOptions = {
  cause?: unknown
  details?: unknown
  kind: HttpClientErrorKind
  method: HttpMethod
  status?: number
  url: string
}

export class HttpClientError extends Error {
  readonly details?: unknown
  readonly kind: HttpClientErrorKind
  readonly method: HttpMethod
  readonly status?: number
  readonly url: string

  constructor(message: string, options: HttpClientErrorOptions) {
    super(message, options.cause === undefined ? undefined : { cause: options.cause })
    this.name = 'HttpClientError'
    this.details = options.details
    this.kind = options.kind
    this.method = options.method
    this.status = options.status
    this.url = options.url
  }
}

export type FetchHttpClientOptions = {
  baseUrl?: string
  defaultHeaders?: HeadersInit
  defaultTimeoutMs?: number
  fetch?: typeof fetch
}

const defaultTimeoutMs = 10_000

function joinUrl(baseUrl: string, path: string) {
  if (/^[a-z][a-z\d+.-]*:/i.test(path) || !baseUrl) return path
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

function isNativeRequestBody(body: unknown): body is BodyInit {
  return (
    typeof body === 'string' ||
    body instanceof Blob ||
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof ArrayBuffer ||
    ArrayBuffer.isView(body) ||
    body instanceof ReadableStream
  )
}

function encodeBody(body: unknown, headers: Headers): BodyInit | undefined {
  if (body === undefined) return undefined
  if (isNativeRequestBody(body)) return body
  if (!headers.has('content-type')) headers.set('content-type', 'application/json')
  return JSON.stringify(body)
}

function parseResponseBody(text: string, contentType: string): unknown {
  if (!text) return undefined
  if (!contentType.includes('application/json') && !contentType.includes('+json')) return text
  return JSON.parse(text)
}

export class FetchHttpClient implements HttpClient {
  private readonly baseUrl: string
  private readonly defaultHeaders: Headers
  private readonly defaultTimeoutMs: number
  private readonly fetch: typeof fetch

  constructor(options: FetchHttpClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? ''
    this.defaultHeaders = new Headers(options.defaultHeaders)
    this.defaultTimeoutMs = options.defaultTimeoutMs ?? defaultTimeoutMs
    this.fetch = options.fetch ?? globalThis.fetch.bind(globalThis)
  }

  async request<Response, Body = unknown>(request: HttpRequest<Body>): Promise<Response> {
    const method = request.method ?? 'GET'
    const url = joinUrl(this.baseUrl, request.path)
    const timeoutMs = request.timeoutMs ?? this.defaultTimeoutMs
    if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
      throw new TypeError('timeoutMs must be a positive finite number')
    }

    const controller = new AbortController()
    let didTimeout = false
    const abortFromCaller = () => controller.abort(request.signal?.reason)
    if (request.signal?.aborted) abortFromCaller()
    else
      request.signal?.addEventListener('abort', abortFromCaller, {
        once: true,
      })

    const timeout = globalThis.setTimeout(() => {
      didTimeout = true
      controller.abort(new DOMException('Request timed out', 'TimeoutError'))
    }, timeoutMs)

    const headers = new Headers(this.defaultHeaders)
    new Headers(request.headers).forEach((value, key) => {
      headers.set(key, value)
    })

    try {
      const response = await this.fetch(url, {
        body: encodeBody(request.body, headers),
        credentials: 'same-origin',
        headers,
        method,
        signal: controller.signal,
      })
      const text = response.status === 204 ? '' : await response.text()
      let parsed: unknown
      try {
        parsed = parseResponseBody(text, response.headers.get('content-type') ?? '')
      } catch (cause) {
        if (!response.ok) parsed = text
        else {
          throw new HttpClientError('服务响应不是有效的 JSON。', {
            cause,
            details: text,
            kind: 'response',
            method,
            status: response.status,
            url,
          })
        }
      }

      if (!response.ok) {
        throw new HttpClientError(`请求失败（HTTP ${response.status}）。`, {
          details: parsed,
          kind: 'http',
          method,
          status: response.status,
          url,
        })
      }
      return parsed as Response
    } catch (cause) {
      if (cause instanceof HttpClientError) throw cause
      if (didTimeout) {
        throw new HttpClientError('请求超时，请稍后重试。', {
          cause,
          kind: 'timeout',
          method,
          url,
        })
      }
      if (request.signal?.aborted) {
        throw new HttpClientError('请求已取消。', {
          cause,
          kind: 'aborted',
          method,
          url,
        })
      }
      throw new HttpClientError('无法连接到服务，请检查网络后重试。', {
        cause,
        kind: 'network',
        method,
        url,
      })
    } finally {
      globalThis.clearTimeout(timeout)
      request.signal?.removeEventListener('abort', abortFromCaller)
    }
  }
}
