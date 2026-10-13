---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/components/Landing.tsx","src/components/SettingsPanel.tsx","src/index.css"]
---

# 首页与编辑器

Mode: Operate. 用户确认整体重构、保留功能、直接代码实现。参考 Arc UI 官方免费组件与已安装的 Arc skill。

## Direction contract

THESIS: 本地图片水印工作台。入口直接开始操作，预览与调节不分离。

OWN-WORLD: Arc 官方中性色 token、黑白主按钮、44px 控件、Geist/Inter 加中文系统字体。图片本身承担视觉焦点。

STORY: 选择图片，调整水印，即时预览，按原始分辨率导出。

FIRST VIEWPORT: 首页两列，左侧简明标题和三步说明，右侧大幅 Arc 文件投放区。导入后为左侧图片列表、中央可伸缩预览、右侧设置检查器；顶栏固定主要导出操作。移动端预览吸顶、设置在下、操作栏贴底。标志性交互是 Arc 连续移动的选择高亮与带数值反馈的滑块。

FORM: 用户指定 Arc UI，优先于种子 fecf1991 的探索结果。保留现有工作台操作结构，全部可见控件按 Arc 组件语法统一。

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
