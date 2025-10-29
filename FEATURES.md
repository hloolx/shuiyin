# 功能特性详解

## ✅ 功能完整性对比

| 功能 | 原项目 | React 重构版 | 说明 |
|------|--------|-------------|------|
| 图片上传 | ✅ | ✅ | 支持点击和拖拽上传 |
| 多图处理 | ✅ | ✅ | 可同时处理多张图片 |
| 图片预览 | ✅ | ✅ | 实时预览水印效果 |
| 水印文字 | ✅ | ✅ | 自定义水印文字（最多30字符） |
| 颜色选择 | ✅ | ✅ | 支持颜色选择器和手动输入 |
| 透明度调节 | ✅ | ✅ | 0-1，步长0.05 |
| 旋转角度 | ✅ | ✅ | -90°到90°，步长3° |
| 水印间隔 | ✅ | ✅ | 1-8，步长0.2 |
| 字号大小 | ✅ | ✅ | 0.5-3，步长0.05 |
| 实时预览 | ✅ | ✅ | 可开关的自动刷新 |
| 手动刷新 | ✅ | ✅ | 关闭自动刷新时可用 |
| 单张下载 | ✅ | ✅ | 下载当前预览图片 |
| 批量下载 | ✅ | ✅ | 下载选中的图片为ZIP |
| 全部导出 | ✅ | ✅ | 导出所有图片为ZIP |
| 图片选择 | ✅ | ✅ | 复选框选择图片 |
| 删除图片 | ✅ | ✅ | 单独删除不需要的图片 |
| 清空列表 | ✅ | ✅ | 一键清空所有图片 |
| 全选/取消 | ✅ | ✅ | 快速选择操作 |
| 进度显示 | ✅ | ✅ | 批量下载时显示进度 |
| 响应式设计 | ✅ | ✅ | 适配桌面和移动设备 |

## 🎨 组件架构

### UI 基础组件

**Button 按钮组件**
```typescript
// 支持多种变体和尺寸
<Button variant="primary | secondary | success | outline" size="sm | md | lg">
  按钮文字
</Button>
```

**Card 卡片组件**
```typescript
// 用于内容容器
<Card>
  <CardHeader>
    <CardTitle>标题</CardTitle>
  </CardHeader>
  <CardContent>
    内容区域
  </CardContent>
</Card>
```

**Input 输入框**
```typescript
// 统一的输入框样式
<Input
  type="text"
  placeholder="请输入..."
  value={value}
  onChange={handleChange}
/>
```

**Label 标签**
```typescript
// 表单标签
<Label htmlFor="input-id">
  标签文字
</Label>
```

**Slider 滑块**
```typescript
// 范围选择滑块
<Slider
  min={0}
  max={100}
  step={1}
  value={value}
  onValueChange={handleChange}
/>
```

**Checkbox 复选框**
```typescript
// 复选框组件
<Checkbox
  checked={checked}
  onCheckedChange={handleChange}
/>
```

### 业务组件

**Header 头部**
- 显示应用标题和版本信息
- 展示应用特性描述

**ImageUpload 图片上传**
- 点击上传功能
- 拖拽上传功能
- 文件类型验证
- 视觉反馈效果

**ImageList 图片列表**
- 显示已上传的图片
- 缩略图预览
- 文件名和大小显示
- 选择/删除操作
- 批量管理按钮

**WatermarkSettings 水印设置**
- 所有水印参数配置
- 实时预览开关
- 手动刷新按钮
- 参数值实时显示

**PreviewCanvas 预览区域**
- Canvas 渲染和显示
- 加载状态提示
- 空状态提示
- 点击下载功能

**DownloadButtons 下载按钮**
- 下载当前图片
- 下载选中图片
- 导出全部图片
- 按钮状态管理

**ProgressModal 进度弹窗**
- 处理进度显示
- 当前文件名
- 百分比进度条
- 模态遮罩层

**Footer 页脚**
- 原项目链接
- 开源协议信息
- 作者信息
- GitHub 链接

## 🔧 核心 Hooks

### useImageManager

**职责**：管理图片列表状态和操作

**状态**：
- `images` - 图片列表数组
- `currentImage` - 当前选中的图片
- `currentIndex` - 当前选中的索引
- `selectedImages` - 选中的图片列表

**方法**：
- `addImages()` - 添加图片
- `removeImage()` - 删除图片
- `clearAll()` - 清空所有
- `selectImage()` - 选中图片
- `toggleImageSelection()` - 切换选中状态
- `selectAll()` - 全选
- `deselectAll()` - 取消全选

**特点**：
- 自动管理预览 URL 的创建和释放
- 智能索引调整（删除后自动调整当前索引）
- 首次添加自动选中第一张

### useWatermark

**职责**：处理水印设置和预览生成

**状态**：
- `settings` - 水印配置对象
- `previewCanvas` - 预览 Canvas 元素
- `isAutoRefresh` - 自动刷新开关
- `isLoading` - 加载状态

**方法**：
- `updateSettings()` - 更新水印设置
- `toggleAutoRefresh()` - 切换自动刷新
- `manualRefresh()` - 手动刷新预览
- `generateCanvas()` - 生成指定图片的 Canvas
- `clearCache()` - 清除缓存

