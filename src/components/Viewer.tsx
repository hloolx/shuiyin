import { AnimatePresence, m } from 'motion/react';
import { useEffect, useState } from 'react';
import { Download, Loader2, Share2, X, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '../lib/utils';

export interface ViewerState {
  url: string | null;
  name: string;
  blob: Blob | null;
}

interface ViewerProps {
  state: ViewerState | null;
  onClose: () => void;
  onDownload: () => void;
  /** 触屏设备：提示长按保存，并提供系统分享 */
  touch: boolean;
  /** 微信内无法下载文件，只能长按保存 */
  wechat: boolean;
}

export function Viewer({ state, onClose, onDownload, touch, wechat }: ViewerProps) {
  const [zoomed, setZoomed] = useState(false);
  const [lastName, setLastName] = useState(state?.name);
  if (state?.name !== lastName) {
    setLastName(state?.name);
    setZoomed(false);
  }

  const shareFile = state?.blob ? new File([state.blob], state.name, { type: state.blob.type }) : null;
  const canShare = Boolean(touch && shareFile && navigator.canShare?.({ files: [shareFile] }));

  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [state, onClose]);

  const share = async () => {
    if (!shareFile) return;
    try {
      await navigator.share({ files: [shareFile] });
    } catch {
      // 用户取消分享
    }
  };

  return (
    <AnimatePresence>
      {state && (
        <m.div
          role="dialog"
          aria-modal="true"
          aria-label="查看大图"
          className="fixed inset-0 z-[105] flex flex-col bg-black/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 text-white sm:px-5">
            <p className="min-w-0 flex-1 truncate text-sm font-medium text-white/90">{state.name}</p>
            {!touch && state.url && (
              <button
                type="button"
                onClick={() => setZoomed((z) => !z)}
                className="flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm text-white/85 transition-colors hover:bg-white/10"
              >
                {zoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
                {zoomed ? '适应屏幕' : '原始尺寸'}
              </button>
            )}
            {canShare && (
              <button
                type="button"
                onClick={share}
                className="flex h-10 items-center gap-1.5 rounded-xl bg-white/15 px-3 text-sm font-medium text-white transition-colors hover:bg-white/25"
              >
                <Share2 className="h-4 w-4" />
                保存/分享
              </button>
            )}
            {!wechat && (
              <button
                type="button"
                onClick={onDownload}
                disabled={!state.url}
                className="flex h-10 items-center gap-1.5 rounded-xl bg-white px-3 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                <Download className="h-4 w-4" />
                下载
              </button>
            )}
            <button
              type="button"
              aria-label="关闭"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white/85 transition-colors hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div
            className={cn('relative min-h-0 flex-1', zoomed ? 'overflow-auto' : 'overflow-hidden')}
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            {state.url ? (
              <div
                className={cn('flex min-h-full min-w-full p-4', zoomed ? 'w-max items-start' : 'h-full items-center justify-center')}
                onClick={(e) => e.target === e.currentTarget && onClose()}
              >
                <m.img
                  src={state.url}
                  alt={state.name}
                  draggable={false}
                  onClick={() => !touch && setZoomed((z) => !z)}
                  className={cn(
                    'allow-callout rounded-md shadow-2xl',
                    zoomed ? 'max-w-none cursor-zoom-out' : 'max-h-full max-w-full object-contain',
                    !touch && !zoomed && 'cursor-zoom-in'
                  )}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                />
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-white/70">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-sm">正在生成原图…</p>
              </div>
            )}
          </div>

          {touch && state.url && (
            <m.p
              className="pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 text-center text-xs text-white/60"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              长按图片可保存到相册
            </m.p>
          )}
        </m.div>
      )}
    </AnimatePresence>
  );
}
