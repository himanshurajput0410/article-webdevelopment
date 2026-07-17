export interface Toast {
  id: number
  type: 'success' | 'error'
  message: string
}

let nextId = 0

export function useToast() {
  const toasts = useState<Toast[]>('toasts', () => [])

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  function push(type: Toast['type'], message: string) {
    const id = ++nextId
    toasts.value = [...toasts.value, { id, type, message }]
    setTimeout(() => dismiss(id), 3000)
  }

  return {
    toasts,
    dismiss,
    success: (message: string) => push('success', message),
    error: (message: string) => push('error', message),
  }
}
