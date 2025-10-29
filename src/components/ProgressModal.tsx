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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            正在处理图片...
          </h3>
        </div>

        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-gray-600">
              进度: {progress.current} / {progress.total}
            </span>
            <span className="font-medium text-gray-900">{percentage}%</span>
          </div>

          {/* 进度条 */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <p className="truncate text-sm text-gray-500">
          当前文件: {progress.fileName}
        </p>
      </div>
    </div>
  );
}
