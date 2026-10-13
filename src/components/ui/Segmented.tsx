import SegmentedControl from '../arc/segmented-control/segmented-control';
interface SegmentedProps<T extends string> {
  name: string; value: T; options: { value: T; label: string }[];
  onChange: (value: T) => void; className?: string; 'aria-label'?: string;
}
export function Segmented<T extends string>({ name, value, options, onChange, className, 'aria-label': label }: SegmentedProps<T>) {
  return <SegmentedControl label={label ?? name} value={value} options={options}
    onValueChange={(next) => onChange(next as T)} className={className} />;
}
