# Smart Contract Call Reference

## Quick Reference for All Contract Functions

### Registration
```typescript
// Function Signature
function register(string _referralCode, address _leader) external

// How We Call It
await speedTrack.register(
  referralCode,  // string: "1", "2", "3", etc.
  leaderAddress  // address: 0x... or 0x0000...
);

// Parameters
- referralCode: User ID of referrer (as string)
- leaderAddress: Upline leader address (or zero address)

// Gas Estimate: ~150,000
// Requires: Not already registered, valid referral code
```

### Activation
```typescript
// Function Signature
function activate(uint256 _levelIndex) external

// How We Call It
await speedTrack.activate(levelIndex);

// Parameters
- levelIndex: 0-4 (activation level)

// Gas Estimate: ~200,000
// Requires: Registered, USDT approved, sufficient USDT balance
```

### Profile Completion
```typescript
// Function Signature
function completeProfile(
  string _name,
  string _email,
  string _countryCode,
  string _mobileNumber
) external

// How We Call It
await speedTrack.completeProfile(
  name,
  email,
  countryCode,
  mobileNumber
);

// Gas Estimate: ~100,000
// Requires: Activated
```

### Investment
```typescript
// Function Signature
function invest(uint256 _poolIndex, uint256 _amount) external

// How We Call It
await speedTrack.invest(
  poolIndex,
  ethers.parseUnits(amount, 6)  // USDT has 6 decimals
);

// Parameters
- poolIndex: Pool number to invest in
- amount: Amount in USDT (wei format)

// Gas Estimate: ~250,000
// Requires: Activated, USDT approved, within investment limits
```

### Claim ROI
```typescript
// Function Signature
function claimROI() external

// How We Call It
await speedTrack.claimROI();

// Gas Estimate: ~150,000
// Requires: Has claimable ROI
```

### USDT Approval
```typescript
// Function Signature (USDT Contract)
function approve(address spender, uint256 amount) external

// How We Call It
await usdtContract.approve(
  SPEEDTRACK_ADDRESS,
  ethers.parseUnits(amount, 6)
);

// Parameters
- spender: SpeedTrack contract address
- amount: Amount to approve (wei format)

// Gas Estimate: ~50,000
```

## Read-Only Functions (No Gas)

### Get User Info
```typescript
const userInfo = await speedTrack.getUserInfo(address);
// Returns: name, email, activationLevel, etc.
```

### Get User ID
```typescript
const userId = await speedTrack.getUserId(address);
// Returns: uint256 (user ID)
```

### Get User By ID
```typescript
const address = await speedTrack.getUserById(userId);
// Returns: address
```

### Check Activation Status
```typescript
const isActivated = await speedTrack.getActivationStatus(address);
// Returns: bool
```

### Get Claimable ROI
```typescript
const roi = await speedTrack.getClaimableROI(address);
// Returns: uint256 (in wei, 6 decimals)
```

### Get Pool Info
```typescript
const poolInfo = await speedTrack.getPoolInfo(poolIndex);
// Returns: size, currentFilled, isGlobal, owner, etc.
```

## Error Handling

### Common Revert Reasons

| Revert Reason | Meaning | Solution |
|---------------|---------|----------|
| "Already registered" | User is registered | Skip to activation |
| "Invalid referral code" | Code doesn't exist | Use valid code |
| "Not registered" | Must register first | Register first |
| "Not activated" | Must activate first | Activate account |
| "Insufficient allowance" | Need USDT approval | Approve USDT |
| "Amount too low" | Below minimum | Increase amount |
| "Amount too high" | Above level limit | Reduce or upgrade |
| "Pool full" | Pool is complete | Wait for next pool |

### Error Codes

| Code | Meaning |
|------|---------|
| 4001 | User rejected transaction |
| 4902 | Network not added to wallet |
| -32603 | RPC error (node issue) |
| CALL_EXCEPTION | Transaction will revert |
| INSUFFICIENT_FUNDS | Not enough BNB for gas |

## Gas Optimization Tips

1. **Batch approvals**: Approve large amounts to avoid multiple approval transactions
2. **Check before calling**: Use read functions to validate before sending transactions
3. **Estimate gas first**: Catch errors before wasting gas
4. **Use fallback RPC**: Avoid "missing revert data" errors

## Testing Functions

### Test Contract Connection
```typescript
import { testContractConnection } from '@/lib/web3/registration';

const result = await testContractConnection();
console.log(result);
// Shows: contract address, function availability, ABI status
```

### Validate Referral Code
```typescript
import { validateReferralCode } from '@/lib/web3/registration';

const validation = await validateReferralCode("1");
console.log(validation);
// Shows: valid, message, referrerAddress
```

### Check Registration Status
```typescript
import { isUserRegistered } from '@/lib/web3/registration';

const registered = await isUserRegistered(address);
console.log(registered); // true/false
```

## Contract Addresses (BSC Testnet)

```
SpeedTrack: 0x406249AF7Eb8A32c1F79b9BB1A9DB57DB1EB3D23
ST Token:   0x8058aE55731ab8dF54DFdf3f21469830F89f35Ed
USDT:       0x0D3E80cBc9DDC0a3Fdee912b99C50cd0b5761eE3
```

## Decimal Handling

| Token | Decimals | Format Function |
|-------|----------|-----------------|
| USDT | 6 | `ethers.parseUnits(amount, 6)` |
| ST Token | 18 | `ethers.parseEther(amount)` |
| BNB | 18 | `ethers.parseEther(amount)` |

## Transaction Flow

### Registration Flow
```
1. Connect Wallet
2. Test Contract Connection ✓
3. Validate Referral Code ✓
4. Estimate Gas ✓
5. Send Transaction
6. Wait for Confirmation
7. Proceed to Activation
```

### Activation Flow
```
1. Check USDT Balance
2. Check USDT Allowance
3. Approve USDT (if needed)
4. Wait for Approval Confirmation
5. Estimate Gas for Activation
6. Send Activation Transaction
7. Wait for Confirmation
8. Proceed to Profile Completion
```

### Investment Flow
```
1. Check USDT Balance
2. Check USDT Allowance
3. Approve USDT (if needed)
4. Select Pool
5. Enter Amount
6. Validate Amount (min/max)
7. Estimate Gas
8. Send Investment Transaction
9. Wait for Confirmation
```

## Best Practices

1. ✅ Always estimate gas before sending transactions
2. ✅ Validate inputs before calling contract
3. ✅ Check allowances before token operations
4. ✅ Use read functions to verify state
5. ✅ Handle errors gracefully with user-friendly messages
6. ✅ Log all steps for debugging
7. ✅ Test on testnet before mainnet
8. ✅ Verify transactions on block explorer

## Debugging Checklist

- [ ] Contract address is correct
- [ ] Connected to correct network (BSC Testnet)
- [ ] ABI file is up to date
- [ ] Function names match ABI
- [ ] Parameter types match ABI
- [ ] Parameter order is correct
- [ ] Decimal handling is correct
- [ ] Gas estimation passes
- [ ] User has enough BNB for gas
- [ ] Tokens are approved (if needed)
