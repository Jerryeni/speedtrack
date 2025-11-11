# Speed Track Contract Integration Guide

## Overview
This guide explains how the Speed Track frontend is integrated with the smart contracts on BSC Testnet.

## Contract Flow

### 1. User Onboarding

#### Step 1: Connect Wallet
- User connects MetaMask wallet
- Frontend checks if user is on BSC Testnet (Chain ID: 97)
- If wrong network, prompts user to switch

#### Step 2: Registration
- User enters referral code (or uses "ADMIN" for admin referral)
- Optional: Enter leader address for team structure
- Call `register(referralCode, leaderAddress)`
- User gets assigned a unique ID (MIN_ID to MAX_ID range)

#### Step 3: Activation
- User selects activation level (0-9)
- Each level has different:
  - Activation fee (10, 50, 100, 250, 500 USDT, etc.)
  - Max investment limit (50, 250, 500, 1250, 2500 USDT, etc.)
- Approve USDT spending to SpeedTrack contract
- Call `activate(levelIndex)`
- Account becomes activated

#### Step 4: Complete Profile (Optional)
- User enters: name, email, country code, mobile number
- Call `completeProfile(name, email, countryCode, mobileNumber)`
- Profile marked as completed

### 2. Pool Investment System

#### Pool Structure
- Pools start at INITIAL_POOL_SIZE (e.g., 100 USDT)
- Each subsequent pool multiplies by POOL_MULTIPLIER (e.g., 2x)
- Pools can be:
  - **Personal Pools**: Owned by individual users (limit: PERSONAL_POOLS_LIMIT)
  - **Global Pools**: Open to all eligible users

#### Investment Process
1. Check pool info: `getPoolInfo(poolIndex)`
2. Verify max investment for user's level: `maxInvestments(activationLevel)`
3. Approve USDT to SpeedTrack contract
4. Call `invest(poolIndex, amount)`
5. Investment recorded in pool queue

#### Pool Completion
- When pool fills up (currentFilled >= size):
  - Pool marked as filled
  - Capital return process begins
  - Users receive 200% of investment over time
  - 10% goes to ST token liquidity
  - 5% to reserve wallet
  - 5% to reward wallet

### 3. Reward System

#### Daily ROI (0.5%)
- Calculated on invested amount
- Accumulates daily
- Check pending: `getPendingDailyROI(user)`
- Check claimable: `getClaimableROI(user)`
- Claim: `claimROI()`

#### Level Income (30% of investment)
- 10-level referral commission system
- Percentages per level stored in `levelPercents[]`
- Default: [10%, 5%, 3%, 2%, 1%, 1%, 1%, 1%, 1%, 1%]
- Distributed automatically on investment
- View total: `getTotalLevelIncome(user)`

#### Capital Return (200%)
- Returned gradually as pools complete
- Check total: `getTotalCapitalReturned(user)`
- Check pending for specific pool: `getPendingRefund(user, poolIndex)`

#### ST Token Rewards (10%)
- Minted and distributed from investment
- Adds to ST token liquidity
- View total: `getTotalSTRewarded(user)`

### 4. ST Token Trading

#### Token Economics
- Dynamic pricing based on liquidity
- Buy price: `getBuyPrice()` - USDT per ST token
- Sell price: `getSellPrice()` - typically 90% of buy price
- Liquidity pool grows with each investment

#### Selling ST Tokens
1. User has ST tokens from rewards
2. Check sell price: `getSellPrice()`
3. Calculate USDT to receive
4. Call `sell(amount)` on STToken contract
5. ST tokens burned, USDT transferred to user

### 5. Transaction History

#### Recent Actions
- Contract stores last MAX_RECENT actions per user
- Types: INVEST, ROI_CLAIM, CAPITAL_RETURN, LEVEL_INCOME, ST_REWARD, ACTIVATION, PROFILE_COMPLETE
- Fetch: `getRecentActions(user)`
- Returns: action type, amount, pool index, from user, timestamp

### 6. User Information

#### Get User Data
```typescript
const userInfo = await speedTrack.getUserInfo(userAddress);
// Returns:
// - name, email, countryCode, mobileNumber
// - activationLevel
// - referrer, referrerType, isRootLeader
// - profileCompleted
// - investedAmount, capitalReturned
// - virtualROIBalance, rewardPoints
// - uid (user ID)
```

#### Get User Stats
```typescript
const userId = await speedTrack.getUserId(userAddress);
const isActivated = await speedTrack.getActivationStatus(userAddress);
const claimableROI = await speedTrack.getClaimableROI(userAddress);
const levelIncome = await speedTrack.getTotalLevelIncome(userAddress);
```

## Frontend Implementation

### Pages

#### Dashboard (`/dashboard`)
- Shows activation status
- Displays user stats (investment, ROI, level income)
- Pool progress
- Recent actions
- Quick invest button

