const DIDCard = ({ 
  did, 
  index, 
  selectedDID, 
  onSelect, 
  onCopyToClipboard, 
  onManageDID,
  onDeleteDID,
  onDismissWarning
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'var(--primary-cyan)'
      case 'pending': return 'var(--accent-orange)'
      case 'failed': return 'var(--error-red)'
      case 'active-update-failed': return 'var(--error-red)'
      default: return 'var(--text-secondary)'
    }
  }

  const getTypeIcon = (type) => {
    // 所有DID卡片都使用BitCoin DID的logo
    return '₿'
  }

  return (
    <div
      key={did.id}
      className={`did-card ${did.status} ${selectedDID === did.id ? 'selected' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => onSelect(selectedDID === did.id ? null : did.id)}
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
          <span className="status-text">
            {did.status === 'active-update-failed' ? 'ACTIVE (UPDATE FAILED)' : did.status.toUpperCase()}
          </span>
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
                  onCopyToClipboard(did.fullDid)
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

      {/* Progress Bar for Pending */}
      {did.status === 'pending' && (
        <div className="sync-progress">
          <div className="progress-label">
            <span>BLOCKCHAIN PENDING</span>
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

      {/* Error Message for Failed DIDs */}
      {did.status === 'failed' && (
        <div className="error-message">
          <div className="error-title">
            Transcation Execution FAILED
          </div>
          <div className="error-description">
            This transaction failed to execute on the blockchain and DID cannot be accessed.
          </div>
        </div>
      )}

      {/* Error Message for Update Failed DIDs */}
      {did.status === 'active-update-failed' && (
        <div className="error-message">
          <div className="error-title">
            BINDING UPDATE FAILED
          </div>
          <div className="error-description">
            DID is active but binding information update failed. You can dismiss this warning.
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
          {did.status === 'pending' && did.pendingTx && (
            <div className="info-item">
              <span className="info-label">PENDING TX:</span>
              <span className="info-value pending-tx">{did.pendingTx}</span>
            </div>
          )}
        </div>
        
        {did.status === 'active' && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onManageDID(did.id, did.alias)
            }}
            className="manage-btn"
          >
            <span>ACCESS DID</span>
            <div className="btn-arrow">→</div>
          </button>
        )}

        {did.status === 'active-update-failed' && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDismissWarning(did.id, did.alias)
            }}
            className="dismiss-btn"
          >
            <span>DISMISS</span>
          </button>
        )}

        {did.status === 'failed' && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDeleteDID(did.id, did.alias)
            }}
            className="delete-btn"
          >
            <span>DELETE DID</span>
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
  )
}

export default DIDCard 