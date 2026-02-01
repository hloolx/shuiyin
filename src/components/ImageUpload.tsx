import { useRef, useState, useEffect } from 'react';
import type { DragEvent } from 'react';
import { Upload, ImagePlus, FolderOpen } from 'lucide-react';

interface ImageUploadProps {
  onFilesSelect: (files: FileList | File[]) => void;
}

// 检测是否在 WeChat 浏览器中
const isWeChat = () => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('micromessenger') || ua.includes('wechat');
};



export function ImageUpload({ onFilesSelect }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isWeChatBrowser, setIsWeChatBrowser] = useState(false);

  useEffect(() => {
    setIsWeChatBrowser(isWeChat());
  }, []);

  const handleClick = () => {
    // 微信浏览器中，点击主区域调起相册（不带 capture）
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFilesSelect(files);
      // 重置 input 以允许重复选择相同文件
      e.target.value = '';
    }
  };

  // 调起相机（仅拍照）
  const handleCameraClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    cameraInputRef.current?.click();
  };

  // 调起相册（仅选择图片）
  const handleGalleryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    galleryInputRef.current?.click();
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFilesSelect(files);
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-dashed transition-all duration-300 ${
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-border-hover bg-surface'
      }`}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex cursor-pointer flex-col items-center justify-center p-6 sm:p-12">
        {/* 上传图标 */}
        <div className={`mb-4 sm:mb-6 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl transition-all duration-300 ${
          isDragging ? 'bg-primary/10' : 'bg-foreground/5'
        }`}>
          {isDragging ? (
            <ImagePlus className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          ) : (
            <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
          )}
        </div>

        {/* 文字说明 */}
        <h3 className="mb-1.5 sm:mb-2 text-sm sm:text-base font-semibold text-foreground text-center">
          {isDragging ? '释放以上传图片' : '点击或拖拽图片到此处'}
        </h3>
        <p className="mb-4 sm:mb-6 text-xs sm:text-sm text-muted-foreground text-center px-4">
          支持 PNG、JPEG、GIF、WebP 格式，可多选批量上传
        </p>

        {/* 选择按钮 */}
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-foreground/5 px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium text-foreground-secondary transition-all hover:bg-foreground/10 hover:text-foreground active:scale-95"
        >
          <FolderOpen className="h-4 w-4" />
          <span>选择图片</span>
        </button>

        {/* 
          主文件输入框 - 用于点击主区域和"选择图片"按钮
          注意：不包含 capture 属性，确保可以正常选择文件/相册
        */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        {/* 
          相机专用输入框 - 仅用于拍照
          包含 capture="environment"，强制调起相机
        */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* 
          相册专用输入框 - 仅用于选择图片
          微信浏览器：移除 multiple，避免微信的相册多选与 capture 冲突
          其他浏览器：保留 multiple 支持多选
        */}
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
          multiple={!isWeChatBrowser}
          className="hidden"
          onChange={handleFileChange}
        />

        {/* 移动端快捷按钮 - 在微信浏览器中分开显示拍照和相册按钮 */}
        <div className="mt-4 flex items-center gap-2 sm:hidden">
          {isWeChatBrowser ? (
            // 微信浏览器：两个按钮分开，避免 capture 属性冲突
            <>
              <button
                type="button"
                onClick={handleCameraClick}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium active:scale-95 transition-all"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                拍照
              </button>
              <span className="text-xs text-muted-foreground">或</span>
              <button
                type="button"
                onClick={handleGalleryClick}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-foreground/5 text-foreground-secondary text-xs font-medium active:scale-95 transition-all"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2z" />
                </svg>
                从相册选择
              </button>
            </>
          ) : (
            // 非微信浏览器：保持原有逻辑
            <>
              <button
                type="button"
                onClick={handleCameraClick}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium active:scale-95 transition-all"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                拍照
              </button>
              <span className="text-xs text-muted-foreground">或</span>
              <button
                type="button"
                onClick={handleGalleryClick}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-foreground/5 text-foreground-secondary text-xs font-medium active:scale-95 transition-all"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2z" />
                </svg>
                从相册选择
              </button>
            </>
          )}
        </div>
      </div>

      {/* 装饰性背景 */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300" />
    </div>
  );
}
