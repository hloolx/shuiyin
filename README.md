<p align="center">
  <img src="public/images/logo108.png" width="100" height="100" alt="水印工具 Logo">
</p>

<h1 align="center">水印 - 批量图片水印工具</h1>

<p align="center">🎨 强大的批量图片水印在线工具</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue.svg?logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.9-blue.svg?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-7.0-646CFF.svg?logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/license-GPL--3.0-green.svg" alt="License">
  <img src="https://img.shields.io/badge/Author-阿懒同学-orange.svg" alt="Author">
</p>

<p align="center">🎮 在线演示：
  <a href="https://in.wein.dev" target="_blank">
  https://in.wein.dev
  </a>
</p>

## 📖 简介

现代化的批量图片水印工具，基于 React + TypeScript 重构自 [joyqi/sfz](https://github.com/joyqi/sfz)。图片完全在浏览器本地处理，不上传任何数据。适合给身份证、证件照复印件加「仅供 XX 使用」水印，也适合作品图版权签名。

> v2.0 的需求拆解、问题清单与优化前后实测数据见 [docs/需求拆解与优化方案.md](docs/需求拆解与优化方案.md)。

## ✨ 特性

- 🔒 **完全本地处理** - 不上传、不留存，安装为 PWA 后断网可用
- ⚡ **实时预览不卡顿** - 预览按屏幕分辨率渲染，4000×3000 大图拖动滑块不掉帧；按住空格对比原图
- 🧩 **两种排列** - 平铺满图（可错位排列，更难被裁掉）或单个水印（九宫格定位，自动留安全边距）
- 📝 **常用文案模板** - 「仅供XX使用，他用无效」「复印无效」等一键填入
- 📦 **批量导出** - 保持原始分辨率，可选原格式 / JPG / PNG / WebP 与质量；多张自动打包 ZIP，可随时取消
- 🖱️ **多种导入方式** - 点击、拖拽到页面任意位置、Ctrl/⌘+V 粘贴截图、手机拍照
- ↩️ **可撤销** - 删除图片、恢复默认设置都能撤销；设置自动保存
- 📱 **移动端优化** - 预览吸顶、左右滑动切图、长按或系统分享保存到相册，兼容微信内置浏览器
- 🌗 **暗色模式** - 跟随系统，可手动切换
- ✨ **细腻动效** - 基于 Motion 的弹簧动画，系统开启「减少动态效果」时自动降级

## 🛠️ 技术栈

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS 3**（CSS 变量主题，支持暗色模式）
- **Motion** - 动画（特性包按需加载）
- **JSZip**（按需加载）+ **file-saver** - 打包与下载
- **lucide-react** - 图标

## 📦 项目结构

```
src/
├── core/                  # 与 React 无关的纯逻辑
│   ├── watermark.ts       # 水印绘制（平铺 / 单个）
│   ├── image.ts           # 图片解码、原图 LRU 缓存、缩略图
│   └── export.ts          # 原图渲染、批量 ZIP、文件命名
├── hooks/                 # 图片列表状态、设置持久化、拖拽粘贴、快捷键、主题
├── components/
│   ├── Landing.tsx        # 首页
│   ├── PreviewStage.tsx   # 预览舞台
│   ├── SettingsPanel.tsx  # 水印与导出设置
│   ├── ImageListPanel.tsx # 图片列表（桌面侧栏 / 移动抽屉）
│   ├── ...                # 导出弹窗、大图查看器、通知、拖拽遮罩等
│   └── ui/                # Button、Slider、Segmented、Switch、CheckMark
├── lib/                   # 常量、设置校验、toast、工具函数
├── types/
├── App.tsx
└── main.tsx
public/
├── sw.js                  # Service Worker（页面网络优先、静态资源缓存优先）
├── manifest.json
└── images/
```

## 🚀 开始使用

```bash
npm install
npm run dev       # 开发模式，默认 http://localhost:5173
npm run build     # 生产构建，产物在 dist/
npm run preview   # 预览构建产物
```

`vite.config.ts` 使用相对路径 `base: './'`，可部署在任意子目录。

### 部署到 Cloudflare Workers

生产地址：**https://in.wein.dev**，Worker 名称：`shuiyin`。
使用 Workers Static Assets 托管 `dist/`，图片处理仍全部在用户浏览器内完成。

```bash
npm ci
npx wrangler login  # 首次部署时登录有 wein.dev 权限的 Cloudflare 账号
npm run deploy     # 构建、上传静态资源并绑定自定义域名
```

部署配置保存在 `wrangler.jsonc`，域名绑定由 Cloudflare 管理 DNS 与 HTTPS 证书。
`public/_headers` 让页面和 Service Worker 每次检查更新，带哈希的 JS/CSS 使用长期缓存。
自动化环境可通过 `CLOUDFLARE_API_TOKEN` 提供部署凭据，不要将令牌写进仓库。

## 💡 使用说明

1. **添加图片**：点击选择、拖到页面任意位置、或直接粘贴截图；手机上可直接拍照。
2. **设置水印**：输入文字或点选模板，调整颜色、不透明度、字号；选择平铺或单个水印。
3. **预览**：左右箭头 / 键盘 ← → / 手机左右滑动切换图片；按住 👁 或空格对比原图；点击预览图查看原始尺寸。
4. **导出**：勾选要导出的图片（默认全选），点「导出所选」。只选一张时直接下载图片，多张打包为 ZIP。

### 键盘快捷键

| 按键 | 功能 |
|---|---|
| `←` / `→` | 上一张 / 下一张 |
| 按住 `空格` | 对比原图 |
| `Ctrl/⌘ + S` | 下载当前图片 |
| `Ctrl/⌘ + Shift + S` | 导出所选 |
| `Delete` | 移除当前图片（可撤销） |

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
| 框架 | 原生 JS + CoffeeScript | React 19 + TypeScript |
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
- UI 设计系统: [Arc](https://uiarc.dev/) 免费开源组件（MIT），通过 shadcn registry 安装。许可见 [docs/ARC-LICENSE.txt](docs/ARC-LICENSE.txt)。

## 📄 开源协议

[GPL-3.0 License](LICENSE)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

如果这个项目对你有帮助，请给一个 ⭐ Star 支持一下！
