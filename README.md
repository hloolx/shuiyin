<p align="center">
  <img src="public/images/watermark-icon.svg" width="100" height="100" alt="水印工具 Logo">
</p>

<h1 align="center">水印 - 批量图片水印工具</h1>

<p align="center">🎨 强大的批量图片水印在线工具</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-blue.svg?logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.6-blue.svg?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-7.0-646CFF.svg?logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/license-GPL--3.0-green.svg" alt="License">
  <img src="https://img.shields.io/badge/Author-阿懒同学-orange.svg" alt="Author">
</p>

<p align="center">🎮 在线演示：
  <a href="https://water.15o.cc" target="_blank">
  https://water.15o.cc
  </a>
</p>

## 📖 简介

现代化的批量图片水印工具，基于 React + TypeScript 重构自 [joyqi/sfz](https://github.com/joyqi/sfz)。完全本地处理，保护隐私，支持批量导出和 ZIP 打包。专为需要批量添加水印的用户设计，提供丰富的自定义选项和便捷的操作体验。

## ✨ 特性

- 🔒 **完全本地处理** - 所有操作都在浏览器中完成，不上传任何数据
- 🎨 **实时预览** - 即时查看水印效果
- 📦 **批量操作** - 支持同时处理多张图片
- 💾 **灵活导出** - 单张下载或批量打包为 ZIP
- 🎯 **拖拽上传** - 支持拖拽文件到页面上传
- 🎨 **自定义水印** - 可调整文字、颜色、透明度、角度、间隔、大小
- 📱 **响应式设计** - 完美适配桌面和移动设备

## 🛠️ 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 快速构建工具
- **Tailwind CSS v3** - 稳定的样式框架
- **shadcn/ui** - UI 组件库风格
- **JSZip** - ZIP 文件生成
- **file-saver** - 文件下载
- **lucide-react** - 图标库

## 📦 项目结构

```
react-watermark/
├── src/
│   ├── components/          # UI 组件
│   │   ├── ui/             # 基础 UI 组件
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Label.tsx
│   │   │   ├── Slider.tsx
│   │   │   └── Checkbox.tsx
│   │   ├── Header.tsx      # 头部
│   │   ├── ImageUpload.tsx # 图片上传
│   │   ├── ImageList.tsx   # 图片列表
│   │   ├── WatermarkSettings.tsx  # 水印设置
│   │   ├── PreviewCanvas.tsx      # 预览区域
│   │   ├── DownloadButtons.tsx    # 下载按钮
│   │   ├── ProgressModal.tsx      # 进度弹窗
│   │   └── Footer.tsx      # 页脚
│   ├── hooks/              # 自定义 Hooks
│   │   ├── useImageManager.ts  # 图片管理
│   │   └── useWatermark.ts     # 水印逻辑
│   ├── utils/              # 工具函数
│   │   ├── canvas.ts       # Canvas 操作
│   │   ├── download.ts     # 下载功能
│   │   └── file.ts         # 文件处理
│   ├── types/              # TypeScript 类型定义
│   │   └── index.ts
│   ├── lib/                # 库工具
│   │   └── utils.ts        # 通用工具
│   ├── App.tsx             # 主应用
│   ├── main.tsx            # 入口文件
│   └── index.css           # 全局样式
├── public/                 # 静态资源
│   └── images/            # 图标资源
├── index.html             # HTML 模板
├── package.json           # 依赖配置
├── tsconfig.json          # TypeScript 配置
├── vite.config.ts         # Vite 配置
├── tailwind.config.js     # Tailwind 配置
└── postcss.config.js      # PostCSS 配置
```

## 🚀 开始使用

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将运行在 `http://localhost:5173` (或其他可用端口)

### 生产构建

```bash
npm run build
```

构建产物将生成在 `dist` 目录

### 预览构建

```bash
npm run preview
```

## 💡 使用说明

1. **上传图片**
   - 点击上传区域选择图片
   - 或直接拖拽图片到上传区域
   - 支持 PNG、JPEG、GIF、WebP 格式

2. **设置水印**
   - 输入水印文字（最多30个字符）
   - 调整颜色、透明度、旋转角度
   - 调整水印间隔和字号大小
   - 开启实时预览自动更新效果

3. **预览效果**
   - 在右侧预览区查看水印效果
   - 点击图片可直接下载当前图片

4. **批量下载**
   - 选中需要的图片（默认全选）
   - 点击"下载选中图片"批量导出为 ZIP
   - 或点击"导出全部为 ZIP"导出所有图片

## 🎯 核心功能实现

### 组件化设计

所有 UI 元素都采用可复用的组件设计，遵循单一职责原则：

- **UI 组件** - 通用的 Button、Card、Input 等基础组件
- **业务组件** - ImageUpload、ImageList、WatermarkSettings 等功能组件
- **容器组件** - App.tsx 负责状态管理和组件编排

### 自定义 Hooks

- **useImageManager** - 管理图片列表、选择、删除等操作
- **useWatermark** - 处理水印设置、预览生成、Canvas 缓存等

### 工具函数模块

- **canvas.ts** - Canvas 操作、水印绘制、格式转换
- **download.ts** - 单张/批量下载、ZIP 打包
- **file.ts** - 文件验证、过滤、ID 生成

### 类型安全

使用 TypeScript 提供完整的类型定义，提高代码可维护性和开发体验。

## 🎨 设计特点

- **现代化 UI** - 采用 Tailwind CSS + shadcn/ui 风格，简洁美观
- **响应式布局** - 完美适配桌面、平板、手机
- **交互反馈** - 悬停效果、加载状态、进度提示
- **无障碍支持** - 语义化 HTML、键盘导航、ARIA 标签

## 📝 重构说明

本项目是对 [joyqi/sfz](https://github.com/joyqi/sfz) 的完全重构，主要改进：

### 技术升级
- ✅ 从 CoffeeScript 迁移到 TypeScript
- ✅ 从原生 JavaScript 重构为 React 组件化架构
- ✅ 使用现代化的 Vite 构建工具替代传统打包方案
- ✅ 采用 Tailwind CSS 实现响应式设计
- ✅ 引入 shadcn/ui 设计系统，提升 UI 一致性

### 功能增强
- ✅ **新增批量导出功能** - 支持选中图片批量下载
- ✅ **新增 ZIP 打包导出** - 一键打包所有图片
- ✅ 实时预览功能优化 - 自动更新预览
- ✅ 更好的用户交互 - 进度提示、加载状态
- ✅ 优化的布局设计 - 紧凑的两栏布局

### 代码质量
- ✅ 完整的 TypeScript 类型安全
- ✅ 模块化组件设计
- ✅ 自定义 Hooks 封装状态逻辑
- ✅ 工具函数分离，提高可维护性

### 对比表格

| 特性 | 原项目 (sfz) | 本项目 |
|------|--------|-------------|
| 框架 | 原生 JS + CoffeeScript | React 18 + TypeScript |
| 样式 | 原生 CSS | Tailwind CSS 3.4 |
| 组件化 | 无 | 完全组件化 |
| 类型安全 | 无 | TypeScript 严格模式 |
| 状态管理 | 全局变量 | React Hooks |
| 代码组织 | 单文件 | 模块化分层 |
| 开发体验 | 手动编译 | Vite HMR |
| 批量导出 | ❌ | ✅ |
| ZIP 打包 | ❌ | ✅ |

## CDN赞助

本项目的 CDN 加速和安全保护由腾讯 EdgeOne 赞助

<a href="https://edgeone.ai/?from=github" target="_blank">
    最佳亚洲 CDN、Edge 和安全解决方案 - 腾讯 EdgeOne
<img src="https://edgeone.ai/media/34fe3a45-492d-4ea4-ae5d-ea1087ca7b4b.png" width="500" height="100">
</a>

## 👨‍💻 作者

- **阿懒同学** - [GitHub @hloolx](https://github.com/hloolx)
- **个人博客** - [www.alantx.cn](https://www.alantx.cn)

## 🙏 致谢

本项目基于 [joyqi/sfz](https://github.com/joyqi/sfz) 优化改进，感谢原项目作者的贡献。

- 原项目: [joyqi/sfz](https://github.com/joyqi/sfz)
- UI 设计系统: [shadcn/ui](https://ui.shadcn.com/)

## 📄 开源协议

[GPL-3.0 License](LICENSE)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

如果这个项目对你有帮助，请给一个 ⭐ Star 支持一下！
