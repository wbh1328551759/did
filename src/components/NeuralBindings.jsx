import { useState } from 'react'

const NeuralBindings = ({
  bindings,
  isEditing,
  onBindingChange,
  onCopyToClipboard,
  currentDID
}) => {
  const [newPublicKey, setNewPublicKey] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingMethods, setEditingMethods] = useState({}) // 跟踪正在编辑的验证方法

  const handleAddPublicKey = () => {
    if (newPublicKey.trim() && newPublicKey.trim().length >= 10) {
      // 通知父组件添加新的验证方法
      onBindingChange('add', {
        publicKey: newPublicKey.trim(),
        capabilities: 3 // 默认能力：AUTH + ASSERT + KEY_AGR (1+2+4=7)
      })
      setNewPublicKey('')
      setShowAddForm(false)
    }
  }

  const handleRemoveVerificationMethod = (index) => {
    // 通知父组件删除验证方法
    onBindingChange('remove', { index })
  }

  const handleUpdateVerificationMethod = (index, field, value) => {
    // 通知父组件更新验证方法
    onBindingChange('update', {
      index,
      field,
      value
    })
  }

  const handleStartEditMethod = (index) => {
    setEditingMethods(prev => ({
      ...prev,
      [index]: true
    }))
  }

  const handleCancelEditMethod = (index) => {
    setEditingMethods(prev => {
      const newState = { ...prev }
      delete newState[index]
      return newState
    })
  }

  const handleSaveEditMethod = (index) => {
    setEditingMethods(prev => {
      const newState = { ...prev }
      delete newState[index]
      return newState
    })
  }

  const handleCancelAdd = () => {
    setNewPublicKey('')
    setShowAddForm(false)
  }

  // 获取能力标志位的描述
  const getCapabilitiesDescription = (capabilities) => {
    if (!capabilities) return 'N/A'

    const caps = []
    if (capabilities & 1) caps.push('AUTH')      // Authentication
    if (capabilities & 2) caps.push('ASSERT')   // Assertion Method
    if (capabilities & 4) caps.push('KEY_AGR')  // Key Agreement
    if (capabilities & 8) caps.push('CAP_INV')  // Capability Invocation
    if (capabilities & 16) caps.push('CAP_DEL') // Capability Delegation

    return caps.length > 0 ? caps.join(', ') : 'NONE'
  }

  // 获取公钥类型显示
  const getKeyTypeDisplay = (type) => {
    switch (type) {
      case 'Multikey':
        return 'MULTIKEY'
      case 'EcdsaSecp256k1VerificationKey2019':
        return 'SECP256K1'
      case 'Ed25519VerificationKey2020':
        return 'ED25519'
      default:
        return type || 'UNKNOWN'
    }
  }

  // 使用验证方法数据而不是简单的 bindings
  const verificationMethods = currentDID?.verificationMethods || []
  const publicKeys = Object.entries(bindings).filter(([key]) => key.startsWith('publicKey'))

  return (
    <div className="binding-panel" style={{ marginBottom: '2rem' }}>
      <div className="panel-header">
        <h3 className="panel-title">NEURAL BINDINGS</h3>
        <div className="binding-status">
          <span className="binding-count">{verificationMethods.length} ACTIVE</span>
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
        {/* 显示验证方法信息 */}
        {verificationMethods.map((vm, index) => {
          const isEditingThis = editingMethods[index]

          return (
            <div key={vm.id || index} className="binding-row verification-method">
              <div className="vm-header">
                <label className="binding-label">VERIFICATION METHOD {index + 1}:</label>
                <div className="vm-header-actions">
                  <span className="vm-type-badge">{getKeyTypeDisplay(vm.type)}</span>
                  {isEditing && !isEditingThis && (
                    <div className="vm-actions">
                      <button
                        onClick={() => handleStartEditMethod(index)}
                        className="edit-vm-btn"
                        title="Edit verification method"
                      >
                        ✏️
                      </button>
                      {verificationMethods.length > 1 && (
                        <button
                          onClick={() => handleRemoveVerificationMethod(index)}
                          className="remove-vm-btn"
                          title="Remove verification method"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  )}
                  {isEditingThis && (
                    <div className="vm-edit-actions">
                      <button
                        onClick={() => handleSaveEditMethod(index)}
                        className="save-vm-btn"
                        title="Save changes"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => handleCancelEditMethod(index)}
                        className="cancel-vm-btn"
                        title="Cancel edit"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 公钥 Hex */}
              {vm.publicKeyHex && (
                <div className="vm-field">
                  <label className="vm-field-label">PUBLIC KEY (HEX):</label>
                  {isEditingThis ? (
                    <div className="vm-edit-field">
                      <input
                        type="text"
                        defaultValue={vm.publicKeyHex}
                        onChange={(e) => handleUpdateVerificationMethod(index, 'publicKeyHex', e.target.value)}
                        className="neural-input vm-input"
                        placeholder="Enter public key hex..."
                      />
                    </div>
                  ) : (
                    <div className="binding-display">
                      <span className="binding-value">{vm.publicKeyHex}</span>
                      <button
                        onClick={() => onCopyToClipboard(vm.publicKeyHex)}
                        className="copy-btn-neural"
                        title="Copy public key hex"
                      >
                        📋
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 公钥 Multibase */}
              {vm.publicKeyMultibase && (
                <div className="vm-field">
                  <label className="vm-field-label">PUBLIC KEY (MULTIBASE):</label>
                  {isEditingThis ? (
                    <div className="vm-edit-field">
                      <input
                        type="text"
                        defaultValue={vm.publicKeyMultibase}
                        onChange={(e) => handleUpdateVerificationMethod(index, 'publicKeyMultibase', e.target.value)}
                        className="neural-input vm-input"
                        placeholder="Enter public key multibase..."
                      />
                    </div>
                  ) : (
                    <div className="binding-display">
                      <span className="binding-value">{vm.publicKeyMultibase}</span>
                      <button
                        onClick={() => onCopyToClipboard(vm.publicKeyMultibase)}
                        className="copy-btn-neural"
                        title="Copy public key multibase"
                      >
                        📋
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 能力 */}
              {vm.capabilities !== undefined && (
                <div className="vm-field">
                  <label className="vm-field-label">CAPABILITIES:</label>
                  {isEditingThis ? (
                    <div className="vm-edit-field">
                      <div className="capabilities-checkboxes">
                        <label className="capability-checkbox">
                          <input
                            type="checkbox"
                            checked={(vm.capabilities & 1) !== 0}
                            onChange={(e) => {
                              const newCapabilities = e.target.checked
                                ? vm.capabilities | 1
                                : vm.capabilities & ~1
                              handleUpdateVerificationMethod(index, 'capabilities', newCapabilities)
                            }}
                          />
                          <span>AUTH</span>
                        </label>
                        <label className="capability-checkbox">
                          <input
                            type="checkbox"
                            checked={(vm.capabilities & 2) !== 0}
                            onChange={(e) => {
                              const newCapabilities = e.target.checked
                                ? vm.capabilities | 2
                                : vm.capabilities & ~2
                              handleUpdateVerificationMethod(index, 'capabilities', newCapabilities)
                            }}
                          />
                          <span>ASSERT</span>
                        </label>
                        <label className="capability-checkbox">
                          <input
                            type="checkbox"
                            checked={(vm.capabilities & 4) !== 0}
                            onChange={(e) => {
                              const newCapabilities = e.target.checked
                                ? vm.capabilities | 4
                                : vm.capabilities & ~4
                              handleUpdateVerificationMethod(index, 'capabilities', newCapabilities)
                            }}
                          />
                          <span>KEY_AGR</span>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <span className="capabilities-value">{getCapabilitiesDescription(vm.capabilities)}</span>
                  )}
                </div>
              )}

              {/* ID */}
              {vm.id && (
                <div className="vm-field">
                  <label className="vm-field-label">ID:</label>
                  <div className="binding-display">
                    <span className="binding-value vm-id">{vm.id}</span>
                    <button
                      onClick={() => onCopyToClipboard(vm.id)}
                      className="copy-btn-neural"
                      title="Copy verification method ID"
                    >
                      📋
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* 如果没有验证方法，显示传统的公钥绑定 */}
        {verificationMethods.length === 0 && publicKeys.map(([key, value], index) => (
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
                placeholder="Enter new public key (hex or multibase)..."
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

        {/* 显示认证和断言方法引用 */}
        {(currentDID?.authentication?.length > 0 || currentDID?.assertion?.length > 0) && (
          <div className="binding-row references-section">
            <div className="references-header">
              <label className="binding-label">METHOD REFERENCES:</label>
            </div>

            {currentDID.authentication?.length > 0 && (
              <div className="vm-field">
                <label className="vm-field-label">AUTHENTICATION:</label>
                <div className="references-list">
                  {currentDID.authentication.map((ref, index) => (
                    <span key={index} className="reference-item">{ref}</span>
                  ))}
                </div>
              </div>
            )}

            {currentDID.assertion?.length > 0 && (
              <div className="vm-field">
                <label className="vm-field-label">ASSERTION:</label>
                <div className="references-list">
                  {currentDID.assertion.map((ref, index) => (
                    <span key={index} className="reference-item">{ref}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default NeuralBindings
