import type { ExportProgress } from '../types';
import { Dialog, DialogContent } from './arc/dialog/dialog';
import { Progress } from './arc/progress/progress';
import { Button } from './ui/Button';
import { useOverlayFocus } from '../hooks/useOverlayFocus';
export function ExportDialog({ progress, onCancel }: { progress: ExportProgress | null; onCancel: () => void }) {
  const focus = useOverlayFocus();
  const done = progress?.phase === 'done';
  const title = done ? '导出完成' : progress?.phase === 'zip' ? '正在打包 ZIP' : '正在添加水印';
  return <Dialog open={Boolean(progress)} onOpenChange={open => { if (!open && !done) onCancel(); }}>
    <DialogContent {...focus} className="touch-overlay" title={title} description={done ? '文件已开始下载' : '图片在本机处理，请保持页面打开'}
      onPointerDownOutside={event => event.preventDefault()}>
      {progress && <div aria-live="polite">
        <p className="mb-6 truncate text-sm text-foreground-secondary">{progress.name || `共 ${progress.total} 张图片`}</p>
        <Progress value={progress.ratio * 100} label={done ? '已完成' : `已处理 ${progress.current} / ${progress.total}`} showValue />
        {!done && <div className="export-footer"><Button variant="secondary" onClick={onCancel}>取消导出</Button></div>}
      </div>}
    </DialogContent>
  </Dialog>;
}
