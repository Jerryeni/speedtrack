export default function BonusHighlights() {
  return (
    <section className="px-4 mb-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="bg-gradient-to-r from-neon-blue/10 to-electric-purple/10 rounded-2xl border border-neon-blue/30 p-6 animate-[bonusHighlight_2s_ease-in-out_infinite]">
        <div className="text-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-blue to-electric-purple flex items-center justify-center mx-auto mb-3">
            <i className="fas fa-gift text-2xl text-dark-primary"></i>
          </div>
          <h3 className="font-orbitron font-bold text-xl mb-2">Referral Rewards</h3>
          <p className="text-gray-300 text-sm">Earn up to 18% from every referral's activity</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-800/50 rounded-xl p-3 text-center">
            <div className="text-lg font-orbitron font-bold text-neon-blue">10%</div>
            <p className="text-xs text-gray-400">Level 1</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3 text-center">
            <div className="text-lg font-orbitron font-bold text-electric-purple">5%</div>
            <p className="text-xs text-gray-400">Level 2</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3 text-center">
            <div className="text-lg font-orbitron font-bold text-green-400">3%</div>
            <p className="text-xs text-gray-400">Level 3</p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">Lifetime commissions on all referral activities</p>
        </div>
      </div>
    </section>
  );
}
