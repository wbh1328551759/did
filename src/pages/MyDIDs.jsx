import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MyDIDs = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const dids = [
    {
      id: '1',
      alias: 'My Main Identity',
      did: 'did:example:123456789abcdefghi...jkl',
      fullDid: 'did:example:123456789abcdefghijklmnopqrstuvwxyz0987654321',
      createdDate: '2023-10-26',
      status: 'active'
    },
    {
      id: '2',
      alias: 'Work Credential DID',
      did: 'did:ethr:0x02b97c30da7a8949799543287660909384378430f77996399d40e0e0e0fefefe',
      fullDid: 'did:ethr:0x02b97c30da7a8949799543287660909384378430f77996399d40e0e0e0fefefe',
      createdDate: '2024-01-15',
      status: 'active'
    },
    {
      id: '3',
      alias: 'Personal Identity DID',
      did: 'did:btc:pending...registration',
      fullDid: 'did:btc:pending-registration-awaiting-confirmation',
      createdDate: '2024-12-20',
      status: 'pending',
      remainingBlocks: 3
    }
  ]

  const handleManageDID = (didId, alias) => {
    navigate(`/detail/${didId}`, { state: { alias } })
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const getStatusDisplay = (did) => {
    if (did.status === 'pending') {
      return `Pending (${did.remainingBlocks} blocks remaining)`
    }
    return 'Active'
  }

  return (
    <div className="page">
      {/* Header */}
      <header className="app-header">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-semibold text-white">My DID</h1>
        </div>
        <button className="btn-secondary hover:bg-theme-dark text-white font-semibold py-2 px-4 rounded-md flex items-center space-x-2" style={{ backgroundColor: '#334155', borderColor: '#475569' }}>
          <span>Connect Wallet</span>
        </button>
      </header>

      <div className="page-content">
        <div className="content-section">
          <div className="flex space-x-4">
            <button className="bg-theme hover:bg-theme-dark text-white font-semibold py-2 px-4 rounded-md flex items-center space-x-2">
              <span>Register New DID</span>
            </button>
            <div className="relative flex-grow">
              <input
                type="search"
                placeholder="Search My DID (Alias or DID)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-md py-2 px-4"
                style={{ paddingLeft: '2.5rem', backgroundColor: '#1e293b', borderColor: '#334155' }}
              />
              <div className="absolute" style={{ top: '50%', left: '0.75rem', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <span style={{ color: '#94a3b8' }}>🔍</span>
              </div>
            </div>
          </div>
        </div>

        <div className="content-section">
          <div className="space-y-4">
            {dids.map((did) => (
              <div
                key={did.id}
                className={`bg-slate-800 p-4 rounded-lg border transition-colors ${
                  did.status === 'pending' 
                    ? 'border-yellow-500/50 hover:border-yellow-500' 
                    : 'border-slate-700 hover:border-theme'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold text-white">{did.alias}</h2>
                  {did.status === 'active' && (
                    <button
                      onClick={() => handleManageDID(did.id, did.alias)}
                      className="manage-btn font-medium py-1 px-2 rounded-md flex items-center space-x-1"
                    >
                      <span>Manage</span>
                    </button>
                  )}
                </div>
                <p className="text-sm text-slate-300 mb-1">
                  <span className="truncate">DID: {did.did}</span>
                  {did.status === 'active' && (
                    <button
                      title="Copy DID"
                      onClick={() => copyToClipboard(did.fullDid)}
                      className="copy-btn"
                      style={{ marginLeft: '6px' }}
                    >
                      📋
                    </button>
                  )}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-500">Created: {did.createdDate}</p>
                  <p className={`text-sm font-medium ${
                    did.status === 'pending' ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {getStatusDisplay(did)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyDIDs 