import { AnimatePresence, m } from 'motion/react';
import { ImagePlus } from 'lucide-react';

export function DropOverlay({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <m.div
          className="pointer-events-none fixed inset-0 z-[110] flex items-center justify-center bg-background/70 p-6 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <m.div
            className="relative flex w-full max-w-md flex-col items-center rounded-4xl bg-surface px-8 py-12 text-center shadow-float"
            initial={{ scale: 0.92, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 6 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          >
            {/* 流动的虚线边框 */}
            <svg className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
              <rect
                width="100%"
                height="100%"
                rx="32"
                fill="none"
                stroke="rgb(var(--primary))"
                strokeWidth="2"
                strokeDasharray="10 14"
                className="animate-dash-flow"
              />
            </svg>
            <m.div
              className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ImagePlus className="h-8 w-8" />
            </m.div>
            <p className="text-lg font-semibold text-foreground">松手即可添加图片</p>
            <p className="mt-1.5 text-sm text-foreground-tertiary">支持 JPG、PNG、WebP、GIF 等格式，可一次拖入多张</p>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
