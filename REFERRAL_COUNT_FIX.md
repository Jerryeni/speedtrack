# Referral Count Fix - Direct from Contract

## Problem
User has 2 referrals visible in contract explorer, but frontend shows 0.

## Root Cause
The filtered event query `speedTrack.filters.SponsorRegistered(null, userAddress)` may not work correctly with some RPC providers or the event indexing might have issues.

## Solution Implemented

### 1. Dual-Method Event Querying
Updated `getReferralStats()` to use TWO methods:

**Method 1: Filtered Query (Fast)**
```typescript
const filter = speedTrack.filters.SponsorRegistered(null, userAddress);
const events = await speedTrack.queryFilter(filter);
```

**Method 2: Full Scan (Reliable)**
If Method 1 returns 0, we query ALL events and filter manually:
```typescript
const filterAll = speedTrack.filters.SponsorRegistered();
const allEvents = await speedTrack.queryFilter(filterAll);

// Filter manually
const userReferrals = allEvents.filter(event => {
  const eventLog = event as ethers.EventLog;
  return eventLog.args?.referrer?.toLowerCase() === userAddress.toLowerCase();
});
```

### 2. Enhanced Logging
Added comprehensive console logging to track:
- Which method is being used
- How many events are found
- Unique user addresses
- Final referral count

### 3. Diagnostic Tools

**New File: `lib/web3/referralDiagnostics.ts`**
- `diagnoseReferrals()` - Comprehensive diagnostics
- `getActualReferralCount()` - Reliable count using full scan

**New Page: `/referral-debug`**
- Visual interface to run diagnostics
- Shows actual count vs displayed count
- Displays all referral data
- Links to browser console for detailed logs

## Files Modified

1. ✅ `lib/web3/referrals.ts`
   - Updated `getReferralStats()` with dual-method querying
   - Updated `getNetworkLevels()` with same approach
   - Added extensive logging

2. ✅ `lib/web3/referralDiagnostics.ts` (NEW)
   - Diagnostic functions
   - Actual count retrieval
   - Contract interface inspection

3. ✅ `app/referral-debug/page.tsx` (NEW)
   - Debug interface
   - Visual results display
   - Easy testing

## How to Test

### Step 1: Visit Debug Page
Navigate to: `/referral-debug`

### Step 2: Run Diagnostics
1. Connect your wallet
2. Click "Run Referral Diagnostics"
3. Check the results on screen
4. Open browser console (F12) for detailed logs

### Step 3: Check Console Output
Look for:
```
=== getReferralStats START ===
Fetching referral stats for: 0x...
Level income: X.XX USDT
Querying SponsorRegistered events...
Method 1 (filtered): Found X events
Method 2 (full scan): Found X events
Unique referred users: [0x..., 0x...]
FINAL COUNT: 2 direct referrals
```

## Expected Results

After the fix:
- ✅ Referral page shows correct count (2)
- ✅ Dashboard shows correct count (2)
- ✅ Share page shows correct count (2)
- ✅ Console logs show detailed event data
- ✅ Debug page confirms actual count

## Why This Works

1. **Fallback Strategy**: If filtered query fails, full scan ensures we get data
2. **Manual Filtering**: We control the filtering logic, not relying on RPC provider
3. **Unique Counting**: Using Set ensures we count each user only once
4. **Comprehensive Logging**: Easy to debug if issues persist

## Technical Details

### Event Structure
```
SponsorRegistered(
  address indexed user,      // The new user who registered
  address indexed referrer,  // The person who referred them (YOU)
  ReferralType refType,      // Type of referral
  string referralCode        // Code used
)
```

### Counting Logic
1. Query all SponsorRegistered events
2. Filter where `referrer === yourAddress`
3. Extract unique `user` addresses
4. Count = size of unique set

### Performance
- Method 1 (filtered): Fast, but may not work
- Method 2 (full scan): Slower, but reliable
- Automatic fallback ensures best of both

## Troubleshooting

### If count is still 0:
1. Check browser console for errors
2. Visit `/referral-debug` page
3. Verify contract address in `.env.local`
4. Check RPC provider is responding
5. Ensure you're on correct network

### If count is wrong:
1. Check console logs for event details
2. Verify the referred users' addresses
3. Check if events are from correct contract
4. Ensure no duplicate counting

## Next Steps

1. Test with your wallet on `/referral-debug`
2. Check console logs for detailed output
3. Verify count matches contract explorer
4. If issues persist, share console logs for further debugging

## Contract Note

The SpeedTrack contract does NOT have a direct function to get referral count. The ONLY way to get this data is by:
1. Querying `SponsorRegistered` events, OR
2. Having the contract expose a `referrals` mapping (which it doesn't)

Our solution uses event querying with a robust fallback mechanism to ensure accuracy.
