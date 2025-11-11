# Speed Track - Quick Reference Card

## 🚀 Quick Start

### Connect & Register
```typescript
// 1. Connect wallet
await connect();

// 2. Register
await registerUser({ referralCode: "ADMIN", leaderAddress: "0x..." });

// 3. Activate (Level 0 = 10 USDT)
await activateAccount(0, userAddress);

// 4. Complete profile (optional)
await completeProfile({ name, email, countryCode, mobileNumber });
```

### Invest & Earn
```typescript
// Invest in pool
await investInPool(poolIndex, amount, userAddress);

// Check earnings
const claimable = await getClaimableROI(userAddress);
const levelIncome = await getTotalLevelIncome(userAddress);

// Claim ROI
await claimROI();
```

### Trade ST Tokens
```typescript
// Get prices
const { buyPrice, sellPrice } = await getSTPrice();

// Sell ST tokens
await sellST(amount);
```

## 📊 Key Contract Functions

### User Management
| Function | Purpose | Returns |
|----------|---------|---------|
| `getUserInfo(address)` | Get all user data | UserInfo struct |
| `getUserId(address)` | Get user ID | uint256 |
| `getActivationStatus(address)` | Check if activated | bool |

### Rewards & Income
| Function | Purpose | Returns |
|----------|---------|---------|
| `getClaimableROI(address)` | Claimable ROI | uint256 (6 decimals) |
| `getPendingDailyROI(address)` | Pending daily ROI | uint256 (6 decimals) |
| `getTotalLevelIncome(address)` | Total referral income | uint256 (6 decimals) |
| `getTotalCapitalReturned(address)` | Capital returned | uint256 (6 decimals) |
| `getTotalSTRewarded(address)` | ST tokens earned | uint256 (6 decimals) |

### Pools
| Function | Purpose | Returns |
|----------|---------|---------|
| `getPoolInfo(poolIndex)` | Pool details | PoolInfo struct |
| `getInvestmentInPool(user, pool)` | User's investment | uint256 (6 decimals) |
| `isEligibleForGlobal(address)` | Global pool access | bool |

### Transactions
| Function | Purpose | Returns |
|----------|---------|---------|
| `getRecentActions(address)` | Transaction history | RecentAction[] |

## 💰 Activation Levels

| Level | Fee (USDT) | Max Investment (USDT) |
|-------|------------|----------------------|
| 0 | 10 | 50 |
| 1 | 50 | 250 |
| 2 | 100 | 500 |
| 3 | 250 | 1,250 |
| 4 | 500 | 2,500 |

## 📈 Income Breakdown

### Investment Distribution
- **Daily ROI**: 0.5% (DAILY_ROI_PCT = 50)
- **Level Income**: 30% (LEVEL_INCOME_PCT = 30)
- **Capital Return**: 200% (CAPITAL_RETURN_PCT = 200)
- **Reserve**: 5% (RESERVE_PCT = 5)
- **Reward**: 5% (REWARD_PCT = 5)
- **ST Liquidity**: 10% (ST_LIQUIDITY_PCT = 10)

### Level Commission Structure
| Level | Commission |
|-------|-----------|
| 1 | 10% |
| 2 | 5% |
| 3 | 3% |
| 4 | 2% |
| 5-10 | 1% each |

## 🔧 Common Code Patterns

### Check User Status
```typescript
const isActivated = await checkAccountActivation(userAddress);
const userInfo = await getUserDetails(userAddress);
const userId = await getUserId(userAddress);
```

### Get All Earnings
```typescript
const rewards = await getRewardSummary(userAddress);
// Returns: {
//   dailyReward, totalEarned, availableToClaim,
//   levelIncome, capitalReturned, stRewarded
// }
```

### Pool Investment
```typescript
// 1. Get pool info
const poolInfo = await getPoolInfo(poolIndex);

// 2. Check max investment
const maxInv = await getMaxInvestment(activationLevel);

// 3. Approve USDT
await approveUSDT(amount);

// 4. Invest
await investInPool(poolIndex, amount, userAddress);
```

### Transaction History
```typescript
const actions = await getRecentActions(userAddress);
actions.forEach(action => {
  console.log(action.action, action.amount, action.timestamp);
});
```

## ⚠️ Important Notes

### Decimals
- **USDT**: 6 decimals - use `ethers.parseUnits(amount, 6)`
- **ST Token**: 18 decimals - use `ethers.parseEther(amount)`

### Approvals
Always approve before spending:
```typescript
// Check allowance
const allowance = await checkUSDTAllowance(userAddress);

// Approve if needed
if (parseFloat(allowance) < amount) {
  await approveUSDT(amount);
}
```

### Error Handling
```typescript
try {
  await someContractFunction();
} catch (error) {
  const message = parseActivationError(error);
  showToast(message, 'error');
}
```

## 🌐 Network Info

- **Network**: BSC Testnet
- **Chain ID**: 97
- **RPC**: https://data-seed-prebsc-1-s1.bnbchain.org:8545
- **Explorer**: https://testnet.bscscan.com

## 📱 Pages & Routes

| Route | Purpose | Key Data |
|-------|---------|----------|
| `/dashboard` | Main dashboard | User stats, ROI, recent actions |
| `/income` | Income details | All income types, claim button |
| `/referral` | Referral center | Referral link, level income |
| `/trade` | ST token trading | Prices, sell function |
| `/transactions` | Transaction history | Recent actions |
| `/profile` | User profile | User info, complete profile |
| `/wallet` | Wallet connection | Connect, network switch |

## 🔑 Key Files

### Web3 Integration
- `lib/web3/contracts.ts` - Contract instances
- `lib/web3/activation.ts` - Activation & profile
- `lib/web3/rewards.ts` - ROI & income
- `lib/web3/pools.ts` - Pool functions
- `lib/web3/trading.ts` - ST token trading
- `lib/web3/transactions.ts` - Transaction history

### Components
- `components/modals/ActivationModal.tsx` - Activation UI
- `components/modals/RegistrationModal.tsx` - Registration UI
- `components/modals/ProfileCompleteModal.tsx` - Profile UI

## 🐛 Common Issues

### "Insufficient allowance"
→ Need to approve USDT spending

### "Already activated"
→ User already activated, skip activation

### "Not activated"
→ Must activate before investing

### "Wrong network"
→ Switch to BSC Testnet (Chain ID: 97)

### "Insufficient balance"
→ Need more USDT/ST tokens

## 📞 Support

- Check `CONTRACT_INTEGRATION_SUMMARY.md` for all functions
- Read `INTEGRATION_GUIDE.md` for detailed guide
- See `IMPLEMENTATION_COMPLETE.md` for completion status

---

**Quick Tip**: All functions return promises. Always use `await` or `.then()` to handle them properly!
