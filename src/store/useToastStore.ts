import { create } from 'zustand'
import { Toast } from '@/components/Toast'

interface ToastStore {
  toasts: Toast[]
  showToast: (message: string, type?: Toast['type'], duration?: number) => void
  removeToast: (id: string) => void
  success: (message: string) => void
  error: (message: string) => void
  warning: (message: string) => void
  info: (message: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  showToast: (message, type = 'info', duration = 5000) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    const toast: Toast = { id, message, type, duration }

    set((state) => ({
      toasts: [...state.toasts, toast],
    }))

    return id
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },

  success: (message) => {
    const store = useToastStore.getState()
    store.showToast(message, 'success')
  },

  error: (message) => {
    const store = useToastStore.getState()
    store.showToast(message, 'error', 7000)
  },

  warning: (message) => {
    const store = useToastStore.getState()
    store.showToast(message, 'warning')
  },

  info: (message) => {
    const store = useToastStore.getState()
    store.showToast(message, 'info')
  },
}))

