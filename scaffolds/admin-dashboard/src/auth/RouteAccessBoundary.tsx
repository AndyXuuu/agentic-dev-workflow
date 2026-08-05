import type { ReactNode } from 'react'

import { Button, PageState } from '../components/ui'
import { evaluateAccess, type AccessRequirement } from './accessPolicy'
import { useSession } from './SessionProvider'

function AccessState({ description, onRetry, title }: { description: string; onRetry?: () => void; title: string }) {
  return (
    <section className="surface-card app-surface-body grid min-h-60 place-items-center text-center">
      <div className="max-w-md">
        <h1 className="app-section-title">{title}</h1>
        <p className="app-section-description mt-1.5">{description}</p>
        {onRetry && (
          <Button className="mt-5" onClick={onRetry} size="small" variant="primary">
            重新检查会话
          </Button>
        )}
      </div>
    </section>
  )
}

export function RouteAccessBoundary({
  children,
  requirement,
}: {
  children: ReactNode
  requirement: AccessRequirement
}) {
  const { reload, state } = useSession()
  if (requirement.authentication === 'public') return children
  if (state.status === 'loading') {
    return <PageState description="正在确认当前登录状态。" state="loading" title="正在读取会话" />
  }
  if (state.status === 'error') {
    return <PageState description="无法确认当前登录状态，请重试。" onRetry={reload} state="error" title="无法读取会话" />
  }

  const decision = evaluateAccess(state.status === 'authenticated' ? state.session : null, requirement)
  if (decision === 'anonymous') {
    return (
      <AccessState
        description="请通过宿主项目配置的身份入口登录后再访问此页面。"
        onRetry={reload}
        title="需要登录"
      />
    )
  }
  if (decision === 'forbidden') {
    return <AccessState description="当前账户没有访问此页面所需的权限。" title="无权访问" />
  }
  return children
}
