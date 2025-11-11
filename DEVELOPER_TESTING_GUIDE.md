# Developer Testing Guide 🛠️

## You Are the Developer/Integrator

You're building the frontend integration for an existing smart contract. You need to test your implementation but you're not the contract owner.

## Solution: Get the Contract Owner's Referral Code

Since the contract is already deployed, someone else is the owner. Here's how to test:

## Option 1: Contact the Contract Owner

**Best Solution:**
1. Contact whoever deployed the contract
2. Ask them to register using the ADMIN code
3. Get their referral code
4. Use their code to test your integration

## Option 2: Check if Owner Already Registered

The owner might have already registered. Let's check:

### Step 1: Find the Contract Owner

```typescript
import { getSpeedTrackReadOnly } from '@/lib/web3/contracts';

const speedTrack = await getSpeedTrackReadOnly();
const ownerAddress = await speedTrack.owner();
console.log('Contract Owner:', ownerAddress);
```

### Step 2: Check if Owner is Registered

```typescript
import { getUserDetails } from '@/lib/web3/activation';

try {
  const ownerDetails = await getUserDetails(ownerAddress);
  console.log('Owner Details:', ownerDetails);
  console.log('Owner Referral Code:', ownerDetails.referralCode);
  // Use this code to register!
} catch (error) {
  console.log('Owner not registered yet');
}
```

### Step 3: Get Owner's Referral Code from Contract

```typescript
// If owner is registered, you can get their code
const speedTrack = await getSpeedTrackReadOnly();
const ownerUserId = await speedTrack.getUserId(ownerAddress);

if (ownerUserId > 0) {
  const ownerDetails = await speedTrack.getUserInfo(ownerAddress);
  console.log('Use this code:', ownerDetails.referralCode);
}
```

## Option 3: Create a Testing Script

Create a script to automatically get the owner's code:

```typescript
// scripts/getOwnerCode.ts
import { getSpeedTrackReadOnly } from '@/lib/web3/contracts';
import { getUserDetails } from '@/lib/web3/activation';

async function getOwnerReferralCode() {
  try {
    // Get contract owner
    const speedTrack = await getSpeedTrackReadOnly();
    const ownerAddress = await speedTrack.owner();
    console.log('📍 Contract Owner:', ownerAddress);
    
    // Check if registered
    const userId = await speedTrack.getUserId(ownerAddress);
    
    if (userId > 0) {
      // Owner is registered, get their code
      const details = await getUserDetails(ownerAddress);
      console.log('✅ Owner is registered!');
      console.log('🎫 Referral Code:', details.referralCode || 'Not set');
      console.log('📧 Email:', details.email || 'Not set');
      console.log('\n🚀 Use this code to register:', details.referralCode);
      return details.referralCode;
    } else {
      console.log('❌ Owner not registered yet');
      console.log('📞 Contact owner at:', ownerAddress);
      console.log('💡 Ask them to register with ADMIN code first');
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Run it
getOwnerReferralCode();
```

## Option 4: Deploy Your Own Test Contract

If you need full control for testing:

### Deploy Test Contract
1. Deploy your own instance of the contract
2. You'll be the owner
3. Use ADMIN code to register
4. Test everything freely

### Steps:
```bash
# 1. Get contract source code
# 2. Deploy to BSC Testnet
# 3. Update contract address in your config
# 4. You're now the owner - use ADMIN code
```

## Option 5: Use Existing Test Account

If there's a test account already registered:

```typescript
// Check for existing test users
const speedTrack = await getSpeedTrackReadOnly();

// Try common test user IDs
for (let i = 1; i <= 10; i++) {
  try {
    const userAddress = await speedTrack.getUserById(i);
    const details = await getUserDetails(userAddress);
    console.log(`User ${i}:`, userAddress);
    console.log('Code:', details.referralCode);
  } catch (error) {
    break;
  }
}
```

## Quick Testing Solution

### Create a Helper Component

