# Zustand 状态管理迁移指南

## 概述

项目已迁移到使用 Zustand 进行状态管理，替代了之前分散在各个组件中的本地状态。这个改进带来了以下好处：

- 🔄 **自动重连**: 页面刷新后钱包自动重连
- 📱 **持久化存储**: 钱包连接状态保存在 localStorage
- 🎯 **统一状态管理**: 钱包和 DID 状态集中管理
- 🔧 **更好的开发体验**: 类型安全和调试友好

## 状态架构

### 1. 钱包状态 (`src/store/walletStore.js`)

管理所有钱包相关的状态：

```javascript
// 主要状态
{
  isConnected: boolean,
  walletType: 'okx' | 'unisat' | null,
  account: string | null,     // 钱包地址
  publicKey: string | null,   // 公钥
  balance: number | null,     // 余额
  network: string | null,     // 网络
  isConnecting: boolean,      // 连接中状态
  connectionError: string | null
}

// 主要方法
{
  connectWallet: (walletType) => Promise,
  disconnectWallet: () => void,
  autoReconnect: () => Promise,          // 自动重连
  refreshAccountInfo: () => Promise,     // 刷新账户信息
  getPublicKey: () => Promise,          // 获取公钥
  setupWalletListeners: () => void      // 设置钱包监听器
}
```

### 2. DID 状态 (`src/store/didStore.js`)

管理所有 DID 操作相关的状态：

```javascript
// 主要状态
{
  // 交易监控
  monitoringTxid: string | null,
  monitoringStatus: 'pending' | 'active' | 'failed' | null,
  
  // 操作状态
  isCreating: boolean,
  isUpdating: boolean,
  isPushing: boolean,
  isProcessing: boolean,  // PSBT 签名等
  
  // 错误状态
  createError: string | null,
  updateError: string | null,
  pushError: string | null,
  psbtError: string | null,
  
  // 成功消息
  showSuccessMessage: boolean,
  successMessage: string
}

// 主要方法
{
  startMonitoring: (txid) => void,      // 开始监控交易
  stopMonitoring: () => void,           // 停止监控
  setCreatingState: (loading, error) => void,
  setUpdatingState: (loading, error) => void,
  setPushingState: (loading, error) => void,
  setProcessingState: (loading, error) => void,
  showSuccess: (message, duration) => void,
  hideSuccess: () => void
}
```

## 使用方式

### 1. 钱包管理

```jsx
import { useWallet } from '../hooks/useWallet'

const MyComponent = () => {
  const {
    isConnected,
    walletType,
    account,
    publicKey,
    connectWallet,
    disconnectWallet,
    isConnecting,
    connectionError,
    formattedAddress,
    formattedBalance
  } = useWallet()

  const handleConnect = async () => {
    try {
      await connectWallet('okx')
    } catch (error) {
      console.error('连接失败:', error)
    }
  }

  return (
    <div>
      {isConnected ? (
        <div>
          <p>钱包已连接: {formattedAddress}</p>
          <button onClick={disconnectWallet}>断开连接</button>
        </div>
      ) : (
        <button onClick={handleConnect} disabled={isConnecting}>
          {isConnecting ? '连接中...' : '连接钱包'}
        </button>
      )}
    </div>
  )
}
```

### 2. DID 管理

```jsx
import { useDIDManager } from '../hooks/useDID'
import { useDIDStore } from '../store/didStore'

const DIDComponent = () => {
  // 使用综合管理 Hook - 完全基于 zustand 状态管理
  const {
    didList,
    createDID,
    updateDID,
    txStatus,
    creating,
    updating,
    monitoringTxid,
    startMonitoring,
    stopMonitoring
  } = useDIDManager({
    enablePagination: true,
    initialPageSize: 20
    // 不需要传入 address、publicKey，自动从钱包状态获取
    // 不需要传入 watchTxid，直接使用 zustand store 的监控状态
  })

  // 使用 DID store 获取其他状态
  const {
    showSuccessMessage,
    successMessage,
    hideSuccess
  } = useDIDStore()

  // 开始监控新交易
  const handleCreateDID = async (params) => {
    const result = await createDID(params)
    if (result.commitTxid) {
      startMonitoring(result.commitTxid) // 开始监控交易
    }
  }

  return (
    <div>
      {/* DID 列表 */}
      {didList.map(did => (
        <div key={did.id}>{did.alias}</div>
      ))}
      
      {/* 监控状态 */}
      {monitoringTxid && (
        <div>正在监控交易: {monitoringTxid}</div>
      )}
      
      {/* 成功消息 */}
      {showSuccessMessage && (
        <div className="success-message">
          {successMessage}
          <button onClick={hideSuccess}>×</button>
        </div>
      )}
    </div>
  )
}
```

### 3. 仅获取连接状态

