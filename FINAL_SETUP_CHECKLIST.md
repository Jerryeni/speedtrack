# Final Setup Checklist ✅

## You Now Have:
- ✅ Admin's referral code
- ✅ Admin's wallet address

## Complete Registration Flow

### Step 1: Connect Wallet
- [ ] Open the app
- [ ] Click "Connect Wallet"
- [ ] Approve MetaMask connection
- [ ] Verify you're on **BSC Testnet** (Chain ID: 97)
- [ ] Check you have some BNB for gas fees

### Step 2: Register Account
- [ ] Click "Register" or open registration modal
- [ ] Enter **admin's referral code** (NOT "ADMIN")
- [ ] Enter **admin's wallet address** in leader field (or leave empty)
- [ ] Click "Register"
- [ ] Approve transaction in MetaMask
- [ ] Wait for confirmation
- [ ] ✅ Registration successful!

### Step 3: Activate Account
- [ ] Choose activation level (0-4)
- [ ] Check activation fee required
- [ ] Ensure you have enough USDT
- [ ] Approve USDT spending (if first time)
- [ ] Click "Activate"
- [ ] Approve transaction in MetaMask
- [ ] Wait for confirmation
- [ ] ✅ Account activated!

### Step 4: Complete Profile
- [ ] Enter your full name
- [ ] Enter your email address
- [ ] Enter country code (e.g., +1)
- [ ] Enter mobile number
- [ ] Click "Complete Profile"
- [ ] Approve transaction in MetaMask
- [ ] Wait for confirmation
- [ ] ✅ Profile completed!

### Step 5: Access Dashboard
- [ ] You should be automatically redirected
- [ ] Or navigate to `/dashboard`
- [ ] ✅ Full access granted!

## Activation Levels & Fees

| Level | Fee | Max Investment |
|-------|-----|----------------|
| 0 | 10 USDT | 100 USDT |
| 1 | 50 USDT | 500 USDT |
| 2 | 100 USDT | 1,000 USDT |
| 3 | 500 USDT | 5,000 USDT |
| 4 | 1,000 USDT | 10,000 USDT |

## What You Need

### For Registration:
- ✅ Wallet connected
- ✅ BSC Testnet selected
- ✅ Admin's referral code
- ✅ Small amount of BNB for gas (~0.01 BNB)

### For Activation:
- ✅ USDT tokens (10-1000 depending on level)
- ✅ BNB for gas fees
- ✅ USDT approval for SpeedTrack contract

### For Profile:
- ✅ Personal information ready
- ✅ BNB for gas fees

## Common Issues & Solutions

### Issue: "Insufficient funds"
**Solution:** Add BNB to your wallet for gas fees

### Issue: "Insufficient USDT balance"
**Solution:** Get USDT tokens from faucet or swap

### Issue: "User rejected transaction"
**Solution:** Approve the transaction in MetaMask

### Issue: "Invalid referral code"
**Solution:** Double-check you're using the admin's code correctly

### Issue: "Already registered"
**Solution:** You can only register once per wallet

### Issue: "Wrong network"
**Solution:** Switch to BSC Testnet (Chain ID: 97)

## After Registration

### Your Referral Code
Once registered, you'll get your own referral code:
- Format: SPEED000XXX (where XXX is your user ID)
- Find it in: Profile page, Referral page, Share section
- Share it with others to earn referral income

### What You Can Do
- ✅ Invest in pools
- ✅ Earn daily ROI (0.5%)
- ✅ Earn referral income (10 levels)
- ✅ Trade ST tokens
- ✅ Claim rewards
- ✅ Refer others
- ✅ Track earnings

## Testing Checklist

### Registration
- [ ] Modal opens correctly
- [ ] Form validation works
- [ ] Error messages are clear
- [ ] Success message shows
- [ ] Redirects to activation

### Activation
- [ ] Levels display correctly
- [ ] Fees show properly
- [ ] USDT approval works
- [ ] Activation succeeds
- [ ] Redirects to profile

### Profile
- [ ] Form fields work
- [ ] Validation works
- [ ] Submission succeeds
- [ ] Redirects to dashboard

### Dashboard
- [ ] Loads without errors
- [ ] Shows user data
- [ ] Stats display correctly
- [ ] Navigation works
- [ ] All features accessible

## Verification Steps

### After Registration:
```typescript
// Check if registered
const userId = await speedTrack.getUserId(yourAddress);
console.log('User ID:', userId); // Should be > 0
```

### After Activation:
```typescript
// Check activation status
const isActivated = await speedTrack.isActivated(yourAddress);
console.log('Activated:', isActivated); // Should be true
```

### After Profile:
```typescript
// Check profile completion
const userInfo = await speedTrack.getUserInfo(yourAddress);
console.log('Profile Complete:', userInfo.profileCompleted); // Should be true
```

## Support

If you encounter any issues:

1. **Check browser console** for detailed errors
2. **Verify network** (BSC Testnet)
3. **Check wallet balance** (BNB and USDT)
4. **Review transaction** on BSCScan
5. **Try again** after a few minutes

## BSC Testnet Resources

### Get Test BNB:
- https://testnet.bnbchain.org/faucet-smart

### Get Test USDT:
- Use PancakeSwap Testnet
- Or ask in BSC Testnet communities

### Block Explorer:
- https://testnet.bscscan.com

### Network Details:
- Network Name: BSC Testnet
- RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545/
- Chain ID: 97
- Symbol: BNB
- Explorer: https://testnet.bscscan.com

## Quick Commands

### Check Contract Owner:
```bash
# In browser console
const speedTrack = await getSpeedTrackReadOnly();
const owner = await speedTrack.owner();
console.log(owner);
```

### Check Your Registration:
```bash
# In browser console
const userId = await speedTrack.getUserId(yourAddress);
console.log('Registered:', userId > 0);
```

### Get Your Referral Code:
```bash
# After registration
const userInfo = await speedTrack.getUserInfo(yourAddress);
console.log('Your Code:', `SPEED${userId.toString().padStart(6, '0')}`);
```

## Success Indicators

You'll know everything is working when:

✅ Registration completes without errors
✅ Activation modal appears automatically
✅ Profile modal appears after activation
✅ Dashboard loads with your data
✅ You can see your referral code
✅ All navigation works
✅ Stats display correctly
✅ No console errors

## Final Notes

- **Save your referral code** - you'll need it to invite others
- **Keep some BNB** - for future transactions
- **Test all features** - make sure everything works
- **Report issues** - if you find any bugs

## You're All Set! 🎉

Once you complete all steps, you'll have:
- ✅ Registered account
- ✅ Activated status
- ✅ Complete profile
- ✅ Full dashboard access
- ✅ Your own referral code
- ✅ Ability to earn income

**Now go ahead and register with the admin's code!** 🚀