```typescript
// components/dev/OwnerCodeFetcher.tsx
"use client";

import { useState } from 'react';
import { getSpeedTrackReadOnly } from '@/lib/web3/contracts';
import { getUserDetails } from '@/lib/web3/activation';

export default function OwnerCodeFetcher() {
  const [ownerCode, setOwnerCode] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchOwnerCode = async () => {
    setLoading(true);
    try {
      const speedTrack = await getSpeedTrackReadOnly();
      const owner = await speedTrack.owner();
      setOwnerAddress(owner);
      
      const userId = await speedTrack.getUserId(owner);
      if (userId > 0) {
        const details = await getUserDetails(owner);
        setOwnerCode(details.referralCode || 'Not set');
      } else {
        setOwnerCode('Owner not registered yet');
      }
    } catch (error) {
      console.error(error);
      setOwnerCode('Error fetching');
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 p-4 rounded-lg border border-neon-blue z-50">
      <h3 className="text-sm font-bold mb-2">Dev Tools</h3>
      <button 
        onClick={fetchOwnerCode}
        disabled={loading}
        className="px-3 py-1 bg-neon-blue text-white rounded text-sm mb-2"
      >
        {loading ? 'Loading...' : 'Get Owner Code'}
      </button>
      {ownerAddress && (
        <div className="text-xs space-y-1">
          <p className="text-gray-400">Owner: {ownerAddress.slice(0, 10)}...</p>
          <p className="text-green-400">Code: {ownerCode}</p>
          {ownerCode && ownerCode !== 'Owner not registered yet' && (
            <button
              onClick={() => navigator.clipboard.writeText(ownerCode)}
              className="px-2 py-1 bg-green-500 text-white rounded text-xs"
            >
              Copy Code
            </button>
          )}
        </div>
      )}
    </div>
  );
}
```

### Add to Your App (Development Only)

```typescript
// app/layout.tsx or app/page.tsx
import OwnerCodeFetcher from '@/components/dev/OwnerCodeFetcher';

export default function Layout() {
  return (
    <>
      {/* Your app */}
      
      {/* Dev tools - only in development */}
      {process.env.NODE_ENV === 'development' && <OwnerCodeFetcher />}
    </>
  );
}
```

## Contract Configuration

Check your contract address:

```typescript
// lib/web3/config.ts
export const CONTRACTS = {
  SPEEDTRACK: "0x5023C1dd28B28e5cFb7CD3462d4680cEd2ee78Da", // Your contract
  USDT: "...",
  STTOKEN: "..."
};
```

## Testing Checklist

- [ ] Find contract owner address
- [ ] Check if owner is registered
- [ ] Get owner's referral code
- [ ] Use code to register your test account
- [ ] Test activation flow
- [ ] Test profile completion
- [ ] Test dashboard access
- [ ] Test all features

## Common Scenarios

### Scenario 1: Owner Already Registered
```
✅ Get their referral code
✅ Use it to register
✅ Test your integration
```

### Scenario 2: Owner Not Registered Yet
```
📞 Contact owner
💬 Ask them to register with ADMIN
⏳ Wait for their code
✅ Then test
```

### Scenario 3: Can't Contact Owner
```
🔧 Deploy your own test contract
👑 You become the owner
✅ Test freely
```

## Quick Command to Get Owner Info

Add this to your package.json:

```json
{
  "scripts": {
    "get-owner": "ts-node scripts/getOwnerCode.ts"
  }
}
```

Then run:
```bash
npm run get-owner
```

## Summary for Developers

**You need the contract owner's referral code to test. Here's how:**

1. **Find owner address** from contract
2. **Check if registered** using getUserId
3. **Get their code** using getUserDetails
4. **Use that code** to register your test account
5. **Test everything** normally

**If owner not registered:**
- Contact them to register first
- Or deploy your own test contract
- Or wait for them to set up

**For continuous testing:**
- Create a dev tools component
- Auto-fetch owner code
- Copy and use for testing

See the code examples above to implement this! 🚀
