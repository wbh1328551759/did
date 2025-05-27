const LandingBackgroundEffects = ({ mousePosition }) => {
  return (
    <>
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
    </>
  )
}

export default LandingBackgroundEffects 