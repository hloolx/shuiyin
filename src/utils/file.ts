/**
 * 验证文件是否为支持的图片格式
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
}

/**
 * 过滤文件列表，只保留有效的图片文件
 */
export function filterImageFiles(files: FileList | File[]): File[] {
  const fileArray = Array.from(files);
  return fileArray.filter(isValidImageFile);
}

/**
 * 生成唯一 ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
