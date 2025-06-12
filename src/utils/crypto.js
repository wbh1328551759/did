/**
 * 密钥类型前缀映射（与链端保持一致）
 */
export const PUBLIC_KEY_PREFIXES = {
  "ed25519": 0xED01,      // Ed25519 public key
  "secp256k1": 0xE701,    // Secp256k1 public key (Bitcoin默认)
  "p256": 0x8024,         // P-256 public key
  "p384": 0x8124,         // P-384 public key
  "bls12-381": 0xEB01,    // BLS12-381 public key
  "sm2": 0x8624,          // SM2 public key
}

/**
 * 检测公钥类型
 * @param {string} publicKey - 十六进制格式的公钥
 * @returns {string} 密钥类型
 */
export const detectKeyType = (publicKey) => {
  if (!publicKey || typeof publicKey !== 'string') {
    return 'secp256k1' // 默认返回比特币常用类型
  }

  // 移除可能的 0x 前缀
  const cleanKey = publicKey.replace(/^0x/i, '')

  // 根据公钥长度和格式判断类型
  if (cleanKey.length === 64) {
    // 32字节 = 64字符，可能是压缩的 secp256k1 公钥或 ed25519
    // 比特币钱包通常提供压缩或未压缩的 secp256k1 公钥
    return 'secp256k1'
  } else if (cleanKey.length === 66) {
    // 33字节 = 66字符，压缩的 secp256k1 公钥（带前缀02或03）
    const prefix = cleanKey.substring(0, 2)
    if (prefix === '02' || prefix === '03') {
      return 'secp256k1'
    }
    return 'secp256k1'
  } else if (cleanKey.length === 130) {
    // 65字节 = 130字符，未压缩的 secp256k1 公钥（带前缀04）
    const prefix = cleanKey.substring(0, 2)
    if (prefix === '04') {
      return 'secp256k1'
    }
    return 'secp256k1'
  }

  // 对于其他长度，尝试根据前缀检测
  if (cleanKey.length >= 4) {
    const prefixHex = parseInt(cleanKey.substring(0, 4), 16)
    
    for (const [keyType, prefix] of Object.entries(PUBLIC_KEY_PREFIXES)) {
      if (prefixHex === prefix) {
        return keyType
      }
    }
  }

  // 默认返回比特币常用的 secp256k1
  return 'secp256k1'
}

/**
 * 验证公钥格式是否有效
 * @param {string} publicKey - 公钥
 * @param {string} expectedType - 期望的密钥类型
 * @returns {boolean} 是否有效
 */
export const isValidPublicKey = (publicKey, expectedType = null) => {
  if (!publicKey || typeof publicKey !== 'string') {
    return false
  }

  const cleanKey = publicKey.replace(/^0x/i, '')
  
  // 检查是否为有效的十六进制字符串
  if (!/^[0-9a-fA-F]+$/.test(cleanKey)) {
    return false
  }

  const detectedType = detectKeyType(publicKey)
  
  // 如果指定了期望类型，检查是否匹配
  if (expectedType && detectedType !== expectedType) {
    return false
  }

  // 根据检测到的类型验证长度
  switch (detectedType) {
    case 'secp256k1':
      // secp256k1 可以是压缩（33字节）或未压缩（65字节）格式
      return cleanKey.length === 66 || cleanKey.length === 130 || cleanKey.length === 64
    case 'ed25519':
      // ed25519 通常是32字节
      return cleanKey.length === 64
    case 'p256':
    case 'p384':
    case 'bls12-381':
    case 'sm2':
      // 其他类型的验证规则可以根据需要添加
      return true
    default:
      return false
  }
}

/**
 * 格式化公钥显示
 * @param {string} publicKey - 公钥
 * @returns {string} 格式化后的公钥
 */
export const formatPublicKey = (publicKey) => {
  if (!publicKey) return ''
  
  const cleanKey = publicKey.replace(/^0x/i, '')
  if (cleanKey.length <= 16) return cleanKey
  
  return `${cleanKey.substring(0, 8)}...${cleanKey.substring(cleanKey.length - 8)}`
}

/**
 * 获取密钥类型的显示名称
 * @param {string} keyType - 密钥类型
 * @returns {string} 显示名称
 */
export const getKeyTypeDisplayName = (keyType) => {
  const displayNames = {
    'secp256k1': 'Secp256k1 (Bitcoin)',
    'ed25519': 'Ed25519',
    'p256': 'P-256',
    'p384': 'P-384',
    'bls12-381': 'BLS12-381',
    'sm2': 'SM2'
  }
  
  return displayNames[keyType] || keyType
}

/**
 * Base64 转 Hex
 * @param {string} base64String - Base64编码的字符串
 * @returns {string} 十六进制字符串
 */
export function base64ToHex(base64String) {
  try {
    if (!base64String) {
      throw new Error('Base64 string is required')
    }

    // 移除可能的前缀和后缀空格
    const cleanBase64 = base64String.trim()
    
    // 验证Base64格式
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/
    if (!base64Regex.test(cleanBase64)) {
      throw new Error('Invalid base64 format')
    }
    
    // 使用atob解码base64字符串为binary string
    const binaryString = atob(cleanBase64)
    
    // 将binary string转换为hex字符串
    let hexString = ''
    for (let i = 0; i < binaryString.length; i++) {
      // 获取字符的字节值(0-255)
      const byte = binaryString.charCodeAt(i) & 0xFF
      // 转换为2位的十六进制字符串，不足2位前面补0
      const hex = byte.toString(16).toLowerCase().padStart(2, '0')
      hexString += hex
    }
    
    return hexString
  } catch (error) {
    console.error('Base64 to Hex conversion failed:', error)
    throw new Error(`Invalid base64 string: ${error.message}`)
  }
}

/**
 * Hex 转 Base64
 * @param {string} hexString - 十六进制字符串
 * @returns {string} Base64编码的字符串
 */
export function hexToBase64(hexString) {
  try {
    if (!hexString) {
      throw new Error('Hex string is required')
    }

    // 移除可能的0x前缀和空格
    const cleanHex = hexString.replace(/^0x/i, '').trim().toLowerCase()
    
    // 验证十六进制格式
    const hexRegex = /^[0-9a-f]*$/
    if (!hexRegex.test(cleanHex)) {
      throw new Error('Invalid hex format - only 0-9 and a-f characters allowed')
    }
    
    // 确保十六进制字符串长度为偶数
    if (cleanHex.length % 2 !== 0) {
      throw new Error('Invalid hex string length - must be even number of characters')
    }
    
    // 将hex字符串转换为binary string
    let binaryString = ''
    for (let i = 0; i < cleanHex.length; i += 2) {
      const hexByte = cleanHex.substring(i, i + 2)
      const byte = parseInt(hexByte, 16)
      if (isNaN(byte)) {
        throw new Error(`Invalid hex byte: ${hexByte}`)
      }
      // 将字节值转换为字符
      binaryString += String.fromCharCode(byte)
    }
    
    // 使用btoa编码为base64字符串
    return btoa(binaryString)
  } catch (error) {
    console.error('Hex to Base64 conversion failed:', error)
    throw new Error(`Invalid hex string: ${error.message}`)
  }
} 