import { ethers } from 'ethers';
import { getSpeedTrackContract, getSpeedTrackReadOnly } from './contracts';

export async function getClaimableROI(userAddress: string): Promise<string> {
    try {
        const speedTrack = await getSpeedTrackReadOnly();
        const roi = await speedTrack.getClaimableROI(userAddress);
        return roi ? ethers.formatUnits(roi, 6) : '0';
    } catch (error) {
        console.error('Error fetching claimable ROI:', error);
        return '0';
    }
}

export async function getPendingDailyROI(userAddress: string): Promise<string> {
    try {
        const speedTrack = await getSpeedTrackReadOnly();
        const roi = await speedTrack.getPendingDailyROI(userAddress);
        return ethers.formatUnits(roi, 6);
    } catch (error) {
        return '0';
    }
}

export async function claimROI(): Promise<ethers.ContractTransactionResponse> {
    const speedTrack = await getSpeedTrackContract();
    return await speedTrack.claimROI();
}

export async function getTotalLevelIncome(userAddress: string): Promise<string> {
    try {
        const speedTrack = await getSpeedTrackReadOnly();
        const levelIncome = await speedTrack.getTotalLevelIncome(userAddress);
        return levelIncome ? ethers.formatUnits(levelIncome, 6) : '0';
    } catch (error) {
        console.error('Error fetching total level income:', error);
        return '0';
    }
}

export async function getTotalCapitalReturned(userAddress: string): Promise<string> {
    try {
        const speedTrack = await getSpeedTrackReadOnly();
        const capital = await speedTrack.getTotalCapitalReturned(userAddress);
        return ethers.formatUnits(capital, 6);
    } catch (error) {
        return '0';
    }
}

export async function getTotalSTRewarded(userAddress: string): Promise<string> {
    try {
        const speedTrack = await getSpeedTrackReadOnly();
        const stReward = await speedTrack.getTotalSTRewarded(userAddress);
        return ethers.formatUnits(stReward, 6);
    } catch (error) {
        return '0';
    }
}

export async function getROITotals(userAddress: string): Promise<{ credited: string; claimed: string }> {
    try {
        const speedTrack = await getSpeedTrackReadOnly();
        const totals = await speedTrack.getROITotals(userAddress);
        return {
            credited: totals.credited ? ethers.formatUnits(totals.credited, 6) : '0',
            claimed: totals.claimed ? ethers.formatUnits(totals.claimed, 6) : '0'
        };
    } catch (error) {
        console.error('Error fetching ROI totals:', error);
        return { credited: '0', claimed: '0' };
    }
}

export async function getLevelPercentages(): Promise<number[]> {
    try {
        const speedTrack = await getSpeedTrackReadOnly();
        const percentages: number[] = [];
        for (let i = 0; i < 10; i++) {
            const pct = await speedTrack.levelPercents(i);
            percentages.push(Number(pct));
        }
        return percentages;
    } catch (error) {
        return [10, 5, 3, 2, 1, 1, 1, 1, 1, 1];
    }
}

export async function getConstants() {
    try {
        const speedTrack = await getSpeedTrackReadOnly();
        const [dailyROI, levelIncome, capitalReturn, reserve, reward, stLiquidity] = await Promise.all([
            speedTrack.DAILY_ROI_PCT(),
            speedTrack.LEVEL_INCOME_PCT(),
            speedTrack.CAPITAL_RETURN_PCT(),
            speedTrack.RESERVE_PCT(),
            speedTrack.REWARD_PCT(),
            speedTrack.ST_LIQUIDITY_PCT()
        ]);
        
        return {
            dailyROIPct: Number(dailyROI),
            levelIncomePct: Number(levelIncome),
            capitalReturnPct: Number(capitalReturn),
            reservePct: Number(reserve),
            rewardPct: Number(reward),
            stLiquidityPct: Number(stLiquidity)
        };
    } catch (error) {
        return {
            dailyROIPct: 50,
            levelIncomePct: 30,
            capitalReturnPct: 200,
            reservePct: 5,
            rewardPct: 5,
            stLiquidityPct: 10
        };
    }
}

export interface RewardSummary {
    dailyReward: string;
    totalEarned: string;
    availableToClaim: string;
    levelIncome: string;
    capitalReturned: string;
    stRewarded: string;
}

export async function getRewardSummary(userAddress: string): Promise<RewardSummary> {
    try {
        const [claimable, pending, levelIncome, capitalReturned, stRewarded, roiTotals] = await Promise.all([
            getClaimableROI(userAddress),
            getPendingDailyROI(userAddress),
            getTotalLevelIncome(userAddress),
            getTotalCapitalReturned(userAddress),
            getTotalSTRewarded(userAddress),
            getROITotals(userAddress)
        ]);

        return {
            dailyReward: pending,
            totalEarned: roiTotals.credited,
            availableToClaim: claimable,
            levelIncome,
            capitalReturned,
            stRewarded
        };
    } catch (error) {
        return {
            dailyReward: '0',
            totalEarned: '0',
            availableToClaim: '0',
            levelIncome: '0',
            capitalReturned: '0',
            stRewarded: '0'
        };
    }
}
