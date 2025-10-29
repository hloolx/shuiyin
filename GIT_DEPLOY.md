# GitHub 部署指南

## 📋 前提条件

确保你已经：
1. 安装了 Git
2. 配置了 GitHub 账户
3. 有 https://github.com/hloolx/shuiyin 仓库的推送权限

## 🚀 完整部署命令

### 方案 1：完全替换（推荐）

这个方案会删除远程仓库的所有历史记录，上传全新的项目：

```bash
# 进入项目目录
cd "c:\Users\12153\daima\添加水印\react-watermark"

# 初始化 Git 仓库（如果还没有初始化）
git init

# 添加所有文件到暂存区（会自动忽略 node_modules 和 .claude）
git add .

# 创建初始提交
git commit -m "重构: 使用 React + TypeScript 重构项目

- 从 CoffeeScript 迁移到 TypeScript
- 从原生 JavaScript 重构为 React 组件化架构
- 使用 Vite 7.0 作为构建工具
- 采用 Tailwind CSS 3.4 实现响应式设计
- 引入 shadcn/ui 设计系统

新增功能:
- 批量导出功能
- ZIP 打包导出
- 实时预览优化
- 进度提示和加载状态

技术栈:
- React 18.3
- TypeScript 5.6
- Vite 7.0
- Tailwind CSS 3.4
- JSZip + FileSaver
"

# 添加远程仓库
git remote add origin https://github.com/hloolx/shuiyin.git

# 强制推送到主分支（会覆盖远程所有内容）
git push -u origin main --force
```

### 方案 2：保留历史记录

如果你想保留原仓库的提交历史，使用这个方案：

```bash
# 进入项目目录
cd "c:\Users\12153\daima\添加水印\react-watermark"

# 克隆原仓库（会下载历史记录）
git clone https://github.com/hloolx/shuiyin.git temp_repo
cd temp_repo

# 删除所有文件（保留 .git 目录）
git rm -rf .
git clean -fdx

# 复制新项目的所有文件（除了 .git）
xcopy /E /I /Y "c:\Users\12153\daima\添加水印\react-watermark\*" . /EXCLUDE:"c:\Users\12153\daima\添加水印\react-watermark\.git"

# 添加所有文件
git add .

# 创建提交
git commit -m "重构: 使用 React + TypeScript 完全重构项目

基于 joyqi/sfz 项目进行现代化重构

技术升级:
- 从 CoffeeScript 迁移到 TypeScript 5.6
- 从原生 JavaScript 重构为 React 18 组件化架构
- 使用 Vite 7.0 替代传统构建工具
- 采用 Tailwind CSS 3.4 实现响应式设计
- 引入 shadcn/ui 设计系统

功能增强:
- 新增批量导出功能
- 新增 ZIP 打包导出
- 实时预览自动更新
- 进度提示和加载状态
- 优化的两栏布局设计

代码质量:
- 完整的 TypeScript 类型安全
- 模块化组件设计
- 自定义 Hooks 封装
- 工具函数分离
"

# 推送到远程
git push origin main
```

## 📝 命令说明

### 关键命令解释

1. **`git add .`**
   - 添加所有文件到暂存区
   - 会自动排除 `.gitignore` 中的文件（node_modules、.claude 等）

2. **`git commit -m "..."`**
   - 创建提交，包含详细的提交信息
   - 说明了技术栈变更和新增功能

3. **`git push -u origin main --force`**
   - `-u`: 设置上游分支
   - `origin`: 远程仓库名称
   - `main`: 主分支名称
   - `--force`: 强制推送，覆盖远程内容

## ⚠️ 注意事项

1. **使用 `--force` 会覆盖远程仓库**
   - 远程的所有文件和历史记录都会被删除
   - 确保你有权限进行此操作
   - 建议先备份原仓库

2. **分支名称**
   - 如果你的仓库使用 `master` 而不是 `main`，请替换命令中的分支名

3. **验证 .gitignore**
   - 确认 `.gitignore` 包含以下内容：
     ```
     node_modules
     dist
     .claude
     ```

4. **推送前检查**
   ```bash
   # 查看将要提交的文件
   git status

   # 查看文件大小
   git count-objects -vH
   ```

## 🔍 验证部署

推送成功后，访问以下链接验证：

1. **GitHub 仓库**: https://github.com/hloolx/shuiyin
2. 检查文件是否完整
3. 检查 README.md 显示是否正常
4. 确认 node_modules 和 .claude 没有被上传

## 🆘 常见问题

### 问题 1: 权限被拒绝
```
ERROR: Permission to hloolx/shuiyin.git denied
```

**解决方案**:
```bash
# 使用 SSH 方式（需要配置 SSH key）
git remote set-url origin git@github.com:hloolx/shuiyin.git

# 或使用 HTTPS 方式（会提示输入用户名和密码）
git remote set-url origin https://github.com/hloolx/shuiyin.git
```

### 问题 2: 分支名称不匹配
```
ERROR: src refspec main does not match any
```

**解决方案**:
```bash
# 检查当前分支名
git branch

# 如果是 master，使用 master 推送
git push -u origin master --force
```

### 问题 3: 文件过大
```
ERROR: file is too large
```

**解决方案**:
```bash
# 检查是否误提交了 node_modules
git rm -rf --cached node_modules
git commit --amend
```

## 📌 推送后的工作

1. **设置 GitHub Pages**（可选）
   - 在仓库 Settings > Pages 中配置
   - 选择 main 分支的 /dist 目录
   - 需要先运行 `npm run build`

2. **更新仓库描述**
   - 在 GitHub 仓库页面添加描述
   - 添加主题标签：`react`, `typescript`, `watermark`, `image-processing`

3. **创建 Release**（可选）
   - 创建一个新的 Release（如 v2.0.0）
   - 标记为重构版本

## 🎉 完成

按照上述命令操作后，你的项目就会成功部署到 GitHub！
