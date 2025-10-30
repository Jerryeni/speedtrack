"use client";

import { useState } from "react";
import { showToast } from "@/lib/toast";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PasswordModal({ isOpen, onClose }: PasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!isOpen) return null;

  const handleUpdate = () => {
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match");
      return;
    }
    showToast("Password updated successfully!");
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="font-orbitron font-bold">Change Password</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
            >
              <i className="fas fa-times text-gray-300"></i>
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-electric-purple focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-2 block">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-electric-purple focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-2 block">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-electric-purple focus:outline-none"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 text-white py-3 rounded-xl font-medium hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="flex-1 bg-gradient-to-r from-electric-purple to-neon-blue text-dark-primary font-bold py-3 rounded-xl hover:shadow-lg transition-all"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
