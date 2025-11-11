# Navigation & Flow Quick Guide

## Current User Flow Behavior

### Landing Page (/)
- **All users can browse freely** - no forced redirects
- Shows appropriate floating banners based on user state
- Registration modal only appears for non-registered users

### Activation Page (/activate)
- Accessible to registered but not activated users
- Shows activation level selection
- After activation → Profile Complete Modal appears
- Already activated users → Auto-redirected to dashboard

### Dashboard (/dashboard)
- Protected by FlowGuard
- Requires: Connected wallet + Registered + Activated
- Profile completion is optional for dashboard access

## Button Behaviors

### "Join Now" Button (Landing Page)
| User State | Button Text | Action |
|------------|-------------|--------|
| Not connected | "Join the Race Now" | Connect wallet |
| Connected, not registered | "Register Now" | Show registration modal |
| Registered, not activated | "Activate Your Account" | Go to /activate |
| Activated | "Go to Dashboard" | Go to /dashboard |

### Floating Banners (Landing Page)
| User State | Banner | Action |
|------------|--------|--------|
| Registered, not activated | "Registration Complete! Activate Now →" | Go to /activate |
| Activated | "Activation Complete! Go to Dashboard →" | Go to /dashboard |

## Navigation Paths

### Path 1: New User
```
Landing Page → Connect Wallet → Registration Modal → 
/activate → Activation → Profile Modal → /dashboard
```

### Path 2: Registered User
```
Landing Page → Connect Wallet → See "Activate Now" banner → 
/activate → Activation → Profile Modal → /dashboard
```

### Path 3: Activated User
```
Landing Page → Connect Wallet → See "Go to Dashboard" banner → 
/dashboard (or browse landing page freely)
```

## Key Features

✅ **No Forced Redirects** - Users control their navigation
✅ **Smart Button States** - Buttons adapt to user status
✅ **Clear Visual Cues** - Floating banners guide next steps
✅ **Protected Routes** - Dashboard requires full activation
✅ **Flexible Profile** - Profile completion is optional

## Troubleshooting

### "I'm activated but still see activation button"
- Clear browser cache and refresh
- Disconnect and reconnect wallet
- Check that transaction was confirmed on blockchain

### "Can't access dashboard"
- Ensure wallet is connected
- Verify account is registered (check getUserId)
- Verify account is activated (check activation level > 0)
- Check you're on correct network

### "Stuck in registration loop"
- Check if registration transaction was confirmed
- Verify referral code is valid
- Ensure USDT approval went through
- Check console logs for specific errors
