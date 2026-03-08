import { create } from 'zustand';

interface Toast {
  id: string;
  type: 'success' | 'error';
  message: string;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (type: 'success' | 'error', message: string) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (type, message) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    set((s) => ({ toasts: [...s.toasts, { id, type, message }] }));
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}));

export function useToast() {
  const { addToast } = useToastStore();
  return {
    success: (message: string) => addToast('success', message),
    error: (message: string) => addToast('error', message),
  };
}
