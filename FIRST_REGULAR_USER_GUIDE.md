# First Regular User Guide 🎯

## Important: You Are NOT the Contract Owner

You're the first person to register on the platform, but you're **NOT** the contract owner/admin. This means:

- ❌ You DON'T have admin privileges
- ❌ You CAN'T use the ADMIN referral code
- ✅ You ARE a regular user (like everyone else)
- ✅ You NEED a valid referral code from the contract owner

## What You Need to Register

### 1. Referral Code
You need to get the **actual referral code** from the contract owner/admin. This is NOT "ADMIN".

**How to get it:**
- Contact the platform owner/admin
- Ask them for their referral code
- They can find it in their profile after they register

### 2. Leader Address (Optional)
- You can use the admin's wallet address
- Or leave it empty

## Registration Requirements

### Step 1: Get Owner's Referral Code

The contract owner needs to:
1. Register first using the ADMIN code
2. Activate their account
3. Complete their profile
4. Get their personal referral code
5. Share it with you

### Step 2: Your Registration

Once you have the owner's referral code:

```
Referral Code: [Owner's Code] (e.g., "SPEED123" or similar)
Leader Address: [Owner's Address] or leave empty
```

## Why You Can't Use "ADMIN"

The "ADMIN" code is a **special system code** that:
- Only works for the contract owner
- Is used for the very first registration
- Cannot be used by regular users
- Will cause an error if you try to use it

## What Happens If You Try "ADMIN"

```
❌ Error: execution reverted
❌ Reason: You're not the contract owner
❌ Solution: Get the owner's referral code
```

## Correct Registration Flow

### For Contract Owner (First Ever User):
```
1. Register with code: ADMIN
2. Activate account
3. Complete profile
4. Get personal referral code
5. Share code with others
```

### For You (First Regular User):
```
1. Get owner's referral code
2. Register with that code
3. Activate your account
4. Complete your profile
5. Get YOUR referral code
6. Share with others
```

## How to Get the Owner's Referral Code

### Option 1: Ask the Owner Directly
Contact the platform owner and ask:
> "Hi, I'd like to register on the platform. Can you share your referral code with me?"

### Option 2: Check Platform Documentation
The owner might have shared their code in:
- Platform documentation
- Welcome email
- Registration page
- Social media
- Community channels

### Option 3: Check Contract
If you know the owner's address, you can check their referral code:

```typescript
import { getUserDetails } from '@/lib/web3/activation';

const ownerAddress = "0x..."; // Owner's wallet address
const details = await getUserDetails(ownerAddress);
console.log(details.referralCode); // Their code
```

## What You CAN Do

As a regular user, you can:

✅ Register with owner's referral code
✅ Activate your account (pay activation fee)
✅ Complete your profile
✅ Invest in pools
✅ Earn ROI (Return on Investment)
✅ Earn referral income
✅ Trade ST tokens
✅ Refer other users
✅ Get YOUR own referral code
✅ Build your network

## What You CANNOT Do

As a regular user, you cannot:

❌ Access admin panel
❌ Manage platform settings
❌ Use ADMIN referral code
❌ Distribute virtual ROI
❌ Emergency withdraw
❌ Change contract parameters

## Your Registration Checklist

- [ ] Get owner's referral code
- [ ] Connect your wallet (MetaMask)
- [ ] Ensure you're on BSC Testnet (Chain ID: 97)
- [ ] Have USDT for activation fee
- [ ] Register with owner's code
- [ ] Activate your account
- [ ] Complete your profile
- [ ] Access dashboard

## Activation Fees

You'll need USDT to activate your account:

| Level | Activation Fee | Max Investment |
|-------|---------------|----------------|
| 0 | 10 USDT | 100 USDT |
| 1 | 50 USDT | 500 USDT |
| 2 | 100 USDT | 1,000 USDT |
| 3 | 500 USDT | 5,000 USDT |
| 4 | 1,000 USDT | 10,000 USDT |

Choose the level based on:
- Your budget
- Investment plans
- Risk tolerance

## After Registration

Once you complete registration:

1. **Your Referral Code**: You'll get your own code
2. **Referral Link**: Share with others to earn
3. **Dashboard Access**: Full platform features
4. **Earning Potential**: 
   - Daily ROI (0.5%)
   - Referral income (up to 10 levels)
   - Capital return (after pool fills)
   - ST token rewards

## Example Scenario

**Owner (Admin):**
- Wallet: 0xABC...123
- Registers with: ADMIN
- Gets code: SPEED001
- Shares: SPEED001

**You (First Regular User):**
- Wallet: 0xDEF...456
- Registers with: SPEED001 ← Owner's code
- Gets code: SPEED002
- Shares: SPEED002

**Next User:**
- Wallet: 0xGHI...789
- Registers with: SPEED002 ← Your code
- Gets code: SPEED003
- And so on...

## Common Questions

### Q: Why can't I use ADMIN?
**A:** ADMIN is reserved for the contract owner only. You need the owner's personal referral code.

### Q: How do I get the owner's code?
**A:** Contact the platform owner/admin directly and ask for their referral code.

### Q: What if I don't know the owner?
**A:** Check platform documentation, community channels, or contact support.

### Q: Can I register without a referral code?
**A:** No, a valid referral code is required for all registrations.

### Q: What if the owner hasn't registered yet?
**A:** Wait for the owner to register first, then get their code.

## Contact Information

To get the owner's referral code:
- Check platform website
- Join community channels
- Contact platform support
- Check documentation
- Ask in social media groups

## Summary

**You are a regular user, not the admin. You need:**

1. ✅ Owner's referral code (NOT "ADMIN")
2. ✅ USDT for activation
3. ✅ BSC Testnet wallet
4. ✅ Complete profile information

**Once you have the owner's code, you can:**
- Register successfully
- Activate your account
- Use all platform features
- Build your own network
- Earn income

**Contact the platform owner to get their referral code!** 📞
