import { type HttpClient, HttpClientError } from '../api/httpClient'
import type { Session } from './session.types'

type SessionOperation = {
  signal?: AbortSignal
}

type AuthenticatedSessionOperation = SessionOperation & {
  csrfToken: string
}

export interface SessionGateway {
  readSession(operation?: SessionOperation): Promise<Session | null>
  refreshSession(operation: AuthenticatedSessionOperation): Promise<Session | null>
  signOut(operation: AuthenticatedSessionOperation): Promise<void>
}

export class HttpSessionGateway implements SessionGateway {
  constructor(private readonly httpClient: HttpClient) {}

  async readSession({ signal }: SessionOperation = {}): Promise<Session | null> {
    try {
      return await this.httpClient.request<Session>({ path: '/v1/auth/session', signal })
    } catch (error) {
      if (error instanceof HttpClientError && error.status === 401) return null
      throw error
    }
  }

  refreshSession({ csrfToken, signal }: AuthenticatedSessionOperation): Promise<Session | null> {
    return this.httpClient.request<Session>({
      headers: { 'X-CSRF-Token': csrfToken },
      method: 'POST',
      path: '/v1/auth/session/refresh',
      signal,
    }).catch((error: unknown) => {
      if (error instanceof HttpClientError && error.status === 401) return null
      throw error
    })
  }

  signOut({ csrfToken, signal }: AuthenticatedSessionOperation): Promise<void> {
    return this.httpClient.request<void>({
      headers: { 'X-CSRF-Token': csrfToken },
      method: 'DELETE',
      path: '/v1/auth/session',
      signal,
    })
  }
}
