"use client";

import { useState, useEffect } from "react";
import { getSpeedTrackReadOnly } from "@/lib/web3/contracts";
import { ethers } from "ethers";

export default function UserManagement() {
  const [userId, setUserId] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchById = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      const speedTrack = await getSpeedTrackReadOnly();
      // Use the public idToUser mapping instead of getUserById function
      const address = await speedTrack.idToUser(parseInt(userId));
      
      if (address === ethers.ZeroAddress) {
        alert("User not found");
        return;
      }
      
      setUserAddress(address);
      await fetchUserInfo(address);
    } catch (error) {
      console.error("Error searching user:", error);
      alert("Error searching user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchByAddress = async () => {
    if (!userAddress || !ethers.isAddress(userAddress)) {
      alert("Invalid address");
      return;
    }
    
    await fetchUserInfo(userAddress);
  };

  const fetchUserInfo = async (address: string) => {
    try {
      setIsLoading(true);
      const speedTrack = await getSpeedTrackReadOnly();
      const info = await speedTrack.getUserInfo(address);
      
      setUserInfo({
        address,
        name: info.name,
        email: info.email,
        countryCode: info.countryCode,
        mobileNumber: info.mobileNumber,
        activationLevel: info.activationLevel.toString(),
        referrer: info.referrer,
        referrerType: info.referrerType,
        isRootLeader: info.isRootLeader,
        profileCompleted: info.profileCompleted,
        investedAmount: ethers.formatUnits(info.investedAmount, 6),
        capitalReturned: ethers.formatUnits(info.capitalReturned, 6),
        virtualROIBalance: ethers.formatUnits(info.virtualROIBalance, 6),
        rewardPoints: info.rewardPoints.toString(),
        uid: info.uid.toString()
      });
    } catch (error) {
      console.error("Error fetching user info:", error);
      alert("Error fetching user info");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700">
        <h3 className="font-semibold mb-4">Search User</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Search by User ID</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white"
                placeholder="Enter user ID"
              />
              <button
                onClick={handleSearchById}
                disabled={isLoading}
                className="px-4 py-2 bg-neon-blue rounded-xl hover:bg-neon-blue/80 disabled:opacity-50"
              >
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Search by Address</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white font-mono text-sm"
                placeholder="0x..."
              />
              <button
                onClick={handleSearchByAddress}
                disabled={isLoading}
                className="px-4 py-2 bg-neon-blue rounded-xl hover:bg-neon-blue/80 disabled:opacity-50"
              >
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {userInfo && (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700">
          <h3 className="font-semibold mb-4">User Information</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">User ID</span>
              <span className="text-white font-semibold">{userInfo.uid}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Address</span>
              <span className="text-white font-mono text-xs">{userInfo.address.slice(0, 10)}...{userInfo.address.slice(-8)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Name</span>
              <span className="text-white">{userInfo.name || "Not set"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Email</span>
              <span className="text-white">{userInfo.email || "Not set"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Mobile</span>
              <span className="text-white">{userInfo.countryCode} {userInfo.mobileNumber || "Not set"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Activation Level</span>
              <span className="text-white font-semibold">Level {userInfo.activationLevel}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Profile Completed</span>
              <span className={userInfo.profileCompleted ? "text-green-400" : "text-red-400"}>
                {userInfo.profileCompleted ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Invested Amount</span>
              <span className="text-white font-semibold">{parseFloat(userInfo.investedAmount).toFixed(2)} USDT</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Capital Returned</span>
              <span className="text-white font-semibold">{parseFloat(userInfo.capitalReturned).toFixed(2)} USDT</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Virtual ROI Balance</span>
              <span className="text-white font-semibold">{parseFloat(userInfo.virtualROIBalance).toFixed(2)} USDT</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Reward Points</span>
              <span className="text-white font-semibold">{userInfo.rewardPoints}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Is Root Leader</span>
              <span className={userInfo.isRootLeader ? "text-green-400" : "text-gray-400"}>
                {userInfo.isRootLeader ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-400">Referrer</span>
              <span className="text-white font-mono text-xs">
                {userInfo.referrer === ethers.ZeroAddress ? "None" : `${userInfo.referrer.slice(0, 6)}...${userInfo.referrer.slice(-4)}`}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
