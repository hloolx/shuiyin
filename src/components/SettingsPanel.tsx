import { useState, type ReactNode } from 'react';
import { Check, ChevronDown, RotateCcw } from 'lucide-react';
import type { ExportOptions, Position, WatermarkSettings } from '../types';
import { COLOR_PRESETS, DEFAULT_SETTINGS, TEXT_MAX_LENGTH, TEXT_TEMPLATES } from '../lib/constants';
import { normalizeHex } from '../core/watermark';
import { cn } from '../lib/utils';
import { Slider } from './ui/Slider';
import { Segmented } from './ui/Segmented';
import { Switch } from './ui/Switch';
import { Button } from './ui/Button';
import { Input } from './arc/input/input';

interface SettingsPanelProps {
  settings: WatermarkSettings; onChange: (patch: Partial<WatermarkSettings>) => void; onReset: () => void;
  exportOptions: ExportOptions; onExportChange: (patch: Partial<ExportOptions>) => void; className?: string;
}
function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="settings-section"><h3>{title}</h3>{children}</section>;
}
const POSITIONS: { value: Position; label: string }[] = [
  { value: 'tl', label: '左上' }, { value: 'tc', label: '上方居中' }, { value: 'tr', label: '右上' },
  { value: 'ml', label: '左侧居中' }, { value: 'mc', label: '正中' }, { value: 'mr', label: '右侧居中' },
  { value: 'bl', label: '左下' }, { value: 'bc', label: '下方居中' }, { value: 'br', label: '右下' },
];
function PositionGrid({ value, onChange }: { value: Position; onChange: (p: Position) => void }) {
  return <div role="radiogroup" aria-label="水印位置" className="position-grid">
    {POSITIONS.map((p, index) => <button key={p.value} type="button" role="radio"
      aria-checked={p.value === value} aria-label={p.label} title={p.label} tabIndex={p.value === value ? 0 : -1}
      onClick={() => onChange(p.value)} onKeyDown={e => {
        const delta = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 3, ArrowUp: -3 }[e.key];
        if (delta === undefined) return;
        e.preventDefault(); e.stopPropagation();
        const next = (index + delta + 9) % 9;
        onChange(POSITIONS[next].value);
        (e.currentTarget.parentElement?.children[next] as HTMLButtonElement)?.focus();
      }}><span /></button>)}
  </div>;
}
function ColorField({ value, onChange }: { value: string; onChange: (hex: string) => void }) {
  const [draft, setDraft] = useState(value);
  const [editing, setEditing] = useState(false);
  const shown = editing ? draft : value;
  const valid = normalizeHex(shown) !== null;
  return <div className="space-y-4">
    <div className="color-presets" aria-label="常用颜色">
      {COLOR_PRESETS.map(color => <button key={color} type="button" aria-label={`颜色 ${color}`}
        aria-pressed={value === color} onClick={() => onChange(color)}>
        <span style={{ backgroundColor: color }}>
          {value === color && <Check size={14} strokeWidth={2}
            style={{ color: ['#ffffff', '#f97316'].includes(color) ? '#111827' : '#ffffff' }} />}
        </span>
      </button>)}
    </div>
    <div className="color-input-row">
      <Input label="颜色代码" value={shown} maxLength={7} spellCheck={false}
        error={valid ? undefined : '请输入完整颜色，如 #2563EB'}
        onFocus={() => { setDraft(value); setEditing(true); }}
        onBlur={() => setEditing(false)}
        onChange={e => { setDraft(e.target.value); const hex = normalizeHex(e.target.value); if (hex) onChange(hex); }} />
      <input type="color" aria-label="自定义颜色" value={normalizeHex(value) ?? '#2563eb'}
        onChange={e => onChange(e.target.value)} className="color-picker" />
    </div>
  </div>;
}
export function SettingsPanel({ settings: s, onChange, onReset, exportOptions, onExportChange, className }: SettingsPanelProps) {
  const switchMode = (mode: WatermarkSettings['mode']) => {
    const patch: Partial<WatermarkSettings> = { mode };
    if (mode === 'single' && s.angle === DEFAULT_SETTINGS.angle) patch.angle = 0;
    if (mode === 'tile' && s.angle === 0) patch.angle = DEFAULT_SETTINGS.angle;
    onChange(patch);
  };
  return <div className={cn('settings-panel', className)}>
    <div className="inspector-heading"><div><h2>水印设置</h2><p>更改会实时显示在预览中</p></div>
      <Button variant="ghost" size="icon" onClick={onReset} aria-label="恢复默认设置" title="恢复默认设置"><RotateCcw size={16} /></Button>
    </div>
    <section className="settings-section">
      <Input label="水印文字" value={s.text} maxLength={TEXT_MAX_LENGTH} placeholder="输入水印文字"
        description={`${s.text.length} / ${TEXT_MAX_LENGTH} 字`} onChange={e => onChange({ text: e.target.value })} />
      <div className="flex justify-end"><Button variant="ghost" onClick={() => onChange({ text: '' })} disabled={!s.text}>清空文字</Button></div>
      <details className="template-details"><summary><span>常用文案</span><ChevronDown size={16} aria-hidden /></summary>
        <div className="template-list">{TEXT_TEMPLATES.map(text => <Button key={text} variant="secondary"
          onClick={() => onChange({ text })} aria-pressed={s.text === text}>{text}</Button>)}</div>
      </details>
    </section>
    <Section title="排列方式">
      <Segmented name="mode" aria-label="排列方式" value={s.mode} onChange={switchMode}
        options={[{ value: 'tile', label: '平铺满图' }, { value: 'single', label: '单个水印' }]} />
      {s.mode === 'single' && <div className="position-area">
        <PositionGrid value={s.position} onChange={position => onChange({ position })} />
        <p className="settings-hint">选择水印位置<br />自动保留安全边距</p>
      </div>}
      <Slider label="旋转角度" value={s.angle} min={-90} max={90} step={1} origin={0}
        format={v => `${v}°`} onChange={angle => onChange({ angle })} />
      {s.mode === 'tile' && <>
        <Slider label="行间距" value={s.space} min={1.5} max={8} step={0.1}
          format={v => `${v.toFixed(1)}×`} onChange={space => onChange({ space })} />
        <Switch label="错位排列" checked={s.stagger} onChange={stagger => onChange({ stagger })} />
      </>}
    </Section>
    <Section title="颜色与样式">
      <ColorField value={s.color} onChange={color => onChange({ color })} />
      <Slider label="不透明度" value={s.alpha} min={0.05} max={1} step={0.01}
        format={v => `${Math.round(v * 100)}%`} onChange={alpha => onChange({ alpha })} />
      <Slider label="字号" value={s.size} min={0.5} max={3} step={0.05}
        format={v => `${v.toFixed(2)}×`} onChange={size => onChange({ size })} />
    </Section>
    <Section title="导出设置">
      <Segmented name="format" aria-label="导出格式" value={exportOptions.format}
        onChange={format => onExportChange({ format })}
        options={[{ value: 'auto', label: '原格式' }, { value: 'jpeg', label: 'JPG' }, { value: 'png', label: 'PNG' }, { value: 'webp', label: 'WebP' }]} />
      {exportOptions.format !== 'png' && <Slider label="图片质量" value={exportOptions.quality} min={0.6} max={1} step={0.01}
        format={v => `${Math.round(v * 100)}%`} onChange={quality => onExportChange({ quality })} />}
      <p className="settings-hint">{exportOptions.format === 'auto'
        ? 'JPG 照片仍导出为 JPG，其他格式导出为 PNG。始终保留原始分辨率。'
        : '统一转换为所选格式，保留原始分辨率。'}</p>
    </Section>
  </div>;
}
