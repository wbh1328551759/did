import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { walletManager } from '../utils/wallet'

/**
 * 钱包状态管理 Store
 * 使用 zustand 管理钱包连接状态、账户信息等
 * 通过 persist 中间件持久化到 localStorage
 */
export const useWalletStore = create(
  persist(
    (set, get) => ({
      // 钱包连接状态
      isConnected: false,
      walletType: null, // 'okx' | 'unisat'
      account: null, // 钱包地址
      publicKey: null, // 公钥
      
      // 钱包信息
      balance: null,
      network: null,
      
      // 连接状态
      isConnecting: false,
      connectionError: null,
      
      /**
       * 连接钱包
       * @param {string} walletType - 钱包类型 ('okx' | 'unisat')
       */
      connectWallet: async (walletType) => {
        set({ isConnecting: true, connectionError: null })
        
        try {
          const result = await walletManager.connectWallet(walletType)
          
          if (result.success) {
            // 获取公钥
            let publicKey = null
            try {
              publicKey = await walletManager.getPublicKey()
            } catch (e) {
              console.warn('Failed to get public key:', e)
            }
            
            set({
              isConnected: true,
              walletType,
              account: result.account,
              publicKey,
              network: result.network,
              isConnecting: false,
              connectionError: null
            })
            
            // 获取余额等其他信息
            get().refreshAccountInfo()
            
            return { success: true }
          } else {
            set({
              isConnecting: false,
              connectionError: result.error
            })
            return { success: false, error: result.error }
          }
        } catch (error) {
          const errorMessage = error.message || 'Failed to connect wallet'
          set({
            isConnecting: false,
            connectionError: errorMessage
          })
          return { success: false, error: errorMessage }
        }
      },
      
      /**
       * 断开钱包连接
       */
      disconnectWallet: () => {
        walletManager.disconnect()
        set({
          isConnected: false,
          walletType: null,
          account: null,
          publicKey: null,
          balance: null,
          network: null,
          connectionError: null
        })
      },
      
      /**
       * 自动重连钱包 (页面刷新后调用)
       */
      autoReconnect: async () => {
        const state = get()
        if (!state.walletType || state.isConnected) {
          return
        }
        
        console.log('Attempting auto-reconnect to', state.walletType)
        
        try {
          // 检查钱包是否仍然可用
          let isWalletAvailable = false
          
          if (state.walletType === 'okx') {
            isWalletAvailable = walletManager.okxWallet.isOKXWalletInstalled()
          } else if (state.walletType === 'unisat') {
            isWalletAvailable = walletManager.unisatWallet.isUnisatWalletInstalled()
          }
          
          if (isWalletAvailable) {
            await state.connectWallet(state.walletType)
          } else {
            console.warn('Wallet not available for auto-reconnect')
            // 清除存储的连接信息
            state.disconnectWallet()
          }
        } catch (error) {
          console.error('Auto-reconnect failed:', error)
          // 不清除存储信息，让用户手动重连
        }
      },
      
      /**
       * 刷新账户信息 (余额、网络等)
       */
      refreshAccountInfo: async () => {
        const state = get()
        if (!state.isConnected) return
        
        try {
          const accountInfo = await walletManager.getAccountInfo()
          if (accountInfo) {
            set({
              balance: accountInfo.balance,
              network: accountInfo.network,
              publicKey: accountInfo.publicKey || state.publicKey
            })
          }
        } catch (error) {
          console.error('Failed to refresh account info:', error)
        }
      },
      
      /**
       * 获取公钥 (如果还没有的话)
       */
      getPublicKey: async () => {
        const state = get()
        if (state.publicKey) {
          return state.publicKey
        }
        
        if (!state.isConnected) {
          return null
        }
        
        try {
          const publicKey = await walletManager.getPublicKey()
          if (publicKey) {
            set({ publicKey })
          }
          return publicKey
        } catch (error) {
          console.error('Failed to get public key:', error)
          return null
        }
      },
      
      /**
       * 监听账户变化
       */
      setupWalletListeners: () => {
        // 监听账户变化
        walletManager.onAccountsChanged((accounts) => {
          if (accounts.length === 0) {
            get().disconnectWallet()
          } else {
            set({ account: accounts[0] })
            // 账户变化时重新获取公钥
            setTimeout(() => {
              get().getPublicKey()
              get().refreshAccountInfo()
            }, 100)
          }
        })
        
        // 监听网络变化
        walletManager.onNetworkChanged((network) => {
          set({ network })
        })
      },
      
      /**
       * 清除连接错误
       */
      clearConnectionError: () => {
        set({ connectionError: null })
      }
    }),
    {
      name: 'wallet-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // 只持久化必要的状态
      partialize: (state) => ({
        walletType: state.walletType,
        // 注意：出于安全考虑，不存储敏感信息如 publicKey, account 等
        // 这些信息会在自动重连时重新获取
      }),
    }
  )
) 