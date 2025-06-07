import { useState, useCallback, useEffect } from 'react';
import useSWR from 'swr';
import didApiService from '../services/didApi.js';
import { walletManager, isValidPsbt } from '../utils/wallet.js';
import { useWalletConnection } from './useWallet.js';
import { useDIDStore } from '../store/didStore.js';

/**
 * DID Hook - 提供所有 DID 相关的 API 操作
 * 现在集成了 zustand 状态管理
 */
export const useDID = () => {
  // 使用 DID store
  const {
    setCreatingState,
    setUpdatingState,
    setPushingState,
    clearError,
    clearAllErrors
  } = useDIDStore()

  // 加载状态管理 (保持向后兼容)
  const [loadingStates, setLoadingStates] = useState({
    creating: false,
    updating: false,
    pushing: false,
  });

  // 错误状态管理 (保持向后兼容)
  const [errors, setErrors] = useState({});

  /**
   * 更新加载状态的辅助函数
   */
  const setLoading = useCallback((key, value) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
    
    // 同时更新 zustand store
    switch (key) {
      case 'creating':
        setCreatingState(value);
        break;
      case 'updating':
        setUpdatingState(value);
        break;
      case 'pushing':
        setPushingState(value);
        break;
    }
  }, [setCreatingState, setUpdatingState, setPushingState]);

  /**
   * 设置错误的辅助函数
   */
  const setError = useCallback((key, error) => {
    const errorMessage = error?.message || error;
    setErrors(prev => ({ ...prev, [key]: errorMessage }));
    
    // 同时更新 zustand store
    switch (key) {
      case 'create':
        setCreatingState(false, errorMessage);
        break;
      case 'update':
        setUpdatingState(false, errorMessage);
        break;
      case 'push':
        setPushingState(false, errorMessage);
        break;
    }
  }, [setCreatingState, setUpdatingState, setPushingState]);

  /**
   * 清除错误的辅助函数
   */
  const clearErrorLocal = useCallback((key) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
    
    // 同时清除 zustand store 的错误
    clearError(key);
  }, [clearError]);

  /**
   * 获取 DID 总数统计
   */
  const {
    data: summary,
    error: summaryError,
    isLoading: summaryLoading,
    mutate: mutateSummary
  } = useSWR('/did/summary', didApiService.getSummary, {
    revalidateOnMount: true,
    revalidateOnFocus: false,
    dedupingInterval: 30000, // 30秒内不重复请求
  });

  /**
   * 创建 DID
   * @param {import('../types/did.js').CreateDIDRequest} params
   * @returns {Promise<import('../types/did.js').CreateDIDResponse>}
   */
  const createDID = useCallback(async (params) => {
    setLoading('creating', true);
    clearErrorLocal('create');

    try {
      const result = await didApiService.createDID(params);
      return result;
    } catch (error) {
      setError('create', error);
      throw error;
    } finally {
      setLoading('creating', false);
    }
  }, [setLoading, clearErrorLocal, setError]);

  /**
   * 更新 DID
   * @param {import('../types/did.js').UpdateDIDRequest} params
   * @returns {Promise<import('../types/did.js').UpdateDIDResponse>}
   */
  const updateDID = useCallback(async (params) => {
    setLoading('updating', true);
    clearErrorLocal('update');

    try {
      const result = await didApiService.updateDID(params);
      return result;
    } catch (error) {
      setError('update', error);
      throw error;
    } finally {
      setLoading('updating', false);
    }
  }, [setLoading, clearErrorLocal, setError]);

  /**
   * 推送交易到链上
   * @param {import('../types/did.js').PushTxRequest} params
   * @returns {Promise<import('../types/did.js').PushTxResponse>}
   */
  const pushTransaction = useCallback(async (params) => {
    setLoading('pushing', true);
    clearErrorLocal('push');

    try {
      const result = await didApiService.pushTransaction(params);
      // 推送成功后刷新摘要和DID列表
      mutateSummary();
      return result;
    } catch (error) {
      setError('push', error);
      throw error;
    } finally {
      setLoading('pushing', false);
    }
  }, [setLoading, clearErrorLocal, setError, mutateSummary]);

  return {
    // 数据
    summary,

    // 加载状态
    summaryLoading,
    creating: loadingStates.creating,
    updating: loadingStates.updating,
    pushing: loadingStates.pushing,

    // 错误状态
    summaryError,
    errors,

    // 方法
    createDID,
    updateDID,
    pushTransaction,
    refreshSummary: mutateSummary,
    clearError: clearErrorLocal,
  };
};

/**
 * 监控交易状态的 Hook
 * 现在集成了 zustand 状态管理
 * @param {string} commitTxid - 交易ID
 * @param {Object} options - SWR 选项
 */
