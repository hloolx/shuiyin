# 🚀 部署到 main 分支并删除 master

## 📋 目标
- ✅ 推送到 main 分支（覆盖原内容）
- ✅ 删除远程的 master 分支
- ✅ 本地也切换到 main 分支

---

## 🎯 完整部署流程

在 PowerShell 中依次执行以下命令：

### 步骤 1: 提交当前改动

```powershell
cd "c:\Users\12153\daima\添加水印\react-watermark"
git add .
git commit -m "完善项目文档和页面信息

- 更新 README.md 头部 logo
- 添加腾讯云 EdgeOne 赞助信息
- 更新作者信息和博客链接
- 修正所有 GitHub 地址
- 页面 Footer 添加博客入口"
```

### 步骤 2: 将本地 master 重命名为 main

```powershell
git branch -M main
```

### 步骤 3: 强制推送到远程 main 分支（覆盖原内容）

```powershell
git push -u origin main --force
```

### 步骤 4: 删除远程的 master 分支

```powershell
git push origin --delete master
```

---

## 🔧 一键执行命令

直接复制以下完整命令到 PowerShell：

```powershell
cd "c:\Users\12153\daima\添加水印\react-watermark"; git add .; git commit -m "完善项目文档和页面信息"; git branch -M main; git push -u origin main --force; git push origin --delete master
```

---

## 📊 验证结果

### 1. 检查本地分支
```powershell
git branch
```
应该显示 `* main`

### 2. 检查远程分支
```powershell
git branch -r
```
应该只显示 `origin/main`

### 3. 查看当前状态
```powershell
git status
```
应该显示 `On branch main`

---

## 🌐 GitHub 仓库设置

推送成功后，访问 GitHub 设置默认分支：

1. 访问：https://github.com/hloolx/shuiyin/settings/branches
2. 确认 `main` 是默认分支
3. 如果不是，点击切换图标选择 `main`

---

## 💡 常见问题

### Q1: 如果提示 "nothing to commit"
直接跳过 commit，执行后面的命令：
```powershell
git branch -M main
git push -u origin main --force
git push origin --delete master
```

### Q2: 如果删除 master 失败
可能是 master 是默认分支，需要先在 GitHub 设置中将默认分支改为 main，然后再删除。

### Q3: 如何确认 main 是默认分支
```powershell
git remote show origin
```
查看 `HEAD branch` 应该是 `main`

---

## ✨ 最终效果

部署成功后：
- 🌿 只有 main 分支
- 🎨 README.md 显示精美头部和 logo
- 💰 包含腾讯云赞助信息
- 👨‍💻 显示作者信息和博客链接
- 📦 所有代码都是最新的重构版本

---

准备好后，直接复制上面的一键命令到 PowerShell 执行即可！🎉
