import { ethers } from 'ethers';
import { getSTTokenContract, getSTTokenReadOnly } from './contracts';

// Helper function to safely format BigInt values
function safeFormatUnits(value: any, decimals: number): string {
  try {
    if (!value || value === null || value === undefined) return '0';
    return ethers.formatUnits(value, decimals);
  } catch (error) {
    console.error('Error formatting units:', error);
    return '0';
  }
}

export async function calculateSTAmount(usdtAmount: string): Promise<string> {
  try {
    const stToken = await getSTTokenReadOnly();
    const buyPrice = await stToken.getBuyPrice();
    
    if (!buyPrice || buyPrice === BigInt(0)) {
      throw new Error('Invalid buy price');
    }
    
    const amountWei = ethers.parseUnits(usdtAmount, 6);
    
    // ST amount = USDT amount / buy price
    const stAmount = (amountWei * ethers.parseEther('1')) / buyPrice;
    return ethers.formatEther(stAmount);
  } catch (error) {
    console.error('Error calculating ST amount:', error);
    throw new Error('Failed to calculate ST amount');
  }
}

export async function calculateSellAmount(stAmount: string): Promise<string> {
  try {
    const stToken = await getSTTokenReadOnly();
    const sellPrice = await stToken.getSellPrice();
    
    if (!sellPrice || sellPrice === BigInt(0)) {
      throw new Error('Invalid sell price');
    }
    
    const amountWei = ethers.parseEther(stAmount);
    
    // USDT amount = ST amount * sell price
    const usdtAmount = (amountWei * sellPrice) / ethers.parseEther('1');
    return ethers.formatUnits(usdtAmount, 6);
  } catch (error) {
    console.error('Error calculating sell amount:', error);
    throw new Error('Failed to calculate sell amount');
  }
}

export async function sellST(stAmount: string): Promise<ethers.ContractTransactionResponse> {
  const stToken = await getSTTokenContract();
  const amountWei = ethers.parseEther(stAmount);
  
  return await stToken.sell(amountWei);
}

export async function getSTPrice(): Promise<{ buyPrice: string; sellPrice: string }> {
  try {
    const stToken = await getSTTokenReadOnly();
    const [buyPrice, sellPrice] = await Promise.all([
      stToken.getBuyPrice(),
      stToken.getSellPrice()
    ]);
    
    return {
      buyPrice: safeFormatUnits(buyPrice, 6),
      sellPrice: safeFormatUnits(sellPrice, 6)
    };
  } catch (error) {
    console.error('Error fetching ST price:', error);
    return { buyPrice: '1.0', sellPrice: '0.9' };
  }
}

export async function getSTTokenStats() {
  try {
    const stToken = await getSTTokenReadOnly();
    const [totalLiquidity, totalMinted, totalBurned, totalAvailable] = await Promise.all([
      stToken.getTotalLiquidity().catch(() => BigInt(0)),
      stToken.getTotalMintedTokens().catch(() => BigInt(0)),
      stToken.getTotalBurnedTokens().catch(() => BigInt(0)),
      stToken.getTotalAvailableTokens().catch(() => BigInt(0))
    ]);
    
    return {
      totalLiquidity: safeFormatUnits(totalLiquidity, 6),
      totalMinted: safeFormatUnits(totalMinted, 18),
      totalBurned: safeFormatUnits(totalBurned, 18),
      totalAvailable: safeFormatUnits(totalAvailable, 18)
    };
  } catch (error) {
    console.error('Error fetching ST token stats:', error);
    return {
      totalLiquidity: '0',
      totalMinted: '0',
      totalBurned: '0',
      totalAvailable: '0'
    };
  }
}
