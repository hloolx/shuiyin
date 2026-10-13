import { useSyncExternalStore } from 'react';

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches
  );
}

/** ≥1024px 为桌面布局。用 matchMedia 而不是 resize，移动端地址栏伸缩不会误触发 */
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');

export const useCanHover = () => useMediaQuery('(hover: hover) and (pointer: fine)');
