# SpeedTrack Contract Integration Summary

## Contract Addresses (BSC Testnet)
- **SpeedTrack**: `0x5023C1dd28B28e5cFb7CD3462d4680cEd2ee78Da`
- **STToken**: `0xE2eEc4546145749Ff475A18BF648dE329aBE8d9f`
- **USDT**: `0x0D3E80cBc9DDC0a3Fdee912b99C50cd0b5761eE3`

## Important Notes
- USDT uses 6 decimals (not 18)
- ST Token uses 18 decimals
- All amounts in contract are in their respective decimal formats

## SpeedTrack Contract Functions

### User Registration & Activation
1. **register(referralCode, leaderAddress)** - Register new user with referral code
2. **activate(levelIndex)** - Activate account with payment (requires USDT approval)
3. **completeProfile(name, email, countryCode, mobileNumber)** - Complete user profile

### Pool Investment
4. **invest(poolIndex, amount)** - Invest in a specific pool (requires USDT approval)
5. **getPoolInfo(poolIndex)** - Get pool details (size, filled, owner, etc.)
6. **getInvestmentInPool(user, poolIndex)** - Get user's investment in specific pool
7. **getPendingRefund(user, poolIndex)** - Get pending capital refund
8. **isEligibleForGlobal(user)** - Check if user can invest in global pools

### ROI & Rewards
9. **claimROI()** - Claim available ROI
10. **getClaimableROI(user)** - Get claimable ROI amount
11. **getPendingDailyROI(user)** - Get pending daily ROI
12. **getROITotals(user)** - Get total credited and claimed ROI

### Income & Earnings
13. **getTotalLevelIncome(user)** - Get total level/referral income
14. **getTotalCapitalReturned(user)** - Get total capital returned (200%)
15. **getTotalSTRewarded(user)** - Get total ST tokens rewarded

### User Information
16. **getUserInfo(user)** - Get comprehensive user information
17. **getUserId(user)** - Get user's unique ID
18. **getUserById(id)** - Get user address by ID
19. **getActivationStatus(user)** - Check if user is activated
20. **getRecentActions(user)** - Get user's recent transactions

### Constants
21. **activationFees(levelIndex)** - Get activation fee for level
22. **maxInvestments(levelIndex)** - Get max investment for level
23. **levelPercents(level)** - Get commission percentage for level
24. **DAILY_ROI_PCT** - Daily ROI percentage (0.5%)
25. **LEVEL_INCOME_PCT** - Level income percentage (30%)
26. **CAPITAL_RETURN_PCT** - Capital return percentage (200%)
27. **RESERVE_PCT** - Reserve percentage (5%)
28. **REWARD_PCT** - Reward percentage (5%)
29. **ST_LIQUIDITY_PCT** - ST liquidity percentage (10%)

## STToken Contract Functions

### Trading
1. **sell(amount)** - Sell ST tokens for USDT
2. **getBuyPrice()** - Get current buy price
3. **getSellPrice()** - Get current sell price

### Token Information
4. **balanceOf(user)** - Get ST token balance
5. **getTotalLiquidity()** - Get total USDT liquidity
6. **getTotalMintedTokens()** - Get total minted ST tokens
7. **getTotalBurnedTokens()** - Get total burned ST tokens
8. **getTotalAvailableTokens()** - Get available ST tokens

## User Flow Implementation

### 1. Connect Wallet
- User connects MetaMask/wallet
- Check network (BSC Testnet)
- Display wallet address and balances

### 2. Registration
- User enters referral code or leader address
- Call `register(referralCode, leaderAddress)`
- User gets assigned a unique ID

### 3. Activation
- User selects activation level (0-9)
- Check activation fee: `activationFees(levelIndex)`
- Approve USDT spending
- Call `activate(levelIndex)`
- Account becomes activated

### 4. Complete Profile
- User enters: name, email, country code, mobile number
- Call `completeProfile(...)`
- Profile marked as completed

