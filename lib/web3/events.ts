import { ethers } from 'ethers';
import { getSpeedTrackReadOnly } from './contracts';

export interface Transaction {
  id: string;
  type: 'activation' | 'pool_invest' | 'reward_claim' | 'st_buy' | 'st_sell';
  title: string;
  amount: string;
  usdValue?: string;
  timestamp: number;
  txHash: string;
  blockNumber: number;
  user: string;
}

// Fetch historical events for a user
export async function getUserTransactions(userAddress: string, limit: number = 10): Promise<Transaction[]> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const transactions: Transaction[] = [];

    // Get current block
    const provider = speedTrack.runner?.provider;
    if (!provider) return [];

    const currentBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(0, currentBlock - 10000); // Last ~10000 blocks

    // Fetch AccountActivated events (not indexed, so filter manually)
    const activationFilter = speedTrack.filters.AccountActivated();
    const activationEvents = await speedTrack.queryFilter(activationFilter, fromBlock, currentBlock);
    
    for (const event of activationEvents) {
      if (!('args' in event)) continue;
      // Filter by user address manually since it's not indexed
      if (event.args.user.toLowerCase() !== userAddress.toLowerCase()) continue;
      
      const block = await event.getBlock();
      transactions.push({
        id: `activation-${event.transactionHash}`,
        type: 'activation',
        title: 'Account Activated',
        amount: '10 USDT',
        timestamp: block.timestamp,
        txHash: event.transactionHash,
        blockNumber: event.blockNumber,
        user: userAddress
      });
    }

    // Fetch PoolInvested events (not indexed, so filter manually)
    const poolFilter = speedTrack.filters.PoolInvested();
    const poolEvents = await speedTrack.queryFilter(poolFilter, fromBlock, currentBlock);
    
    for (const event of poolEvents) {
      if (!('args' in event)) continue;
      // Filter by user address manually
      if (event.args.investor.toLowerCase() !== userAddress.toLowerCase()) continue;
      
      const block = await event.getBlock();
      const args = event.args;
      transactions.push({
        id: `pool-${event.transactionHash}`,
        type: 'pool_invest',
        title: `Pool #${args.poolNumber} Investment`,
        amount: `${ethers.formatEther(args.amount)} USDT`,
        timestamp: block.timestamp,
        txHash: event.transactionHash,
        blockNumber: event.blockNumber,
        user: userAddress
      });
    }

    // Fetch RewardClaimed events (not indexed, so filter manually)
    const rewardFilter = speedTrack.filters.RewardClaimed();
    const rewardEvents = await speedTrack.queryFilter(rewardFilter, fromBlock, currentBlock);
    
    for (const event of rewardEvents) {
      if (!('args' in event)) continue;
      // Filter by user address manually
      if (event.args.user.toLowerCase() !== userAddress.toLowerCase()) continue;
      
      const block = await event.getBlock();
      const args = event.args;
      transactions.push({
        id: `reward-${event.transactionHash}`,
        type: 'reward_claim',
        title: 'Reward Claimed',
        amount: `${ethers.formatEther(args.amount)} USDT`,
        timestamp: block.timestamp,
        txHash: event.transactionHash,
        blockNumber: event.blockNumber,
        user: userAddress
      });
    }

    // Fetch STBought events (not indexed, so filter manually)
    const buyFilter = speedTrack.filters.STBought();
    const buyEvents = await speedTrack.queryFilter(buyFilter, fromBlock, currentBlock);
    
    for (const event of buyEvents) {
      if (!('args' in event)) continue;
      // Filter by user address manually
      if (event.args.buyer.toLowerCase() !== userAddress.toLowerCase()) continue;
      
      const block = await event.getBlock();
      const args = event.args;
      transactions.push({
        id: `buy-${event.transactionHash}`,
        type: 'st_buy',
        title: 'ST Tokens Purchased',
        amount: `${ethers.formatEther(args.stAmount)} ST`,
        usdValue: `${ethers.formatEther(args.usdtAmount)} USDT`,
        timestamp: block.timestamp,
        txHash: event.transactionHash,
        blockNumber: event.blockNumber,
        user: userAddress
      });
    }

    // Fetch STSold events
    const sellFilter = speedTrack.filters.STSold(userAddress);
    const sellEvents = await speedTrack.queryFilter(sellFilter, fromBlock, currentBlock);
    
    for (const event of sellEvents) {
      const block = await event.getBlock();
      if (!('args' in event)) continue;
      const args = event.args;
      transactions.push({
        id: `sell-${event.transactionHash}`,
        type: 'st_sell',
        title: 'ST Tokens Sold',
        amount: `${ethers.formatEther(args.stAmount)} ST`,
        usdValue: `${ethers.formatEther(args.usdtAmount)} USDT`,
        timestamp: block.timestamp,
        txHash: event.transactionHash,
        blockNumber: event.blockNumber,
        user: userAddress
      });
    }

    // Sort by timestamp (newest first) and limit
    return transactions
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);

  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return [];
  }
}

