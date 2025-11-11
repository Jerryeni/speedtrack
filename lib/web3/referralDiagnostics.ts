import { ethers } from 'ethers';
import { getSpeedTrackReadOnly } from './contracts';

/**
 * Comprehensive referral diagnostics
 * This will help us understand exactly what's happening with referral counting
 */

export async function diagnoseReferrals(userAddress: string) {
  console.log('=== REFERRAL DIAGNOSTICS START ===');
  console.log('User Address:', userAddress);
  
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    const contractAddress = await speedTrack.getAddress();
    console.log('Contract Address:', contractAddress);
    
    // 1. Get user info
    console.log('\n1. Getting user info...');
    const userInfo = await speedTrack.getUserInfo(userAddress);
    console.log('User Info:', {
      name: userInfo.name,
      email: userInfo.email,
      uid: userInfo.uid.toString(),
      referrer: userInfo.referrer,
      referrerType: userInfo.referrerType,
      isRootLeader: userInfo.isRootLeader
    });
    
    // 2. Try to query SponsorRegistered events where this user is the referrer
    console.log('\n2. Querying SponsorRegistered events (user as referrer)...');
    try {
      // Method 1: Filter with user as referrer (indexed parameter 2)
      const filter1 = speedTrack.filters.SponsorRegistered(null, userAddress);
      console.log('Filter 1 (null, userAddress):', filter1);
      
      const events1 = await speedTrack.queryFilter(filter1);
      console.log(`Found ${events1.length} events with filter 1`);
      
      if (events1.length > 0) {
        console.log('Sample event:', events1[0]);
        events1.forEach((event, index) => {
          const eventLog = event as ethers.EventLog;
          console.log(`Event ${index + 1}:`, {
            user: eventLog.args?.user,
            referrer: eventLog.args?.referrer,
            refType: eventLog.args?.refType,
            referralCode: eventLog.args?.referralCode,
            blockNumber: event.blockNumber
          });
        });
      }
    } catch (error) {
      console.error('Error querying events method 1:', error);
    }
    
    // 3. Try querying ALL SponsorRegistered events and filter manually
    console.log('\n3. Querying ALL SponsorRegistered events...');
    try {
      const filterAll = speedTrack.filters.SponsorRegistered();
      const allEvents = await speedTrack.queryFilter(filterAll);
      console.log(`Total SponsorRegistered events: ${allEvents.length}`);
      
      // Filter manually for this user as referrer
      const userReferrals = allEvents.filter(event => {
        const eventLog = event as ethers.EventLog;
        return eventLog.args?.referrer?.toLowerCase() === userAddress.toLowerCase();
      });
      
      console.log(`Events where user is referrer: ${userReferrals.length}`);
      
      if (userReferrals.length > 0) {
        console.log('User referrals:');
        userReferrals.forEach((event, index) => {
          const eventLog = event as ethers.EventLog;
          console.log(`Referral ${index + 1}:`, {
            referredUser: eventLog.args?.user,
            referrer: eventLog.args?.referrer,
            refType: eventLog.args?.refType?.toString(),
            referralCode: eventLog.args?.referralCode,
            blockNumber: event.blockNumber
          });
        });
        
        // Count unique referred users
        const uniqueUsers = new Set<string>();
        userReferrals.forEach(event => {
          const eventLog = event as ethers.EventLog;
          if (eventLog.args?.user) {
            uniqueUsers.add(eventLog.args.user.toLowerCase());
          }
        });
        console.log(`Unique referred users: ${uniqueUsers.size}`);
        console.log('Unique users list:', Array.from(uniqueUsers));
      }
    } catch (error) {
      console.error('Error querying all events:', error);
    }
    
    // 4. Check if there's a direct referrals mapping we can access
    console.log('\n4. Checking for direct referrals mapping...');
    try {
      // Some contracts have a referrals(address, uint) mapping
      // Try to access it if it exists
      if (typeof (speedTrack as any).referrals === 'function') {
        console.log('Found referrals function, trying to access...');
        for (let i = 0; i < 10; i++) {
          try {
            const referral = await (speedTrack as any).referrals(userAddress, i);
            console.log(`Referral ${i}:`, referral);
          } catch {
            console.log(`No referral at index ${i}`);
            break;
          }
        }
      } else {
        console.log('No referrals mapping function found');
      }
    } catch (error) {
      console.error('Error checking referrals mapping:', error);
    }
    
    // 5. Check contract interface for any referral-related functions
    console.log('\n5. Contract interface functions:');
    const fragments = speedTrack.interface.fragments;
    const referralFunctions = fragments.filter(f => {
      if (f.type === 'function') {
        const funcFragment = f as ethers.FunctionFragment;
        const name = funcFragment.name.toLowerCase();
        return name.includes('referral') || name.includes('downline') || name.includes('team');
      }
      return false;
    });
    console.log('Referral-related functions:', referralFunctions.map(f => (f as ethers.FunctionFragment).name));
    
    console.log('\n=== REFERRAL DIAGNOSTICS END ===');
    
    return {
      success: true,
      userInfo,
      message: 'Diagnostics complete - check console for details'
    };
    
  } catch (error: any) {
    console.error('=== REFERRAL DIAGNOSTICS FAILED ===');
    console.error('Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get referral count using the most reliable method
 */
export async function getActualReferralCount(userAddress: string): Promise<number> {
  try {
    const speedTrack = await getSpeedTrackReadOnly();
    
    // Query ALL SponsorRegistered events
    const filterAll = speedTrack.filters.SponsorRegistered();
    const allEvents = await speedTrack.queryFilter(filterAll);
    
    // Filter for this user as referrer
    const userReferrals = allEvents.filter(event => {
      const eventLog = event as ethers.EventLog;
      return eventLog.args?.referrer?.toLowerCase() === userAddress.toLowerCase();
    });
    
    // Count unique referred users
    const uniqueUsers = new Set<string>();
    userReferrals.forEach(event => {
      const eventLog = event as ethers.EventLog;
      if (eventLog.args?.user) {
        uniqueUsers.add(eventLog.args.user.toLowerCase());
      }
    });
    
    console.log(`Actual referral count for ${userAddress}: ${uniqueUsers.size}`);
    return uniqueUsers.size;
    
  } catch (error) {
    console.error('Error getting actual referral count:', error);
    return 0;
  }
}
