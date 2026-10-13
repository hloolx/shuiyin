import { useId, type CSSProperties, type ReactNode } from 'react';

interface SliderProps {
  label: ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
  /** 填充起点，默认 min；双向滑块（如角度）传 0 从中间填充 */
  origin?: number;
}

export function Slider({ label, value, min, max, step, onChange, format = String, origin = min }: SliderProps) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  const originPct = ((origin - min) / (max - min)) * 100;
  const style = {
    '--fill-from': `${Math.min(pct, originPct)}%`,
    '--fill-to': `${Math.max(pct, originPct)}%`,
  } as CSSProperties;

  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm text-foreground-secondary">
          {label}
        </label>
        <output
          htmlFor={id}
          className="tabular min-w-[3.25rem] rounded-md bg-surface-2 px-1.5 py-0.5 text-center text-xs font-medium text-foreground"
        >
          {format(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        className="range mt-1"
        min={min}
        max={max}
        step={step}
        value={value}
        style={style}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
