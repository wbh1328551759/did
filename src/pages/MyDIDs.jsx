import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const MyDIDs = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedDID, setSelectedDID] = useState(null)
  const [showUpdateMessage, setShowUpdateMessage] = useState(false)

  // DID数据状态
  const [dids, setDids] = useState([
    {
      id: '1',
      alias: 'Primary Neural Interface',
      did: 'did:btc:bc1q...x7k9',
      fullDid: 'did:btc:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      createdDate: '2024-03-15',
      status: 'active',
      type: 'primary',
      security: 'quantum-resistant',
      network: 'mainnet',
      confirmations: 2048
    },
    {
      id: '2',
      alias: 'Corporate Identity Matrix',
      did: 'did:btc:bc1p...m4n2',
      fullDid: 'did:btc:bc1p5d7rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8gwqrkm4n2kdh8s',
      createdDate: '2024-01-22',
      status: 'active',
      type: 'corporate',
      security: 'multi-sig',
      network: 'mainnet',
      confirmations: 4096
    },
    {
      id: '3',
      alias: 'Experimental Protocol',
      did: 'did:btc:pending...sync',
      fullDid: 'did:btc:pending-blockchain-synchronization',
      createdDate: '2024-12-20',
      status: 'syncing',
      type: 'experimental',
      security: 'quantum-resistant',
      network: 'mainnet',
      remainingBlocks: 3,
      progress: 67
    }
  ])

  useEffect(() => {
    setIsLoaded(true)
    
    // 处理从DIDDetail页面返回的更新
    if (location.state?.updatedDID) {
      const { updatedDID, showUpdateMessage: shouldShowMessage } = location.state
      
      // 更新DID数据
      setDids(prevDids => 
        prevDids.map(did => 
          did.id === updatedDID.id 
            ? { ...did, alias: updatedDID.alias }
            : did
        )
      )
      
      // 显示更新消息
      if (shouldShowMessage) {
        setShowUpdateMessage(true)
        setTimeout(() => setShowUpdateMessage(false), 3000)
      }
      
      // 清除location state
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const filteredDIDs = dids.filter(did => 
    did.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
    did.did.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleManageDID = (didId, alias) => {
    navigate(`/detail/${didId}`, { state: { alias } })
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // Add visual feedback here if needed
  }

  const getStatusDisplay = (did) => {
    if (did.status === 'syncing') {
      return `Syncing (${did.remainingBlocks} blocks remaining)`
    }
    return 'Active'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'var(--primary-cyan)'
      case 'syncing': return 'var(--accent-orange)'
      default: return 'var(--text-secondary)'
    }
  }

  const getTypeIcon = (type) => {
    // 所有DID卡片都使用BitCoin DID的logo
    return '₿'
  }

  return (
    <div className="page sci-fi-page">
      {/* Update success notification */}
      {showUpdateMessage && (
        <div className="update-notification">
          <div className="notification-content">
            <span className="notification-icon">🔄</span>
            <span className="notification-text">神经接口矩阵已更新</span>
          </div>
        </div>
      )}

      {/* Animated background elements */}
      <div className="page-background">
        <div className="neural-network">
          <div className="neural-node node-1"></div>
          <div className="neural-node node-2"></div>
          <div className="neural-node node-3"></div>
          <div className="neural-node node-4"></div>
          <div className="neural-connection connection-1"></div>
          <div className="neural-connection connection-2"></div>
          <div className="neural-connection connection-3"></div>
        </div>
      </div>

      {/* Header */}
      <header className={`app-header sci-fi-header ${isLoaded ? 'loaded' : ''}`}>
        <div className="header-content">
          <div className="header-title">
            <div className="title-icon">₿</div>
            <h1 className="title-text">BitCoin DID</h1>
            <div className="title-pulse"></div>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <div className="stat-value">{dids.length}</div>
              <div className="stat-label">Active DIDs</div>
            </div>
          </div>
        </div>
        <button className="connect-wallet-btn">
          <span className="btn-text">CONNECT WALLET</span>
          <div className="btn-glow"></div>
        </button>
      </header>

      <div className="page-content sci-fi-content">
        {/* Control Panel */}
        <div className={`control-panel ${isLoaded ? 'loaded' : ''}`}>
          <button className="register-btn">
            <span className="btn-icon">⚡</span>
            <span className="btn-text">INITIALIZE NEW DID</span>
            <div className="btn-particles"></div>
          </button>
          
          <div className="search-container">
            <div className="search-wrapper">
              <input
                type="search"
                placeholder="Scan DID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <div className="search-icon">🔍</div>
              <div className="search-beam"></div>
            </div>
          </div>
        </div>

        {/* DID Grid */}
        <div className={`did-grid ${isLoaded ? 'loaded' : ''}`}>
          {filteredDIDs.map((did, index) => (
            <div
              key={did.id}
              className={`did-card ${did.status} ${selectedDID === did.id ? 'selected' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedDID(selectedDID === did.id ? null : did.id)}
            >
              {/* Card Header */}
              <div className="card-header">
                <div className="card-type">
                  <span className="type-icon">{getTypeIcon(did.type)}</span>
                  <h3 className="did-alias">{did.alias}</h3>
                </div>
                <div className="card-status">
                  <div 
                    className="status-indicator"
                    style={{ backgroundColor: getStatusColor(did.status) }}
                  ></div>
                  <span className="status-text">{did.status.toUpperCase()}</span>
                </div>
              </div>

              {/* Title underline */}
              <div className="card-title">
                <div className="title-underline"></div>
              </div>

              {/* DID Information */}
              <div className="did-info">
                <div className="did-address">
                  <span className="info-label">DID ADDRESS:</span>
                  <div className="address-container">
                    <span className="address-text">{did.did}</span>
                    {did.status === 'active' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          copyToClipboard(did.fullDid)
                        }}
                        className="copy-btn"
                        title="Copy full DID"
                      >
                        📋
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Bar for Syncing */}
              {did.status === 'syncing' && (
                <div className="sync-progress">
                  <div className="progress-label">
                    <span>BLOCKCHAIN SYNC</span>
                    <span>{did.remainingBlocks} blocks left</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${did.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Card Footer */}
              <div className="card-footer">
                <div className="footer-info">
                  <div className="info-item">
                    <span className="info-label">CREATED:</span>
                    <span className="info-value">{did.createdDate}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">NETWORK:</span>
                    <span className="info-value">{did.network?.toUpperCase()}</span>
                  </div>
                  {did.confirmations && (
                    <div className="info-item">
                      <span className="info-label">CONFIRMATIONS:</span>
                      <span className="info-value">{did.confirmations.toLocaleString()}</span>
                    </div>
                  )}
                </div>
                
                {did.status === 'active' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleManageDID(did.id, did.alias)
                    }}
                    className="manage-btn"
                  >
                    <span>ACCESS DID</span>
                    <div className="btn-arrow">→</div>
                  </button>
                )}
              </div>

              {/* Card Glow Effect */}
              <div className="card-glow"></div>
              
              {/* Data Stream Effect */}
              <div className="card-stream">
                <div className="stream-particle stream-1"></div>
                <div className="stream-particle stream-2"></div>
                <div className="stream-particle stream-3"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDIDs.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>NO NEURAL PATTERNS DETECTED</h3>
            <p>Adjust your search parameters or initialize a new DID</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyDIDs 