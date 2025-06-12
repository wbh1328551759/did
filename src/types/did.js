// DID 相关的数据类型定义

/**
 * DID 摘要信息
 * @typedef {Object} DIDSummary
 * @property {number} didCount - 已注册的 DID 总数
 */

/**
 * 创建 DID 请求参数
 * @typedef {Object} CreateDIDRequest
 * @property {string} spendAddr - 用于选择 UTXO 的地址（用于支付费用）
 * @property {number} verificationCapabilities - 验证能力标志位
 * @property {string} controlAddress - 用于 DID 控制的 P2TR 地址
 * @property {string} subjectPublicKey - hex 编码的 public key
 * @property {string} keyType - 密钥类型，如 'secp256k1' 或 'ed25519'
 */

/**
 * 创建 DID 响应
 * @typedef {Object} CreateDIDResponse
 * @property {string} psbt - Base64 编码的 PSBT
 */

/**
 * VM 更新指令
 * @typedef {Object} VMUpdate
 * @property {number} [i] - 索引（用于删除、替换或更新）
 * @property {string} [k] - 编码后的公钥
 * @property {number} [vr] - 验证关系位掩码
 */

/**
 * 更新 DID 请求参数
 * @typedef {Object} UpdateDIDRequest
 * @property {string} controlUtxo - 控制 UTXO
 * @property {string} spendAddr - 支付地址
 * @property {string} controlAddress - 控制地址
 * @property {VMUpdate[]} vmUpdates - 验证方法更新指令列表
 */

/**
 * 更新 DID 响应
 * @typedef {Object} UpdateDIDResponse
 * @property {string} commitPsbt - Base64 编码的 commit PSBT
 * @property {string} revealPsbt - Base64 编码的 reveal PSBT
 */

/**
 * 推送交易请求参数
 * @typedef {Object} PushTxRequest
 * @property {string} alias - 用户填写的别名
 * @property {string} commitPsbt - 签名后的 commit PSBT
 * @property {string} [did] - 要更新的did，如果是创建，那就不传（可选）
 * @property {string} [revealPsbt] - 签名后的 reveal PSBT（可选）
 */

/**
 * 推送交易响应
 * @typedef {Object} PushTxResponse
 * @property {string} commitTxid - commit 交易 ID
 * @property {string} [revealTxid] - reveal 交易 ID（可选）
 */

/**
 * 交易状态响应
 * @typedef {Object} TxStatusResponse
 * @property {string} status - 交易状态: 'pending' | 'active' | 'failed' | 'update_failed'
 * @property {string} [did] - DID 标识符（如果可用）
 */

/**
 * DID 信息
 * @typedef {Object} DIDInfo
 * @property {string} alias - 别名
 * @property {string} did - DID 标识符
 * @property {string[]} controllers - 控制者列表
 * @property {string} status - 状态
 * @property {string} controlUtxo - 控制 UTXO
 * @property {number} lastUpdated - 最后更新时间戳
 */

/**
 * 查询 DID 列表请求参数
 * @typedef {Object} QueryDIDRequest
 * @property {string} [address] - 地址（与 publicKey 二选一）
 * @property {string} [publicKey] - 公钥（与 address 二选一）
 * @property {number} [page] - 页码，从1开始，默认为1
 * @property {number} [pageSize] - 页大小，最大100，默认100
 */

/**
 * 验证方法信息
 * @typedef {Object} VerificationMethod
 * @property {string} id - 唯一标识
 * @property {string} type - 类型，默认为 'Multikey'
 * @property {string} publicKeyMultibase - 已编码的公钥
 * @property {number} capabilities - 8-bit bitmap，同 verificationCapabilities
 */

/**
 * DID 信息
 * @typedef {Object} DIDInfo
 * @property {string} alias - 别名
 * @property {string} did - DID 标识符
 * @property {string} controller - 控制者
 * @property {VerificationMethod[]} verificationMethods - 验证方法列表
 * @property {string[]} authentication - 身份验证方法ID列表
 * @property {string[]} assertion - 断言方法ID列表
 * @property {string} status - 状态
 * @property {string} controlUtxo - 控制 UTXO (txid:vout 格式)
 * @property {number} createdAt - 创建时间戳
 * @property {number} updatedAt - 更新时间戳
 */

/**
 * 查询 DID 列表响应
 * @typedef {Object} QueryDIDResponse
 * @property {number} count - 总数
 * @property {number} page - 当前页
 * @property {number} pageSize - 页大小
 * @property {DIDInfo[]} dids - DID 列表
 */

// 验证能力常量
export const VERIFICATION_CAPABILITIES = {
  AUTHENTICATION: 1,         // Bit 0: 身份验证
  ASSERTION_METHOD: 2,       // Bit 1: 签名断言
  KEY_AGREEMENT: 4,          // Bit 2: 密钥协商
  CAPABILITY_INVOCATION: 8,  // Bit 3: 能力调用
  CAPABILITY_DELEGATION: 16, // Bit 4: 能力委派
};

// 交易状态常量
export const TX_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  FAILED: 'failed',
  UPDATE_FAILED: 'update_failed',
};

// 密钥类型常量
export const KEY_TYPES = {
  SECP256K1: 'secp256k1',
  ED25519: 'ed25519',
};
