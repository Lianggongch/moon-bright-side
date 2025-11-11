# 快速上传指南

## 🚀 三步上传到GitHub

### 第一步：在GitHub创建仓库
1. 访问 https://github.com/new
2. 仓库名：`moon-bright-side`
3. 选择 Public
4. **不要**勾选任何初始化选项
5. 点击 "Create repository"

### 第二步：在本地执行命令

打开 PowerShell 或 CMD，执行：

```bash
# 进入项目目录
cd "C:\Users\lenovo\Desktop\月之亮面"

# 初始化Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: 月之亮面项目"

# 连接GitHub（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/moon-bright-side.git

# 推送到GitHub
git branch -M main
git push -u origin main
```

### 第三步：启用GitHub Pages

1. 进入你的GitHub仓库
2. 点击 Settings → Pages
3. Source 选择：**Deploy from a branch**
4. Branch 选择：**main**
5. Folder 选择：**/ (root)**
6. 点击 Save

几分钟后，你的网站就可以在以下地址访问：
`https://你的用户名.github.io/moon-bright-side/`

## ⚠️ 重要提示

1. **API密钥**：如果使用API密钥，需要在GitHub仓库的Settings → Secrets中添加
2. **HTTPS**：GitHub Pages自动提供HTTPS，GPS和陀螺仪功能可以正常使用
3. **图片文件**：如果有图片文件，确保已包含在项目中

## 📱 测试

上传后，在手机上访问你的GitHub Pages地址测试功能！