export const useTransactionStatus = (commitTxid, options = {}) => {
  const shouldFetch = Boolean(commitTxid);
  const { updateMonitoringStatus } = useDIDStore();

  const {
    data: txStatus,
    error: txStatusError,
    isLoading: txStatusLoading,
    mutate: mutateTxStatus
  } = useSWR(
    shouldFetch ? `/did/txStatus/${commitTxid}` : null,
    () => didApiService.getTransactionStatus(commitTxid),
    {
      refreshInterval: (data) => {
        // 只有在交易状态为 pending 时才自动刷新
        return data?.status === 'pending' ? 5000 : 0;
      },
      revalidateOnMount: true,
      revalidateOnFocus: false,
      ...options
    }
  );

  // 更新 zustand store 中的监控状态
  useEffect(() => {
    if (txStatus && txStatus.status) {
      updateMonitoringStatus(txStatus.status);
    }
  }, [txStatus, updateMonitoringStatus]);

  return {
    txStatus,
    txStatusError,
    txStatusLoading,
    refreshTxStatus: mutateTxStatus,
  };
};

/**
 * 获取我的 DID 列表的 Hook (支持分页)
 * 现在使用 zustand 钱包状态
 * @param {import('../types/did.js').QueryDIDRequest} params - 查询参数
 * @param {Object} options - SWR 选项
 */
export const useMyDIDs = (params, options = {}) => {
  // 从 zustand store 获取钱包信息
  const { account, publicKey } = useWalletConnection();
  
  // 优先使用传入的参数，否则使用钱包状态
  const queryParams = {
    page: 1,
    pageSize: 100,
    ...params,
    // 如果没有传入 address 或 publicKey，使用钱包状态
    address: params.address || account,
    publicKey: params.publicKey || publicKey,
  };

  // 确保至少有一个必需参数存在（address 或 publicKey）
  const shouldFetch = Boolean(queryParams.address || queryParams.publicKey);

  const {
    data: didListData,
    error: didListError,
    isLoading: didListLoading,
    mutate: mutateDIDList
  } = useSWR(
    shouldFetch ? '/did/query' : null,
    () => didApiService.queryDIDs(queryParams),
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      dedupingInterval: 10000, // 10秒内不重复请求
      ...options
    }
  );

  return {
    // 分页数据
    didList: didListData?.dids || [],
    totalCount: didListData?.count || 0,
    currentPage: didListData?.page || 1,
    pageSize: didListData?.pageSize || 100,
    totalPages: didListData ? Math.ceil(didListData.count / didListData.pageSize) : 0,

    // 状态
    didListError,
    didListLoading,

    // 方法
    refreshDIDList: mutateDIDList,
  };
};

/**
 * 带分页控制的 DID 列表 Hook
 * 现在使用 zustand 钱包状态
 * @param {Object} config - 配置参数
 * @param {string} [config.address] - 用户地址 (可选，会使用钱包状态)
 * @param {string} [config.publicKey] - 用户公钥 (可选，会使用钱包状态)
 * @param {number} [config.initialPage] - 初始页码，默认为1
 * @param {number} [config.initialPageSize] - 初始页大小，默认为20
 */
export const useMyDIDsPaginated = (config = {}) => {
  const { address, publicKey, initialPage = 1, initialPageSize = 20 } = config;

  // 分页状态
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // 使用基础的 useMyDIDs Hook
  const didListHook = useMyDIDs({
    address,
    publicKey,
    page,
    pageSize
  });

  // 分页控制方法
  const goToPage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= didListHook.totalPages) {
      setPage(newPage);
    }
  }, [didListHook.totalPages]);

  const goToFirstPage = useCallback(() => {
    setPage(1);
  }, []);

  const goToLastPage = useCallback(() => {
    if (didListHook.totalPages > 0) {
      setPage(didListHook.totalPages);
    }
  }, [didListHook.totalPages]);

  const goToNextPage = useCallback(() => {
    if (page < didListHook.totalPages) {
      setPage(page + 1);
    }
  }, [page, didListHook.totalPages]);

  const goToPrevPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const changePageSize = useCallback((newPageSize) => {
    if (newPageSize > 0 && newPageSize <= 100) {
      setPageSize(newPageSize);
      setPage(1); // 重置到第一页
    }
  }, []);

  return {
    // 继承基础 Hook 的所有属性
    ...didListHook,

    // 分页控制状态
    page,
    pageSize,
    hasNextPage: page < didListHook.totalPages,
    hasPrevPage: page > 1,

    // 分页控制方法
    goToPage,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPrevPage,
    changePageSize,
  };
};

/**
 * 组合所有 DID 相关功能的主 Hook
 * 现在使用 zustand 状态管理
 * @param {Object} config - 配置参数
 * @param {string} [config.address] - 用户地址 (可选，会使用钱包状态)
 * @param {string} [config.publicKey] - 用户公钥 (可选，会使用钱包状态)
 * @param {string} [config.watchTxid] - 需要监控的交易ID
 * @param {boolean} [config.enablePagination] - 是否启用分页，默认false
 * @param {number} [config.initialPage] - 初始页码，默认为1
 * @param {number} [config.initialPageSize] - 初始页大小，默认为100（不分页时）或20（分页时）
 */
