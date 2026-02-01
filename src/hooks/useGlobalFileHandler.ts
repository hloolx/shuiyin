import { useEffect, useRef, useCallback, useState } from 'react';

interface UseGlobalFileHandlerOptions {
  onFilesSelect: (files: FileList | File[]) => void;
  disabled?: boolean;
}

interface UseGlobalFileHandlerReturn {
  isDragging: boolean;
  dragCounter: number;
}

/**
 * 全局文件拖入处理 Hook
 * 支持在整个页面拖入文件
 */
export function useGlobalFileHandler(
  options: UseGlobalFileHandlerOptions
): UseGlobalFileHandlerReturn {
  const { onFilesSelect, disabled = false } = options;
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const dragCounterRef = useRef(0);

  // 更新计数器 ref
  useEffect(() => {
    dragCounterRef.current = dragCounter;
  }, [dragCounter]);

  const handleDragEnter = useCallback((e: DragEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // 检查是否包含文件
    const types = e.dataTransfer?.types;
    if (!types || !types.includes('Files')) return;

    const newCount = dragCounterRef.current + 1;
    dragCounterRef.current = newCount;
    setDragCounter(newCount);
    setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: DragEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();

    const newCount = Math.max(0, dragCounterRef.current - 1);
    dragCounterRef.current = newCount;
    setDragCounter(newCount);
    
    if (newCount === 0) {
      setIsDragging(false);
    }
  }, [disabled]);

  const handleDragOver = useCallback((e: DragEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // 设置拖放效果
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
  }, [disabled]);

  const handleDrop = useCallback((e: DragEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();

    // 重置状态
    dragCounterRef.current = 0;
    setDragCounter(0);
    setIsDragging(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      onFilesSelect(files);
    }
  }, [disabled, onFilesSelect]);

  useEffect(() => {
    if (disabled) return;

    // 使用 capture 阶段确保在子元素之前捕获事件
    document.addEventListener('dragenter', handleDragEnter, true);
    document.addEventListener('dragleave', handleDragLeave, true);
    document.addEventListener('dragover', handleDragOver, true);
    document.addEventListener('drop', handleDrop, true);

    return () => {
      document.removeEventListener('dragenter', handleDragEnter, true);
      document.removeEventListener('dragleave', handleDragLeave, true);
      document.removeEventListener('dragover', handleDragOver, true);
      document.removeEventListener('drop', handleDrop, true);
    };
  }, [disabled, handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

  return { isDragging, dragCounter };
}

/**
 * 粘贴图片处理 Hook
 * 支持从剪贴板粘贴图片
 */
export function usePasteHandler(
  options: UseGlobalFileHandlerOptions
): void {
  const { onFilesSelect, disabled = false } = options;

  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    if (disabled) return;
    
    // 检查是否有文件
    const items = e.clipboardData?.items;
    if (!items) return;

    const files: File[] = [];
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      // 处理文件类型
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file && file.type.startsWith('image/')) {
          files.push(file);
        }
      }
    }

    if (files.length > 0) {
      e.preventDefault();
      onFilesSelect(files);
    }
  }, [disabled, onFilesSelect]);

  useEffect(() => {
    if (disabled) return;

    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [disabled, handlePaste]);
}

/**
 * 键盘快捷键处理 Hook
 */
interface UseKeyboardShortcutsOptions {
  onSelectAll?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  disabled?: boolean;
}

export function useKeyboardShortcuts(options: UseKeyboardShortcutsOptions): void {
  const { onSelectAll, onDelete, onCopy, onPaste, disabled = false } = options;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (disabled) return;

    // 忽略输入框中的快捷键
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return;
    }

    // Ctrl/Cmd + A - 全选
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
      e.preventDefault();
      onSelectAll?.();
    }

    // Delete - 删除
    if (e.key === 'Delete' || e.key === 'Backspace') {
      onDelete?.();
    }

    // Ctrl/Cmd + C - 复制
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      onCopy?.();
    }

    // Ctrl/Cmd + V - 粘贴
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      // 粘贴由 usePasteHandler 处理
      onPaste?.();
    }
  }, [disabled, onSelectAll, onDelete, onCopy, onPaste]);

  useEffect(() => {
    if (disabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [disabled, handleKeyDown]);
}
