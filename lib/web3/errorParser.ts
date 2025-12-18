/**
 * Parse contract errors into human-friendly messages
 */

export function parseContractError(error: any): string {
  const errorString = error?.message || error?.toString() || '';
  const errorLower = errorString.toLowerCase();
  
  console.error('Contract Error:', error);

  // User rejected transaction
  if (errorLower.includes('user rejected') || 
      errorLower.includes('user denied') ||
      errorLower.includes('rejected the request') ||
      errorLower.includes('user cancelled')) {
    return '❌ Transaction cancelled. No worries, you can try again anytime!';
  }

  // Insufficient funds for gas
  if (errorLower.includes('insufficient funds for gas') ||
      errorLower.includes('insufficient funds for intrinsic transaction cost')) {
    return '⛽ Not enough BNB for gas fees. Please add some BNB to your wallet (even 0.01 BNB is enough).';
  }

  // Insufficient token balance
  if (errorLower.includes('insufficient funds') ||
      errorLower.includes('insufficient balance')) {
    return '💰 Insufficient balance. Please add more tokens to your wallet and try again.';
  }

  // Gas estimation failed
  if (errorLower.includes('estimategas') ||
      errorLower.includes('gas required exceeds')) {
    return '⚠️ Transaction might fail. Please check: 1) You have enough tokens, 2) You approved the contract, 3) You have BNB for gas.';
  }

  // Already activated
  if (errorLower.includes('already activated')) {
    return '✅ Good news! Your account is already activated. You can start investing now!';
  }

  // Not activated
  if (errorLower.includes('not activated')) {
    return '🔒 Please activate your account first before performing this action.';
  }

  // Invalid referrer
  if (errorLower.includes('invalid referrer')) {
    return '❌ Invalid referrer address. Please double-check the address and try again.';
  }

  // Allowance issues
  if (errorLower.includes('insufficient allowance') ||
      errorLower.includes('erc20insufficientallowance')) {
    return '🔐 Token approval needed. Please approve the contract to spend your tokens first.';
  }

  if (errorLower.includes('allowance') || errorLower.includes('approve')) {
    return '🔐 Please approve the token spending first, then try again.';
  }

  // Network issues
  if (errorLower.includes('network changed') ||
      errorLower.includes('chain mismatch')) {
    return '🌐 Wrong network detected. Please switch to BSC Testnet (Chain ID: 97) in your wallet.';
  }

  if (errorLower.includes('network') || errorLower.includes('connection')) {
    return '📡 Network connection issue. Please check your internet connection and try again.';
  }

  // Contract not found
  if (errorLower.includes('contract') && errorLower.includes('not found')) {
    return '🔍 Contract not found. Please make sure you are on BSC Testnet (Chain ID: 97).';
  }

  // Nonce issues
  if (errorLower.includes('nonce')) {
    return '🔄 Transaction order issue. Please reset your MetaMask account (Settings → Advanced → Reset Account) and try again.';
  }

  // Timeout
  if (errorLower.includes('timeout') || errorLower.includes('timed out')) {
    return '⏱️ Transaction timed out. The network might be busy. Please try again in a moment.';
  }

  // Missing revert data (contract call failed)
  if (errorLower.includes('missing revert data')) {
    return '❌ Transaction failed. Common fixes: 1) Approve tokens first, 2) Check you have enough USDT, 3) Ensure you have BNB for gas.';
  }

  // Generic execution reverted
  if (errorLower.includes('execution reverted')) {
    // Try to extract revert reason
    const reasonMatch = errorString.match(/reason="([^"]+)"/);
    if (reasonMatch) {
      return `❌ Transaction rejected: ${reasonMatch[1]}. Please check your inputs and try again.`;
    }
    return '❌ Transaction was rejected. Please verify: 1) Your inputs are correct, 2) You have enough balance, 3) You approved the contract.';
  }

  // Pool related errors
  if (errorLower.includes('pool full') || errorLower.includes('pool closed')) {
    return '🏊 This pool is full or closed. Please try investing in the next available pool.';
  }

  // Amount related errors
  if (errorLower.includes('amount too low') || errorLower.includes('minimum')) {
    return '📊 Amount is too low. Please increase your investment amount.';
  }

  if (errorLower.includes('amount too high') || errorLower.includes('maximum') || errorLower.includes('exceeds')) {
    return '📊 Amount exceeds the maximum allowed for your activation level. Please reduce the amount.';
  }

  // Registration errors
  if (errorLower.includes('owner cannot register')) {
    return '👑 You are the contract owner and are automatically registered! You can skip registration and proceed directly to activate your account.';
  }

  if (errorLower.includes('already registered')) {
    return '✅ You are already registered! You can proceed to activate your account.';
  }

  if (errorLower.includes('invalid referral code')) {
    return '❌ Invalid referral code. Please check the code and try again, or use "ADMIN" as the referral code.';
  }

  // Default fallback with helpful tips
  if (errorString.length > 100) {
    return '❌ Transaction failed. Quick fixes: 1) Check your wallet balance, 2) Approve tokens if needed, 3) Ensure you have BNB for gas. Contact support if the issue persists.';
  }

  return errorString || '❌ Something went wrong. Please try again or contact support if the problem continues.';
}

