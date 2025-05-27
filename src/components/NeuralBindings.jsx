const NeuralBindings = ({ 
  bindings, 
  isEditing, 
  onBindingChange, 
  onCopyToClipboard 
}) => {
  return (
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
                onChange={(e) => onBindingChange(key, e.target.value)}
                className="neural-input binding-input"
                placeholder={`Enter ${key}...`}
              />
            ) : (
              <div className="binding-display">
                <span className="binding-value">{value}</span>
                <button
                  onClick={() => onCopyToClipboard(value)}
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
  )
}

export default NeuralBindings 