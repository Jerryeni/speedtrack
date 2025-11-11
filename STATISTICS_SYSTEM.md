# Platform Statistics & Event Tracking System

## Overview

A comprehensive real-time statistics and event tracking system that aggregates blockchain data to display platform-wide metrics and live activity feeds.

## Features

### 1. Platform Statistics Dashboard
- **Total Users**: Count of registered users
- **Activations**: Number of account activations
- **Active Pools**: Number of pools with investments
- **Total Invested**: Aggregate USDT invested across all pools
- **Total Paid Out**: Sum of ROI, level income, and capital returns
- **ROI Distributed**: Total ROI claimed by users
- **Level Income**: Total referral income distributed
- **Capital Returned**: Total capital returned to investors
- **ST Tokens**: Total ST tokens distributed as rewards

### 2. Real-Time Event Monitoring
Live blockchain event tracking for:
- User registrations
- Account activations
- Pool investments
- ROI claims
- Level income distributions
- Capital returns
- ST token distributions
- Pool openings and completions

### 3. Platform Health Metrics
- **Activation Rate**: Percentage of registered users who activated
- **Payout Ratio**: Total paid out vs total invested
- **Average Investment**: Per-user investment average
- **Pools per User**: Average pool participation

## Components

### Core Components

#### `PlatformStatsDashboard`
Location: `components/sections/stats/PlatformStatsDashboard.tsx`

Full-featured statistics dashboard with:
- Comprehensive stat cards
- Platform health indicators
- Auto-refresh capability
- Compact mode option

```tsx
import PlatformStatsDashboard from "@/components/sections/stats/PlatformStatsDashboard";

<PlatformStatsDashboard showHeader={true} compact={false} />
```

#### `LiveActivityFeed`
Location: `components/sections/stats/LiveActivityFeed.tsx`

Real-time event feed showing:
- Live blockchain events as they occur
- Event details with transaction links
- Pause/resume controls
- Configurable max items

```tsx
import LiveActivityFeed from "@/components/sections/stats/LiveActivityFeed";

<LiveActivityFeed maxItems={20} showHeader={true} compact={false} />
```

#### `StatsQuickView`
Location: `components/sections/stats/StatsQuickView.tsx`

Compact statistics widget for dashboard:
- Key metrics at a glance
- Platform health indicator
- Link to full stats page

```tsx
import StatsQuickView from "@/components/sections/stats/StatsQuickView";

<StatsQuickView />
```

#### `MiniActivityFeed`
Location: `components/sections/stats/MiniActivityFeed.tsx`

Compact activity feed for dashboard:
- Last 5 events
- Live status indicator
- Link to full stats page

```tsx
import MiniActivityFeed from "@/components/sections/stats/MiniActivityFeed";

<MiniActivityFeed />
```

## Hooks

### `usePlatformStats`
Location: `lib/web3/hooks/usePlatformStats.ts`

React hook for accessing platform statistics:

```tsx
const { stats, isLoading, error, refresh } = usePlatformStats(autoRefresh);
```

**Parameters:**
- `autoRefresh` (boolean): Auto-refresh every 5 minutes (default: true)

**Returns:**
- `stats`: PlatformStatistics object
- `isLoading`: Loading state
- `error`: Error message if any
- `refresh`: Function to manually refresh stats

### `useRealtimeEvents`
Location: `lib/web3/hooks/useRealtimeEvents.ts`

React hook for real-time event monitoring:

```tsx
const { events, isListening, error, clearEvents } = useRealtimeEvents(enabled);
```

**Parameters:**
- `enabled` (boolean): Enable/disable event listening (default: true)

**Returns:**
- `events`: Array of recent events (max 50)
- `isListening`: Listening state
- `error`: Error message if any
- `clearEvents`: Function to clear event history

## Core Functions

### Event Fetching

#### `getUserRegistrationEvents(fromBlock)`
Fetches all user registration events from the blockchain.

#### `getActivationEvents(fromBlock)`
Fetches all account activation events.

#### `getInvestmentEvents(fromBlock)`
Fetches all investment events.

#### `getROIClaimedEvents(fromBlock)`
Fetches all ROI claim events.

#### `getLevelIncomeEvents(fromBlock)`
Fetches all level income distribution events.

#### `getCapitalReturnedEvents(fromBlock)`
Fetches all capital return events.

#### `getSTTokensReceivedEvents(fromBlock)`
Fetches all ST token distribution events.

### Statistics Calculation

#### `calculatePlatformStatistics(fromBlock)`
Aggregates all events to calculate platform-wide statistics.

```typescript
const stats = await calculatePlatformStatistics(0);
```

#### `getPlatformStatistics(forceRefresh)`
Gets platform statistics with caching (5-minute cache).

```typescript
const stats = await getPlatformStatistics(false);
```

#### `clearStatisticsCache()`
Clears the statistics cache to force fresh data fetch.

### User-Specific Queries

#### `getUserEvents(userAddress, fromBlock)`
Gets all events for a specific user.

