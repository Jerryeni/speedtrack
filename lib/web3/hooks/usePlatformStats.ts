import { useState, useEffect } from 'react';
import { getPlatformStatistics, PlatformStatistics } from '../events';

/**
 * React hook for accessing platform-wide statistics
 * Automatically fetches and caches statistics
 */
export function usePlatformStats(autoRefresh: boolean = true) {
  const [stats, setStats] = useState<PlatformStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async (forceRefresh: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getPlatformStatistics(forceRefresh);
      setStats(data);
    } catch (err: any) {
      console.error('Error fetching platform stats:', err);
      setError(err.message || 'Failed to fetch statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    if (autoRefresh) {
      // Refresh every 5 minutes
      const interval = setInterval(() => fetchStats(true), 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  return {
    stats,
    isLoading,
    error,
    refresh: () => fetchStats(true)
  };
}
