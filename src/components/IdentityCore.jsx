const IdentityCore = ({ 
  alias, 
  didDocument, 
  isEditing, 
  onAliasChange, 
  onCopyToClipboard 
}) => {
  return (
    <div className="info-panel primary-panel" style={{ marginBottom: '2rem' }}>
      <div className="panel-header">
        <h3 className="panel-title">IDENTITY CORE</h3>
        <div className="panel-status">
          <div className="status-indicator active"></div>
        </div>
      </div>
      <div className="panel-content">
        <div className="info-row">
          <label className="info-label">ALIAS:</label>
          {isEditing ? (
            <input
              type="text"
              value={alias}
              onChange={(e) => onAliasChange(e.target.value)}
              className="neural-input"
            />
          ) : (
            <span className="info-value">{alias}</span>
          )}
        </div>
        <div className="info-row">
          <label className="info-label">FULL DID:</label>
          <div className="address-display">
            <span className="address-text">{didDocument.id}</span>
            <button
              onClick={() => onCopyToClipboard(didDocument.id)}
              className="copy-btn-neural"
              title="Copy full DID"
            >
              📋
            </button>
          </div>
        </div>
        <div className="info-row">
          <label className="info-label">NETWORK:</label>
          <span className="info-value network-badge">BITCOIN MAINNET</span>
        </div>
        <div className="info-row">
          <label className="info-label">CREATED:</label>
          <span className="info-value">2024-03-15 09:42:33 UTC</span>
        </div>
      </div>
    </div>
  )
}

export default IdentityCore 