对于只需要检查钱包连接状态的组件：

```jsx
import { useWalletConnection } from '../hooks/useWallet'

const SimpleComponent = () => {
  const { isConnected, account, publicKey } = useWalletConnection()
  
  return (
    <div>
      {isConnected ? `已连接: ${account}` : '未连接'}
    </div>
  )
}
```

## 自动重连功能

### 实现原理

1. **持久化存储**: 钱包连接状态保存在 `localStorage`
2. **自动检测**: 页面加载时检查存储的连接状态
3. **智能重连**: 如果检测到之前连接过，自动尝试重连
4. **监听变化**: 监听钱包账户变化，自动更新状态

### 配置

```javascript
// 在 walletStore.js 中配置
persist(
  (set, get) => ({ /* store logic */ }),
  {
    name: 'wallet-storage',
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({
      // 只持久化必要的状态
      walletType: state.walletType,
      account: state.account,
      isConnected: state.isConnected
    })
  }
)
```

## 迁移要点

### 重要设计修正

**问题**: 之前的 `useDIDManager` 设计存在逻辑混乱：
- 试图从 config 参数获取 `address` 和 `publicKey`，但调用时没有传入
- 同时使用 `watchTxid` 参数和 `monitoringTxid` 状态，造成重复

**修正**: 现在完全基于 zustand 状态管理：
```jsx
// ❌ 之前的混乱设计
const didManager = useDIDManager({
  watchTxid: monitoringTxid  // 重复且混乱
})

// ✅ 现在的清晰设计  
const didManager = useDIDManager({
  enablePagination: true,
  initialPageSize: 20
  // address 和 publicKey 自动从钱包状态获取
  // 监控状态直接从 zustand store 管理
})
```

### 从组件本地状态迁移

**之前:**
```jsx
const [walletConnected, setWalletConnected] = useState(false)
const [walletAccount, setWalletAccount] = useState(null)
const [monitoringTxid, setMonitoringTxid] = useState(null)
```

**现在:**
```jsx
const { isConnected, account } = useWallet()
const { monitoringTxid } = useDIDStore()
```

### 从 walletManager 迁移

**之前:**
```jsx
import { walletManager } from '../utils/wallet'

useEffect(() => {
  if (walletManager.isConnected) {
    setWalletConnected(true)
    setWalletAccount(walletManager.account)
  }
}, [])
```

**现在:**
```jsx
// 自动获取和管理钱包状态，无需手动检查
const { isConnected, account } = useWallet()
```

## 调试和开发

### Zustand DevTools

安装 Redux DevTools 扩展可以监控状态变化：

```javascript
import { devtools } from 'zustand/middleware'

export const useWalletStore = create(
  devtools(
    persist(/* ... */),
    { name: 'wallet-store' }
  )
)
```

### 状态重置

在开发时可以手动重置状态：

```jsx
// 重置钱包状态
const { disconnectWallet } = useWallet()
const { stopMonitoring, hideSuccess } = useDIDStore()

const resetAll = () => {
  disconnectWallet()
  stopMonitoring()
  hideSuccess()
  // 清除 localStorage
  localStorage.removeItem('wallet-storage')
}
```

## 最佳实践

1. **使用合适的 Hook**: 
   - 完整功能用 `useWallet()`
   - 仅状态检查用 `useWalletConnection()`

2. **错误处理**: 
   - Hook 内部已处理大部分错误
   - 组件中只需处理业务逻辑错误

3. **性能优化**: 
   - Zustand 自动优化渲染
   - 避免在 render 中调用状态更新方法

4. **类型安全**: 
   - 使用 JSDoc 提供类型提示
   - 考虑迁移到 TypeScript

## 常见问题

### Q: 页面刷新后钱包没有自动重连？

A: 检查以下几点：
1. 钱包扩展是否已安装并启用
2. 浏览器是否允许 localStorage
3. 是否调用了 `setupWalletListeners()`

### Q: 状态更新不及时？

A: Zustand 状态更新是同步的，如果看起来不及时，检查：
1. 是否正确使用了 Hook
2. 是否在正确的组件中监听状态
3. 异步操作是否正确处理

### Q: 如何添加新的状态？

A: 在对应的 store 中添加：

```javascript
// 在 walletStore.js 或 didStore.js 中
export const useWalletStore = create(
  persist(
    (set, get) => ({
      // 现有状态...
      newState: null,
      
      // 新方法
      setNewState: (value) => set({ newState: value })
    }),
    // persist 配置...
  )
)
```

然后在 Hook 中暴露：

```javascript
// 在 useWallet.js 中
export const useWallet = () => {
  const { newState, setNewState, /* 其他状态... */ } = useWalletStore()
  
  return {
    // 现有返回值...
    newState,
    setNewState
  }
}
``` 