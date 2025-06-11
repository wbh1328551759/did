import { useEffect } from 'react'
import { useWalletStore } from '../store/walletStore'

/**
 * 钱包管理 Hook
 * 基于 zustand store 的钱包状态管理
 */
export const useWallet = () => {
  const {
    // 状态
    isConnected,
    walletType,
    account,
    publicKey,
    balance,
    network,
    isConnecting,
    connectionError,

    // 方法
    connectWallet,
    disconnectWallet,
    autoReconnect,
    refreshAccountInfo,
    getPublicKey,
    setupWalletListeners,
    clearConnectionError,
    handleNetworkChange
  } = useWalletStore()

  // 组件挂载时设置监听器和自动重连
  useEffect(() => {
    setupWalletListeners()

    // 页面加载时尝试自动重连
    const timer = setTimeout(() => {
      autoReconnect()
    }, 100) // 短延迟确保钱包扩展已加载

    return () => clearTimeout(timer)
  }, [setupWalletListeners, autoReconnect])

  /**
   * 连接钱包的包装方法，包含错误处理
   */
  const handleConnectWallet = async (walletType) => {
    try {
      const result = await connectWallet(walletType)

      if (!result.success) {
        // 根据错误类型显示不同的消息
        let errorMessage = result.error

        if (result.error.includes('not installed')) {
          const walletName = walletType === 'okx' ? 'OKX Wallet' : 'Unisat Wallet'
          const downloadUrl = walletType === 'okx' ? 'https://www.okx.com/web3' : 'https://unisat.io'
          errorMessage = `${walletName} 未安装。请从 ${downloadUrl} 安装`
        } else if (result.error.includes('rejected')) {
          errorMessage = '连接被拒绝。请重试并批准连接。'
        }

        throw new Error(errorMessage)
      }

      return result
    } catch (error) {
      console.error('钱包连接失败:', error)
      throw error
    }
  }

  /**
   * 格式化地址显示
   */
  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  /**
   * 格式化余额显示
   */
  const formatBalance = (balance) => {
    if (!balance) return '0'
    return `${(balance / 100000000).toFixed(8)} BTC`
  }

  return {
    // 状态
    isConnected,
    walletType,
    account,
    publicKey,
    balance,
    network,
    isConnecting,
    connectionError,

    // 方法
    connectWallet: handleConnectWallet,
    disconnectWallet,
    refreshAccountInfo,
    getPublicKey,
    clearConnectionError,
    handleNetworkChange,

    // 工具方法
    formatAddress,
    formatBalance,

    // 计算属性
    formattedAddress: formatAddress(account),
    formattedBalance: formatBalance(balance),
  }
}

/**
 * 钱包连接状态 Hook
 * 仅返回连接状态，用于不需要完整钱包功能的组件
 */
export const useWalletConnection = () => {
  const { isConnected, walletType, account, publicKey } = useWalletStore()

  return {
    isConnected,
    walletType,
    account,
    publicKey
  }
}
