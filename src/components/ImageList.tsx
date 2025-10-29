import { Trash2, CheckSquare, Square } from 'lucide-react';
import type { ImageFile } from '../types';
import { formatFileSize } from '../utils/canvas';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

interface ImageListProps {
  images: ImageFile[];
  currentIndex: number;
  onSelect: (index: number) => void;
  onRemove: (id: string) => void;
  onToggleSelection: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onClearAll: () => void;
}

export function ImageList({
  images,
  currentIndex,
  onSelect,
  onRemove,
  onToggleSelection,
  onSelectAll,
  onDeselectAll,
  onClearAll,
}: ImageListProps) {
  if (images.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-sm text-gray-500">还没有上传图片</p>
          <p className="mt-1 text-xs text-gray-400">请点击上方区域上传图片</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>图片列表 ({images.length})</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={onSelectAll}>
              全选
            </Button>
            <Button size="sm" variant="secondary" onClick={onDeselectAll}>
              取消
            </Button>
            <Button size="sm" variant="secondary" onClick={onClearAll}>
              清空
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[500px] space-y-2 overflow-y-auto">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={cn(
                'flex items-center gap-3 rounded-lg border p-3 transition-colors',
                currentIndex === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              )}
            >
              {/* 复选框 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSelection(image.id);
                }}
                className="flex-shrink-0 text-gray-400 hover:text-blue-600"
              >
                {image.selected ? (
                  <CheckSquare className="h-5 w-5 text-blue-600" />
                ) : (
                  <Square className="h-5 w-5" />
                )}
              </button>

              {/* 缩略图 */}
              <button
                onClick={() => onSelect(index)}
                className="flex flex-1 items-center gap-3 text-left"
              >
                <img
                  src={image.preview}
                  alt={image.file.name}
                  className="h-14 w-14 rounded object-cover"
                />
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {image.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(image.file.size)}
                  </p>
                </div>
              </button>

              {/* 删除按钮 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(image.id);
                }}
                className="flex-shrink-0 rounded p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
