interface ProcessingModalProps {
  isOpen: boolean;
}

export default function ProcessingModal({ isOpen }: ProcessingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 w-full max-w-sm">
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-neon-blue/20 flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-spinner animate-spin text-neon-blue text-2xl"></i>
          </div>
          <h3 className="font-orbitron font-bold text-xl mb-2">Processing Withdrawal</h3>
          <p className="text-gray-400 mb-6">
            Please wait while we process your transaction...
          </p>

          <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-gradient-to-r from-neon-blue to-electric-purple rounded-full animate-[withdrawalProgress_5s_ease-out]"></div>
            </div>
            <p className="text-sm text-gray-400">Estimated time: 2-5 minutes</p>
          </div>

          <p className="text-xs text-gray-500">Do not close this window</p>
        </div>
      </div>
    </div>
  );
}
