import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const Landing = () => {
  const navigate = useNavigate()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleLaunchDID = () => {
    navigate('/my-dids')
  }



  return (
    <div className="page landing-page">
      {/* Dynamic cursor follower */}
      <div 
        className="cursor-follower"
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
        }}
      />
      
      {/* Floating geometric shapes */}
      <div className="geometric-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
        <div className="shape shape-5"></div>
      </div>

      {/* Brand logo */}
      <div className={`brand-logo ${isLoaded ? 'loaded' : ''}`}>
        <div className="bitcoin-icon">₿</div>
        <h2>BitCoin DID</h2>
      </div>



      {/* Main content */}
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
        <div className="feature-highlights">
          <div className="feature-item">
            <div className="feature-icon">🛡️</div>
            <span>Secure</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">👤</div>
            <span>Individual</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🌐</div>
            <span>Globally Accessible</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleLaunchDID}
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

      {/* Scanning lines effect */}
      <div className="scan-lines">
        <div className="scan-line scan-line-1"></div>
        <div className="scan-line scan-line-2"></div>
        <div className="scan-line scan-line-3"></div>
      </div>

      {/* Data stream visualization */}
      <div className="data-stream">
        <div className="stream-line stream-1"></div>
        <div className="stream-line stream-2"></div>
        <div className="stream-line stream-3"></div>
        <div className="stream-line stream-4"></div>
      </div>
    </div>
  )
}

export default Landing 