/**
 * Parse activation-specific errors
 */
export function parseActivationError(error: any): string {
  const errorString = error?.message || error?.toString() || '';
  const errorLower = errorString.toLowerCase();

  // Check for specific activation errors first
  if (errorLower.includes('already activated')) {
    return '✅ Great! Your account is already activated. You can start investing right away!';
  }

  if (errorLower.includes('not registered')) {
    return '📝 Please register your account first before activating. Go to the registration page to get started.';
  }

  if (errorLower.includes('insufficient') && errorLower.includes('usdt')) {
    return '💰 You need USDT to activate your account. Level 0 requires 10 USDT. Please add USDT to your wallet and try again.';
  }

  if (errorLower.includes('invalid referrer')) {
    return '❌ The referrer address is invalid. Please double-check the address or use a valid referral code.';
  }

  if (errorLower.includes('estimategas') || errorLower.includes('missing revert data')) {
    // Try to extract more specific error info
    const errorMsg = error.message || error.toString();
    console.error('Full activation error:', error);
    
    // Check for specific contract errors
    if (errorMsg.includes('not registered')) {
      return '❌ You must register your account before activating. Please complete registration first.';
    }
    if (errorMsg.includes('already activated')) {
      return '✅ Your account is already activated! You can start investing now.';
    }
    if (errorMsg.includes('insufficient')) {
      return '💰 Insufficient USDT balance. Please add more USDT to your wallet for the activation fee.';
    }
    
    return `⚠️ Activation failed. ${errorMsg.includes('revert') ? 'Contract rejected the transaction.' : ''} Please check: 1) You are registered, 2) You have enough USDT, 3) You approved USDT spending, 4) You have BNB for gas.`;
  }

  if (errorLower.includes('insufficient allowance')) {
    return '🔐 Please approve USDT spending first. Click "Approve" when prompted by your wallet, then try activating again.';
  }

  // Fall back to general error parser
  return parseContractError(error);
}

/**
 * Parse trading-specific errors
 */
export function parseTradingError(error: any): string {
  const errorString = error?.message || error?.toString() || '';
  const errorLower = errorString.toLowerCase();

  if (errorLower.includes('insufficient') && errorLower.includes('usdt')) {
    return '💰 Not enough USDT to complete this purchase. Please add more USDT to your wallet.';
  }

  if (errorLower.includes('insufficient') && (errorLower.includes('st') || errorLower.includes('token'))) {
    return '🪙 Not enough ST tokens to sell. Please check your ST token balance.';
  }

  if (errorLower.includes('minimum')) {
    return '📊 Amount is too low. Please increase the amount to meet the minimum requirement.';
  }

  if (errorLower.includes('maximum')) {
    return '📊 Amount is too high. Please reduce the amount to stay within the maximum limit.';
  }

  if (errorLower.includes('no liquidity') || errorLower.includes('insufficient liquidity')) {
    return '💧 Not enough liquidity available. Please try a smaller amount or wait for more liquidity.';
  }

  if (errorLower.includes('price')) {
    return '💱 Price has changed. Please refresh and try again with the updated price.';
  }

  return parseContractError(error);
}

/**
 * Parse investment-specific errors
 */
export function parseInvestmentError(error: any): string {
  const errorString = error?.message || error?.toString() || '';
  const errorLower = errorString.toLowerCase();

  if (errorLower.includes('not activated')) {
    return '🔒 Please activate your account first. Go to the activation page to get started!';
  }

  if (errorLower.includes('minimum investment') || errorLower.includes('amount too low')) {
    return '📊 Investment amount is too low. The minimum investment is 10 USDT. Please increase your amount.';
  }

  if (errorLower.includes('maximum investment') || errorLower.includes('exceeds maximum')) {
    return '📊 Investment amount exceeds your level limit. Please reduce the amount or upgrade your activation level.';
  }

  if (errorLower.includes('pool full') || errorLower.includes('pool closed')) {
    return '🏊 This pool is full or closed. Please wait for the next pool to open or try a different pool.';
  }

  if (errorLower.includes('insufficient usdt')) {
    return '💰 Not enough USDT in your wallet. Please add more USDT and try again.';
  }

  if (errorLower.includes('not eligible')) {
    return '⚠️ You are not eligible for this pool. Please check the pool requirements.';
  }

  if (errorLower.includes('already invested')) {
    return '✅ You have already invested in this pool. You can invest in other pools or wait for this one to complete.';
  }

  return parseContractError(error);
}

/**
 * Parse registration-specific errors
 */
export function parseRegistrationError(error: any): string {
  const errorString = error?.message || error?.toString() || '';
  const errorLower = errorString.toLowerCase();

  if (errorLower.includes('owner cannot register') || errorLower.includes('owner_cannot_register')) {
    return '👑 You are the contract owner! Owners are automatically registered and cannot register again. Please proceed directly to activate your account.';
  }

  if (errorLower.includes('already registered')) {
    return '✅ You are already registered! You can proceed to activate your account.';
  }

  if (errorLower.includes('invalid referral code')) {
    return '❌ Invalid referral code. Please check the code or use "ADMIN" as the default referral code.';
  }

  if (errorLower.includes('referrer not found')) {
    return '❌ Referrer not found. Please verify the referral code or contact the person who referred you.';
  }

  if (errorLower.includes('invalid leader')) {
    return '❌ Invalid leader address. Please check the address or leave it empty if you don\'t have a leader.';
  }

  return parseContractError(error);
}

/**
 * Parse claim-specific errors
 */
export function parseClaimError(error: any): string {
  const errorString = error?.message || error?.toString() || '';
  const errorLower = errorString.toLowerCase();

  if (errorLower.includes('nothing to claim') || errorLower.includes('no claimable')) {
    return '💰 You don\'t have any rewards to claim yet. Keep investing and earning!';
  }

  if (errorLower.includes('too soon') || errorLower.includes('wait')) {
    return '⏰ Please wait a bit longer before claiming again. ROI accumulates daily.';
  }

  if (errorLower.includes('not activated')) {
    return '🔒 Please activate your account first to start earning and claiming rewards.';
  }

  return parseContractError(error);
}

/**
 * Parse profile-specific errors
 */
export function parseProfileError(error: any): string {
  const errorString = error?.message || error?.toString() || '';
  const errorLower = errorString.toLowerCase();

  if (errorLower.includes('already completed')) {
    return '✅ Your profile is already complete! You can update it anytime from the profile page.';
  }

  if (errorLower.includes('invalid email')) {
    return '📧 Please enter a valid email address.';
  }

  if (errorLower.includes('invalid phone') || errorLower.includes('invalid mobile')) {
    return '📱 Please enter a valid mobile number.';
  }

  return parseContractError(error);
}
