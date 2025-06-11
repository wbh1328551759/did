import { useEffect, useState } from 'react'
import { useWallet } from '../hooks/useWallet'

/**
 * 钱包网络监控组件
 * 用于监控和显示钱包网络变化信息
 */
const WalletNetworkMonitor = ({ showDebugInfo = false }) => {
  const { isConnected, network, account, walletType, refreshAccountInfo } = useWallet()
  const [networkHistory, setNetworkHistory] = useState([])
  const [accountHistory, setAccountHistory] = useState([])

  console.log('network', network)
  // 监控网络变化
  useEffect(() => {
    if (network) {
      setNetworkHistory(prev => {
        const newEntry = {
          network,
          timestamp: new Date().toLocaleTimeString(),
          id: Date.now()
        }
        return [newEntry, ...prev.slice(0, 4)] // 保持最新5条记录
      })
    }
  }, [network])

  // 监控账户变化
  useEffect(() => {
    if (account) {
      setAccountHistory(prev => {
        const newEntry = {
          account,
          timestamp: new Date().toLocaleTimeString(),
          id: Date.now()
        }
        return [newEntry, ...prev.slice(0, 4)] // 保持最新5条记录
      })
    }
  }, [account])

  const handleRefresh = () => {
    refreshAccountInfo()
  }

  if (!isConnected || !showDebugInfo) {
    return null
  }

  return (
    <div className="wallet-network-monitor">
      <div className="monitor-header">
        <h4>钱包网络监控 ({walletType})</h4>
        <button onClick={handleRefresh} className="refresh-btn">
          🔄 刷新
        </button>
      </div>

      <div className="monitor-content">
        <div className="current-status">
          <div className="status-item">
            <span className="label">当前网络:</span>
            <span className="value">{network || 'Unknown'}</span>
          </div>
          <div className="status-item">
            <span className="label">当前地址:</span>
            <span className="value">{account ? `${account.slice(0, 8)}...${account.slice(-6)}` : 'None'}</span>
          </div>
        </div>

        {networkHistory.length > 0 && (
          <div className="history-section">
            <h5>网络变化历史:</h5>
            <div className="history-list">
              {networkHistory.map(entry => (
                <div key={entry.id} className="history-item">
                  <span className="time">{entry.timestamp}</span>
                  <span className="network">{entry.network}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {accountHistory.length > 0 && (
          <div className="history-section">
            <h5>账户变化历史:</h5>
            <div className="history-list">
              {accountHistory.map(entry => (
                <div key={entry.id} className="history-item">
                  <span className="time">{entry.timestamp}</span>
                  <span className="account">{entry.account.slice(0, 8)}...{entry.account.slice(-6)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .wallet-network-monitor {
          position: fixed;
          top: 100px;
          right: 20px;
          width: 300px;
          background: rgba(0, 20, 40, 0.95);
          border: 1px solid #00d4ff;
          border-radius: 8px;
          padding: 16px;
          font-size: 12px;
          color: #00d4ff;
          z-index: 1000;
          backdrop-filter: blur(10px);
        }

        .monitor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .monitor-header h4 {
          margin: 0;
          color: #00d4ff;
          font-size: 14px;
        }

        .refresh-btn {
          background: rgba(0, 212, 255, 0.1);
          border: 1px solid #00d4ff;
          color: #00d4ff;
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 10px;
          cursor: pointer;
        }

        .refresh-btn:hover {
          background: rgba(0, 212, 255, 0.2);
        }

        .current-status {
          margin-bottom: 16px;
        }

        .status-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .label {
          color: #888;
        }

        .value {
          color: #00d4ff;
          font-family: monospace;
        }

        .history-section {
          margin-bottom: 12px;
        }

        .history-section h5 {
          margin: 0 0 8px 0;
          color: #00d4ff;
          font-size: 12px;
        }

        .history-list {
          max-height: 100px;
          overflow-y: auto;
        }

        .history-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
          padding: 2px 0;
          border-bottom: 1px solid rgba(0, 212, 255, 0.1);
        }

        .time {
          color: #666;
          font-size: 10px;
        }

        .network, .account {
          color: #00d4ff;
          font-family: monospace;
          font-size: 10px;
        }
      `}</style>
    </div>
  )
}

export default WalletNetworkMonitor
