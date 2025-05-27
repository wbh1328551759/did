import { formatBitcoinAddress } from '../utils/wallet'

const PageHeader = ({ 
  isLoaded, 
  activeDIDCount, 
  walletConnected, 
  walletType, 
  walletAccount, 
  onConnectWallet, 
  onDisconnectWallet 
}) => {
  return (
    <header className={`app-header sci-fi-header ${isLoaded ? 'loaded' : ''}`}>
      <div className="header-content">
        <div className="header-title">
          <div className="title-icon">₿</div>
          <h1 className="title-text">BitCoin DID</h1>
          <div className="title-pulse"></div>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <div className="stat-value">
              {walletConnected ? activeDIDCount : 0}
            </div>
            <div className="stat-label">Active DIDs</div>
          </div>
        </div>
      </div>
      {walletConnected ? (
        <div className="wallet-connected">
          <div className="wallet-info">
            <span className="wallet-label">
              {walletType === 'okx' ? 'OKX Wallet' : 'Unisat Wallet'} - Bitcoin Mainnet
            </span>
            <span className="wallet-address">{formatBitcoinAddress(walletAccount)}</span>
          </div>
          <button className="disconnect-wallet-btn" onClick={onDisconnectWallet}>
            <span className="btn-text">DISCONNECT</span>
          </button>
        </div>
      ) : (
        <button 
          className="connect-wallet-btn" 
          onClick={onConnectWallet}
        >
          <span className="btn-text">CONNECT WALLET</span>
          <div className="btn-glow"></div>
        </button>
      )}
    </header>
  )
}

export default PageHeader 