import { useEffect, useRef, useCallback, useState } from 'react';
import { Download, Loader2, Eye, ImagePlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';

interface PreviewCanvasProps {
  canvas: HTMLCanvasElement | null;
  isLoading: boolean;
  onDownload?: () => void;
}

export function PreviewCanvas({ canvas, isLoading, onDownload }: PreviewCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [displayCanvas, setDisplayCanvas] = useState<HTMLCanvasElement | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 点击处理函数
  const handleClick = useCallback(() => {
    onDownload?.();
  }, [onDownload]);

  // 使用双缓冲策略更新画布
  useEffect(() => {
    if (!canvas) {
      setDisplayCanvas(null);
      canvasRef.current = null;
      return;
    }

    // 如果 canvas 相同，不做任何操作
    if (canvasRef.current === canvas) {
      return;
    }

    // 如果是第一次加载，直接显示
    if (!canvasRef.current) {
      setDisplayCanvas(canvas);
      canvasRef.current = canvas;
      return;
    }

    // 使用过渡效果切换画布
    setIsTransitioning(true);
    
    // 短暂延迟后更新画布，让用户看到过渡效果
    const timer = setTimeout(() => {
      setDisplayCanvas(canvas);
      canvasRef.current = canvas;
      setIsTransitioning(false);
    }, 50);

    return () => clearTimeout(timer);
  }, [canvas]);

  // 同步 canvas 样式到 DOM
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !displayCanvas) return;

    // 清空容器
    container.innerHTML = '';

    // 添加 canvas 到容器
    displayCanvas.style.maxWidth = '100%';
    displayCanvas.style.height = 'auto';
    displayCanvas.style.borderRadius = '12px';
    displayCanvas.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    displayCanvas.style.cursor = onDownload ? 'pointer' : 'default';
    displayCanvas.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
    displayCanvas.style.opacity = isTransitioning ? '0.7' : '1';
    displayCanvas.style.transform = isTransitioning ? 'scale(0.98)' : 'scale(1)';
    
    // 移动端优化触摸
    (displayCanvas.style as CSSStyleDeclaration & { WebkitTapHighlightColor: string }).WebkitTapHighlightColor = 'transparent';
    
    container.appendChild(displayCanvas);

    // 添加点击下载功能
    if (onDownload) {
      displayCanvas.addEventListener('click', handleClick);
    }

    return () => {
      if (displayCanvas) {
        displayCanvas.removeEventListener('click', handleClick);
      }
    };
  }, [displayCanvas, onDownload, handleClick, isTransitioning]);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            预览效果
          </CardTitle>
          {displayCanvas && onDownload && (
            <Button variant="ghost" size="sm" onClick={onDownload} className="h-8 sm:h-9">
              <Download className="mr-1.5 sm:mr-2 h-4 w-4" />
              <span className="text-sm">下载</span>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative flex flex-1 items-center justify-center px-3 sm:px-6 pb-6 sm:pb-8">
        <div className="w-full rounded-xl sm:rounded-2xl bg-background p-3 sm:p-6">
          {isLoading && !displayCanvas ? (
            <div className="flex h-[250px] sm:h-[350px] lg:h-[400px] items-center justify-center">
              <div className="text-center">
                <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto">
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
                </div>
                <p className="mt-3 sm:mt-4 text-sm font-medium text-foreground-secondary">加载中...</p>
              </div>
            </div>
          ) : displayCanvas ? (
            <div
              ref={containerRef}
              className="flex items-center justify-center min-h-[200px] sm:min-h-[300px]"
            />
          ) : (
            <div className="flex h-[250px] sm:h-[350px] lg:h-[400px] flex-col items-center justify-center">
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-foreground/5">
                <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
              </div>
              <p className="mt-3 sm:mt-4 text-sm font-medium text-foreground-secondary">暂无预览</p>
              <p className="mt-1 text-xs text-muted-foreground">上传图片后即可预览水印效果</p>
            </div>
          )}
        </div>
        {displayCanvas && (
          <p className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 text-center text-xs text-muted-foreground">
            点击图片即可下载
          </p>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * 全局拖入遮罩组件
 */
interface GlobalDragOverlayProps {
  isVisible: boolean;
}

export function GlobalDragOverlay({ isVisible }: GlobalDragOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-primary/10 backdrop-blur-sm flex items-center justify-center transition-all duration-200">
      <div className="bg-surface border-2 border-dashed border-primary rounded-3xl p-12 flex flex-col items-center justify-center shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 mb-6">
          <ImagePlus className="h-10 w-10 text-primary animate-bounce" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">释放以上传图片</h3>
        <p className="mt-2 text-sm text-muted-foreground">支持 PNG、JPEG、GIF、WebP 格式</p>
      </div>
    </div>
  );
}
