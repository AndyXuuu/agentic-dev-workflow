import type { DangerZoneAction } from '../../components/ui/DangerZone'
import type { DestructiveActionResult } from '../../components/ui/DestructiveActionDialog'

export const workspaceDangerActions: readonly DangerZoneAction[] = [
  {
    id: 'deactivate-workspace',
    title: '停用工作区',
    description: '演示可恢复的服务停用流程，不会改变当前脚手架状态。',
    impact: '真实项目中应阻止新的业务写入，但保留现有数据和管理访问。',
    recovery: '由具备权限的管理员重新启用，并由服务端记录审计事件。',
    triggerLabel: '停用工作区',
    confirmLabel: '确认停用',
  },
  {
    id: 'reset-workspace-data',
    title: '重置工作区数据',
    description: '演示不可恢复的数据破坏流程；脚手架不会清除任何本地或远程数据。',
    impact: '真实项目中可能永久清除该工作区拥有的业务数据与关联记录。',
    recovery: '不可直接恢复；真实项目必须先完成权限、依赖、备份和保留策略检查。',
    triggerLabel: '重置工作区数据',
    confirmLabel: '确认重置',
    confirmationPhrase: 'RESET WORKSPACE',
  },
]

export async function runWorkspaceDangerAction(action: DangerZoneAction): Promise<DestructiveActionResult> {
  await new Promise((resolve) => window.setTimeout(resolve, 240))
  return {
    ok: true,
    message: `“${action.title}”交互演示已完成，未更改或清除任何数据。`,
  }
}
