# User Flow Enforcement System ✅

## Overview
Implemented a comprehensive user onboarding flow enforcement system that ensures users complete all required steps before accessing protected features.

## User Flow Steps

### Required Flow Sequence:
1. **Connect Wallet** - User connects MetaMask/Web3 wallet
2. **Register Account** - User registers with referral code
3. **Activate Account** - User pays activation fee
4. **Complete Profile** - User fills in personal information
5. **Access Dashboard** - Full platform access granted

## Implementation

### Core Components

#### 1. `useUserFlow` Hook
**Location**: `lib/hooks/useUserFlow.ts`

Manages and tracks user flow state:

```typescript
const {
  isConnected,
  isRegistered,
  isActivated,
  isProfileComplete,
  canAccessDashboard,
  currentStep,
  enforceFlow,
  getStepMessage,
  getNextAction
} = useUserFlow();
```

**Features:**
- Automatically checks user status
- Determines current step in flow
- Provides enforcement methods
- Returns user-friendly messages

#### 2. `FlowGuard` Component
**Location**: `components/guards/FlowGuard.tsx`

Guard component that blocks access and redirects:

```typescript
<FlowGuard requireComplete={true}>
  <YourProtectedContent />
</FlowGuard>
```

**Features:**
- Shows loading state while checking
- Displays blocked state with progress
- Auto-redirects to appropriate step
- Shows checklist of completed steps

#### 3. `ProtectedPage` Component
**Location**: `components/guards/ProtectedPage.tsx`

Convenient wrapper for protected pages:

```typescript
export default function YourPage() {
  return (
    <ProtectedPage>
      <YourPageContent />
    </ProtectedPage>
  );
}
```

### Protected Pages

Pages that require complete flow:

✅ **Dashboard** (`/dashboard`)
- Main user dashboard
- Requires all steps complete

✅ **Trade** (`/trade`)
- ST token trading
- Requires all steps complete

✅ **Referral** (`/referral`)
- Referral management
- Requires all steps complete

✅ **Income** (`/income`)
- Income tracking
- Requires all steps complete

✅ **Profile** (`/profile`)
- Profile management
- Requires all steps complete

✅ **Withdraw** (`/withdraw`)
- Withdrawal functionality
- Requires all steps complete

✅ **Transactions** (`/transactions`)
- Transaction history
- Requires all steps complete

✅ **Stats** (`/stats`)
- Platform statistics
- Requires all steps complete

### Public Pages

Pages accessible without complete flow:

✅ **Home** (`/`)
- Landing page
- Public access

✅ **Ref** (`/ref/[code]`)
- Referral registration
- Public access

✅ **Share** (`/share`)
- Share links
- Public access

## Flow Enforcement Logic

### Step 1: Connect Wallet
```typescript
if (!isConnected) {
  // Redirect to home page
  router.push('/');
}
```

### Step 2: Register Account
```typescript
if (!isRegistered) {
  // Show registration modal
  router.push('/?register=true');
}
```

### Step 3: Activate Account
```typescript
if (!isActivated) {
  // Show activation modal
  router.push('/?activate=true');
}
```

### Step 4: Complete Profile
```typescript
if (!isProfileComplete) {
  // Show profile completion modal
  router.push('/?complete-profile=true');
}
```

### Step 5: Access Granted
```typescript
if (canAccessDashboard) {
  // Allow access to all features
}
```

## URL Parameters

The system uses URL parameters to trigger appropriate modals:

- `/?register=true` - Opens registration modal
- `/?activate=true` - Opens activation modal
- `/?complete-profile=true` - Opens profile completion modal

## User Experience

### Blocked Access Screen

When users try to access protected pages without completing the flow:

```
┌─────────────────────────────────────┐
│         🔒 Access Restricted        │
│                                     │
│  Please complete your profile to   │
│  access dashboard                   │
│                                     │
│  Complete These Steps:              │
│  ✓ Connect Wallet                   │
│  ✓ Register Account                 │
│  ✓ Activate Account                 │
│  ○ Complete Profile                 │
│                                     │
│  [Complete Profile Button]          │
└─────────────────────────────────────┘
```

