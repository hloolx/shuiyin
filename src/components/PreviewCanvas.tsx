import { useEffect, useRef } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

interface PreviewCanvasProps {
  canvas: HTMLCanvasElement | null;
  isLoading: boolean;
  onDownload?: () => void;
}

export function PreviewCanvas({ canvas, isLoading, onDownload }: PreviewCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !canvas) return;

    // 清空容器
    container.innerHTML = '';

    // 添加 canvas 到容器
    canvas.className = 'max-w-full h-auto rounded-lg shadow-sm cursor-pointer';
    container.appendChild(canvas);

    // 添加点击下载功能
    if (onDownload) {
      canvas.addEventListener('click', onDownload);
      return () => {
        canvas.removeEventListener('click', onDownload);
      };
    }
  }, [canvas, onDownload]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>预览效果</CardTitle>
          {canvas && onDownload && (
            <button
              onClick={onDownload}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <Download className="h-4 w-4" />
              点击下载
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="min-h-[400px] rounded-lg bg-gray-50 p-4">
          {isLoading ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
                <p className="mt-2 text-sm text-gray-500">加载中...</p>
              </div>
            </div>
          ) : canvas ? (
            <div
              ref={containerRef}
              className="flex items-center justify-center"
            />
          ) : (
            <div className="flex h-[400px] items-center justify-center">
              <p className="text-sm text-gray-500">请先上传图片</p>
            </div>
          )}
        </div>
        {canvas && (
          <p className="mt-2 text-center text-xs text-gray-500">
            点击图片即可下载
          </p>
        )}
      </CardContent>
    </Card>
  );
}
