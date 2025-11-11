# First User (Admin) Setup Guide 🚀

## As the First User / Admin

Since you're the first user on the platform, you need to use the special **ADMIN referral code** to register.

## Registration Details

### Referral Code
Use the admin referral code: **`ADMIN`**

### Leader Address
For the first user, you can use:
- **Your own wallet address** (self-referral)
- **Zero address**: `0x0000000000000000000000000000000000000000`
- The contract will handle this automatically

## Step-by-Step Registration

### 1. Connect Your Wallet
- Click "Connect Wallet" button
- Approve MetaMask connection
- Ensure you're on **BSC Testnet** (Chain ID: 97)

### 2. Register Your Account

When the registration modal appears, enter:

```
Referral Code: ADMIN
Leader Address: [Your wallet address or leave empty]
```

**Note**: The contract has a special `ADMIN_REFERRAL_CODE` constant that allows the first user to register without an existing referrer.

### 3. Activate Your Account

After registration:
- Choose activation level (0-4)
- Pay the activation fee in USDT
- Approve USDT spending if needed
- Confirm the transaction

### 4. Complete Your Profile

Fill in your details:
- Full Name
- Email Address
- Country Code
- Mobile Number

### 5. Access Dashboard

Once all steps are complete, you'll have full access to:
- Dashboard
- Trading
- Pool investments
- Referral system
- Admin panel (as contract owner)

## Getting the Admin Referral Code Programmatically

If you need to fetch it from the contract:

```typescript
import { getAdminReferralCode } from '@/lib/web3/registration';

const adminCode = await getAdminReferralCode();
console.log(adminCode); // "ADMIN"
```

Or from the contract directly:

```typescript
import { getSpeedTrackReadOnly } from '@/lib/web3/contracts';

const speedTrack = await getSpeedTrackReadOnly();
const adminCode = await speedTrack.ADMIN_REFERRAL_CODE();
console.log(adminCode); // "ADMIN"
```

## Admin Panel Access

As the contract owner (first user), you'll have access to the admin panel at `/admin` where you can:

- View platform statistics
- Manage users
- Manage pools
- Distribute virtual ROI
- Update contract settings
- Emergency withdrawals

## Subsequent Users

After you register, other users can register using:
- **Your referral code** (generated after registration)
- **Your wallet address** as the leader address

## Troubleshooting

### "Invalid referral code" Error

**Solution**: Make sure you're using exactly `ADMIN` (case-sensitive)

### "Referrer not found" Error

**Solution**: 
- Use your own wallet address as leader
- Or use the zero address
- The contract should handle admin registration specially

### Can't Find Referral Code Field

**Solution**: 
- Make sure you're on the registration modal
- Check that your wallet is connected
- Verify you're on the correct network (BSC Testnet)

## Contract Constants

The admin referral code is defined in the smart contract:

```solidity
string public constant ADMIN_REFERRAL_CODE = "ADMIN";
```

This is a special code that allows the first user to register without an existing referrer.

## Testing Your Setup

After registration, verify everything works:

1. **Check Registration**
   ```typescript
   const userDetails = await getUserDetails(yourAddress);
   console.log(userDetails); // Should show your details
   ```

2. **Check Activation**
   ```typescript
   const isActivated = await checkAccountActivation(yourAddress);
   console.log(isActivated); // Should be true after activation
   ```

3. **Check Admin Status**
   ```typescript
   const speedTrack = await getSpeedTrackReadOnly();
   const owner = await speedTrack.owner();
   console.log(owner === yourAddress); // Should be true
   ```

## Quick Reference

| Field | Value for First User |
|-------|---------------------|
| Referral Code | `ADMIN` |
| Leader Address | Your wallet address or `0x0000...0000` |
| Network | BSC Testnet (97) |
| Admin Panel | `/admin` |

## Next Steps After Registration

1. ✅ Activate your account
2. ✅ Complete your profile
3. ✅ Access dashboard
4. ✅ Check admin panel
5. ✅ Generate your referral code
6. ✅ Share with other users
7. ✅ Start using the platform

## Your Referral Code

After registration, you'll get your own referral code that others can use. You can find it:
- In your profile
- On the referral page
- In the share section

## Support

If you encounter any issues:
1. Check browser console for errors
2. Verify wallet connection
3. Ensure correct network (BSC Testnet)
4. Check USDT balance for activation
5. Review transaction status on BSCScan

## Summary

**As the first user:**
- Use referral code: `ADMIN`
- Use your wallet address as leader (or zero address)
- Complete all registration steps
- You'll automatically be the admin/owner
- You can then invite other users with your referral code

That's it! You're ready to be the first user on the platform! 🎉
