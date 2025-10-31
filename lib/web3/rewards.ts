import { ethers } from 'ethers';
import { getSpeedTrackContract, getSpeedTrackReadOnly } from './contracts';

export async function calculateReward(userAddress: string): Promise<string> {
    try {
        const speedTrack = await getSpeedTrackReadOnly();
        const reward = await speedTrack.calculateReward(userAddress);
        return ethers.formatEther(reward);
    } catch (error) {
        return '0';
    }
}

export async function getRewardAmount(userAddress: string): Promise<string> {
    try {
        const speedTrack = await getSpeedTrackReadOnly();
        const reward = await speedTrack.getRewardAmount(userAddress);
        return ethers.formatEther(reward);
    } catch (error) {
        return '0';
    }
}

export async function claimRewards(): Promise<ethers.ContractTransactionResponse> {
    const speedTrack = await getSpeedTrackContract();
    return await speedTrack.claimRewards();
}

export async function claimRewardBalance(): Promise<ethers.ContractTransactionResponse> {
    const speedTrack = await getSpeedTrackContract();
    return await speedTrack.claimRewardBalance();
}

export async function getLevelIncome(userAddress: string): Promise<string> {
    try {
        const speedTrack = await getSpeedTrackReadOnly();
        const levelIncome = await speedTrack.getLevelIncome(userAddress);
        return ethers.formatEther(levelIncome);
    } catch (error) {
        return '0';
    }
}

export async function getLevelPercentages(): Promise<number[]> {
    try {
        const speedTrack = await getSpeedTrackReadOnly();
        const percentages = await speedTrack.getLevelPercentages();
        return percentages.map((p: bigint) => Number(p));
    } catch (error) {
        return [10, 5, 3, 2, 1, 1, 1, 1, 1, 1];
    }
}

export interface RewardSummary {
    dailyReward: string;
    totalEarned: string;
    availableToClaim: string;
    rewardBalance: string;
    levelIncome: string;
}

export async function getRewardSummary(userAddress: string): Promise<RewardSummary> {
    try {
        const [dailyReward, availableToClaim, levelIncome, userDetails] = await Promise.all([
            calculateReward(userAddress),
            getRewardAmount(userAddress),
            getLevelIncome(userAddress),
            (async () => {
                const speedTrack = await getSpeedTrackReadOnly();
                return await speedTrack.getUserDetails(userAddress);
            })()
        ]);

        return {
            dailyReward,
            totalEarned: ethers.formatEther(userDetails.totalRewardEarned || BigInt(0)),
            availableToClaim,
            rewardBalance: ethers.formatEther(userDetails.rewardBalance),
            levelIncome
        };
    } catch (error) {
        return {
            dailyReward: '0',
            totalEarned: '0',
            availableToClaim: '0',
            rewardBalance: '0',
            levelIncome: '0'
        };
    }
}