// Listen to new events in real-time
export function setupEventListeners(
  userAddress: string,
  onNewTransaction: (transaction: Transaction) => void
) {
  let speedTrack: any;
  const listeners: Array<() => void> = [];

  const setup = async () => {
    try {
      speedTrack = await getSpeedTrackReadOnly();

      // Listen for AccountActivated
      const onActivation = async (user: string, name: string, mobile: string, email: string, event: any) => {
        if (user.toLowerCase() === userAddress.toLowerCase()) {
          const block = await event.getBlock();
          onNewTransaction({
            id: `activation-${event.transactionHash}`,
            type: 'activation',
            title: 'Account Activated',
            amount: '10 USDT',
            timestamp: block.timestamp,
            txHash: event.transactionHash,
            blockNumber: event.blockNumber,
            user: userAddress
          });
        }
      };
      speedTrack.on('AccountActivated', onActivation);
      listeners.push(() => speedTrack.off('AccountActivated', onActivation));

      // Listen for PoolInvested
      const onPoolInvest = async (investor: string, poolNumber: bigint, amount: bigint, event: any) => {
        if (investor.toLowerCase() === userAddress.toLowerCase()) {
          const block = await event.getBlock();
          onNewTransaction({
            id: `pool-${event.transactionHash}`,
            type: 'pool_invest',
            title: `Pool #${poolNumber} Investment`,
            amount: `${ethers.formatEther(amount)} USDT`,
            timestamp: block.timestamp,
            txHash: event.transactionHash,
            blockNumber: event.blockNumber,
            user: userAddress
          });
        }
      };
      speedTrack.on('PoolInvested', onPoolInvest);
      listeners.push(() => speedTrack.off('PoolInvested', onPoolInvest));

      // Listen for RewardClaimed
      const onRewardClaim = async (user: string, amount: bigint, event: any) => {
        if (user.toLowerCase() === userAddress.toLowerCase()) {
          const block = await event.getBlock();
          onNewTransaction({
            id: `reward-${event.transactionHash}`,
            type: 'reward_claim',
            title: 'Reward Claimed',
            amount: `${ethers.formatEther(amount)} USDT`,
            timestamp: block.timestamp,
            txHash: event.transactionHash,
            blockNumber: event.blockNumber,
            user: userAddress
          });
        }
      };
      speedTrack.on('RewardClaimed', onRewardClaim);
      listeners.push(() => speedTrack.off('RewardClaimed', onRewardClaim));

      // Listen for STBought
      const onSTBuy = async (buyer: string, usdtAmount: bigint, stAmount: bigint, event: any) => {
        if (buyer.toLowerCase() === userAddress.toLowerCase()) {
          const block = await event.getBlock();
          onNewTransaction({
            id: `buy-${event.transactionHash}`,
            type: 'st_buy',
            title: 'ST Tokens Purchased',
            amount: `${ethers.formatEther(stAmount)} ST`,
            usdValue: `${ethers.formatEther(usdtAmount)} USDT`,
            timestamp: block.timestamp,
            txHash: event.transactionHash,
            blockNumber: event.blockNumber,
            user: userAddress
          });
        }
      };
      speedTrack.on('STBought', onSTBuy);
      listeners.push(() => speedTrack.off('STBought', onSTBuy));

      // Listen for STSold
      const onSTSell = async (seller: string, stAmount: bigint, usdtAmount: bigint, event: any) => {
        if (seller.toLowerCase() === userAddress.toLowerCase()) {
          const block = await event.getBlock();
          onNewTransaction({
            id: `sell-${event.transactionHash}`,
            type: 'st_sell',
            title: 'ST Tokens Sold',
            amount: `${ethers.formatEther(stAmount)} ST`,
            usdValue: `${ethers.formatEther(usdtAmount)} USDT`,
            timestamp: block.timestamp,
            txHash: event.transactionHash,
            blockNumber: event.blockNumber,
            user: userAddress
          });
        }
      };
      speedTrack.on('STSold', onSTSell);
      listeners.push(() => speedTrack.off('STSold', onSTSell));

    } catch (error) {
      console.error('Failed to setup event listeners:', error);
    }
  };

  setup();

  // Return cleanup function
  return () => {
    listeners.forEach(cleanup => cleanup());
  };
}

// Format timestamp to relative time
export function formatTimestamp(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return new Date(timestamp * 1000).toLocaleDateString();
}

// Get transaction type icon and color
export function getTransactionStyle(type: Transaction['type']): { icon: string; color: string } {
  switch (type) {
    case 'activation':
      return { icon: 'fa-user-check', color: 'text-green-400' };
    case 'pool_invest':
      return { icon: 'fa-swimming-pool', color: 'text-neon-blue' };
    case 'reward_claim':
      return { icon: 'fa-gift', color: 'text-yellow-400' };
    case 'st_buy':
      return { icon: 'fa-arrow-up', color: 'text-green-400' };
    case 'st_sell':
      return { icon: 'fa-arrow-down', color: 'text-red-400' };
    default:
      return { icon: 'fa-exchange-alt', color: 'text-gray-400' };
  }
}
