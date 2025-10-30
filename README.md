# Speed Track - Web3 Racing Finance

A Next.js application with Tailwind CSS for blockchain-based investment racing pools.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Landing page
│   ├── profile/
│   │   └── page.tsx        # Profile page
│   ├── dashboard/
│   │   └── page.tsx        # Dashboard page
│   ├── wallet/
│   │   └── page.tsx        # Wallet page
│   └── globals.css         # Global styles with Tailwind
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── IconCircle.tsx
│   │   ├── StatCard.tsx
│   │   ├── FeatureCard.tsx
│   │   └── TransactionCard.tsx
│   ├── layout/             # Layout components
│   │   ├── Header.tsx
│   │   └── BottomNav.tsx
│   ├── sections/           # Page sections
│   │   ├── Hero.tsx
│   │   ├── Stats.tsx
│   │   ├── PoolFlow.tsx
│   │   ├── About.tsx
│   │   ├── Blockchain.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── JoinNow.tsx
│   │   ├── PoolProgress.tsx
│   │   ├── DailyRewardTimer.tsx
│   │   ├── ReferralProgram.tsx
│   │   └── profile/
│   │       ├── ProfileHeader.tsx
│   │       ├── PersonalInfo.tsx
│   │       ├── WalletInfo.tsx
│   │       ├── AccountPreferences.tsx
│   │       └── AccountActions.tsx
│   └── modals/             # Modal components
│       ├── SuccessModal.tsx
│       ├── QRModal.tsx
│       └── PasswordModal.tsx
└── lib/                    # Utility functions
    ├── utils.ts
    ├── contracts.ts
    └── toast.ts
```

## Pages

- `/` - Landing page with hero, stats, and features
- `/profile` - User profile management
- `/dashboard` - User dashboard (coming soon)
- `/wallet` - Wallet management (coming soon)

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Font Awesome Icons
- Google Fonts (Orbitron, Poppins)

## Build

```bash
npm run build
npm start
```
