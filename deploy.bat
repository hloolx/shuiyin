@echo off
chcp 65001 >nul
echo ====================================
echo 水印项目 GitHub 部署脚本
echo ====================================
echo.

echo [1/6] 检查 Git 状态...
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未安装 Git
    echo 请先安装 Git: https://git-scm.com/
    pause
    exit /b 1
)
echo ✅ Git 已安装

echo.
echo [2/6] 初始化 Git 仓库...
if not exist .git (
    git init
    echo ✅ Git 仓库已初始化
) else (
    echo ⚠️ Git 仓库已存在，跳过初始化
)

echo.
echo [3/6] 添加所有文件到暂存区...
git add .
if errorlevel 1 (
    echo ❌ 错误: 添加文件失败
    pause
    exit /b 1
)
echo ✅ 文件已添加

echo.
echo [4/6] 创建提交...
git commit -m "重构: 使用 React + TypeScript 重构项目" -m "- 从 CoffeeScript 迁移到 TypeScript" -m "- 从原生 JavaScript 重构为 React 组件化架构" -m "- 使用 Vite 7.0 作为构建工具" -m "- 采用 Tailwind CSS 3.4 实现响应式设计" -m "- 引入 shadcn/ui 设计系统" -m "" -m "新增功能:" -m "- 批量导出功能" -m "- ZIP 打包导出" -m "- 实时预览优化" -m "- 进度提示和加载状态" -m "" -m "技术栈:" -m "- React 18.3" -m "- TypeScript 5.6" -m "- Vite 7.0" -m "- Tailwind CSS 3.4" -m "- JSZip + FileSaver"
if errorlevel 1 (
    echo ⚠️ 提交失败或没有变更
)
echo ✅ 提交已创建

echo.
echo [5/6] 配置远程仓库...
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    git remote add origin https://github.com/hloolx/shuiyin.git
    echo ✅ 远程仓库已添加
) else (
    git remote set-url origin https://github.com/hloolx/shuiyin.git
    echo ✅ 远程仓库已更新
)

echo.
echo ====================================
echo ⚠️ 警告: 即将强制推送到远程仓库
echo 这将覆盖远程仓库的所有内容！
echo ====================================
echo.
set /p confirm="确认推送? (输入 YES 继续): "
if not "%confirm%"=="YES" (
    echo ❌ 操作已取消
    pause
    exit /b 0
)

echo.
echo [6/6] 推送到 GitHub...
git push -u origin main --force
if errorlevel 1 (
    echo.
    echo ❌ 推送失败，可能的原因:
    echo 1. 没有权限访问仓库
    echo 2. 分支名称应该是 master 而不是 main
    echo 3. 网络连接问题
    echo.
    echo 尝试使用 master 分支推送...
    git push -u origin master --force
    if errorlevel 1 (
        echo ❌ 推送仍然失败
        echo.
        echo 请检查:
        echo - GitHub 账户权限
        echo - 网络连接
        echo - SSH Key 配置
        pause
        exit /b 1
    )
)

echo.
echo ====================================
echo ✅ 部署成功！
echo ====================================
echo.
echo 📌 下一步:
echo 1. 访问: https://github.com/hloolx/shuiyin
echo 2. 检查文件是否完整
echo 3. 更新仓库描述和标签
echo.
echo 🎉 部署完成！
pause
