# 月之亮面 (Moon Bright Side)

一个基于GPS、陀螺仪和天文学算法的网页应用，实时计算用户所在地点可以看见多大比例的月亮。

## 🌙 功能特点

- **精确月相计算**：基于Jean Meeus的《Astronomical Algorithms》实现精确的月相照明度计算
- **实时可见度**：结合GPS位置、设备方向、月亮位置、云量和月相，实时计算月亮可见度
- **陀螺仪支持**：使用设备陀螺仪检测设备指向方向，计算与月亮方向的夹角
- **月升月落时间**：显示当天的月升和月落时间，以及距离月升/月落的时间
- **响应式设计**：适配手机和桌面设备

## 📋 技术栈

- **前端框架**：React + TypeScript
- **样式**：Tailwind CSS
- **API服务**：
  - IPGeolocation Astronomy API - 获取月亮位置和月升月落时间
  - Visual Crossing Weather API - 获取云量数据
  - Nominatim API - 逆地理编码（坐标转城市名称）

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 📱 使用方法

1. **打开应用**：在手机浏览器中打开应用
2. **授权权限**：
   - 允许GPS位置访问
   - 点击"请求陀螺仪权限"按钮并授权
3. **指向月亮**：将手机指向月亮方向
4. **查看可见度**：应用会实时显示月亮可见度百分比

## 🔧 配置

### API密钥配置

在 `index.tsx` 和 `test-complete.html` 中配置您的API密钥：

```typescript
const IPGEOLOCATION_API_KEY = 'your-api-key';
const VISUALCROSSING_API_KEY = 'your-api-key';
```

### 获取API密钥

- **IPGeolocation**: https://ipgeolocation.io/
- **Visual Crossing**: https://www.visualcrossing.com/

## 📁 项目结构

```
月之亮面/
├── index.tsx                 # 主React组件
├── moonPhaseCalculator.ts    # 月相计算模块
├── tailwind.config.js        # Tailwind配置
├── tailwind.css             # Tailwind样式
├── test-complete.html       # 完整功能测试页面
└── README.md               # 项目说明文档
```

## 🧮 算法说明

### 月亮可见度计算公式

```
最终可见度 = (水平对齐度 × 高度角因子 × 云量因子 × 月相因子) / 100³
```

- **水平对齐度**：设备指向与月亮方向的水平夹角（0-30度范围内有效）
- **高度角因子**：月亮高度角（必须>0，越高越好）
- **云量因子**：云量越少，可见度越好（0-100%）
- **月相因子**：满月=100%，其他月相按比例降低

### 月相计算

使用精确的天文学算法：
- 基于儒略日（Julian Day）计算
- 考虑月球轨道偏心率、倾角等因素
- 使用Meeus算法计算新月时间

## 🌐 浏览器支持

- ✅ Chrome/Edge (Android/iOS)
- ✅ Safari (iOS 13+)
- ✅ Firefox (Android)
- ⚠️ 桌面浏览器（使用模拟数据）

## 📝 注意事项

1. **HTTPS要求**：GPS和陀螺仪API需要在HTTPS环境下使用（或localhost）
2. **权限要求**：需要用户授权GPS和陀螺仪权限
3. **iOS限制**：iOS 13+需要用户交互才能请求陀螺仪权限

## 📄 许可证

MIT License

## 👥 贡献

欢迎提交Issue和Pull Request！

## 🙏 致谢

- Jean Meeus - 《Astronomical Algorithms》
- IPGeolocation API
- Visual Crossing Weather API
- OpenStreetMap Nominatim API

