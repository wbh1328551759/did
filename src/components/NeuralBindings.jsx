import { useState } from 'react'

const NeuralBindings = ({ 
  bindings, 
  isEditing, 
  onBindingChange, 
  onCopyToClipboard 
}) => {
  const [newPublicKey, setNewPublicKey] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddPublicKey = () => {
    if (newPublicKey.trim() && newPublicKey.trim().length >= 10) {
      const newKey = `publicKey${Date.now()}`
      onBindingChange('add', { key: newKey, value: newPublicKey.trim() })
      setNewPublicKey('')
      setShowAddForm(false)
    }
  }

  const handleRemovePublicKey = (keyToRemove) => {
    onBindingChange('remove', keyToRemove)
  }

  const handleCancelAdd = () => {
    setNewPublicKey('')
    setShowAddForm(false)
  }

  const publicKeys = Object.entries(bindings).filter(([key]) => key.startsWith('publicKey'))

  return (
    <div className="binding-panel" style={{ marginBottom: '2rem' }}>
      <div className="panel-header">
        <h3 className="panel-title">NEURAL BINDINGS</h3>
        <div className="binding-status">
          <span className="binding-count">{publicKeys.length} ACTIVE</span>
          {isEditing && (
            <button
              onClick={() => setShowAddForm(true)}
              className="add-binding-btn"
              title="Add new public key"
            >
              ➕
            </button>
          )}
        </div>
      </div>
      <div className="panel-content">
        {publicKeys.map(([key, value], index) => (
          <div key={key} className="binding-row">
            <label className="binding-label">PUBLIC KEY {index + 1}:</label>
            {isEditing ? (
              <div className="binding-edit-row">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onBindingChange('update', { key, value: e.target.value })}
                  className="neural-input binding-input"
                  placeholder="Enter public key..."
                />
                {publicKeys.length > 1 && (
                  <button
                    onClick={() => handleRemovePublicKey(key)}
                    className="remove-binding-btn"
                    title="Remove this public key"
                  >
                    ➖
                  </button>
                )}
              </div>
            ) : (
              <div className="binding-display">
                <span className="binding-value">{value}</span>
                <button
                  onClick={() => onCopyToClipboard(value)}
                  className="copy-btn-neural"
                  title="Copy public key"
                >
                  📋
                </button>
              </div>
            )}
          </div>
        ))}
        
        {/* Add new public key form */}
        {isEditing && showAddForm && (
          <div className="binding-row add-form">
            <label className="binding-label">NEW PUBLIC KEY:</label>
            <div className="binding-edit-row">
              <input
                type="text"
                value={newPublicKey}
                onChange={(e) => setNewPublicKey(e.target.value)}
                className="neural-input binding-input"
                placeholder="Enter new public key..."
                autoFocus
              />
              <button
                onClick={handleAddPublicKey}
                className="confirm-add-btn"
                disabled={!newPublicKey.trim() || newPublicKey.trim().length < 10}
                title="Confirm add"
              >
                ✓
              </button>
              <button
                onClick={handleCancelAdd}
                className="cancel-add-btn"
                title="Cancel add"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NeuralBindings 