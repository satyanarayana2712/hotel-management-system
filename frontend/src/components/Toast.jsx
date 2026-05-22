import { useEffect } from 'react'

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (!message) return undefined

    const timer = window.setTimeout(() => {
      onClose?.()
    }, 3000)

    return () => window.clearTimeout(timer)
  }, [message, onClose])

  if (!message) return null

  const toneLabel = {
    success: 'Success',
    error: 'Error',
    info: 'Info',
  }[type] || 'Info'

  const icon = {
    success: '✓',
    error: '!',
    info: 'i',
  }[type] || 'i'

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      <div className="toast-item" data-tone={type}>
        <span className="toast-icon" data-tone={type} aria-hidden="true">
          {icon}
        </span>
        <div className="min-w-0">
          <div className="toast-title">{toneLabel}</div>
          <div className="toast-copy break-words">{message}</div>
        </div>
        <button type="button" onClick={onClose} className="toast-close" aria-label="Dismiss notification">
          ✕
        </button>
      </div>
    </div>
  )
}

export default Toast
