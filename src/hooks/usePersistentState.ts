import { useEffect, useState } from 'react';
import { readJSON, writeJSON } from '../lib/utils';

/** 写入 localStorage 的对象状态；读取时与默认值合并并过滤非法字段 */
export function usePersistentState<T extends object>(
  key: string,
  defaults: T,
  sanitize: (value: Partial<T>) => Partial<T> = (v) => v
) {
  const [state, setState] = useState<T>(() => {
    const saved = readJSON<Partial<T>>(key);
    return saved ? { ...defaults, ...sanitize(saved) } : defaults;
  });

  useEffect(() => {
    // 拖动滑块时会频繁变化，稍作延迟再写入
    const timer = setTimeout(() => writeJSON(key, state), 300);
    return () => clearTimeout(timer);
  }, [key, state]);

  return [state, setState] as const;
}
