# Statistics System - Quick Reference

## 🚀 Quick Start

### View Statistics Page
```
Navigate to: /stats
```

### Add to Dashboard
```tsx
import StatsQuickView from "@/components/sections/stats/StatsQuickView";
import MiniActivityFeed from "@/components/sections/stats/MiniActivityFeed";

<StatsQuickView />
<MiniActivityFeed />
```

## 📊 Components

| Component | Purpose | Size |
|-----------|---------|------|
| `PlatformStatsDashboard` | Full stats dashboard | Large |
| `StatsQuickView` | Stats summary card | Medium |
| `LiveActivityFeed` | Real-time events | Large |
| `MiniActivityFeed` | Recent events | Small |

## 🎣 Hooks

### usePlatformStats
```tsx
const { stats, isLoading, error, refresh } = usePlatformStats();

// Access data
stats.totalUsers
stats.totalInvested
stats.totalROIPaid
stats.totalLevelIncome
stats.totalCapitalReturned
stats.totalSTDistributed
stats.activePools
stats.totalActivations
```

### useRealtimeEvents
```tsx
const { events, isListening, error, clearEvents } = useRealtimeEvents(true);

// Event properties
event.type          // 'InvestmentMade', 'ROIClaimed', etc.
event.user          // User address
event.amount        // Amount in USDT
event.timestamp     // Unix timestamp
event.transactionHash
```

## 📈 Available Statistics

### User Stats
- `totalUsers` - Total registered users
- `totalActivations` - Number of activations

### Financial Stats
- `totalInvested` - Total USDT invested
- `totalROIPaid` - Total ROI distributed
- `totalLevelIncome` - Total referral income
- `totalCapitalReturned` - Total capital returned
- `totalSTDistributed` - Total ST tokens

### Pool Stats
- `activePools` - Number of active pools

## 🎯 Event Types

| Event | Description |
|-------|-------------|
| `UserRegistered` | New user signup |
| `AccountActivated` | Account activation |
| `InvestmentMade` | Pool investment |
| `ROIClaimed` | ROI withdrawal |
| `LevelIncomeReceived` | Referral income |
| `CapitalReturned` | Capital return |
| `STTokensReceived` | ST token reward |
| `PoolOpened` | New pool created |
| `PoolFilled` | Pool completed |

## ⚡ Performance

- **Cache Duration**: 5 minutes
- **Max Events**: 50 (real-time feed)
- **Auto-refresh**: Every 5 minutes
- **Parallel Fetching**: Yes

## 🔧 Common Tasks

### Force Refresh Stats
```tsx
const { refresh } = usePlatformStats();
refresh(); // Force immediate refresh
```

### Clear Event History
```tsx
const { clearEvents } = useRealtimeEvents();
clearEvents(); // Clear all events
```

### Pause Event Monitoring
```tsx
const { events } = useRealtimeEvents(false); // Disabled
```

### Custom Stats Display
```tsx
const { stats } = usePlatformStats();

<div>
  <h2>{stats?.totalUsers} Users</h2>
  <p>${stats?.totalInvested} Invested</p>
</div>
```

## 📱 Pages

- `/stats` - Full statistics dashboard
- `/admin` - Admin panel (includes stats)

## 🎨 Styling

All components use:
- Gradient backgrounds
- Neon blue/purple theme
- Responsive design
- Smooth animations
- Custom scrollbars

## 🐛 Troubleshooting

### Stats not loading?
1. Check wallet connection
2. Verify BSC Testnet (Chain ID: 97)
3. Check browser console
4. Try manual refresh

### Events not appearing?
1. Ensure monitoring is enabled
2. Check for blockchain transactions
3. Verify contract address
4. Wait for block confirmation

## 📚 Full Documentation

See `STATISTICS_SYSTEM.md` for complete documentation.
