import { type KeyboardEvent, type ReactNode, useCallback, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { Button } from './Button'

export type DropdownMenuItem = {
  description?: string
  disabled?: boolean
  icon?: ReactNode
  id: string
  label: string
  onSelect: () => void
  tone?: 'danger' | 'default'
}

type DropdownMenuProps = {
  align?: 'end' | 'start'
  items: readonly DropdownMenuItem[]
  label: string
  trigger: ReactNode
  triggerDescribedBy?: string
  triggerClassName?: string
}

type MenuPosition = {
  left: number
  ready: boolean
  top: number
}

export function DropdownMenu({ align = 'end', items, label, trigger, triggerClassName, triggerDescribedBy }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<MenuPosition>({ left: 0, ready: false, top: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false)
    if (restoreFocus) queueMicrotask(() => triggerRef.current?.focus())
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    const triggerElement = triggerRef.current
    const menuElement = menuRef.current
    if (!triggerElement || !menuElement) return

    const updatePosition = () => {
      const triggerRect = triggerElement.getBoundingClientRect()
      const menuRect = menuElement.getBoundingClientRect()
      const viewportPadding = 8
      const gap = 6
      const preferredLeft = align === 'end' ? triggerRect.right - menuRect.width : triggerRect.left
      const left = Math.min(
        Math.max(preferredLeft, viewportPadding),
        Math.max(viewportPadding, window.innerWidth - menuRect.width - viewportPadding),
      )
      const below = triggerRect.bottom + gap
      const above = triggerRect.top - menuRect.height - gap
      const top = below + menuRect.height <= window.innerHeight - viewportPadding || above < viewportPadding ? below : above
      setPosition({ left, ready: true, top })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [align, open])

  useLayoutEffect(() => {
    if (!open || !position.ready) return
    menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')?.focus()
  }, [open, position.ready])

  useLayoutEffect(() => {
    if (!open) return
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (!menuRef.current?.contains(target) && !triggerRef.current?.contains(target)) close(false)
    }
    document.addEventListener('pointerdown', handlePointerDown, true)
    return () => document.removeEventListener('pointerdown', handlePointerDown, true)
  }, [close, open])

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      close(true)
      return
    }
    if (event.key === 'Tab') {
      setOpen(false)
      return
    }
    const enabledItems = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')]
    if (enabledItems.length === 0) return
    const currentIndex = enabledItems.indexOf(document.activeElement as HTMLButtonElement)
    let nextIndex: number | undefined
    if (event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % enabledItems.length
    if (event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + enabledItems.length) % enabledItems.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = enabledItems.length - 1
    if (nextIndex !== undefined) {
      event.preventDefault()
      enabledItems[nextIndex]?.focus()
    }
  }

  const portalHost = triggerRef.current?.closest('dialog') ?? document.body

  return (
    <>
      <Button
        aria-controls={open ? menuId : undefined}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={label}
        aria-describedby={triggerDescribedBy}
        className={triggerClassName}
        onClick={() => {
          setPosition((current) => ({ ...current, ready: false }))
          setOpen((current) => !current)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && open) {
            event.preventDefault()
            close(true)
            return
          }
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            setOpen(true)
          }
        }}
        ref={triggerRef}
        variant="ghost"
      >
        {trigger}
      </Button>
      {open && createPortal(
        <div
          aria-label={label}
          className="app-dropdown-menu"
          id={menuId}
          onKeyDown={handleMenuKeyDown}
          ref={menuRef}
          role="menu"
          style={{ left: position.left, top: position.top, visibility: position.ready ? 'visible' : 'hidden' }}
        >
          {items.map((item) => (
            <Button
              className={item.tone === 'danger' ? 'app-dropdown-menu__item app-text-error' : 'app-dropdown-menu__item'}
              disabled={item.disabled}
              key={item.id}
              onClick={() => {
                item.onSelect()
                close(true)
              }}
              role="menuitem"
              startIcon={item.icon}
              variant="ghost"
            >
              <span className="min-w-0 text-left">
                <span className="block font-medium">{item.label}</span>
                {item.description && <span className="app-caption app-text-muted mt-0.5 block font-normal">{item.description}</span>}
              </span>
            </Button>
          ))}
        </div>,
        portalHost,
      )}
    </>
  )
}
