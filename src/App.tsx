import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Github, 
  Sparkles,
  Zap,
  Shield,
  Download,
  FileArchive,
  Images,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Upload
} from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { SidebarImageList } from './components/SidebarImageList';
import { WatermarkSettings } from './components/WatermarkSettings';
import { PreviewCanvas, GlobalDragOverlay } from './components/PreviewCanvas';
import { ProgressModal } from './components/ProgressModal';
import { useImageManager } from './hooks/useImageManager';
import { useWatermark } from './hooks/useWatermark';
import { useTouchGesture } from './hooks/useTouchGesture';
import { useGlobalFileHandler, usePasteHandler } from './hooks/useGlobalFileHandler';
import type { ProgressState } from './types';
import { downloadCanvas, downloadMultipleAsZip } from './utils/download';
import { generateFileName } from './utils/canvas';

function App() {
  const imageManager = useImageManager();
  const watermark = useWatermark(imageManager.currentImage);
  const [showUpload, setShowUpload] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [progress, setProgress] = useState<ProgressState>({
    isOpen: false,
    current: 0,
    total: 0,
    fileName: '',
  });

  // 全局文件处理
  const handleFilesSelect = useCallback((files: FileList | File[]) => {
    imageManager.addImages(files);
    setShowUpload(false);
  }, [imageManager]);

  // 全局拖入处理
  const { isDragging: isGlobalDragging } = useGlobalFileHandler({
    onFilesSelect: handleFilesSelect,
    disabled: false,
  });

  // 粘贴处理
  usePasteHandler({
    onFilesSelect: handleFilesSelect,
    disabled: false,
  });

  // 检测移动端
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // 切换侧边栏
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // 关闭侧边栏（移动端）
  const closeSidebar = () => {
    if (isMobile) setSidebarOpen(false);
  };

  // 切换到上一张图片
  const goToPrevImage = useCallback(() => {
    if (imageManager.currentIndex > 0) {
      imageManager.selectImage(imageManager.currentIndex - 1);
    }
  }, [imageManager]);

  // 切换到下一张图片
  const goToNextImage = useCallback(() => {
    if (imageManager.currentIndex < imageManager.images.length - 1) {
      imageManager.selectImage(imageManager.currentIndex + 1);
    }
  }, [imageManager]);

  // 手势支持 - 仅在移动端启用
  const swipeRef = useTouchGesture(({ direction }) => {
    if (!isMobile) return;
    if (direction === 'right' && imageManager.currentIndex > 0) {
      goToPrevImage();
    } else if (direction === 'left' && imageManager.currentIndex < imageManager.images.length - 1) {
      goToNextImage();
    }
  }, { threshold: 50 });

  // 预览区域引用
  const previewRef = useRef<HTMLDivElement>(null);
  // 文件输入引用（用于二次上传）
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex min-h-screen bg-background">
      {/* 移动端遮罩层 */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* 左侧边栏 */}
      <aside 
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-border bg-surface transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo区域 */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-4 lg:px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-foreground truncate">水印工具</h1>
            <p className="text-xs text-muted-foreground">Clean & Simple</p>
          </div>
          {/* 移动端关闭按钮 */}
          {isMobile && (
            <button 
              onClick={closeSidebar}
              className="p-2 rounded-lg hover:bg-foreground/5"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* 图片列表区域 */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {!hasImages ? (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground/5">
                <Images className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm font-medium text-foreground-secondary">暂无图片</p>
              <p className="mt-1 text-xs text-muted-foreground">上传图片开始处理</p>
            </div>
          ) : (
            <>
              {/* 侧边栏添加图片按钮 */}
              <div className="p-3 border-b border-border">
                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                    if (isMobile) closeSidebar();
                  }}
                  className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-primary/10 text-primary text-sm font-medium transition-all hover:bg-primary/20 active:scale-95"
                >
                  <Upload className="h-4 w-4" />
                  <span>添加更多图片</span>
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <SidebarImageList
                  images={imageManager.images}
                  currentIndex={imageManager.currentIndex}
                  onSelect={(index) => {
                    imageManager.selectImage(index);
                    closeSidebar();
                  }}
                  onRemove={imageManager.removeImage}
                  onToggleSelection={imageManager.toggleImageSelection}
                  onClearAll={imageManager.clearAll}
                />
              </div>
            </>
          )}
        </div>

        {/* 特色标签 - 桌面端显示 */}
        <div className="hidden lg:block border-t border-border p-4">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Zap className="h-3.5 w-3.5 flex-shrink-0" />
              <span>完全本地处理，数据不上传</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5 flex-shrink-0" />
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
            v1.0.2 · GPL-3.0 · 阿懒同学
          </p>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen && !isMobile ? 'lg:ml-72' : ''}`}>
        {/* 顶部栏 */}
        <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center justify-between border-b border-border bg-surface/80 px-4 sm:px-6 lg:px-8 backdrop-blur-xl">
          <div className="flex items-center gap-3 min-w-0">
            {/* 移动端菜单按钮 */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-foreground/5 transition-colors"
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Menu className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-foreground truncate">批量图片水印工具</h2>
              <p className="hidden sm:block text-xs text-muted-foreground truncate">安全、高效、简洁的本地水印处理方案</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {hasImages && (
              <>
                {/* 添加图片按钮 - 二次上传入口 */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex h-9 sm:h-10 items-center gap-1.5 sm:gap-2 rounded-xl bg-primary/10 px-3 sm:px-4 text-sm font-medium text-primary transition-all hover:bg-primary/20"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">添加图片</span>
                  <span className="sm:hidden">添加</span>
                </button>
                
                <div className="w-px h-6 bg-border mx-1 hidden sm:block" />

                <button
                  onClick={handleDownloadSelected}
                  disabled={selectedCount === 0}
                  className="inline-flex h-9 sm:h-10 items-center gap-1.5 sm:gap-2 rounded-xl bg-foreground/5 px-3 sm:px-4 text-sm font-medium text-foreground transition-all hover:bg-foreground/10 disabled:opacity-40"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">下载选中</span>
                  <span className="sm:hidden">下载</span>
                  {selectedCount > 0 && (
                    <span className="rounded-full bg-foreground/10 px-1.5 py-0.5 text-xs">
                      {selectedCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={handleDownloadAll}
                  disabled={selectedCount === 0}
                  className="inline-flex h-9 sm:h-10 items-center gap-1.5 sm:gap-2 rounded-xl border border-border bg-transparent px-3 sm:px-4 text-sm font-medium text-foreground transition-all hover:bg-foreground/5 hover:border-border-hover disabled:opacity-40"
                >
                  <FileArchive className="h-4 w-4" />
                  <span className="hidden sm:inline">导出 ZIP</span>
                  <span className="sm:hidden">ZIP</span>
                </button>
              </>
            )}
          </div>
        </header>

        {/* 内容区域 */}
        <div className="p-4 sm:p-6 lg:p-8 pb-safe">
          <div className="mx-auto max-w-5xl">
            {/* 上传区域 - 没有图片时显示 */}
            {(showUpload || !hasImages) && (
              <div className="mb-6 lg:mb-8">
                <ImageUpload onFilesSelect={handleFilesSelect} />
              </div>
            )}

            {/* 有图片时的布局 */}
            {hasImages && (
              <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-[340px_1fr] xl:grid-cols-[380px_1fr]">
                {/* 左侧：水印设置 */}
                <WatermarkSettings
                  settings={watermark.settings}
                  onSettingsChange={watermark.updateSettings}
                />

                {/* 右侧：预览 */}
                <div 
                  ref={(el) => {
                    previewRef.current = el;
                    if (isMobile) swipeRef(el);
                  }}
                  className="relative"
                >
                  {/* 移动端图片切换提示 */}
                  {isMobile && imageManager.images.length > 1 && (
                    <div className="absolute top-2 left-0 right-0 z-10 flex justify-between px-2 pointer-events-none">
                      {imageManager.currentIndex > 0 && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground bg-surface/80 backdrop-blur-sm px-2 py-1 rounded-full">
                          <ChevronLeft className="h-3 w-3" />
                          左滑上一张
                        </div>
                      )}
                      {imageManager.currentIndex < imageManager.images.length - 1 && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground bg-surface/80 backdrop-blur-sm px-2 py-1 rounded-full ml-auto">
                          右滑下一张
                          <ChevronRight className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  )}
                  
                  <PreviewCanvas
                    canvas={watermark.previewCanvas}
                    isLoading={watermark.isLoading}
                    onDownload={handleDownloadCurrent}
                  />

                  {/* 移动端底部导航按钮 */}
                  {isMobile && imageManager.images.length > 1 && (
                    <div className="flex items-center justify-between mt-3 gap-2">
                      <button
                        onClick={goToPrevImage}
                        disabled={imageManager.currentIndex === 0}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-foreground/5 text-sm text-foreground-secondary disabled:opacity-30 active:scale-95 transition-all"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        上一张
                      </button>
                      <span className="text-sm text-muted-foreground">
                        {imageManager.currentIndex + 1} / {imageManager.images.length}
                      </span>
                      <button
                        onClick={goToNextImage}
                        disabled={imageManager.currentIndex === imageManager.images.length - 1}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-foreground/5 text-sm text-foreground-secondary disabled:opacity-30 active:scale-95 transition-all"
                      >
                        下一张
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <ProgressModal progress={progress} />
      
      {/* 全局拖入遮罩 */}
      <GlobalDragOverlay isVisible={isGlobalDragging} />
      
      {/* 移动端悬浮添加按钮 */}
      {hasImages && isMobile && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="fixed right-4 bottom-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition-all active:scale-90 hover:scale-105"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          aria-label="添加图片"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}
      
      {/* 二次上传文件输入 - 支持多选，不包含 capture 属性 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFilesSelect(e.target.files);
            e.target.value = '';
          }
        }}
      />
    </div>
  );
}

export default App;
