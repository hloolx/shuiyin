import { useState } from 'react';
import { 
  Github, 
  Sparkles,
  Zap,
  Shield,
  Download,
  FileArchive,
  Images
} from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { SidebarImageList } from './components/SidebarImageList';
import { WatermarkSettings } from './components/WatermarkSettings';
import { PreviewCanvas } from './components/PreviewCanvas';
import { ProgressModal } from './components/ProgressModal';
import { useImageManager } from './hooks/useImageManager';
import { useWatermark } from './hooks/useWatermark';
import type { ProgressState } from './types';
import { downloadCanvas, downloadMultipleAsZip } from './utils/download';
import { generateFileName } from './utils/canvas';

function App() {
  const imageManager = useImageManager();
  const watermark = useWatermark(imageManager.currentImage);
  const [showUpload, setShowUpload] = useState(true);
  const [progress, setProgress] = useState<ProgressState>({
    isOpen: false,
    current: 0,
    total: 0,
    fileName: '',
  });

  const handleFilesSelect = (files: FileList | File[]) => {
    imageManager.addImages(files);
    setShowUpload(false);
  };

  // 下载当前图片
  const handleDownloadCurrent = () => {
    if (!watermark.previewCanvas || !imageManager.currentImage) return;

    const fileName = generateFileName(imageManager.currentImage.file.name);
    downloadCanvas(watermark.previewCanvas, fileName);
  };

  // 下载选中的图片
  const handleDownloadSelected = async () => {
    const selectedImages = imageManager.selectedImages;
    if (selectedImages.length === 0) return;

    setProgress({
      isOpen: true,
      current: 0,
      total: selectedImages.length,
      fileName: '',
    });

    try {
      const canvases: HTMLCanvasElement[] = [];
      const fileNames: string[] = [];

      for (let i = 0; i < selectedImages.length; i++) {
        const image = selectedImages[i];
        setProgress({
          isOpen: true,
          current: i + 1,
          total: selectedImages.length,
          fileName: image.file.name,
        });

        const canvas = await watermark.generateCanvas(image);
        canvases.push(canvas);
        fileNames.push(image.file.name);
      }

      await downloadMultipleAsZip(canvases, fileNames);
    } catch (error) {
      console.error('Failed to download images:', error);
      alert('下载失败，请重试！');
    } finally {
      setProgress({
        isOpen: false,
        current: 0,
        total: 0,
        fileName: '',
      });
    }
  };

  // 导出全部为 ZIP
  const handleDownloadAll = async () => {
    const allImages = imageManager.images;
    if (allImages.length === 0) return;

    setProgress({
      isOpen: true,
      current: 0,
      total: allImages.length,
      fileName: '',
    });

    try {
      const canvases: HTMLCanvasElement[] = [];
      const fileNames: string[] = [];

      for (let i = 0; i < allImages.length; i++) {
        const image = allImages[i];
        setProgress({
          isOpen: true,
          current: i + 1,
          total: allImages.length,
          fileName: image.file.name,
        });

        const canvas = await watermark.generateCanvas(image);
        canvases.push(canvas);
        fileNames.push(image.file.name);
      }

      await downloadMultipleAsZip(canvases, fileNames);
    } catch (error) {
      console.error('Failed to download images:', error);
      alert('下载失败，请重试！');
    } finally {
      setProgress({
        isOpen: false,
        current: 0,
        total: 0,
        fileName: '',
      });
    }
  };

  const hasImages = imageManager.images.length > 0;
  const selectedCount = imageManager.selectedImages.length;

  return (
    <div className="flex min-h-screen bg-background">
      {/* 左侧边栏 */}
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-border bg-surface">
        {/* Logo区域 */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-foreground">水印工具</h1>
            <p className="text-xs text-muted-foreground">Clean & Simple</p>
          </div>
        </div>

        {/* 图片列表区域 */}
        <div className="flex-1 overflow-hidden">
          {!hasImages ? (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground/5">
                <Images className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm font-medium text-foreground-secondary">暂无图片</p>
              <p className="mt-1 text-xs text-muted-foreground">在右侧上传图片开始处理</p>
            </div>
          ) : (
            <SidebarImageList
              images={imageManager.images}
              currentIndex={imageManager.currentIndex}
              onSelect={imageManager.selectImage}
              onRemove={imageManager.removeImage}
              onToggleSelection={imageManager.toggleImageSelection}
              onClearAll={imageManager.clearAll}
            />
          )}
        </div>

        {/* 特色标签 */}
        <div className="border-t border-border p-4">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Zap className="h-3.5 w-3.5" />
              <span>完全本地处理，数据不上传</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5" />
              <span>隐私安全，断网也能使用</span>
            </div>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="border-t border-border p-4">
          <a
            href="https://github.com/hloolx/shuiyin"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            <span>开源项目</span>
          </a>
          <p className="mt-2 px-3 text-xs text-foreground-tertiary">
            v1.0.0 · GPL-3.0 · 阿懒同学
          </p>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="ml-72 flex-1">
        {/* 顶部栏 */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface/80 px-8 backdrop-blur-xl">
          <div>
            <h2 className="text-lg font-semibold text-foreground">批量图片水印工具</h2>
            <p className="text-xs text-muted-foreground">安全、高效、简洁的本地水印处理方案</p>
          </div>

          <div className="flex items-center gap-3">
            {hasImages && (
              <>
                <button
                  onClick={handleDownloadSelected}
                  disabled={selectedCount === 0}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-foreground/5 px-4 text-sm font-medium text-foreground transition-all hover:bg-foreground/10 disabled:opacity-40"
                >
                  <Download className="h-4 w-4" />
                  下载选中
                  {selectedCount > 0 && (
                    <span className="rounded-full bg-foreground/10 px-1.5 py-0.5 text-xs">
                      {selectedCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={handleDownloadAll}
                  disabled={selectedCount === 0}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-transparent px-4 text-sm font-medium text-foreground transition-all hover:bg-foreground/5 hover:border-border-hover disabled:opacity-40"
                >
                  <FileArchive className="h-4 w-4" />
                  导出 ZIP
                </button>
              </>
            )}
          </div>
        </header>

        {/* 内容区域 */}
        <div className="p-8">
          <div className="mx-auto max-w-5xl">
            {/* 上传区域 - 没有图片时显示 */}
            {(showUpload || !hasImages) && (
              <div className="mb-8">
                <ImageUpload onFilesSelect={handleFilesSelect} />
              </div>
            )}

            {/* 有图片时的布局 */}
            {hasImages && (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
                {/* 左侧：水印设置 */}
                <WatermarkSettings
                  settings={watermark.settings}
                  onSettingsChange={watermark.updateSettings}
                />

                {/* 右侧：预览 */}
                <PreviewCanvas
                  canvas={watermark.previewCanvas}
                  isLoading={watermark.isLoading}
                  onDownload={handleDownloadCurrent}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <ProgressModal progress={progress} />
    </div>
  );
}

export default App;
