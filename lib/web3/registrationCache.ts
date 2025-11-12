/**
 * Registration Cache - Stores user registration state in localStorage
 * This prevents false negatives when contract calls fail
 */

const CACHE_KEY_PREFIX = 'speedtrack_user_';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface UserCache {
  address: string;
  isRegistered: boolean;
  isActivated: boolean;
  profileCompleted: boolean;
  userId: string;
  timestamp: number;
}

/**
 * Save user registration state to cache
 */
export function cacheUserState(
  address: string,
  state: {
    isRegistered: boolean;
    isActivated: boolean;
    profileCompleted: boolean;
    userId: string;
  }
) {
  try {
    const cache: UserCache = {
      address: address.toLowerCase(),
      ...state,
      timestamp: Date.now()
    };
    
    localStorage.setItem(
      `${CACHE_KEY_PREFIX}${address.toLowerCase()}`,
      JSON.stringify(cache)
    );
    
    console.log('✅ Cached user state:', cache);
  } catch (error) {
    console.error('Failed to cache user state:', error);
  }
}

/**
 * Get cached user state
 */
export function getCachedUserState(address: string): UserCache | null {
  try {
    const cached = localStorage.getItem(`${CACHE_KEY_PREFIX}${address.toLowerCase()}`);
    
    if (!cached) {
      return null;
    }
    
    const data: UserCache = JSON.parse(cached);
    
    // Check if cache is expired
    if (Date.now() - data.timestamp > CACHE_EXPIRY) {
      console.log('⚠️ Cache expired, clearing...');
      clearUserCache(address);
      return null;
    }
    
    console.log('✅ Found cached user state:', data);
    return data;
  } catch (error) {
    console.error('Failed to read cached user state:', error);
    return null;
  }
}

/**
 * Clear user cache
 */
export function clearUserCache(address: string) {
  try {
    localStorage.removeItem(`${CACHE_KEY_PREFIX}${address.toLowerCase()}`);
    console.log('✅ Cleared user cache for:', address);
  } catch (error) {
    console.error('Failed to clear user cache:', error);
  }
}

/**
 * Clear all user caches
 */
export function clearAllUserCaches() {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    console.log('✅ Cleared all user caches');
  } catch (error) {
    console.error('Failed to clear all user caches:', error);
  }
}
