import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import type { SessionGateway } from './session.gateway'
import type { Session, SessionState } from './session.types'

type SessionContextValue = {
  refresh: () => Promise<void>
  reload: () => Promise<void>
  signOut: () => Promise<void>
  state: SessionState
}

const SessionContext = createContext<SessionContextValue | null>(null)

function asError(error: unknown) {
  return error instanceof Error ? error : new Error('读取会话失败', { cause: error })
}

export function SessionProvider({
  children,
  gateway,
  initialSession,
}: {
  children: ReactNode
  gateway: SessionGateway
  initialSession?: Session
}) {
  const [state, setState] = useState<SessionState>(() =>
    initialSession ? { session: initialSession, status: 'authenticated' } : { status: 'loading' },
  )
  const activeRequest = useRef<AbortController | null>(null)
  const requestVersion = useRef(0)

  const run = useCallback(async (
    operation: (signal: AbortSignal) => Promise<Session | null>,
    showLoading = true,
  ) => {
    activeRequest.current?.abort()
    const controller = new AbortController()
    activeRequest.current = controller
    const version = ++requestVersion.current
    if (showLoading) setState({ status: 'loading' })

    try {
      const session = await operation(controller.signal)
      if (controller.signal.aborted || version !== requestVersion.current) return
      setState(session ? { session, status: 'authenticated' } : { status: 'anonymous' })
    } catch (error) {
      if (controller.signal.aborted || version !== requestVersion.current) return
      setState({ error: asError(error), status: 'error' })
    }
  }, [])

  const reload = useCallback(
    () => run((signal) => gateway.readSession({ signal })),
    [gateway, run],
  )

  const refresh = useCallback(async () => {
    if (state.status !== 'authenticated') return reload()
    const csrfToken = state.session.csrfToken
    return run((signal) => gateway.refreshSession({ csrfToken, signal }))
  }, [gateway, reload, run, state])

  const signOut = useCallback(async () => {
    if (state.status !== 'authenticated') return
    const { csrfToken } = state.session
    return run(async (signal) => {
      await gateway.signOut({ csrfToken, signal })
      return null
    })
  }, [gateway, run, state])

  useEffect(() => {
    void run((signal) => gateway.readSession({ signal }), !initialSession)
    return () => activeRequest.current?.abort()
  }, [gateway, initialSession, run])

  const value = useMemo(
    () => ({ refresh, reload, signOut, state }),
    [refresh, reload, signOut, state],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const value = useContext(SessionContext)
  if (!value) throw new Error('SessionProvider is required')
  return value
}
