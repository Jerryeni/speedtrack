import { ethers } from 'ethers';
import { getSigner, getProvider, getFallbackProvider } from './wallet';
import { CONTRACTS } from './config';
import SpeedTrackABI from '../contracts/abis/SpeedTrack.json';
import STTokenABI from '../contracts/abis/STToken.json';
import USDTABI from '../contracts/abis/USDT.json';

export async function getSpeedTrackContract() {
  const signer = await getSigner();
  if (!signer) throw new Error('Wallet not connected');
  
  return new ethers.Contract(CONTRACTS.SPEEDTRACK, SpeedTrackABI, signer);
}

export async function getSTTokenContract() {
  const signer = await getSigner();
  if (!signer) throw new Error('Wallet not connected');
  
  return new ethers.Contract(CONTRACTS.STTOKEN, STTokenABI, signer);
}

export async function getUSDTContract() {
  const signer = await getSigner();
  if (!signer) throw new Error('Wallet not connected');
  
  return new ethers.Contract(CONTRACTS.USDT, USDTABI, signer);
}

export async function getSpeedTrackReadOnly() {
  try {
    // Try browser provider first (if wallet is connected)
    let provider: ethers.BrowserProvider | ethers.JsonRpcProvider | null = getProvider();
    
    // Fall back to JSON-RPC provider if browser provider not available
    if (!provider) {
      console.log('Using fallback RPC provider for read-only operations');
      provider = getFallbackProvider();
    }
    
    const contract = new ethers.Contract(CONTRACTS.SPEEDTRACK, SpeedTrackABI, provider);
    return contract;
  } catch (error: any) {
    console.error('Error creating SpeedTrack read-only contract:', error?.message || error);
    throw error;
  }
}

export async function getSTTokenReadOnly() {
  let provider: ethers.BrowserProvider | ethers.JsonRpcProvider | null = getProvider();
  if (!provider) {
    provider = getFallbackProvider();
  }
  
  return new ethers.Contract(CONTRACTS.STTOKEN, STTokenABI, provider);
}

export async function getUSDTReadOnly() {
  let provider: ethers.BrowserProvider | ethers.JsonRpcProvider | null = getProvider();
  if (!provider) {
    provider = getFallbackProvider();
  }
  
  return new ethers.Contract(CONTRACTS.USDT, USDTABI, provider);
}

export async function getTokenBalances(address: string) {
  try {
    const [usdtContract, stContract] = await Promise.all([
      getUSDTReadOnly(),
      getSTTokenReadOnly()
    ]);

    const [usdtBalance, stBalance] = await Promise.all([
      usdtContract.balanceOf(address),
      stContract.balanceOf(address)
    ]);

    // Format and ensure proper decimal places
    const usdtFormatted = ethers.formatUnits(usdtBalance, 6); // USDT has 6 decimals
    const stFormatted = ethers.formatEther(stBalance); // ST has 18 decimals

    // Round to reasonable decimal places to avoid display issues
    const usdtRounded = parseFloat(usdtFormatted).toFixed(6);
    const stRounded = parseFloat(stFormatted).toFixed(6);

    return {
      usdt: usdtRounded,
      st: stRounded
    };
  } catch (error) {
    console.error('Error fetching token balances:', error);
    return { usdt: '0', st: '0' };
  }
}

export async function checkUSDTAllowance(userAddress: string): Promise<string> {
  try {
    const usdtContract = await getUSDTReadOnly();
    const allowance = await usdtContract.allowance(userAddress, CONTRACTS.SPEEDTRACK);
    return ethers.formatUnits(allowance, 6); // USDT has 6 decimals
  } catch {
    return '0';
  }
}

export async function approveUSDT(amount: string): Promise<ethers.ContractTransactionResponse> {
  const usdtContract = await getUSDTContract();
  // Approve max amount to avoid repeated approvals
  const maxAmount = ethers.MaxUint256;
  console.log('Approving USDT with max amount for SpeedTrack contract...');
  return await usdtContract.approve(CONTRACTS.SPEEDTRACK, maxAmount);
}

export async function approveSTToken(amount: string, spender: string): Promise<ethers.ContractTransactionResponse> {
  const stContract = await getSTTokenContract();
  const amountWei = ethers.parseEther(amount);
  return await stContract.approve(spender, amountWei);
}
