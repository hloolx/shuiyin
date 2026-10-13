export type WatermarkMode = 'tile' | 'single';

/** 九宫格位置：第一位 t/m/b 为纵向，第二位 l/c/r 为横向 */
export type Position = 'tl' | 'tc' | 'tr' | 'ml' | 'mc' | 'mr' | 'bl' | 'bc' | 'br';

export interface WatermarkSettings {
  text: string;
  color: string;
  /** 不透明度 0-1 */
  alpha: number;
  /** 旋转角度 -90 ~ 90 */
  angle: number;
  /** 平铺行距，单位为字号倍数 */
  space: number;
  /** 字号倍数，基准为图片短边的 1/25 */
  size: number;
  mode: WatermarkMode;
  /** 平铺时奇数行错开半个身位 */
  stagger: boolean;
  position: Position;
}

export type ExportFormat = 'auto' | 'jpeg' | 'png' | 'webp';

export interface ExportOptions {
  format: ExportFormat;
  /** JPEG / WebP 质量 0-1 */
  quality: number;
}

export type ImageStatus = 'loading' | 'ready' | 'error';

export interface ImageItem {
  id: string;
  file: File;
  name: string;
  /** 缩略图 object URL */
  thumb?: string;
  width?: number;
  height?: number;
  /** 是否勾选导出 */
  selected: boolean;
  status: ImageStatus;
}

export interface ExportProgress {
  phase: 'render' | 'zip' | 'done';
  current: number;
  total: number;
  name: string;
  /** 0-1 */
  ratio: number;
}
