import { AnimatePresence, m } from 'motion/react';
import { ImagePlus } from 'lucide-react';
import { motionTokens } from './arc/lib/motion-tokens';

export function DropOverlay({ visible }: { visible: boolean }) {
  return <AnimatePresence>{visible && <m.div
    className="pointer-events-none fixed inset-0 z-[110] flex items-center justify-center bg-background/90 p-6"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    transition={{ duration: motionTokens.duration.fast }}>
    <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-3xl border border-dashed border-border-strong bg-surface px-8 py-12 text-center">
      <ImagePlus size={32} />
      <p className="text-lg font-medium">松手即可添加图片</p>
      <p className="text-sm text-foreground-secondary">支持 JPG、PNG、WebP、GIF 等格式，可一次拖入多张</p>
    </div>
  </m.div>}</AnimatePresence>;
}
