import { AnimatePresence, LazyMotion, MotionConfig, m, type Variants } from 'motion/react';
import { useCallback, useRef, useState } from 'react';
import { saveAs } from 'file-saver';
import { Download, FileArchive, Github, Keyboard, Menu, Moon, Plus, Sun } from 'lucide-react';
import { motionTokens } from './components/arc/lib/motion-tokens';
import type { ExportOptions, ExportProgress, WatermarkSettings } from './types';
import { useImageStore } from './hooks/useImageStore';
import { usePersistentState } from './hooks/usePersistentState';
import { useTheme } from './hooks/useTheme';
import { useCanHover, useIsDesktop } from './hooks/useMediaQuery';
import { useFileDrop } from './hooks/useFileDrop';
import { useHotkeys } from './hooks/useHotkeys';
import { blobToDataURL, downloadImage, exportImages, renderImage } from './core/export';
import { ACCEPT_TYPES, APP_VERSION, DEFAULT_EXPORT, DEFAULT_SETTINGS, STORAGE_KEYS } from './lib/constants';
import { sanitizeExport, sanitizeSettings } from './lib/settings';
import { toast } from './lib/toast';
import { formatBytes, isMac, isWeChat } from './lib/utils';
import { Button } from './components/ui/Button';
import { Brand } from './components/Brand';
import { Landing } from './components/Landing';
import { ImageListPanel } from './components/ImageListPanel';
import { PreviewStage } from './components/PreviewStage';
import { SettingsPanel } from './components/SettingsPanel';
import { ThumbStrip } from './components/ThumbStrip';
import { Drawer } from './components/Drawer';
import { DropOverlay } from './components/DropOverlay';
import { ExportDialog } from './components/ExportDialog';
import { Viewer, type ViewerState } from './components/Viewer';
import { Toaster } from './components/Toaster';
import { WeChatTip } from './components/WeChatTip';

const GITHUB_URL = 'https://github.com/hloolx/shuiyin';
const MOD = isMac ? '⌘' : 'Ctrl';
const SHORTCUTS: [string, string][] = [
  ['← / →', '切换图片'],
  ['按住 空格', '对比原图'],
  [`${MOD} + S`, '下载当前'],
  [`${MOD} + Shift + S`, '导出所选'],
  ['Delete', '移除当前'],
];

const spring = motionTokens.spring.smooth;
const fromLeft: Variants = { hidden: {}, show: {} };
const fromRight = fromLeft;
const fromTop = fromLeft;
const zoomIn = fromLeft;

const loadMotionFeatures = () => import('./lib/motion-features').then((mod) => mod.default);

const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e));
const shortName = (name: string) => (name.length > 18 ? `${name.slice(0, 16)}…` : name);

