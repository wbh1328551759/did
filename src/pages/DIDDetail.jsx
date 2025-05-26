import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

const DIDDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const [alias, setAlias] = useState(location.state?.alias || 'Primary Neural Interface')
  const [originalAlias, setOriginalAlias] = useState(location.state?.alias || 'Primary Neural Interface')
  const [isLoaded, setIsLoaded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  // Public Key binding
  const [bindings, setBindings] = useState({
    publicKey: '03a34b99f22c790c4e36b2b3c2c35a36db06226e41c692fc82b8b56ac1c540c5bd'
  })



  useEffect(() => {
    setIsLoaded(true)
    setOriginalAlias(location.state?.alias || 'Primary Neural Interface')
  }, [location.state?.alias])

  // 清除成功提示
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [saveSuccess])

  const didDocument = {
    "@context": ["https://www.w3.org/ns/did/v1", "https://w3id.org/security/suites/jws-2020/v1"],
    "id": "did:btc:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    "verificationMethod": [{
      "id": "did:btc:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh#keys-1", 
      "type": "EcdsaSecp256k1VerificationKey2019",
      "controller": "did:btc:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      "publicKeyHex": "03a34b99f22c790c4e36b2b3c2c35a36db06226e41c692fc82b8b56ac1c540c5bd"
    }],
    "authentication": ["did:btc:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh#keys-1"],
    "assertionMethod": ["did:btc:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh#keys-1"],
    "service": [{
      "id": "did:btc:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh#neural-interface",
      "type": "NeuralInterface",
      "serviceEndpoint": "https://neural.quantum.net/interface"
    }]
  }

  const handleBack = () => {
    // 如果有未保存的更改，传递新的alias回去
    const finalAlias = alias !== originalAlias ? alias : originalAlias
    navigate('/my-dids', { 
      state: { 
        updatedDID: { id, alias: finalAlias },
        showUpdateMessage: alias !== originalAlias && !isEditing
      } 
    })
  }

  const handleSave = async () => {
    if (alias.trim() === '') {
      alert('神经接口别名不能为空！')
      return
    }

    setIsSaving(true)
    
    try {
      // 模拟保存API调用
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 更新原始值
      setOriginalAlias(alias)
      setIsEditing(false)
      setSaveSuccess(true)
      
    } catch (error) {
      console.error('保存失败:', error)
      alert('神经链接更新失败，请重试！')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // 如果正在编辑，点击保存
      handleSave()
    } else {
      // 开始编辑
      setIsEditing(true)
      setSaveSuccess(false)
    }
  }

  const handleCancelEdit = () => {
    setAlias(originalAlias)
    setIsEditing(false)
    setSaveSuccess(false)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // Add visual feedback
  }

  const downloadDocument = () => {
    const dataStr = JSON.stringify(didDocument, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'neural-did-document.json'
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleBindingChange = (field, value) => {
    setBindings(prev => ({
      ...prev,
      [field]: value
    }))
  }



  const hasUnsavedChanges = alias !== originalAlias

  return (
    <div className="page sci-fi-detail-page">
      {/* Success notification */}
      {saveSuccess && (
        <div className="save-notification">
          <div className="notification-content">
            <span className="notification-icon">✅</span>
            <span className="notification-text">DID has been updated successfully</span>
          </div>
        </div>
      )}

      {/* Holographic background */}
      <div className="holographic-background">
        <div className="holo-grid"></div>
        <div className="data-particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
        </div>
      </div>

      {/* Header */}
      <header className={`detail-header ${isLoaded ? 'loaded' : ''}`}>
        <button
          onClick={handleBack}
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
            onClick={handleEditToggle}
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
              onClick={handleCancelEdit}
              disabled={isSaving}
            >
              <span className="btn-icon">✕</span>
              <span className="btn-text">CANCEL</span>
            </button>
          )}
        </div>
      </header>

      <div className="detail-content">


        {/* Content */}
        <div className={`tab-content ${isLoaded ? 'loaded' : ''}`}>
          {/* Identity Core */}
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
                    onChange={(e) => setAlias(e.target.value)}
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
                    onClick={() => copyToClipboard(didDocument.id)}
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

          {/* Bindings */}
          <div className="binding-panel" style={{ marginBottom: '2rem' }}>
            <div className="panel-header">
              <h3 className="panel-title">NEURAL BINDINGS</h3>
              <div className="binding-status">
                <span className="binding-count">1 ACTIVE</span>
              </div>
            </div>
            <div className="panel-content">
              {Object.entries(bindings).map(([key, value]) => (
                <div key={key} className="binding-row">
                  <label className="binding-label">{key.toUpperCase()}:</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleBindingChange(key, e.target.value)}
                      className="neural-input binding-input"
                      placeholder={`Enter ${key}...`}
                    />
                  ) : (
                    <div className="binding-display">
                      <span className="binding-value">{value}</span>
                      <button
                        onClick={() => copyToClipboard(value)}
                        className="copy-btn-neural"
                        title={`Copy ${key}`}
                      >
                        📋
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Document */}
          <div className="document-panel">
            <div className="panel-header">
              <h3 className="panel-title">DID DOCUMENT</h3>
              <button
                onClick={downloadDocument}
                className="download-btn"
              >
                <span className="btn-icon">⬇️</span>
                <span className="btn-text">DOWNLOAD</span>
              </button>
            </div>
            <div className="document-viewer">
              <pre className="document-code">
                <code>{JSON.stringify(didDocument, null, 2)}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className={`action-panel ${isLoaded ? 'loaded' : ''}`}>
          <button className="action-btn danger-action">
            <span className="btn-text">TERMINATE DID</span>
            <div className="btn-particles"></div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DIDDetail 