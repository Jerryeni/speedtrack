# Registration Troubleshooting Guide 🔧

## Your Current Error

```
execution reverted (no data present; likely require(false) occurred
```

This means the smart contract is rejecting your registration. Here's why and how to fix it:

## Problem 1: Wrong Referral Code

**You used:** `admin2025`
**Contract expects:** `ADMIN` (exactly, uppercase)

### Solution:
Use **exactly** `ADMIN` - nothing else will work for the first registration.

## Problem 2: You're Not the Contract Owner

The ADMIN code ONLY works if you are the contract owner. Since you're getting this error, it means:

**You are NOT the contract owner** ❌

### How to Check if You're the Owner:

```typescript
// Contract Owner Address
const ownerAddress = await speedTrack.owner();

// Your Address
const yourAddress = "0xfFF668776c211D09592F5089A9581E3A5a20A6f8";

// Are you the owner?
console.log(ownerAddress === yourAddress); // If false, you can't use ADMIN
```

## The Real Solution

Since you're NOT the contract owner, you **CANNOT** use the ADMIN code at all. Here's what you need to do:

### Step 1: Find the Contract Owner

The contract owner is the person who deployed the contract. You need to:

1. **Contact them** directly
2. **Ask them** to register first using ADMIN
3. **Get their referral code** after they register
4. **Use their code** to register yourself

### Step 2: Wait for Owner to Register

The owner must:
1. Connect their wallet
2. Register with code: `ADMIN`
3. Activate their account
4. Get their personal referral code (e.g., SPEED000001)
5. Share that code with you

### Step 3: Register with Owner's Code

Once you have the owner's code:
```
Referral Code: SPEED000001 (or whatever the owner gives you)
Leader Address: [Owner's address or leave empty]
```

## Why This Happens

The smart contract has this logic:

```solidity
function register(string memory _referralCode, address _leader) public {
    if (_referralCode == "ADMIN") {
        require(msg.sender == owner(), "Only owner can use ADMIN code");
        // ... register as admin
    } else {
        // ... register as regular user with valid referral
    }
}
```

Since you're not the owner, the `require` fails and the transaction reverts.

## Additional Error: Rate Limit

```
limit exceeded
```

This means you're making too many requests to the RPC provider. 

### Solutions:
1. **Wait a few minutes** between attempts
2. **Use a different RPC endpoint**
3. **Get your own RPC key** from services like:
   - Infura
   - Alchemy
   - QuickNode
   - Ankr

## What You Should Do NOW

### Option 1: Contact Contract Owner (Recommended)
1. Find out who deployed the contract
2. Contact them
3. Ask for their referral code
4. Use their code to register

### Option 2: Check if Owner Already Registered

Use the dev tool to check:
1. Click "Get Owner's Code" button
2. If it shows a code, use that code
3. If it says "not registered", wait for owner to register

### Option 3: Deploy Your Own Test Contract

If you need to test independently:
1. Deploy your own instance of the contract
2. You'll be the owner
3. Use ADMIN code freely
4. Test everything

## Quick Reference

| Scenario | Can Use ADMIN? | What to Do |
|----------|---------------|------------|
| You ARE the owner | ✅ Yes | Use `ADMIN` exactly |
| You are NOT the owner | ❌ No | Get owner's referral code |
| Owner not registered yet | ❌ No | Wait for owner to register |
| Testing independently | ✅ Yes | Deploy your own contract |

## Contract Owner Address

Based on your contract: `0x5023C1dd28B28e5cFb7CD3462d4680cEd2ee78Da`

To find the owner:
```typescript
import { getSpeedTrackReadOnly } from '@/lib/web3/contracts';

const speedTrack = await getSpeedTrackReadOnly();
const owner = await speedTrack.owner();
console.log('Contract Owner:', owner);
```

## Your Address

Your wallet: `0xfFF668776c211D09592F5089A9581E3A5a20A6f8`

If this doesn't match the owner address, you CANNOT use ADMIN.

## Summary

**You cannot register because:**
1. ❌ You're using wrong code format ("admin2025" instead of "ADMIN")
2. ❌ You're not the contract owner (so ADMIN won't work anyway)
3. ❌ You're hitting rate limits (too many requests)

**What you need:**
1. ✅ Contact the contract owner
2. ✅ Get their referral code
3. ✅ Use their code to register
4. ✅ Wait between attempts to avoid rate limits

**You CANNOT proceed without the owner's referral code!**

Contact whoever deployed the contract and ask for their referral code. That's the only way forward.