function ThemeButton({ theme, onToggle }: { theme: 'light' | 'dark'; onToggle: () => void }) {
  return <Button variant="secondary" size="icon" onClick={onToggle} aria-pressed={theme === 'dark'}
    aria-label={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}>
    {theme === 'dark' ? <Moon size={16} aria-hidden /> : <Sun size={16} aria-hidden />}
  </Button>;
}
function GithubLink() {
  return (
    <a
      href={GITHUB_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GitHub 开源地址"
      title="GitHub"
      className="flex h-11 w-11 items-center justify-center rounded-xl text-foreground-secondary transition-colors hover:bg-surface-2 hover:text-foreground"
    >
      <Github className="h-[18px] w-[18px]" />
    </a>
  );
}

/** 导出数量保持稳定占位。 */
function CountBadge({ value }: { value: number }) { return <span className="count-badge">{value}</span>; }

function Credits() {
  return (
    <>
      v{APP_VERSION} · GPL-3.0 · 基于{' '}
      <a className="underline-offset-2 hover:underline" href="https://github.com/joyqi/sfz" target="_blank" rel="noopener noreferrer">
        joyqi/sfz
      </a>{' '}
      · 作者{' '}
      <a className="underline-offset-2 hover:underline" href="https://github.com/hloolx" target="_blank" rel="noopener noreferrer">
        阿懒同学
      </a>
    </>
  );
}

function SidebarFooter() {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-border px-4 py-3">
      <AnimatePresence initial={false}>
        {open && (
          <m.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {SHORTCUTS.map(([keys, desc]) => (
              <li key={desc} className="flex items-center justify-between py-1 text-xs text-foreground-secondary">
                <span>{desc}</span>
                <kbd className="rounded-md border border-border bg-surface-2 px-1.5 py-0.5 font-sans text-xs text-foreground-tertiary">
                  {keys}
                </kbd>
              </li>
            ))}
            <li className="h-2" />
          </m.ul>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-md text-xs text-foreground-tertiary transition-colors hover:text-foreground"
      >
        <Keyboard className="h-3.5 w-3.5" />
        {open ? '收起快捷键' : '键盘快捷键'}
      </button>
      <p className="mt-2 text-xs leading-relaxed text-foreground-tertiary">
        <Credits />
      </p>
    </div>
  );
}

export default function App() {
  const isDesktop = useIsDesktop();
  const touch = !useCanHover();
  const { theme, toggle: toggleTheme } = useTheme();

  const [settings, setSettings] = usePersistentState<WatermarkSettings>(
    STORAGE_KEYS.settings,
    DEFAULT_SETTINGS,
    sanitizeSettings
  );
  const [exportOptions, setExportOptions] = usePersistentState<ExportOptions>(
    STORAGE_KEYS.export,
    DEFAULT_EXPORT,
    sanitizeExport
  );

  const store = useImageStore({
    onDecodeError: (names) =>
      toast.error(`${names.length} 张图片无法读取，已跳过`, {
        description: names.slice(0, 3).join('、') + (names.length > 3 ? ' 等' : ''),
      }),
  });
  const { items, current, currentIndex, selected, remove, restore, finalize, setCurrent, toggle, selectAll, step } = store;
  const hasImages = items.length > 0;

  const [compare, setCompare] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [viewer, setViewer] = useState<ViewerState | null>(null);
  const viewerToken = useRef(0);

  const pickerRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const gifWarned = useRef(false);

  const updateSettings = useCallback(
    (patch: Partial<WatermarkSettings>) => setSettings((s) => ({ ...s, ...patch })),
    [setSettings]
  );
  const updateExport = useCallback(
    (patch: Partial<ExportOptions>) => setExportOptions((o) => ({ ...o, ...patch })),
    [setExportOptions]
  );
  const resetSettings = () => {
    const prev = settings;
    setSettings(DEFAULT_SETTINGS);
    toast('已恢复默认设置', { action: { label: '撤销', onClick: () => setSettings(prev) } });
  };

  // ---------- 添加 / 移除 ----------
  const storeAdd = store.addFiles;
  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const list = Array.from(files);
      const { added, rejected } = storeAdd(list);
      if (rejected.length) {
        toast.warning(`已忽略 ${rejected.length} 个不支持的文件`, {
          description: rejected.slice(0, 3).join('、') + (rejected.length > 3 ? ' 等' : ''),
        });
      }
      if (added && hasImages) toast.success(`已添加 ${added} 张图片`);
      if (!gifWarned.current && list.some((f) => f.type === 'image/gif')) {
        gifWarned.current = true;
        toast('GIF 动图导出后只保留第一帧', { description: '如需保留动画，请使用专门的动图工具' });
      }
    },
    [storeAdd, hasImages]
  );

  const dragging = useFileDrop(addFiles);
  const pick = () => pickerRef.current?.click();
  const openCamera = () => cameraRef.current?.click();

  const removeImages = useCallback(
    (ids: string[], message: string) => {
      const removed = remove(ids);
      if (!removed) return;
      let undone = false;
      toast(message, {
        duration: 5000,
        action: {
          label: '撤销',
          onClick: () => {
            undone = true;
            restore(removed);
          },
        },
        onClose: () => {
          if (!undone) finalize(removed);
        },
      });
    },
    [remove, restore, finalize]
  );

  const removeOne = (id: string) => {
    const item = items.find((it) => it.id === id);
    if (item) removeImages([id], `已移除「${shortName(item.name)}」`);
  };
  const clearAll = () => {
    setDrawerOpen(false);
    removeImages(
      items.map((it) => it.id),
      `已清空 ${items.length} 张图片`
    );
  };

  // ---------- 查看 / 下载 / 导出 ----------
  const openViewer = useCallback(async () => {
    if (!current) return;
    const token = ++viewerToken.current;
    setViewer({ url: null, name: current.name, blob: null });
    try {
      const { blob, name } = await renderImage(current, settings, exportOptions);
      if (token !== viewerToken.current) return;
      // 微信长按识别不了 blob: 地址，改用 data URL
      const url = isWeChat ? await blobToDataURL(blob) : URL.createObjectURL(blob);
      if (token !== viewerToken.current) {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
        return;
      }
      setViewer({ url, name, blob });
    } catch (e) {
      if (token !== viewerToken.current) return;
      setViewer(null);
      toast.error('生成图片失败', { description: errMsg(e) });
    }
  }, [current, settings, exportOptions]);

  const closeViewer = useCallback(() => {
    viewerToken.current++;
    if (viewer?.url?.startsWith('blob:')) URL.revokeObjectURL(viewer.url);
    setViewer(null);
  }, [viewer]);

  const downloadCurrent = useCallback(async () => {
    if (!current) return;
    // 触屏设备走大图查看器：可长按保存或调用系统分享存入相册
    if (touch || isWeChat) {
      void openViewer();
      return;
    }
    try {
      await downloadImage(current, settings, exportOptions);
    } catch (e) {
      toast.error('下载失败', { description: errMsg(e) });
    }
  }, [current, touch, openViewer, settings, exportOptions]);

  const exportSelected = useCallback(async () => {
    if (abortRef.current) return;
    if (!selected.length) {
      toast.warning('还没有勾选要导出的图片');
      return;
    }
    if (isWeChat) {
      toast.warning('微信内无法下载文件', { description: '请点右上角「···」选择在浏览器打开后再导出' });
      return;
    }
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setProgress({ phase: 'render', current: 0, total: selected.length, name: '', ratio: 0 });
    try {
      await exportImages(selected, settings, exportOptions, setProgress, ctrl.signal);
      // 留一点时间展示完成动画
      await new Promise((r) => setTimeout(r, 900));
      toast.success(selected.length > 1 ? `已导出 ${selected.length} 张图片` : '图片已导出');
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') toast('已取消导出');
      else toast.error('导出失败，请重试', { description: errMsg(e) });
    } finally {
      abortRef.current = null;
      setProgress(null);
    }
  }, [selected, settings, exportOptions]);

  useHotkeys(
    {
      prev: () => step(-1),
      next: () => step(1),
      remove: () => current && removeOne(current.id),
      download: downloadCurrent,
      exportAll: exportSelected,
      compare: setCompare,
    },
    hasImages && !progress && !viewer && !drawerOpen
  );

  // ---------- 视图 ----------
  const currentMeta = current
    ? [current.width ? `${current.width}×${current.height}` : null, formatBytes(current.file.size)].filter(Boolean).join(' · ')
    : '';

  const listPanelProps = {
    items,
    currentId: store.currentId,
    selectedCount: selected.length,
    onToggle: toggle,
    onSelectAll: selectAll,
    onRemove: removeOne,
    onClear: clearAll,
  };

  const stageProps = {
    item: current,
    index: currentIndex,
    total: items.length,
    settings,
    compare,
    onCompareChange: setCompare,
    onPrev: () => step(-1),
    onNext: () => step(1),
    onView: openViewer,
    onDownload: downloadCurrent,
  };

  const settingsPanel = (
    <SettingsPanel
      settings={settings}
      onChange={updateSettings}
      onReset={resetSettings}
      exportOptions={exportOptions}
      onExportChange={updateExport}
    />
  );

  let view;
  if (!hasImages) {
    view = (
      <m.div
        key="landing"
        className="landing-shell"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.18 } }}
      >
        <header className="landing-header">
          <Brand />
          <div className="flex items-center gap-1">
            <ThemeButton theme={theme} onToggle={toggleTheme} />
            <GithubLink />
          </div>
        </header>
        <main>
          <Landing onPick={pick} onFiles={addFiles} onCamera={openCamera} showCamera={touch} />
        </main>
        <footer className="pb-safe">
          <p className="px-4 py-5 text-center text-xs text-foreground-tertiary">
            <Credits />
          </p>
        </footer>
      </m.div>
    );
  } else if (isDesktop) {
    view = (
      <m.div key="editor-desktop" className="flex h-dvh overflow-hidden" initial="hidden" animate="show" exit={{ opacity: 0 }}>
        <m.aside variants={fromLeft} className="editor-sidebar">
          <div className="flex h-[76px] shrink-0 items-center border-b border-border px-5">
            <Brand />
          </div>
          <ImageListPanel {...listPanelProps} layoutKey="sidebar" onSelect={setCurrent} onAdd={pick} />
          <SidebarFooter />
        </m.aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <m.header
            variants={fromTop}
            className="editor-toolbar"
          >
            <div className="min-w-0 flex-1">
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={current?.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                >
                  <h1 className="truncate text-sm font-medium text-foreground">{current?.name}</h1>
                  <p className="tabular truncate text-xs text-foreground-tertiary">
                    {currentMeta} · 第 {currentIndex + 1} / {items.length} 张
                  </p>
                </m.div>
              </AnimatePresence>
            </div>
            <ThemeButton theme={theme} onToggle={toggleTheme} />
            <GithubLink />
            <span className="mx-1 h-6 w-px bg-border" />
            <Button variant="outline" onClick={downloadCurrent} disabled={!current} title={`下载当前（${MOD}+S）`}>
              <Download className="h-4 w-4" />
              下载当前
            </Button>
            <Button
              variant="primary"
              onClick={exportSelected}
              disabled={!selected.length || Boolean(progress)}
              title={`导出所有勾选的图片（${MOD}+Shift+S）`}
            >
              <FileArchive className="h-4 w-4" />
              导出所选
              <CountBadge value={selected.length} />
            </Button>
          </m.header>

          <main className="editor-body">
            <m.div variants={zoomIn} className="min-w-0 flex-1">
              <PreviewStage {...stageProps} swipe={false} className="h-full" />
            </m.div>
            <m.aside
              variants={fromRight}
              aria-label="水印设置"
              className="editor-inspector"
            >
              {settingsPanel}
            </m.aside>
          </main>
        </div>
      </m.div>
    );
  } else {
    view = (
      <m.div
        key="editor-mobile"
        className="mobile-editor min-h-dvh pb-[calc(5rem+env(safe-area-inset-bottom))]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <header className="sticky top-0 z-30 flex h-14 items-center gap-1 border-b border-border bg-surface/85 px-2 backdrop-blur-xl">
          <Button variant="ghost" onClick={() => setDrawerOpen(true)} aria-label={`打开图片列表（${items.length} 张）`}>
            <Menu className="h-5 w-5" />
            <CountBadge value={items.length} />
          </Button>
          <div className="min-w-0 flex-1 px-1">
            <h1 className="truncate text-sm font-medium text-foreground">{current?.name}</h1>
            <p className="tabular truncate text-xs text-foreground-tertiary">{currentMeta}</p>
          </div>
          <ThemeButton theme={theme} onToggle={toggleTheme} />
          <Button variant="ghost" size="icon" onClick={pick} aria-label="添加图片">
            <Plus className="h-5 w-5" />
          </Button>
        </header>

        <main>
        <div className="sticky top-14 z-20 bg-background px-3 pt-3">
          <PreviewStage {...stageProps} swipe className="h-[min(46vh,440px)]" />
        </div>
        <ThumbStrip items={items} currentId={store.currentId} onSelect={setCurrent} onAdd={pick} />

        <m.div
          className="mx-3 overflow-hidden rounded-3xl border border-border bg-surface shadow-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.08 }}
        >
          {settingsPanel}
        </m.div>
        <p className="px-4 py-6 text-center text-xs text-foreground-tertiary">
          <Credits />
        </p>
        </main>

        <m.div
          className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/90 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl"
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          transition={{ ...spring, delay: 0.12 }}
        >
          <div className="flex gap-2">
            <Button variant="outline" size="lg" className="flex-1 px-3" onClick={downloadCurrent} disabled={!current}>
              <Download className="h-5 w-5" />
              保存当前
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-[1.4] px-3"
              onClick={exportSelected}
              disabled={!selected.length || Boolean(progress)}
            >
              <FileArchive className="h-5 w-5" />
              导出所选
              <CountBadge value={selected.length} />
            </Button>
          </div>
        </m.div>

        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <ImageListPanel
            {...listPanelProps}
            layoutKey="drawer"
            onSelect={(id) => {
              setCurrent(id);
              setDrawerOpen(false);
            }}
            onAdd={() => {
              setDrawerOpen(false);
              pick();
            }}
          />
        </Drawer>
      </m.div>
    );
  }

  return (
    <LazyMotion features={loadMotionFeatures}>
      <MotionConfig reducedMotion="user">
        {isWeChat && <WeChatTip />}
        <AnimatePresence mode="wait" initial={false}>
          {view}
        </AnimatePresence>

        <input
          ref={pickerRef}
          type="file"
          // 移动端用 image/* 才会直接打开相册
          accept={touch ? 'image/*' : ACCEPT_TYPES}
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = '';
          }}
        />
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = '';
          }}
        />

        <DropOverlay visible={dragging} />
        <ExportDialog progress={progress} onCancel={() => abortRef.current?.abort()} />
        <Viewer
          state={viewer}
          onClose={closeViewer}
          onDownload={() => viewer?.blob && saveAs(viewer.blob, viewer.name)}
          touch={touch}
          wechat={isWeChat}
        />
        <Toaster />
      </MotionConfig>
    </LazyMotion>
  );
}
