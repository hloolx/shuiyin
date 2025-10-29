import { useRef, DragEvent } from 'react';
import { Upload } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface ImageUploadProps {
  onFilesSelect: (files: FileList | File[]) => void;
}

export function ImageUpload({ onFilesSelect }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFilesSelect(files);
    }
  };

  return (
    <Card className="mb-4">
      <div
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 transition-colors hover:border-gray-400"
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mb-4 h-12 w-12 text-gray-400" />
        <p className="mb-2 text-sm font-medium text-gray-700">
          点击或拖拽图片到此处上传
        </p>
        <p className="text-xs text-gray-500">支持 PNG、JPEG、GIF、WebP 格式</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      <div className="mt-4 text-center">
        <Button onClick={handleClick} size="sm">
          选择图片
        </Button>
      </div>
    </Card>
  );
}
