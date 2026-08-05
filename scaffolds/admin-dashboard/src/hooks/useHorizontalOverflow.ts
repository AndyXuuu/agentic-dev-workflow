import { useLayoutEffect, useRef, useState } from 'react'

type HorizontalOverflowState = {
  atEnd: boolean
  atStart: boolean
  hasOverflow: boolean
}

const initialState: HorizontalOverflowState = {
  atEnd: true,
  atStart: true,
  hasOverflow: false,
}

export function useHorizontalOverflow<Element extends HTMLElement>() {
  const ref = useRef<Element>(null)
  const [state, setState] = useState(initialState)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return

    const update = () => {
      const maximumScrollLeft = Math.max(0, element.scrollWidth - element.clientWidth)
      const hasOverflow = maximumScrollLeft > 1
      const nextState = {
        atEnd: !hasOverflow || element.scrollLeft >= maximumScrollLeft - 1,
        atStart: !hasOverflow || element.scrollLeft <= 1,
        hasOverflow,
      }
      setState((current) => current.atEnd === nextState.atEnd
        && current.atStart === nextState.atStart
        && current.hasOverflow === nextState.hasOverflow
        ? current
        : nextState)
    }

    update()
    element.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)
    resizeObserver?.observe(element)
    if (element.firstElementChild instanceof HTMLElement) resizeObserver?.observe(element.firstElementChild)

    return () => {
      element.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      resizeObserver?.disconnect()
    }
  }, [])

  return { ref, ...state }
}
