import { useEffect, useRef } from 'react';

export interface HotkeyHandlers {
  prev?: () => void;
  next?: () => void;
  remove?: () => void;
  download?: () => void;
  exportAll?: () => void;
  /** 按住空格对比原图 */
  compare?: (pressed: boolean) => void;
}

const isTyping = (el: EventTarget | null) => {
  const t = el as HTMLElement | null;
  if (!t) return false;
  if (t.isContentEditable || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT') return true;
  if (t.tagName === 'INPUT') {
    const type = (t as HTMLInputElement).type;
    return !['range', 'checkbox', 'radio', 'button', 'color'].includes(type);
  }
  return false;
};

export function useHotkeys(handlers: HotkeyHandlers, enabled = true) {
  const ref = useRef(handlers);
  ref.current = handlers;

  useEffect(() => {
    if (!enabled) return;
    let comparing = false;

    const down = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      const h = ref.current;
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (e.shiftKey) h.exportAll?.();
        else h.download?.();
        return;
      }
      if (isTyping(e.target) || mod || e.altKey) return;
      // 滑块获得焦点时方向键用于调值，不切换图片
      const onRange = (e.target as HTMLElement | null)?.closest('input[type="range"], [role="slider"], [role="radio"], [role="group"]');
      switch (e.key) {
        case 'ArrowLeft':
          if (onRange) return;
          e.preventDefault();
          h.prev?.();
          break;
        case 'ArrowRight':
          if (onRange) return;
          e.preventDefault();
          h.next?.();
          break;
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          h.remove?.();
          break;
        case ' ':
          if ((e.target as HTMLElement | null)?.closest?.('button, [role], a, summary')) return;
          e.preventDefault();
          if (!comparing && !e.repeat) {
            comparing = true;
            h.compare?.(true);
          }
          break;
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === ' ' && comparing) {
        comparing = false;
        ref.current.compare?.(false);
      }
    };
    const blur = () => {
      if (comparing) {
        comparing = false;
        ref.current.compare?.(false);
      }
    };

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
    };
  }, [enabled]);
}
