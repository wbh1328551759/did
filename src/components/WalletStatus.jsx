import { useWallet } from '../hooks/useWallet'
import { useDIDStore } from '../store/didStore'

/**
 * 钱包状态组件
 * 显示钱包连接状态、地址、余额等信息
 */
const WalletStatus = ({ 
  showBalance = true, 
  showNetwork = true,
  compact = false,
  className = ""
}) => {
  const {
    isConnected,
    walletType,
    account,
    publicKey,
    balance,
    network,
    isConnecting,
    connectionError,
    formattedAddress,
    formattedBalance,
    refreshAccountInfo,
    disconnectWallet
  } = useWallet()

  const { monitoringTxid, monitoringStatus } = useDIDStore()

  if (isConnecting) {
    return (
      <div className={`wallet-status wallet-connecting ${className}`}>
        <div className="flex items-center space-x-2">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <span className="text-sm text-gray-600">正在连接钱包...</span>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className={`wallet-status wallet-disconnected ${className}`}>
        <div className="text-sm text-gray-500">
          钱包未连接
        </div>
      </div>
    )
  }

  if (connectionError) {
    return (
      <div className={`wallet-status wallet-error ${className}`}>
        <div className="text-sm text-red-600">
          连接错误: {connectionError}
        </div>
      </div>
    )
  }

  return (
    <div className={`wallet-status wallet-connected ${className}`}>
      {compact ? (
        <div className="flex items-center space-x-3">
          {/* 钱包图标和类型 */}
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${
              walletType === 'okx' ? 'bg-blue-500' : 'bg-orange-500'
            }`}></div>
            <span className="text-xs text-gray-500 uppercase">
              {walletType}
            </span>
          </div>

          {/* 地址 */}
          <div className="text-sm font-mono">
            {formattedAddress}
          </div>

          {/* 监控状态 */}
          {monitoringTxid && (
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                monitoringStatus === 'pending' ? 'bg-yellow-500' :
                monitoringStatus === 'active' ? 'bg-green-500' :
                'bg-red-500'
              }`}></div>
              <span className="text-xs text-gray-500">监控中</span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {/* 钱包类型和状态 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                walletType === 'okx' ? 'bg-blue-500' : 'bg-orange-500'
              }`}></div>
              <span className="text-sm font-medium">
                {walletType === 'okx' ? 'OKX Wallet' : 'Unisat Wallet'}
              </span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            
            <button
              onClick={disconnectWallet}
              className="text-xs text-gray-500 hover:text-red-500 px-2 py-1 rounded"
            >
              断开
            </button>
          </div>

          {/* 地址 */}
          <div className="space-y-1">
            <div className="text-xs text-gray-500">地址</div>
            <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
              {account}
            </div>
          </div>

          {/* 公钥 */}
          {publicKey && (
            <div className="space-y-1">
              <div className="text-xs text-gray-500">公钥</div>
              <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded break-all">
                {publicKey}
              </div>
            </div>
          )}

          {/* 余额 */}
          {showBalance && balance !== null && (
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">余额</div>
              <div className="text-sm font-medium">
                {formattedBalance}
              </div>
            </div>
          )}

          {/* 网络 */}
          {showNetwork && network && (
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">网络</div>
              <div className="text-sm">
                {network}
              </div>
            </div>
          )}

          {/* 交易监控状态 */}
          {monitoringTxid && (
            <div className="border-t pt-2 space-y-1">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  monitoringStatus === 'pending' ? 'bg-yellow-500' :
                  monitoringStatus === 'active' ? 'bg-green-500' :
                  'bg-red-500'
                }`}></div>
                <div className="text-xs text-gray-500">
                  监控交易: {monitoringTxid.substring(0, 8)}...
                </div>
              </div>
              <div className="text-xs text-gray-400">
                状态: {
                  monitoringStatus === 'pending' ? '等待确认' :
                  monitoringStatus === 'active' ? '已确认' :
                  '失败'
                }
              </div>
            </div>
          )}

          {/* 刷新按钮 */}
          <div className="border-t pt-2">
            <button
              onClick={refreshAccountInfo}
              className="text-xs text-blue-500 hover:text-blue-700 w-full text-center py-1"
            >
              刷新账户信息
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default WalletStatus 