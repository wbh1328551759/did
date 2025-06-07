# DID Hooks 使用说明

这个模块提供了完整的 DID (去中心化身份) API 功能，基于 SWR 和 Axios 构建，包含了所有必要的 Hook 来管理 DID 相关操作。

## 文件结构

```
src/
├── utils/
│   └── httpRequest.js          # 自定义 Axios 请求配置
├── types/
│   └── did.js                  # DID 相关数据类型定义
├── services/
│   └── didApi.js              # DID API 服务类
├── hooks/
│   └── useDID.js              # DID Hook 主文件
└── examples/
    └── DIDExample.jsx         # 使用示例组件
```

## 主要 Hook

### 1. `useDID()`
基础 DID 功能 Hook，提供创建、更新、推送交易等功能。

```javascript
import { useDID } from '../hooks/useDID.js';

const MyComponent = () => {
  const {
    // 数据
    summary,
    
    // 加载状态
    summaryLoading,
    creating,
    updating,
    pushing,
    
    // 错误状态
    summaryError,
    errors,
    
    // 方法
    createDID,
    updateDID,
    pushTransaction,
    refreshSummary,
    clearError,
  } = useDID();

  // 使用示例...
};
```

### 2. `useTransactionStatus(commitTxid, options)`
监控交易状态的 Hook。

```javascript
import { useTransactionStatus } from '../hooks/useDID.js';

const MyComponent = () => {
  const {
    txStatus,
    txStatusError,
    txStatusLoading,
    refreshTxStatus,
  } = useTransactionStatus('your-commit-txid');

  // 自动轮询 pending 状态的交易
};
```

### 3. `useMyDIDs(params, options)`
查询用户 DID 列表的 Hook。

```javascript
import { useMyDIDs } from '../hooks/useDID.js';

const MyComponent = () => {
  const {
    didList,
    didListError,
    didListLoading,
    refreshDIDList,
  } = useMyDIDs({
    address: 'user-address',
    // 或者
    publicKey: 'user-public-key'
  });
};
```

### 4. `useDIDManager(config)` ⭐ 推荐使用
组合所有 DID 功能的主 Hook，一站式解决方案。

```javascript
import { useDIDManager } from '../hooks/useDID.js';

const MyComponent = () => {
  const {
    // 包含所有上述 Hook 的功能
    summary,
    didList,
    txStatus,
    createDID,
    updateDID,
    pushTransaction,
    // ... 更多功能
  } = useDIDManager({
    address: 'user-address',
    publicKey: 'user-public-key',
    watchTxid: 'transaction-to-monitor'
  });
};
```

## API 方法详解

### 1. 创建 DID

```javascript
const handleCreateDID = async () => {
  try {
    const result = await createDID({
      spendAddr: 'bc1p...', // 用于支付费用的地址
      verificationCapabilities: 0, // 前端默认传0
      controlAddress: 'bc1p...', // P2TR控制地址
      subjectPublicKey: '0x123456...', // hex编码的公钥
      keyType: 'secp256k1', // 密钥类型
    });
    
    console.log('PSBT:', result.psbt);
    // 接下来需要签名PSBT并推送交易
  } catch (error) {
    console.error('创建失败:', error);
  }
};
```

### 2. 更新 DID

```javascript
const handleUpdateDID = async () => {
  try {
    const result = await updateDID({
      controlUtxo: 'txid:vout',
      spendAddr: 'bc1p...',
      controlAddress: 'bc1p...',
      vmUpdates: [
        { i: 0 }, // 删除第0个密钥
        { i: 1, k: 'z6Mkk8UN...' }, // 更新第1个密钥
        { k: 'z6Mkr158...', vr: 3 } // 添加新密钥
      ]
    });
    
    console.log('Commit PSBT:', result.commitPsbt);
    console.log('Reveal PSBT:', result.revealPsbt);
  } catch (error) {
    console.error('更新失败:', error);
  }
};
```

### 3. 推送交易

```javascript
const handlePushTransaction = async () => {
  try {
    const result = await pushTransaction({
      alias: '我的DID别名',
      commitPsbt: 'signed_commit_psbt_base64',
      revealPsbt: 'signed_reveal_psbt_base64', // 可选
    });
    
    console.log('Commit TxID:', result.commitTxid);
    console.log('Reveal TxID:', result.revealTxid);
  } catch (error) {
    console.error('推送失败:', error);
  }
};
```

## 常量和类型

### 验证能力常量

```javascript
import { VERIFICATION_CAPABILITIES } from '../types/did.js';

// 可以使用位运算组合多个能力
const capabilities = VERIFICATION_CAPABILITIES.AUTHENTICATION | 
                    VERIFICATION_CAPABILITIES.ASSERTION_METHOD;
```

### 交易状态常量

```javascript
import { TX_STATUS } from '../types/did.js';

// TX_STATUS.PENDING, TX_STATUS.ACTIVE, TX_STATUS.FAILED, TX_STATUS.UPDATE_FAILED
```

### 密钥类型常量

```javascript
import { KEY_TYPES } from '../types/did.js';

// KEY_TYPES.SECP256K1, KEY_TYPES.ED25519
```

## 环境配置

