# Registration & Activation Flow - Technical Architecture

## Overview

This document explains the technical architecture of the user onboarding flow, including how registration, activation, and profile completion work together.

## State Management Flow

```
┌──────────────────────────────────────────────────────────────┐
│                     User Flow States                          │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  NOT CONNECTED → CONNECTED → REGISTERED → ACTIVATED → COMPLETE│
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## Smart Contract Integration

### Contract Functions Used

#### 1. Registration Check
```typescript
getUserId(address): uint256
// Returns: 0 if not registered, >0 if registered
```

#### 2. Activation Check
```typescript
getActivationStatus(address): bool
// Returns: true if activated, false otherwise
```

#### 3. User Details
```typescript
getUserInfo(address): UserInfo
// Returns: Complete user profile including:
// - name, email, countryCode, mobileNumber
// - activationLevel (0-4)
// - profileCompleted (bool)
// - investedAmount, capitalReturned, virtualROIBalance
// - rewardPoints, uid
```

#### 4. Registration Transaction
```typescript
register(string _referralCode, address _leader)
// Registers user with referral code and optional leader
```

#### 5. Activation Transaction
```typescript
activate(uint256 levelIndex)
// Activates user at specified level (0-4)
// Requires USDT approval first
```

#### 6. Profile Completion
```typescript
completeProfile(string name, string email, string countryCode, string mobileNumber)
// Completes user profile with personal information
```

## Component Architecture

### 1. Main Page (`app/page.tsx`)

**Responsibility:** Orchestrate the entire onboarding flow

**Key Logic:**
```typescript
useEffect(() => {
  async function checkUserStatus() {
    if (!account || !isConnected) return;
    
    // Step 1: Check Registration
    const userId = await getUserId(account);
    if (userId === '0') {
      showRegistrationModal();
      return;
    }
    
    // Step 2: Check Activation
    const isActivated = await checkAccountActivation(account);
    if (!isActivated) {
      showActivationModal();
      return;
    }
    
    // Step 3: Check Profile
    const userDetails = await getUserDetails(account);
    if (!userDetails.profileCompleted) {
      showProfileModal();
      return;
    }
    
    // All complete - allow dashboard access
  }
  
  checkUserStatus();
}, [account, isConnected]);
```

**Modal Transitions:**
- Registration Success → Show Activation Modal
- Activation Success → Show Profile Modal
- Profile Success → Redirect to Dashboard

### 2. Registration Modal (`components/modals/RegistrationModal.tsx`)

**Inputs:**
- Referral Code (required)
- Leader Address (optional)

**Process:**
1. Validate referral code
2. Check if already registered (skip if yes)
3. Call `register()` on contract
4. Wait for transaction confirmation
5. Trigger `onSuccess()` callback

**Error Handling:**
- Invalid referral code
- Already registered
- Transaction failure
- Network issues

### 3. Activation Modal (`components/modals/ActivationModal.tsx`)

**Inputs:**
- Activation Level (0-4)

**Activation Levels:**
```typescript
Level 0: 10 USDT   → Max Investment: 50 USDT
Level 1: 50 USDT   → Max Investment: 250 USDT
Level 2: 100 USDT  → Max Investment: 500 USDT
Level 3: 250 USDT  → Max Investment: 1250 USDT
Level 4: 500 USDT  → Max Investment: 2500 USDT
```

**Process:**
1. User selects activation level
2. Check USDT allowance
3. Request USDT approval if needed
4. Call `activate(levelIndex)` on contract
5. Wait for transaction confirmation
6. Trigger `onSuccess()` callback

**Benefits Displayed:**
- Daily ROI: 0.5%
- 10-Level Referral Commissions
- Capital Return: 200%
- ST Token Rewards: 10%

### 4. Profile Complete Modal (`components/modals/ProfileCompleteModal.tsx`)

**Inputs:**
- Name
- Email
- Country Code
- Mobile Number

**Process:**
1. Validate form inputs
2. Call `completeProfile()` on contract
3. Wait for transaction confirmation
4. Trigger `onSuccess()` callback
5. Redirect to dashboard

## Data Flow

### Registration Flow
```
User Input (Referral Code)
    ↓
Validate Code
    ↓
Check if Already Registered
    ↓
Call register() on Contract
    ↓
Wait for Transaction
    ↓
Update Local State
    ↓
Show Activation Modal
```

### Activation Flow
```
User Selects Level
    ↓
Calculate Required USDT
    ↓
Check USDT Allowance
    ↓
Request Approval (if needed)
    ↓
Call activate() on Contract
    ↓
Wait for Transaction
    ↓
Refresh Balances
    ↓
Show Profile Modal
```

### Status Check Flow (On Page Load/Refresh)
```
Wallet Connected?
    ↓ Yes
Get User ID
    ↓
User ID > 0? (Registered?)
    ↓ Yes
Check Activation Status
    ↓
Activated?
    ↓ Yes
Get User Details
    ↓
