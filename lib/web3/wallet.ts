import { ethers } from 'ethers';
import { NETWORK_CONFIG } from './config';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function connectWallet(): Promise<string> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    await switchToBSCTestnet();

    return accounts[0];
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('User rejected the connection request');
    }
    throw error;
  }
}

export async function switchToBSCTestnet(): Promise<void> {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: NETWORK_CONFIG.chainIdHex }],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: NETWORK_CONFIG.chainIdHex,
              chainName: NETWORK_CONFIG.name,
              nativeCurrency: NETWORK_CONFIG.nativeCurrency,
              rpcUrls: [NETWORK_CONFIG.rpcUrl],
              blockExplorerUrls: [NETWORK_CONFIG.blockExplorer],
            },
          ],
        });
      } catch (addError) {
        throw new Error('Failed to add BSC Testnet');
      }
    } else {
      throw error;
    }
  }
}

export function getProvider(): ethers.BrowserProvider | null {
  if (typeof window === 'undefined' || !window.ethereum) {
    return null;
  }
  return new ethers.BrowserProvider(window.ethereum);
}

export async function getSigner(): Promise<ethers.JsonRpcSigner | null> {
  const provider = getProvider();
  if (!provider) return null;
  
  try {
    return await provider.getSigner();
  } catch {
    return null;
  }
}

export async function getBalance(address: string): Promise<string> {
  const provider = getProvider();
  if (!provider) return '0';

  try {
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch {
    return '0';
  }
}

export async function getCurrentAccount(): Promise<string | null> {
  if (typeof window === 'undefined' || !window.ethereum) {
    return null;
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });
    return accounts[0] || null;
  } catch {
    return null;
  }
}

export async function getCurrentChainId(): Promise<number | null> {
  if (typeof window === 'undefined' || !window.ethereum) {
    return null;
  }

  try {
    const chainId = await window.ethereum.request({
      method: 'eth_chainId',
    });
    return parseInt(chainId, 16);
  } catch {
    return null;
  }
}

export function isCorrectNetwork(chainId: number): boolean {
  return chainId === NETWORK_CONFIG.chainId;
}

export function setupAccountChangeListener(callback: (accounts: string[]) => void): void {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', callback);
  }
}

export function setupChainChangeListener(callback: (chainId: string) => void): void {
  if (window.ethereum) {
    window.ethereum.on('chainChanged', callback);
  }
}

export function removeAccountChangeListener(callback: (accounts: string[]) => void): void {
  if (window.ethereum) {
    window.ethereum.removeListener('accountsChanged', callback);
  }
}

export function removeChainChangeListener(callback: (chainId: string) => void): void {
  if (window.ethereum) {
    window.ethereum.removeListener('chainChanged', callback);
  }
}
