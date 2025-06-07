import { create } from 'zustand'

/**
 * DID 状态管理 Store
 * 管理 DID 相关的操作状态、监控交易等
 */
export const useDIDStore = create((set, get) => ({
  // 交易监控
  monitoringTxid: null,
  monitoringStatus: null, // 'pending' | 'active' | 'failed'
  
  // DID 操作状态
  isCreating: false,
  isUpdating: false,
  isPushing: false,
  isProcessing: false, // PSBT 签名等操作
  
  // 错误状态
  createError: null,
  updateError: null,
  pushError: null,
  psbtError: null,
  
  // 成功消息
  showSuccessMessage: false,
  successMessage: '',
  
  /**
   * 开始监控交易
   * @param {string} txid - 交易ID
   */
  startMonitoring: (txid) => {
    set({
      monitoringTxid: txid,
      monitoringStatus: 'pending'
    })
  },
  
  /**
   * 停止监控交易
   */
  stopMonitoring: () => {
    set({
      monitoringTxid: null,
      monitoringStatus: null
    })
  },
  
  /**
   * 更新监控状态
   * @param {string} status - 状态
   */
  updateMonitoringStatus: (status) => {
    set({ monitoringStatus: status })
    
    // 如果交易完成或失败，3秒后自动停止监控
    if (status === 'active' || status === 'failed') {
      setTimeout(() => {
        get().stopMonitoring()
      }, 3000)
    }
  },
  
  /**
   * 设置创建状态
   * @param {boolean} isCreating
   * @param {string|null} error
   */
  setCreatingState: (isCreating, error = null) => {
    set({
      isCreating,
      createError: error
    })
  },
  
  /**
   * 设置更新状态
   * @param {boolean} isUpdating
   * @param {string|null} error
   */
  setUpdatingState: (isUpdating, error = null) => {
    set({
      isUpdating,
      updateError: error
    })
  },
  
  /**
   * 设置推送状态
   * @param {boolean} isPushing
   * @param {string|null} error
   */
  setPushingState: (isPushing, error = null) => {
    set({
      isPushing,
      pushError: error
    })
  },
  
  /**
   * 设置处理状态 (PSBT签名等)
   * @param {boolean} isProcessing
   * @param {string|null} error
   */
  setProcessingState: (isProcessing, error = null) => {
    set({
      isProcessing,
      psbtError: error
    })
  },
  
  /**
   * 显示成功消息
   * @param {string} message
   * @param {number} duration - 显示时长(ms)，默认3000
   */
  showSuccess: (message, duration = 3000) => {
    set({
      showSuccessMessage: true,
      successMessage: message
    })
    
    setTimeout(() => {
      set({
        showSuccessMessage: false,
        successMessage: ''
      })
    }, duration)
  },
  
  /**
   * 隐藏成功消息
   */
  hideSuccess: () => {
    set({
      showSuccessMessage: false,
      successMessage: ''
    })
  },
  
  /**
   * 清除所有错误
   */
  clearAllErrors: () => {
    set({
      createError: null,
      updateError: null,
      pushError: null,
      psbtError: null
    })
  },
  
  /**
   * 清除特定错误
   * @param {string} errorType - 错误类型
   */
  clearError: (errorType) => {
    const updates = {}
    updates[`${errorType}Error`] = null
    set(updates)
  },
  
  /**
   * 重置所有状态
   */
  reset: () => {
    set({
      monitoringTxid: null,
      monitoringStatus: null,
      isCreating: false,
      isUpdating: false,
      isPushing: false,
      isProcessing: false,
      createError: null,
      updateError: null,
      pushError: null,
      psbtError: null,
      showSuccessMessage: false,
      successMessage: ''
    })
  }
})) 