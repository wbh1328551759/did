import httpRequest from '../utils/httpRequest.js';

/**
 * DID API 服务类
 */
class DIDApiService {
  /**
   * 获取 DID 项目总体数据（DID 总数）
   * @returns {Promise<import('../types/did.js').DIDSummary>}
   */
  async getSummary() {
    return await httpRequest.get('/did/summary');
  }

  /**
   * 获取创建 DID 的交易数据
   * @param {import('../types/did.js').CreateDIDRequest} params - 创建 DID 参数
   * @returns {Promise<import('../types/did.js').CreateDIDResponse>}
   */
  async createDID(params) {
    return await httpRequest.post('/did/create', params);
  }

  /**
   * 获取更新 DID 的交易数据
   * @param {import('../types/did.js').UpdateDIDRequest} params - 更新 DID 参数
   * @returns {Promise<import('../types/did.js').UpdateDIDResponse>}
   */
  async updateDID(params) {
    return await httpRequest.post('/did/update', params);
  }

  /**
   * 将签名交易 push 上链
   * @param {import('../types/did.js').PushTxRequest} params - 推送交易参数
   * @returns {Promise<import('../types/did.js').PushTxResponse>}
   */
  async pushTransaction(params) {
    return await httpRequest.post('/did/pushTx', params);
  }

  /**
   * 获取 DID 交易状态
   * @param {string} commitTxid - commit 交易 ID
   * @returns {Promise<import('../types/did.js').TxStatusResponse>}
   */
  async getTransactionStatus(commitTxid) {
    return await httpRequest.get('/did/txStatus', {
      params: { commitTxid }
    });
  }

  /**
   * 获取我的 DID 列表
   * @param {import('../types/did.js').QueryDIDRequest} params - 查询参数
   * @returns {Promise<import('../types/did.js').QueryDIDResponse>}
   */
  async queryDIDs(params) {
    return await httpRequest.get('/did/query', {
      params
    });
  }
}

// 创建单例实例
const didApiService = new DIDApiService();

export default didApiService; 