```typescript
const events = await getUserEvents('0x...', 0);
```

#### `getUserEventCount(userAddress)`
Gets the total event count for a user.

```typescript
const count = await getUserEventCount('0x...');
```

## Pages

### Statistics Page
Location: `app/stats/page.tsx`

Full statistics dashboard page featuring:
- Complete platform statistics
- Time range selector (24h, 7d, 30d, all time)
- Key insights section
- Live activity feed
- Platform health metrics

Access: `/stats`

## Data Types

### PlatformStatistics
```typescript
interface PlatformStatistics {
  totalUsers: number;
  totalActivations: number;
  totalInvested: string;
  totalROIPaid: string;
  totalLevelIncome: string;
  totalCapitalReturned: string;
  totalSTDistributed: string;
  activePools: number;
  lastUpdated: number;
}
```

### RealtimeEvent
```typescript
interface RealtimeEvent {
  type: string;
  user?: string;
  amount?: string;
  poolIndex?: number;
  level?: number;
  timestamp: number;
  blockNumber: number;
  transactionHash: string;
}
```

## Performance Optimization

### Caching Strategy
- Statistics are cached for 5 minutes
- Reduces RPC calls to blockchain
- Manual refresh available when needed

### Event Limiting
- Real-time events limited to last 50
- Prevents memory issues with long-running sessions
- Configurable max items in components

### Parallel Fetching
- All event types fetched in parallel
- Reduces total loading time
- Uses Promise.all for efficiency

## Usage Examples

### Adding Stats to Dashboard

```tsx
import StatsQuickView from "@/components/sections/stats/StatsQuickView";
import MiniActivityFeed from "@/components/sections/stats/MiniActivityFeed";

export default function Dashboard() {
  return (
    <div>
      <StatsQuickView />
      <MiniActivityFeed />
    </div>
  );
}
```

### Creating Custom Stats Display

```tsx
import { usePlatformStats } from "@/lib/web3/hooks/usePlatformStats";

export default function CustomStats() {
  const { stats, isLoading, refresh } = usePlatformStats();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Total Users: {stats?.totalUsers}</h2>
      <h2>Total Invested: ${stats?.totalInvested}</h2>
      <button onClick={() => refresh()}>Refresh</button>
    </div>
  );
}
```

### Monitoring Specific Events

```tsx
import { useRealtimeEvents } from "@/lib/web3/hooks/useRealtimeEvents";

export default function EventMonitor() {
  const { events, isListening } = useRealtimeEvents(true);

  const investments = events.filter(e => e.type === 'InvestmentMade');

  return (
    <div>
      <p>Status: {isListening ? 'Listening' : 'Paused'}</p>
      <p>Recent Investments: {investments.length}</p>
    </div>
  );
}
```

## Blockchain Events Tracked

All events are defined in the SpeedTrack smart contract:

- `SponsorRegistered`: User registration
- `Activated`: Account activation
- `InvestmentMade`: Pool investment
- `ROIClaimed`: ROI withdrawal
- `LevelIncomeReceived`: Referral income
- `CapitalReturned`: Capital return
- `STTokensReceived`: ST token distribution
- `PoolOpened`: New pool creation
- `PoolFilled`: Pool completion

## Network Configuration

- **Network**: BSC Testnet
- **Chain ID**: 97
- **Block Explorer**: https://testnet.bscscan.com
- **RPC Endpoint**: Configured in Web3Context

## Best Practices

1. **Use Caching**: Don't force refresh unless necessary
2. **Limit Event History**: Keep event arrays manageable
3. **Handle Errors**: Always check for error states
4. **Show Loading States**: Provide feedback during data fetching
5. **Optimize Renders**: Use React.memo for expensive components
6. **Clean Up Listeners**: Ensure event listeners are removed on unmount

## Troubleshooting

### Stats Not Loading
- Check wallet connection
- Verify correct network (BSC Testnet)
- Check RPC endpoint availability
- Clear cache and refresh

### Events Not Appearing
- Ensure event listening is enabled
- Check browser console for errors
- Verify contract address is correct
- Test with a known transaction

### Performance Issues
- Reduce max events displayed
- Disable auto-refresh if not needed
- Use compact mode for components
- Clear event history periodically

## Future Enhancements

- Historical data charts
- Export statistics to CSV
- Email/notification alerts for events
- Advanced filtering and search
- User-specific statistics dashboard
- Comparative analytics (day/week/month)
- Pool performance metrics
- Referral network visualization

## Related Files

- `lib/web3/events.ts` - Core event tracking logic
- `lib/web3/hooks/usePlatformStats.ts` - Statistics hook
- `lib/web3/hooks/useRealtimeEvents.ts` - Real-time events hook
- `components/sections/stats/*` - Statistics components
- `app/stats/page.tsx` - Statistics page
- `app/admin/page.tsx` - Admin panel with stats

## Support

For issues or questions about the statistics system:
1. Check this documentation
2. Review component source code
3. Check browser console for errors
4. Verify blockchain connection
5. Test with sample transactions
