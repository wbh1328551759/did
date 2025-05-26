import { useState } from 'react'
import okxLogo from '../assets/okx-logo.png'
import unisatLogo from '../assets/unisat-logo.png'

const WalletConnectModal = ({ isOpen, onClose, onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectingWallet, setConnectingWallet] = useState(null)

  const wallets = [
    {
      id: 'okx',
      name: 'OKX Wallet',
      icon: okxLogo,
      iconType: 'svg',
      description: 'Connect using OKX Wallet',
      downloadUrl: 'https://www.okx.com/web3'
    },
    {
      id: 'unisat',
      name: 'Unisat Wallet',
      icon: unisatLogo,
      iconType: 'svg',
      description: 'Connect using Unisat Wallet',
      downloadUrl: 'https://unisat.io'
    }
  ]

  const handleWalletConnect = async (walletId) => {
    setIsConnecting(true)
    setConnectingWallet(walletId)
    
    try {
      await onConnect(walletId)
      onClose()
    } catch (error) {
      console.error('Wallet connection failed:', error)
    } finally {
      setIsConnecting(false)
      setConnectingWallet(null)
    }
  }

  const handleClose = () => {
    if (!isConnecting) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="wallet-modal-overlay">
      <div className="wallet-modal-container">
        {/* 弹窗背景效果 */}
        <div className="wallet-modal-background">
          <div className="wallet-neural-network">
            <div className="wallet-neural-node node-1"></div>
            <div className="wallet-neural-node node-2"></div>
            <div className="wallet-neural-node node-3"></div>
            <div className="wallet-neural-connection connection-1"></div>
            <div className="wallet-neural-connection connection-2"></div>
          </div>
        </div>

        {/* 弹窗内容 */}
        <div className="wallet-modal-content">
          {/* 弹窗头部 */}
          <div className="wallet-modal-header">
            <div className="wallet-modal-title">
              <h2>Connect Wallet</h2>
              <div className="wallet-title-glow"></div>
            </div>
            <button 
              className="wallet-modal-close-btn"
              onClick={handleClose}
              disabled={isConnecting}
            >
              ✕
            </button>
          </div>

          {/* 弹窗主体 */}
          <div className="wallet-modal-body">
            <div className="wallet-description">
              <p>Choose a wallet to connect to BitCoin DID</p>
            </div>

            <div className="wallet-options">
              {wallets.map((wallet) => (
                <div 
                  key={wallet.id}
                  className={`wallet-option ${connectingWallet === wallet.id ? 'connecting' : ''}`}
                  onClick={() => !isConnecting && handleWalletConnect(wallet.id)}
                >
                  <div className="wallet-option-content">
                    <div className="wallet-option-icon">
                      {wallet.iconType === 'svg' ? (
                        <img src={wallet.icon} alt={wallet.name} style={{ width: '32px', height: '32px' }} />
                      ) : (
                        wallet.icon
                      )}
                    </div>
                    <div className="wallet-option-info">
                      <h3 className="wallet-option-name">{wallet.name}</h3>
                      <p className="wallet-option-description">{wallet.description}</p>
                    </div>
                    <div className="wallet-option-status">
                      {connectingWallet === wallet.id ? (
                        <div className="wallet-connecting-spinner"></div>
                      ) : (
                        <div className="wallet-connect-arrow">→</div>
                      )}
                    </div>
                  </div>
                  
                  {connectingWallet === wallet.id && (
                    <div className="wallet-connecting-overlay">
                      <div className="connecting-text">Connecting...</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="wallet-modal-footer">
              <p className="wallet-footer-text">
                Don't have a wallet? Download from the official websites above.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletConnectModal 