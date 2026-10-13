import { AnimatePresence, m } from 'motion/react';
import { ImagePlus, Trash2, X } from 'lucide-react';
import type { ImageItem } from '../types';
import { Checkbox } from './arc/checkbox/checkbox';
import { Button } from './ui/Button';
import { formatBytes } from '../lib/utils';
import { motionTokens } from './arc/lib/motion-tokens';

interface ImageListPanelProps {
  items: ImageItem[]; currentId: string | null; selectedCount: number;
  onSelect: (id: string) => void; onToggle: (id: string) => void; onSelectAll: (selected: boolean) => void;
  onRemove: (id: string) => void; onClear: () => void; onAdd: () => void; layoutKey: string;
}
export function ImageListPanel({ items, currentId, selectedCount, onSelect, onToggle, onSelectAll, onRemove, onClear, onAdd }: ImageListPanelProps) {
  const all = items.length > 0 && selectedCount === items.length;
  return <div className="flex min-h-0 flex-1 flex-col">
    <div className="image-list-heading"><h2>图片 <span className="tabular text-foreground-secondary">{items.length}</span></h2>
      <Button variant="ghost" size="icon" onClick={onAdd} aria-label="添加图片"><ImagePlus size={20} strokeWidth={1.75} /></Button>
    </div>
    <div className="image-selection">
      <Checkbox checked={selectedCount && !all ? 'indeterminate' : all} onCheckedChange={() => onSelectAll(!all)}
        label={`全选 · 已选 ${selectedCount}`} />
      <Button variant="ghost" size="icon" onClick={onClear} aria-label="清空全部图片"><Trash2 size={16} /></Button>
    </div>
    <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 pb-4">
      <AnimatePresence initial={false}>
        {items.map(item => <m.li key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={motionTokens.spring.smooth} className="image-row" data-active={item.id === currentId}>
          <Checkbox checked={item.selected} onCheckedChange={() => onToggle(item.id)} aria-label={`导出时包含 ${item.name}`} />
          <button type="button" onClick={() => onSelect(item.id)} aria-current={item.id === currentId}
            className="image-row-select" title={item.name}>
            {item.thumb ? <img src={item.thumb} alt="" /> : <span className="skeleton h-12 w-11 shrink-0 rounded-lg" />}
            <span className="min-w-0 flex-1"><span className="image-name">{item.name}</span>
              <span className="image-meta tabular">{item.width ? `${item.width}×${item.height}` : '读取中…'}</span>
              <span className="image-meta tabular">{formatBytes(item.file.size)}</span></span>
          </button>
          <button type="button" className="image-remove" onClick={() => onRemove(item.id)} aria-label={`移除 ${item.name}`}><X size={16} /></button>
        </m.li>)}
      </AnimatePresence>
    </ul>
  </div>;
}
