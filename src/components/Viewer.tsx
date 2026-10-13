import { useState } from 'react';
import { Download, Loader2, Share2, ZoomIn, ZoomOut } from 'lucide-react';
import { Dialog, DialogContent } from './arc/dialog/dialog';
import { Button } from './ui/Button';
import { useOverlayFocus } from '../hooks/useOverlayFocus';

export interface ViewerState { url: string | null; name: string; blob: Blob | null; }
interface ViewerProps {
  state: ViewerState | null; onClose: () => void; onDownload: () => void; touch: boolean; wechat: boolean;
}
export function Viewer({ state, onClose, onDownload, touch, wechat }: ViewerProps) {
  const focus = useOverlayFocus();
  const [zoomed, setZoomed] = useState(false);
  const [lastState, setLastState] = useState(state);
  if (state !== lastState) { setLastState(state); setZoomed(false); }
  const shareFile = state?.blob ? new File([state.blob], state.name, { type: state.blob.type }) : null;
  const canShare = Boolean(touch && shareFile && navigator.canShare?.({ files: [shareFile] }));
  const share = async () => {
    if (!shareFile) return;
    try { await navigator.share({ files: [shareFile] }); } catch { /* Cancelled by the user. */ }
  };
  return <Dialog open={!!state} onOpenChange={open => { if (!open) onClose(); }}>
    <DialogContent {...focus} title="查看大图" description={state?.name ?? '原始分辨率预览'} className="touch-overlay" style={{ width: 'min(1120px, calc(100% - 32px))' }}>
      <div className="viewer-layout">
        <div className="viewer-image" data-zoomed={zoomed}>
          {state?.url ? <img src={state.url} alt={state.name} draggable={false} className="allow-callout" />
            : <div className="flex min-h-48 items-center gap-3 text-foreground-secondary" role="status">
              <Loader2 className="h-6 w-6 animate-spin" /><span>正在生成原图…</span>
            </div>}
        </div>
        {touch && state?.url && <p className="settings-hint">长按图片可保存到相册</p>}
        <div className="viewer-actions">
          {!touch && state?.url && <Button onClick={() => setZoomed(z => !z)}>
            {zoomed ? <ZoomOut size={16} /> : <ZoomIn size={16} />}{zoomed ? '适应屏幕' : '原始尺寸'}
          </Button>}
          {canShare && <Button onClick={share}><Share2 size={16} />保存 / 分享</Button>}
          {!wechat && <Button variant="primary" onClick={onDownload} disabled={!state?.url}><Download size={16} />下载图片</Button>}
        </div>
      </div>
    </DialogContent>
  </Dialog>;
}
