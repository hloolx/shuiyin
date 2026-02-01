import { Trash2, CheckSquare, Square, Images } from 'lucide-react';
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
  const selectedCount = images.filter(img => img.selected).length;

  if (images.length === 0) {
    return (
      <Card className="flex h-[400px] flex-col items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground/5">
          <Images className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="mt-4 text-sm font-medium text-foreground-secondary">还没有上传图片</p>
        <p className="mt-1 text-xs text-muted-foreground">请在上方区域上传图片</p>
      </Card>
    );
  }

  return (
    <Card className="flex h-[calc(100vh-280px)] min-h-[500px] flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            图片列表
            <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs font-normal text-muted-foreground">
              {images.length}
            </span>
          </CardTitle>
          
          {/* 批量操作 */}
          <div className="flex items-center gap-1">
            {selectedCount > 0 && (
              <span className="mr-2 text-xs text-muted-foreground">
                已选 {selectedCount}
              </span>
            )}
            <Button size="icon" variant="ghost" onClick={onSelectAll} title="全选">
              <CheckSquare className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={onDeselectAll} title="取消选择">
              <Square className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={onClearAll} title="清空">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden px-4 pb-4">
        <div className="h-full space-y-2 overflow-y-auto pr-2">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={cn(
                'group flex items-center gap-3 rounded-xl border p-3 transition-all duration-200',
                currentIndex === index
                  ? 'border-primary/30 bg-primary/5'
                  : 'border-border bg-surface hover:border-border-hover hover:bg-foreground/[0.02]'
              )}
            >
              {/* 复选框 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSelection(image.id);
                }}
                className="flex-shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-primary"
              >
                {image.selected ? (
                  <CheckSquare className="h-5 w-5 text-primary" />
                ) : (
                  <Square className="h-5 w-5" />
                )}
              </button>

              {/* 缩略图和信息 */}
              <button
                onClick={() => onSelect(index)}
                className="flex flex-1 items-center gap-3 text-left"
              >
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-background">
                  <img
                    src={image.preview}
                    alt={image.file.name}
                    className="h-full w-full object-cover"
                  />
                  {currentIndex === index && (
                    <div className="absolute inset-0 ring-2 ring-inset ring-primary/30" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {image.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
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
                className="flex-shrink-0 rounded-lg p-2 text-muted-foreground opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
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
