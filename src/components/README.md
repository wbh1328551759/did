# 组件化架构说明

## 概述
本项目已完成页面内容的组件化重构，将原本的大型页面文件拆分为可复用的小组件。

## 组件分类

### 布局组件 (Layout Components)
- **PageHeader**: 页面头部组件，包含标题、统计信息和钱包连接状态
- **ControlPanel**: 控制面板组件，包含操作按钮和搜索功能
- **BackgroundEffects**: 背景动画效果组件

### DID相关组件 (DID Components)
- **DIDCard**: DID卡片组件，显示单个DID的信息
- **DIDGrid**: DID网格容器组件，管理DID卡片的布局
- **EmptyState**: 空状态组件，显示无数据时的提示

### 首页组件 (Landing Components)
- **LandingHeader**: 首页品牌logo组件
- **HeroSection**: 主要内容区域组件
- **FeatureHighlights**: 功能亮点展示组件
- **LandingBackgroundEffects**: 首页背景动画效果组件

### 详情页组件 (Detail Components)
- **DetailHeader**: 详情页头部组件
- **DetailBackgroundEffects**: 详情页背景动画效果组件
- **IdentityCore**: 身份核心信息组件
- **NeuralBindings**: 神经绑定管理组件
- **DIDDocumentViewer**: DID文档查看器组件
- **ActionPanel**: 操作面板组件

### 通知组件 (Notification Components)
- **UpdateNotification**: 更新成功通知组件
- **SaveNotification**: 保存成功通知组件

### 模态框组件 (Modal Components)
- **InitializeDIDModal**: 初始化DID模态框
- **WalletConnectModal**: 钱包连接模态框

## 组件化优势

1. **可维护性**: 每个组件职责单一，易于维护和调试
2. **可复用性**: 组件可以在不同页面间复用
3. **可测试性**: 小组件更容易进行单元测试
4. **团队协作**: 不同开发者可以并行开发不同组件
5. **代码组织**: 代码结构更清晰，易于理解

## 使用方式

### 单独导入
```javascript
import PageHeader from '../components/PageHeader'
import DIDCard from '../components/DIDCard'
```

### 批量导入
```javascript
import { 
  PageHeader, 
  DIDCard, 
  BackgroundEffects 
} from '../components'
```

## 页面重构对比

### MyDIDs页面
- **重构前**: 456行单一文件
- **重构后**: 主页面逻辑 + 7个独立组件

### Landing页面  
- **重构前**: 130行单一文件
- **重构后**: 主页面逻辑 + 4个独立组件

### DIDDetail页面
- **重构前**: 330行单一文件
- **重构后**: 主页面逻辑 + 6个独立组件

## 注意事项

1. 组件间通过props传递数据和回调函数
2. 保持组件的纯函数特性，避免副作用
3. 合理使用组件组合，避免过度嵌套
4. 保持组件接口的稳定性，减少破坏性变更 