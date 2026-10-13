import { AnimatePresence, m } from 'motion/react';
import { useState, type ReactNode } from 'react';
import { Grid3x3, RotateCcw, Square, X } from 'lucide-react';
import type { ExportOptions, Position, WatermarkSettings } from '../types';
import { COLOR_PRESETS, DEFAULT_SETTINGS, TEXT_MAX_LENGTH, TEXT_TEMPLATES } from '../lib/constants';
import { normalizeHex } from '../core/watermark';
import { cn } from '../lib/utils';
import { Slider } from './ui/Slider';
import { Segmented } from './ui/Segmented';
import { Switch } from './ui/Switch';

interface SettingsPanelProps {
  settings: WatermarkSettings;
  onChange: (patch: Partial<WatermarkSettings>) => void;
  onReset: () => void;
  exportOptions: ExportOptions;
  onExportChange: (patch: Partial<ExportOptions>) => void;
  className?: string;
}

function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="space-y-3 px-4 py-4 sm:px-5">
      <div className="flex min-h-6 items-center justify-between">
        <h3 className="text-xs font-semibold tracking-wide text-foreground-tertiary">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

const POSITIONS: { value: Position; label: string }[] = [
  { value: 'tl', label: '左上' },
  { value: 'tc', label: '上方居中' },
  { value: 'tr', label: '右上' },
  { value: 'ml', label: '左侧居中' },
  { value: 'mc', label: '正中' },
  { value: 'mr', label: '右侧居中' },
  { value: 'bl', label: '左下' },
  { value: 'bc', label: '下方居中' },
  { value: 'br', label: '右下' },
];

