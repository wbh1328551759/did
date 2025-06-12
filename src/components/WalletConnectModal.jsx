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
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor"
                     viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 mb-1">Address Type Requirement</p>
                  <p className="text-yellow-700">
                    This application only supports <strong>Taproot address</strong> (starts with bc1p).
                    Please ensure your wallet is switched to Taproot address type.
                  </p>
                </div>
              </div>
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
                        <img src={wallet.icon} alt={wallet.name} style={{width: '32px', height: '32px'}}/>
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
