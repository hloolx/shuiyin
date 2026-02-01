import { Loader2 } from 'lucide-react';
import type { ProgressState } from '../types';

interface ProgressModalProps {
  progress: ProgressState;
}

export function ProgressModal({ progress }: ProgressModalProps) {
  if (!progress.isOpen) return null;

  const percentage = progress.total > 0
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-surface p-8 shadow-elevated">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              正在处理图片...
            </h3>
            <p className="text-sm text-muted-foreground">
              请稍候，正在添加水印
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              进度: {progress.current} / {progress.total}
            </span>
            <span className="font-semibold text-foreground">{percentage}%</span>
          </div>

          {/* 进度条 */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300 ease-smooth"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl bg-background p-4">
          <p className="truncate text-sm text-muted-foreground">
            <span className="text-foreground-tertiary">当前文件:</span>{' '}
            <span className="font-medium text-foreground-secondary">{progress.fileName}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
