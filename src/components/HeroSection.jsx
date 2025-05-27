import FeatureHighlights from './FeatureHighlights'

const HeroSection = ({ isLoaded, onLaunchDID }) => {
  return (
    <div className={`main-content ${isLoaded ? 'loaded' : ''}`}>
      {/* Holographic title */}
      <div className="title-container">
        <h1 className="main-title">
          <span className="title-line">DECENTRALIZED</span>
          <span className="title-line">IDENTITY</span>
        </h1>
        <div className="title-underline"></div>
      </div>

      {/* Subtitle with typing effect */}
      <p className="main-subtitle">
        <span className="subtitle-text">
          Next-generation DID protocol powered by Bitcoin UTXO technology.
          <br />
          Secure, decentralized, and truly yours.
        </span>
      </p>

      {/* Feature highlights */}
      <FeatureHighlights />

      {/* CTA Button */}
      <button
        onClick={onLaunchDID}
        className="cta-button"
      >
        <span className="button-text">LAUNCH DID</span>
        <div className="button-particles"></div>
        <div className="button-shine"></div>
      </button>

      {/* Status indicators */}
      <div className="status-indicators">
        <div className="status-item">
          <div className="status-dot active"></div>
          <span>Network: Online</span>
        </div>
      </div>
    </div>
  )
}

export default HeroSection 