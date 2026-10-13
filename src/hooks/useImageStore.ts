import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import type { ImageItem } from '../types';
import { decodeFile, isSupportedImage, makeThumbnail, releaseSource, sourceCache } from '../core/image';
import { uid } from '../lib/utils';

interface State {
  items: ImageItem[];
  currentId: string | null;
}

/** 被删除的图片快照，用于撤销 */
export interface Removed {
  entries: { item: ImageItem; index: number }[];
  currentId: string | null;
}

type Action =
  | { type: 'add'; items: ImageItem[] }
  | { type: 'patch'; id: string; patch: Partial<ImageItem> }
  | { type: 'remove'; ids: string[] }
  | { type: 'restore'; removed: Removed }
  | { type: 'current'; id: string }
  | { type: 'toggle'; id: string }
  | { type: 'selectAll'; selected: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add':
      return {
        items: [...state.items, ...action.items],
        currentId: state.currentId ?? action.items[0]?.id ?? null,
      };
    case 'patch':
      return {
        ...state,
        items: state.items.map((it) => (it.id === action.id ? { ...it, ...action.patch } : it)),
      };
    case 'remove': {
      const ids = new Set(action.ids);
      const items = state.items.filter((it) => !ids.has(it.id));
      let currentId = state.currentId;
      if (currentId && ids.has(currentId)) {
        // 删除当前图后，优先落到原位置的下一张，其次上一张
        const oldIndex = state.items.findIndex((it) => it.id === currentId);
        const after = state.items.slice(oldIndex + 1).find((it) => !ids.has(it.id));
        const before = state.items.slice(0, oldIndex).reverse().find((it) => !ids.has(it.id));
        currentId = (after ?? before)?.id ?? null;
      }
      return { items, currentId };
    }
    case 'restore': {
      const items = [...state.items];
      for (const { item, index } of [...action.removed.entries].sort((a, b) => a.index - b.index)) {
        items.splice(Math.min(index, items.length), 0, item);
      }
      return { items, currentId: action.removed.currentId ?? state.currentId };
    }
    case 'current':
      return state.items.some((it) => it.id === action.id) ? { ...state, currentId: action.id } : state;
    case 'toggle':
      return {
        ...state,
        items: state.items.map((it) => (it.id === action.id ? { ...it, selected: !it.selected } : it)),
      };
    case 'selectAll':
      return { ...state, items: state.items.map((it) => ({ ...it, selected: action.selected })) };
  }
}

interface Options {
  /** 有图片解码失败时回调（已自动移除） */
  onDecodeError?: (names: string[]) => void;
}

export function useImageStore({ onDecodeError }: Options = {}) {
  const [state, dispatch] = useReducer(reducer, { items: [], currentId: null });
  const stateRef = useRef(state);
  stateRef.current = state;
  const onErrorRef = useRef(onDecodeError);
  onErrorRef.current = onDecodeError;

  // 缩略图队列：串行解码，避免一次性解码几十张大图卡死页面
  const queueRef = useRef<ImageItem[]>([]);
  const runningRef = useRef(false);
  // 同步维护的存活 id 集合（reducer 状态要等下一次渲染才更新）
  const liveRef = useRef(new Set<string>());

  const pump = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    const failed: string[] = [];
    while (queueRef.current.length) {
      const item = queueRef.current.shift()!;
      if (!liveRef.current.has(item.id)) continue;
      try {
        const decoded = await decodeFile(item.file);
        const thumb = await makeThumbnail(decoded, item.file);
        if (!liveRef.current.has(item.id)) {
          URL.revokeObjectURL(thumb);
          releaseSource(decoded.source);
          continue;
        }
        // 当前图顺带放进缓存，预览无需二次解码
        if (stateRef.current.currentId === item.id) sourceCache.put(item.id, decoded);
        else releaseSource(decoded.source);
        dispatch({
          type: 'patch',
          id: item.id,
          patch: { thumb, width: decoded.width, height: decoded.height, status: 'ready' },
        });
      } catch {
        failed.push(item.name);
        liveRef.current.delete(item.id);
        dispatch({ type: 'remove', ids: [item.id] });
      }
    }
    runningRef.current = false;
    if (failed.length) onErrorRef.current?.(failed);
  }, []);

  /** 添加文件，返回被忽略的不支持文件名 */
  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const list = Array.from(files);
      const valid = list.filter(isSupportedImage);
      const rejected = list.filter((f) => !isSupportedImage(f)).map((f) => f.name);
      const items: ImageItem[] = valid.map((file) => ({
        id: uid(),
        file,
        name: file.name || `image-${Date.now()}.png`,
        selected: true,
        status: 'loading',
      }));
      if (items.length) {
        items.forEach((it) => liveRef.current.add(it.id));
        dispatch({ type: 'add', items });
        queueRef.current.push(...items);
        // 等 reducer 生效后再开始处理
        queueMicrotask(() => void pump());
      }
      return { added: items.length, rejected };
    },
    [pump]
  );

  /** 移除图片，返回快照；调用方决定何时 finalize（真正释放资源）或 restore */
  const remove = useCallback((ids: string[]): Removed | null => {
    const { items, currentId } = stateRef.current;
    const entries = items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => ids.includes(item.id));
    if (!entries.length) return null;
    ids.forEach((id) => liveRef.current.delete(id));
    dispatch({ type: 'remove', ids });
    return { entries, currentId };
  }, []);

  const restore = useCallback(
    (removed: Removed) => {
      const pending: ImageItem[] = [];
      for (const { item } of removed.entries) {
        liveRef.current.add(item.id);
        if (item.status === 'loading') pending.push(item);
      }
      dispatch({ type: 'restore', removed });
      // 删除时还没生成完缩略图的，重新排队
      if (pending.length) {
        queueRef.current.push(...pending);
        queueMicrotask(() => void pump());
      }
    },
    [pump]
  );

  const finalize = useCallback((removed: Removed) => {
    for (const { item } of removed.entries) {
      if (liveRef.current.has(item.id)) continue;
      if (item.thumb) URL.revokeObjectURL(item.thumb);
      sourceCache.delete(item.id);
    }
  }, []);

  const setCurrent = useCallback((id: string) => dispatch({ type: 'current', id }), []);
  const toggle = useCallback((id: string) => dispatch({ type: 'toggle', id }), []);
  const selectAll = useCallback((selected: boolean) => dispatch({ type: 'selectAll', selected }), []);

  const step = useCallback((delta: number) => {
    const { items, currentId } = stateRef.current;
    const index = items.findIndex((it) => it.id === currentId);
    const next = items[index + delta];
    if (next) dispatch({ type: 'current', id: next.id });
    return Boolean(next);
  }, []);

  // 卸载时释放全部资源
  useEffect(
    () => () => {
      stateRef.current.items.forEach((it) => it.thumb && URL.revokeObjectURL(it.thumb));
      sourceCache.clear();
    },
    []
  );

  const { items, currentId } = state;
  const derived = useMemo(() => {
    const currentIndex = items.findIndex((it) => it.id === currentId);
    return {
      currentIndex,
      current: currentIndex >= 0 ? items[currentIndex] : null,
      selected: items.filter((it) => it.selected && it.status !== 'error'),
    };
  }, [items, currentId]);

  return {
    items,
    currentId,
    ...derived,
    addFiles,
    remove,
    restore,
    finalize,
    setCurrent,
    toggle,
    selectAll,
    step,
  };
}

export type ImageStore = ReturnType<typeof useImageStore>;
