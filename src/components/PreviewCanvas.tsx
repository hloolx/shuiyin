import { useEffect, useRef } from 'react';
import { Download, Loader2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';

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
    canvas.className = 'max-w-full h-auto rounded-2xl shadow-subtle cursor-pointer transition-all duration-300 hover:shadow-card';
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
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-muted-foreground" />
            预览效果
          </CardTitle>
          {canvas && onDownload && (
            <Button variant="ghost" size="sm" onClick={onDownload}>
              <Download className="mr-2 h-4 w-4" />
              下载
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative flex flex-1 items-center justify-center">
        <div className="w-full rounded-2xl bg-background p-6">
          {isLoading ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                <p className="mt-4 text-sm font-medium text-foreground-secondary">加载中...</p>
              </div>
            </div>
          ) : canvas ? (
            <div
              ref={containerRef}
              className="flex items-center justify-center"
            />
          ) : (
            <div className="flex h-[400px] flex-col items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground/5">
                <Eye className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm font-medium text-foreground-secondary">暂无预览</p>
              <p className="mt-1 text-xs text-muted-foreground">上传图片后即可预览水印效果</p>
            </div>
          )}
        </div>
        {canvas && (
          <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center text-xs text-muted-foreground">
            点击图片即可下载
          </p>
        )}
      </CardContent>
    </Card>
  );
}
