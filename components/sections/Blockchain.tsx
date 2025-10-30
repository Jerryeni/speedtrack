import IconCircle from "@/components/ui/IconCircle";

export default function Blockchain() {
  return (
    <section className="px-4 mb-8">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-gray-700">
        <div className="text-center mb-6">
          <IconCircle size="lg" gradient="from-electric-purple to-neon-blue" className="mx-auto mb-4">
            <i className="fas fa-cube text-2xl text-electric-purple"></i>
          </IconCircle>
          <h2 className="text-2xl font-orbitron font-bold mb-3">Why Blockchain Transparency?</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4 bg-gray-800/50 rounded-xl p-4">
            <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center">
              <i className="fas fa-eye text-neon-blue"></i>
            </div>
            <div>
              <h3 className="font-semibold text-sm">100% Transparent</h3>
              <p className="text-xs text-gray-400">Every transaction is publicly verifiable on the blockchain</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-gray-800/50 rounded-xl p-4">
            <div className="w-10 h-10 rounded-full bg-electric-purple/20 flex items-center justify-center">
              <i className="fas fa-lock text-electric-purple"></i>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Immutable Smart Contracts</h3>
              <p className="text-xs text-gray-400">Code cannot be changed, ensuring permanent fairness</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-gray-800/50 rounded-xl p-4">
            <div className="w-10 h-10 rounded-full bg-green-400/20 flex items-center justify-center">
              <i className="fas fa-check-double text-green-400"></i>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Automated Execution</h3>
              <p className="text-xs text-gray-400">No human intervention, pure algorithmic fairness</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-neon-blue/10 to-electric-purple/10 rounded-xl border border-neon-blue/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Smart Contract Address</p>
              <p className="text-xs text-gray-400 font-mono">0x742d35Cc6123C38fd14dF1...</p>
            </div>
            <button className="px-3 py-1 bg-neon-blue/20 text-neon-blue rounded-lg text-xs">
              Verify
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