export const useDIDManager = (config = {}) => {
  const { address, publicKey, watchTxid, enablePagination = false, initialPage = 1, initialPageSize } = config;
  
  // 从 zustand store 获取监控状态
  const { monitoringTxid, startMonitoring, stopMonitoring } = useDIDStore();

  // 基础 DID 功能
  const didHook = useDID();

  // 如果传入了 watchTxid 且与当前监控的不同，开始监控
  useEffect(() => {
    if (watchTxid && watchTxid !== monitoringTxid) {
      startMonitoring(watchTxid);
    }
  }, [watchTxid, monitoringTxid, startMonitoring]);

  // 交易状态监控 - 使用 zustand store 中的 txid
  const txStatusHook = useTransactionStatus(monitoringTxid);

  // 我的 DID 列表 - 根据是否启用分页选择不同的Hook
  const myDIDsHook = enablePagination
    ? useMyDIDsPaginated({
        address,
        publicKey,
        initialPage,
        initialPageSize: initialPageSize || 20
      })
    : useMyDIDs({
        address,
        publicKey,
        pageSize: initialPageSize || 100
      });

  return {
    ...didHook,
    ...txStatusHook,
    ...myDIDsHook,
    
    // 添加监控控制
    monitoringTxid,
    startMonitoring,
    stopMonitoring,
  };
};

/**
 * PSBT签名专用Hook
 * 现在集成了 zustand 状态管理
 */
export const usePsbtSigning = () => {
  const [lastSignedPsbt, setLastSignedPsbt] = useState('')
  const [lastTxId, setLastTxId] = useState('')
  
  // 使用 zustand store
  const { 
    isProcessing, 
    psbtError,
    setProcessingState,
    showSuccess 
  } = useDIDStore()

  // 签名PSBT
  const signPsbt = useCallback(async (psbtData) => {
    try {
      setProcessingState(true, null)

      if (!walletManager.isConnected) {
        throw new Error('钱包未连接，请先连接钱包')
      }

      if (!isValidPsbt(psbtData)) {
        throw new Error('PSBT数据格式无效')
      }

      const signedPsbt = await walletManager.signPsbt(psbtData)
      setLastSignedPsbt(signedPsbt)

      return {
        success: true,
        signedPsbt
      }
    } catch (err) {
      const errorMessage = err.message || 'PSBT签名失败'
      setProcessingState(false, errorMessage)
      console.error('PSBT签名失败:', err)

      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setProcessingState(false, null)
    }
  }, [setProcessingState])

  // 签名并推送PSBT交易
  const signAndPushPsbt = useCallback(async (psbtData, alias, revealPsbt = null) => {
    try {
      setProcessingState(true, null)

      // 1. 签名PSBT
      const signResult = await signPsbt(psbtData)
      if (!signResult.success) {
        return signResult
      }

      // 2. 推送交易 - 使用正确的 PushTxRequest 参数
      const pushResult = await didApiService.pushTransaction({
        alias,
        commitPsbt: signResult.signedPsbt,
        revealPsbt
      })

      if (pushResult.success) {
        const commitTxid = pushResult.data.commitTxid
        setLastTxId(commitTxid)
        
        // 显示成功消息
        showSuccess('交易已提交，正在等待确认...')
        
        return {
          success: true,
          commitTxid: commitTxid,
          revealTxid: pushResult.data.revealTxid,
          signedPsbt: signResult.signedPsbt
        }
      } else {
        throw new Error(pushResult.error)
      }
    } catch (err) {
      const errorMessage = err.message || '交易推送失败'
      setProcessingState(false, errorMessage)
      console.error('签名并推送交易失败:', err)

      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setProcessingState(false, null)
    }
  }, [signPsbt, setProcessingState, showSuccess])

  // 获取公钥
  const getPublicKey = useCallback(async () => {
    try {
      if (!walletManager.isConnected) {
        throw new Error('钱包未连接，请先连接钱包')
      }

      const publicKey = await walletManager.getPublicKey()
      return publicKey
    } catch (err) {
      console.error('获取公钥失败:', err)
      return null
    }
  }, [])

  // 清除错误
  const clearError = useCallback(() => {
    setProcessingState(false, null)
  }, [setProcessingState])

  return {
    // 操作方法
    signPsbt,
    signAndPushPsbt,
    getPublicKey,

    // 状态
    isProcessing,
    error: psbtError,
    lastSignedPsbt,
    lastTxId,

    // 工具方法
    clearError,

    // 钱包状态
    isWalletConnected: walletManager.isConnected,
    walletAccount: walletManager.account,
    walletType: walletManager.walletType
  }
}
