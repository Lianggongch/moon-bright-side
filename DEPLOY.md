# GitHub上传和部署指南

## 📤 上传到GitHub

### 方法一：使用Git命令行（推荐）

1. **初始化Git仓库**
   ```bash
   cd "C:\Users\lenovo\Desktop\月之亮面"
   git init
   ```

2. **添加所有文件**
   ```bash
   git add .
   ```

3. **提交更改**
   ```bash
   git commit -m "Initial commit: 月之亮面项目"
   ```

4. **在GitHub上创建新仓库**
   - 访问 https://github.com/new
   - 仓库名称：`moon-bright-side` 或 `月之亮面`
   - 选择 Public 或 Private
   - **不要**勾选"Initialize this repository with a README"
   - 点击"Create repository"

5. **连接远程仓库并推送**
   ```bash
   git remote add origin https://github.com/你的用户名/仓库名.git
   git branch -M main
   git push -u origin main
   ```

### 方法二：使用GitHub Desktop

1. **下载GitHub Desktop**
   - 访问 https://desktop.github.com/
   - 下载并安装

2. **登录GitHub账户**

3. **添加本地仓库**
   - File → Add Local Repository
   - 选择项目文件夹：`C:\Users\lenovo\Desktop\月之亮面`

4. **提交并推送**
   - 填写提交信息
   - 点击"Commit to main"
   - 点击"Publish repository"

## 🌐 部署到GitHub Pages

### 方法一：使用GitHub Actions自动部署

1. **创建部署配置文件**

   在项目根目录创建 `.github/workflows/deploy.yml`：

   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
         
         - name: Install dependencies
           run: npm install
         
         - name: Build
           run: npm run build
         
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

2. **启用GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source选择：GitHub Actions
   - 保存

### 方法二：手动部署（简单HTML文件）

如果只是部署 `test-complete.html`：

1. **重命名文件**
   - 将 `test-complete.html` 重命名为 `index.html`

2. **推送到GitHub**

3. **启用GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source选择：Deploy from a branch
   - Branch选择：main
   - Folder选择：/ (root)
   - 点击 Save

4. **访问网站**
   - 几分钟后，访问：`https://你的用户名.github.io/仓库名/`

## 🔧 配置API密钥（重要！）

### 使用环境变量（推荐）

1. **创建 `.env` 文件**（不要提交到GitHub）
   ```
   VITE_IPGEOLOCATION_API_KEY=your-api-key
   VITE_VISUALCROSSING_API_KEY=your-api-key
   ```

2. **在代码中使用**
   ```typescript
   const IPGEOLOCATION_API_KEY = import.meta.env.VITE_IPGEOLOCATION_API_KEY;
   ```

3. **在GitHub设置Secrets**
   - 进入仓库 Settings → Secrets and variables → Actions
   - 添加 Secret：
     - `VITE_IPGEOLOCATION_API_KEY`
     - `VITE_VISUALCROSSING_API_KEY`

### 或者使用GitHub Secrets（GitHub Actions）

在 `.github/workflows/deploy.yml` 中使用：

```yaml
- name: Build
  run: npm run build
  env:
    VITE_IPGEOLOCATION_API_KEY: ${{ secrets.IPGEOLOCATION_API_KEY }}
    VITE_VISUALCROSSING_API_KEY: ${{ secrets.VISUALCROSSING_API_KEY }}
```

## 📝 注意事项

1. **不要提交API密钥**
   - 确保 `.env` 在 `.gitignore` 中
   - 不要在代码中硬编码API密钥

2. **HTTPS要求**
   - GitHub Pages自动提供HTTPS
   - GPS和陀螺仪API需要HTTPS环境

3. **CORS问题**
   - 确保API服务支持跨域请求
   - 或使用代理服务器

## 🚀 快速部署命令总结

```bash
# 1. 初始化Git
git init
git add .
git commit -m "Initial commit"

# 2. 连接GitHub（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/仓库名.git
git branch -M main
git push -u origin main

# 3. 在GitHub网页上启用Pages即可
```

## 📚 相关链接

- [GitHub Pages文档](https://docs.github.com/en/pages)
- [GitHub Actions文档](https://docs.github.com/en/actions)
- [Vite部署指南](https://vitejs.dev/guide/static-deploy.html)

