import { useState, useCallback } from 'react';
import type { ImageFile } from '../types';
import { filterImageFiles, generateId } from '../utils/file';

export function useImageManager() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  // 添加图片
  const addImages = useCallback((files: FileList | File[]) => {
    const validFiles = filterImageFiles(files);

    const newImages: ImageFile[] = validFiles.map((file) => ({
      id: generateId(),
      file,
      preview: URL.createObjectURL(file),
      selected: true,
    }));

    setImages((prev) => {
      const updated = [...prev, ...newImages];
      // 如果是第一次添加图片，自动选中第一张
      if (prev.length === 0 && updated.length > 0) {
        setCurrentIndex(0);
      }
      return updated;
    });
  }, []);

  // 删除图片
  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const newImages = prev.filter((img) => img.id !== id);
      const removedIndex = prev.findIndex((img) => img.id === id);

      // 调整当前选中的索引
      if (removedIndex === currentIndex) {
        if (newImages.length === 0) {
          setCurrentIndex(-1);
        } else if (currentIndex >= newImages.length) {
          setCurrentIndex(newImages.length - 1);
        }
      } else if (removedIndex < currentIndex) {
        setCurrentIndex((prev) => prev - 1);
      }

      // 清理预览 URL
      const removedImage = prev.find((img) => img.id === id);
      if (removedImage) {
        URL.revokeObjectURL(removedImage.preview);
      }

      return newImages;
    });
  }, [currentIndex]);

  // 清空所有图片
  const clearAll = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    setCurrentIndex(-1);
  }, [images]);

  // 选中图片
  const selectImage = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // 切换图片的选中状态
  const toggleImageSelection = useCallback((id: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, selected: !img.selected } : img
      )
    );
  }, []);

  // 全选
  const selectAll = useCallback(() => {
    setImages((prev) => prev.map((img) => ({ ...img, selected: true })));
  }, []);

  // 取消全选
  const deselectAll = useCallback(() => {
    setImages((prev) => prev.map((img) => ({ ...img, selected: false })));
  }, []);

  // 获取当前图片
  const currentImage = currentIndex >= 0 ? images[currentIndex] : null;

  // 获取选中的图片
  const selectedImages = images.filter((img) => img.selected);

  return {
    images,
    currentImage,
    currentIndex,
    selectedImages,
    addImages,
    removeImage,
    clearAll,
    selectImage,
    toggleImageSelection,
    selectAll,
    deselectAll,
  };
}