在你的项目根目录创建 `.env` 文件：

```env
# 开发环境
VITE_ENV=development

# 预发布环境
VITE_ENV=staging

# 生产环境
VITE_ENV=production
```

API 会根据环境自动选择相应的服务器：
- development/staging: `https://did-api-pre.geb.network`
- production: `https://did-api.geb.network`

## 错误处理

每个 Hook 都包含了完善的错误处理：

```javascript
const { errors, clearError } = useDID();

// 显示错误
if (errors.create) {
  console.error('创建DID错误:', errors.create);
}

// 清除特定错误
clearError('create');
```

## 自动数据更新

- 交易状态会自动轮询（pending 状态时每5秒检查一次）
- 推送交易成功后会自动刷新统计和列表数据
- 支持手动刷新所有数据

## 完整使用示例

参考 `src/examples/DIDExample.jsx` 文件，其中包含了所有功能的完整使用示例。

## 注意事项

1. **PSBT 签名**: Hook 只负责获取未签名的 PSBT，你需要在客户端进行签名
2. **交易监控**: 使用 `watchTxid` 可以自动监控交易状态变化
3. **缓存策略**: 使用了 SWR 的智能缓存，相同参数的请求会被自动去重
4. **错误重试**: SWR 会自动重试失败的请求
5. **内存管理**: Hook 会自动处理组件卸载时的清理工作

## 性能优化建议

1. 使用 `useDIDManager` 而不是多个独立 Hook 可以减少重复请求
2. 合理设置 SWR 的 `refreshInterval` 和 `dedupingInterval`
3. 及时清理不需要的错误状态以避免内存泄漏

## 功能特性

- ✅ DID 创建、更新、推送
- ✅ 交易状态实时监控
- ✅ 用户 DID 列表查询
- ✅ **PSBT 签名和交易处理**
- ✅ 多钱包支持 (OKX, Unisat)
- ✅ 自动错误处理和重试
- ✅ SWR 缓存和自动更新
- ✅ TypeScript 类型支持

## 安装依赖

```bash
npm install swr axios
```

## 基础使用

### 1. PSBT签名专用Hook

新增的 `usePsbtSigning` Hook 专门用于处理PSBT签名和交易广播：

```javascript
import { usePsbtSigning } from '../hooks/useDID'

function MyComponent() {
  const {
    // 操作方法
    signPsbt,
    signAndPushPsbt,
    
    // 状态
    isProcessing,
    error,
    lastSignedPsbt,
    lastTxId,
    
    // 工具方法
    clearError,
    
    // 钱包状态
    isWalletConnected,
    walletAccount,
    walletType
  } = usePsbtSigning()

  // 只签名PSBT
  const handleSignOnly = async () => {
    const result = await signPsbt(psbtHexString)
    if (result.success) {
      console.log('签名成功:', result.signedPsbt)
    }
  }

  // 签名并推送交易
  const handleSignAndPush = async () => {
    const result = await signAndPushPsbt(psbtHexString, txId)
    if (result.success) {
      console.log('交易ID:', result.txId)
    }
  }

  return (
    <div>
      {!isWalletConnected && <p>请先连接钱包</p>}
      <button onClick={handleSignOnly} disabled={isProcessing}>
        {isProcessing ? '签名中...' : '签名PSBT'}
      </button>
      <button onClick={handleSignAndPush} disabled={isProcessing}>
        {isProcessing ? '处理中...' : '签名并推送'}
      </button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  )
}
```

### 2. 钱包集成

使用新的钱包管理器进行连接和签名：

```javascript
import { walletManager } from '../utils/wallet'

// 连接钱包
const connectWallet = async (type) => {
  const result = await walletManager.connectWallet(type) // 'okx' 或 'unisat'
  if (result.success) {
    console.log('连接成功:', result.account)
  }
}

// 签名PSBT
const signPsbt = async (psbtData) => {
  try {
    const signedPsbt = await walletManager.signPsbt(psbtData)
    console.log('签名完成:', signedPsbt)
  } catch (error) {
    console.error('签名失败:', error)
  }
}
```

### 3. 完整的DID创建流程

```javascript
import { useDID, usePsbtSigning } from '../hooks/useDID'
import { walletManager } from '../utils/wallet'

function CreateDIDComponent() {
  const { createDID, isCreating } = useDID()
  const { signAndPushPsbt, isProcessing } = usePsbtSigning()

  const handleCreateDID = async () => {
    try {
      // 1. 创建DID获取PSBT
      const createResult = await createDID({
        alias: 'my-did',
        publicKey: '0x123...',
        verificationCapabilities: 1,
        address: walletManager.account
      })

      if (createResult?.psbt) {
        // 2. 签名并推送PSBT
        const result = await signAndPushPsbt(createResult.psbt, createResult.txId)
        
        if (result.success) {
          console.log('DID创建成功，交易ID:', result.txId)
        }
      }
    } catch (error) {
      console.error('创建DID失败:', error)
    }
  }

  return (
    <button 
      onClick={handleCreateDID} 
      disabled={isCreating || isProcessing}
    >
      {(isCreating || isProcessing) ? '处理中...' : '创建DID'}
    </button>
  )
} 