function PositionGrid({ value, onChange }: { value: Position; onChange: (p: Position) => void }) {
  return (
    <div role="radiogroup" aria-label="水印位置" className="grid aspect-[4/3] w-36 grid-cols-3 gap-1 rounded-xl bg-surface-2 p-1">
      {POSITIONS.map((p) => {
        const active = p.value === value;
        return (
          <button
            key={p.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={p.label}
            title={p.label}
            onClick={() => onChange(p.value)}
            className="relative isolate flex items-center justify-center rounded-md transition-colors hover:bg-surface/60"
          >
            {active && (
              <m.span
                layoutId="position-active"
                className="absolute inset-0 -z-10 rounded-md bg-surface shadow-[0_1px_3px_rgb(15_23_42/0.14)]"
                transition={{ type: 'spring', stiffness: 500, damping: 36 }}
              />
            )}
            <span
              className={cn(
                'h-2 rounded-full transition-all duration-200',
                active ? 'w-4 bg-primary' : 'w-2 bg-border-strong'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

function ColorField({ value, onChange }: { value: string; onChange: (hex: string) => void }) {
  // 输入中的草稿值；未在编辑时跟随外部颜色变化（点选色块等）
  const [draft, setDraft] = useState(value);
  const [editing, setEditing] = useState(false);
  const [synced, setSynced] = useState(value);
  if (!editing && synced !== value) {
    setSynced(value);
    setDraft(value);
  }
  const valid = normalizeHex(draft) !== null;
  const isPreset = COLOR_PRESETS.includes(value);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {COLOR_PRESETS.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={`颜色 ${c}`}
            aria-pressed={value === c}
            onClick={() => onChange(c)}
            className="relative h-7 w-7 rounded-full ring-1 ring-inset ring-black/10 transition-transform hover:scale-110 active:scale-95 dark:ring-white/15"
            style={{ backgroundColor: c }}
          >
            {value === c && (
              <m.span
                layoutId="color-active"
                className="absolute -inset-[3px] rounded-full border-2 border-primary"
                transition={{ type: 'spring', stiffness: 500, damping: 34 }}
              />
            )}
          </button>
        ))}
        <label
          className="relative h-7 w-7 cursor-pointer rounded-full transition-transform hover:scale-110"
          title="自定义颜色"
          style={{
            background: isPreset
              ? 'conic-gradient(from 0deg, #f43f5e, #f59e0b, #84cc16, #06b6d4, #6366f1, #d946ef, #f43f5e)'
              : value,
          }}
        >
          {!isPreset && (
            <m.span
              layoutId="color-active"
              className="absolute -inset-[3px] rounded-full border-2 border-primary"
              transition={{ type: 'spring', stiffness: 500, damping: 34 }}
            />
          )}
          <input
            type="color"
            value={normalizeHex(value) ?? '#2563eb'}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label="自定义颜色"
          />
        </label>
      </div>
      <div className="flex items-center gap-2">
        <span className="h-9 w-9 shrink-0 rounded-lg ring-1 ring-inset ring-border" style={{ backgroundColor: value }} />
        <input
          type="text"
          inputMode="text"
          spellCheck={false}
          maxLength={7}
          value={draft}
          aria-label="颜色代码"
          aria-invalid={!valid}
          onChange={(e) => {
            const next = e.target.value;
            setDraft(next);
            const hex = normalizeHex(next);
            if (hex) onChange(hex);
          }}
          onFocus={() => setEditing(true)}
          onBlur={() => {
            setEditing(false);
            setDraft(value);
          }}
          className={cn(
            'h-9 w-28 rounded-lg border bg-surface px-3 font-mono text-base uppercase text-foreground outline-none transition-[border-color,box-shadow] sm:text-sm',
            valid ? 'border-border focus:border-primary/50 focus:shadow-ring' : 'border-danger/60 focus:shadow-[0_0_0_4px_rgb(var(--danger)/0.15)]'
          )}
        />
        {!valid && <span className="text-xs text-danger">格式如 #2563EB</span>}
      </div>
    </div>
  );
}

export function SettingsPanel({ settings, onChange, onReset, exportOptions, onExportChange, className }: SettingsPanelProps) {
  const s = settings;

  const switchMode = (mode: WatermarkSettings['mode']) => {
    // 平铺默认斜排、单个默认水平；用户自己改过角度就不动它
    const patch: Partial<WatermarkSettings> = { mode };
    if (mode === 'single' && s.angle === DEFAULT_SETTINGS.angle) patch.angle = 0;
    if (mode === 'tile' && s.angle === 0) patch.angle = DEFAULT_SETTINGS.angle;
    onChange(patch);
  };

  return (
    <div className={cn('divide-y divide-border', className)}>
      <Section
        title="水印文字"
        action={
          <button
            type="button"
            onClick={onReset}
            className="group flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-foreground-tertiary transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3 transition-transform duration-500 group-hover:-rotate-[360deg]" />
            恢复默认
          </button>
        }
      >
        <div className="relative">
          <input
            type="text"
            value={s.text}
            maxLength={TEXT_MAX_LENGTH}
            placeholder="输入水印文字"
            aria-label="水印文字"
            onChange={(e) => onChange({ text: e.target.value })}
            className="h-11 w-full rounded-xl border border-border bg-surface pl-3.5 pr-16 text-base text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-foreground-tertiary focus:border-primary/50 focus:shadow-ring sm:text-sm"
          />
          <div className="absolute inset-y-0 right-2 flex items-center gap-1">
            <span className="tabular text-[11px] text-foreground-tertiary">
              {s.text.length}/{TEXT_MAX_LENGTH}
            </span>
            {s.text && (
              <button
                type="button"
                aria-label="清空文字"
                onClick={() => onChange({ text: '' })}
                className="rounded-md p-1 text-foreground-tertiary hover:bg-surface-2 hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TEXT_TEMPLATES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChange({ text: t })}
              className={cn(
                'rounded-lg border px-2.5 py-1 text-xs transition-all active:scale-95',
                s.text === t
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : 'border-border text-foreground-secondary hover:border-border-strong hover:bg-surface-2'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </Section>

      <Section title="颜色与样式">
        <ColorField value={s.color} onChange={(color) => onChange({ color })} />
        <Slider
          label="不透明度"
          value={s.alpha}
          min={0.05}
          max={1}
          step={0.01}
          format={(v) => `${Math.round(v * 100)}%`}
          onChange={(alpha) => onChange({ alpha })}
        />
        <Slider
          label="字号"
          value={s.size}
          min={0.5}
          max={3}
          step={0.05}
          format={(v) => `${v.toFixed(2)}×`}
          onChange={(size) => onChange({ size })}
        />
      </Section>

      <Section title="排列方式">
        <Segmented
          name="mode"
          aria-label="排列方式"
          value={s.mode}
          onChange={switchMode}
          options={[
            { value: 'tile', label: <><Grid3x3 className="h-3.5 w-3.5" />平铺满图</> },
            { value: 'single', label: <><Square className="h-3.5 w-3.5" />单个水印</> },
          ]}
        />
        <AnimatePresence initial={false} mode="wait">
          <m.div
            key={s.mode}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-3 pt-1">
              {s.mode === 'single' && (
                <div className="flex items-center gap-4">
                  <PositionGrid value={s.position} onChange={(position) => onChange({ position })} />
                  <p className="text-xs leading-relaxed text-foreground-tertiary">
                    点选水印所在位置，
                    <br />
                    会自动留出安全边距
                  </p>
                </div>
              )}
              <Slider
                label="旋转角度"
                value={s.angle}
                min={-90}
                max={90}
                step={1}
                origin={0}
                format={(v) => `${v}°`}
                onChange={(angle) => onChange({ angle })}
              />
              {s.mode === 'tile' && (
                <>
                  <Slider
                    label="行间距"
                    value={s.space}
                    min={1.5}
                    max={8}
                    step={0.1}
                    format={(v) => `${v.toFixed(1)}×`}
                    onChange={(space) => onChange({ space })}
                  />
                  <Switch label="错位排列（更难被裁掉）" checked={s.stagger} onChange={(stagger) => onChange({ stagger })} />
                </>
              )}
            </div>
          </m.div>
        </AnimatePresence>
      </Section>

      <Section title="导出">
        <Segmented
          name="format"
          aria-label="导出格式"
          value={exportOptions.format}
          onChange={(format) => onExportChange({ format })}
          options={[
            { value: 'auto', label: '原格式' },
            { value: 'jpeg', label: 'JPG' },
            { value: 'png', label: 'PNG' },
            { value: 'webp', label: 'WebP' },
          ]}
        />
        <AnimatePresence initial={false}>
          {exportOptions.format !== 'png' && (
            <m.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <Slider
                label="图片质量"
                value={exportOptions.quality}
                min={0.6}
                max={1}
                step={0.01}
                format={(v) => `${Math.round(v * 100)}%`}
                onChange={(quality) => onExportChange({ quality })}
              />
            </m.div>
          )}
        </AnimatePresence>
        <p className="text-xs leading-relaxed text-foreground-tertiary">
          {exportOptions.format === 'auto'
            ? 'JPG 照片仍导出为 JPG，PNG 等其他格式导出为 PNG，均保持原始分辨率。'
            : '所有图片统一转换为所选格式，保持原始分辨率。'}
        </p>
      </Section>
    </div>
  );
}