### Progress Indicators

- ✓ Green checkmark - Step completed
- ○ Gray circle - Step pending
- Current step highlighted
- Clear call-to-action button

## Implementation Examples

### Protecting a New Page

```typescript
// app/your-page/page.tsx
"use client";

import ProtectedPage from "@/components/guards/ProtectedPage";

export default function YourPage() {
  return (
    <ProtectedPage>
      <YourPageContent />
    </ProtectedPage>
  );
}

function YourPageContent() {
  // Your page content here
  return <div>Protected Content</div>;
}
```

### Using Flow State in Components

```typescript
import { useUserFlow } from "@/lib/hooks/useUserFlow";

function MyComponent() {
  const flow = useUserFlow();

  if (!flow.isActivated) {
    return <div>Please activate your account</div>;
  }

  return <div>Welcome!</div>;
}
```

### Custom Flow Enforcement

```typescript
import { useUserFlow } from "@/lib/hooks/useUserFlow";

function MyComponent() {
  const { enforceFlow } = useUserFlow();

  const handleAction = () => {
    if (!enforceFlow()) {
      // User will be redirected
      return;
    }
    
    // Proceed with action
    performAction();
  };

  return <button onClick={handleAction}>Do Action</button>;
}
```

## Benefits

### 1. Security
- Prevents unauthorized access
- Ensures proper onboarding
- Validates user state

### 2. User Experience
- Clear progress indication
- Helpful error messages
- Smooth flow transitions

### 3. Data Integrity
- Ensures complete user profiles
- Validates activation status
- Prevents incomplete registrations

### 4. Maintainability
- Centralized flow logic
- Reusable components
- Easy to extend

## Testing Checklist

- [x] Unconnected wallet redirects to home
- [x] Unregistered user sees registration modal
- [x] Unactivated user sees activation modal
- [x] Incomplete profile sees profile modal
- [x] Complete flow grants dashboard access
- [x] Protected pages block incomplete users
- [x] Public pages remain accessible
- [x] URL parameters trigger correct modals
- [x] Progress indicators show correctly
- [x] Redirects work properly

## Troubleshooting

### User Stuck in Flow

**Issue**: User completed step but still blocked

**Solution**:
1. Check wallet connection
2. Verify transaction confirmed
3. Refresh page to re-check status
4. Check browser console for errors

### Modal Not Showing

**Issue**: URL parameter present but modal doesn't open

**Solution**:
1. Check modal component imports
2. Verify searchParams usage
3. Check modal state management
4. Ensure modal components exist

### Infinite Redirect Loop

**Issue**: Page keeps redirecting

**Solution**:
1. Check flow state logic
2. Verify all conditions
3. Check for conflicting redirects
4. Review useEffect dependencies

## Future Enhancements

- [ ] Add email verification step
- [ ] Add KYC verification option
- [ ] Add 2FA setup step
- [ ] Add tutorial/onboarding tour
- [ ] Add progress persistence
- [ ] Add step skip options (for testing)
- [ ] Add admin override capability
- [ ] Add flow analytics tracking

## Related Files

- `lib/hooks/useUserFlow.ts` - Flow state management
- `components/guards/FlowGuard.tsx` - Guard component
- `components/guards/ProtectedPage.tsx` - Page wrapper
- `app/page.tsx` - Home with modal handling
- `app/dashboard/page.tsx` - Protected dashboard
- `app/trade/page.tsx` - Protected trade page
- `components/modals/RegistrationModal.tsx` - Registration
- `components/modals/ActivationModal.tsx` - Activation
- `components/modals/ProfileCompleteModal.tsx` - Profile

## Summary

The user flow enforcement system ensures a smooth, secure onboarding process by:

1. **Tracking** user progress through required steps
2. **Blocking** access to protected features until flow complete
3. **Guiding** users to next required action
4. **Providing** clear feedback and progress indicators
5. **Maintaining** security and data integrity

All protected pages now require users to complete the full flow: Connect → Register → Activate → Complete Profile → Access Dashboard.
