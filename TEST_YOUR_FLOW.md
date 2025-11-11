# Test Your Registration Flow

## Quick Test Steps

### 1. Clear Your Browser State
```bash
# Open browser console (F12)
# Clear localStorage
localStorage.clear();

# Refresh the page
location.reload();
```

### 2. Check Your Registration Status

Open browser console and run:

```javascript
// Get contract instance
const { ethers } = require('ethers');
const provider = new ethers.BrowserProvider(window.ethereum);
const speedTrackAddress = "YOUR_CONTRACT_ADDRESS"; // From .env.local

const abi = [
  "function getUserId(address) view returns (uint256)",
  "function getUserInfo(address) view returns (string,string,string,string,uint256,address,uint8,bool,bool,uint256,uint256,uint256,uint256,uint256)"
];

const contract = new ethers.Contract(speedTrackAddress, abi, provider);

// Check your address
const accounts = await provider.send("eth_requestAccounts", []);
const myAddress = accounts[0];

// Check registration
const userId = await contract.getUserId(myAddress);
console.log("User ID:", userId.toString());
console.log("Is Registered:", Number(userId) > 0);

// Check activation
const userInfo = await contract.getUserInfo(myAddress);
console.log("Activation Level:", userInfo[4].toString());
console.log("Is Activated:", Number(userInfo[4]) > 0);
console.log("Profile Completed:", userInfo[8]);
```

### 3. Expected Console Logs

#### When you connect wallet:

**Not Registered:**
```
📞 Checking if user is registered: 0x...
getUserId returned: 0
❌ User is NOT registered
→ Showing Registration Modal
```

**Registered but Not Activated:**
```
📞 Checking if user is registered: 0x...
getUserId returned: 1
✅ User IS registered (userId > 0)
📞 Checking activation status for: 0x...
Activation level: 0
❌ User is NOT activated
→ User can browse landing page
```

**Activated:**
```
📞 Checking if user is registered: 0x...
getUserId returned: 1
✅ User IS registered (userId > 0)
📞 Checking activation status for: 0x...
Activation level: 1
✅ User IS activated
→ User can browse landing page
```

## Troubleshooting

### Issue: Still seeing registration modal after registering

**Solution:**
1. Check transaction was confirmed on blockchain
2. Wait 10-15 seconds for blockchain state to update
3. Refresh the page
4. Check console logs for actual status

**Verify on blockchain:**
```javascript
const userId = await contract.getUserId(myAddress);
console.log("Blockchain says User ID:", userId.toString());
```

### Issue: Can't access dashboard after activation

**Solution:**
1. Verify activation transaction was confirmed
2. Check activation level on blockchain:
```javascript
const userInfo = await contract.getUserInfo(myAddress);
console.log("Activation Level:", userInfo[4].toString());
```
3. If level is 0, activation didn't go through
4. Try activating again

### Issue: Profile modal not appearing

**Solution:**
1. Go directly to `/profile` page
2. Modal should auto-appear if profile not complete
3. Check console for errors
4. Verify you're on correct network

## Manual Flow Test

### Test 1: New User Registration
1. ✅ Connect wallet → Registration modal appears
2. ✅ Enter referral code → Register
3. ✅ Redirected to `/activate`
4. ✅ Select level → Activate
5. ✅ Redirected to `/profile` (after 2s)
6. ✅ Profile modal appears
7. ✅ Complete profile → Redirected to `/dashboard`

### Test 2: Registered User (Not Activated)
1. ✅ Connect wallet → No registration modal
2. ✅ See "Activate Now" floating banner
3. ✅ Click banner → Go to `/activate`
4. ✅ Continue from Test 1, step 4

### Test 3: Activated User
1. ✅ Connect wallet → No registration modal
2. ✅ See "Go to Dashboard" banner (if profile incomplete)
3. ✅ Can browse landing page freely
4. ✅ Click banner → Go to `/dashboard`
5. ✅ Full access to dashboard

### Test 4: Already Activated User Visits Activation Page
1. ✅ Go to `/activate`
2. ✅ Toast: "Your account is already activated!"
3. ✅ Auto-redirected to `/dashboard`

## Network Issues

If you see errors like "could not detect network":

1. Check `.env.local` has correct RPC URL
2. Verify network is running
3. Check MetaMask is on correct network
4. Try switching networks in MetaMask

## Contract Call Verification

### Verify getUserId works:
```javascript
const userId = await contract.getUserId(myAddress);
console.log("getUserId result:", userId.toString());
// Should be > 0 if registered
```

### Verify getUserInfo works:
```javascript
const userInfo = await contract.getUserInfo(myAddress);
console.log("Full user info:", {
  name: userInfo[0],
  email: userInfo[1],
  activationLevel: userInfo[4].toString(),
  profileCompleted: userInfo[8],
  uid: userInfo[13].toString()
});
```

## Success Indicators

### ✅ Registration Successful
- Console shows: `✅ User IS registered (userId > 0)`
- No registration modal appears on refresh
- Floating banner shows "Activate Now"

### ✅ Activation Successful
- Console shows: `✅ User IS activated`
- Can access `/dashboard` without redirect
- No activation prompts appear

### ✅ Profile Complete
- `profileCompleted: true` in getUserInfo
- No profile modal appears
- Full dashboard access

## Quick Reset (For Testing)

**WARNING: This will require re-registration**

```javascript
// Clear all local state
localStorage.clear();
sessionStorage.clear();

// Disconnect wallet in MetaMask
// Reconnect and test fresh flow
```

## Contact Points

If issues persist:
1. Check console logs for specific errors
2. Verify contract address in `.env.local`
3. Ensure you have USDT for activation
4. Check network connection
5. Review `REGISTRATION_FLOW_FIXED.md` for details
