import { RotateCcw, Save } from 'lucide-react'
import { useState } from 'react'

import { Button, DestructiveActionDialog, DangerZone, type DangerZoneAction, PageHeader, Panel, Select, Switch, TextInput } from '../../components/ui'
import { runWorkspaceDangerAction, workspaceDangerActions } from './settings.danger-actions'
import { useWorkspaceSettings } from './useWorkspaceSettings'

export function WorkspaceSettings() {
  const model = useWorkspaceSettings()
  const [activeDangerAction, setActiveDangerAction] = useState<DangerZoneAction | null>(null)
  const [dangerAnnouncement, setDangerAnnouncement] = useState('')

  return (
    <div className="app-page-stack">
      <PageHeader description="按任务分区管理工作区偏好；写操作通过可替换 repository 演示，真实项目必须由服务端校验权限。" eyebrow="Configuration" title="工作区设置" />

      <form
        className="grid max-w-4xl gap-5"
        onSubmit={(event) => {
          event.preventDefault()
          void model.submit()
        }}
      >
        <fieldset className="contents" disabled={model.saveState === 'saving'}>
          <legend className="sr-only">工作区设置</legend>

          <Panel description="用于后台标题、系统通知和支持渠道展示。" title="工作区资料">
            <div className="app-surface-body grid gap-4 md:grid-cols-2">
              <TextInput
                error={model.fieldErrors.workspaceName}
                label="工作区名称"
                maxLength={60}
                name="workspaceName"
                onChange={(event) => model.update('workspaceName', event.target.value)}
                onInvalid={(event) => {
                  event.preventDefault()
                  model.markInvalid('workspaceName')
                }}
                pattern={'\\s*\\S.*'}
                required
                value={model.settings.workspaceName}
              />
              <TextInput
                autoComplete="email"
                error={model.fieldErrors.supportEmail}
                label="支持邮箱"
                name="supportEmail"
                onChange={(event) => model.update('supportEmail', event.target.value)}
                onInvalid={(event) => {
                  event.preventDefault()
                  model.markInvalid('supportEmail')
                }}
                required
                type="email"
                value={model.settings.supportEmail}
              />
            </div>
          </Panel>

          <Panel description="保持时间展示和运营提醒的一致默认值。" title="区域与通知">
            <div className="app-surface-body grid gap-4 md:grid-cols-2">
              <Select label="默认时区" name="timezone" onChange={(event) => model.update('timezone', event.target.value)} value={model.settings.timezone}>
                <option value="Asia/Singapore">Asia/Singapore (UTC+8)</option>
                <option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</option>
                <option value="UTC">UTC</option>
              </Select>
              <Switch
                checked={model.settings.inventoryAlerts}
                description="商品低于安全库存时通知运营人员。"
                label="库存告警"
                name="inventoryAlerts"
                onChange={(event) => model.update('inventoryAlerts', event.target.checked)}
              />
            </div>
          </Panel>
        </fieldset>

        <section aria-label="保存设置" className="surface-card app-settings-action-bar">
          <p aria-live="polite" className={model.saveState === 'error' ? 'app-body app-text-error' : 'app-body app-text-secondary'}>
            {model.statusMessage}
          </p>
          <div className="app-control-gap flex flex-wrap">
            <Button disabled={model.saveState === 'saving'} onClick={model.restoreDefaults} size="small" startIcon={<RotateCcw aria-hidden className="app-icon-sm" />} variant="ghost">
              恢复默认
            </Button>
            <Button disabled={model.saveState !== 'dirty' && model.saveState !== 'error'} onClick={model.cancelChanges} size="small" variant="outline">
              取消更改
            </Button>
            <Button
              disabled={model.saveState === 'idle' || model.saveState === 'saved'}
              loading={model.saveState === 'saving'}
              size="small"
              startIcon={<Save aria-hidden className="app-icon-sm" />}
              type="submit"
              variant="primary"
            >
              {model.saveState === 'saving' ? '保存中' : '保存设置'}
            </Button>
          </div>
        </section>
      </form>

      <div className="max-w-4xl">
        <DangerZone
          actions={workspaceDangerActions}
          onSelect={(action) => {
            setDangerAnnouncement('')
            setActiveDangerAction(action)
          }}
        />
        <p aria-live="polite" className={dangerAnnouncement ? 'app-body app-text-secondary mt-3' : 'sr-only'}>
          {dangerAnnouncement}
        </p>
      </div>

      <DestructiveActionDialog
        action={activeDangerAction}
        onClose={() => setActiveDangerAction(null)}
        onConfirm={runWorkspaceDangerAction}
        onSuccess={setDangerAnnouncement}
        open={Boolean(activeDangerAction)}
      />
    </div>
  )
}
