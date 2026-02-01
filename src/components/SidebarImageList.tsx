import { Trash2, CheckSquare, Square, Images } from 'lucide-react';
import type { ImageFile } from '../types';
import { formatFileSize } from '../utils/canvas';
import { cn } from '../lib/utils';

interface SidebarImageListProps {
  images: ImageFile[];
  currentIndex: number;
  onSelect: (index: number) => void;
  onRemove: (id: string) => void;
  onToggleSelection: (id: string) => void;
  onClearAll: () => void;
}

export function SidebarImageList({
  images,
  currentIndex,
  onSelect,
  onRemove,
  onToggleSelection,
  onClearAll,
}: SidebarImageListProps) {
  const selectedCount = images.filter(img => img.selected).length;

  if (images.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground/5">
          <Images className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="mt-4 text-sm font-medium text-foreground-secondary">暂无图片</p>
        <p className="mt-1 text-xs text-muted-foreground">在右侧上传图片开始处理</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* 头部操作 */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">图片列表</span>
          <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs text-muted-foreground">
            {images.length}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          {selectedCount > 0 && (
            <span className="mr-2 text-xs text-muted-foreground">
              已选 {selectedCount}
            </span>
          )}
          <button
            onClick={() => images.forEach(img => !img.selected && onToggleSelection(img.id))}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
            title="全选"
          >
            <CheckSquare className="h-4 w-4" />
          </button>
          <button
            onClick={() => images.forEach(img => img.selected && onToggleSelection(img.id))}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
            title="取消选择"
          >
            <Square className="h-4 w-4" />
          </button>
          <button
            onClick={onClearAll}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500"
            title="清空"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 图片列表 */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={cn(
                'group flex items-center gap-2 rounded-xl border p-2 transition-all duration-200',
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
                className="flex-shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-primary"
              >
                {image.selected ? (
                  <CheckSquare className="h-4 w-4 text-primary" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
              </button>

              {/* 缩略图和信息 */}
              <button
                onClick={() => onSelect(index)}
                className="flex flex-1 items-center gap-2 text-left min-w-0"
              >
                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-background">
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
                  <p className="truncate text-xs font-medium text-foreground">
                    {image.file.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
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
                className="flex-shrink-0 rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
