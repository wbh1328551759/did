import { useNavigate } from 'react-router-dom'

const Landing = () => {
  const navigate = useNavigate()

  const handleLaunchDID = () => {
    navigate('/my-dids')
  }

  const handleDocumentClick = () => {
    // 跳转到外部文档链接
    window.open('https://docs.bitcoin-did.org', '_blank')
  }

  return (
    <div className="page landing-page items-center justify-center">
      <div className="absolute" style={{ top: '2rem', left: '2rem', zIndex: 20 }}>
        <div className="flex items-center space-x-2">
          <div style={{ fontSize: '2rem', color: '#cda164' }}>₿</div>
          <h2 className="text-xl font-bold text-white">BitCoin DID</h2>
        </div>
      </div>

      <div className="absolute" style={{ top: '2rem', right: '2rem', zIndex: 20 }}>
        <button
          onClick={handleDocumentClick}
          className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-md border border-slate-600 hover:border-theme transition-colors"
        >
          <span>Document</span>
        </button>
      </div>

      <div className="relative z-10 max-w-2xl">
        <h1 className="text-5xl font-bold text-white mb-6">
          DID with BitCoin UTXO
        </h1>
        <p className="text-xl text-slate-300 mb-6" style={{ marginBottom: '2.5rem' }}>
          Based on UTXO of BitCoin, Individual and Security.
        </p>
        <button
          onClick={handleLaunchDID}
          className="bg-theme hover:bg-theme-dark text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-lg transition-colors"
          style={{ transitionDuration: '150ms' }}
        >
          Launch DID
        </button>
      </div>
    </div>
  )
}

export default Landing 