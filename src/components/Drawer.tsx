import type { ReactNode } from 'react';
import { Drawer as ArcDrawer, DrawerContent } from './arc/drawer/drawer';
import { useOverlayFocus } from '../hooks/useOverlayFocus';
export function Drawer({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  const focus = useOverlayFocus();
  return <ArcDrawer open={open} onOpenChange={next => { if (!next) onClose(); }}>
    <DrawerContent {...focus} title="图片列表" description="选择预览图片，勾选需要导出的图片" side="left" className="touch-overlay">
      <div className="drawer-list">{children}</div>
    </DrawerContent>
  </ArcDrawer>;
}
