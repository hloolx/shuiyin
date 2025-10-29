import type { WatermarkSettings as WatermarkSettingsType } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
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
    <Card>
      <CardHeader>
        <CardTitle>水印设置</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 水印文字和颜色 - 同一行 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
          {/* 水印文字 */}
          <div className="space-y-2">
            <Label htmlFor="text">水印文字</Label>
            <Input
              id="text"
              type="text"
              maxLength={30}
              placeholder="请输入水印文字（最多30个字符）"
              value={settings.text}
              onChange={(e) => onSettingsChange({ text: e.target.value })}
            />
          </div>

          {/* 颜色 */}
          <div className="space-y-2">
            <Label htmlFor="color">颜色</Label>
            <div className="flex items-center gap-2">
              <input
                id="color"
                type="color"
                value={settings.color}
                onChange={(e) => onSettingsChange({ color: e.target.value })}
                className="h-10 w-16 cursor-pointer rounded-md border border-gray-300"
              />
              <Input
                type="text"
                value={settings.color}
                onChange={(e) => onSettingsChange({ color: e.target.value })}
                className="w-28"
                placeholder="#2563eb"
              />
            </div>
          </div>
        </div>

        {/* 滑块控件 - 两列布局 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* 透明度 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="alpha">透明度</Label>
              <span className="text-sm font-medium text-gray-700">
                {settings.alpha.toFixed(2)}
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="angle">旋转角度</Label>
              <span className="text-sm font-medium text-gray-700">
                {settings.angle}°
              </span>
            </div>
            <Slider
              id="angle"
              min={-90}
              max={90}
              step={3}
              value={settings.angle}
              onValueChange={(value) => onSettingsChange({ angle: value })}
            />
          </div>

          {/* 水印间隔 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="space">水印间隔</Label>
              <span className="text-sm font-medium text-gray-700">
                {settings.space.toFixed(1)}
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="size">字号大小</Label>
              <span className="text-sm font-medium text-gray-700">
                {settings.size.toFixed(2)}
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
