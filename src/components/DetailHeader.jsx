const DetailHeader = ({ 
  isLoaded, 
  alias, 
  hasUnsavedChanges, 
  isEditing, 
  isSaving, 
  onBack, 
  onEditToggle, 
  onCancelEdit 
}) => {
  return (
    <header className={`detail-header ${isLoaded ? 'loaded' : ''}`}>
      <button
        onClick={onBack}
        className="back-btn"
      >
        <span className="btn-icon">←</span>
        <span className="btn-text">BitCoin DID</span>
        <div className="btn-glow"></div>
      </button>
      
      <div className="header-center">
        <div className="identity-badge">
          <div className="badge-icon">₿</div>
          <div className="badge-info">
            <h1 className="identity-title">{alias}</h1>
            <div className="identity-status">
              <div className="status-dot active"></div>
              <span>ACTIVE</span>
              {hasUnsavedChanges && !isEditing && (
                <span className="unsaved-indicator">• 未保存</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="header-actions">
        <button 
          className={`action-btn primary-action ${isEditing ? 'active' : ''} ${isSaving ? 'saving' : ''}`}
          onClick={onEditToggle}
          disabled={isSaving}
        >
          <span className="btn-text">
            {isSaving ? 'SAVING...' : isEditing ? 'SAVE' : 'EDIT DID'}
          </span>
          <div className="btn-particles"></div>
        </button>
        {isEditing && (
          <button 
            className="cancel-btn"
            onClick={onCancelEdit}
          >
            <span className="btn-text">CANCEL</span>
          </button>
        )}
      </div>
    </header>
  )
}

export default DetailHeader 