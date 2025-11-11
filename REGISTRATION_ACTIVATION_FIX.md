# Registration & Activation Flow Fix

## Problem Identified

The user was experiencing an issue where:
1. After registering successfully, they could not activate
2. When refreshing the page, the activation modal would not appear
3. The registration modal would show again instead

## Root Cause

The issue was in `app/page.tsx` where the user status check had a conditional that prevented it from running after page refresh:

```typescript
// OLD CODE - PROBLEMATIC
const shouldCheck = wantsToRegister || wantsToActivate || wantsToCompleteProfile || 
                   showRegisterModal || showActivateModal || showProfileModal;

if (!shouldCheck) return; // This prevented the check from running on refresh!
```

After registration, when the user refreshed the page:
- No URL params were present
- No modals were open
- The `shouldCheck` condition was false
- The status check never ran
- The user appeared as "not registered" again

## Solution Implemented

### 1. Always Check User Status When Connected

**File: `app/page.tsx`**

Removed the conditional check that prevented status verification on refresh. Now the system ALWAYS checks user status when a wallet is connected:

```typescript
// NEW CODE - FIXED
// ALWAYS check user status when connected
// This ensures that after registration, refresh will show activation modal
```

### 2. Improved Status Check Logic

Implemented a clear 3-step verification process:

```typescript
// Step 1: Check if user is registered (via getUserId)
const userId = await getUserId(account);
const isRegistered = userId !== '0' && parseInt(userId) > 0;

if (!isRegistered) {
  // Show Registration Modal
  return;
}

// Step 2: Check if user is activated
const isActivated = await checkAccountActivation(account);

if (!isActivated) {
  // Show Activation Modal
  return;
}

// Step 3: Check if profile is complete
const userDetails = await getUserDetails(account);
const profileCompleted = userDetails.profileCompleted;

if (!profileCompleted) {
  // Show Profile Modal
  return;
}

// All steps complete!
```

### 3. Enhanced getUserDetails Function

**File: `lib/web3/activation.ts`**

Added registration check before fetching user details to provide better error messages:

```typescript
export async function getUserDetails(address: string) {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    
    // First check if user is registered by checking their ID
    const userId = await speedTrack.getUserId(address);
    const userIdNum = Number(userId);
    if (userIdNum === 0) {
      throw new Error('User not registered');
    }
    
    // User is registered, get their info
    const userInfo = await speedTrack.getUserInfo(address);
    
    return {
      // ... user data
      isRegistered: true
    };
  } catch (error: any) {
    if (error.message === 'User not registered') {
      throw error;
    }
    throw new Error('Failed to fetch user details');
  }
}
```

### 4. Updated useUserData Hook

**File: `lib/web3/hooks/useUserData.ts`**

Fixed the activation status check to use the correct field:

```typescript
return {
  userData,
  rewardData,
  poolData,
  isLoading,
  error,
  isActivated: userData?.activationLevel > 0 || false, // Fixed: was checking 'activated'
  isRegistered: userData?.isRegistered || false
};
```

### 5. Smart Redirect Logic

Only redirect to dashboard when user explicitly wants to go somewhere (via URL params). Otherwise, let fully-setup users browse the landing page:

```typescript
if (wantsToRegister || wantsToActivate || wantsToCompleteProfile) {
  window.location.href = '/dashboard';
} else {
  // User can browse landing page
}
```

## How It Works Now

### Registration Flow
1. User connects wallet
2. User enters referral code and registers
3. Transaction confirms
4. **Activation modal automatically appears**

### After Page Refresh
1. System checks if wallet is connected
2. Checks registration status via `getUserId()`
3. If registered but not activated → **Shows Activation Modal**
4. If activated but profile incomplete → Shows Profile Modal
5. If everything complete → User can access dashboard

### Key Improvements
- ✅ Status check runs on EVERY page load when wallet is connected
- ✅ Clear 3-step verification: Registration → Activation → Profile
- ✅ Proper error handling for each state
- ✅ No more "stuck" states after refresh
- ✅ Smooth transition between modals
- ✅ Better user experience with clear console logging

## Testing Steps

1. **Test Registration Flow:**
   - Connect wallet
   - Register with referral code
   - Verify activation modal appears immediately

2. **Test Refresh After Registration:**
   - Register successfully
   - Refresh the page
   - Verify activation modal appears (not registration)

3. **Test Refresh After Activation:**
   - Activate account
   - Refresh the page
   - Verify profile modal appears (not activation)

4. **Test Complete Flow:**
   - Complete all steps
   - Refresh the page
   - Verify you can access dashboard

## Contract Functions Used

- `getUserId(address)` - Returns user ID (0 if not registered)
- `getActivationStatus(address)` - Returns true if activated
- `getUserInfo(address)` - Returns full user details including profileCompleted

## Files Modified

1. `app/page.tsx` - Main flow logic
2. `lib/web3/activation.ts` - getUserDetails function
3. `lib/web3/hooks/useUserData.ts` - Activation status check

## Notes

- The fix maintains backward compatibility
- All existing functionality remains intact
- Console logging helps with debugging
- Error handling is robust and user-friendly
