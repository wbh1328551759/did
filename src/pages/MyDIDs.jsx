import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import InitializeDIDModal from '../components/InitializeDIDModal'
import WalletConnectModal from '../components/WalletConnectModal'
import ConfirmDialog from '../components/ConfirmDialog'
import PageHeader from '../components/PageHeader'
import ControlPanel from '../components/ControlPanel'
import DIDGrid from '../components/DIDGrid'
import UpdateNotification from '../components/UpdateNotification'
import BackgroundEffects from '../components/BackgroundEffects'
import { walletManager } from '../utils/wallet'

const MyDIDs = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedDID, setSelectedDID] = useState(null)
  const [showUpdateMessage, setShowUpdateMessage] = useState(false)
  const [showInitializeModal, setShowInitializeModal] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAccount, setWalletAccount] = useState(null)
  const [walletType, setWalletType] = useState(null)
  
  // 确认对话框状态
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'danger',
    onConfirm: null
  })

  // DID数据状态
  const [dids, setDids] = useState([
    {
      id: '1',
      alias: 'Primary Neural Interface',
      did: 'did:btc:bc1q...x7k9',
      fullDid: 'did:btc:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      createdDate: '2024-03-15',
      status: 'active',
      type: 'primary',
      security: 'quantum-resistant',
      network: 'mainnet',
      controlAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
    },
    {
      id: '2',
      alias: 'Corporate Identity Matrix',
      did: 'did:btc:bc1p...m4n2',
      fullDid: 'did:btc:bc1p5d7rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8gwqrkm4n2kdh8s',
      createdDate: '2024-01-22',
      status: 'active',
      type: 'corporate',
      security: 'multi-sig',
      network: 'mainnet',
      controlAddress: 'bc1p5d7rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8gwqrkm4n2kdh8s'
    },
    {
      id: '3',
      alias: 'Experimental Protocol',
      did: 'did:btc:pending...sync',
      fullDid: 'did:btc:pending-blockchain-synchronization',
      createdDate: '2024-12-20',
      status: 'pending',
      type: 'experimental',
      security: 'quantum-resistant',
      network: 'mainnet',
      remainingBlocks: 3,
      progress: 67,
      pendingTx: 'bc1q...a7f2',
      controlAddress: 'bc1qpendingaddressexamplefortest123456789'
    },
    {
      id: '4',
      alias: 'Failed Quantum Bridge',
      did: 'did:btc:failed...error',
      fullDid: 'did:btc:failed-blockchain-synchronization',
      createdDate: '2024-12-18',
      status: 'failed',
      type: 'experimental',
      security: 'quantum-resistant',
      network: 'mainnet'
    },
    {
      id: '5',
      alias: 'Enterprise Identity Hub',
      did: 'did:btc:bc1p...k8m5',
      fullDid: 'did:btc:bc1p7d8rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8gwqrkm4n2kdh8s',
      createdDate: '2024-12-10',
      status: 'active-update-failed',
      type: 'enterprise',
      security: 'multi-sig',
      network: 'mainnet',
      controlAddress: 'bc1p7d8rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8gwqrkm4n2kdh8s'
    }
  ])

  useEffect(() => {
    setIsLoaded(true)
    
    // 处理从DIDDetail页面返回的更新
    if (location.state?.updatedDID) {
      const { updatedDID, showUpdateMessage: shouldShowMessage } = location.state
      
      // 更新DID数据
      setDids(prevDids => 
        prevDids.map(did => 
          did.id === updatedDID.id 
            ? { ...did, alias: updatedDID.alias }
            : did
        )
      )
      
      // 显示更新消息
      if (shouldShowMessage) {
        setShowUpdateMessage(true)
        setTimeout(() => setShowUpdateMessage(false), 3000)
      }
      
      // 清除location state
      window.history.replaceState({}, document.title)
    }

    // 检查钱包连接状态
    if (walletManager.isConnected) {
      setWalletConnected(true)
      setWalletAccount(walletManager.account)
      setWalletType(walletManager.walletType)
    }

    // 监听钱包账户变化
    walletManager.onAccountsChanged((accounts) => {
      if (accounts.length === 0) {
        setWalletConnected(false)
        setWalletAccount(null)
        setWalletType(null)
      } else {
        setWalletAccount(accounts[0])
      }
    })
  }, [location.state])

  const filteredDIDs = dids
    .filter(did => 
      did.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
      did.did.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))

  const handleManageDID = (didId, alias) => {
    // 检查DID状态，只有active状态的DID才能访问
    const did = dids.find(d => d.id === didId)
    if (did && did.status !== 'active') {
      alert('只有状态为active的DID才能访问详情页面')
      return
    }
    navigate(`/detail/${didId}`, { state: { alias } })
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // Add visual feedback here if needed
  }

  const handleDeleteDID = (didId, didAlias) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete DID',
      message: `Are you sure you want to delete the failed DID "${didAlias}"? This action cannot be undone.`,
      type: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => {
        setDids(prevDids => prevDids.filter(did => did.id !== didId))
        setConfirmDialog({ ...confirmDialog, isOpen: false })
        
        // 显示删除成功消息
        setShowUpdateMessage(true)
        setTimeout(() => setShowUpdateMessage(false), 3000)
      }
    })
  }

  const handleDismissWarning = (didId, didAlias) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Dismiss Warning',
      message: `Are you sure you want to dismiss the update failure warning and set DID "${didAlias}" status to Active?`,
      type: 'warning',
      confirmText: 'Dismiss',
      cancelText: 'Cancel',
      onConfirm: () => {
        setDids(prevDids => 
          prevDids.map(did => 
            did.id === didId 
              ? { ...did, status: 'active' }
              : did
          )
        )
        setConfirmDialog({ ...confirmDialog, isOpen: false })
        
        // 显示成功消息
        setShowUpdateMessage(true)
        setTimeout(() => setShowUpdateMessage(false), 3000)
      }
    })
  }

  const handleCloseConfirmDialog = () => {
    setConfirmDialog({ ...confirmDialog, isOpen: false })
  }



  const handleInitializeDID = () => {
    if (!walletConnected) {
      alert('Please connect your wallet first to initialize a new DID')
      return
    }
    setShowInitializeModal(true)
  }

  const handleCloseModal = () => {
    setShowInitializeModal(false)
  }

  const handleSubmitDID = (formData) => {
    // 生成新的DID ID
    const newId = (dids.length + 1).toString()
    
    // 生成mock的pending transaction hash
    const generateMockTxHash = () => {
      const chars = '0123456789abcdef'
      let hash = 'bc1q'
      for (let i = 0; i < 8; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)]
      }
      return hash + '...' + chars[Math.floor(Math.random() * chars.length)] + 
             chars[Math.floor(Math.random() * chars.length)] + 
             chars[Math.floor(Math.random() * chars.length)] + 
             chars[Math.floor(Math.random() * chars.length)]
    }
    
    // 创建新的DID对象 - 包含mock的pending transaction
    const newDID = {
      id: newId,
      alias: formData.alias,
      did: 'did:btc:pending...sync',
      fullDid: 'did:btc:pending-blockchain-synchronization',
      createdDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      type: 'experimental',
      security: 'quantum-resistant',
      network: 'mainnet',
      remainingBlocks: 5,
      progress: 0,
      pendingTx: generateMockTxHash() // 新初始化的DID包含mock的pending transaction
    }
    
    // 添加到DID列表
    setDids(prevDids => [newDID, ...prevDids])
    
    // 显示成功消息
    setShowUpdateMessage(true)
    setTimeout(() => setShowUpdateMessage(false), 3000)
  }

  const handleConnectWallet = () => {
    setShowWalletModal(true)
  }

  const handleWalletConnect = async (walletType) => {
    try {
      const result = await walletManager.connectWallet(walletType)
      
      if (result.success) {
        setWalletConnected(true)
        setWalletAccount(result.account)
        setWalletType(walletType)
      } else {
        // 显示错误消息
        console.error('Wallet connection failed:', result.error)
        
        // 根据错误类型显示不同的消息
        if (result.error.includes('not installed')) {
          const walletName = walletType === 'okx' ? 'OKX Wallet' : 'Unisat Wallet'
          const downloadUrl = walletType === 'okx' ? 'https://www.okx.com/web3' : 'https://unisat.io'
          alert(`${walletName} is not installed. Please install it from ${downloadUrl}`)
        } else if (result.error.includes('rejected')) {
          alert('Connection was rejected. Please try again and approve the connection.')
        } else {
          alert(`Failed to connect wallet: ${result.error}`)
        }
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Wallet connection error:', error)
      throw error
    }
  }

  const handleDisconnectWallet = () => {
    walletManager.disconnect()
    setWalletConnected(false)
    setWalletAccount(null)
    setWalletType(null)
  }

  return (
    <div className="page sci-fi-page">
      {/* Update success notification */}
      <UpdateNotification show={showUpdateMessage} />

      {/* Animated background elements */}
      <BackgroundEffects />

      {/* Header */}
      <PageHeader 
        isLoaded={isLoaded}
        activeDIDCount={dids.filter(did => did.status === 'active').length}
        walletConnected={walletConnected}
        walletType={walletType}
        walletAccount={walletAccount}
        onConnectWallet={handleConnectWallet}
        onDisconnectWallet={handleDisconnectWallet}
      />

      <div className="page-content sci-fi-content">
        {/* Control Panel */}
        <ControlPanel 
          isLoaded={isLoaded}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onInitializeDID={handleInitializeDID}
        />

        {/* DID Grid */}
        <DIDGrid 
          isLoaded={isLoaded}
          walletConnected={walletConnected}
          filteredDIDs={filteredDIDs}
          selectedDID={selectedDID}
          onSelectDID={setSelectedDID}
          onCopyToClipboard={copyToClipboard}
          onManageDID={handleManageDID}
          onDeleteDID={handleDeleteDID}
          onDismissWarning={handleDismissWarning}
        />
      </div>

      {/* Initialize DID Modal */}
      <InitializeDIDModal 
        isOpen={showInitializeModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitDID}
      />

      {/* Wallet Connect Modal */}
      <WalletConnectModal 
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={handleWalletConnect}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog 
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        onConfirm={confirmDialog.onConfirm}
        onCancel={handleCloseConfirmDialog}
      />
    </div>
  )
}

export default MyDIDs 