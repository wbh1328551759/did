/**
 * DID Hooks统一导出
 */

// 导出所有hooks
export { 
  useDID, 
  useTransactionStatus, 
  useMyDIDs, 
  useDIDManager,
  usePsbtSigning 
} from './useDID.js'

// 导出类型定义（可选，用于TypeScript项目）
export * from '../types/did.js'

// 导出服务实例（可选，用于直接API调用）
export { default as didApiService } from '../services/didApi.js'

