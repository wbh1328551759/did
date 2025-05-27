const EmptyState = ({ type, walletConnected }) => {
  if (!walletConnected) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔗</div>
        <h3>NO WALLET CONNECTED</h3>
        <p>Please connect your Wallet to view your DIDs</p>
      </div>
    )
  }

  if (type === 'no-results') {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <h3>NO NEURAL PATTERNS DETECTED</h3>
        <p>Adjust your search parameters or initialize a new DID</p>
      </div>
    )
  }

  return null
}

export default EmptyState 