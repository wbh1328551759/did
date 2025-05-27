const ControlPanel = ({ 
  isLoaded, 
  searchTerm, 
  onSearchChange, 
  onInitializeDID 
}) => {
  return (
    <div className={`control-panel ${isLoaded ? 'loaded' : ''}`}>
      <button className="register-btn" onClick={onInitializeDID}>
        <span className="btn-icon">⚡</span>
        <span className="btn-text">INITIALIZE NEW DID</span>
        <div className="btn-particles"></div>
      </button>
      
      <div className="search-container">
        <div className="search-wrapper">
          <input
            type="search"
            placeholder="Scan DID..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
          <div className="search-icon">🔍</div>
          <div className="search-beam"></div>
        </div>
      </div>
    </div>
  )
}

export default ControlPanel 