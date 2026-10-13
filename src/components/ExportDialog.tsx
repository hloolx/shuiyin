import { AnimatePresence, m } from 'motion/react';
import { FileArchive, Loader2 } from 'lucide-react';
import type { ExportProgress } from '../types';
import { Button } from './ui/Button';

interface ExportDialogProps {
  progress: ExportProgress | null;
  onCancel: () => void;
}

function SuccessMark() {
  return (
    <svg viewBox="0 0 52 52" className="h-12 w-12 text-success">
      <m.circle
        cx="26"
        cy="26"
        r="23"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
      <m.path
        d="M15 27l7 7 15-16"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.3, ease: 'easeOut' }}
      />
    </svg>
  );
}

export function ExportDialog({ progress, onCancel }: ExportDialogProps) {
  const done = progress?.phase === 'done';
  const title = !progress
    ? ''
    : done
      ? '导出完成'
      : progress.phase === 'zip'
        ? '正在打包 ZIP…'
        : `正在添加水印 ${progress.current}/${progress.total}`;

  return (
    <AnimatePresence>
      {progress && (
        <m.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.1 } }}
        >
          <m.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="export-title"
            className="w-full max-w-sm rounded-3xl border border-border bg-surface p-6 shadow-float"
            initial={{ scale: 0.92, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <AnimatePresence mode="wait" initial={false}>
                  {done ? (
                    <m.span key="done" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                      <SuccessMark />
                    </m.span>
                  ) : progress.phase === 'zip' ? (
                    <m.span key="zip" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}>
                      <FileArchive className="h-6 w-6" />
                    </m.span>
                  ) : (
                    <m.span key="render" exit={{ scale: 0.6, opacity: 0 }}>
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </m.span>
                  )}
                </AnimatePresence>
              </div>
              <div className="min-w-0 flex-1">
                <h2 id="export-title" className="tabular text-base font-semibold text-foreground">
                  {title}
                </h2>
                <p className="truncate text-xs text-foreground-tertiary">
                  {done ? '文件已开始下载' : progress.name || '处理完全在本地进行，请勿关闭页面'}
                </p>
              </div>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-surface-2">
              <m.div
                className="h-full origin-left rounded-full bg-gradient-to-r from-primary to-fuchsia-500"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress.ratio }}
                transition={{ type: 'spring', stiffness: 120, damping: 24 }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-foreground-tertiary">
              <span className="tabular">{Math.round(progress.ratio * 100)}%</span>
              {!done && (
                <Button variant="ghost" size="sm" onClick={onCancel}>
                  取消
                </Button>
              )}
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
