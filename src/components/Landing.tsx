import { m, type Variants } from 'motion/react';
import { Camera, FileArchive, ImagePlus, MousePointerClick, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { isMac } from '../lib/utils';

interface LandingProps {
  onPick: () => void;
  onCamera: () => void;
  showCamera: boolean;
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 26 } },
};

const features = [
  { icon: ShieldCheck, title: '完全本地处理', desc: '图片只在你的浏览器里处理，不上传、不留存，断网也能用' },
  { icon: Sparkles, title: '所见即所得', desc: '平铺或单个水印，拖动滑块实时预览，设置自动保存' },
  { icon: FileArchive, title: '批量一键导出', desc: '保持原图分辨率和格式，多张自动打包为 ZIP' },
];

/** 首页插画：一张"照片"上缓慢漂移的平铺水印 */
function Illustration() {
  const rows = Array.from({ length: 9 });
  return (
    <div className="relative mx-auto aspect-[1.6] w-full max-w-[280px] sm:max-w-[320px]">
      <m.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5"
        initial={{ rotate: 0, x: 0, y: 0, opacity: 0 }}
        animate={{ rotate: 5, x: 12, y: 10, opacity: 1 }}
        transition={{ delay: 0.35, type: 'spring', stiffness: 120, damping: 14 }}
      />
      <div className="absolute inset-0 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-300 via-indigo-300 to-fuchsia-300 shadow-float dark:from-sky-700 dark:via-indigo-700 dark:to-fuchsia-700">
        {/* 模拟证件内容 */}
        <div className="absolute left-[8%] top-[14%] h-[52%] w-[30%] rounded-lg bg-white/60" />
        <div className="absolute left-[44%] top-[18%] h-[7%] w-[40%] rounded bg-white/60" />
        <div className="absolute left-[44%] top-[34%] h-[7%] w-[30%] rounded bg-white/50" />
        <div className="absolute left-[44%] top-[50%] h-[7%] w-[36%] rounded bg-white/50" />
        <div className="absolute bottom-[12%] left-[8%] h-[7%] w-[76%] rounded bg-white/40" />
        {/* 旋转放在外层，内层只做平移动画，避免 transform 互相覆盖 */}
        <div aria-hidden className="absolute -inset-1/2 flex -rotate-[30deg] items-center">
          <m.div
            className="flex flex-col gap-4"
            animate={{ x: [0, -96] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          >
            {rows.map((_, i) => (
              <div
                key={i}
                className="whitespace-nowrap text-[11px] font-semibold tracking-wider text-primary/70 dark:text-white/50"
                style={{ marginLeft: i % 2 ? 48 : 0 }}
              >
                {'仅供XX使用 他用无效　　'.repeat(8)}
              </div>
            ))}
          </m.div>
        </div>
      </div>
    </div>
  );
}

export function Landing({ onPick, onCamera, showCamera }: LandingProps) {
  return (
    <m.div
      className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 pb-16 pt-8 sm:px-6 sm:pt-14"
      variants={container}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
    >
      <m.div
        variants={item}
        className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success"
      >
        <ShieldCheck className="h-3.5 w-3.5" />
        图片不会上传到任何服务器
      </m.div>

      <m.h1
        variants={item}
        className="mt-5 text-balance text-center text-3xl font-bold tracking-tight text-foreground sm:text-5xl"
      >
        给图片加水印，
        <span className="bg-gradient-to-r from-primary to-fuchsia-500 bg-clip-text text-transparent">一步到位</span>
      </m.h1>
      <m.p
        variants={item}
        className="mt-3 max-w-xl text-balance text-center text-sm text-foreground-secondary sm:text-base"
      >
        身份证、证件照、作品图批量加水印，防止被挪作他用
      </m.p>

      <m.div variants={item} className="mt-8 w-full max-w-2xl sm:mt-10">
        <m.div
          role="button"
          tabIndex={0}
          aria-label="选择图片"
          onClick={onPick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onPick();
            }
          }}
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="group relative cursor-pointer overflow-hidden rounded-4xl border-2 border-dashed border-border-strong bg-surface p-6 text-center shadow-card transition-colors hover:border-primary/50 sm:p-10"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(var(--primary)/0.08),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <Illustration />
          <p className="mt-8 text-base font-semibold text-foreground sm:text-lg">
            <span className="hidden sm:inline">拖拽图片到这里，或</span>点击选择图片
          </p>
          <p className="mt-1 text-xs text-foreground-tertiary sm:text-sm">
            支持 JPG、PNG、WebP、GIF、HEIC，可多选
            <span className="hidden sm:inline">，也可以直接 {isMac ? '⌘' : 'Ctrl'}+V 粘贴截图</span>
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                onPick();
              }}
            >
              <ImagePlus className="h-5 w-5" />
              选择图片
            </Button>
            {showCamera && (
              <Button
                variant="outline"
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onCamera();
                }}
              >
                <Camera className="h-5 w-5" />
                拍照
              </Button>
            )}
          </div>
        </m.div>
      </m.div>

      <m.ul variants={item} className="mt-10 grid w-full max-w-4xl gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-4">
        {features.map(({ icon: Icon, title, desc }) => (
          <li key={title} className="flex gap-3 rounded-2xl border border-border bg-surface/60 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-foreground-tertiary">{desc}</p>
            </div>
          </li>
        ))}
      </m.ul>

      <m.p variants={item} className="mt-8 hidden items-center gap-1.5 text-xs text-foreground-tertiary sm:flex">
        <MousePointerClick className="h-3.5 w-3.5" />
        进入编辑后可用 ← → 切换图片，按住空格对比原图
      </m.p>
    </m.div>
  );
}
