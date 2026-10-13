import { AnimatePresence, m } from 'motion/react';
import { ImagePlus, Trash2, X } from 'lucide-react';
import type { ImageItem } from '../types';
import { CheckMark } from './ui/CheckMark';
import { Button } from './ui/Button';
import { cn, formatBytes } from '../lib/utils';

interface ImageListPanelProps {
  items: ImageItem[];
  currentId: string | null;
  selectedCount: number;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  onSelectAll: (selected: boolean) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onAdd: () => void;
  /** 区分桌面侧栏与移动抽屉的高亮动画 */
  layoutKey: string;
}

export function ImageListPanel({
  items,
  currentId,
  selectedCount,
  onSelect,
  onToggle,
  onSelectAll,
  onRemove,
  onClear,
  onAdd,
  layoutKey,
}: ImageListPanelProps) {
  const allSelected = items.length > 0 && selectedCount === items.length;
  const someSelected = selectedCount > 0 && !allSelected;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-3 pt-3">
        <button
          type="button"
          onClick={onAdd}
          className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong text-sm font-medium text-foreground-secondary transition-colors hover:border-primary/60 hover:bg-primary/5 hover:text-primary"
        >
          <ImagePlus className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
          添加图片
        </button>
      </div>

      <div className="flex items-center justify-between px-3 pb-1 pt-3">
        <button
          type="button"
          role="checkbox"
          aria-checked={someSelected ? 'mixed' : allSelected}
          onClick={() => onSelectAll(!allSelected)}
          className="flex items-center gap-2 rounded-lg px-1.5 py-1 text-xs text-foreground-secondary transition-colors hover:bg-surface-2"
        >
          <CheckMark checked={allSelected} mixed={someSelected} />
          <span>
            全选 <span className="tabular text-foreground-tertiary">· 已选 {selectedCount}/{items.length}</span>
          </span>
        </button>
        <Button variant="danger" size="icon-sm" onClick={onClear} aria-label="清空全部图片" title="清空全部">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain px-2 pb-3 pt-1">
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((item, index) => {
            const active = item.id === currentId;
            return (
              <m.li
                key={item.id}
                layout
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0, transition: { delay: Math.min(index, 8) * 0.03 } }}
                exit={{ opacity: 0, x: -24, transition: { duration: 0.18 } }}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                className="group relative"
              >
                {active && (
                  <m.div
                    layoutId={`active-${layoutKey}`}
                    className="absolute inset-0 rounded-xl bg-primary/[0.08] ring-1 ring-inset ring-primary/25"
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
                <div className="relative flex items-center gap-2 rounded-xl p-1.5 pr-1">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={item.selected}
                    aria-label={`导出时包含 ${item.name}`}
                    onClick={() => onToggle(item.id)}
                    className="rounded-md p-1.5"
                  >
                    <CheckMark checked={item.selected} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelect(item.id)}
                    aria-current={active}
                    className={cn(
                      'flex min-w-0 flex-1 items-center gap-2.5 rounded-lg text-left',
                      !active && 'opacity-90 transition-opacity hover:opacity-100'
                    )}
                  >
                    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-surface-2 ring-1 ring-inset ring-border">
                      {item.thumb ? (
                        <m.img
                          src={item.thumb}
                          alt=""
                          draggable={false}
                          className="h-full w-full object-cover"
                          initial={{ opacity: 0, scale: 1.08 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      ) : (
                        <span className="skeleton absolute inset-0" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          'block truncate text-[13px] font-medium',
                          active ? 'text-foreground' : 'text-foreground-secondary'
                        )}
                        title={item.name}
                      >
                        {item.name}
                      </span>
                      <span className="tabular block truncate text-[11px] text-foreground-tertiary">
                        {item.width ? `${item.width}×${item.height} · ` : '读取中… · '}
                        {formatBytes(item.file.size)}
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label={`移除 ${item.name}`}
                    onClick={() => onRemove(item.id)}
                    className="rounded-lg p-1.5 text-foreground-tertiary transition-all hover:bg-danger/10 hover:text-danger [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:focus-visible:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </m.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
