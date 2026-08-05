import { X } from 'lucide-react'
import { type ReactNode, useEffect, useId, useRef } from 'react'

import { acquirePageScrollLock } from '../../lib/overlayScrollLock'
import { Button } from './Button'

type ModalProps = {
  children: ReactNode
  description?: string
  footer?: ReactNode
  open: boolean
  title: string
  onClose: () => void
}

export function Modal({ children, description, footer, open, title, onClose }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      dialog.showModal()
      queueMicrotask(() => {
        const target = dialog.querySelector<HTMLElement>('[data-autofocus="primary"]')
          ?? dialog.querySelector<HTMLElement>('[data-autofocus]')
        target?.focus()
      })
    } else if (!open && dialog.open) {
      dialog.close()
    }

  }, [open])

  useEffect(() => open ? acquirePageScrollLock() : undefined, [open])

  const handleClosed = () => {
    restoreFocusRef.current?.focus()
  }

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Escape 已由原生 dialog 的 cancel 事件处理；点击事件只补充鼠标背景关闭。
    <dialog
      aria-describedby={description ? descriptionId : undefined}
      aria-labelledby={titleId}
      className="app-dialog"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      onClose={handleClosed}
      ref={dialogRef}
    >
      <div className="app-dialog-panel">
        <header className="app-surface-body flex items-start gap-3 border-b border-base-300/70">
          <div className="min-w-0 flex-1">
            <h2 className="app-section-title" id={titleId}>{title}</h2>
            {description && <p className="app-section-description mt-1" id={descriptionId}>{description}</p>}
          </div>
          <Button aria-label="关闭" data-autofocus onClick={onClose} size="small" square variant="ghost">
            <X aria-hidden className="app-icon-sm" />
          </Button>
        </header>
        <div className="app-surface-body">{children}</div>
        {footer && <footer className="app-control-gap app-surface-footer flex flex-wrap justify-end border-t border-base-300/70">{footer}</footer>}
      </div>
    </dialog>
  )
}
