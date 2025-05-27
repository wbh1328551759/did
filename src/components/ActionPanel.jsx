const ActionPanel = ({ isLoaded }) => {
  return (
    <div className={`action-panel ${isLoaded ? 'loaded' : ''}`}>
      <button className="action-btn danger-action">
        <span className="btn-text">TERMINATE DID</span>
        <div className="btn-particles"></div>
      </button>
    </div>
  )
}

export default ActionPanel 