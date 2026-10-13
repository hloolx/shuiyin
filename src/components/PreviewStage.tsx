import { AnimatePresence, m, type PanInfo, type Variants } from 'motion/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Eye, Loader2, Maximize2 } from 'lucide-react';
import type { ImageItem, WatermarkSettings } from '../types';
import { sourceCache } from '../core/image';
import { renderComposite } from '../core/watermark';
import { cn } from '../lib/utils';

interface PreviewStageProps {
  item: ImageItem | null;
  index: number;
  total: number;
  settings: WatermarkSettings;
  compare: boolean;
  onCompareChange: (pressed: boolean) => void;
  onPrev: () => void;
  onNext: () => void;
  onView: () => void;
  onDownload: () => void;
  /** 触屏设备允许左右拖动切换 */
  swipe: boolean;
  className?: string;
}

interface Box {
  w: number;
  h: number;
}

// 预留给四周留白和底部工具栏的空间
const PAD_X = 16;
const PAD_TOP = 16;
const PAD_BOTTOM = 64;
const MAX_PREVIEW_PIXELS = 4_000_000;

function fitSize(item: ImageItem, box: Box) {
  const W = item.width!;
  const H = item.height!;
  const cssScale = Math.min((box.w - PAD_X * 2) / W, (box.h - PAD_TOP - PAD_BOTTOM) / H, 1);
  const cssW = Math.max(1, W * cssScale);
  const cssH = Math.max(1, H * cssScale);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let pw = Math.min(W, cssW * dpr);
  let ph = Math.min(H, cssH * dpr);
  const over = Math.sqrt((pw * ph) / MAX_PREVIEW_PIXELS);
  if (over > 1) {
    pw /= over;
    ph /= over;
  }
  return { cssW, cssH, pw: Math.round(pw), ph: Math.round(ph) };
}

const slide: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 56, scale: 0.98 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -56, scale: 0.98 }),
};

