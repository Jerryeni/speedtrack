import { ethers } from 'ethers';
import { getSigner, getProvider } from './wallet';
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
    const provider = getProvider();
    if (!provider) {
      console.error('Provider not available for SpeedTrack read-only contract');
      throw new Error('Provider not available');
    }
    
    const contract = new ethers.Contract(CONTRACTS.SPEEDTRACK, SpeedTrackABI, provider);
    return contract;
  } catch (error: any) {
    console.error('Error creating SpeedTrack read-only contract:', error?.message || error);
    throw error;
  }
}

export async function getSTTokenReadOnly() {
  const provider = getProvider();
  if (!provider) throw new Error('Provider not available');
  
  return new ethers.Contract(CONTRACTS.STTOKEN, STTokenABI, provider);
}

export async function getUSDTReadOnly() {
  const provider = getProvider();
  if (!provider) throw new Error('Provider not available');
  
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

    return {
      usdt: ethers.formatEther(usdtBalance),
      st: ethers.formatEther(stBalance)
    };
  } catch (error) {
    return { usdt: '0', st: '0' };
  }
}

export async function checkUSDTAllowance(userAddress: string): Promise<string> {
  try {
    const usdtContract = await getUSDTReadOnly();
    const allowance = await usdtContract.allowance(userAddress, CONTRACTS.SPEEDTRACK);
    return ethers.formatEther(allowance);
  } catch {
    return '0';
  }
}

export async function approveUSDT(amount: string): Promise<ethers.ContractTransactionResponse> {
  const usdtContract = await getUSDTContract();
  const amountWei = ethers.parseEther(amount);
  return await usdtContract.approve(CONTRACTS.SPEEDTRACK, amountWei);
}
