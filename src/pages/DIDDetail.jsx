import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import DetailHeader from '../components/DetailHeader'
import DetailBackgroundEffects from '../components/DetailBackgroundEffects'
import SaveNotification from '../components/SaveNotification'
import IdentityCore from '../components/IdentityCore'
import NeuralBindings from '../components/NeuralBindings'
import DIDDocumentViewer from '../components/DIDDocumentViewer'
import ActionPanel from '../components/ActionPanel'

const DIDDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const [alias, setAlias] = useState(location.state?.alias || 'Primary Neural Interface')
  const [originalAlias, setOriginalAlias] = useState(location.state?.alias || 'Primary Neural Interface')
  const [isLoaded, setIsLoaded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  // Public Key binding
  const [bindings, setBindings] = useState({
    publicKey: '03a34b99f22c790c4e36b2b3c2c35a36db06226e41c692fc82b8b56ac1c540c5bd'
  })



  useEffect(() => {
    setIsLoaded(true)
    setOriginalAlias(location.state?.alias || 'Primary Neural Interface')
  }, [location.state?.alias])

  // 清除成功提示
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [saveSuccess])

  const didDocument = {
    "@context": ["https://www.w3.org/ns/did/v1", "https://w3id.org/security/suites/jws-2020/v1"],
    "id": "did:btc:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    "verificationMethod": [{
      "id": "did:btc:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh#keys-1", 
      "type": "EcdsaSecp256k1VerificationKey2019",
      "controller": "did:btc:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      "publicKeyHex": "03a34b99f22c790c4e36b2b3c2c35a36db06226e41c692fc82b8b56ac1c540c5bd"
    }],
    "authentication": ["did:btc:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh#keys-1"],
    "assertionMethod": ["did:btc:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh#keys-1"],
    "service": [{
      "id": "did:btc:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh#neural-interface",
      "type": "NeuralInterface",
      "serviceEndpoint": "https://neural.quantum.net/interface"
    }]
  }

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
    if (alias.trim() === '') {
      alert('神经接口别名不能为空！')
      return
    }

    setIsSaving(true)
    
    try {
      // 模拟保存API调用
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 更新原始值
      setOriginalAlias(alias)
      setIsEditing(false)
      setSaveSuccess(true)
      
    } catch (error) {
      console.error('保存失败:', error)
      alert('神经链接更新失败，请重试！')
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
    const exportFileDefaultName = 'neural-did-document.json'
    
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



  const hasUnsavedChanges = alias !== originalAlias

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
        isSaving={isSaving}
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
          />

          {/* Bindings */}
          <NeuralBindings 
            bindings={bindings}
            isEditing={isEditing}
            onBindingChange={handleBindingChange}
            onCopyToClipboard={copyToClipboard}
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