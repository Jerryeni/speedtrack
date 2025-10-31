/**
 * Parse contract errors into human-friendly messages
 */

export function parseContractError(error: any): string {
  const errorString = error?.message || error?.toString() || '';
  
  console.error('Contract Error:', error);

  // User rejected transaction
  if (errorString.includes('user rejected') || 
      errorString.includes('User denied') ||
      errorString.includes('rejected the request')) {
    return 'You cancelled the transaction';
  }

  // Insufficient funds
  if (errorString.includes('insufficient funds') ||
      errorString.includes('insufficient balance')) {
    return 'Insufficient funds in your wallet. Please add more tokens.';
  }

  // Gas estimation failed
  if (errorString.includes('estimateGas') ||
      errorString.includes('gas required exceeds')) {
    return 'Transaction may fail. Please check your balance and try again.';
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
      errorString.includes('approve')) {
    return 'Token approval required. Please approve the transaction.';
  }

  // Network issues
  if (errorString.includes('network') ||
      errorString.includes('connection')) {
    return 'Network connection issue. Please check your internet and try again.';
  }

  // Contract not found
  if (errorString.includes('contract') && errorString.includes('not found')) {
    return 'Contract not found. Please ensure you are on the correct network.';
  }

  // Nonce issues
  if (errorString.includes('nonce')) {
    return 'Transaction error. Please reset your wallet and try again.';
  }

  // Timeout
  if (errorString.includes('timeout')) {
    return 'Transaction timed out. Please try again.';
  }

  // Missing revert data (contract call failed)
  if (errorString.includes('missing revert data')) {
    return 'Transaction failed. Please ensure you have enough USDT and try again.';
  }

  // Generic execution reverted
  if (errorString.includes('execution reverted')) {
    return 'Transaction was rejected by the contract. Please check your inputs and try again.';
  }

  // Default fallback
  if (errorString.length > 100) {
    return 'Transaction failed. Please try again or contact support if the issue persists.';
  }

  return errorString || 'An unexpected error occurred. Please try again.';
}

/**
 * Parse activation-specific errors
 */
export function parseActivationError(error: any): string {
  const errorString = error?.message || error?.toString() || '';

  // Check for specific activation errors first
  if (errorString.includes('already activated')) {
    return 'Your account is already activated. No need to activate again!';
  }

  if (errorString.includes('insufficient') && errorString.includes('USDT')) {
    return 'You need at least 10 USDT to activate your account. Please add USDT to your wallet.';
  }

  if (errorString.includes('invalid referrer')) {
    return 'The referrer address is invalid. Please check the address and try again.';
  }

  if (errorString.includes('estimateGas') || errorString.includes('missing revert data')) {
    return 'Unable to activate. Please ensure you have at least 10 USDT and have approved the contract.';
  }

  // Fall back to general error parser
  return parseContractError(error);
}

/**
 * Parse trading-specific errors
 */
export function parseTradingError(error: any): string {
  const errorString = error?.message || error?.toString() || '';

  if (errorString.includes('insufficient') && errorString.includes('USDT')) {
    return 'Insufficient USDT balance for this purchase';
  }

  if (errorString.includes('insufficient') && errorString.includes('ST')) {
    return 'Insufficient ST token balance for this sale';
  }

  if (errorString.includes('minimum')) {
    return 'Amount is below the minimum required';
  }

  if (errorString.includes('maximum')) {
    return 'Amount exceeds the maximum allowed';
  }

  return parseContractError(error);
}

/**
 * Parse investment-specific errors
 */
export function parseInvestmentError(error: any): string {
  const errorString = error?.message || error?.toString() || '';

  if (errorString.includes('not activated')) {
    return 'Please activate your account before investing';
  }

  if (errorString.includes('minimum investment')) {
    return 'Investment amount is below the minimum required';
  }

  if (errorString.includes('maximum investment')) {
    return 'Investment amount exceeds the maximum allowed';
  }

  if (errorString.includes('pool closed')) {
    return 'This pool is currently closed for investments';
  }

  return parseContractError(error);
}
