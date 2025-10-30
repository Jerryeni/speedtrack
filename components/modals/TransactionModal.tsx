"use client";

interface TransactionModalProps {
  transactionId: string | null;
  onClose: () => void;
}

export default function TransactionModal({ transactionId, onClose }: TransactionModalProps) {
  if (!transactionId) return null;

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
            <h3 className="font-orbitron font-bold">Transaction Details</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
            >
              <i className="fas fa-times text-gray-300"></i>
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-neon-blue/20 flex items-center justify-center">
                <i className="fas fa-coins text-neon-blue"></i>
              </div>
              <div>
                <h4 className="font-semibold text-neon-blue">{transactionId}</h4>
                <p className="text-xs text-gray-400">Investment Transaction</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Amount</p>
                <p className="font-bold text-neon-blue">$1,250.00</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Status</p>
                <div className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full inline-block">
                  Completed
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Date</p>
                <p className="text-sm">Oct 24, 2024 14:32:15</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Gas Fee</p>
                <p className="text-sm">$2.50</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-2">Blockchain Hash</p>
              <div className="bg-gray-800 rounded-lg p-3 font-mono text-xs text-gray-300 break-all">
                0x1234567890abcdef1234567890abcdef12345678
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="flex-1 bg-neon-blue text-dark-primary py-2 rounded-xl font-medium text-sm hover:shadow-lg transition-all">
                View on Explorer
              </button>
              <button className="flex-1 bg-gray-700 text-white py-2 rounded-xl font-medium text-sm hover:bg-gray-600 transition-colors">
                Share Transaction
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
