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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm sm:max-w-md rounded-2xl sm:rounded-3xl bg-surface p-5 sm:p-8 shadow-elevated">
        <div className="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-primary/10 flex-shrink-0">
            <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">
              正在处理图片...
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              请稍候，正在添加水印
            </p>
          </div>
        </div>

        <div className="mb-4 sm:mb-6">
          <div className="mb-2 sm:mb-3 flex items-center justify-between text-sm">
            <span className="text-muted-foreground text-xs sm:text-sm">
              进度: {progress.current} / {progress.total}
            </span>
            <span className="font-semibold text-foreground text-sm sm:text-base">{percentage}%</span>
          </div>

          {/* 进度条 */}
          <div className="h-1.5 sm:h-2 w-full overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300 ease-smooth"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl bg-background p-3 sm:p-4">
          <p className="truncate text-xs sm:text-sm text-muted-foreground">
            <span className="text-foreground-tertiary">当前文件:</span>{' '}
            <span className="font-medium text-foreground-secondary">{progress.fileName}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
