# Contract Address Verification & Transaction Debugging

## ✅ Contract Addresses Confirmed

Your contract addresses are correctly configured:

### SpeedTrack Contract
```
0x406249AF7Eb8A32c1F79b9BB1A9DB57DB1EB3D23
```
**View on BSCScan**: https://testnet.bscscan.com/address/0x406249AF7Eb8A32c1F79b9BB1A9DB57DB1EB3D23

### STToken Contract
```
0x8058aE55731ab8dF54DFdf3f21469830F89f35Ed
```
**View on BSCScan**: https://testnet.bscscan.com/address/0x8058aE55731ab8dF54DFdf3f21469830F89f35Ed

### USDT Contract (BSC Testnet)
```
0x0D3E80cBc9DDC0a3Fdee912b99C50cd0b5761eE3
```

## Configuration Files Updated

### ✅ .env.local
```env
NEXT_PUBLIC_SPEEDTRACK_ADDRESS=0x406249AF7Eb8A32c1F79b9BB1A9DB57DB1EB3D23
NEXT_PUBLIC_STTOKEN_ADDRESS=0x8058aE55731ab8dF54DFdf3f21469830F89f35Ed
NEXT_PUBLIC_USDT_ADDRESS=0x0D3E80cBc9DDC0a3Fdee912b99C50cd0b5761eE3
```

### ✅ .env
```env
NEXT_PUBLIC_SPEEDTRACK_ADDRESS=0x406249AF7Eb8A32c1F79b9BB1A9DB57DB1EB3D23
NEXT_PUBLIC_STTOKEN_ADDRESS=0x8058aE55731ab8dF54DFdf3f21469830F89f35Ed
NEXT_PUBLIC_USDT_ADDRESS=0x0D3E80cBc9DDC0a3Fdee912b99C50cd0b5761eE3
```

### ✅ lib/web3/config.ts
```typescript
export const CONTRACTS = {
  SPEEDTRACK: '0x406249AF7Eb8A32c1F79b9BB1A9DB57DB1EB3D23',
  STTOKEN: '0x8058aE55731ab8dF54DFdf3f21469830F89f35Ed',
  USDT: '0x0D3E80cBc9DDC0a3Fdee912b99C50cd0b5761eE3',
};
```

## New Diagnostic Tools Added

### 1. Contract Diagnostics Page
**URL**: `/diagnostics`

Features:
- ✅ View all contract addresses
- ✅ Run full system diagnostics
- ✅ Verify transactions by hash
- ✅ Check user registration status
- ✅ Direct links to BSCScan

### 2. Enhanced Logging
All registration and activation functions now include:
- ✅ Contract address verification
- ✅ Transaction hash logging
- ✅ BSCScan links in console
- ✅ Step-by-step process tracking

## How to Debug Transaction Issues

### Step 1: Access Diagnostics Page
1. Navigate to `/diagnostics` in your app
2. Click "Run Full Diagnostics"
3. Check browser console (F12) for detailed output

### Step 2: Verify Contract Connection
The diagnostics will check:
- ✅ Contract addresses match configuration
- ✅ RPC connection is working
- ✅ Contract functions are accessible
- ✅ Wallet is connected to correct network

### Step 3: Test Registration/Activation
When you register or activate:
1. Open browser console (F12)
2. Watch for transaction hash
3. Copy the BSCScan link from console
4. Verify transaction on BSCScan

### Step 4: Verify Transaction on BSCScan
1. Go to the BSCScan link from console
2. Check transaction status:
   - ✅ **Success** = Transaction confirmed
   - ⏳ **Pending** = Wait for confirmation
   - ❌ **Failed** = Check error message

## Common Issues & Solutions

### Issue 1: Transactions Not Showing on Explorer
**Possible Causes**:
- Transaction still pending (wait 30-60 seconds)
- Wrong network selected in wallet
- RPC connection issues

**Solution**:
1. Check wallet is on BSC Testnet (Chain ID: 97)
2. Wait for transaction confirmation
3. Verify transaction hash on BSCScan

### Issue 2: Contract Address Mismatch
**Symptoms**:
- Console shows "CONTRACT ADDRESS MISMATCH" error
- Transactions go to wrong address

**Solution**:
1. Check `.env.local` file has correct addresses
2. Restart development server: `npm run dev`
3. Clear browser cache and reload
4. Run diagnostics to verify

