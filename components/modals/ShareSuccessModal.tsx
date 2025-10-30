interface ShareSuccessModalProps {
  isOpen: boolean;
  platform: string;
  onClose: () => void;
}

export default function ShareSuccessModal({ isOpen, platform, onClose }: ShareSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 w-full max-w-sm animate-[shareSuccess_1s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check text-green-400 text-2xl"></i>
          </div>
          <h3 className="font-orbitron font-bold text-xl text-green-400 mb-2">
            {platform ? `Shared on ${platform}!` : "Shared Successfully!"}
          </h3>
          <p className="text-gray-400 mb-6">
            {platform
              ? `Your referral link has been shared on ${platform}`
              : "Your referral link has been shared"}
          </p>
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-neon-blue to-electric-purple text-dark-primary font-bold py-3 rounded-xl hover:shadow-lg transition-all"
          >
            Continue Sharing
          </button>
        </div>
      </div>
    </div>
  );
}
