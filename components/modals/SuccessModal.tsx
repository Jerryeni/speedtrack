interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  txHash: string;
}

export default function SuccessModal({ isOpen, onClose, amount, txHash }: SuccessModalProps) {
  if (!isOpen) return null;

  const gasFee = 2.50;
  const commissions = amount * 0.18;
  const receiveAmount = amount - gasFee - commissions;

  const viewOnExplorer = () => {
    window.open(`https://bscscan.com/tx/${txHash}`, "_blank");
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
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                className="animate-[checkmarkDraw_0.8s_ease-out_forwards]"
                strokeDasharray="50"
                strokeDashoffset="50"
                d="M9 12l2 2 4-4"
              />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>

          <h3 className="font-orbitron font-bold text-xl text-green-400 mb-2">
            Withdrawal Successful!
          </h3>
          <p className="text-gray-400 mb-6">Your withdrawal has been processed successfully</p>

          <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
            <div className="text-lg font-orbitron font-bold text-green-400 mb-2">
              ${receiveAmount.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400 mb-3">Transaction Hash</div>
            <div className="font-orbitron text-xs text-neon-blue break-all animate-[hashReveal_1.5s_ease-out]">
              {txHash}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 text-white py-3 rounded-xl font-medium hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
            <button
              onClick={viewOnExplorer}
              className="flex-1 bg-gradient-to-r from-neon-blue to-electric-purple text-dark-primary font-bold py-3 rounded-xl hover:shadow-lg transition-all"
            >
              <i className="fas fa-external-link-alt mr-2"></i>
              View on BSCScan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
