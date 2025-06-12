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
import WalletNetworkMonitor from '../components/WalletNetworkMonitor'
import { useWallet } from '../hooks/useWallet'
import { useDIDManager, usePsbtSigning } from '../hooks/useDID'
import { useDIDStore } from '../store/didStore'
import { detectKeyType, isValidPublicKey, getKeyTypeDisplayName } from '../utils/crypto'
import { TX_STATUS } from '../types/did'

const MyDIDs = ({ notification } ) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedDID, setSelectedDID] = useState(null)
  const [showInitializeModal, setShowInitializeModal] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)

  // 使用 zustand 钱包状态
  const {
    isConnected: walletConnected,
    walletType,
    account: walletAccount,
    publicKey,
    connectWallet,
    disconnectWallet,
    isConnecting,
    connectionError,
    formattedAddress
  } = useWallet()

  // 使用 zustand DID 状态
  const {
    monitoringTxid,
    monitoringStatus,
    showSuccessMessage,
    successMessage,
    isCreating,
    isProcessing,
    startMonitoring,
    stopMonitoring,
    showSuccess,
    hideSuccess
  } = useDIDStore()

  // 确认对话框状态
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'danger',
    onConfirm: null
  })

  // 使用 DID Manager Hook
  const {
    // 数据
    summary,
    didList,
    txStatus,

    // 加载状态
    summaryLoading,
    didListLoading,
    creating,
    updating,
    pushing,
    txStatusLoading,

    // 错误状态
    summaryError,
    didListError,
    txStatusError,
    errors,

    // 方法
    createDID,
    updateDID,
    pushTransaction,
    refreshSummary,
    refreshDIDList,
    refreshTxStatus,
    clearError,
  } = useDIDManager()

  // 使用 PSBT 签名 Hook
  const {
    signPsbt,
    signAndPushPsbt,
    getPublicKey,
    error: psbtError,
    clearError: clearPsbtError
  } = usePsbtSigning()

  useEffect(() => {
    setIsLoaded(true)

    // 处理从DIDDetail页面返回的更新
    // if (location.state?.updatedDID) {
    //   const { showUpdateMessage: shouldShowMessage } = location.state
    //
    //   // 刷新DID列表以获取最新数据
    //   refreshDIDList()
    //
    //   // 显示更新消息
    //   if (shouldShowMessage) {
    //     showSuccess('DID updated')
    //   }
    //
    //   // 清除location state
    //   window.history.replaceState({}, document.title)
    // }
  }, [location.state, refreshDIDList, showSuccess])

  // 监控交易状态变化
  useEffect(() => {
    if (txStatus && monitoringTxid) {
      console.log('Transaction status:', txStatus)

      if (txStatus.status === 'active') {
        // 交易已确认，刷新列表
        refreshDIDList()
        refreshSummary()
        showSuccess('Created successfully')
      } else if (txStatus.status === 'failed') {
        // 交易失败
        notification.error(`Failed to create DID: Transaction not confirmed`, {title: 'Create DID failed'})
      }
    }
  }, [txStatus, monitoringTxid, refreshDIDList, refreshSummary, showSuccess])

  // 处理真实的 DID 数据 - 适配新的 API 响应格式
  const formatDIDForDisplay = (didData) => {
    return didData.map(did => ({
      // 基础信息
      id: did.did || did.alias, // 使用 did 字段作为唯一标识符
      alias: did.alias || 'Unnamed DID',
      did: did.did ? `did:btc:${did.did.substring(8, 16)}...${did.did.substring(did.did.length - 4)}` : 'pending...',
      fullDid: did.did,
      controller: did.controller,
      controllerAddress: did.controllerAddress, // 新增：控制器地址

      // 时间信息
      createdDate: did.createdAt ? new Date(did.createdAt * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      updatedDate: did.updatedAt ? new Date(did.updatedAt * 1000).toISOString().split('T')[0] : undefined,
      createdAt: did.createdAt, // 保留原始时间戳
      updatedAt: did.updatedAt, // 保留原始时间戳

      // 状态信息
      status: did.status || 'pending',
      type: 'standard', // 默认类型
      security: 'standard', // 默认安全级别
      network: 'signet', // 当前使用 signet 网络

      // 控制信息
      controlAddress: did.controllerAddress || did.controller, // 优先使用 controllerAddress
      controlUtxo: did.controlUtxo,

      // 验证方法
      verificationMethods: did.verificationMethods || [],
      authentication: did.authentication || [],
      assertion: did.assertion || [],

      // 对于 pending 状态的 DID，可以添加一些模拟的进度信息
      remainingBlocks: did.status === 'pending' ? 3 : undefined,
      progress: did.status === 'pending' ? 67 : undefined,
      pendingTx: did.pendingTxId || (did.controlUtxo ? did.controlUtxo.split(':')[0] : undefined)
    }))
  }

  const displayDIDs = didList ? formatDIDForDisplay(didList) : []

  const filteredDIDs = displayDIDs
    .filter(did =>
      did.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
      did.did.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))

  const handleManageDID = (didId, alias) => {
    // 检查DID状态，只有active状态的DID才能访问
    const did = displayDIDs.find(d => d.id === didId)
    if (did && did.status !== 'active') {
      notification.error(`Did is not active`, {title: 'Error'})
      return
    }

    // 传递完整的 DID 标识符而不是处理后的 id
    const fullDidId = did?.fullDid || didId
    navigate(`/detail/${encodeURIComponent(fullDidId)}`, {
      state: {
        alias,
        didData: did // 传递完整的 DID 数据
      }
    })
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
        // 在真实实现中，这里应该调用删除 API
        // 目前先从本地列表中移除，刷新列表会重新获取数据
        refreshDIDList()
        setConfirmDialog({ ...confirmDialog, isOpen: false })

        // 显示删除成功消息
        showSuccess('Deleted successfully')
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
        // 在真实实现中，这里应该调用状态更新 API
        // 目前先刷新列表
        refreshDIDList()
        setConfirmDialog({ ...confirmDialog, isOpen: false })

        // 显示成功消息
        showSuccess('Warning dismissed')
      }
    })
  }

  const handleCloseConfirmDialog = () => {
    setConfirmDialog({ ...confirmDialog, isOpen: false })
  }

  const handleInitializeDID = () => {
    if (!walletConnected) {
      notification.error(`Please connect wallet to create a new DID`, {title: 'Error'})
      return
    }
    setShowInitializeModal(true)
  }

  const handleCloseModal = () => {
    setShowInitializeModal(false)
  }

  const handleSubmitDID = async (formData) => {
    try {
      if (!walletConnected || !walletAccount) {
        notification.error(`Please connect wallet first`, {title: 'Error'})

        return
      }

      // 确定要使用的公钥
      const targetPublicKey = formData.publicKey || publicKey

      if (!targetPublicKey) {
        notification.error(`Public key not available. Please ensure your wallet is connected.`, {title: 'Error'})
        return
      }

      // 验证公钥格式
      if (!isValidPublicKey(targetPublicKey)) {
        notification.error(`Invalid public key format`, {title: 'Error'})
        return
      }

      // 自动检测密钥类型
      const detectedKeyType = detectKeyType(targetPublicKey)
      console.log('Detected key type:', detectedKeyType, 'for public key:', targetPublicKey)

      // 1. 调用创建 DID API 获取 PSBT
      const createResult = await createDID({
        spendAddr: walletAccount,
        verificationCapabilities: 7, // 默认验证能力
        controlAddress: walletAccount,
        subjectPublicKey: targetPublicKey,
        keyType: detectedKeyType // 使用自动检测的密钥类型
      })

      if (createResult && createResult.psbt) {

        // 2. 使用 PSBT 签名 Hook 进行签名并推送
        const signAndPushResult = await signAndPushPsbt(createResult.psbt, formData.alias)

        if (signAndPushResult?.commitTxid) {
          notification.success(`txId: ${signAndPushResult?.commitTxid}`, {title: 'Create DID success!'})

          // 开始监控交易状态
          startMonitoring(signAndPushResult.commitTxid)

          // 显示正在监控交易状态的消息
          showSuccess('Transaction submitted, waiting for confirmation...', 30000) // 30秒显示

          setShowInitializeModal(false)

        } else {
          throw new Error(signAndPushResult.error || 'Failed to sign and push transaction')
        }
      } else {
        throw new Error('Failed to get PSBT from create DID API')
      }
    } catch (error) {
      console.error('Create DID failed:', error)

      // 显示错误消息
      const errorMessage = error.message || 'Create DID failed'
      notification.error(errorMessage, {title: 'Create DID Error'})

      hideSuccess()
    }
  }

  const handleConnectWallet = () => {
    setShowWalletModal(true)
  }

  const handleWalletConnect = async (walletType) => {
    try {
      const result = await connectWallet(walletType)

      if (result.success) {
        setShowWalletModal(false)
      } else {
        // 错误处理已在 useWallet hook 中完成
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Wallet connection error:', error)
      // 显示错误
      notification.error(error.message, {title: 'Wallet connection failed'})

      throw error
    }
  }

  const handleDisconnectWallet = () => {
    disconnectWallet()
    // 清除相关状态
    stopMonitoring()
    hideSuccess()
  }

  return (
    <div className="page sci-fi-page">
      {/* Update success notification */}
      <UpdateNotification
        show={showSuccessMessage}
        message={successMessage}
        onClose={hideSuccess}
      />

      {/* Animated background elements */}
      <BackgroundEffects />

      {/* 钱包网络监控组件 (开发环境) */}
      {/*{process.env.NODE_ENV === 'development' && (*/}
      {/*  <WalletNetworkMonitor showDebugInfo={true} />*/}
      {/*)}*/}

      {/* Header */}
      <PageHeader
        isLoaded={isLoaded}
        activeDIDCount={summary?.didCount || filteredDIDs.filter(did => did.status === 'active').length}
        walletConnected={walletConnected}
        walletType={walletType}
        walletAccount={walletAccount}
        formattedAddress={formattedAddress}
        isConnecting={isConnecting}
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

        {/* Loading state */}
        {(didListLoading || txStatusLoading || isConnecting) && (
          <div className="loading-state text-center py-8 w-full flex items-center gap-3 justify-center">
            <div className="loading-spinner"/>
            <div>
              {isConnecting && 'Connecting wallet...'}
              {didListLoading && !isConnecting && 'Loading DID list...'}
              {txStatusLoading && !didListLoading && !isConnecting && 'Monitoring transaction status...'}
            </div>
          </div>
        )}

        {/* Connection error */}
        {connectionError && (
          <div className="error-state bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <h3 className="font-semibold">Wallet connection error:</h3>
            <p>{connectionError}</p>
          </div>
        )}

        {/* DID Grid */}
        <DIDGrid
          isLoaded={isLoaded && !didListLoading}
          walletConnected={walletConnected}
          filteredDIDs={filteredDIDs}
          selectedDID={selectedDID}
          onSelectDID={setSelectedDID}
          onCopyToClipboard={copyToClipboard}
          onManageDID={handleManageDID}
          onDeleteDID={handleDeleteDID}
          onDismissWarning={handleDismissWarning}
        />

        {/* Empty state */}
        {!didListLoading && filteredDIDs.length === 0 && walletConnected && (
          <div className="empty-state text-center py-8">
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'No matching DID found' : 'You have no DID yet'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleInitializeDID}
                className="px-6 py-2 bg-blue-500 text-black rounded hover:bg-blue-600"
              >
                Create your first DID
              </button>
            )}
          </div>
        )}
      </div>

      {/* Initialize DID Modal */}
      <InitializeDIDModal
        isOpen={showInitializeModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitDID}
        isLoading={isCreating || isProcessing}
        defaultPublicKey={publicKey}
      />

      {/* Wallet Connect Modal */}
      <WalletConnectModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={handleWalletConnect}
        isConnecting={isConnecting}
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
