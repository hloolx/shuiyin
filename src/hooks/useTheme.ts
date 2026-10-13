import { useCallback, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '../lib/constants';

type Theme = 'light' | 'dark';

const media = () => window.matchMedia('(prefers-color-scheme: dark)');

function apply(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.dataset.theme = theme;
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((m) => m.setAttribute('content', theme === 'dark' ? '#171717' : '#f8f8f8'));
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );

  // 用户未手动选择时跟随系统
  useEffect(() => {
    const mq = media();
    const onChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem(STORAGE_KEYS.theme)) return;
      const next = e.matches ? 'dark' : 'light';
      apply(next);
      setTheme(next);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      apply(next);
      try {
        localStorage.setItem(STORAGE_KEYS.theme, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return { theme, toggle };
}
