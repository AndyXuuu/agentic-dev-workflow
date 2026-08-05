import { useEffect, useState } from 'react'

import { Button } from './Button'
import type { DangerZoneAction } from './DangerZone'
import { Modal } from './Modal'
import { TextInput } from './TextInput'

export type DestructiveActionResult =
  | { ok: true; message: string }
  | { ok: false; message: string }

type DestructiveActionDialogProps = {
  action: DangerZoneAction | null
  onClose: () => void
  onConfirm: (action: DangerZoneAction) => Promise<DestructiveActionResult>
  onSuccess?: (message: string) => void
  open: boolean
}

export function DestructiveActionDialog({ action, onClose, onConfirm, onSuccess, open }: DestructiveActionDialogProps) {
  const [displayedAction, setDisplayedAction] = useState<DangerZoneAction | null>(action)
  const [confirmationValue, setConfirmationValue] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [pending, setPending] = useState(false)
  const actionId = action?.id

  useEffect(() => {
    if (action) setDisplayedAction(action)
  }, [action])

  useEffect(() => {
    if (!open || !actionId) return
    setConfirmationValue('')
    setErrorMessage('')
    setPending(false)
  }, [actionId, open])

  if (!displayedAction) return null

  const requiresPhrase = Boolean(displayedAction.confirmationPhrase)
  const phraseMatches = !requiresPhrase || confirmationValue.trim() === displayedAction.confirmationPhrase
  const requestClose = () => {
    if (!pending) onClose()
  }

  const submit = async () => {
    if (pending || !phraseMatches) return
    setPending(true)
    setErrorMessage('')
    try {
      const result = await onConfirm(displayedAction)
      if (result.ok) {
        onSuccess?.(result.message)
        setPending(false)
        onClose()
        return
      }
      setErrorMessage(result.message)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '操作未完成，请稍后重试。')
    }
    setPending(false)
  }

  return (
    <Modal
      description="请核对影响范围和恢复方式，再决定是否继续。"
      footer={(
        <>
          <Button data-autofocus={!requiresPhrase ? 'primary' : undefined} disabled={pending} onClick={requestClose} size="small" variant="ghost">取消</Button>
          <Button disabled={!phraseMatches} loading={pending} onClick={() => { void submit() }} size="small" variant="danger">
            {pending ? '处理中' : displayedAction.confirmLabel}
          </Button>
        </>
      )}
      onClose={requestClose}
      open={open}
      title={displayedAction.title}
    >
      <div className="grid gap-4">
        <dl className="app-danger-summary">
          <div>
            <dt>影响范围</dt>
            <dd>{displayedAction.impact}</dd>
          </div>
          <div>
            <dt>恢复方式</dt>
            <dd>{displayedAction.recovery}</dd>
          </div>
        </dl>

        {displayedAction.confirmationPhrase && (
          <TextInput
              autoComplete="off"
              data-autofocus="primary"
              hint={`请输入“${displayedAction.confirmationPhrase}”。前后空格会被忽略，其他字符必须完全一致。`}
              label="输入确认短语"
              onChange={(event) => setConfirmationValue(event.target.value)}
              spellCheck={false}
              value={confirmationValue}
          />
        )}

        {errorMessage && <p className="app-body app-text-error" role="alert">{errorMessage}</p>}
      </div>
    </Modal>
  )
}
