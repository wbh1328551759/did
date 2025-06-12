import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import DetailHeader from '../components/DetailHeader'
import DetailBackgroundEffects from '../components/DetailBackgroundEffects'
import SaveNotification from '../components/SaveNotification'
import IdentityCore from '../components/IdentityCore'
import NeuralBindings from '../components/NeuralBindings'
import DIDDocumentViewer from '../components/DIDDocumentViewer'
import ActionPanel from '../components/ActionPanel'
import { useDIDManager, usePsbtSigning } from '../hooks/useDID'
import { useWallet } from '../hooks/useWallet'
import { encodePublicKeyToMultibase, decodeMultibasePublicKey, isValidMultibaseKey } from '../utils/crypto'
import didApiService from '../services/didApi'
import { base58btc } from 'multiformats/bases/base58'

const DIDDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()

  // 钱包状态
  const { account: walletAccount, publicKey: walletPublicKey } = useWallet()

  // DID 管理器
  const { didList, refreshDIDList, didListLoading, startMonitoring } = useDIDManager()

  // PSBT 签名功能
  const { signAndPushPsbt, isProcessing: isPsbtProcessing } = usePsbtSigning()

  // 当前 DID 数据
  const [currentDID, setCurrentDID] = useState(null)
  const [alias, setAlias] = useState(location.state?.alias || '')
  const [originalAlias, setOriginalAlias] = useState(location.state?.alias || '')
  const [isLoaded, setIsLoaded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)



  const [bindings, setBindings] = useState({})

  // 验证方法变更跟踪
  const [vmUpdates, setVmUpdates] = useState([])
  const [hasVMChanges, setHasVMChanges] = useState(false)

  // 获取当前 DID 数据
  useEffect(() => {
    // 解码 URL 参数
    const decodedId = decodeURIComponent(id)

    // 优先使用从 location.state 传递的数据
    if (location.state?.didData) {
      const did = location.state.didData
      setCurrentDID(did)
      setAlias(did.alias || '')
      setOriginalAlias(did.alias || '')

      // 从验证方法中提取公钥绑定
      const extractedBindings = {}
      if (did.verificationMethods && did.verificationMethods.length > 0) {
        did.verificationMethods.forEach((vm, index) => {
          const key = `publicKey${index + 1}`
          extractedBindings[key] = vm.publicKeyHex || vm.publicKeyMultibase || ''
        })
      }
      setBindings(extractedBindings)
      setIsLoaded(true)
      return
    }

    // 如果没有传递数据，从 didList 中查找
    const findCurrentDID = () => {
      if (!didList || !decodedId) return null

      // 根据 decodedId 查找对应的 DID
      return didList.find(did =>
        did.did === decodedId ||
        did.alias === decodedId ||
        did.did?.includes(decodedId)
      )
    }

    const did = findCurrentDID()
    if (did) {
      setCurrentDID(did)
      setAlias(did.alias || '')
      setOriginalAlias(did.alias || '')

      // 从验证方法中提取公钥绑定
      const extractedBindings = {}
      if (did.verificationMethods && did.verificationMethods.length > 0) {
        did.verificationMethods.forEach((vm, index) => {
          const key = `publicKey${index + 1}`
          extractedBindings[key] = vm.publicKeyHex || vm.publicKeyMultibase || ''
        })
      }
      setBindings(extractedBindings)

      setIsLoaded(true)
    } else if (!didListLoading) {
      // 如果没有找到 DID 且不在加载中，刷新列表
      refreshDIDList()
    }
  }, [didList, id, didListLoading, refreshDIDList, location.state])

  // 清除成功提示
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [saveSuccess])

  // 根据当前 DID 数据构建 DID Document
  const didDocument = currentDID

  const handleBack = () => {
    // 如果有未保存的更改，传递新的alias回去
    const finalAlias = alias !== originalAlias ? alias : originalAlias
    navigate('/my-dids', {
      state: {
        updatedDID: { id, alias: finalAlias },
        showUpdateMessage: alias !== originalAlias && !isEditing
      }
    })
  }

  const handleSave = async () => {

    setIsSaving(true)

    try {
      // 如果有验证方法变更，调用 DID 更新 API
      if (hasVMChanges && vmUpdates.length > 0) {
        console.log('currentDID', currentDID)
        // if (!currentDID?.controlUtxo || !currentDID?.spendAddr || !currentDID?.controlAddress) {
        //   throw new Error('缺少必要的控制信息，无法更新 DID')
        // }

        const updatePayload = {
          controlUtxo: currentDID.controlUtxo,
          spendAddr: walletAccount,
          controlAddress: currentDID.controlAddress,
          vmUpdates: vmUpdates
        }

        console.log('Updating DID with payload:', updatePayload)

        const response = await didApiService.updateDID(updatePayload)

        if (response?.commitPsbt) {
          // 使用 signAndPushPsbt 进行签名和广播
          const pushResult = await signAndPushPsbt(
            response.commitPsbt,
            currentDID?.alias, // 使用当前别名
            currentDID?.fullDid, // 传入 DID (update 模式必需)
            response.revealPsbt || '' // revealPsbt 可能为空
          )
          if (pushResult.commitTxid) {
            startMonitoring(pushResult.commitTxid)
            setVmUpdates([])
            setHasVMChanges(false)
            setOriginalAlias(alias)
            setIsEditing(false)
            setSaveSuccess(true)
            refreshDIDList()
          } else {
            throw new Error(pushResult.error || 'Failed to sign and push transaction')
          }
        }
      }

    } catch (error) {
      console.error('Update Failed:', error)
      alert(`Update Failed: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // 如果正在编辑，点击保存
      handleSave()
    } else {
      // 开始编辑
      setIsEditing(true)
      setSaveSuccess(false)
    }
  }

  const handleCancelEdit = () => {
    setAlias(originalAlias)
    setIsEditing(false)
    setSaveSuccess(false)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // Add visual feedback
  }

  const downloadDocument = () => {
    const dataStr = JSON.stringify(didDocument, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `${currentDID?.did || 'did'}-document.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleBindingChange = (action, data) => {
    if (action === 'update') {
      // 更新验证方法
      const { index, field, value } = data

      // 更新当前DID的验证方法
      setCurrentDID(prev => {
        if (!prev || !prev.verificationMethods) return prev

        const newVM = [...prev.verificationMethods]
        if (newVM[index]) {
          newVM[index] = { ...newVM[index], [field]: value }
        }

        return { ...prev, verificationMethods: newVM }
      })

      // 记录更新操作
      setVmUpdates(prev => {
        const existing = prev.find(update => update.i === index && update.hasOwnProperty('k'))
        if (existing) {
          // 更新现有的更新记录
          if (field === 'publicKeyMultibase') {
            existing.k = value
          } else if (field === 'capabilities') {
            existing.vr = value
          }
          return [...prev]
        } else {
          // 添加新的更新记录
          const newUpdate = { i: index }
          if (field === 'publicKeyMultibase') {
            newUpdate.k = value
          } else if (field === 'capabilities') {
            newUpdate.vr = value
          }
          return [...prev, newUpdate]
        }
      })

      setHasVMChanges(true)

    } else if (action === 'add') {
      // 添加新的验证方法
      const { publicKey, capabilities } = data

      try {
        // 检测公钥格式并转换
        let multibaseKey = publicKey
        if (!isValidMultibaseKey(publicKey)) {
          // 如果不是multibase格式，尝试从hex转换
          multibaseKey = encodePublicKeyToMultibase(publicKey, 'secp256k1')
        }

        // 创建新的验证方法对象（用于UI显示）
        const newVM = {
          id: `${currentDID?.did || 'did:btc:temp'}#key-${Date.now()}`,
          type: 'Multikey',
          controller: currentDID?.did || '',
          publicKeyMultibase: multibaseKey,
          publicKeyHex: isValidMultibaseKey(publicKey) ?
            decodeMultibasePublicKey(publicKey).publicKeyHex : publicKey,
          capabilities: capabilities || 3
        }

        // 更新当前DID的验证方法（用于UI显示）
        setCurrentDID(prev => {
          if (!prev) return prev

          const newVerificationMethods = [...(prev.verificationMethods || []), newVM]
          return { ...prev, verificationMethods: newVerificationMethods }
        })

        // 记录添加操作（用于API调用）
        setVmUpdates(prev => [
          ...prev,
          {
            k: multibaseKey,
            vr: capabilities || 7 // 默认能力 (AUTH + ASSERT + KEY_AGR = 1+2+4=7)
          }
        ])

        setHasVMChanges(true)

      } catch (error) {
        console.error('Invalid public key format:', error)
        alert('Invalid public key！')
      }

    } else if (action === 'remove') {
      // 删除验证方法
      const { index } = data

      // 更新当前DID的验证方法（用于UI显示）
      setCurrentDID(prev => {
        if (!prev || !prev.verificationMethods) return prev

        const newVerificationMethods = prev.verificationMethods.filter((_, i) => i !== index)
        return { ...prev, verificationMethods: newVerificationMethods }
      })

      // 记录删除操作（用于API调用）
      setVmUpdates(prev => [
        ...prev,
        { i: index } // 只有索引表示删除
      ])

      setHasVMChanges(true)
    }
  }

  const hasUnsavedChanges = alias !== originalAlias || hasVMChanges

  // 综合的保存状态（包括PSBT处理）
  const isSavingCombined = isSaving || isPsbtProcessing

  // 如果没有找到 DID 数据，显示加载或错误状态
  if (!currentDID && !didListLoading) {
    return (
      <div className="page sci-fi-detail-page">
        <DetailBackgroundEffects />
        <div className="detail-content">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">DID Not Found</h2>
            <p className="text-gray-400 mb-8">The requested DID could not be found.</p>
            <button
              onClick={() => navigate('/my-dids')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to My DIDs
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page sci-fi-detail-page">
      {/* Success notification */}
      <SaveNotification show={saveSuccess} />

      {/* Holographic background */}
      <DetailBackgroundEffects />

      {/* Header */}
      <DetailHeader
        isLoaded={isLoaded}
        alias={alias}
        hasUnsavedChanges={hasUnsavedChanges}
        isEditing={isEditing}
        isSaving={isSavingCombined}
        onBack={handleBack}
        onEditToggle={handleEditToggle}
        onCancelEdit={handleCancelEdit}
      />

      <div className="detail-content">
        {/* Content */}
        <div className={`tab-content ${isLoaded ? 'loaded' : ''}`}>
          {/* Identity Core */}
          <IdentityCore
            alias={alias}
            didDocument={didDocument}
            isEditing={isEditing}
            onAliasChange={setAlias}
            onCopyToClipboard={copyToClipboard}
            currentDID={currentDID}
          />

          {/* Bindings */}
          <NeuralBindings
            bindings={bindings}
            isEditing={isEditing}
            onBindingChange={handleBindingChange}
            onCopyToClipboard={copyToClipboard}
            currentDID={currentDID}
          />

          {/* Document */}
          <DIDDocumentViewer
            didDocument={didDocument}
            onDownload={downloadDocument}
          />
        </div>

        {/* Action Panel */}
        <ActionPanel isLoaded={isLoaded} />
      </div>
    </div>
  )
}

export default DIDDetail
