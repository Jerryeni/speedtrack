import { ethers } from 'ethers';
import { getSpeedTrackContract, getSpeedTrackReadOnly, checkUSDTAllowance, approveUSDT } from './contracts';

export async function calculateSTAmount(usdtAmount: string): Promise<string> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const amountWei = ethers.parseEther(usdtAmount);
    const stAmount = await speedTrack.calculateSTAmount(amountWei);
    return ethers.formatEther(stAmount);
  } catch (error) {
    throw new Error('Failed to calculate ST amount');
  }
}

export async function calculateSellAmount(stAmount: string): Promise<string> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const amountWei = ethers.parseEther(stAmount);
    const usdtAmount = await speedTrack.calculateSellAmount(amountWei);
    return ethers.formatEther(usdtAmount);
  } catch (error) {
    throw new Error('Failed to calculate sell amount');
  }
}

export async function buyST(usdtAmount: string, userAddress: string): Promise<ethers.ContractTransactionResponse> {
  const speedTrack = await getSpeedTrackContract();
  const amountWei = ethers.parseEther(usdtAmount);
  
  const allowance = await checkUSDTAllowance(userAddress);
  if (ethers.parseEther(allowance) < amountWei) {
    const approveTx = await approveUSDT(usdtAmount);
    await approveTx.wait();
  }

  return await speedTrack.buyST(amountWei);
}

export async function sellST(stAmount: string): Promise<ethers.ContractTransactionResponse> {
  const speedTrack = await getSpeedTrackContract();
  const amountWei = ethers.parseEther(stAmount);
  
  return await speedTrack.sellST(amountWei);
}

export async function getSTPrice(): Promise<{ buyPrice: string; sellPrice: string }> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const totalLiquidity = await speedTrack.getTotalLiquidity();
    const totalSTTokens = await speedTrack.getTotalSTTokens();
    
    if (totalSTTokens === BigInt(0)) {
      return { buyPrice: '1.0', sellPrice: '0.9' };
    }
    
    const buyPrice = parseFloat(ethers.formatEther(totalLiquidity)) / parseFloat(ethers.formatEther(totalSTTokens));
    const sellPrice = buyPrice * 0.9;
    
    return {
      buyPrice: buyPrice.toFixed(6),
      sellPrice: sellPrice.toFixed(6)
    };
  } catch (error) {
    return { buyPrice: '1.0', sellPrice: '0.9' };
  }
}
