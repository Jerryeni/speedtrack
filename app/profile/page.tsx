"use client";

import { useState } from "react";
import ProfileHeader from "@/components/sections/profile/ProfileHeader";
import PersonalInfo from "@/components/sections/profile/PersonalInfo";
import WalletInfo from "@/components/sections/profile/WalletInfo";
import AccountPreferences from "@/components/sections/profile/AccountPreferences";
import AccountActions from "@/components/sections/profile/AccountActions";
import QRModal from "@/components/modals/QRModal";
import PasswordModal from "@/components/modals/PasswordModal";

export default function ProfilePage() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <main className="min-h-screen pb-20">
      <header className="relative z-50 px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => window.history.back()}
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center"
            >
              <i className="fas fa-arrow-left text-neon-blue"></i>
            </button>
            <div>
              <h1 className="text-xl font-orbitron font-bold text-neon-blue">Profile</h1>
              <p className="text-xs text-gray-400">Manage Your Account</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsEditMode(!isEditMode)}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isEditMode 
                  ? 'bg-red-500/20' 
                  : 'bg-electric-purple/20'
              }`}
            >
              <i className={`fas ${isEditMode ? 'fa-times text-red-400' : 'fa-edit text-electric-purple'} text-sm`}></i>
            </button>
            <button className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center">
              <i className="fas fa-cog text-neon-blue text-sm animate-rotate-glow"></i>
            </button>
          </div>
        </div>
      </header>

      <ProfileHeader />
      <PersonalInfo isEditMode={isEditMode} setIsEditMode={setIsEditMode} />
      <WalletInfo onShowQR={() => setShowQRModal(true)} />
      <AccountPreferences />
      <AccountActions />

      <QRModal 
        isOpen={showQRModal} 
        onClose={() => setShowQRModal(false)} 
      />
      <PasswordModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)} 
      />
    </main>
  );
}
