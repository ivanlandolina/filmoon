import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastCtx = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts(ts => ts.filter(t => t.id !== id))
  }, [])

  const showToast = useCallback((message, options = {}) => {
    const id = Math.random().toString(36).slice(2)
    const toast = {
      id,
      message,
      title: options.title || undefined,
      delay: options.delay ?? 3000,
      autohide: options.autohide ?? true,
      bg: options.variant || options.bg || 'dark'
    }
    setToasts(ts => [...ts, toast])
    // auto-hide manuale 
    if (toast.autohide && toast.delay > 0) {
      setTimeout(() => removeToast(id), toast.delay)
    }
    return id
  }, [removeToast])

  const value = useMemo(() => ({ showToast, removeToast }), [showToast, removeToast])

  return (
    <ToastCtx.Provider value={value}>
      {children}

      {/* Toast bottom-right */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="toast-container position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 1055 }}
      >
        {toasts.map(t => (
          <div key={t.id} className="toast show mb-2 toast-custom">
            {t.title && (
              <div className="toast-header">
                <strong className="me-auto">{t.title}</strong>
                <button
                  type="button"
                  className="btn-close ms-2 mb-1"
                  aria-label="Close"
                  onClick={() => removeToast(t.id)}
                />
              </div>
            )}
            <div className={`toast-body bg-${t.bg} text-white`}>
              {t.message}
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)
