interface WalletConnectSuccessModalProps {
  isOpen: boolean;
  walletAddress: string;
  walletName: string;
  onProceed: () => void;
}

export default function WalletConnectSuccessModal({
  isOpen,
  walletAddress,
  walletName,
  onProceed,
}: WalletConnectSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 w-full max-w-md">
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>

          <h3 className="font-orbitron font-bold text-xl text-green-400 mb-2">
            Wallet Connected!
          </h3>
          <p className="text-gray-400 mb-6">
            Your {walletName} wallet has been connected successfully
          </p>

          <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
            <div className="text-xs text-gray-400 mb-2">Connected Address</div>
            <div className="font-orbitron text-sm text-neon-blue break-all">
              {walletAddress}
            </div>
          </div>

          <button
            onClick={onProceed}
            className="w-full bg-gradient-to-r from-neon-blue to-electric-purple text-dark-primary font-bold py-3 rounded-xl hover:shadow-lg transition-all"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
