let activeLocks = 0

function syncBodyState() {
  if (activeLocks > 0) {
    document.body.dataset.overlayOpen = 'true'
    return
  }

  delete document.body.dataset.overlayOpen
}

export function acquirePageScrollLock() {
  activeLocks += 1
  syncBodyState()
  let released = false

  return () => {
    if (released) return
    released = true
    activeLocks = Math.max(0, activeLocks - 1)
    syncBodyState()
  }
}
