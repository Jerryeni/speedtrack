export default function GasFeeInfo() {
  return (
    <section className="px-4 mb-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl border border-yellow-500/30 p-4 animate-[warningPulse_2s_ease-in-out_infinite]">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-1">
            <i className="fas fa-gas-pump text-yellow-400"></i>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-yellow-400 mb-2">Network Fee Notice</h4>
            <p className="text-sm text-gray-300 mb-3">
              Gas fees are automatically calculated based on current network conditions. Fees are
              deducted from your withdrawal amount.
            </p>
            <div className="bg-gray-800/50 rounded-xl p-3 animate-[feeCalculate_3s_ease-in-out_infinite]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Estimated Gas Fee</span>
                <span className="text-yellow-400 font-medium">~$2.50</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-400">Network</span>
                <span className="text-green-400 font-medium">BSC (Fast)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
