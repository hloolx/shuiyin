import { useState, useEffect, useCallback } from 'react';

interface PWAState {
  isInstallable: boolean;
  isStandalone: boolean;
  deferredPrompt: Event | null;
}

export function usePWA() {
  const [state, setState] = useState<PWAState>({
    isInstallable: false,
    isStandalone: false,
    deferredPrompt: null,
  });

  useEffect(() => {
    // 检测是否以 PWA 模式运行
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    setState((prev) => ({ ...prev, isStandalone }));

    // 监听 beforeinstallprompt 事件
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setState((prev) => ({
        ...prev,
        isInstallable: true,
        deferredPrompt: e,
      }));
    };

    // 监听 appinstalled 事件
    const handleAppInstalled = () => {
      setState((prev) => ({
        ...prev,
        isInstallable: false,
        deferredPrompt: null,
      }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // 触发安装
  const install = useCallback(async () => {
    if (!state.deferredPrompt) return;

    const promptEvent = state.deferredPrompt as any;
    promptEvent.prompt();

    const { outcome } = await promptEvent.userChoice;

    if (outcome === 'accepted') {
      setState((prev) => ({
        ...prev,
        isInstallable: false,
        deferredPrompt: null,
      }));
    }
  }, [state.deferredPrompt]);

  return {
    ...state,
    install,
  };
}

// 注册 Service Worker
export function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration.scope);
        })
        .catch((error) => {
          console.log('SW registration failed:', error);
        });
    });
  }
}

// 检查网络状态
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
