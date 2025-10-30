"use client";

import { useState } from "react";
import { showToast } from "@/lib/toast";

interface PersonalInfoProps {
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
}

export default function PersonalInfo({ isEditMode, setIsEditMode }: PersonalInfoProps) {
  const [fullName, setFullName] = useState("Alex Johnson");
  const [phoneNumber, setPhoneNumber] = useState("+1 (555) 123-4567");
  const [emailAddress, setEmailAddress] = useState("alex.johnson@email.com");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    setTimeout(() => {
      setIsSaving(false);
      setIsEditMode(false);
      showToast("Profile updated successfully!");
    }, 1500);
  };

  return (
    <section className="px-4 mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="font-orbitron font-bold text-lg">Personal Information</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-custom"></div>
              <span className="text-xs text-green-400">Secure</span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
              <i className="fas fa-user text-neon-blue"></i>
              <span>Full Name</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={!isEditMode}
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-neon-blue focus:outline-none transition-all disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
              <i className="fas fa-phone text-green-400"></i>
              <span>Phone Number</span>
              <div className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full animate-[phoneGlow_4s_ease-in-out_infinite]">
                <i className="fas fa-check mr-1"></i>Verified
              </div>
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={!isEditMode}
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-green-400 focus:outline-none transition-all disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
              <i className="fas fa-envelope text-electric-purple"></i>
              <span>Email Address</span>
              <span className="text-xs text-gray-500">(Optional)</span>
            </label>
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              disabled={!isEditMode}
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-electric-purple focus:outline-none transition-all disabled:opacity-60"
            />
          </div>

          {isEditMode && (
            <div className="pt-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-neon-blue to-electric-purple text-dark-primary font-bold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
