import { m } from 'motion/react';
import { useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';
import type { ImageItem } from '../types';
import { cn } from '../lib/utils';
import { motionTokens } from './arc/lib/motion-tokens';

interface ThumbStripProps {
  items: ImageItem[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
}

/** 移动端横向缩略图条，快速切换当前图片 */
export function ThumbStrip({ items, currentId, onSelect, onAdd }: ThumbStripProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // 当前图横向滚动到中间（不用 scrollIntoView，避免带动整页纵向滚动）
  useEffect(() => {
    const list = listRef.current;
    const el = list?.querySelector<HTMLElement>(`[data-id="${currentId}"]`);
    if (!list || !el) return;
    list.scrollTo({ left: el.offsetLeft - list.clientWidth / 2 + el.clientWidth / 2, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }, [currentId]);

  return (
    <div ref={listRef} className="no-scrollbar relative flex gap-2 overflow-x-auto px-3 py-2">
      {items.map((item) => {
        const active = item.id === currentId;
        return (
          <button
            key={item.id}
            data-id={item.id}
            type="button"
            aria-label={item.name}
            aria-current={active}
            onClick={() => onSelect(item.id)}
            className="relative h-14 w-14 shrink-0 rounded-xl p-[3px]"
          >
            {active && (
              <m.span
                layoutId="thumb-active"
                className="absolute inset-0 rounded-xl border-2 border-primary"
                transition={motionTokens.spring.smooth}
              />
            )}
            <span className={cn('block h-full w-full overflow-hidden rounded-lg bg-surface-2', !item.selected && 'opacity-40')}>
              {item.thumb ? (
                <img src={item.thumb} alt="" draggable={false} className="h-full w-full object-cover" />
              ) : (
                <span className="skeleton block h-full w-full" />
              )}
            </span>
          </button>
        );
      })}
      <button
        type="button"
        aria-label="添加图片"
        onClick={onAdd}
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-dashed border-border-strong text-foreground-tertiary transition-colors active:bg-surface-2"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  );
}