#### Income (`/income`)
- Total ROI earned
- Daily ROI pending
- Claimable amount
- Level income breakdown
- Capital returned
- ST token rewards
- Claim button

#### Referral (`/referral`)
- User's referral link (based on user ID)
- Level income stats
- Network structure (10 levels)
- Commission percentages

#### Trade (`/trade`)
- Current ST token prices
- Sell ST tokens interface
- Token statistics (liquidity, minted, burned)

#### Transactions (`/transactions`)
- Recent actions from contract
- Filterable by type
- Shows amounts, timestamps, pool info

#### Profile (`/profile`)
- User information from contract
- Complete profile button
- Wallet info

### Web3 Integration Files

#### `lib/web3/contracts.ts`
- Contract instances (SpeedTrack, STToken, USDT)
- Token balance queries
- Approval functions

#### `lib/web3/registration.ts`
- User registration
- Referral code handling

#### `lib/web3/activation.ts`
- Account activation
- Profile completion
- User info queries

#### `lib/web3/pools.ts`
- Pool information
- Investment functions
- Refund queries

#### `lib/web3/rewards.ts`
- ROI calculations
- Level income queries
- Capital return tracking
- Claim functions

#### `lib/web3/trading.ts`
- ST token price queries
- Sell functions
- Token statistics

#### `lib/web3/transactions.ts`
- Recent actions
- Transaction formatting

#### `lib/web3/referrals.ts`
- Referral stats
- Network level queries

## Important Constants

### From SpeedTrack Contract
- `DAILY_ROI_PCT`: 50 (0.5%)
- `LEVEL_INCOME_PCT`: 30 (30%)
- `CAPITAL_RETURN_PCT`: 200 (200%)
- `RESERVE_PCT`: 5 (5%)
- `REWARD_PCT`: 5 (5%)
- `ST_LIQUIDITY_PCT`: 10 (10%)
- `INITIAL_POOL_SIZE`: Starting pool size
- `POOL_MULTIPLIER`: Pool growth multiplier
- `PERSONAL_POOLS_LIMIT`: Max personal pools per user
- `MIN_ID`: Minimum user ID
- `MAX_ID`: Maximum user ID
- `MAX_RECENT`: Max recent actions stored

### Decimals
- **USDT**: 6 decimals
- **ST Token**: 18 decimals
- Always use `ethers.parseUnits(amount, 6)` for USDT
- Always use `ethers.parseEther(amount)` for ST tokens

## Testing Checklist

### Basic Flow
- [ ] Connect wallet to BSC Testnet
- [ ] Register with referral code
- [ ] Activate account (level 0)
- [ ] Complete profile
- [ ] View dashboard with real data

### Investment Flow
- [ ] Check pool info
- [ ] Invest in pool
- [ ] See investment reflected in stats
- [ ] View recent action

### Rewards Flow
- [ ] Wait for ROI accumulation
- [ ] Check claimable ROI
- [ ] Claim ROI
- [ ] See balance increase

### Referral Flow
- [ ] Get referral link
- [ ] Share with new user
- [ ] New user registers with code
- [ ] New user invests
- [ ] See level income increase

### Trading Flow
- [ ] Check ST token balance
- [ ] View current prices
- [ ] Sell ST tokens
- [ ] Receive USDT

### Transaction History
- [ ] View recent actions
- [ ] Filter by type
- [ ] See all transaction details

## Error Handling

### Common Errors
1. **"Insufficient allowance"**: Need to approve USDT
2. **"Already activated"**: User already activated
3. **"Not activated"**: Must activate before action
4. **"Insufficient balance"**: Not enough USDT/ST
5. **"Invalid referral code"**: Code doesn't exist
6. **"Pool full"**: Pool already filled
7. **"Exceeds max investment"**: Amount too high for level

### Error Parser
- `lib/web3/errorParser.ts` handles contract errors
- Provides user-friendly messages
- Suggests solutions

## Data Refresh

### Auto-refresh Intervals
- Dashboard: Every 30 seconds
- Income page: Every 30 seconds
- Referral page: Every 30 seconds
- Transaction history: Every 30 seconds

### Manual Refresh
- User can manually refresh balances
- Triggered after transactions
- Updates all relevant data

## Security Considerations

1. **Approval Management**: Only approve exact amounts needed
2. **Transaction Verification**: Always wait for confirmations
3. **Address Validation**: Verify addresses before transactions
4. **Network Check**: Ensure correct network before operations
5. **Error Handling**: Graceful error handling with user feedback

## Future Enhancements

1. **Event Listening**: Real-time updates via contract events
2. **Notification System**: Alert users of important events
3. **Advanced Analytics**: Charts and graphs for earnings
4. **Mobile App**: Native mobile application
5. **Multi-language**: Support for multiple languages

## Support

For issues or questions:
- Check CONTRACT_INTEGRATION_SUMMARY.md
- Review contract ABIs in `lib/contracts/abis/`
- Test on BSC Testnet first
- Verify all addresses and parameters
