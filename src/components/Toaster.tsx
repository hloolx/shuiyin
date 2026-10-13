import { AnimatePresence, m } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { dismissToast, useToasts, type Toast } from '../lib/toast';
import { cn } from '../lib/utils';

const icons = {
  default: <Info className="h-4 w-4 text-primary" />,
  success: <CheckCircle2 className="h-4 w-4 text-success" />,
  error: <XCircle className="h-4 w-4 text-danger" />,
  warning: <AlertTriangle className="h-4 w-4 text-warning" />,
};

function ToastItem({ t }: { t: Toast }) {
  const [paused, setPaused] = useState(false);
  const remaining = useRef(t.duration);
  const startedAt = useRef(0);

  useEffect(() => {
    if (paused) return;
    startedAt.current = Date.now();
    const timer = setTimeout(() => dismissToast(t.id), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [paused, t.id]);

  return (
    <m.li
      layout
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.16 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      role={t.tone === 'error' ? 'alert' : 'status'}
      className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-border bg-surface/95 p-3 pr-2 shadow-float backdrop-blur-xl"
    >
      <span className="mt-0.5">{icons[t.tone]}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{t.message}</p>
        {t.description && <p className="mt-0.5 break-words text-xs text-foreground-tertiary">{t.description}</p>}
      </div>
      {t.action && (
        <button
          type="button"
          onClick={() => {
            t.action!.onClick();
            dismissToast(t.id);
          }}
          className="shrink-0 rounded-lg px-2 py-1 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          {t.action.label}
        </button>
      )}
      <button
        type="button"
        aria-label="关闭通知"
        onClick={() => dismissToast(t.id)}
        className={cn('shrink-0 rounded-lg p-1 text-foreground-tertiary transition-colors hover:bg-surface-2 hover:text-foreground')}
      >
        <X className="h-4 w-4" />
      </button>
    </m.li>
  );
}

export function Toaster() {
  const toasts = useToasts();
  return (
    <ol
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-0 z-[120] flex flex-col items-center gap-2 px-4 pt-[max(1rem,env(safe-area-inset-top))]"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <ToastItem key={t.id} t={t} />
        ))}
      </AnimatePresence>
    </ol>
  );
}