### Issue 3: Transaction Fails Silently
**Symptoms**:
- No error message
- No transaction hash
- Nothing on BSCScan

**Solution**:
1. Check browser console for errors
2. Verify wallet has BNB for gas
3. Check USDT approval for activation
4. Run diagnostics to check connection

## Verification Checklist

Before reporting issues, verify:

- [ ] Wallet connected to BSC Testnet (Chain ID 97)
- [ ] Contract addresses match in all config files
- [ ] Browser console shows transaction hash
- [ ] Transaction appears on BSCScan (even if pending)
- [ ] Wallet has sufficient BNB for gas fees
- [ ] USDT approved for SpeedTrack contract (for activation)

## Testing Your Setup

### Test 1: Run Diagnostics
```
1. Go to /diagnostics
2. Click "Run Full Diagnostics"
3. Check console output
4. Verify all checks pass ✅
```

### Test 2: Verify Contract on BSCScan
```
1. Visit: https://testnet.bscscan.com/address/0x406249AF7Eb8A32c1F79b9BB1A9DB57DB1EB3D23
2. Check "Contract" tab shows verified contract
3. Check "Transactions" tab shows activity
4. Check "Events" tab shows emitted events
```

### Test 3: Check Your Wallet Transactions
```
1. Visit: https://testnet.bscscan.com/address/[YOUR_WALLET_ADDRESS]
2. Look for transactions to SpeedTrack contract
3. Verify transaction status (Success/Failed)
4. Check transaction details and events
```

## Enhanced Logging Output

When you register or activate, you'll see:

```
=== REGISTRATION PROCESS START ===
Step 1: Getting SpeedTrack contract...
✓ Contract address: 0x406249AF7Eb8A32c1F79b9BB1A9DB57DB1EB3D23
Expected Address: 0x406249AF7Eb8A32c1F79b9BB1A9DB57DB1EB3D23
✅ Contract address verified

Step 2: Getting signer...
✓ User address: 0x...

Step 3: Preparing parameters...
  - Referral Code: ADMIN2025
  - Leader Address: 0x0000000000000000000000000000000000000000

Step 4: Calling register function...
✓ Transaction sent!
  Transaction hash: 0x...
  From: 0x...
  To: 0x406249AF7Eb8A32c1F79b9BB1A9DB57DB1EB3D23
  View on BSCScan: https://testnet.bscscan.com/tx/0x...

=== REGISTRATION PROCESS SUCCESS ===
⚠️  IMPORTANT: Wait for transaction confirmation
⚠️  Check transaction status on BSCScan
```

## Files Modified

1. ✅ `lib/web3/diagnostics.ts` - New diagnostic utilities
2. ✅ `components/dev/ContractDiagnostics.tsx` - Diagnostic UI component
3. ✅ `app/diagnostics/page.tsx` - Diagnostic page
4. ✅ `lib/web3/registration.ts` - Enhanced logging
5. ✅ `lib/web3/activation.ts` - Contract verification
6. ✅ `.env.local` - Verified addresses
7. ✅ `.env` - Verified addresses
8. ✅ `lib/web3/config.ts` - Verified addresses

## Next Steps

1. **Restart Development Server**
   ```bash
   npm run dev
   ```

2. **Clear Browser Cache**
   - Press Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
   - Clear cached images and files
   - Reload page

3. **Test Registration Flow**
   - Open browser console (F12)
   - Go through registration
   - Watch for transaction hash
   - Verify on BSCScan

4. **Use Diagnostics Page**
   - Navigate to `/diagnostics`
   - Run full diagnostics
   - Check all systems are green ✅

## Support

If transactions still don't appear on BSCScan:

1. Copy diagnostic output from console
2. Copy transaction hash (if any)
3. Check wallet transaction history on BSCScan
4. Verify you're on BSC Testnet (not mainnet)
5. Ensure contract is deployed and verified on BSCScan

## Contract Verification on BSCScan

Your SpeedTrack contract should show:
- ✅ Contract verified (green checkmark)
- ✅ Read Contract tab accessible
- ✅ Write Contract tab accessible
- ✅ Events tab showing emitted events
- ✅ Transaction history

If not verified, you need to verify the contract on BSCScan first.
