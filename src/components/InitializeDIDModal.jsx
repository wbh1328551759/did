import { useState } from 'react'

const InitializeDIDModal = ({ isOpen, onClose, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    alias: '',
    publicKey: ''
  })
  const [errors, setErrors] = useState({})

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Alias是必填字段，任意字符任意长度
    if (!formData.alias.trim()) {
      newErrors.alias = 'Please enter an alias'
    }
    
    // Public Key现在是必填字段
    if (!formData.publicKey.trim()) {
      newErrors.publicKey = 'Public key is required'
    } else if (formData.publicKey.trim().length < 10) {
      newErrors.publicKey = 'Public key must be at least 10 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      // 直接调用父组件的提交函数，不需要内部的加载状态
      await onSubmit(formData)
      
      // 只有在成功时才重置表单
      setFormData({ alias: '', publicKey: '' })
      setErrors({})
    } catch (error) {
      console.error('DID initialization failed:', error)
      // 错误处理由父组件负责
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ alias: '', publicKey: '' })
      setErrors({})
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* 弹窗背景效果 */}
        <div className="modal-background">
          <div className="modal-neural-network">
            <div className="modal-neural-node node-1"></div>
            <div className="modal-neural-node node-2"></div>
            <div className="modal-neural-node node-3"></div>
            <div className="modal-neural-connection connection-1"></div>
            <div className="modal-neural-connection connection-2"></div>
          </div>
        </div>

        {/* 弹窗内容 */}
        <div className="modal-content">
          {/* 弹窗头部 */}
          <div className="modal-header">
            <div className="modal-title">
              <span className="modal-icon">⚡</span>
              <h2>Initialize New DID</h2>
              <div className="title-glow"></div>
            </div>
            <button 
              className="modal-close-btn"
              onClick={handleClose}
              disabled={isLoading}
            >
              ✕
            </button>
          </div>

          {/* 弹窗主体 */}
          <form onSubmit={handleSubmit} className="modal-form">
            {/* Alias */}
            <div className="form-group">
              <label className="form-label">
                Alias <span className="required-indicator">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  value={formData.alias}
                  onChange={(e) => handleInputChange('alias', e.target.value)}
                  placeholder="Enter DID alias..."
                  className={`neural-input ${errors.alias ? 'error' : ''}`}
                  disabled={isLoading}
                />
                <div className="input-glow"></div>
              </div>
              {errors.alias && (
                <div className="form-error-message">
                  <span className="error-icon">⚠️</span>
                  {errors.alias}
                </div>
              )}
            </div>

            {/* Binding (Public Key) */}
            <div className="form-group">
              <label className="form-label">
                Binding (Public Key) <span className="required-indicator">*</span>
              </label>
              <div className="input-wrapper">
                <textarea
                  value={formData.publicKey}
                  onChange={(e) => handleInputChange('publicKey', e.target.value)}
                  placeholder="Enter public key data (required)..."
                  className={`neural-textarea ${errors.publicKey ? 'error' : ''}`}
                  rows="4"
                  disabled={isLoading}
                />
                <div className="input-glow"></div>
              </div>
              {errors.publicKey && (
                <div className="form-error-message">
                  <span className="error-icon">⚠️</span>
                  {errors.publicKey}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button
                type="button"
                onClick={handleClose}
                className="cancel-btn"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`execute-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    <span>Initializing...</span>
                  </>
                ) : (
                  <>
                    <span>Initialize</span>
                  </>
                )}
                <div className="btn-particles"></div>
              </button>
            </div>
          </form>
        </div>

        {/* 数据流效果 */}
        <div className="modal-data-stream">
          <div className="stream-particle stream-1"></div>
          <div className="stream-particle stream-2"></div>
          <div className="stream-particle stream-3"></div>
        </div>
      </div>
    </div>
  )
}

export default InitializeDIDModal 