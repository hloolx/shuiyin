import { useState } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { ImageList } from './components/ImageList';
import { WatermarkSettings } from './components/WatermarkSettings';
import { PreviewCanvas } from './components/PreviewCanvas';
import { DownloadButtons } from './components/DownloadButtons';
import { ProgressModal } from './components/ProgressModal';
import { Footer } from './components/Footer';
import { useImageManager } from './hooks/useImageManager';
import { useWatermark } from './hooks/useWatermark';
import type { ProgressState } from './types';
import { downloadCanvas, downloadMultipleAsZip } from './utils/download';
import { generateFileName } from './utils/canvas';

function App() {
  const imageManager = useImageManager();
  const watermark = useWatermark(imageManager.currentImage);
  const [progress, setProgress] = useState<ProgressState>({
    isOpen: false,
    current: 0,
    total: 0,
    fileName: '',
  });

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

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[350px_1fr]">
          {/* 左侧面板 */}
          <div className="space-y-6">
            <ImageUpload onFilesSelect={imageManager.addImages} />
            <ImageList
              images={imageManager.images}
              currentIndex={imageManager.currentIndex}
              onSelect={imageManager.selectImage}
              onRemove={imageManager.removeImage}
              onToggleSelection={imageManager.toggleImageSelection}
              onSelectAll={imageManager.selectAll}
              onDeselectAll={imageManager.deselectAll}
              onClearAll={imageManager.clearAll}
            />
          </div>

          {/* 右侧面板 */}
          <div className="space-y-6">
            <WatermarkSettings
              settings={watermark.settings}
              onSettingsChange={watermark.updateSettings}
            />

            <PreviewCanvas
              canvas={watermark.previewCanvas}
              isLoading={watermark.isLoading}
              onDownload={handleDownloadCurrent}
            />

            <DownloadButtons
              hasCurrentImage={imageManager.currentImage !== null}
              hasSelectedImages={imageManager.selectedImages.length > 0}
              selectedCount={imageManager.selectedImages.length}
              onDownloadCurrent={handleDownloadCurrent}
              onDownloadSelected={handleDownloadSelected}
              onDownloadAll={handleDownloadAll}
            />
          </div>
        </div>
      </main>

      <Footer />

      <ProgressModal progress={progress} />
    </div>
  );
}

export default App;
