import { Save } from 'lucide-react'
import { useState } from 'react'

import { defaultWorkspaceSettings, readWorkspaceSettings, saveWorkspaceSettings, type WorkspaceSettings } from '../features/settings/settings.repository'
import { PageHeader } from '../components/ui/PageHeader'

type SaveState = 'idle' | 'dirty' | 'saving' | 'saved' | 'error'

export function SettingsPage() {
  const [settings, setSettings] = useState<WorkspaceSettings>(readWorkspaceSettings)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const update = <Key extends keyof WorkspaceSettings>(key: Key, value: WorkspaceSettings[Key]) => {
    setSettings((current) => ({ ...current, [key]: value }))
    setSaveState('dirty')
    setErrorMessage('')
  }

  const submit = async () => {
    if (saveState === 'saving') return
    setSaveState('saving')
    const result = await saveWorkspaceSettings(settings)
    if (result.ok) {
      setSaveState('saved')
      return
    }
    setSaveState('error')
    setErrorMessage(result.message)
  }

  const statusMessage = {
    idle: '',
    dirty: '有尚未保存的更改',
    saving: '正在保存设置',
    saved: '设置已保存',
    error: errorMessage,
  }[saveState]

  return (
    <div className="space-y-6">
      <PageHeader description="演示表单状态、边界校验与可替换的本地 repository；真实项目应通过服务端权限保护设置写入。" eyebrow="Configuration" title="工作区设置" />
      <form
        className="surface-card max-w-3xl"
        onReset={() => { setSettings(defaultWorkspaceSettings); setSaveState('dirty'); setErrorMessage('') }}
        onSubmit={(event) => { event.preventDefault(); void submit() }}
      >
        <div className="space-y-6 p-5 sm:p-6">
          <fieldset className="space-y-4" disabled={saveState === 'saving'}>
            <legend className="text-base font-semibold">基本信息</legend>
            <label className="form-control block">
              <span className="label-text mb-2 block font-medium">工作区名称</span>
              <input className="input input-bordered w-full" maxLength={60} name="workspaceName" onChange={(event) => update('workspaceName', event.target.value)} required value={settings.workspaceName} />
            </label>
            <label className="form-control block">
              <span className="label-text mb-2 block font-medium">支持邮箱</span>
              <input autoComplete="email" className="input input-bordered w-full" name="supportEmail" onChange={(event) => update('supportEmail', event.target.value)} required type="email" value={settings.supportEmail} />
            </label>
            <label className="form-control block">
              <span className="label-text mb-2 block font-medium">默认时区</span>
              <select className="select select-bordered w-full" name="timezone" onChange={(event) => update('timezone', event.target.value)} value={settings.timezone}>
                <option value="Asia/Singapore">Asia/Singapore (UTC+8)</option>
                <option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</option>
                <option value="UTC">UTC</option>
              </select>
            </label>
          </fieldset>

          <fieldset className="space-y-4 border-t border-base-300 pt-6" disabled={saveState === 'saving'}>
            <legend className="text-base font-semibold">通知偏好</legend>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-base-200 p-4">
              <input checked={settings.inventoryAlerts} className="toggle toggle-primary mt-0.5" name="inventoryAlerts" onChange={(event) => update('inventoryAlerts', event.target.checked)} type="checkbox" />
              <span><span className="block text-sm font-semibold">库存告警</span><span className="mt-1 block text-xs leading-5 text-base-content/52">商品低于安全库存时通知运营人员。</span></span>
            </label>
          </fieldset>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-base-300/70 px-5 py-4 sm:px-6">
          <p aria-live="polite" className={saveState === 'error' ? 'text-sm text-error' : 'text-sm text-base-content/58'}>{statusMessage}</p>
          <div className="flex gap-2">
            <button className="btn btn-ghost btn-sm" disabled={saveState === 'saving'} type="reset">恢复默认</button>
            <button className="btn btn-primary btn-sm" disabled={saveState === 'saving' || saveState === 'idle' || saveState === 'saved'} type="submit">
              <Save aria-hidden size={17} />{saveState === 'saving' ? '保存中' : '保存设置'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
