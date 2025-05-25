import { useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

const DIDDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const [alias, setAlias] = useState(location.state?.alias || 'My Main Identity')
  
  // 新增绑定信息状态
  const [bindings, setBindings] = useState({
    ethereum: '',
    email: '',
    twitter: ''
  })

  const didDocument = {
    "@context": ["https://www.w3.org/ns/did/v1", "https://w3id.org/security/suites/jws-2020/v1"],
    "id": "did:example:123456789abcdefghijklmnopqrstuvwxyz0987654321",
    "verificationMethod": [{
      "id": "did:example:123...#keys-1", 
      "type": "JsonWebKey2020",
      "controller": "did:example:123456789abcdefghijklmnopqrstuvwxyz0987654321",
      "publicKeyJwk": { 
        "kty": "OKP", 
        "crv": "Ed25519", 
        "x": "G-box_v8P3Q3_sPBAvUNyNdJ_TuxL9Vcv0n22WW9xGHk" 
      }
    }],
    "authentication": ["did:example:123...#keys-1"],
    "assertionMethod": ["did:example:123...#keys-1"]
  }

  const handleBack = () => {
    navigate('/my-dids')
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const downloadDocument = () => {
    const dataStr = JSON.stringify(didDocument, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'did-document.json'
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleBindingChange = (field, value) => {
    setBindings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="page">
      {/* Header */}
      <header className="app-header">
        <button
          onClick={handleBack}
          className="btn-secondary text-white hover:text-theme-light flex items-center space-x-2"
          style={{ backgroundColor: '#334155', borderColor: '#475569' }}
        >
          <span>Back to List</span>
        </button>
        <h1 className="text-2xl font-semibold text-white">Manage: {alias}</h1>
        <div className="w-24"></div>
      </header>

      <div className="page-content">
        <div className="content-section">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Alias
              </label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-md py-2 px-3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Full DID
              </label>
              <div className="flex items-center bg-slate-700 border border-slate-600 rounded-md p-2">
                <p className="text-sm text-white flex-grow break-all">
                  did:example:123456789abcdefghijklmnopqrstuvwxyz0987654321
                </p>
                <button
                  title="Copy DID"
                  onClick={() => copyToClipboard('did:example:123456789abcdefghijklmnopqrstuvwxyz0987654321')}
                  className="copy-btn ml-2 flex-shrink-0"
                >
                  📋
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Created Date
                </label>
                <p className="text-sm text-white">2023-10-26</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Status
                </label>
                <p className="text-sm text-white font-semibold">Active</p>
              </div>
            </div>
          </div>
        </div>

        <div className="content-section">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              Account Bindings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Ethereum Address
                </label>
                <input
                  type="text"
                  value={bindings.ethereum}
                  onChange={(e) => handleBindingChange('ethereum', e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-md py-2 px-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={bindings.email}
                  onChange={(e) => handleBindingChange('email', e.target.value)}
                  placeholder="user@example.com"
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-md py-2 px-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Twitter Handle
                </label>
                <input
                  type="text"
                  value={bindings.twitter}
                  onChange={(e) => handleBindingChange('twitter', e.target.value)}
                  placeholder="@username"
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-md py-2 px-3"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="content-section">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-3">
              DID Document (JSON)
            </h3>
            <div className="bg-slate-900 p-3 rounded-md border border-slate-700 max-h-60 overflow-y-auto text-xs">
              <pre className="text-slate-300 whitespace-pre-wrap break-all">
                <code>{JSON.stringify(didDocument, null, 2)}</code>
              </pre>
            </div>
            <button
              onClick={downloadDocument}
              className="mt-3 text-theme hover:text-theme-light text-sm flex items-center space-x-1"
            >
              <span>Download Full Document</span>
            </button>
          </div>
        </div>

        <div className="content-section">
          <div className="flex space-x-4">
            <button className="flex-1 bg-theme hover:bg-theme-dark text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center space-x-2">
              <span>Update DID</span>
            </button>
            <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center space-x-2">
              <span>Revoke DID</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DIDDetail 