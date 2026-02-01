import { Type, Palette } from 'lucide-react';
import type { WatermarkSettings as WatermarkSettingsType } from '../types';
import { Card, CardContent } from './ui/Card';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Slider } from './ui/Slider';

interface WatermarkSettingsProps {
  settings: WatermarkSettingsType;
  onSettingsChange: (settings: Partial<WatermarkSettingsType>) => void;
}

export function WatermarkSettings({
  settings,
  onSettingsChange,
}: WatermarkSettingsProps) {
  return (
    <Card className="h-fit">
      <CardContent className="space-y-6 sm:space-y-8 py-4 sm:py-6">
        {/* 水印文字 */}
        <div className="space-y-2 sm:space-y-3">
          <Label htmlFor="text" className="flex items-center gap-2 text-sm sm:text-base">
            <Type className="h-4 w-4" />
            水印文字
          </Label>
          <Input
            id="text"
            type="text"
            maxLength={30}
            placeholder="请输入水印文字（最多30个字符）"
            value={settings.text}
            onChange={(e) => onSettingsChange({ text: e.target.value })}
            className="h-10 sm:h-11 text-sm sm:text-base"
          />
        </div>

        {/* 颜色选择 */}
        <div className="space-y-2 sm:space-y-3">
          <Label htmlFor="color" className="flex items-center gap-2 text-sm sm:text-base">
            <Palette className="h-4 w-4" />
            颜色
          </Label>
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 sm:h-12 sm:w-12 overflow-hidden rounded-xl border border-border flex-shrink-0">
              <input
                id="color"
                type="color"
                value={settings.color}
                onChange={(e) => onSettingsChange({ color: e.target.value })}
                className="absolute -left-2 -top-2 h-16 w-16 cursor-pointer"
              />
            </div>
            <Input
              type="text"
              value={settings.color}
              onChange={(e) => onSettingsChange({ color: e.target.value })}
              className="w-28 sm:w-32 font-mono text-sm h-10 sm:h-11"
              placeholder="#1e40af"
            />
          </div>
        </div>

        {/* 滑块控件 */}
        <div className="space-y-5 sm:space-y-6">
          {/* 透明度 */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="alpha" className="text-sm sm:text-base">透明度</Label>
              <span className="rounded-lg bg-foreground/5 px-2 py-1 text-xs sm:text-sm font-medium text-foreground-secondary">
                {Math.round(settings.alpha * 100)}%
              </span>
            </div>
            <Slider
              id="alpha"
              min={0}
              max={1}
              step={0.05}
              value={settings.alpha}
              onValueChange={(value) => onSettingsChange({ alpha: value })}
            />
          </div>

          {/* 旋转角度 */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="angle" className="text-sm sm:text-base">旋转角度</Label>
              <span className="rounded-lg bg-foreground/5 px-2 py-1 text-xs sm:text-sm font-medium text-foreground-secondary">
                {settings.angle}°
              </span>
            </div>
            <Slider
              id="angle"
              min={-90}
              max={90}
              step={5}
              value={settings.angle}
              onValueChange={(value) => onSettingsChange({ angle: value })}
            />
          </div>

          {/* 水印间隔 */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="space" className="text-sm sm:text-base">水印间隔</Label>
              <span className="rounded-lg bg-foreground/5 px-2 py-1 text-xs sm:text-sm font-medium text-foreground-secondary">
                {settings.space.toFixed(1)}x
              </span>
            </div>
            <Slider
              id="space"
              min={1}
              max={8}
              step={0.2}
              value={settings.space}
              onValueChange={(value) => onSettingsChange({ space: value })}
            />
          </div>

          {/* 字号大小 */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="size" className="text-sm sm:text-base">字号大小</Label>
              <span className="rounded-lg bg-foreground/5 px-2 py-1 text-xs sm:text-sm font-medium text-foreground-secondary">
                {settings.size.toFixed(2)}x
              </span>
            </div>
            <Slider
              id="size"
              min={0.5}
              max={3}
              step={0.05}
              value={settings.size}
              onValueChange={(value) => onSettingsChange({ size: value })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
