# Environment Configuration Guide

## Overview

The application uses environment variables to configure contract addresses and network settings. This allows you to easily switch between different deployments without changing code.

## Files

### `.env.local` (Your Local Configuration)
This file contains your actual configuration and should **NEVER** be committed to git. It's already in `.gitignore`.

### `.env.local.example` (Template)
This is a template showing what variables are needed. Copy this to create your `.env.local`.

## Setup Instructions

### 1. Create Your Environment File

```bash
cp .env.local.example .env.local
```

### 2. Update Contract Addresses

Open `.env.local` and update the contract addresses with your deployed contracts:

```env
# Your SpeedTrack main contract address
NEXT_PUBLIC_SPEEDTRACK_ADDRESS=0xYourSpeedTrackAddress

# Your ST Token contract address
NEXT_PUBLIC_STTOKEN_ADDRESS=0xYourSTTokenAddress

# USDT contract address (BSC Testnet USDT)
NEXT_PUBLIC_USDT_ADDRESS=0x0D3E80cBc9DDC0a3Fdee912b99C50cd0b5761eE3
```

### 3. Configure WalletConnect (Optional)

If you want to use WalletConnect:

1. Go to https://cloud.walletconnect.com
2. Create a new project
3. Copy your Project ID
4. Update in `.env.local`:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_actual_project_id
```

### 4. Network Configuration

The default configuration is for BSC Testnet:

```env
NEXT_PUBLIC_CHAIN_ID=97
NEXT_PUBLIC_RPC_URL=https://data-seed-prebsc-1-s1.bnbchain.org:8545
NEXT_PUBLIC_BLOCK_EXPLORER=https://testnet.bscscan.com
```

For BSC Mainnet, change to:
```env
NEXT_PUBLIC_CHAIN_ID=56
NEXT_PUBLIC_RPC_URL=https://bsc-dataseed.binance.org
NEXT_PUBLIC_BLOCK_EXPLORER=https://bscscan.com
```

## Current Configuration

The app is currently configured with these addresses (from `.env.local`):

- **SpeedTrack**: `0x5023C1dd28B28e5cFb7CD3462d4680cEd2ee78Da`
- **ST Token**: `0xE2eEc4546145749Ff475A18BF648dE329aBE8d9f`
- **USDT**: `0x0D3E80cBc9DDC0a3Fdee912b99C50cd0b5761eE3`
- **Network**: BSC Testnet (Chain ID: 97)

## How It Works

The configuration is loaded in `lib/web3/config.ts`:

```typescript
export const CONTRACTS = {
  SPEEDTRACK: process.env.NEXT_PUBLIC_SPEEDTRACK_ADDRESS || 'fallback_address',
  STTOKEN: process.env.NEXT_PUBLIC_STTOKEN_ADDRESS || 'fallback_address',
  USDT: process.env.NEXT_PUBLIC_USDT_ADDRESS || 'fallback_address',
};
```

If environment variables are not set, it falls back to the hardcoded addresses.

## Verifying Your Configuration

After updating `.env.local`, restart your development server:

```bash
npm run dev
```

Then check the browser console. You should see the contract addresses being used when you interact with the app.

## Troubleshooting

### Issue: Changes not taking effect
**Solution**: Restart the Next.js dev server. Environment variables are loaded at build time.

### Issue: "Contract not found" errors
**Solution**: 
1. Verify the contract addresses in `.env.local` are correct
2. Check you're on the right network (BSC Testnet)
3. Verify contracts are deployed at those addresses using BSCScan

### Issue: Variables showing as undefined
**Solution**: 
1. Make sure variable names start with `NEXT_PUBLIC_`
2. Restart the dev server after changing `.env.local`
3. Check for typos in variable names

## Security Notes

- ✅ `.env.local` is in `.gitignore` - your config won't be committed
- ✅ Only `NEXT_PUBLIC_*` variables are exposed to the browser
- ✅ Never put private keys or secrets in environment variables
- ✅ Contract addresses are public information, safe to expose

## For Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add environment variables in your hosting platform's dashboard
2. Use the same variable names from `.env.local`
3. Update addresses to mainnet contracts if deploying to mainnet
4. Never commit `.env.local` to your repository

## Quick Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_SPEEDTRACK_ADDRESS` | Main contract | `0x5023...78Da` |
| `NEXT_PUBLIC_STTOKEN_ADDRESS` | ST Token contract | `0xE2ee...8d9f` |
| `NEXT_PUBLIC_USDT_ADDRESS` | USDT contract | `0x0D3E...1eE3` |
| `NEXT_PUBLIC_CHAIN_ID` | Network chain ID | `97` (testnet) or `56` (mainnet) |
| `NEXT_PUBLIC_RPC_URL` | RPC endpoint | BSC RPC URL |
| `NEXT_PUBLIC_BLOCK_EXPLORER` | Block explorer | BSCScan URL |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect ID | From cloud.walletconnect.com |
