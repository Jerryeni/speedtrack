interface WithdrawConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amount: number;
}

export default function WithdrawConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  amount,
}: WithdrawConfirmModalProps) {
  if (!isOpen) return null;

  const gasFee = 2.50;
  const commissions = amount * 0.18;
  const receiveAmount = amount - gasFee - commissions;

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
            <h3 className="font-orbitron font-bold text-lg">Confirm Withdrawal</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
            >
              <i className="fas fa-times text-gray-300"></i>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-3xl font-orbitron font-bold text-neon-blue mb-2">
              ${amount.toFixed(2)}
            </div>
            <p className="text-gray-400">Withdrawal Amount</p>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4 mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Withdrawal Amount</span>
              <span className="text-sm font-medium text-white">${amount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Network Fee</span>
              <span className="text-sm font-medium text-yellow-400">${gasFee.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Upline Commissions</span>
              <span className="text-sm font-medium text-electric-purple">
                ${commissions.toFixed(2)}
              </span>
            </div>
            <div className="border-t border-gray-600 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">You'll Receive</span>
                <span className="text-lg font-orbitron font-bold text-green-400">
                  ${receiveAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <i className="fas fa-exclamation-triangle text-yellow-400"></i>
              <span className="text-sm font-medium text-yellow-400">Important Notice</span>
            </div>
            <p className="text-xs text-gray-300">
              Gas fees are estimated and may vary. The actual fee will be deducted from your
              withdrawal amount. Transaction cannot be reversed once confirmed.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 text-white py-3 rounded-xl font-medium hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-gradient-to-r from-neon-blue to-electric-purple text-dark-primary font-bold py-3 rounded-xl animate-[withdrawReady_2s_ease-in-out_infinite] hover:shadow-lg transition-all"
            >
              <i className="fas fa-rocket mr-2"></i>
              Confirm Withdrawal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
