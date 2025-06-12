const IdentityCore = ({
  alias,
  didDocument,
  isEditing,
  onAliasChange,
  onCopyToClipboard,
  currentDID
}) => {
  // 格式化时间显示
  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'N/A'
    const date = new Date(typeof timestamp === 'number' ? timestamp * 1000 : timestamp)
    return date.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC')
  }

  // 获取网络显示名称
  // const getNetworkDisplay = (currentDID) => {
  //   // 根据 DID 或其他信息判断网络
  //   if (currentDID?.did?.includes('testnet') || currentDID?.controllerAddress?.startsWith('tb1')) {
  //     return 'BITCOIN TESTNET'
  //   } else if (currentDID?.did?.includes('signet') || currentDID?.controllerAddress?.startsWith('tb1')) {
  //     return 'BITCOIN SIGNET'
  //   }
  //   return 'BITCOIN MAINNET'
  // }

  // 获取状态显示
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'active':
        return { text: 'ACTIVE', class: 'active' }
      case 'pending':
        return { text: 'PENDING', class: 'pending' }
      case 'failed':
        return { text: 'FAILED', class: 'failed' }
      default:
        return { text: 'UNKNOWN', class: 'unknown' }
    }
  }

  const statusInfo = getStatusDisplay(currentDID?.status)

  return (
    <div className="info-panel primary-panel" style={{ marginBottom: '2rem' }}>
      <div className="panel-header">
        <h3 className="panel-title">IDENTITY CORE</h3>
        <div className="panel-status">
          <div className={`status-indicator ${statusInfo.class}`}></div>
          <span className="status-text">{statusInfo.text}</span>
        </div>
      </div>
      <div className="panel-content">
        <div className="info-row">
          <label className="info-label">ALIAS:</label>
          {/*{isEditing ? (*/}
          {/*  <input*/}
          {/*    type="text"*/}
          {/*    value={alias}*/}
          {/*    onChange={(e) => onAliasChange(e.target.value)}*/}
          {/*    className="neural-input"*/}
          {/*    placeholder="Enter DID alias..."*/}
          {/*  />*/}
          {/*) : (*/}
            <span className="info-value">{alias || 'Unnamed DID'}</span>
          {/*)}*/}
        </div>
        <div className="info-row">
          <label className="info-label">FULL DID:</label>
          <div className="address-display">
            <span className="address-text">{didDocument.fullDid}</span>
            <button
              onClick={() => onCopyToClipboard(didDocument.fullDid)}
              className="copy-btn-neural"
              title="Copy full DID"
            >
              📋
            </button>
          </div>
        </div>
        <div className="info-row">
          <label className="info-label">CONTROLLER:</label>
          <div className="address-display">
            <span className="address-text">{currentDID?.controller || 'N/A'}</span>
            {currentDID?.controller && (
              <button
                onClick={() => onCopyToClipboard(currentDID.controller)}
                className="copy-btn-neural"
                title="Copy controller"
              >
                📋
              </button>
            )}
          </div>
        </div>
        <div className="info-row">
          <label className="info-label">CONTROLLER ADDRESS:</label>
          <div className="address-display">
            <span className="address-text">{currentDID?.controllerAddress || 'N/A'}</span>
            {currentDID?.controllerAddress && (
              <button
                onClick={() => onCopyToClipboard(currentDID.controllerAddress)}
                className="copy-btn-neural"
                title="Copy controller address"
              >
                📋
              </button>
            )}
          </div>
        </div>
        <div className="info-row">
          <label className="info-label">CONTROL UTXO:</label>
          <div className="address-display">
            <span className="address-text">{currentDID?.controlUtxo || 'N/A'}</span>
            {currentDID?.controlUtxo && (
              <button
                onClick={() => onCopyToClipboard(currentDID.controlUtxo)}
                className="copy-btn-neural"
                title="Copy control UTXO"
              >
                📋
              </button>
            )}
          </div>
        </div>
        <div className="info-row">
          <label className="info-label">NETWORK:</label>
          {/*<span className="info-value network-badge">{getNetworkDisplay(currentDID)}</span>*/}
          {/*todo*/}
          <span className="info-value network-badge">{'BITCOIN SIGNET'}</span>
        </div>
        <div className="info-row">
          <label className="info-label">CREATED:</label>
          <span className="info-value">{formatDateTime(currentDID?.createdAt)}</span>
        </div>
        {currentDID?.updatedAt && (
          <div className="info-row">
            <label className="info-label">UPDATED:</label>
            <span className="info-value">{formatDateTime(currentDID.updatedAt)}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default IdentityCore
