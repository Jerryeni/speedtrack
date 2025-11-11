# Error Messages Guide

## User-Friendly Error Messages

All error messages in Speed Track are designed to be:
- ✅ **Clear and understandable** - No technical jargon
- ✅ **Actionable** - Tell users what to do next
- ✅ **Friendly** - Use emojis and positive language
- ✅ **Helpful** - Provide solutions, not just problems

## Error Categories

### 1. Transaction Errors

#### User Cancelled
**Message**: ❌ Transaction cancelled. No worries, you can try again anytime!
**When**: User rejects transaction in wallet
**Action**: None needed, user can retry when ready

#### Insufficient Gas
**Message**: ⛽ Not enough BNB for gas fees. Please add some BNB to your wallet (even 0.01 BNB is enough).
**When**: Not enough BNB for transaction fees
**Action**: Add BNB to wallet

#### Insufficient Balance
**Message**: 💰 Insufficient balance. Please add more tokens to your wallet and try again.
**When**: Not enough tokens for transaction
**Action**: Add required tokens

### 2. Activation Errors

#### Already Activated
**Message**: ✅ Great! Your account is already activated. You can start investing right away!
**When**: User tries to activate already activated account
**Action**: Proceed to dashboard/invest

#### Not Registered
**Message**: 📝 Please register your account first before activating. Go to the registration page to get started.
**When**: User tries to activate without registering
**Action**: Complete registration first

#### Insufficient USDT for Activation
**Message**: 💰 You need USDT to activate your account. Level 0 requires 10 USDT. Please add USDT to your wallet and try again.
**When**: Not enough USDT for activation fee
**Action**: Add USDT to wallet

#### Approval Needed
**Message**: 🔐 Please approve USDT spending first. Click "Approve" when prompted by your wallet, then try activating again.
**When**: USDT not approved for spending
**Action**: Approve USDT, then retry

### 3. Investment Errors

#### Not Activated
**Message**: 🔒 Please activate your account first. Go to the activation page to get started!
**When**: User tries to invest without activation
**Action**: Activate account first

#### Amount Too Low
**Message**: 📊 Investment amount is too low. The minimum investment is 10 USDT. Please increase your amount.
**When**: Investment below minimum
**Action**: Increase investment amount

#### Amount Too High
**Message**: 📊 Investment amount exceeds your level limit. Please reduce the amount or upgrade your activation level.
**When**: Investment exceeds level maximum
**Action**: Reduce amount or upgrade level

#### Pool Full
**Message**: 🏊 This pool is full or closed. Please wait for the next pool to open or try a different pool.
**When**: Pool has reached capacity
**Action**: Wait for new pool or try another

### 4. Trading Errors

#### Insufficient USDT
**Message**: 💰 Not enough USDT to complete this purchase. Please add more USDT to your wallet.
**When**: Not enough USDT to buy ST tokens
**Action**: Add USDT to wallet

#### Insufficient ST Tokens
**Message**: 🪙 Not enough ST tokens to sell. Please check your ST token balance.
**When**: Not enough ST tokens to sell
**Action**: Check balance, reduce amount

#### No Liquidity
**Message**: 💧 Not enough liquidity available. Please try a smaller amount or wait for more liquidity.
**When**: Insufficient liquidity in pool
**Action**: Reduce amount or wait

### 5. Registration Errors

#### Already Registered
**Message**: ✅ You are already registered! You can proceed to activate your account.
**When**: User tries to register again
**Action**: Proceed to activation

#### Invalid Referral Code
**Message**: ❌ Invalid referral code. Please check the code or use "ADMIN" as the default referral code.
**When**: Referral code doesn't exist
**Action**: Verify code or use "ADMIN"

#### Referrer Not Found
**Message**: ❌ Referrer not found. Please verify the referral code or contact the person who referred you.
**When**: Referrer address invalid
**Action**: Contact referrer or use valid code

### 6. Claim Errors

#### Nothing to Claim
**Message**: 💰 You don't have any rewards to claim yet. Keep investing and earning!
**When**: No claimable rewards available
**Action**: Wait for ROI to accumulate

#### Too Soon
**Message**: ⏰ Please wait a bit longer before claiming again. ROI accumulates daily.
**When**: Trying to claim too frequently
**Action**: Wait for next claim period

### 7. Network Errors

#### Wrong Network
**Message**: 🌐 Wrong network detected. Please switch to BSC Testnet (Chain ID: 97) in your wallet.
**When**: User on wrong blockchain network
**Action**: Switch to BSC Testnet

