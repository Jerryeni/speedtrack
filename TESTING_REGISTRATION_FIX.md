# Testing Guide: Registration & Activation Fix

## Quick Test Checklist

### ✅ Test 1: Fresh Registration
1. Open the app in a fresh browser (or clear local storage)
2. Connect your wallet
3. Click "Join Now" or navigate to register
4. Enter a valid referral code
5. Submit registration
6. **Expected:** After transaction confirms, activation modal should appear immediately
7. **Status:** ✅ PASS / ❌ FAIL

### ✅ Test 2: Refresh After Registration (THE KEY FIX)
1. Complete Test 1 (register but don't activate)
2. **Refresh the page (F5 or Cmd+R)**
3. **Expected:** Activation modal should appear automatically
4. **Previous Bug:** Registration modal would appear again
5. **Status:** ✅ PASS / ❌ FAIL

### ✅ Test 3: Activation Flow
1. From the activation modal, select a level
2. Approve USDT if needed
3. Submit activation
4. **Expected:** After transaction confirms, profile modal should appear
5. **Status:** ✅ PASS / ❌ FAIL

### ✅ Test 4: Refresh After Activation
1. Complete Test 3 (activate but don't complete profile)
2. **Refresh the page**
3. **Expected:** Profile completion modal should appear
4. **Status:** ✅ PASS / ❌ FAIL

### ✅ Test 5: Complete Flow
1. Complete profile with name, email, country code, mobile
2. Submit profile
3. **Expected:** Redirect to dashboard
4. **Status:** ✅ PASS / ❌ FAIL

### ✅ Test 6: Fully Setup User
1. Complete all steps (register, activate, profile)
2. Navigate back to home page
3. **Expected:** No modals appear, can browse landing page
4. Can still access dashboard via navigation
5. **Status:** ✅ PASS / ❌ FAIL

## Console Logging

The fix includes detailed console logging. Open browser DevTools (F12) and check the Console tab. You should see:

```
=== CHECKING USER STATUS ===
Account: 0x...
Step 1: Checking if user is registered...
User ID: 1
✓ User registered: true
Step 2: Checking if user is activated...
✓ User activated: false
→ Showing Activation Modal
```

## Common Issues & Solutions

### Issue: "User not registered" error after registration
**Solution:** Wait for the transaction to be confirmed (check block explorer)

### Issue: Activation modal doesn't appear
**Solution:** 
1. Check console for errors
2. Verify wallet is connected
3. Verify you're on the correct network (BSC Testnet)
4. Check that getUserId returns > 0

### Issue: USDT approval fails
**Solution:**
1. Ensure you have USDT in your wallet
2. Check USDT contract address in .env.local
3. Try approving manually via contract interaction

### Issue: Transaction fails with "User already registered"
**Solution:** This is expected - the system should detect this and skip to activation

## Smart Contract Verification

You can verify your status directly on the contract:

1. Go to BSC Testnet block explorer
2. Find the SpeedTrack contract
3. Go to "Read Contract"
4. Call these functions with your address:
   - `getUserId(address)` - Should return > 0 if registered
   - `getActivationStatus(address)` - Should return true if activated
   - `getUserInfo(address)` - Should return your full profile

## Environment Check

Before testing, verify your `.env.local` file has:

```env
NEXT_PUBLIC_SPEEDTRACK_ADDRESS=0x...
NEXT_PUBLIC_USDT_ADDRESS=0x...
NEXT_PUBLIC_STTOKEN_ADDRESS=0x...
NEXT_PUBLIC_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
NEXT_PUBLIC_CHAIN_ID=97
```

## Expected User Journey

```
┌─────────────────┐
│  Connect Wallet │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Register     │ ◄── If refresh here, should show Activation Modal
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Activate     │ ◄── If refresh here, should show Profile Modal
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Complete Profile│ ◄── If refresh here, should show Profile Modal
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Dashboard    │ ◄── If refresh here, stays on Dashboard
└─────────────────┘
```

## Debug Commands

Open browser console and run:

```javascript
// Check if wallet is connected
window.ethereum.selectedAddress

// Check current network
window.ethereum.chainId

// Force reload Web3 context
window.location.reload()
```

## Success Criteria

✅ Registration → Activation modal appears immediately
✅ Refresh after registration → Activation modal appears
✅ Refresh after activation → Profile modal appears
✅ Refresh after profile → Can access dashboard
✅ No "stuck" states
✅ Clear error messages if something fails
✅ Smooth transitions between steps

## Rollback Plan

If issues occur, revert these files:
1. `app/page.tsx`
2. `lib/web3/activation.ts`
3. `lib/web3/hooks/useUserData.ts`

The changes are isolated and don't affect other functionality.
