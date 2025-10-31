/**
 * Referral Code Generator
 * Generates unique 8-character codes from wallet addresses
 */

/**
 * Generate a unique referral code from a wallet address
 * Format: 2 letters + 6 alphanumeric characters (e.g., RX7K9M2P)
 */
export function generateReferralCode(walletAddress: string): string {
  // Remove '0x' prefix and convert to uppercase
  const cleanAddress = walletAddress.replace('0x', '').toUpperCase();
  
  // Use first 2 characters as letters (convert numbers to letters)
  const char1 = convertToLetter(cleanAddress[0]);
  const char2 = convertToLetter(cleanAddress[2]);
  
  // Use characters from different positions for uniqueness
  const char3 = cleanAddress[4];
  const char4 = convertToLetter(cleanAddress[6]);
  const char5 = cleanAddress[8];
  const char6 = convertToLetter(cleanAddress[10]);
  const char7 = cleanAddress[12];
  const char8 = convertToLetter(cleanAddress[14]);
  
  return `${char1}${char2}${char3}${char4}${char5}${char6}${char7}${char8}`;
}

/**
 * Convert a hex character to a letter (A-Z)
 */
function convertToLetter(char: string): string {
  const hexToLetter: { [key: string]: string } = {
    '0': 'A', '1': 'B', '2': 'C', '3': 'D', '4': 'E',
    '5': 'F', '6': 'G', '7': 'H', '8': 'I', '9': 'J',
    'A': 'K', 'B': 'L', 'C': 'M', 'D': 'N', 'E': 'O', 'F': 'P'
  };
  
  return hexToLetter[char.toUpperCase()] || 'X';
}

/**
 * Validate referral code format
 */
export function isValidReferralCode(code: string): boolean {
  // Check if code is 8 characters and alphanumeric
  return /^[A-Z0-9]{8}$/.test(code.toUpperCase());
}

/**
 * Store referral code mapping in localStorage
 */
export function storeReferralMapping(code: string, walletAddress: string): void {
  try {
    const mappings = getReferralMappings();
    mappings[code] = walletAddress.toLowerCase();
    localStorage.setItem('referralMappings', JSON.stringify(mappings));
  } catch (error) {
    console.error('Error storing referral mapping:', error);
  }
}

/**
 * Get all referral mappings from localStorage
 */
export function getReferralMappings(): { [code: string]: string } {
  try {
    const stored = localStorage.getItem('referralMappings');
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error getting referral mappings:', error);
    return {};
  }
}

/**
 * Get wallet address from referral code
 */
export function getWalletFromCode(code: string): string | null {
  try {
    const mappings = getReferralMappings();
    return mappings[code.toUpperCase()] || null;
  } catch (error) {
    console.error('Error getting wallet from code:', error);
    return null;
  }
}

/**
 * Get referral code from wallet address
 */
export function getCodeFromWallet(walletAddress: string): string {
  try {
    const mappings = getReferralMappings();
    const code = Object.keys(mappings).find(
      key => mappings[key].toLowerCase() === walletAddress.toLowerCase()
    );
    
    if (code) {
      return code;
    }
    
    // Generate new code if not found
    const newCode = generateReferralCode(walletAddress);
    storeReferralMapping(newCode, walletAddress);
    return newCode;
  } catch (error) {
    console.error('Error getting code from wallet:', error);
    return generateReferralCode(walletAddress);
  }
}

/**
 * Format referral link with code
 * Includes wallet address as URL parameter for fallback
 */
export function formatReferralLink(walletAddress: string, baseUrl?: string): string {
  const code = getCodeFromWallet(walletAddress);
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://racepool.io');
  // Include wallet address as URL parameter for fallback
  return `${base}/ref/${code}?wallet=${walletAddress}`;
}

/**
 * Format short referral link
 */
export function formatShortReferralLink(walletAddress: string): string {
  const code = getCodeFromWallet(walletAddress);
  // Use actual domain or localhost for development
  const domain = typeof window !== 'undefined' 
    ? window.location.host 
    : 'racepool.io';
  return `${domain}/ref/${code}`;
}
