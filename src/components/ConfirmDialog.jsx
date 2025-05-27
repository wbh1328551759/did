const ConfirmDialog = ({ 
  isOpen, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel", 
  onConfirm, 
  onCancel,
  type = "danger" // danger, warning
}) => {
  if (!isOpen) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconColor: 'var(--error-red)',
          confirmBtnClass: 'confirm-btn-danger'
        }
      case 'warning':
        return {
          iconColor: 'var(--accent-orange)',
          confirmBtnClass: 'confirm-btn-warning'
        }
      default:
        return {
          iconColor: 'var(--primary-cyan)',
          confirmBtnClass: 'confirm-btn-primary'
        }
    }
  }

  const typeStyles = getTypeStyles()

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog-container">
        {/* Background Effects */}
        <div className="confirm-dialog-background">
          <div className="confirm-neural-network">
            <div className="confirm-neural-node node-1"></div>
            <div className="confirm-neural-node node-2"></div>
            <div className="confirm-neural-connection connection-1"></div>
          </div>
        </div>

        {/* Dialog Content */}
        <div className="confirm-dialog-content">
          {/* Header */}
          <div className="confirm-dialog-header">
            <div className="confirm-dialog-icon" style={{ color: typeStyles.iconColor }}>
              {type === 'danger' ? '⚠️' : '❓'}
            </div>
            <h3 className="confirm-dialog-title">{title}</h3>
          </div>

          {/* Message */}
          <div className="confirm-dialog-message">
            <p>{message}</p>
          </div>

          {/* Actions */}
          <div className="confirm-dialog-actions">
            <button 
              className="confirm-cancel-btn"
              onClick={onCancel}
            >
              {cancelText}
            </button>
            <button 
              className={`confirm-confirm-btn ${typeStyles.confirmBtnClass}`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog 