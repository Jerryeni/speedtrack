/**
 * Utility functions for formatting numbers, currencies, and blockchain data
 */

/**
 * Format USDT amount with proper decimals
 * @param amount - Amount as string or number
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string
 */
export function formatUSDT(amount: string | number, decimals: number = 2): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0.00';
  return num.toFixed(decimals);
}

/**
 * Format ST Token amount with proper decimals
 * @param amount - Amount as string or number
 * @param decimals - Number of decimal places (default: 4)
 * @returns Formatted string
 */
export function formatSTToken(amount: string | number, decimals: number = 4): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0.0000';
  return num.toFixed(decimals);
}

/**
 * Format BNB amount with proper decimals
 * @param amount - Amount as string or number
 * @param decimals - Number of decimal places (default: 4)
 * @returns Formatted string
 */
export function formatBNB(amount: string | number, decimals: number = 4): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0.0000';
  return num.toFixed(decimals);
}

/**
 * Format number with thousands separators
 * @param amount - Amount as string or number
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with commas
 */
export function formatNumber(amount: string | number, decimals: number = 2): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0';
  
  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Format currency with symbol
 * @param amount - Amount as string or number
 * @param symbol - Currency symbol (default: '$')
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with symbol
 */
export function formatCurrency(amount: string | number, symbol: string = '$', decimals: number = 2): string {
  const formatted = formatNumber(amount, decimals);
  return `${symbol}${formatted}`;
}

/**
 * Shorten address for display
 * @param address - Ethereum address
 * @param startChars - Number of characters to show at start (default: 6)
 * @param endChars - Number of characters to show at end (default: 4)
 * @returns Shortened address
 */
export function shortenAddress(address: string, startChars: number = 6, endChars: number = 4): string {
  if (!address || address.length < startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Format percentage
 * @param value - Percentage value (0-100)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format large numbers with K, M, B suffixes
 * @param num - Number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string
 */
export function formatCompactNumber(num: number, decimals: number = 1): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(decimals) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(decimals) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(decimals) + 'K';
  }
  return num.toFixed(decimals);
}

/**
 * Format balance with compact notation for large numbers
 * @param balance - Balance as string or number
 * @param decimals - Number of decimal places for small numbers (default: 2)
 * @returns Formatted string
 */
export function formatBalanceCompact(balance: string | number, decimals: number = 2): string {
  const num = typeof balance === 'string' ? parseFloat(balance) : balance;
  if (isNaN(num)) return '0';
  
  // Use compact format for numbers >= 1000
  if (num >= 1000) {
    return formatCompactNumber(num, 2);
  }
  
  // Use regular format for smaller numbers
  return num.toFixed(decimals);
}

/**
 * Parse and clean numeric input
 * @param value - Input value
 * @returns Cleaned numeric string
 */
export function cleanNumericInput(value: string): string {
  // Remove all non-numeric characters except decimal point
  let cleaned = value.replace(/[^\d.]/g, '');
  
  // Ensure only one decimal point
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('');
  }
  
  return cleaned;
}

/**
 * Validate numeric input
 * @param value - Input value
 * @param min - Minimum value (optional)
 * @param max - Maximum value (optional)
 * @returns True if valid
 */
export function isValidNumericInput(value: string, min?: number, max?: number): boolean {
  const num = parseFloat(value);
  
  if (isNaN(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  
  return true;
}