### 5. Dashboard
- Display user stats from `getUserInfo()`
- Show claimable ROI from `getClaimableROI()`
- Show pending daily ROI from `getPendingDailyROI()`
- Show level income from `getTotalLevelIncome()`
- Show capital returned from `getTotalCapitalReturned()`
- Show ST rewards from `getTotalSTRewarded()`
- Display recent actions from `getRecentActions()`

### 6. Pool Investment
- Get current pool info: `getPoolInfo(poolIndex)`
- Check max investment: `maxInvestments(activationLevel)`
- Approve USDT
- Call `invest(poolIndex, amount)`
- Pool fills up, capital returns 200% over time

### 7. Income Page
- Total ROI: from `getROITotals()`
- Daily ROI: from `getPendingDailyROI()`
- Level Income: from `getTotalLevelIncome()`
- Capital Returned: from `getTotalCapitalReturned()`
- ST Rewards: from `getTotalSTRewarded()`
- Claimable: from `getClaimableROI()`

### 8. Claim Rewards
- Check claimable amount: `getClaimableROI()`
- Call `claimROI()`
- USDT transferred to user wallet

### 9. Trade ST Tokens
- Get prices: `getBuyPrice()`, `getSellPrice()`
- To sell: Call `sell(amount)`
- ST tokens burned, USDT received

### 10. Referral System
- Get user ID: `getUserId()`
- Share referral link with ID
- New users register with referral code
- Earn 10-level commissions automatically
- View level income: `getTotalLevelIncome()`

### 11. Transactions
- Get recent actions: `getRecentActions()`
- Display formatted transaction history
- Show: investments, ROI claims, capital returns, level income, ST rewards

## Pages Updated

1. **Dashboard** (`app/dashboard/page.tsx`)
   - Real-time user stats
   - Pool progress
   - Recent transactions
   - Activation check

2. **Profile** (`app/profile/page.tsx`)
   - User information from contract
   - Complete profile functionality
   - Wallet info

3. **Income** (`app/income/page.tsx`)
   - All income types displayed
   - ROI tracking
   - Level income
   - Capital returns
   - ST rewards

4. **Referral** (`app/referral/page.tsx`)
   - Referral link generation
   - Level income display
   - Network statistics

5. **Trade** (`app/trade/page.tsx`)
   - ST token trading
   - Real-time prices
   - Buy/sell functionality

6. **Transactions** (`app/transactions/page.tsx`)
   - Recent actions from contract
   - Transaction history
   - Formatted display

7. **Wallet** (`app/wallet/page.tsx`)
   - Connection flow
   - Network switching
   - Balance display

## Web3 Integration Files

1. **lib/web3/contracts.ts** - Contract instances and token operations
2. **lib/web3/activation.ts** - Registration, activation, profile
3. **lib/web3/rewards.ts** - ROI, income, rewards functions
4. **lib/web3/pools.ts** - Pool investment and info
5. **lib/web3/trading.ts** - ST token trading
6. **lib/web3/referrals.ts** - Referral system
7. **lib/web3/registration.ts** - User registration
8. **lib/web3/transactions.ts** - Transaction history

## Key Features Implemented

✅ Wallet connection (MetaMask)
✅ User registration with referral
✅ Account activation (10 levels)
✅ Profile completion
✅ Pool investment system
✅ Daily ROI (0.5%)
✅ 10-level referral commissions
✅ Capital return (200%)
✅ ST token rewards (10%)
✅ ST token trading
✅ ROI claiming
✅ Transaction history
✅ Real-time data updates
✅ No dummy data - all from contract

## Testing Checklist

- [ ] Connect wallet
- [ ] Register with referral code
- [ ] Activate account
- [ ] Complete profile
- [ ] View dashboard stats
- [ ] Invest in pool
- [ ] Check ROI accumulation
- [ ] Claim ROI
- [ ] View level income
- [ ] Trade ST tokens
- [ ] View transaction history
- [ ] Check referral system
- [ ] Verify all amounts match contract
