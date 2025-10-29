export interface WatermarkSettings {
  text: string;
  color: string;
  alpha: number;
  angle: number;
  space: number;
  size: number;
}

export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  selected: boolean;
}

export interface ProgressState {
  isOpen: boolean;
  current: number;
  total: number;
  fileName: string;
}
