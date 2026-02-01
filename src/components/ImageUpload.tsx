import { useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { Upload, ImagePlus } from 'lucide-react';

interface ImageUploadProps {
  onFilesSelect: (files: FileList | File[]) => void;
}

export function ImageUpload({ onFilesSelect }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = () => {
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
      className={`relative overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 ${
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-border-hover bg-surface'
      }`}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex cursor-pointer flex-col items-center justify-center p-12">
        {/* 上传图标 */}
        <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${
          isDragging ? 'bg-primary/10' : 'bg-foreground/5'
        }`}>
          {isDragging ? (
            <ImagePlus className="h-8 w-8 text-primary" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
        </div>

        {/* 文字说明 */}
        <h3 className="mb-2 text-base font-semibold text-foreground">
          {isDragging ? '释放以上传图片' : '点击或拖拽图片到此处'}
        </h3>
        <p className="mb-6 text-sm text-muted-foreground">
          支持 PNG、JPEG、GIF、WebP 格式，可多选批量上传
        </p>

        {/* 选择按钮 */}
        <button
          type="button"
          className="rounded-xl bg-foreground/5 px-6 py-2.5 text-sm font-medium text-foreground-secondary transition-all hover:bg-foreground/10 hover:text-foreground"
        >
          选择图片
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* 装饰性背景 */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}
