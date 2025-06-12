const BtcAddressType = {
  'Native Segwit': 'Native Segwit',
  'Nested Segwit': 'Nested Segwit',
  Taproot: 'Taproot',
  Legacy: 'Legacy',
  TestNet: 'testnet',
}

// @param {string} account
export const detectBtcAddress = (account) => {
  if (!account) return undefined
  if (account.startsWith('1')) {
    return BtcAddressType.Legacy
  } else if (account.startsWith('3')) {
    return BtcAddressType['Nested Segwit']
  } else if (account.startsWith('bc1p')) {
    return BtcAddressType.Taproot
  } else if (account.startsWith('bc1q')) {
    return BtcAddressType['Native Segwit']
  } else {
    return undefined
  }
}

// @param {string} account
export const detectTestnetBtcAddress = (account) => {
  if (!account) return undefined
  if (account.startsWith('m')) {
    return BtcAddressType.Legacy
  } else if (account.startsWith('2')) {
    return BtcAddressType['Nested Segwit']
  } else if (account.startsWith('tb1p')) {
    return BtcAddressType.Taproot
  } else if (account.startsWith('tb1q')) {
    return BtcAddressType['Native Segwit']
  } else {
    return undefined
  }
}

export const detectTestNetBtcAddress = (account) => {
  if (!account) return undefined
  if (account.startsWith('tb1')) {
    return BtcAddressType.TestNet
  } else {
    return undefined
  }
}

/**
 * 验证地址是否为 Taproot 类型
 * @param {string} address - 比特币地址
 * @returns {boolean} 是否为 Taproot 地址
 */
export const isTaprootAddress = (address) => {
  return detectBtcAddress(address) === BtcAddressType.Taproot
}

/**
 * 验证地址类型并返回错误信息
 * @param {string} address - 比特币地址
 * @returns {Object} { isValid: boolean, error?: string, addressType?: string }
 */
export const validateTaprootAddress = (address) => {
  if (!address) {
    return {
      isValid: false,
      error: 'Address is Empty'
    }
  }

  // todo
  const addressType = detectTestnetBtcAddress(address)

  console.log('addressType', address, addressType)
  if (addressType === BtcAddressType.Taproot) {
    return {
      isValid: true,
      addressType
    }
  }

  return {
    isValid: false,
    error: `Only support Taproot address (bc1p...), current address type: ${addressType || 'unknown'}. Please switch to Taproot address in your wallet.`,
    addressType
  }
}
