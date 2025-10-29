# 部署指南

本项目是一个纯静态前端应用，可以部署到任何静态网站托管服务。

## 📦 构建生产版本

```bash
npm run build
```

构建完成后，`dist` 目录包含所有需要部署的文件。

## 🚀 部署选项

### 1. Vercel (推荐)

最简单的部署方式：

1. 将代码推送到 GitHub
2. 访问 [vercel.com](https://vercel.com)
3. 导入你的 GitHub 仓库
4. Vercel 会自动检测 Vite 项目并配置
5. 点击部署

或使用命令行：

```bash
npm install -g vercel
vercel
```

### 2. Netlify

1. 将代码推送到 GitHub
2. 访问 [netlify.com](https://netlify.com)
3. 点击 "New site from Git"
4. 选择你的仓库
5. 设置构建命令：`npm run build`
6. 设置发布目录：`dist`
7. 点击部署

或使用拖拽方式：

```bash
npm run build
```

然后直接将 `dist` 文件夹拖拽到 Netlify 的部署页面。

### 3. GitHub Pages

1. 修改 `vite.config.ts`，添加 base 配置：

```ts
export default defineConfig({
  base: '/your-repo-name/',
  plugins: [react()],
})
```

2. 构建项目：

```bash
npm run build
```

3. 部署到 GitHub Pages：

```bash
# 安装 gh-pages
npm install -g gh-pages

# 部署
gh-pages -d dist
```

### 4. 自己的服务器

将 `dist` 目录的内容上传到你的 Web 服务器。

**Nginx 配置示例：**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Apache 配置示例（.htaccess）：**

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### 5. Docker 部署

创建 `Dockerfile`：

```dockerfile
# 构建阶段
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

创建 `nginx.conf`：

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

构建和运行：

```bash
docker build -t watermark-app .
docker run -p 8080:80 watermark-app
```

## ⚙️ 环境变量

本项目是纯前端应用，不需要环境变量配置。所有处理都在浏览器本地完成。

## 🔧 构建优化

### 分析打包大小

```bash
npm run build
```

使用 [rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer) 分析：

```bash
npm install -D rollup-plugin-visualizer
```

在 `vite.config.ts` 中添加：

```ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ],
})
```

### CDN 加速

可以考虑将 `dist` 目录上传到 CDN，提高加载速度：

- Cloudflare
- AWS CloudFront
- 阿里云 CDN
- 腾讯云 CDN

## 📊 性能优化建议

1. **启用 Gzip/Brotli 压缩** - 在 Web 服务器配置中启用
2. **设置缓存策略** - 静态资源设置长期缓存
3. **使用 CDN** - 加速静态资源加载
4. **预加载关键资源** - 使用 `<link rel="preload">`
5. **懒加载组件** - 使用 React.lazy() 进行代码分割

## 🔒 安全建议

1. **HTTPS** - 始终使用 HTTPS
2. **CSP 头** - 配置内容安全策略
3. **安全头** - 添加 X-Frame-Options、X-Content-Type-Options 等
4. **CORS** - 如果需要，正确配置 CORS

## 📱 PWA 支持

如需添加 PWA 支持，可以安装 vite-plugin-pwa：

```bash
npm install -D vite-plugin-pwa
```

在 `vite.config.ts` 中配置：

```ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '批量图片水印工具',
        short_name: '水印工具',
        description: '完全本地处理的批量图片水印工具',
        theme_color: '#2563eb',
        icons: [
          {
            src: '/images/logo.ico',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
```

## 🆘 常见问题

### 部署后页面空白

- 检查 `base` 配置是否正确
- 检查浏览器控制台是否有错误
- 确认静态资源路径正确

### 刷新页面 404

- 需要配置服务器重定向所有路由到 index.html
- 参考上面的 Nginx 或 Apache 配置

### 图片无法上传

- 这是前端应用，不涉及服务器上传
- 检查浏览器是否支持 File API
- 检查是否使用 HTTPS（某些浏览器功能需要）

---

需要帮助？欢迎提交 [Issue](https://github.com/your-repo/issues)！