#### Connection Issue
**Message**: 📡 Network connection issue. Please check your internet connection and try again.
**When**: Network connectivity problems
**Action**: Check internet, retry

#### Contract Not Found
**Message**: 🔍 Contract not found. Please make sure you are on BSC Testnet (Chain ID: 97).
**When**: Contract not found on current network
**Action**: Switch to correct network

### 8. Profile Errors

#### Already Completed
**Message**: ✅ Your profile is already complete! You can update it anytime from the profile page.
**When**: Profile already completed
**Action**: Go to profile page to update

#### Invalid Email
**Message**: 📧 Please enter a valid email address.
**When**: Email format invalid
**Action**: Enter valid email

#### Invalid Phone
**Message**: 📱 Please enter a valid mobile number.
**When**: Phone number format invalid
**Action**: Enter valid phone number

## Toast Notification Types

### Success (Green)
- ✅ Icon
- 4 second duration
- Used for: Successful transactions, completions

### Error (Red)
- ❌ Icon
- 6 second duration (longer to read)
- Used for: Failed transactions, validation errors

### Info (Blue)
- ℹ️ Icon
- 4 second duration
- Used for: General information, tips

### Warning (Yellow)
- ⚠️ Icon
- 5 second duration
- Used for: Warnings, cautions

## Best Practices

### DO ✅
- Use emojis for visual clarity
- Provide clear next steps
- Be encouraging and positive
- Keep messages concise but complete
- Use familiar language
- Offer solutions, not just problems

### DON'T ❌
- Use technical jargon
- Blame the user
- Be vague or unclear
- Use all caps (except for emphasis)
- Make messages too long
- Leave users confused about next steps

## Error Message Template

```
[Emoji] [Clear description of what happened]. [What the user should do next].
```

**Example**:
```
💰 Not enough USDT in your wallet. Please add more USDT and try again.
```

## Common User Scenarios

### Scenario 1: First-Time User
**Problem**: Trying to invest without activation
**Message**: 🔒 Please activate your account first. Go to the activation page to get started!
**Result**: User knows exactly what to do next

### Scenario 2: Insufficient Funds
**Problem**: Not enough USDT for transaction
**Message**: 💰 You need USDT to activate your account. Level 0 requires 10 USDT. Please add USDT to your wallet and try again.
**Result**: User knows how much they need and what to do

### Scenario 3: Wrong Network
**Problem**: User on Ethereum instead of BSC
**Message**: 🌐 Wrong network detected. Please switch to BSC Testnet (Chain ID: 97) in your wallet.
**Result**: User knows exactly which network to switch to

### Scenario 4: Transaction Cancelled
**Problem**: User rejected transaction
**Message**: ❌ Transaction cancelled. No worries, you can try again anytime!
**Result**: User feels reassured and can retry

## Testing Error Messages

### Checklist
- [ ] Message is clear and understandable
- [ ] Emoji is appropriate and helpful
- [ ] Action steps are provided
- [ ] Language is friendly and encouraging
- [ ] No technical jargon
- [ ] Message length is appropriate
- [ ] Toast duration is suitable
- [ ] User knows what to do next

## Updating Error Messages

When adding new error messages:

1. **Identify the error** - What went wrong?
2. **Choose appropriate emoji** - Visual indicator
3. **Write clear description** - What happened?
4. **Provide solution** - What should user do?
5. **Test with users** - Is it clear?
6. **Update this guide** - Document the message

## Error Message Examples

### Good ✅
```
💰 Not enough USDT for activation. Level 0 requires 10 USDT. Please add USDT to your wallet.
```
- Clear problem
- Specific amount needed
- Clear action

### Bad ❌
```
Error: Insufficient funds
```
- Too vague
- No solution
- Technical language

### Good ✅
```
🔐 Please approve USDT spending first. Click "Approve" when prompted by your wallet, then try activating again.
```
- Clear problem
- Step-by-step solution
- Encouraging

### Bad ❌
```
ERC20: insufficient allowance
```
- Technical jargon
- No solution
- Confusing

## Support Integration

All error messages should:
1. Help users self-solve when possible
2. Provide clear next steps
3. Include contact support option for persistent issues
4. Log errors for support team review

**Example**:
```
❌ Transaction failed. Quick fixes: 1) Check your wallet balance, 2) Approve tokens if needed, 3) Ensure you have BNB for gas. Contact support if the issue persists.
```

---

**Remember**: Good error messages turn frustration into action!
