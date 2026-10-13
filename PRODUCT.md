# 水印工具

<!-- impeccable:product-schema 1 -->

## Platform

web

## Product Purpose

在浏览器中给证件、照片和作品图添加文字水印，支持批量处理与导出。用户确认本次重构保留全部现有功能，覆盖首页与编辑器。

## Capabilities and Constraints

- React 19、TypeScript、Vite、Tailwind CSS，部署在 Cloudflare Workers，生产域名 in.wein.dev。
- 图片在本机解码、预览与导出，不将原图传至服务器。
- 保留拖拽、粘贴、多选导入、拍照、设置记忆、撤销、平铺和单个水印、原图对比、原始分辨率导出、ZIP、快捷键、微信提示及 PWA。
- 桌面与移动端均需可用，保留浅色与深色主题、键盘操作和减少动态效果支持。

## Brand Commitments

名称为「水印」，作者阿懒同学。此次由用户指定 Arc UI（https://uiarc.dev/），采用其组件及交互规范；沿用项目标识和中文界面。

## Evidence on Hand

现有源码、README.md、docs/需求拆解与优化方案.md、public/images/ 内已有标识。F:/code/水印/_tools/ 中有生成的测试图片及功能验收脚本。

## Product Principles

- 图片隐私与原始清晰度优先。
- 预览与设置保持紧密关联，操作后即时反馈。
- 现有功能完整保留，首页与编辑器使用一致的组件语言。
- 不为界面重构增加账号、上传或付费流程。
