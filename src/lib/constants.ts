import type { ExportOptions, WatermarkSettings } from '../types';

export const APP_VERSION = '2.0.0';

export const DEFAULT_SETTINGS: WatermarkSettings = {
  text: '仅供XX使用，他用无效',
  color: '#2563eb',
  alpha: 0.2,
  angle: -30,
  space: 4,
  size: 1,
  mode: 'tile',
  stagger: true,
  position: 'br',
};

export const DEFAULT_EXPORT: ExportOptions = {
  format: 'auto',
  quality: 0.92,
};

export const TEXT_MAX_LENGTH = 40;

/** 常用水印模板，证件类场景优先 */
export const TEXT_TEMPLATES = [
  '仅供XX使用，他用无效',
  '仅供办理XX业务使用',
  '本复印件仅用于XX',
  '复印无效',
  '内部资料 请勿外传',
  '样张 SAMPLE',
  '© 版权所有',
];

export const COLOR_PRESETS = [
  '#2563eb',
  '#dc2626',
  '#f97316',
  '#16a34a',
  '#111827',
  '#6b7280',
  '#ffffff',
];

export const ACCEPT_TYPES =
  'image/png,image/jpeg,image/webp,image/gif,image/bmp,image/avif,image/heic,image/heif';

export const STORAGE_KEYS = {
  settings: 'shuiyin:settings:v2',
  export: 'shuiyin:export:v1',
  theme: 'shuiyin:theme',
  wechatTip: 'shuiyin:wechat-tip-dismissed',
} as const;
