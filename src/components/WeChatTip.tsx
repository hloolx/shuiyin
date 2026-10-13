import { AnimatePresence, m } from 'motion/react';
import { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { STORAGE_KEYS } from '../lib/constants';

/** 微信内置浏览器无法下载文件，提示用户换浏览器或长按保存 */
export function WeChatTip() {
  const [open, setOpen] = useState(() => !sessionStorage.getItem(STORAGE_KEYS.wechatTip));

  return (
    <AnimatePresence>
      {open && (
        <m.div
          className="overflow-hidden border-b border-warning/30 bg-warning/10"
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
        >
          <div className="flex items-start gap-2.5 px-4 py-2.5">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <p className="flex-1 text-xs leading-relaxed text-foreground-secondary">
              微信内无法直接下载文件，可在「查看大图」后<strong className="font-medium">长按图片保存</strong>；批量导出请点右上角「···」选择
              <strong className="font-medium">在浏览器打开</strong>。
            </p>
            <button
              type="button"
              aria-label="关闭提示"
              onClick={() => {
                sessionStorage.setItem(STORAGE_KEYS.wechatTip, '1');
                setOpen(false);
              }}
              className="-mr-1 rounded-md p-1 text-foreground-tertiary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
