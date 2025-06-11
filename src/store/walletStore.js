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

      networkPollingInterval: null, // 添加这个字段

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

            // 连接成功后设置钱包监听器
            get().setupWalletEventListeners()

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
        console.log('Disconnecting wallet')

        // 停止网络状态轮询
        get().stopNetworkPolling()

        // 如果钱包已连接，先断开连接
        if (walletManager.isConnected) {
          walletManager.disconnect()
        }

        // 重置状态 (保留walletType以便自动重连)
        set({
          isConnected: false,
          account: null,
          balance: null,
          publicKey: null,
          network: null,
          connectionError: null,
          networkPollingInterval: null
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
       * 刷新账户信息 (余额、网络、账户地址等)
       */
      refreshAccountInfo: async () => {
        const state = get()
        if (!state.isConnected) return

        try {
          const accountInfo = await walletManager.getAccountInfo()
          if (accountInfo) {
            // 更新所有账户相关信息
            const updates = {
              balance: accountInfo.balance,
              network: accountInfo.network,
              publicKey: accountInfo.publicKey || state.publicKey
            }

            // 如果账户地址发生变化，也更新账户地址
            if (accountInfo.account && accountInfo.account !== state.account) {
              updates.account = accountInfo.account
              console.log('账户地址已更新:', accountInfo.account)
            }

            set(updates)
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
       * 监听账户和网络变化
       */
      setupWalletListeners: () => {
        console.log('Setting up wallet listeners and polling')

        // 只启动定期检查机制，因为事件监听器需要在连接后设置
        get().startNetworkPolling()
      },

      /**
       * 设置钱包事件监听器 (必须在连接成功后调用)
       */
      setupWalletEventListeners: () => {
        console.log('Setting up wallet event listeners')

        // 监听账户变化
        walletManager.onAccountsChanged((accounts) => {
          console.log('Accounts changed:', accounts)
          if (accounts.length === 0) {
            get().disconnectWallet()
          } else {
            const newAccount = accounts[0]
            const currentAccount = get().account

            // 如果账户发生变化，更新状态并刷新信息
            if (newAccount !== currentAccount) {
              set({ account: newAccount })

              // 账户变化时重新获取公钥和其他信息
              setTimeout(() => {
                get().getPublicKey()
                get().refreshAccountInfo()
              }, 100)
            }
          }
        })

        // 监听网络变化
        walletManager.onNetworkChanged((network) => {
          console.log('Network Change:', network)
          const currentNetwork = get().network

          // 如果网络发生变化，使用专门的处理方法
          if (network !== currentNetwork) {
            get().handleNetworkChange(network)
          }
        })

        // 监听钱包断开连接事件
        walletManager.onDisconnect?.(() => {
          console.log('Wallet disconnected')
          get().disconnectWallet()
        })
      },

      /**
       * 开始定期检查网络状态
       */
      startNetworkPolling: () => {
        const state = get()

        // 清除现有的轮询器
        if (state.networkPollingInterval) {
          clearInterval(state.networkPollingInterval)
        }

        // 每5秒检查一次网络状态
        const intervalId = setInterval(async () => {
          const currentState = get()
          if (!currentState.isConnected) {
            clearInterval(intervalId)
            return
          }

          try {
            const accountInfo = await walletManager.getAccountInfo()
            if (accountInfo && accountInfo.network !== currentState.network) {
              currentState.handleNetworkChange(accountInfo.network)
            }
          } catch (error) {
            console.error('Error:', error)
          }
        }, 5000)

        // 存储interval ID到状态中
        set({ networkPollingInterval: intervalId })
      },

      /**
       * 停止网络状态轮询
       */
      stopNetworkPolling: () => {
        const state = get()
        if (state.networkPollingInterval) {
          clearInterval(state.networkPollingInterval)
          set({ networkPollingInterval: null })
        }
      },

      /**
       * 处理网络变化，强制刷新所有相关信息
       */
      handleNetworkChange: async (newNetwork) => {
        const state = get()
        if (!state.isConnected) return


        // 更新网络状态
        set({ network: newNetwork })

        try {
          // 延迟一点时间让钱包状态稳定
          await new Promise(resolve => setTimeout(resolve, 200))

          // 重新获取完整的账户信息
          const accountInfo = await walletManager.getAccountInfo()
          if (accountInfo) {
            const updates = {
              account: accountInfo.account,
              balance: accountInfo.balance,
              network: accountInfo.network,
              publicKey: accountInfo.publicKey
            }

            set(updates)
          }

          // 如果公钥为空，单独尝试获取
          if (!accountInfo?.publicKey) {
            const publicKey = await walletManager.getPublicKey()
            if (publicKey) {
              set({ publicKey })
            }
          }
        } catch (error) {
          console.error('Error:', error)
        }
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