Profile Complete?
    ↓ Yes
Allow Dashboard Access
```

## State Persistence

### What's Stored On-Chain
- User ID (mapping: address → uint256)
- Activation Status (bool)
- Activation Level (uint256)
- Profile Data (strings)
- Profile Completed Flag (bool)
- Investment Data (uint256)
- Referral Relationships (address)

### What's Stored Locally
- Pending Referral Code (localStorage)
- Pending Leader Address (localStorage)
- Wallet Connection State (Web3Context)
- User Balances (Web3Context)

### What's Computed On-Demand
- Current modal to show
- User flow state
- Dashboard access permission

## Error Handling Strategy

### Network Errors
```typescript
try {
  await contractCall();
} catch (error) {
  if (error.code === 'NETWORK_ERROR') {
    showToast('Network error. Please check your connection.');
  }
}
```

### Contract Errors
```typescript
try {
  await register();
} catch (error) {
  const message = parseRegistrationError(error);
  showToast(message, 'error');
}
```

### User Errors
```typescript
if (!referralCode) {
  showToast('Please enter a referral code', 'error');
  return;
}
```

## Performance Optimizations

### 1. Parallel Calls
```typescript
const [user, rewards, platformStats] = await Promise.all([
  getUserDetails(account),
  getRewardSummary(account),
  getPlatformStatistics()
]);
```

### 2. Caching
```typescript
// Refresh every 30 seconds instead of every render
const interval = setInterval(fetchData, 30000);
```

### 3. Conditional Checks
```typescript
// Only check status when wallet is connected
if (!account || !isConnected) return;
```

### 4. Loading States
```typescript
const [isCheckingStatus, setIsCheckingStatus] = useState(false);
// Prevent duplicate checks
if (isCheckingStatus) return;
```

## Security Considerations

### 1. Input Validation
- Referral codes are validated before submission
- Addresses are checked with `ethers.isAddress()`
- Form inputs are sanitized

### 2. Transaction Verification
- Wait for transaction confirmation before proceeding
- Check transaction receipt for success
- Handle revert reasons properly

### 3. State Verification
- Always verify on-chain state, never trust local state
- Re-check status after page refresh
- Validate user permissions before showing modals

### 4. Error Messages
- Don't expose sensitive contract details
- Provide user-friendly error messages
- Log detailed errors to console for debugging

## Testing Strategy

### Unit Tests
- Test individual functions (getUserId, checkActivation, etc.)
- Mock contract calls
- Test error handling

### Integration Tests
- Test complete registration flow
- Test modal transitions
- Test state persistence after refresh

### E2E Tests
- Test with real wallet connection
- Test with real contract on testnet
- Test all user journeys

## Monitoring & Debugging

### Console Logging
```typescript
console.log('=== CHECKING USER STATUS ===');
console.log('Account:', account);
console.log('Step 1: Checking if user is registered...');
console.log('✓ User registered:', isRegistered);
```

### Error Tracking
```typescript
console.error('=== ERROR CHECKING USER STATUS ===');
console.error('Error:', error);
```

### State Inspection
```typescript
// Check current state in browser console
window.ethereum.selectedAddress
window.ethereum.chainId
```

## Future Enhancements

### Potential Improvements
1. Add loading skeletons for better UX
2. Implement retry logic for failed transactions
3. Add transaction history tracking
4. Implement gas estimation before transactions
5. Add multi-language support
6. Implement email verification
7. Add social login options
8. Implement referral code generation UI

### Scalability Considerations
1. Implement pagination for large datasets
2. Add caching layer for frequently accessed data
3. Optimize contract calls with multicall
4. Implement lazy loading for modals
5. Add service worker for offline support

## Dependencies

### Core Libraries
- `ethers.js` - Blockchain interaction
- `next.js` - React framework
- `react` - UI library

### Custom Modules
- `lib/web3/contracts.ts` - Contract instances
- `lib/web3/wallet.ts` - Wallet connection
- `lib/web3/activation.ts` - Activation logic
- `lib/web3/registration.ts` - Registration logic
- `lib/toast.ts` - Toast notifications

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_SPEEDTRACK_ADDRESS - Main contract address
NEXT_PUBLIC_USDT_ADDRESS - USDT token address
NEXT_PUBLIC_STTOKEN_ADDRESS - ST token address
NEXT_PUBLIC_RPC_URL - Blockchain RPC endpoint
NEXT_PUBLIC_CHAIN_ID - Network chain ID (97 for BSC Testnet)
```

### Contract ABIs
- `lib/contracts/abis/SpeedTrack.json`
- `lib/contracts/abis/USDT.json`
- `lib/contracts/abis/STToken.json`

## Conclusion

This architecture provides a robust, user-friendly onboarding flow that:
- ✅ Handles all edge cases
- ✅ Persists state correctly
- ✅ Provides clear feedback
- ✅ Recovers from errors gracefully
- ✅ Scales with user growth
- ✅ Maintains security best practices
