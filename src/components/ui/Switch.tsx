import { Switch as ArcSwitch } from '../arc/switch/switch';
export function Switch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <ArcSwitch label={label} checked={checked} onCheckedChange={onChange} />;
}
