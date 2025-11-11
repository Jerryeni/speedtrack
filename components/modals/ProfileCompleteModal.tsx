"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { completeProfile } from "@/lib/web3/activation";
import { showToast } from "@/lib/toast";

interface ProfileCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProfileCompleteModal({ isOpen, onClose, onSuccess }: ProfileCompleteModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+1",
    mobileNumber: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || formData.name.trim().length < 2) {
      showToast("Please enter a valid name", 'error');
      return;
    }

    if (!formData.email || !formData.email.includes('@')) {
      showToast("Please enter a valid email", 'error');
      return;
    }

    if (!formData.mobileNumber || formData.mobileNumber.trim().length < 10) {
      showToast("Please enter a valid mobile number", 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      showToast("Completing profile...", 'info');
      
      const tx = await completeProfile(formData);
      showToast("Transaction submitted! Waiting for confirmation...", 'info');
      
      await tx.wait();
      
      showToast("Profile completed successfully! 🎉", 'success');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Profile completion error:', error);
      showToast(error.message || "Failed to complete profile", 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
            <i className="fas fa-user-edit text-2xl text-white"></i>
          </div>
          <h2 className="text-2xl font-orbitron font-bold text-green-400 mb-2">
            Complete Your Profile
          </h2>
          <p className="text-sm text-gray-400">
            Add your personal information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue"
              placeholder="Enter your full name"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue"
              placeholder="your@email.com"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Code
              </label>
              <input
                type="text"
                value={formData.countryCode}
                onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-neon-blue"
                placeholder="+1"
                disabled={isSubmitting}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue"
                placeholder="1234567890"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-gray-700 hover:bg-gray-600"
            >
              Skip
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-check mr-2"></i>
                  Complete Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
