const LandingHeader = ({ isLoaded }) => {
  return (
    <div className={`brand-logo ${isLoaded ? 'loaded' : ''}`}>
      <div className="bitcoin-icon">₿</div>
      <h2>BitCoin DID</h2>
    </div>
  )
}

export default LandingHeader 