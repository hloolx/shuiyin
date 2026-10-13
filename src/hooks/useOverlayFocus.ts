import { useRef } from 'react';

/** Controlled overlays have no Radix Trigger, so retain their actual invoking control. */
export function useOverlayFocus() {
  const trigger = useRef<HTMLElement | null>(null);
  return {
    onOpenAutoFocus: () => { trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; },
    onCloseAutoFocus: (event: Event) => {
      event.preventDefault();
      if (trigger.current?.isConnected) trigger.current.focus();
    },
  };
}
