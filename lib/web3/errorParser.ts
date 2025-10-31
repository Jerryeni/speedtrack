/**
 * Parse Web3/Contract errors into human-readable messages
 */

export function parseWeb3Error(error: any): string {
  const errorString = error?.message || error?.toString() || '';
  
  console.error('Raw error:', error);
  
  // User rejected transaction
  if (errorString.includes('user rejected') || 
      errorString.includes('User denied') ||
      errorString.includes('user denied')) {
    return 'You cancelled the transaction';
  }
  
  // Insufficient funds
  if (errorString.includes('insufficient funds') ||
      errorString.includes('insufficient balance')) {
    return 'Insufficient funds in your wallet. Please add more tokens.';
  }
  
  // Gas estimation failed
  if (errorString.includes('estimateGas') ||
      errorString.includes('cannot estimate gas')) {
    return 'Transaction would fail. Please check your balance and try again.';
  }
  
  // Already activated
  if (errorString.includes('already activated') ||
      errorString.includes('AlreadyActivated')) {
    return 'Your account is already activated';
  }
  
  // Invalid referrer
  if (errorString.includes('invalid referrer') ||
      errorString.includes('InvalidReferrer')) {
    return 'Invalid referrer address. Please check and try again.';
  }
  
  // Allowance issues
  if (errorString.includes('allowance') ||
      errorString.includes('ERC20: insufficient allowance')) {
    return 'Token approval required. Please approve USDT spending first.';
  }
  
  // Network issues
  if (errorString.includes('network') ||
      errorString.includes('connection')) {
    return 'Network connection issue. Please check your internet and try again.';
  }
  
  // Nonce issues
  if (errorString.includes('nonce')) {
    return 'Transaction conflict. Please try again in a moment.';
  }
  
  // Contract reverted
  if (errorString.includes('execution reverted')) {
    // Try to extract revert reason
    const reasonMatch = errorString.match(/reason="([^"]+)"/);
    if (reasonMatch) {
      return `Transaction failed: ${reasonMatch[1]}`;
    }
    return 'Transaction was rejected by the contract. Please check your inputs.';
  }
  
  // Missing revert data (usually means transaction would fail)
  if (errorString.includes('missing revert data')) {
    return 'Transaction cannot be processed. Please ensure you have enough USDT (10 USDT required) and try again.';
  }
  
  // Timeout
  if (errorString.includes('timeout')) {
    return 'Transaction timed out. Please try again.';
  }
  
  // Generic fallback
  if (errorString.length > 200) {
    return 'Transaction failed. Please check your wallet balance and network connection.';
  }
  
  return errorString || 'An unexpected error occurred. Please try again.';
}

/**
 * Parse activation-specific errors
 */
export function parseActivationError(error: any): string {
  const errorString = error?.message || error?.toString() || '';
  
  // Check for specific activation errors first
  if (errorString.includes('missing revert data')) {
    return 'Unable to activate. Please ensure you have at least 10 USDT in your wallet and have approved the contract to spend it.';
  }
  
  if (errorString.includes('estimateGas')) {
    return 'Activation would fail. Common reasons:\n• Insufficient USDT balance (need 10 USDT)\n• USDT not approved for spending\n• Invalid referrer address\n• Account already activated';
  }
  
  // Use general parser
  return parseWeb3Error(error);
}

/**
 * Parse trading errors
 */
export function parseTradingError(error: any): string {
  const errorString = error?.message || error?.toString() || '';
  
  if (errorString.includes('insufficient')) {
    return 'Insufficient token balance for this trade';
  }
  
  if (errorString.includes('slippage')) {
    return 'Price changed too much. Please try again.';
  }
  
  return parseWeb3Error(error);
}

/**
 * Parse pool investment errors
 */
export function parsePoolError(error: any): string {
  const errorString = error?.message || error?.toString() || '';
  
  if (errorString.includes('minimum')) {
    return 'Investment amount is below the minimum required';
  }
  
  if (errorString.includes('maximum')) {
    return 'Investment amount exceeds the maximum allowed';
  }
  
  if (errorString.includes('pool full')) {
    return 'This pool is currently full. Please try another pool.';
  }
  
  return parseWeb3Error(error);
}
