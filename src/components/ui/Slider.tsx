import { Slider as ArcSlider } from '../arc/slider/slider';
interface SliderProps {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (value: number) => void; format?: (value: number) => string; origin?: number;
}
export function Slider({ onChange, origin, ...props }: SliderProps) {
  return <ArcSlider {...props} onValueChange={onChange}
    marks={origin === undefined ? undefined : [{ value: origin, label: '0°' }]} />;
}
