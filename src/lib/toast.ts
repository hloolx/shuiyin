import { useSyncExternalStore } from 'react';

export type ToastTone = 'default' | 'success' | 'error' | 'warning';

export interface Toast {
  id: number;
  message: string;
  description?: string;
  tone: ToastTone;
  duration: number;
  action?: { label: string; onClick: () => void };
  /** 无论手动关闭还是到期都会调用一次 */
  onClose?: () => void;
}

type ToastInput = Partial<Omit<Toast, 'id' | 'message'>>;

let toasts: Toast[] = [];
let seq = 0;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function toast(message: string, opts: ToastInput = {}) {
  const id = ++seq;
  const item: Toast = { id, message, tone: 'default', duration: 3200, ...opts };
  // 最多同时展示 4 条
  const overflow = toasts.length >= 4 ? toasts.slice(0, toasts.length - 3) : [];
  overflow.forEach((t) => t.onClose?.());
  toasts = [...toasts.slice(overflow.length), item];
  emit();
  return id;
}

toast.success = (message: string, opts?: ToastInput) => toast(message, { ...opts, tone: 'success' });
toast.error = (message: string, opts?: ToastInput) => toast(message, { ...opts, tone: 'error', duration: 5000 });
toast.warning = (message: string, opts?: ToastInput) => toast(message, { ...opts, tone: 'warning', duration: 4500 });

export function dismissToast(id: number) {
  const item = toasts.find((t) => t.id === id);
  if (!item) return;
  toasts = toasts.filter((t) => t.id !== id);
  item.onClose?.();
  emit();
}

export function useToasts() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => toasts
  );
}