/** 单张图的画布；以 item.id 为 key，切换图片时新旧两个实例做交叉动画 */
function StageCanvas({
  item,
  box,
  settings,
  compare,
  onClick,
}: {
  item: ImageItem;
  box: Box;
  settings: WatermarkSettings;
  compare: boolean;
  onClick: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 缩放后的底图只在尺寸变化时重画，拖动滑块时只重绘水印
  const baseRef = useRef<HTMLCanvasElement | null>(null);
  const tokenRef = useRef(0);
  const [painted, setPainted] = useState(false);

  const ready = Boolean(item.width && item.height && box.w > 0);
  const size = ready ? fitSize(item, box) : null;
  const pw = size?.pw ?? 0;
  const ph = size?.ph ?? 0;

  useEffect(() => {
    if (!pw || !ph) return;
    const token = ++tokenRef.current;
    const raf = requestAnimationFrame(async () => {
      try {
        let base = baseRef.current;
        if (!base || base.width !== pw || base.height !== ph) {
          const decoded = await sourceCache.get(item.id, item.file);
          if (token !== tokenRef.current) return;
          base = base ?? document.createElement('canvas');
          base.width = pw;
          base.height = ph;
          const bctx = base.getContext('2d')!;
          bctx.imageSmoothingQuality = 'high';
          bctx.drawImage(decoded.source, 0, 0, pw, ph);
          baseRef.current = base;
        }
        const canvas = canvasRef.current;
        if (!canvas || token !== tokenRef.current) return;
        if (canvas.width !== pw) canvas.width = pw;
        if (canvas.height !== ph) canvas.height = ph;
        const ctx = canvas.getContext('2d')!;
        renderComposite(ctx, base, pw, ph, pw / item.width!, compare ? null : settings);
        setPainted(true);
      } catch (err) {
        console.error('预览渲染失败', err);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [item.id, item.file, item.width, pw, ph, settings, compare]);

  // 卸载时释放底图内存
  useEffect(
    () => () => {
      if (baseRef.current) baseRef.current.width = baseRef.current.height = 0;
    },
    [],
  );

  return (
    <div className="relative" style={size ? { width: size.cssW, height: size.cssH } : { width: 240, height: 180 }}>
      <canvas
        ref={canvasRef}
        onClick={onClick}
        className={cn(
          'h-full w-full cursor-zoom-in rounded-md shadow-float transition-opacity duration-300',
          painted ? 'opacity-100' : 'opacity-0',
        )}
        aria-label={`${item.name} 的水印预览`}
        role="img"
      />
      {!painted && (
        <div className="skeleton absolute inset-0 flex items-center justify-center rounded-md">
          <Loader2 className="h-6 w-6 animate-spin text-foreground-tertiary" />
        </div>
      )}
    </div>
  );
}

function ToolButton({ label, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full text-foreground-secondary transition-colors hover:bg-surface-2 hover:text-foreground disabled:pointer-events-none disabled:opacity-30',
        className,
      )}
      {...props}
    />
  );
}

export function PreviewStage({
  item,
  index,
  total,
  settings,
  compare,
  onCompareChange,
  onPrev,
  onNext,
  onView,
  onDownload,
  swipe,
  className,
}: PreviewStageProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<Box>({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBox((prev) =>
        Math.abs(prev.w - width) < 1 && Math.abs(prev.h - height) < 1 ? prev : { w: width, h: height },
      );
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 根据索引变化推断切换方向，用于左右滑入动画
  const [prevIndex, setPrevIndex] = useState(index);
  const [dir, setDir] = useState(0);
  if (prevIndex !== index) {
    setDir(Math.sign(index - prevIndex));
    setPrevIndex(index);
  }

  // 拖动结束时浏览器仍可能补发 click，用标记吞掉，避免误开大图
  const draggedRef = useRef(false);
  const handleCanvasClick = () => {
    if (draggedRef.current) {
      draggedRef.current = false;
      return;
    }
    onView();
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if (offset.x < -60 || velocity.x < -500) onNext();
    else if (offset.x > 60 || velocity.x > 500) onPrev();
  };

  const holdCompare = {
    onPointerDown: (e: React.PointerEvent) => {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      onCompareChange(true);
    },
    onPointerUp: () => onCompareChange(false),
    onPointerCancel: () => onCompareChange(false),
    onLostPointerCapture: () => onCompareChange(false),
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  };

  return (
    <section
      className={cn('relative overflow-hidden rounded-3xl border border-border bg-surface shadow-card', className)}
      aria-label="预览"
    >
      <div ref={boxRef} className="checker absolute inset-0">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          {item && (
            <m.div
              key={item.id}
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 360, damping: 34 }}
              className="absolute inset-0 flex items-start justify-center"
              style={{ paddingTop: PAD_TOP, paddingBottom: PAD_BOTTOM, paddingLeft: PAD_X, paddingRight: PAD_X }}
              drag={swipe && total > 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.35}
              dragSnapToOrigin
              onPointerDownCapture={() => (draggedRef.current = false)}
              onDragStart={() => (draggedRef.current = true)}
              onDragEnd={handleDragEnd}
            >
              <div className="flex h-full w-full items-center justify-center">
                <StageCanvas item={item} box={box} settings={settings} compare={compare} onClick={handleCanvasClick} />
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* 对比原图提示 */}
      <AnimatePresence>
        {compare && (
          <m.div
            className="pointer-events-none absolute inset-x-0 top-4 z-10 flex justify-center"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <span className="rounded-full bg-foreground/80 px-3 py-1 text-xs font-medium text-background backdrop-blur">
              原图
            </span>
          </m.div>
        )}
      </AnimatePresence>

      {/* 底部悬浮工具栏 */}
      {item && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center px-2">
          <m.div
            className="pointer-events-auto flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full border border-border bg-surface/90 p-1 shadow-float backdrop-blur-xl no-scrollbar"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26, delay: 0.1 }}
          >
            {total > 1 && (
              <>
                <ToolButton label="上一张 (←)" onClick={onPrev} disabled={index <= 0}>
                  <ChevronLeft className="h-4 w-4" />
                </ToolButton>
                <span className="tabular min-w-[3.5rem] select-none text-center text-xs font-medium text-foreground-secondary">
                  {index + 1} / {total}
                </span>
                <ToolButton label="下一张 (→)" onClick={onNext} disabled={index >= total - 1}>
                  <ChevronRight className="h-4 w-4" />
                </ToolButton>
                <span className="mx-1 h-5 w-px bg-border" />
              </>
            )}
            <ToolButton
              label="按住对比原图 (空格)"
              {...holdCompare}
              className={cn('select-none', compare && 'bg-primary/10 text-primary')}
            >
              <Eye className="h-4 w-4" />
            </ToolButton>
            <ToolButton label="查看大图" onClick={onView}>
              <Maximize2 className="h-4 w-4" />
            </ToolButton>
            <ToolButton label="下载当前图片" onClick={onDownload}>
              <Download className="h-4 w-4" />
            </ToolButton>
          </m.div>
        </div>
      )}
    </section>
  );
}
