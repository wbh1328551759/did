# Vite + React 现代化前端框架

这是一个基于 Vite 和 React 构建的现代化前端项目，展示了当前最佳的开发实践和技术栈。

## ✨ 特性

- ⚡️ **Vite 驱动** - 极快的热重载和构建速度
- ⚛️ **React 19** - 使用最新的 React 版本和特性
- 🛣️ **React Router** - 客户端路由管理
- 🔍 **TanStack Query** - 强大的数据获取和状态管理
- 🎨 **现代化 UI** - 美观的用户界面和交互效果
- 📱 **响应式设计** - 适配各种设备屏幕
- 🎯 **TypeScript 就绪** - 支持 TypeScript 开发
- 🔧 **开发工具** - 完整的开发工具链

## 🚀 技术栈

- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [React](https://react.dev/) - 用户界面库
- [React Router](https://reactrouter.com/) - 路由管理
- [TanStack Query](https://tanstack.com/query) - 数据获取和状态管理
- [Axios](https://axios-http.com/) - HTTP 客户端
- [Lucide React](https://lucide.dev/) - 美观的图标库

## 📁 项目结构

```
src/
├── components/     # 可复用组件
│   ├── Navbar.jsx
│   └── Navbar.css
├── pages/         # 页面组件
│   ├── Home.jsx
│   ├── Home.css
│   ├── About.jsx
│   ├── About.css
│   ├── Contact.jsx
│   └── Contact.css
├── hooks/         # 自定义 Hooks
├── utils/         # 工具函数
├── App.jsx        # 应用主组件
├── App.css        # 全局样式
└── main.jsx       # 应用入口
```

## 🛠️ 安装和运行

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 http://localhost:3000 上运行

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

## 🌟 主要功能

### 首页 (Home)
- 现代化的 Hero 区域
- 功能特性展示
- 动态计数器示例
- 浮动动画卡片

### 关于页面 (About)
- 技术栈介绍
- 使用 React Query 进行数据获取
- 加载状态和错误处理
- 项目结构展示

### 联系页面 (Contact)
- 响应式联系表单
- 表单验证和提交状态
- 联系信息展示
- 成功提交反馈

## 🎨 设计特色

- **渐变背景** - 美观的渐变色彩方案
- **卡片设计** - 现代化的卡片布局
- **悬停效果** - 丰富的交互动画
- **响应式** - 完美适配移动端和桌面端
- **加载动画** - 优雅的加载状态指示器

## 📱 响应式设计

项目采用移动优先的响应式设计理念：

- **桌面端** (1200px+) - 完整的多列布局
- **平板** (768px - 1199px) - 自适应布局
- **移动端** (<768px) - 单列布局，优化触摸操作

## 🔧 开发指南

### 添加新页面

1. 在 `src/pages/` 目录下创建新的组件文件
2. 创建对应的 CSS 样式文件
3. 在 `src/App.jsx` 中添加路由配置
4. 在导航栏中添加链接

### 创建可复用组件

1. 在 `src/components/` 目录下创建组件
2. 遵循组件命名约定
3. 编写对应的样式文件
4. 导出组件供其他地方使用

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

**开始您的 React 开发之旅！** 🎉