**特点**：
- Canvas 缓存机制（避免重复绘制）
- 自动/手动刷新模式
- 异步 Canvas 生成
- 性能优化

## 🛠️ 工具函数

### canvas.ts - Canvas 操作

**dataURItoBlob()**
- 将 DataURI 转换为 Blob 对象
- 用于文件下载

**generateFileName()**
- 生成带时间戳的文件名
- 格式：`原名_watermark_日期时间.png`

**formatFileSize()**
- 格式化文件大小显示
- 自动选择 B/KB/MB 单位

**makeRGBAColor()**
- 将十六进制颜色转换为 RGBA
- 支持透明度参数

**drawWatermark()**
- 核心水印绘制算法
- 平铺覆盖整个图片
- 自适应图片尺寸

**loadImageToCanvas()**
- 异步加载图片到 Canvas
- Promise 封装
- 自动清理资源

### download.ts - 下载功能

**downloadCanvas()**
- 下载单个 Canvas 为图片
- 使用 file-saver 库

**downloadMultipleAsZip()**
- 批量下载为 ZIP 文件
- 进度回调支持
- 使用 JSZip 库

### file.ts - 文件处理

**isValidImageFile()**
- 验证文件是否为支持的图片格式
- 支持：PNG、JPEG、GIF、WebP

**filterImageFiles()**
- 过滤文件列表，只保留图片
- 批量验证

**generateId()**
- 生成唯一 ID
- 用于图片标识

## 📊 状态管理

### 类型定义

```typescript
// 水印设置
interface WatermarkSettings {
  text: string;      // 水印文字
  color: string;     // 颜色（十六进制）
  alpha: number;     // 透明度 0-1
  angle: number;     // 旋转角度 -90~90
  space: number;     // 间隔 1-8
  size: number;      // 大小 0.5-3
}

// 图片文件
interface ImageFile {
  id: string;        // 唯一标识
  file: File;        // 原始文件
  preview: string;   // 预览 URL
  selected: boolean; // 是否选中
}

// 进度状态
interface ProgressState {
  isOpen: boolean;   // 是否显示
  current: number;   // 当前进度
  total: number;     // 总数
  fileName: string;  // 当前文件名
}
```

## 🎯 水印算法详解

### 绘制流程

1. **初始化 Canvas**
   - 设置 Canvas 尺寸等于原图
   - 清除内容
   - 绘制原图

2. **计算文字大小**
   ```typescript
   textSize = size × max(15, min(width, height) / 25)
   ```
   - 自适应不同图片尺寸
   - 最小15px，避免过小

3. **设置样式**
   - 粗体字体
   - RGBA 颜色（支持透明度）
   - 系统字体栈（包含中文）

4. **计算平铺范围**
   ```typescript
   step = √(width² + height²)  // 对角线长度
   xCount = ceil(step / (textWidth + margin))
   yCount = ceil(step / (space × textSize)) / 2
   ```

5. **绘制水印**
   - 移动到 Canvas 中心
   - 旋转指定角度
   - 双重循环平铺文字
   - 恢复变换状态

### 性能优化

- **Canvas 缓存**：相同配置不重复绘制
- **异步加载**：使用 Promise 避免阻塞
- **URL 清理**：及时释放 Object URL
- **按需生成**：只生成当前需要的预览

## 🎨 样式系统

### Tailwind CSS 工具类

使用 Tailwind 的优势：
- 快速开发
- 一致的设计系统
- 响应式支持
- 自动优化（PurgeCSS）

### 响应式断点

```css
sm: 640px   // 手机横屏
md: 768px   // 平板
lg: 1024px  // 桌面
xl: 1280px  // 大屏
2xl: 1536px // 超大屏
```

### 主题色

```css
primary: #2563eb (蓝色)
secondary: #64748b (灰色)
success: #059669 (绿色)
background: #f8fafc
```

## 🔐 隐私和安全

### 完全本地处理

- ✅ 所有操作在浏览器完成
- ✅ 不上传任何数据到服务器
- ✅ 不使用任何第三方 API
- ✅ 不收集用户信息
- ✅ 开源可审计

### 浏览器 API

使用的 API：
- File API - 文件读取
- Canvas API - 图片处理
- Blob API - 文件生成
- URL API - 对象 URL 管理

### 支持的浏览器

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 移动端适配

### 响应式布局

- 桌面（>= 1024px）：两栏布局
- 平板（768px-1023px）：单栏堆叠
- 手机（< 768px）：完全响应式

### 触摸优化

- 较大的点击区域
- 拖拽上传支持
- 滑块触摸友好
- 适配虚拟键盘

## 🚀 性能指标

### 构建大小

- gzip 压缩后约 100KB
- 首屏加载快速
- 代码分割优化

### 运行性能

- 图片处理本地完成
- Canvas 硬件加速
- React 虚拟 DOM 优化
- 按需渲染

---

需要了解更多技术细节？查看源代码或提交 [Issue](https://github.com/your-repo/issues)！
