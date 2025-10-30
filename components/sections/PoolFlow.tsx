export default function PoolFlow() {
  return (
    <section className="px-4 mb-8">
      <div className="bg-gradient-to-b from-gray-900/50 to-gray-800/50 rounded-3xl p-6 border border-gray-700">
        <h3 className="text-center text-lg font-orbitron font-bold mb-6">
          2X Pool Flow Visualization
        </h3>

        <div className="relative">
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-800/50 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center">
                  <i className="fas fa-user text-neon-blue"></i>
                </div>
                <div>
                  <p className="font-semibold text-sm">Your Investment</p>
                  <p className="text-xs text-gray-400">Entry Level</p>
                </div>
              </div>
              <div className="text-neon-blue font-orbitron font-bold">$100</div>
            </div>

            <div className="flex justify-center">
              <div className="w-1 h-8 bg-gradient-to-b from-neon-blue to-electric-purple animate-flow-up"></div>
            </div>

            <div className="flex items-center justify-between bg-gray-800/50 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-electric-purple/20 flex items-center justify-center">
                  <i className="fas fa-layer-group text-electric-purple"></i>
                </div>
                <div>
                  <p className="font-semibold text-sm">Pool Processing</p>
                  <p className="text-xs text-gray-400">Smart Contract</p>
                </div>
              </div>
              <div className="text-electric-purple font-orbitron font-bold">2X</div>
            </div>

            <div className="flex justify-center">
              <div className="w-1 h-8 bg-gradient-to-b from-electric-purple to-green-400 animate-flow-up"></div>
            </div>

            <div className="flex items-center justify-between bg-gray-800/50 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-400/20 flex items-center justify-center">
                  <i className="fas fa-coins text-green-400"></i>
                </div>
                <div>
                  <p className="font-semibold text-sm">Your Reward</p>
                  <p className="text-xs text-gray-400">Instant Payout</p>
                </div>
              </div>
              <div className="text-green-400 font-orbitron font-bold">$200</div>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-neon-blue/30 animate-floating"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 rounded-full bg-electric-purple/30 animate-floating" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </section>
  );
}
